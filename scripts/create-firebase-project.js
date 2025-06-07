const { execSync } = require("child_process")
const readline = require("readline")
const fs = require("fs")
const path = require("path")

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

console.log("🔥 Firebase Project Creation Script 🔥")
console.log("This script will help you create a new Firebase project for EcoSure Insurance App")
console.log("----------------------------------------------------------------------")

// Check if Firebase CLI is installed
try {
  execSync("firebase --version", { stdio: "ignore" })
  console.log("✅ Firebase CLI is already installed")
} catch (error) {
  console.log("📦 Installing Firebase CLI...")
  execSync("npm install -g firebase-tools", { stdio: "inherit" })
}

// Login to Firebase
console.log("🔑 Logging in to Firebase...")
try {
  execSync("firebase login", { stdio: "inherit" })
} catch (error) {
  console.error("❌ Failed to login to Firebase:", error.message)
  process.exit(1)
}

// Ask for project name
rl.question("Enter your Firebase project name (e.g., ecosure-insurance-app): ", (projectName) => {
  // Create new Firebase project
  console.log(`🚀 Creating new Firebase project: ${projectName}...`)
  try {
    execSync(`firebase projects:create ${projectName} --display-name "EcoSure Insurance App"`, { stdio: "inherit" })
  } catch (error) {
    console.error("❌ Failed to create Firebase project:", error.message)
    console.log("⚠️ If the project already exists, you can use it instead.")

    rl.question("Do you want to use an existing project instead? (y/n): ", (answer) => {
      if (answer.toLowerCase() !== "y") {
        rl.close()
        process.exit(1)
      }

      // List existing projects
      console.log("📋 Listing your Firebase projects...")
      execSync("firebase projects:list", { stdio: "inherit" })

      rl.question("Enter the project ID you want to use: ", (existingProjectId) => {
        projectName = existingProjectId
        continueSetup(projectName, rl)
      })
    })
    return
  }

  continueSetup(projectName, rl)
})

function continueSetup(projectName, rl) {
  // Set the current project
  console.log(`🔧 Setting ${projectName} as the current Firebase project...`)
  execSync(`firebase use ${projectName}`, { stdio: "inherit" })

  // Enable required services
  console.log("🔌 Enabling required Firebase services...")

  try {
    console.log("📱 Enabling Firebase Authentication...")
    execSync("firebase --project=" + projectName + " auth:enable", { stdio: "inherit" })

    console.log("💾 Enabling Firestore...")
    execSync("firebase --project=" + projectName + " firestore:enable", { stdio: "inherit" })

    console.log("🗄️ Enabling Storage...")
    execSync("firebase --project=" + projectName + " storage:enable", { stdio: "inherit" })

    console.log("⚡ Enabling Functions...")
    execSync("firebase --project=" + projectName + " functions:enable", { stdio: "inherit" })
  } catch (error) {
    console.error("❌ Error enabling Firebase services:", error.message)
    console.log("⚠️ You may need to enable these services manually in the Firebase console.")
  }

  // Create a firebase.json configuration file
  console.log("📝 Creating Firebase configuration files...")

  const firebaseConfig = {
    firestore: {
      rules: "firebase/firestore.rules",
      indexes: "firebase/firestore.indexes.json",
    },
    functions: {
      source: "firebase/functions",
    },
    storage: {
      rules: "firebase/storage.rules",
    },
    emulators: {
      auth: {
        port: 9099,
      },
      functions: {
        port: 5001,
      },
      firestore: {
        port: 8080,
      },
      storage: {
        port: 9199,
      },
      ui: {
        enabled: true,
      },
    },
  }

  fs.writeFileSync("firebase.json", JSON.stringify(firebaseConfig, null, 2))

  // Create .firebaserc file
  const firebaserc = {
    projects: {
      default: projectName,
    },
  }

  fs.writeFileSync(".firebaserc", JSON.stringify(firebaserc, null, 2))

  // Create Firestore indexes file
  const firestoreIndexes = {
    indexes: [],
    fieldOverrides: [],
  }

  // Ensure the firebase directory exists
  if (!fs.existsSync("firebase")) {
    fs.mkdirSync("firebase")
  }

  fs.writeFileSync("firebase/firestore.indexes.json", JSON.stringify(firestoreIndexes, null, 2))

  console.log("✅ Firebase project setup completed successfully!")
  console.log("")
  console.log("Next steps:")
  console.log('1. Run "npm run setup-database" to set up the Firestore database')
  console.log('2. Run "npm run deploy-indexes" to deploy Firestore indexes')
  console.log('3. Run "npm run deploy-functions" to deploy Firebase Functions')
  console.log("")
  console.log("You can also run Firebase emulators for local development:")
  console.log("  firebase emulators:start")

  rl.close()
}
