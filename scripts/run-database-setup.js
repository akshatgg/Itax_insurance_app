const { execSync } = require("child_process")
const path = require("path")

console.log("🚀 Running database setup script...")

try {
  // Install ts-node if not already installed
  console.log("📦 Checking for ts-node...")
  try {
    execSync("npx ts-node --version", { stdio: "ignore" })
    console.log("✅ ts-node is already installed")
  } catch (error) {
    console.log("📦 Installing ts-node...")
    execSync("npm install -g ts-node typescript", { stdio: "inherit" })
  }

  // Run the database setup script
  console.log("🔥 Running database setup script...")
  const scriptPath = path.join(__dirname, "database-setup.ts")
  execSync(`npx ts-node ${scriptPath}`, { stdio: "inherit" })

  console.log("✅ Database setup completed successfully!")
} catch (error) {
  console.error("❌ Error running database setup:", error.message)
  process.exit(1)
}
