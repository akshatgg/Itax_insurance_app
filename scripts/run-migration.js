#!/usr/bin/env node

// This script is a wrapper for the TypeScript migration script
// It compiles and runs the TypeScript file

const { execSync } = require("child_process")
const path = require("path")
const fs = require("fs")

// Ensure the dist directory exists
const distDir = path.join(__dirname, "..", "dist")
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true })
}

// Compile the TypeScript file
console.log("Compiling migration script...")
try {
  execSync("npx tsc --project tsconfig.scripts.json", { stdio: "inherit" })
} catch (error) {
  console.error("Failed to compile migration script.")
  process.exit(1)
}

// Run the compiled JavaScript file
console.log("Running migration script...")
try {
  // Pass all command line arguments to the compiled script
  const args = process.argv.slice(2).join(" ")
  execSync(`node ${path.join(distDir, "scripts", "migrate-data.js")} ${args}`, { stdio: "inherit" })
} catch (error) {
  console.error("Migration script failed.")
  process.exit(1)
}
