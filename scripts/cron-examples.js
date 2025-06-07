#!/usr/bin/env node

// This script provides examples of common cron expressions for scheduling migrations

const chalk = require("chalk")
const cron = require("node-cron")

console.log(chalk.blue("Common Cron Expressions for Migration Scheduling"))
console.log(chalk.blue("=============================================="))
console.log("")

const examples = [
  {
    expression: "0 2 * * *",
    description: "Every day at 2:00 AM",
    category: "Daily",
  },
  {
    expression: "0 2 * * 1-5",
    description: "Every weekday (Monday to Friday) at 2:00 AM",
    category: "Weekdays",
  },
  {
    expression: "0 2 * * 0,6",
    description: "Every weekend (Saturday and Sunday) at 2:00 AM",
    category: "Weekends",
  },
  {
    expression: "0 2 * * 1",
    description: "Every Monday at 2:00 AM",
    category: "Weekly",
  },
  {
    expression: "0 2 1 * *",
    description: "First day of every month at 2:00 AM",
    category: "Monthly",
  },
  {
    expression: "0 2 15 * *",
    description: "15th day of every month at 2:00 AM",
    category: "Monthly",
  },
  {
    expression: "0 2 1 1,4,7,10 *",
    description: "First day of each quarter (Jan, Apr, Jul, Oct) at 2:00 AM",
    category: "Quarterly",
  },
  {
    expression: "0 2 1 1 *",
    description: "January 1st at 2:00 AM (yearly)",
    category: "Yearly",
  },
  {
    expression: "0 */4 * * *",
    description: "Every 4 hours (at minute 0)",
    category: "Hourly",
  },
  {
    expression: "0 0,12 * * *",
    description: "Twice daily at midnight and noon",
    category: "Daily",
  },
  {
    expression: "0 22 * * 5",
    description: "Every Friday at 10:00 PM",
    category: "Weekly",
  },
  {
    expression: "0 0-5 * * *",
    description: "Every hour from midnight to 5:00 AM",
    category: "Off-peak Hours",
  },
  {
    expression: "0 0 * * * *",
    description: "Every hour at minute 0",
    category: "Hourly",
  },
]

// Group examples by category
const categories = {}
examples.forEach((example) => {
  if (!categories[example.category]) {
    categories[example.category] = []
  }
  categories[example.category].push(example)
})

// Display examples by category
Object.keys(categories)
  .sort()
  .forEach((category) => {
    console.log(chalk.green(`${category} Schedules:`))
    console.log(chalk.green("-".repeat(category.length + 11)))

    categories[category].forEach((example) => {
      console.log(`${chalk.yellow(example.expression)} - ${example.description}`)

      // Calculate next run times
      try {
        const task = cron.schedule(example.expression, () => {}, { scheduled: false })
        const nextDates = []
        let nextDate = task.nextDate()

        for (let i = 0; i < 3; i++) {
          nextDates.push(nextDate)
          // Move time forward slightly to get the next occurrence
          const nextDatePlus = new Date(nextDate.getTime() + 60000)
          task.stop()
          task.start({ scheduled: false, timezone: "UTC", startDate: nextDatePlus })
          nextDate = task.nextDate()
        }

        console.log(`   ${chalk.cyan("Next runs:")} ${nextDates.map((d) => d.toLocaleString()).join(", ")}`)
      } catch (error) {
        console.log(`   ${chalk.red("Error calculating next run times:")} ${error.message}`)
      }

      console.log("")
    })

    console.log("")
  })

console.log(chalk.blue("Tips for Scheduling Migrations:"))
console.log(chalk.blue("-----------------------------"))
console.log("1. Schedule migrations during off-peak hours to minimize impact on users")
console.log("2. Consider your application's usage patterns when choosing a schedule")
console.log("3. For large databases, schedule migrations during weekends or holidays")
console.log("4. Use incremental migrations (with queries) for very large datasets")
console.log("5. Always include backups in your scheduled migrations")
console.log("")
console.log(chalk.yellow("To use these expressions in the scheduler:"))
console.log(
  `npm run schedule -- create --name "My Migration" --cron "0 2 * * *" --source development --target production`,
)
console.log("")
