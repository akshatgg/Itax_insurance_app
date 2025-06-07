import * as fs from "fs"
import * as path from "path"
import * as cron from "node-cron"
import { Command } from "commander"
import * as inquirer from "inquirer"
import chalk from "chalk"
import { v4 as uuidv4 } from "uuid"
import { fork } from "child_process"
import * as nodemailer from "nodemailer"
import { createSpinner } from "nanospinner"

// Define environment types
type Environment = "development" | "staging" | "production" | "custom"

// Update the MigrationSchedule interface to include dependencies
interface MigrationSchedule {
  id: string
  name: string
  cronExpression: string
  timezone: string
  sourceEnv: Environment
  targetEnv: Environment
  collections?: string[]
  query?: string
  batchSize: number
  includeUsers: boolean
  transformData: boolean
  backupBeforeMigration: boolean
  customSourceCredentials?: string
  customTargetCredentials?: string
  notifyEmail?: string
  notifySlack?: string
  createdAt: string
  lastRun?: string
  nextRun?: string
  status: "scheduled" | "running" | "completed" | "failed" | "disabled"
  logs: string[]
  dependencies?: string[] // Add dependencies array to store IDs of dependent migrations
  dependencyStrategy?: "wait" | "skip" | "fail" // Strategy for handling dependency failures
  dependencyTimeout?: number // Timeout in minutes for waiting on dependencies
}

// Define schedule manager
class ScheduleManager {
  private schedulesPath: string
  private schedules: MigrationSchedule[] = []
  private activeJobs: Map<string, cron.ScheduledTask> = new Map()
  private emailTransporter?: nodemailer.Transporter

  constructor() {
    this.schedulesPath = path.join(__dirname, "..", "config", "migration-schedules.json")
    this.loadSchedules()
    this.setupEmailTransporter()
  }

  private setupEmailTransporter() {
    // Check if email configuration exists
    const emailConfigPath = path.join(__dirname, "..", "config", "email-config.json")
    if (fs.existsSync(emailConfigPath)) {
      try {
        const emailConfig = JSON.parse(fs.readFileSync(emailConfigPath, "utf8"))
        this.emailTransporter = nodemailer.createTransport(emailConfig)
      } catch (error) {
        console.warn(chalk.yellow(`Warning: Could not set up email notifications - ${error.message}`))
      }
    }
  }

  private loadSchedules() {
    try {
      if (fs.existsSync(this.schedulesPath)) {
        this.schedules = JSON.parse(fs.readFileSync(this.schedulesPath, "utf8"))
      } else {
        // Create directory if it doesn't exist
        const configDir = path.dirname(this.schedulesPath)
        if (!fs.existsSync(configDir)) {
          fs.mkdirSync(configDir, { recursive: true })
        }
        this.saveSchedules()
      }
    } catch (error) {
      console.error(chalk.red(`Error loading schedules: ${error.message}`))
      this.schedules = []
      this.saveSchedules()
    }
  }

  private saveSchedules() {
    try {
      fs.writeFileSync(this.schedulesPath, JSON.stringify(this.schedules, null, 2))
    } catch (error) {
      console.error(chalk.red(`Error saving schedules: ${error.message}`))
    }
  }

  public getSchedules(): MigrationSchedule[] {
    return [...this.schedules]
  }

  public getSchedule(id: string): MigrationSchedule | undefined {
    return this.schedules.find((schedule) => schedule.id === id)
  }

  // Add a new method to the ScheduleManager class to check dependencies
  // Add this method after the loadSchedules method
  private async checkDependencies(schedule: MigrationSchedule): Promise<{ canRun: boolean; message: string }> {
    // If no dependencies, can run immediately
    if (!schedule.dependencies || schedule.dependencies.length === 0) {
      return { canRun: true, message: "No dependencies" }
    }

    const pendingDependencies: string[] = []
    const failedDependencies: string[] = []

    // Check each dependency
    for (const depId of schedule.dependencies) {
      const dependency = this.getSchedule(depId)

      // If dependency doesn't exist
      if (!dependency) {
        return {
          canRun: false,
          message: `Dependency ${depId} not found`,
        }
      }

      // If dependency has never run or is currently running
      if (!dependency.lastRun || dependency.status === "running") {
        pendingDependencies.push(dependency.name)
      }
      // If dependency failed in its last run
      else if (dependency.status === "failed") {
        failedDependencies.push(dependency.name)
      }
    }

    // If there are pending dependencies
    if (pendingDependencies.length > 0) {
      return {
        canRun: false,
        message: `Waiting for dependencies: ${pendingDependencies.join(", ")}`,
      }
    }

    // If there are failed dependencies
    if (failedDependencies.length > 0) {
      // Handle based on dependency strategy
      const strategy = schedule.dependencyStrategy || "fail"

      if (strategy === "fail") {
        return {
          canRun: false,
          message: `Dependencies failed: ${failedDependencies.join(", ")}`,
        }
      } else if (strategy === "skip") {
        return {
          canRun: true,
          message: `Proceeding despite failed dependencies: ${failedDependencies.join(", ")}`,
        }
      }
      // "wait" strategy is handled by the scheduler
    }

    return { canRun: true, message: "All dependencies satisfied" }
  }

  // Add a method to detect circular dependencies
  // Add this method after the checkDependencies method
  private detectCircularDependencies(
    scheduleId: string,
    dependencies: string[],
    visited: Set<string> = new Set(),
    path: string[] = [],
  ): string[] | null {
    // If we've already visited this node in the current path, we have a cycle
    if (path.includes(scheduleId)) {
      return [...path.slice(path.indexOf(scheduleId)), scheduleId]
    }

    // If we've already determined this node doesn't lead to a cycle, skip it
    if (visited.has(scheduleId)) {
      return null
    }

    // Add the current node to the path and visited set
    path.push(scheduleId)
    visited.add(scheduleId)

    // Check each dependency
    for (const depId of dependencies) {
      const dependency = this.getSchedule(depId)
      if (!dependency) continue

      // Recursively check this dependency's dependencies
      if (dependency.dependencies && dependency.dependencies.length > 0) {
        const cycle = this.detectCircularDependencies(depId, dependency.dependencies, visited, [...path])
        if (cycle) return cycle
      }
    }

    return null
  }

  // Add a method to validate dependencies when adding or updating a schedule
  // Add this method after the detectCircularDependencies method
  private validateDependencies(scheduleId: string, dependencies: string[]): { valid: boolean; message: string } {
    // Check if all dependencies exist
    for (const depId of dependencies) {
      const dependency = this.getSchedule(depId)
      if (!dependency) {
        return { valid: false, message: `Dependency ${depId} not found` }
      }
    }

    // Check for circular dependencies
    const cycle = this.detectCircularDependencies(scheduleId, dependencies)
    if (cycle) {
      return {
        valid: false,
        message: `Circular dependency detected: ${cycle.join(" → ")}`,
      }
    }

    return { valid: true, message: "Dependencies are valid" }
  }

  // Modify the addSchedule method to validate dependencies
  // Find the addSchedule method and replace it with this updated version
  public addSchedule(schedule: Omit<MigrationSchedule, "id" | "createdAt" | "status" | "logs">): MigrationSchedule {
    const newSchedule: MigrationSchedule = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      status: "scheduled",
      logs: [],
      ...schedule,
    }

    // Validate dependencies if any
    if (newSchedule.dependencies && newSchedule.dependencies.length > 0) {
      const validation = this.validateDependencies(newSchedule.id, newSchedule.dependencies)
      if (!validation.valid) {
        throw new Error(`Invalid dependencies: ${validation.message}`)
      }
    }

    // Calculate next run time
    try {
      const nextRun = cron
        .schedule(newSchedule.cronExpression, () => {}, {
          scheduled: false,
          timezone: newSchedule.timezone,
        })
        .nextDate()
      newSchedule.nextRun = nextRun.toISOString()
    } catch (error) {
      console.error(chalk.red(`Error calculating next run time: ${error.message}`))
    }

    this.schedules.push(newSchedule)
    this.saveSchedules()
    return newSchedule
  }

  // Modify the updateSchedule method to validate dependencies
  // Find the updateSchedule method and update the dependency validation part
  public updateSchedule(id: string, updates: Partial<MigrationSchedule>): MigrationSchedule | undefined {
    const index = this.schedules.findIndex((schedule) => schedule.id === id)
    if (index === -1) {
      return undefined
    }

    // Stop existing job if cron expression changed
    if (updates.cronExpression && this.activeJobs.has(id)) {
      this.activeJobs.get(id)?.stop()
      this.activeJobs.delete(id)
    }

    const updatedSchedule = {
      ...this.schedules[index],
      ...updates,
    }

    // Validate dependencies if they're being updated
    if (updates.dependencies) {
      const validation = this.validateDependencies(id, updates.dependencies)
      if (!validation.valid) {
        throw new Error(`Invalid dependencies: ${validation.message}`)
      }
    }

    // Recalculate next run time if cron expression changed
    if (updates.cronExpression || updates.timezone) {
      try {
        const nextRun = cron
          .schedule(updatedSchedule.cronExpression, () => {}, {
            scheduled: false,
            timezone: updatedSchedule.timezone,
          })
          .nextDate()
        updatedSchedule.nextRun = nextRun.toISOString()
      } catch (error) {
        console.error(chalk.red(`Error calculating next run time: ${error.message}`))
      }
    }

    this.schedules[index] = updatedSchedule
    this.saveSchedules()
    return updatedSchedule
  }

  public deleteSchedule(id: string): boolean {
    const index = this.schedules.findIndex((schedule) => schedule.id === id)
    if (index === -1) {
      return false
    }

    // Stop job if running
    if (this.activeJobs.has(id)) {
      this.activeJobs.get(id)?.stop()
      this.activeJobs.delete(id)
    }

    this.schedules.splice(index, 1)
    this.saveSchedules()
    return true
  }

  public startSchedule(id: string): boolean {
    const schedule = this.getSchedule(id)
    if (!schedule || schedule.status === "running") {
      return false
    }

    this.updateSchedule(id, { status: "scheduled" })
    return true
  }

  public stopSchedule(id: string): boolean {
    const schedule = this.getSchedule(id)
    if (!schedule) {
      return false
    }

    this.updateSchedule(id, { status: "disabled" })
    if (this.activeJobs.has(id)) {
      this.activeJobs.get(id)?.stop()
      this.activeJobs.delete(id)
    }
    return true
  }

  public startAllSchedules(): void {
    this.schedules.forEach((schedule) => {
      if (schedule.status !== "disabled") {
        this.scheduleJob(schedule)
      }
    })
  }

  public stopAllSchedules(): void {
    this.activeJobs.forEach((job) => job.stop())
    this.activeJobs.clear()
  }

  private scheduleJob(schedule: MigrationSchedule): void {
    // Stop existing job if any
    if (this.activeJobs.has(schedule.id)) {
      this.activeJobs.get(schedule.id)?.stop()
      this.activeJobs.delete(schedule.id)
    }

    // Skip if disabled
    if (schedule.status === "disabled") {
      return
    }

    try {
      const job = cron.schedule(
        schedule.cronExpression,
        () => {
          this.runMigration(schedule)
        },
        {
          timezone: schedule.timezone,
        },
      )

      this.activeJobs.set(schedule.id, job)

      // Calculate next run time
      const nextRun = job.nextDate().toISOString()
      this.updateSchedule(schedule.id, { nextRun })

      console.log(
        chalk.green(
          `Scheduled migration "${schedule.name}" (${schedule.id}) for ${new Date(nextRun).toLocaleString()}`,
        ),
      )
    } catch (error) {
      console.error(chalk.red(`Error scheduling migration "${schedule.name}" (${schedule.id}): ${error.message}`))
      this.updateSchedule(schedule.id, {
        status: "failed",
        logs: [...(schedule.logs || []), `Error scheduling: ${error.message}`],
      })
    }
  }

  // Modify the runMigration method to check dependencies before running
  // Find the runMigration method and update it to check dependencies
  private async runMigration(schedule: MigrationSchedule): Promise<void> {
    console.log(chalk.blue(`Preparing to run scheduled migration "${schedule.name}" (${schedule.id})`))

    // Check dependencies
    const dependencyCheck = await this.checkDependencies(schedule)
    if (!dependencyCheck.canRun) {
      console.log(chalk.yellow(`Cannot run migration "${schedule.name}" (${schedule.id}): ${dependencyCheck.message}`))

      // If using "wait" strategy and there are pending dependencies, we'll try again later
      if (schedule.dependencyStrategy === "wait" && dependencyCheck.message.includes("Waiting for dependencies")) {
        const timeout = schedule.dependencyTimeout || 60 // Default 60 minutes
        console.log(chalk.yellow(`Will retry in ${timeout} minutes or when dependencies complete`))

        // Schedule a retry after the timeout
        setTimeout(
          () => {
            // Only retry if the schedule is still active
            const currentSchedule = this.getSchedule(schedule.id)
            if (currentSchedule && currentSchedule.status !== "disabled") {
              this.runMigration(currentSchedule)
            }
          },
          timeout * 60 * 1000,
        )

        return
      }

      // For "fail" strategy or if dependencies don't exist
      this.updateSchedule(schedule.id, {
        status: schedule.status === "disabled" ? "disabled" : "scheduled",
        logs: [
          ...(schedule.logs || []),
          `Migration skipped: ${dependencyCheck.message} at ${new Date().toISOString()}`,
        ],
      })

      return
    }

    console.log(
      chalk.blue(`Running scheduled migration "${schedule.name}" (${schedule.id}): ${dependencyCheck.message}`),
    )

    // Update schedule status
    this.updateSchedule(schedule.id, {
      status: "running",
      lastRun: new Date().toISOString(),
      logs: [...(schedule.logs || []), `Migration started at ${new Date().toISOString()}: ${dependencyCheck.message}`],
    })

    // Prepare arguments for migration script
    const args = [
      "--source",
      schedule.sourceEnv,
      "--target",
      schedule.targetEnv,
      "--batch-size",
      schedule.batchSize.toString(),
    ]

    if (schedule.collections && schedule.collections.length > 0) {
      args.push("--collections", schedule.collections.join(","))
    }

    if (schedule.query) {
      args.push("--query", schedule.query)
    }

    if (schedule.includeUsers) {
      args.push("--include-users")
    }

    if (schedule.transformData) {
      args.push("--transform-data")
    }

    if (schedule.backupBeforeMigration) {
      args.push("--backup")
    }

    if (schedule.sourceEnv === "custom" && schedule.customSourceCredentials) {
      args.push("--source-credentials", schedule.customSourceCredentials)
    }

    if (schedule.targetEnv === "custom" && schedule.customTargetCredentials) {
      args.push("--target-credentials", schedule.customTargetCredentials)
    }

    // Create log directory
    const logDir = path.join(__dirname, "..", "logs", "scheduled")
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true })
    }

    // Create log file paths
    const timestamp = new Date().toISOString().replace(/:/g, "-")
    const stdoutLogPath = path.join(logDir, `${schedule.id}-${timestamp}-stdout.log`)
    const stderrLogPath = path.join(logDir, `${schedule.id}-${timestamp}-stderr.log`)

    // Create log file streams
    const stdoutStream = fs.createWriteStream(stdoutLogPath, { flags: "a" })
    const stderrStream = fs.createWriteStream(stderrLogPath, { flags: "a" })

    // Run migration script as a child process
    const migrationScript = path.join(__dirname, "..", "dist", "scripts", "migrate-data.js")
    const child = fork(migrationScript, args, { silent: true })

    // Pipe output to log files
    if (child.stdout) {
      child.stdout.pipe(stdoutStream)
    }
    if (child.stderr) {
      child.stderr.pipe(stderrStream)
    }

    // Handle completion
    child.on("close", (code) => {
      const status = code === 0 ? "completed" : "failed"
      const message = `Migration ${status} with exit code ${code} at ${new Date().toISOString()}`

      // Update schedule
      const updatedSchedule = this.updateSchedule(schedule.id, {
        status: schedule.status === "disabled" ? "disabled" : "scheduled",
        logs: [...(schedule.logs || []), message],
      })

      // Calculate next run time
      if (updatedSchedule) {
        try {
          const nextRun = cron
            .schedule(updatedSchedule.cronExpression, () => {}, {
              scheduled: false,
              timezone: updatedSchedule.timezone,
            })
            .nextDate()
          this.updateSchedule(schedule.id, { nextRun: nextRun.toISOString() })
        } catch (error) {
          console.error(chalk.red(`Error calculating next run time: ${error.message}`))
        }
      }

      console.log(
        chalk.blue(`Scheduled migration "${schedule.name}" (${schedule.id}) ${status}. Logs saved to ${logDir}`),
      )

      // Send notifications
      this.sendNotifications(schedule, status, {
        stdoutLogPath,
        stderrLogPath,
        exitCode: code,
      })
    })
  }

  private async sendNotifications(
    schedule: MigrationSchedule,
    status: "completed" | "failed",
    details: { stdoutLogPath: string; stderrLogPath: string; exitCode: number | null },
  ): Promise<void> {
    // Send email notification
    if (schedule.notifyEmail && this.emailTransporter) {
      try {
        const subject = `Migration ${status.toUpperCase()}: ${schedule.name}`
        const text = `
Migration Details:
- Name: ${schedule.name}
- ID: ${schedule.id}
- Status: ${status.toUpperCase()}
- Exit Code: ${details.exitCode}
- Source: ${schedule.sourceEnv}
- Target: ${schedule.targetEnv}
- Started: ${schedule.lastRun}
- Completed: ${new Date().toISOString()}

Log files are available at:
- Standard output: ${details.stdoutLogPath}
- Standard error: ${details.stderrLogPath}
`

        await this.emailTransporter.sendMail({
          from: "ecosure-migration@example.com",
          to: schedule.notifyEmail,
          subject,
          text,
        })

        console.log(chalk.green(`Email notification sent to ${schedule.notifyEmail}`))
      } catch (error) {
        console.error(chalk.red(`Error sending email notification: ${error.message}`))
      }
    }

    // Send Slack notification
    if (schedule.notifySlack) {
      try {
        // This is a simplified example - in a real implementation, you'd use a proper Slack SDK
        const response = await fetch(schedule.notifySlack, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: `Migration *${schedule.name}* ${status} with exit code ${details.exitCode}`,
            blocks: [
              {
                type: "section",
                text: {
                  type: "mrkdwn",
                  text: `Migration *${schedule.name}* ${status} with exit code ${details.exitCode}`,
                },
              },
              {
                type: "section",
                fields: [
                  {
                    type: "mrkdwn",
                    text: `*Source:*\n${schedule.sourceEnv}`,
                  },
                  {
                    type: "mrkdwn",
                    text: `*Target:*\n${schedule.targetEnv}`,
                  },
                  {
                    type: "mrkdwn",
                    text: `*Started:*\n${schedule.lastRun}`,
                  },
                  {
                    type: "mrkdwn",
                    text: `*Completed:*\n${new Date().toISOString()}`,
                  },
                ],
              },
            ],
          }),
        })

        if (response.ok) {
          console.log(chalk.green("Slack notification sent"))
        } else {
          console.error(chalk.red(`Error sending Slack notification: ${await response.text()}`))
        }
      } catch (error) {
        console.error(chalk.red(`Error sending Slack notification: ${error.message}`))
      }
    }
  }

  public runScheduleNow(id: string): boolean {
    const schedule = this.getSchedule(id)
    if (!schedule) {
      return false
    }

    this.runMigration(schedule)
    return true
  }
}

/**
 * Main function to run the scheduler
 */
async function main() {
  // Set up command line interface
  const program = new Command()

  program
    .name("schedule-migration")
    .description("Schedule data migrations between Firebase environments")
    .version("1.0.0")

  // Create a schedule manager
  const scheduleManager = new ScheduleManager()

  // List command
  program
    .command("list")
    .description("List all scheduled migrations")
    .action(() => {
      const schedules = scheduleManager.getSchedules()
      if (schedules.length === 0) {
        console.log(chalk.yellow("No scheduled migrations found."))
        return
      }

      console.log(chalk.blue("Scheduled Migrations:"))
      console.log(chalk.blue("-------------------------------------------"))

      schedules.forEach((schedule) => {
        const statusColor =
          schedule.status === "scheduled"
            ? chalk.green
            : schedule.status === "running"
              ? chalk.blue
              : schedule.status === "completed"
                ? chalk.green
                : schedule.status === "failed"
                  ? chalk.red
                  : chalk.yellow

        console.log(chalk.bold(`${schedule.name} (${schedule.id})`))
        console.log(`Status: ${statusColor(schedule.status)}`)
        console.log(`Schedule: ${schedule.cronExpression} (${schedule.timezone})`)
        console.log(`Source: ${schedule.sourceEnv}, Target: ${schedule.targetEnv}`)
        if (schedule.nextRun) {
          console.log(`Next run: ${new Date(schedule.nextRun).toLocaleString()}`)
        }
        if (schedule.lastRun) {
          console.log(`Last run: ${new Date(schedule.lastRun).toLocaleString()}`)
        }
        console.log(chalk.blue("-------------------------------------------"))
      })
    })

  // Add dependency options to the create command
  // Find the program.command("create") section and add these options
  program
    .command("create")
    .description("Create a new scheduled migration")
    .option("-i, --interactive", "Run in interactive mode", true)
    // ... existing options ...
    .option("--dependencies <ids>", "Comma-separated list of migration IDs this migration depends on")
    .option(
      "--dependency-strategy <strategy>",
      "Strategy for handling dependency failures: wait, skip, or fail",
      "fail",
    )
    .option("--dependency-timeout <minutes>", "Timeout in minutes for waiting on dependencies", "60")
    // ... rest of the command ...
    .option("--name <name>", "Name of the scheduled migration")
    .option("--cron <expression>", "Cron expression for the schedule")
    .option("--timezone <timezone>", "Timezone for the schedule", "UTC")
    .option("--source <env>", "Source environment (development, staging, production, custom)")
    .option("--target <env>", "Target environment (development, staging, production, custom)")
    .option("--collections <collections>", "Comma-separated list of collections to migrate")
    .option("--query <query>", 'Query to filter documents (e.g., "status == pending")')
    .option("--batch-size <size>", "Batch size for writes", "500")
    .option("--include-users", "Include users collection in migration", false)
    .option("--transform-data", "Transform data during migration", true)
    .option("--backup", "Create backup before migration", true)
    .option("--source-credentials <path>", "Path to custom source credentials JSON file")
    .option("--target-credentials <path>", "Path to custom target credentials JSON file")
    .option("--notify-email <email>", "Email address to notify when migration completes")
    .option("--notify-slack <webhook>", "Slack webhook URL to notify when migration completes")
    .action(async (options) => {
      let scheduleOptions: Omit<MigrationSchedule, "id" | "createdAt" | "status" | "logs">

      if (options.interactive) {
        // Interactive mode
        const answers = await inquirer.prompt([
          {
            type: "input",
            name: "name",
            message: "Name of the scheduled migration:",
            validate: (input) => (input ? true : "Name is required"),
          },
          {
            type: "input",
            name: "cronExpression",
            message: "Cron expression for the schedule (e.g., '0 2 * * *' for 2 AM daily):",
            validate: (input) => {
              if (!input) return "Cron expression is required"
              try {
                cron.validate(input)
                return true
              } catch (error) {
                return `Invalid cron expression: ${error.message}`
              }
            },
          },
          {
            type: "input",
            name: "timezone",
            message: "Timezone for the schedule (e.g., 'UTC', 'America/New_York'):",
            default: "UTC",
          },
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
          {
            type: "input",
            name: "notifyEmail",
            message: "Email address to notify when migration completes (leave empty for none):",
          },
          {
            type: "input",
            name: "notifySlack",
            message: "Slack webhook URL to notify when migration completes (leave empty for none):",
          },
          // Update the interactive prompts in the create command
          // Find the inquirer.prompt section in the create command and add these questions
          // Add these questions after the notifySlack question
          {
            type: "input",
            name: "dependencies",
            message: "Dependencies (comma-separated IDs of migrations this one depends on, leave empty for none):",
            filter: (input) => (input ? input.split(",").map((id) => id.trim()) : undefined),
          },
          {
            type: "list",
            name: "dependencyStrategy",
            message: "Strategy for handling dependency failures:",
            choices: [
              { name: "Fail - Don't run if dependencies failed", value: "fail" },
              { name: "Skip - Run even if dependencies failed", value: "skip" },
              { name: "Wait - Wait for dependencies to complete", value: "wait" },
            ],
            default: "fail",
            when: (answers) => answers.dependencies && answers.dependencies.length > 0,
          },
          {
            type: "number",
            name: "dependencyTimeout",
            message: "Timeout in minutes for waiting on dependencies (for 'wait' strategy):",
            default: 60,
            when: (answers) => answers.dependencyStrategy === "wait",
          },
        ])

        // Update the scheduleOptions in the create command
        // Find the scheduleOptions assignment in the create command and add these properties
        scheduleOptions = {
          name: answers.name,
          cronExpression: answers.cronExpression,
          timezone: answers.timezone,
          sourceEnv: answers.sourceEnv as Environment,
          targetEnv: answers.targetEnv as Environment,
          collections: answers.collections,
          query: answers.query || undefined,
          batchSize: answers.batchSize,
          includeUsers: answers.includeUsers,
          transformData: answers.transformData,
          backupBeforeMigration: answers.backupBeforeMigration,
          customSourceCredentials: answers.customSourceCredentials,
          customTargetCredentials: answers.customTargetCredentials,
          notifyEmail: answers.notifyEmail || undefined,
          notifySlack: answers.notifySlack || undefined,
          // ... existing properties ...
          dependencies: answers.dependencies,
          dependencyStrategy: answers.dependencyStrategy,
          dependencyTimeout: answers.dependencyTimeout,
        }
      } else {
        // Command line mode
        if (!options.name || !options.cron || !options.source || !options.target) {
          console.error(
            chalk.red("Error: Missing required options. Use --name, --cron, --source, and --target options."),
          )
          process.exit(1)
        }

        // Validate cron expression
        try {
          cron.validate(options.cron)
        } catch (error) {
          console.error(chalk.red(`Invalid cron expression: ${error.message}`))
          process.exit(1)
        }

        scheduleOptions = {
          name: options.name,
          cronExpression: options.cron,
          timezone: options.timezone,
          sourceEnv: options.source as Environment,
          targetEnv: options.target as Environment,
          collections: options.collections?.split(",").map((c) => c.trim()),
          query: options.query,
          batchSize: Number.parseInt(options.batchSize, 10),
          includeUsers: options.includeUsers,
          transformData: options.transformData,
          backupBeforeMigration: options.backup,
          customSourceCredentials: options.sourceCredentials,
          customTargetCredentials: options.targetCredentials,
          notifyEmail: options.notifyEmail,
          notifySlack: options.notifySlack,
          dependencies: options.dependencies?.split(",").map((id) => id.trim()),
          dependencyStrategy: options.dependencyStrategy,
          dependencyTimeout: options.dependencyTimeout ? Number.parseInt(options.dependencyTimeout, 10) : undefined,
        }
      }

      // Validate options
      if (scheduleOptions.sourceEnv === scheduleOptions.targetEnv && scheduleOptions.sourceEnv !== "custom") {
        console.error(chalk.red("Source and target environments cannot be the same."))
        process.exit(1)
      }

      if (scheduleOptions.sourceEnv === "custom" && !scheduleOptions.customSourceCredentials) {
        console.error(chalk.red("Custom source credentials are required when source environment is custom."))
        process.exit(1)
      }

      if (scheduleOptions.targetEnv === "custom" && !scheduleOptions.customTargetCredentials) {
        console.error(chalk.red("Custom target credentials are required when target environment is custom."))
        process.exit(1)
      }

      // Create schedule
      const schedule = scheduleManager.addSchedule(scheduleOptions)

      console.log(chalk.green(`Created scheduled migration "${schedule.name}" (${schedule.id})`))
      if (schedule.nextRun) {
        console.log(chalk.green(`Next run: ${new Date(schedule.nextRun).toLocaleString()}`))
      }

      // Schedule the job
      scheduleManager.startSchedule(schedule.id)
    })

  // Add dependency options to the update command
  // Find the program.command("update") section and add these options
  program
    .command("update <id>")
    .description("Update a scheduled migration")
    .option("-i, --interactive", "Run in interactive mode", true)
    // ... existing options ...
    .option("--dependencies <ids>", "Comma-separated list of migration IDs this migration depends on")
    .option("--dependency-strategy <strategy>", "Strategy for handling dependency failures: wait, skip, or fail")
    .option("--dependency-timeout <minutes>", "Timeout in minutes for waiting on dependencies")
    // ... rest of the command ...
    .option("--name <name>", "Name of the scheduled migration")
    .option("--cron <expression>", "Cron expression for the schedule")
    .option("--timezone <timezone>", "Timezone for the schedule")
    .option("--collections <collections>", "Comma-separated list of collections to migrate")
    .option("--query <query>", 'Query to filter documents (e.g., "status == pending")')
    .option("--batch-size <size>", "Batch size for writes")
    .option("--include-users", "Include users collection in migration")
    .option("--no-include-users", "Exclude users collection in migration")
    .option("--transform-data", "Transform data during migration")
    .option("--no-transform-data", "Don't transform data during migration")
    .option("--backup", "Create backup before migration")
    .option("--no-backup", "Don't create backup before migration")
    .option("--notify-email <email>", "Email address to notify when migration completes")
    .option("--notify-slack <webhook>", "Slack webhook URL to notify when migration completes")
    .action(async (id, options) => {
      // Get existing schedule
      const existingSchedule = scheduleManager.getSchedule(id)
      if (!existingSchedule) {
        console.error(chalk.red(`Schedule with ID ${id} not found.`))
        process.exit(1)
      }

      let updates: Partial<MigrationSchedule> = {}

      if (options.interactive) {
        // Interactive mode
        const answers = await inquirer.prompt([
          {
            type: "input",
            name: "name",
            message: "Name of the scheduled migration:",
            default: existingSchedule.name,
          },
          {
            type: "input",
            name: "cronExpression",
            message: "Cron expression for the schedule (e.g., '0 2 * * *' for 2 AM daily):",
            default: existingSchedule.cronExpression,
            validate: (input) => {
              if (!input) return "Cron expression is required"
              try {
                cron.validate(input)
                return true
              } catch (error) {
                return `Invalid cron expression: ${error.message}`
              }
            },
          },
          {
            type: "input",
            name: "timezone",
            message: "Timezone for the schedule (e.g., 'UTC', 'America/New_York'):",
            default: existingSchedule.timezone,
          },
          {
            type: "input",
            name: "collections",
            message: "Collections to migrate (comma-separated, leave empty for all):",
            default: existingSchedule.collections?.join(",") || "",
            filter: (input) => (input ? input.split(",").map((c) => c.trim()) : undefined),
          },
          {
            type: "input",
            name: "query",
            message: 'Query to filter documents (e.g., "status == pending", leave empty for all):',
            default: existingSchedule.query || "",
          },
          {
            type: "number",
            name: "batchSize",
            message: "Batch size for writes:",
            default: existingSchedule.batchSize,
            validate: (input) => (input > 0 ? true : "Batch size must be greater than 0"),
          },
          {
            type: "confirm",
            name: "includeUsers",
            message: "Include users collection in migration?",
            default: existingSchedule.includeUsers,
          },
          {
            type: "confirm",
            name: "transformData",
            message: "Transform data during migration?",
            default: existingSchedule.transformData,
          },
          {
            type: "confirm",
            name: "backupBeforeMigration",
            message: "Create backup before migration?",
            default: existingSchedule.backupBeforeMigration,
          },
          {
            type: "input",
            name: "notifyEmail",
            message: "Email address to notify when migration completes (leave empty for none):",
            default: existingSchedule.notifyEmail || "",
          },
          {
            type: "input",
            name: "notifySlack",
            message: "Slack webhook URL to notify when migration completes (leave empty for none):",
            default: existingSchedule.notifySlack || "",
          },
          // Update the interactive prompts in the update command
          // Find the inquirer.prompt section in the update command and add these questions
          // Add these questions after the notifySlack question
          {
            type: "input",
            name: "dependencies",
            message: "Dependencies (comma-separated IDs of migrations this one depends on, leave empty for none):",
            default: existingSchedule.dependencies?.join(",") || "",
            filter: (input) => (input ? input.split(",").map((id) => id.trim()) : undefined),
          },
          {
            type: "list",
            name: "dependencyStrategy",
            message: "Strategy for handling dependency failures:",
            choices: [
              { name: "Fail - Don't run if dependencies failed", value: "fail" },
              { name: "Skip - Run even if dependencies failed", value: "skip" },
              { name: "Wait - Wait for dependencies to complete", value: "wait" },
            ],
            default: existingSchedule.dependencyStrategy || "fail",
            when: (answers) => answers.dependencies && answers.dependencies.length > 0,
          },
          {
            type: "number",
            name: "dependencyTimeout",
            message: "Timeout in minutes for waiting on dependencies (for 'wait' strategy):",
            default: existingSchedule.dependencyTimeout || 60,
            when: (answers) => answers.dependencyStrategy === "wait",
          },
        ])

        // Update the updates object in the update command
        // Find the updates assignment in the update command and add these properties
        updates = {
          name: answers.name,
          cronExpression: answers.cronExpression,
          timezone: answers.timezone,
          collections: answers.collections,
          query: answers.query || undefined,
          batchSize: answers.batchSize,
          includeUsers: answers.includeUsers,
          transformData: answers.transformData,
          backupBeforeMigration: answers.backupBeforeMigration,
          notifyEmail: answers.notifyEmail || undefined,
          notifySlack: answers.notifySlack || undefined,
          // ... existing properties ...
          dependencies: answers.dependencies,
          dependencyStrategy: answers.dependencyStrategy,
          dependencyTimeout: answers.dependencyTimeout,
        }
      } else {
        // Command line mode
        if (options.name) updates.name = options.name
        if (options.cron) {
          try {
            cron.validate(options.cron)
            updates.cronExpression = options.cron
          } catch (error) {
            console.error(chalk.red(`Invalid cron expression: ${error.message}`))
            process.exit(1)
          }
        }
        if (options.timezone) updates.timezone = options.timezone
        if (options.collections) updates.collections = options.collections.split(",").map((c) => c.trim())
        if (options.query) updates.query = options.query
        if (options.batchSize) updates.batchSize = Number.parseInt(options.batchSize, 10)
        if (options.includeUsers !== undefined) updates.includeUsers = options.includeUsers
        if (options.transformData !== undefined) updates.transformData = options.transformData
        if (options.backup !== undefined) updates.backupBeforeMigration = options.backup
        if (options.notifyEmail) updates.notifyEmail = options.notifyEmail
        if (options.notifySlack) updates.notifySlack = options.notifySlack
        if (options.dependencies) updates.dependencies = options.dependencies.split(",").map((id) => id.trim())
        if (options.dependencyStrategy) updates.dependencyStrategy = options.dependencyStrategy
        if (options.dependencyTimeout) updates.dependencyTimeout = Number.parseInt(options.dependencyTimeout, 10)
      }

      // Update schedule
      const updatedSchedule = scheduleManager.updateSchedule(id, updates)
      if (!updatedSchedule) {
        console.error(chalk.red(`Failed to update schedule with ID ${id}.`))
        process.exit(1)
      }

      console.log(chalk.green(`Updated scheduled migration "${updatedSchedule.name}" (${updatedSchedule.id})`))
      if (updatedSchedule.nextRun) {
        console.log(chalk.green(`Next run: ${new Date(updatedSchedule.nextRun).toLocaleString()}`))
      }

      // Reschedule the job if it's not disabled
      if (updatedSchedule.status !== "disabled") {
        scheduleManager.startSchedule(id)
      }
    })

  // Delete command
  program
    .command("delete <id>")
    .description("Delete a scheduled migration")
    .action(async (id) => {
      // Get existing schedule
      const existingSchedule = scheduleManager.getSchedule(id)
      if (!existingSchedule) {
        console.error(chalk.red(`Schedule with ID ${id} not found.`))
        process.exit(1)
      }

      // Confirm deletion
      const answers = await inquirer.prompt([
        {
          type: "confirm",
          name: "confirm",
          message: `Are you sure you want to delete the scheduled migration "${existingSchedule.name}" (${existingSchedule.id})?`,
          default: false,
        },
      ])

      if (!answers.confirm) {
        console.log(chalk.yellow("Deletion cancelled."))
        return
      }

      // Delete schedule
      const deleted = scheduleManager.deleteSchedule(id)
      if (!deleted) {
        console.error(chalk.red(`Failed to delete schedule with ID ${id}.`))
        process.exit(1)
      }

      console.log(chalk.green(`Deleted scheduled migration "${existingSchedule.name}" (${existingSchedule.id})`))
    })

  // Start command
  program
    .command("start <id>")
    .description("Start a scheduled migration")
    .action((id) => {
      const started = scheduleManager.startSchedule(id)
      if (!started) {
        console.error(chalk.red(`Failed to start schedule with ID ${id}.`))
        process.exit(1)
      }

      const schedule = scheduleManager.getSchedule(id)
      console.log(chalk.green(`Started scheduled migration "${schedule?.name}" (${id})`))
    })

  // Stop command
  program
    .command("stop <id>")
    .description("Stop a scheduled migration")
    .action((id) => {
      const stopped = scheduleManager.stopSchedule(id)
      if (!stopped) {
        console.error(chalk.red(`Failed to stop schedule with ID ${id}.`))
        process.exit(1)
      }

      const schedule = scheduleManager.getSchedule(id)
      console.log(chalk.green(`Stopped scheduled migration "${schedule?.name}" (${id})`))
    })

  // Run now command
  program
    .command("run-now <id>")
    .description("Run a scheduled migration immediately")
    .action((id) => {
      const started = scheduleManager.runScheduleNow(id)
      if (!started) {
        console.error(chalk.red(`Failed to run schedule with ID ${id}.`))
        process.exit(1)
      }

      const schedule = scheduleManager.getSchedule(id)
      console.log(chalk.green(`Running scheduled migration "${schedule?.name}" (${id}) now`))
    })

  // Add a new command to show dependencies
  // Add this after the run-now command
  // Add a dependencies command
  program
    .command("dependencies [id]")
    .description("Show dependencies for a migration or all migrations")
    .option("--graph", "Show dependency graph", false)
    .action((id, options) => {
      if (id) {
        // Show dependencies for a specific migration
        const schedule = scheduleManager.getSchedule(id)
        if (!schedule) {
          console.error(chalk.red(`Schedule with ID ${id} not found.`))
          process.exit(1)
        }

        console.log(chalk.blue(`Dependencies for "${schedule.name}" (${schedule.id}):`))

        if (!schedule.dependencies || schedule.dependencies.length === 0) {
          console.log(chalk.yellow("No dependencies"))
          return
        }

        schedule.dependencies.forEach((depId) => {
          const dependency = scheduleManager.getSchedule(depId)
          if (dependency) {
            const statusColor =
              dependency.status === "scheduled"
                ? chalk.green
                : dependency.status === "running"
                  ? chalk.blue
                  : dependency.status === "completed"
                    ? chalk.green
                    : dependency.status === "failed"
                      ? chalk.red
                      : chalk.yellow

            console.log(`- ${dependency.name} (${dependency.id}): ${statusColor(dependency.status)}`)
          } else {
            console.log(chalk.red(`- Unknown dependency: ${depId}`))
          }
        })

        console.log(chalk.blue(`\nStrategy: ${schedule.dependencyStrategy || "fail"}`))
        if (schedule.dependencyStrategy === "wait") {
          console.log(chalk.blue(`Timeout: ${schedule.dependencyTimeout || 60} minutes`))
        }
      } else {
        // Show all dependencies
        const schedules = scheduleManager.getSchedules()

        if (options.graph) {
          // Generate a simple ASCII dependency graph
          console.log(chalk.blue("Dependency Graph:"))
          console.log(chalk.blue("-------------------------------------------"))

          const printDependencyTree = (scheduleId: string, level = 0, visited = new Set<string>()) => {
            const schedule = scheduleManager.getSchedule(scheduleId)
            if (!schedule) return

            // Prevent infinite recursion with circular dependencies
            if (visited.has(scheduleId)) {
              console.log(`${" ".repeat(level * 2)}${chalk.red("↻")} ${schedule.name} (circular)`)
              return
            }

            visited.add(scheduleId)

            // Print this node
            const prefix = level === 0 ? "" : level === 1 ? "└─ " : "   ".repeat(level - 1) + "└─ "
            console.log(`${" ".repeat(level * 2)}${prefix}${schedule.name} (${schedule.id})`)

            // Print dependencies
            if (schedule.dependencies && schedule.dependencies.length > 0) {
              schedule.dependencies.forEach((depId) => {
                const dependency = scheduleManager.getSchedule(depId)
                if (dependency) {
                  printDependencyTree(depId, level + 1, new Set(visited))
                } else {
                  console.log(`${" ".repeat((level + 1) * 2)}└─ ${chalk.red(`Unknown: ${depId}`)}`)
                }
              })
            }
          }

          // Find root nodes (migrations that are not dependencies of any other migration)
          const allDependencies = new Set<string>()
          schedules.forEach((schedule) => {
            if (schedule.dependencies) {
              schedule.dependencies.forEach((depId) => allDependencies.add(depId))
            }
          })

          const rootNodes = schedules.filter((schedule) => !allDependencies.has(schedule.id))

          if (rootNodes.length === 0) {
            console.log(chalk.yellow("No root migrations found (possible circular dependencies)"))
            // Print all migrations as roots
            schedules.forEach((schedule) => {
              printDependencyTree(schedule.id)
            })
          } else {
            rootNodes.forEach((schedule) => {
              printDependencyTree(schedule.id)
            })
          }
        } else {
          // Show simple list of migrations and their dependencies
          console.log(chalk.blue("Migration Dependencies:"))
          console.log(chalk.blue("-------------------------------------------"))

          schedules.forEach((schedule) => {
            console.log(chalk.bold(`${schedule.name} (${schedule.id})`))

            if (!schedule.dependencies || schedule.dependencies.length === 0) {
              console.log("  No dependencies")
            } else {
              console.log("  Depends on:")
              schedule.dependencies.forEach((depId) => {
                const dependency = scheduleManager.getSchedule(depId)
                if (dependency) {
                  console.log(`  - ${dependency.name} (${dependency.id})`)
                } else {
                  console.log(chalk.red(`  - Unknown dependency: ${depId}`))
                }
              })
            }

            // Show which migrations depend on this one
            const dependents = schedules.filter((s) => s.dependencies && s.dependencies.includes(schedule.id))

            if (dependents.length > 0) {
              console.log("  Required by:")
              dependents.forEach((dependent) => {
                console.log(`  - ${dependent.name} (${dependent.id})`)
              })
            }

            console.log(chalk.blue("-------------------------------------------"))
          })
        }
      }
    })

  // Start daemon command
  program
    .command("daemon")
    .description("Start the scheduler daemon")
    .option("--no-detach", "Run in foreground (don't detach)")
    .action((options) => {
      console.log(chalk.blue("Starting scheduler daemon..."))
      scheduleManager.startAllSchedules()

      if (options.detach) {
        // In a real implementation, you would use something like pm2 or systemd
        // to run the process as a daemon. This is a simplified example.
        console.log(chalk.green("Scheduler daemon started in detached mode."))
        process.send?.("ready")
      } else {
        console.log(chalk.green("Scheduler daemon started in foreground mode. Press Ctrl+C to stop."))
        process.on("SIGINT", () => {
          console.log(chalk.blue("Stopping scheduler daemon..."))
          scheduleManager.stopAllSchedules()
          process.exit(0)
        })
      }
    })

  // Setup email notifications command
  program
    .command("setup-email")
    .description("Set up email notifications")
    .action(async () => {
      const answers = await inquirer.prompt([
        {
          type: "list",
          name: "service",
          message: "Select email service:",
          choices: ["SMTP", "Gmail", "SendGrid", "Custom"],
        },
        {
          type: "input",
          name: "host",
          message: "SMTP host:",
          when: (answers) => answers.service === "SMTP",
        },
        {
          type: "number",
          name: "port",
          message: "SMTP port:",
          default: 587,
          when: (answers) => answers.service === "SMTP",
        },
        {
          type: "confirm",
          name: "secure",
          message: "Use secure connection (TLS)?",
          default: true,
          when: (answers) => answers.service === "SMTP",
        },
        {
          type: "input",
          name: "user",
          message: "Username/email:",
          when: (answers) => ["SMTP", "Gmail", "SendGrid"].includes(answers.service),
        },
        {
          type: "password",
          name: "pass",
          message: "Password/API key:",
          when: (answers) => ["SMTP", "Gmail", "SendGrid"].includes(answers.service),
        },
        {
          type: "input",
          name: "from",
          message: "From email address:",
          default: "ecosure-migration@example.com",
        },
      ])

      let config: any = {
        from: answers.from,
      }

      if (answers.service === "SMTP") {
        config = {
          ...config,
          host: answers.host,
          port: answers.port,
          secure: answers.secure,
          auth: {
            user: answers.user,
            pass: answers.pass,
          },
        }
      } else if (answers.service === "Gmail") {
        config = {
          ...config,
          service: "gmail",
          auth: {
            user: answers.user,
            pass: answers.pass,
          },
        }
      } else if (answers.service === "SendGrid") {
        config = {
          ...config,
          host: "smtp.sendgrid.net",
          port: 587,
          secure: false,
          auth: {
            user: "apikey",
            pass: answers.pass,
          },
        }
      } else if (answers.service === "Custom") {
        const customConfig = await inquirer.prompt([
          {
            type: "editor",
            name: "config",
            message: "Enter custom email configuration (JSON):",
            default: JSON.stringify(
              {
                host: "smtp.example.com",
                port: 587,
                secure: false,
                auth: {
                  user: "user@example.com",
                  pass: "password",
                },
                from: "ecosure-migration@example.com",
              },
              null,
              2,
            ),
          },
        ])

        try {
          config = JSON.parse(customConfig.config)
        } catch (error) {
          console.error(chalk.red(`Invalid JSON: ${error.message}`))
          process.exit(1)
        }
      }

      // Save config
      const configDir = path.join(__dirname, "..", "config")
      if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir, { recursive: true })
      }

      fs.writeFileSync(path.join(configDir, "email-config.json"), JSON.stringify(config, null, 2))
      console.log(chalk.green("Email configuration saved."))

      // Test email
      const testEmail = await inquirer.prompt([
        {
          type: "confirm",
          name: "sendTest",
          message: "Send a test email?",
          default: true,
        },
        {
          type: "input",
          name: "to",
          message: "Recipient email address:",
          when: (answers) => answers.sendTest,
        },
      ])

      if (testEmail.sendTest) {
        const spinner = createSpinner("Sending test email...").start()

        try {
          const transporter = nodemailer.createTransport(config)
          await transporter.sendMail({
            from: config.from,
            to: testEmail.to,
            subject: "EcoSure Migration - Test Email",
            text: "This is a test email from the EcoSure Migration Scheduler.",
          })

          spinner.success({ text: "Test email sent successfully!" })
        } catch (error) {
          spinner.error({ text: `Failed to send test email: ${error.message}` })
        }
      }
    })

  // Parse command line arguments
  program.parse(process.argv)

  // If no command is provided, show help
  if (!process.argv.slice(2).length) {
    program.outputHelp()
  }
}

// Run the script
main().catch((error) => {
  console.error(chalk.red(`Unhandled error: ${error.message}`))
  process.exit(1)
})
