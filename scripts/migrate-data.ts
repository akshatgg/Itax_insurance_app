import * as admin from "firebase-admin"
import * as fs from "fs"
import * as path from "path"
import { Command } from "commander"
import * as inquirer from "inquirer"
import * as ora from "ora"
import chalk from "chalk"
import { v4 as uuidv4 } from "uuid"

// Define environment types
type Environment = "development" | "staging" | "production" | "custom"

// Define migration options
interface MigrationOptions {
  sourceEnv: Environment
  targetEnv: Environment
  collections?: string[]
  query?: string
  dryRun: boolean
  batchSize: number
  includeUsers: boolean
  transformData: boolean
  backupBeforeMigration: boolean
  customSourceCredentials?: string
  customTargetCredentials?: string
}

// Define service account structure
interface ServiceAccount {
  type: string
  project_id: string
  private_key_id: string
  private_key: string
  client_email: string
  client_id: string
  auth_uri: string
  token_uri: string
  auth_provider_x509_cert_url: string
  client_x509_cert_url: string
}

// Define collection stats
interface CollectionStats {
  name: string
  documentCount: number
  size: number
}

// Define migration stats
interface MigrationStats {
  startTime: Date
  endTime?: Date
  totalDocuments: number
  migratedDocuments: number
  failedDocuments: number
  collections: CollectionStats[]
}

// Initialize migration stats
const migrationStats: MigrationStats = {
  startTime: new Date(),
  totalDocuments: 0,
  migratedDocuments: 0,
  failedDocuments: 0,
  collections: [],
}

// Define Firebase apps
const firebaseApps: Record<string, admin.app.App> = {}

/**
 * Initialize Firebase app for a specific environment
 */
function initializeFirebaseApp(env: Environment, customCredentials?: string): admin.app.App {
  // Check if app is already initialized
  const appName = env === "custom" ? `custom-${uuidv4().substring(0, 8)}` : env
  if (firebaseApps[appName]) {
    return firebaseApps[appName]
  }

  let serviceAccount: ServiceAccount

  if (env === "custom" && customCredentials) {
    try {
      serviceAccount = JSON.parse(fs.readFileSync(customCredentials, "utf8"))
    } catch (error) {
      console.error(chalk.red(`Error loading custom credentials: ${error.message}`))
      process.exit(1)
    }
  } else {
    const credentialsPath = path.join(__dirname, "..", "credentials", `${env}-service-account.json`)
    try {
      serviceAccount = JSON.parse(fs.readFileSync(credentialsPath, "utf8"))
    } catch (error) {
      console.error(chalk.red(`Error loading ${env} credentials: ${error.message}`))
      console.error(chalk.yellow(`Make sure you have a service account JSON file at: ${credentialsPath}`))
      process.exit(1)
    }
  }

  try {
    const app = admin.initializeApp(
      {
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
        databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`,
        storageBucket: `${serviceAccount.project_id}.appspot.com`,
      },
      appName,
    )

    firebaseApps[appName] = app
    return app
  } catch (error) {
    console.error(chalk.red(`Error initializing Firebase app for ${env}: ${error.message}`))
    process.exit(1)
  }
}

/**
 * Get Firestore instance for a specific environment
 */
function getFirestore(env: Environment, customCredentials?: string): admin.firestore.Firestore {
  const app = initializeFirebaseApp(env, customCredentials)
  return app.firestore()
}

/**
 * Create a backup of the target environment before migration
 */
async function createBackup(options: MigrationOptions): Promise<string> {
  const spinner = ora("Creating backup of target environment...").start()

  try {
    const targetDb = getFirestore(
      options.targetEnv,
      options.targetEnv === "custom" ? options.customTargetCredentials : undefined,
    )

    const backupDir = path.join(
      __dirname,
      "..",
      "backups",
      `${options.targetEnv}-${new Date().toISOString().replace(/:/g, "-")}`,
    )
    fs.mkdirSync(backupDir, { recursive: true })

    const collections = options.collections || (await getCollectionsList(targetDb))

    for (const collectionName of collections) {
      const collectionRef = targetDb.collection(collectionName)
      const snapshot = await collectionRef.get()

      if (!snapshot.empty) {
        const collectionData = snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))

        fs.writeFileSync(path.join(backupDir, `${collectionName}.json`), JSON.stringify(collectionData, null, 2))
      }
    }

    spinner.succeed(`Backup created at ${backupDir}`)
    return backupDir
  } catch (error) {
    spinner.fail(`Backup failed: ${error.message}`)
    throw error
  }
}

/**
 * Get list of all collections in a Firestore database
 */
async function getCollectionsList(db: admin.firestore.Firestore): Promise<string[]> {
  const collections = await db.listCollections()
  return collections.map((collection) => collection.id)
}

/**
 * Get collection statistics
 */
async function getCollectionStats(db: admin.firestore.Firestore, collectionName: string): Promise<CollectionStats> {
  const snapshot = await db.collection(collectionName).get()

  let size = 0
  snapshot.docs.forEach((doc) => {
    // Rough estimate of document size in bytes
    size += JSON.stringify(doc.data()).length
  })

  return {
    name: collectionName,
    documentCount: snapshot.size,
    size,
  }
}

/**
 * Transform data based on environment
 * This function can be customized based on specific transformation needs
 */
function transformData(data: any, sourceEnv: Environment, targetEnv: Environment): any {
  // Deep clone the data to avoid modifying the original
  const transformedData = JSON.parse(JSON.stringify(data))

  // Example transformations:

  // 1. Change environment-specific URLs
  if (sourceEnv !== targetEnv) {
    // Replace storage URLs
    const replaceStorageUrls = (obj: any) => {
      if (!obj) return

      if (typeof obj === "string" && obj.includes("firebasestorage.googleapis.com")) {
        return obj.replace(new RegExp(`${sourceEnv}-ecosure\\.appspot\\.com`, "g"), `${targetEnv}-ecosure.appspot.com`)
      }

      if (typeof obj === "object") {
        for (const key in obj) {
          if (typeof obj[key] === "string") {
            obj[key] = replaceStorageUrls(obj[key])
          } else if (typeof obj[key] === "object") {
            replaceStorageUrls(obj[key])
          }
        }
      }

      return obj
    }

    replaceStorageUrls(transformedData)
  }

  // 2. Sanitize sensitive data when migrating to non-production environments
  if (targetEnv !== "production") {
    const sanitizeSensitiveData = (obj: any) => {
      if (!obj) return

      // Mask PAN numbers
      if (obj.panNumber && typeof obj.panNumber === "string") {
        obj.panNumber = "XXXXX1234X"
      }

      // Mask Aadhaar numbers
      if (obj.aadhaarNumber && typeof obj.aadhaarNumber === "string") {
        obj.aadhaarNumber = "XXXX-XXXX-1234"
      }

      // Mask phone numbers
      if (obj.phoneNumber && typeof obj.phoneNumber === "string") {
        obj.phoneNumber = obj.phoneNumber.substring(0, 4) + "XXXXXX"
      }

      // Recursively process nested objects
      if (typeof obj === "object") {
        for (const key in obj) {
          if (typeof obj[key] === "object") {
            sanitizeSensitiveData(obj[key])
          }
        }
      }
    }

    sanitizeSensitiveData(transformedData)
  }

  return transformedData
}

/**
 * Migrate data between environments
 */
async function migrateData(options: MigrationOptions): Promise<void> {
  console.log(chalk.blue("Starting migration with the following options:"))
  console.log(chalk.blue("-------------------------------------------"))
  console.log(chalk.blue(`Source environment: ${options.sourceEnv}`))
  console.log(chalk.blue(`Target environment: ${options.targetEnv}`))
  console.log(chalk.blue(`Collections: ${options.collections?.join(", ") || "All"}`))
  console.log(chalk.blue(`Dry run: ${options.dryRun}`))
  console.log(chalk.blue(`Batch size: ${options.batchSize}`))
  console.log(chalk.blue(`Include users: ${options.includeUsers}`))
  console.log(chalk.blue(`Transform data: ${options.transformData}`))
  console.log(chalk.blue(`Backup before migration: ${options.backupBeforeMigration}`))
  console.log(chalk.blue("-------------------------------------------"))

  // Create backup if requested
  if (options.backupBeforeMigration) {
    try {
      await createBackup(options)
    } catch (error) {
      console.error(chalk.red("Failed to create backup. Aborting migration."))
      process.exit(1)
    }
  }

  // Initialize Firebase apps
  const sourceDb = getFirestore(
    options.sourceEnv,
    options.sourceEnv === "custom" ? options.customSourceCredentials : undefined,
  )

  const targetDb = getFirestore(
    options.targetEnv,
    options.targetEnv === "custom" ? options.customTargetCredentials : undefined,
  )

  // Get collections to migrate
  let collections = options.collections
  if (!collections || collections.length === 0) {
    const spinner = ora("Fetching collections...").start()
    collections = await getCollectionsList(sourceDb)
    spinner.succeed(`Found ${collections.length} collections`)
  }

  // Filter out 'users' collection if not explicitly included
  if (!options.includeUsers && !options.collections?.includes("users")) {
    collections = collections.filter((collection) => collection !== "users")
  }

  // Migrate each collection
  for (const collectionName of collections) {
    const collectionSpinner = ora(`Migrating collection: ${collectionName}`).start()

    try {
      // Get collection stats
      const stats = await getCollectionStats(sourceDb, collectionName)
      migrationStats.collections.push(stats)
      migrationStats.totalDocuments += stats.documentCount

      collectionSpinner.text = `Migrating collection: ${collectionName} (${stats.documentCount} documents)`

      // Get source documents
      const sourceCollection = sourceDb.collection(collectionName)
      let query: admin.firestore.Query = sourceCollection

      // Apply custom query if provided
      if (options.query) {
        // This is a simplified query parser - in a real implementation, you'd want a more robust solution
        const [field, operator, value] = options.query.split(" ")
        query = sourceCollection.where(field, operator as admin.firestore.WhereFilterOp, value)
      }

      const sourceSnapshot = await query.get()

      if (sourceSnapshot.empty) {
        collectionSpinner.info(`Collection ${collectionName} is empty. Skipping.`)
        continue
      }

      // Process documents in batches
      const batches: admin.firestore.WriteBatch[] = []
      let currentBatch = targetDb.batch()
      let operationsInCurrentBatch = 0

      for (const doc of sourceSnapshot.docs) {
        let data = doc.data()

        // Transform data if requested
        if (options.transformData) {
          data = transformData(data, options.sourceEnv, options.targetEnv)
        }

        // Add document to batch
        const targetDocRef = targetDb.collection(collectionName).doc(doc.id)
        currentBatch.set(targetDocRef, data)
        operationsInCurrentBatch++

        // If batch is full, create a new one
        if (operationsInCurrentBatch >= options.batchSize) {
          batches.push(currentBatch)
          currentBatch = targetDb.batch()
          operationsInCurrentBatch = 0
        }
      }

      // Add the last batch if it has operations
      if (operationsInCurrentBatch > 0) {
        batches.push(currentBatch)
      }

      // Commit batches if not a dry run
      if (!options.dryRun) {
        for (let i = 0; i < batches.length; i++) {
          collectionSpinner.text = `Migrating collection: ${collectionName} - Batch ${i + 1}/${batches.length}`
          await batches[i].commit()
        }

        migrationStats.migratedDocuments += sourceSnapshot.size
        collectionSpinner.succeed(`Migrated collection: ${collectionName} (${sourceSnapshot.size} documents)`)
      } else {
        migrationStats.migratedDocuments += sourceSnapshot.size
        collectionSpinner.succeed(`Dry run: Would migrate ${sourceSnapshot.size} documents from ${collectionName}`)
      }
    } catch (error) {
      collectionSpinner.fail(`Failed to migrate collection: ${collectionName} - ${error.message}`)
      migrationStats.failedDocuments +=
        migrationStats.collections.find((c) => c.name === collectionName)?.documentCount || 0
    }
  }

  // Print migration summary
  migrationStats.endTime = new Date()
  const duration = (migrationStats.endTime.getTime() - migrationStats.startTime.getTime()) / 1000

  console.log(chalk.green("\nMigration Summary:"))
  console.log(chalk.green("-------------------------------------------"))
  console.log(chalk.green(`Start time: ${migrationStats.startTime.toISOString()}`))
  console.log(chalk.green(`End time: ${migrationStats.endTime.toISOString()}`))
  console.log(chalk.green(`Duration: ${duration.toFixed(2)} seconds`))
  console.log(chalk.green(`Total documents: ${migrationStats.totalDocuments}`))
  console.log(chalk.green(`Migrated documents: ${migrationStats.migratedDocuments}`))
  console.log(chalk.red(`Failed documents: ${migrationStats.failedDocuments}`))
  console.log(chalk.green("-------------------------------------------"))

  // Write migration log
  const logDir = path.join(__dirname, "..", "logs")
  fs.mkdirSync(logDir, { recursive: true })

  const logPath = path.join(
    logDir,
    `migration-${options.sourceEnv}-to-${options.targetEnv}-${new Date().toISOString().replace(/:/g, "-")}.json`,
  )

  fs.writeFileSync(logPath, JSON.stringify(migrationStats, null, 2))
  console.log(chalk.blue(`Migration log written to: ${logPath}`))
}

/**
 * Main function to run the migration
 */
async function main() {
  // Set up command line interface
  const program = new Command()

  program.name("migrate-data").description("Migrate data between Firebase environments").version("1.0.0")

  program
    .option("-s, --source <env>", "Source environment (development, staging, production, custom)", "development")
    .option("-t, --target <env>", "Target environment (development, staging, production, custom)", "staging")
    .option("-c, --collections <collections>", "Comma-separated list of collections to migrate")
    .option("-q, --query <query>", 'Query to filter documents (e.g., "status == pending")')
    .option("-d, --dry-run", "Perform a dry run without writing data", false)
    .option("-b, --batch-size <size>", "Batch size for writes", "500")
    .option("-u, --include-users", "Include users collection in migration", false)
    .option("-t, --transform-data", "Transform data during migration", true)
    .option("-b, --backup", "Create backup before migration", true)
    .option("--source-credentials <path>", "Path to custom source credentials JSON file")
    .option("--target-credentials <path>", "Path to custom target credentials JSON file")
    .option("-i, --interactive", "Run in interactive mode", false)

  program.parse(process.argv)

  let options: MigrationOptions

  if (program.opts().interactive) {
    // Interactive mode
    const answers = await inquirer.prompt([
      {
        type: "list",
        name: "sourceEnv",
        message: "Select source environment:",
        choices: ["development", "staging", "production", "custom"],
      },
      {
        type: "input",
        name: "customSourceCredentials",
        message: "Path to custom source credentials JSON file:",
        when: (answers) => answers.sourceEnv === "custom",
        validate: (input) => (fs.existsSync(input) ? true : "File does not exist"),
      },
      {
        type: "list",
        name: "targetEnv",
        message: "Select target environment:",
        choices: ["development", "staging", "production", "custom"],
      },
      {
        type: "input",
        name: "customTargetCredentials",
        message: "Path to custom target credentials JSON file:",
        when: (answers) => answers.targetEnv === "custom",
        validate: (input) => (fs.existsSync(input) ? true : "File does not exist"),
      },
      {
        type: "input",
        name: "collections",
        message: "Collections to migrate (comma-separated, leave empty for all):",
        filter: (input) => (input ? input.split(",").map((c) => c.trim()) : undefined),
      },
      {
        type: "input",
        name: "query",
        message: 'Query to filter documents (e.g., "status == pending", leave empty for all):',
      },
      {
        type: "confirm",
        name: "dryRun",
        message: "Perform a dry run without writing data?",
        default: false,
      },
      {
        type: "number",
        name: "batchSize",
        message: "Batch size for writes:",
        default: 500,
        validate: (input) => (input > 0 ? true : "Batch size must be greater than 0"),
      },
      {
        type: "confirm",
        name: "includeUsers",
        message: "Include users collection in migration?",
        default: false,
      },
      {
        type: "confirm",
        name: "transformData",
        message: "Transform data during migration?",
        default: true,
      },
      {
        type: "confirm",
        name: "backupBeforeMigration",
        message: "Create backup before migration?",
        default: true,
      },
    ])

    options = {
      sourceEnv: answers.sourceEnv as Environment,
      targetEnv: answers.targetEnv as Environment,
      collections: answers.collections,
      query: answers.query || undefined,
      dryRun: answers.dryRun,
      batchSize: answers.batchSize,
      includeUsers: answers.includeUsers,
      transformData: answers.transformData,
      backupBeforeMigration: answers.backupBeforeMigration,
      customSourceCredentials: answers.customSourceCredentials,
      customTargetCredentials: answers.customTargetCredentials,
    }
  } else {
    // Command line mode
    const opts = program.opts()

    options = {
      sourceEnv: opts.source as Environment,
      targetEnv: opts.target as Environment,
      collections: opts.collections?.split(",").map((c) => c.trim()),
      query: opts.query,
      dryRun: opts.dryRun,
      batchSize: Number.parseInt(opts.batchSize, 10),
      includeUsers: opts.includeUsers,
      transformData: opts.transformData,
      backupBeforeMigration: opts.backup,
      customSourceCredentials: opts.sourceCredentials,
      customTargetCredentials: opts.targetCredentials,
    }
  }

  // Validate options
  if (options.sourceEnv === options.targetEnv && options.sourceEnv !== "custom") {
    console.error(chalk.red("Source and target environments cannot be the same."))
    process.exit(1)
  }

  if (options.sourceEnv === "custom" && !options.customSourceCredentials) {
    console.error(chalk.red("Custom source credentials are required when source environment is custom."))
    process.exit(1)
  }

  if (options.targetEnv === "custom" && !options.customTargetCredentials) {
    console.error(chalk.red("Custom target credentials are required when target environment is custom."))
    process.exit(1)
  }

  // Run migration
  try {
    await migrateData(options)
  } catch (error) {
    console.error(chalk.red(`Migration failed: ${error.message}`))
    process.exit(1)
  }
}

// Run the script
main().catch((error) => {
  console.error(chalk.red(`Unhandled error: ${error.message}`))
  process.exit(1)
})
