const { execSync } = require("child_process")
const path = require("path")
const fs = require("fs")

console.log("🚀 Deploying Firestore and Storage Rules...")

// Check if the rules files exist
const firestoreRulesPath = path.join(__dirname, "../firebase/firestore.rules")
const storageRulesPath = path.join(__dirname, "../firebase/storage.rules")

if (!fs.existsSync(firestoreRulesPath)) {
  console.error("❌ Firestore rules file not found!")
  console.log("Please make sure the firebase/firestore.rules file exists.")
  process.exit(1)
}

if (!fs.existsSync(storageRulesPath)) {
  console.error("❌ Storage rules file not found!")
  console.log("Please make sure the firebase/storage.rules file exists.")
  process.exit(1)
}

try {
  // Deploy the rules
  console.log("🚀 Deploying Firestore and Storage Rules...")
  execSync("firebase deploy --only firestore:rules,storage:rules", { stdio: "inherit" })

  console.log("✅ Firestore and Storage Rules deployed successfully!")
} catch (error) {
  console.error("❌ Error deploying rules:", error.message)
  process.exit(1)
}
