#!/usr/bin/env node

/**
 * This script restores a backup created by the migration script
 */

const fs = require("fs")
const path = require("path")
const inquirer = require("inquirer")
const chalk = require("chalk")
const admin = require("firebase-admin")
const ora = require("ora")

async function main() {
  console.log(chalk.blue("Firebase Backup Restore Tool"))
  console.log(chalk.blue("---------------------------"))
  console.log(chalk.yellow("This script will restore a backup created by the migration script."))
  console.log("")

  // Get list of available backups
  const backupsDir = path.join(__dirname, "..", "backups")
  if (!fs.existsSync(backupsDir)) {
    console.error(chalk.red("No backups directory found."))
    process.exit(1)
  }

  const backups = fs.readdirSync(backupsDir).filter((dir) => fs.statSync(path.join(backupsDir, dir)).isDirectory())

  if (backups.length === 0) {
    console.error(chalk.red("No backups found."))
    process.exit(1)
  }

  // Sort backups by date (newest first)
  backups.sort((a, b) => {
    const aTime = fs.statSync(path.join(backupsDir, a)).mtime.getTime()
    const bTime = fs.statSync(path.join(backupsDir, b)).mtime.getTime()
    return bTime - aTime
  })

  const { backupDir } = await inquirer.prompt([
    {
      type: "list",
      name: "backupDir",
      message: "Select a backup to restore:",
      choices: backups,
    },
  ])

  const fullBackupPath = path.join(backupsDir, backupDir)
  const backupFiles = fs.readdirSync(fullBackupPath).filter((file) => file.endsWith(".json"))

  if (backupFiles.length === 0) {
    console.error(chalk.red("No backup files found in the selected directory."))
    process.exit(1)
  }

  const { selectedCollections } = await inquirer.prompt([
    {
      type: "checkbox",
      name: "selectedCollections",
      message: "Select collections to restore:",
      choices: backupFiles.map((file) => ({
        name: file.replace(".json", ""),
        value: file,
      })),
      validate: (input) => (input.length > 0 ? true : "Select at least one collection"),
    },
  ])

  const { environment } = await inquirer.prompt([
    {
      type: "list",
      name: "environment",
      message: "Select the target environment:",
      choices: ["development", "staging", "production", "custom"],
    },
  ])

  let serviceAccountPath

  if (environment === "custom") {
    const { customPath } = await inquirer.prompt([
      {
        type: "input",
        name: "customPath",
        message: "Enter the path to the custom service account JSON file:",
        validate: (input) => (fs.existsSync(input) ? true : "File does not exist"),
      },
    ])
    serviceAccountPath = customPath
  } else {
    const defaultPath = path.join(__dirname, "..", "credentials", `${environment}-service-account.json`)
    if (!fs.existsSync(defaultPath)) {
      const { customPath } = await inquirer.prompt([
        {
          type: "input",
          name: "customPath",
          message: `Service account for ${environment} not found. Enter the path to the service account JSON file:`,
          validate: (input) => (fs.existsSync(input) ? true : "File does not exist"),
        },
      ])
      serviceAccountPath = customPath
    } else {
      serviceAccountPath = defaultPath
    }
  }

  const { confirmRestore } = await inquirer.prompt([
    {
      type: "confirm",
      name: "confirmRestore",
      message: chalk.red(
        `Are you sure you want to restore these collections to the ${environment} environment? This may overwrite existing data.`,
      ),
      default: false,
    },
  ])

  if (!confirmRestore) {
    console.log(chalk.yellow("Restore cancelled."))
    process.exit(0)
  }

  // Initialize Firebase
  const serviceAccount = require(serviceAccountPath)

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`,
  })

  const db = admin.firestore()

  // Restore each selected collection
  for (const collectionFile of selectedCollections) {
    const collectionName = collectionFile.replace(".json", "")
    const spinner = ora(`Restoring collection: ${collectionName}`).start()

    try {
      const backupData = JSON.parse(fs.readFileSync(path.join(fullBackupPath, collectionFile), "utf8"))

      if (backupData.length === 0) {
        spinner.info(`Collection ${collectionName} is empty. Skipping.`)
        continue
      }

      // Process documents in batches
      const batchSize = 500
      const batches = []
      let currentBatch = db.batch()
      let operationsInCurrentBatch = 0

      for (const doc of backupData) {
        const docRef = db.collection(collectionName).doc(doc.id)
        currentBatch.set(docRef, doc.data)
        operationsInCurrentBatch++

        if (operationsInCurrentBatch >= batchSize) {
          batches.push(currentBatch)
          currentBatch = db.batch()
          operationsInCurrentBatch = 0
        }
      }

      if (operationsInCurrentBatch > 0) {
        batches.push(currentBatch)
      }

      // Commit batches
      for (let i = 0; i < batches.length; i++) {
        spinner.text = `Restoring collection: ${collectionName} - Batch ${i + 1}/${batches.length}`
        await batches[i].commit()
      }

      spinner.succeed(`Restored collection: ${collectionName} (${backupData.length} documents)`)
    } catch (error) {
      spinner.fail(`Failed to restore collection: ${collectionName} - ${error.message}`)
    }
  }

  console.log(chalk.green("\nRestore completed!"))
}

main().catch((error) => {
  console.error(chalk.red(`Error: ${error.message}`))
  process.exit(1)
})
