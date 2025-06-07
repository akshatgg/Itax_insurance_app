#!/usr/bin/env node

// This script is a wrapper for the TypeScript scheduler script
// It compiles and runs the TypeScript file

const { execSync, spawn } = require("child_process")
const path = require("path")
const fs = require("fs")

// Ensure the dist directory exists
const distDir = path.join(__dirname, "..", "dist")
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true })
}

// Compile the TypeScript file
console.log("Compiling scheduler script...")
try {
  execSync("npx tsc --project tsconfig.scripts.json", { stdio: "inherit" })
} catch (error) {
  console.error("Failed to compile scheduler script.")
  process.exit(1)
}

// Run the compiled JavaScript file
console.log("Running scheduler script...")
try {
  // Pass all command line arguments to the compiled script
  const args = process.argv.slice(2)

  // Check if we're running in daemon mode
  if (args.includes("daemon") && !args.includes("--no-detach")) {
    // Run as a detached process
    const child = spawn("node", [path.join(distDir, "scripts", "schedule-migration.js"), ...args], {
      detached: true,
      stdio: "ignore",
    })

    // Unref the child to allow the parent to exit
    child.unref()

    console.log(`Scheduler daemon started with PID ${child.pid}`)

    // Create a PID file
    const pidDir = path.join(__dirname, "..", "pids")
    if (!fs.existsSync(pidDir)) {
      fs.mkdirSync(pidDir, { recursive: true })
    }

    fs.writeFileSync(path.join(pidDir, "scheduler.pid"), child.pid.toString())
    console.log(`PID file created at ${path.join(pidDir, "scheduler.pid")}`)

    process.exit(0)
  } else {
    // Run in the foreground
    execSync(`node ${path.join(distDir, "scripts", "schedule-migration.js")} ${args.join(" ")}`, { stdio: "inherit" })
  }
} catch (error) {
  console.error("Scheduler script failed.")
  process.exit(1)
}
