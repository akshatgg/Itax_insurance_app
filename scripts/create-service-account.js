#!/usr/bin/env node

/**
 * This script helps create service account credential files for different environments
 */

const fs = require("fs")
const path = require("path")
const inquirer = require("inquirer")
const chalk = require("chalk")

async function main() {
  console.log(chalk.blue("Firebase Service Account Creator"))
  console.log(chalk.blue("--------------------------------"))
  console.log(
    chalk.yellow("This script will help you create service account credential files for different environments."),
  )
  console.log(chalk.yellow("You need to download service account JSON files from the Firebase console first."))
  console.log(chalk.yellow("Go to Project Settings > Service accounts > Generate new private key"))
  console.log("")

  const { environment } = await inquirer.prompt([
    {
      type: "list",
      name: "environment",
      message: "Select the environment:",
      choices: ["development", "staging", "production", "custom"],
    },
  ])

  let envName = environment

  if (environment === "custom") {
    const { customName } = await inquirer.prompt([
      {
        type: "input",
        name: "customName",
        message: "Enter a name for this custom environment:",
        validate: (input) => (input.trim() !== "" ? true : "Name cannot be empty"),
      },
    ])
    envName = customName
  }

  const { serviceAccountPath } = await inquirer.prompt([
    {
      type: "input",
      name: "serviceAccountPath",
      message: `Enter the path to the ${envName} service account JSON file:`,
      validate: (input) => {
        if (!fs.existsSync(input)) {
          return "File does not exist"
        }
        try {
          const content = fs.readFileSync(input, "utf8")
          JSON.parse(content)
          return true
        } catch (error) {
          return "Invalid JSON file"
        }
      },
    },
  ])

  // Create credentials directory if it doesn't exist
  const credentialsDir = path.join(__dirname, "..", "credentials")
  if (!fs.existsSync(credentialsDir)) {
    fs.mkdirSync(credentialsDir, { recursive: true })
  }

  // Copy the service account file
  const fileName = environment === "custom" ? `${envName}-service-account.json` : `${environment}-service-account.json`

  const destPath = path.join(credentialsDir, fileName)

  fs.copyFileSync(serviceAccountPath, destPath)

  console.log(chalk.green(`Service account file for ${envName} environment saved to:`))
  console.log(chalk.green(destPath))

  // Add to .gitignore if it's not already there
  const gitignorePath = path.join(__dirname, "..", ".gitignore")
  let gitignoreContent = ""

  if (fs.existsSync(gitignorePath)) {
    gitignoreContent = fs.readFileSync(gitignorePath, "utf8")
  }

  if (!gitignoreContent.includes("credentials/")) {
    gitignoreContent += "\n# Firebase service account credentials\ncredentials/\n"
    fs.writeFileSync(gitignorePath, gitignoreContent)
    console.log(chalk.green("Added credentials/ to .gitignore"))
  }

  console.log(chalk.blue("\nDone! You can now use this service account for data migration."))
}

main().catch((error) => {
  console.error(chalk.red(`Error: ${error.message}`))
  process.exit(1)
})
