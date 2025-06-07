/**
 * This file provides examples of common migration dependency patterns
 * for the EcoSure Insurance App migration scheduler.
 */

// Example 1: Sequential Migration Chain
// This pattern ensures migrations run in a specific order
const sequentialMigrationExample = {
  // Step 1: Migrate user accounts
  usersMigration: {
    name: "Users Migration",
    cronExpression: "0 1 * * *", // 1 AM daily
    dependencies: [], // No dependencies
    collections: ["users"],
  },

  // Step 2: Migrate policies (depends on users)
  policiesMigration: {
    name: "Policies Migration",
    cronExpression: "0 2 * * *", // 2 AM daily
    dependencies: ["usersMigration"], // Depends on users migration
    collections: ["policies"],
  },

  // Step 3: Migrate claims (depends on policies)
  claimsMigration: {
    name: "Claims Migration",
    cronExpression: "0 3 * * *", // 3 AM daily
    dependencies: ["policiesMigration"], // Depends on policies migration
    collections: ["claims"],
  },

  // Step 4: Migrate payments (depends on policies)
  paymentsMigration: {
    name: "Payments Migration",
    cronExpression: "0 4 * * *", // 4 AM daily
    dependencies: ["policiesMigration"], // Depends on policies migration
    collections: ["payments"],
  },
}

// Example 2: Fan-out Pattern
// One migration triggers multiple parallel migrations
const fanOutExample = {
  // Step 1: Migrate schema changes
  schemaMigration: {
    name: "Schema Migration",
    cronExpression: "0 0 * * 0", // Midnight on Sundays
    dependencies: [], // No dependencies
    collections: ["schema_versions"],
  },

  // These migrations all depend on the schema migration
  // but can run in parallel with each other
  userDataMigration: {
    name: "User Data Migration",
    cronExpression: "0 1 * * 0", // 1 AM on Sundays
    dependencies: ["schemaMigration"],
    collections: ["users"],
  },

  policyDataMigration: {
    name: "Policy Data Migration",
    cronExpression: "0 1 * * 0", // 1 AM on Sundays
    dependencies: ["schemaMigration"],
    collections: ["policies"],
  },

  claimDataMigration: {
    name: "Claim Data Migration",
    cronExpression: "0 1 * * 0", // 1 AM on Sundays
    dependencies: ["schemaMigration"],
    collections: ["claims"],
  },
}

// Example 3: Fan-in Pattern
// Multiple migrations must complete before a final migration
const fanInExample = {
  // These migrations run independently
  usersMigration: {
    name: "Users Migration",
    cronExpression: "0 1 * * 1", // 1 AM on Mondays
    dependencies: [],
    collections: ["users"],
  },

  policiesMigration: {
    name: "Policies Migration",
    cronExpression: "0 1 * * 1", // 1 AM on Mondays
    dependencies: [],
    collections: ["policies"],
  },

  claimsMigration: {
    name: "Claims Migration",
    cronExpression: "0 1 * * 1", // 1 AM on Mondays
    dependencies: [],
    collections: ["claims"],
  },

  // This migration depends on all the above migrations
  reportingMigration: {
    name: "Reporting Data Migration",
    cronExpression: "0 3 * * 1", // 3 AM on Mondays
    dependencies: ["usersMigration", "policiesMigration", "claimsMigration"],
    collections: ["reporting_data"],
    dependencyStrategy: "wait", // Wait for all dependencies
    dependencyTimeout: 120, // Wait up to 2 hours
  },
}

// Example 4: Complex DAG (Directed Acyclic Graph)
// A more complex dependency structure
const complexDagExample = {
  // Base migrations
  schemaV1Migration: {
    name: "Schema V1 Migration",
    cronExpression: "0 0 1 * *", // Midnight on 1st of month
    dependencies: [],
  },

  legacyDataMigration: {
    name: "Legacy Data Migration",
    cronExpression: "0 1 1 * *", // 1 AM on 1st of month
    dependencies: ["schemaV1Migration"],
  },

  // Mid-level migrations
  usersMigration: {
    name: "Users Migration",
    cronExpression: "0 2 1 * *", // 2 AM on 1st of month
    dependencies: ["schemaV1Migration", "legacyDataMigration"],
  },

  configMigration: {
    name: "Configuration Migration",
    cronExpression: "0 2 1 * *", // 2 AM on 1st of month
    dependencies: ["schemaV1Migration"],
  },

  // Dependent migrations
  policiesMigration: {
    name: "Policies Migration",
    cronExpression: "0 3 1 * *", // 3 AM on 1st of month
    dependencies: ["usersMigration", "configMigration"],
  },

  claimsMigration: {
    name: "Claims Migration",
    cronExpression: "0 4 1 * *", // 4 AM on 1st of month
    dependencies: ["policiesMigration"],
  },

  // Final migrations
  analyticsDataMigration: {
    name: "Analytics Data Migration",
    cronExpression: "0 5 1 * *", // 5 AM on 1st of month
    dependencies: ["policiesMigration", "claimsMigration"],
  },

  reportingDataMigration: {
    name: "Reporting Data Migration",
    cronExpression: "0 5 1 * *", // 5 AM on 1st of month
    dependencies: ["policiesMigration", "claimsMigration"],
  },
}

// Example 5: Dependency Strategies
const dependencyStrategiesExample = {
  // Critical migration - must succeed
  criticalMigration: {
    name: "Critical Data Migration",
    cronExpression: "0 1 * * *",
    dependencies: [],
    collections: ["critical_data"],
  },

  // This migration will fail if criticalMigration fails
  dependentFailMigration: {
    name: "Dependent Migration (Fail Strategy)",
    cronExpression: "0 2 * * *",
    dependencies: ["criticalMigration"],
    dependencyStrategy: "fail", // Default strategy
    collections: ["dependent_data_1"],
  },

  // This migration will run even if criticalMigration fails
  dependentSkipMigration: {
    name: "Dependent Migration (Skip Strategy)",
    cronExpression: "0 2 * * *",
    dependencies: ["criticalMigration"],
    dependencyStrategy: "skip",
    collections: ["dependent_data_2"],
  },

  // This migration will wait for criticalMigration to complete
  dependentWaitMigration: {
    name: "Dependent Migration (Wait Strategy)",
    cronExpression: "0 2 * * *",
    dependencies: ["criticalMigration"],
    dependencyStrategy: "wait",
    dependencyTimeout: 60, // Wait up to 1 hour
    collections: ["dependent_data_3"],
  },
}

// How to create these migrations using the CLI
console.log(`
To create a sequential migration chain:

# Step 1: Create the users migration
npm run schedule -- create --name "Users Migration" --cron "0 1 * * *" --collections "users"

# Step 2: Create the policies migration (depends on users)
npm run schedule -- create --name "Policies Migration" --cron "0 2 * * *" --collections "policies" --dependencies "<users-migration-id>"

# Step 3: Create the claims migration (depends on policies)
npm run schedule -- create --name "Claims Migration" --cron "0 3 * * *" --collections "claims" --dependencies "<policies-migration-id>"

# View the dependency graph
npm run schedule -- dependencies --graph
`)
