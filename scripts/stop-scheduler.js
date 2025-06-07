#!/usr/bin/env node

// This script stops the scheduler daemon

const fs = require("fs")
const path = require("path")

// Get the PID file
const pidFile = path.join(__dirname, "..", "pids", "scheduler.pid")

if (!fs.existsSync(pidFile)) {
  console.error("Scheduler daemon is not running (PID file not found).")
  process.exit(1)
}

try {
  // Read the PID
  const pid = Number.parseInt(fs.readFileSync(pidFile, "utf8"), 10)

  // Send SIGTERM to the process
  process.kill(pid, "SIGTERM")

  // Remove the PID file
  fs.unlinkSync(pidFile)

  console.log(`Scheduler daemon (PID ${pid}) stopped.`)
} catch (error) {
  if (error.code === "ESRCH") {
    console.error("Scheduler daemon is not running (process not found).")
    // Remove the stale PID file
    fs.unlinkSync(pidFile)
  } else {
    console.error(`Error stopping scheduler daemon: ${error.message}`)
  }
  process.exit(1)
}
