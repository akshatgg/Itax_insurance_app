const { execSync } = require("child_process")
const path = require("path")
const fs = require("fs")

console.log("🚀 Deploying Firebase Functions...")

// Check if the functions directory exists
const functionsDir = path.join(__dirname, "../firebase/functions")
if (!fs.existsSync(functionsDir)) {
  console.error("❌ Firebase functions directory not found!")
  console.log("Please make sure the firebase/functions directory exists.")
  process.exit(1)
}

try {
  // Install dependencies in the functions directory
  console.log("📦 Installing dependencies for Firebase Functions...")
  execSync("npm install", { cwd: functionsDir, stdio: "inherit" })

  // Build the functions
  console.log("🔨 Building Firebase Functions...")
  execSync("npm run build", { cwd: functionsDir, stdio: "inherit" })

  // Deploy the functions
  console.log("🚀 Deploying Firebase Functions...")
  execSync("firebase deploy --only functions", { stdio: "inherit" })

  console.log("✅ Firebase Functions deployed successfully!")
} catch (error) {
  console.error("❌ Error deploying Firebase Functions:", error.message)
  process.exit(1)
}
