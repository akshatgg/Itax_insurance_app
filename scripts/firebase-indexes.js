const { execSync } = require("child_process")
const fs = require("fs")
const path = require("path")

// Define the indexes configuration
const indexesConfig = {
  indexes: [
    {
      collectionGroup: "insuranceApplications",
      queryScope: "COLLECTION",
      fields: [
        { fieldPath: "userId", order: "ASCENDING" },
        { fieldPath: "status", order: "ASCENDING" },
        { fieldPath: "createdAt", order: "DESCENDING" },
      ],
    },
    {
      collectionGroup: "insurancePolicies",
      queryScope: "COLLECTION",
      fields: [
        { fieldPath: "userId", order: "ASCENDING" },
        { fieldPath: "status", order: "ASCENDING" },
        { fieldPath: "endDate", order: "ASCENDING" },
      ],
    },
    {
      collectionGroup: "claims",
      queryScope: "COLLECTION",
      fields: [
        { fieldPath: "userId", order: "ASCENDING" },
        { fieldPath: "status", order: "ASCENDING" },
        { fieldPath: "submittedAt", order: "DESCENDING" },
      ],
    },
    {
      collectionGroup: "documentScans",
      queryScope: "COLLECTION",
      fields: [
        { fieldPath: "userId", order: "ASCENDING" },
        { fieldPath: "documentType", order: "ASCENDING" },
        { fieldPath: "createdAt", order: "DESCENDING" },
      ],
    },
    {
      collectionGroup: "notifications",
      queryScope: "COLLECTION",
      fields: [
        { fieldPath: "userId", order: "ASCENDING" },
        { fieldPath: "read", order: "ASCENDING" },
        { fieldPath: "createdAt", order: "DESCENDING" },
      ],
    },
  ],
  fieldOverrides: [],
}

// Write the indexes configuration to a file
const configPath = path.join(__dirname, "firestore-indexes.json")
fs.writeFileSync(configPath, JSON.stringify(indexesConfig, null, 2))

console.log("📝 Created Firestore indexes configuration file")
console.log("🔥 Deploying Firestore indexes...")

try {
  // Check if Firebase CLI is installed
  try {
    execSync("firebase --version", { stdio: "ignore" })
    console.log("✅ Firebase CLI is already installed")
  } catch (error) {
    console.log("📦 Installing Firebase CLI...")
    execSync("npm install -g firebase-tools", { stdio: "inherit" })
  }

  // Deploy the indexes
  console.log("🚀 Deploying indexes to Firebase...")
  execSync(`firebase deploy --only firestore:indexes --config ${configPath}`, { stdio: "inherit" })

  console.log("✅ Firestore indexes deployed successfully!")
} catch (error) {
  console.error("❌ Error deploying Firestore indexes:", error.message)
  console.log("⚠️ You may need to manually create these indexes in the Firebase console")
}
