# EcoSure Migration Scheduler

This document provides instructions for scheduling data migrations between different Firebase environments (development, staging, production) for the EcoSure insurance app.

## Overview

The Migration Scheduler allows you to:

1. Schedule migrations to run at specific times (e.g., during off-peak hours)
2. Set up recurring migrations with cron expressions
3. Receive notifications when migrations complete
4. Monitor migration status and logs
5. Run migrations immediately when needed
6. Define dependencies between migrations to ensure proper execution order

## Prerequisites

Before you begin, make sure you have:

1. Firebase service account JSON files for each environment
2. Node.js and npm installed
3. Proper access permissions to all Firebase projects
4. (Optional) SMTP server details for email notifications
5. (Optional) Slack webhook URL for Slack notifications

## Installation

Make sure all dependencies are installed:

\`\`\`bash
npm install
\`\`\`

## Usage

### Listing Scheduled Migrations

To see all scheduled migrations:

\`\`\`bash
npm run schedule-list
\`\`\`

### Creating a New Scheduled Migration

To create a new scheduled migration interactively:

\`\`\`bash
npm run schedule-create
\`\`\`

Or with command line options:

\`\`\`bash
npm run schedule -- create --name "Nightly Sync" --cron "0 2 * * *" --source development --target staging
\`\`\`

### Common Cron Expressions

- `0 2 * * *` - Every day at 2:00 AM
- `0 2 * * 0` - Every Sunday at 2:00 AM
- `0 2 1 * *` - First day of every month at 2:00 AM
- `0 */4 * * *` - Every 4 hours
- `0 0-5 * * *` - Every hour from midnight to 5:00 AM

### Updating a Scheduled Migration

To update an existing scheduled migration:

\`\`\`bash
npm run schedule-update <id>
\`\`\`

### Deleting a Scheduled Migration

To delete a scheduled migration:

\`\`\`bash
npm run schedule-delete <id>
\`\`\`

### Starting/Stopping a Scheduled Migration

To start a disabled migration:

\`\`\`bash
npm run schedule-start <id>
\`\`\`

To stop (disable) a migration:

\`\`\`bash
npm run schedule-stop <id>
\`\`\`

### Running a Migration Immediately

To run a scheduled migration immediately:

\`\`\`bash
npm run schedule-run-now <id>
\`\`\`

## Working with Dependencies

The scheduler supports dependencies between migrations, ensuring they run in the correct order.

### Viewing Dependencies

To view dependencies for a specific migration:

\`\`\`bash
npm run schedule-dependencies <id>
\`\`\`

To view all dependencies:

\`\`\`bash
npm run schedule-dependencies
\`\`\`

To view a dependency graph:

\`\`\`bash
npm run schedule-dependencies -- --graph
\`\`\`

### Setting Up Dependencies

When creating or updating a migration, you can specify:

1. **Dependencies**: IDs of migrations that must complete before this one runs
2. **Dependency Strategy**: How to handle dependency failures
   - `fail`: Don't run if dependencies failed (default)
   - `skip`: Run even if dependencies failed
   - `wait`: Wait for dependencies to complete
3. **Dependency Timeout**: How long to wait for dependencies (for `wait` strategy)

Example:

\`\`\`bash
npm run schedule -- create --name "User Data Migration" --dependencies "abc123,def456" --dependency-strategy "wait" --dependency-timeout 120
\`\`\`

### Dependency Strategies

- **Fail**: If any dependency fails, this migration will not run
- **Skip**: Run this migration even if dependencies failed
- **Wait**: Wait for dependencies to complete, up to the specified timeout

### Circular Dependencies

The scheduler automatically detects and prevents circular dependencies. If you try to create a circular dependency, you'll receive an error message.

## Running the Scheduler Daemon

The scheduler daemon needs to be running for scheduled migrations to execute at their specified times.

### Starting the Daemon

To start the scheduler daemon in the background:

\`\`\`bash
npm run schedule-daemon
\`\`\`

To run it in the foreground (for debugging):

\`\`\`bash
npm run schedule-daemon -- --no-detach
\`\`\`

### Stopping the Daemon

To stop the scheduler daemon:

\`\`\`bash
npm run schedule-daemon-stop
\`\`\`

## Setting Up Notifications

### Email Notifications

To set up email notifications:

\`\`\`bash
npm run setup-email
\`\`\`

This will guide you through configuring SMTP settings or other email providers.

### Slack Notifications

To set up Slack notifications, you'll need to create a Slack webhook URL:

1. Go to your Slack workspace
2. Create a new app (or use an existing one)
3. Enable Incoming Webhooks
4. Create a new webhook URL
5. Use this URL when creating or updating a scheduled migration

## Logs and Monitoring

### Migration Logs

Logs for scheduled migrations are stored in:

- `logs/scheduled/<migration-id>-<timestamp>-stdout.log` - Standard output
- `logs/scheduled/<migration-id>-<timestamp>-stderr.log` - Standard error

### Daemon Logs

The scheduler daemon logs are stored in the system's standard location for daemon logs.

## Best Practices

1. **Schedule during off-peak hours** to minimize impact on users
2. **Set up notifications** to be alerted of migration status
3. **Review logs regularly** to ensure migrations are running successfully
4. **Test migrations** with dry runs before scheduling them
5. **Use specific collections** rather than migrating everything
6. **Include backups** in your scheduled migrations
7. **Design dependency chains carefully** to ensure proper data flow
8. **Use the "wait" strategy** for critical dependencies
9. **Set reasonable timeouts** for waiting on dependencies

## Dependency Examples

### Sequential Data Migration

For a complete data migration that needs to happen in sequence:

1. Create a "Users Migration" as the first step
2. Create a "Policies Migration" that depends on "Users Migration"
3. Create a "Claims Migration" that depends on "Policies Migration"

### Parallel with Dependencies

For migrations that can run in parallel but depend on a common prerequisite:

1. Create a "Schema Migration" as the prerequisite
2. Create multiple data migrations that all depend on "Schema Migration"
3. These will run in parallel once "Schema Migration" completes

### Complex Workflows

For more complex scenarios:

1. Create a DAG (Directed Acyclic Graph) of migrations
2. Use the `--graph` option to visualize the dependencies
3. Test the workflow with `run-now` before scheduling

## Troubleshooting

### Common Issues

1. **Daemon not running**: Check if the daemon is running with `ps aux | grep schedule-migration`
2. **Migrations not executing**: Check the daemon logs for errors
3. **Email notifications not working**: Verify your SMTP settings
4. **Permission errors**: Ensure service account files have proper permissions
5. **Dependency errors**: Check for circular dependencies or missing migrations

### Checking Daemon Status

To check if the daemon is running:

\`\`\`bash
if [ -f "pids/scheduler.pid" ]; then
  pid=$(cat pids/scheduler.pid)
  if ps -p $pid > /dev/null; then
    echo "Scheduler daemon is running with PID $pid"
  else
    echo "Scheduler daemon is not running (stale PID file)"
  fi
else
  echo "Scheduler daemon is not running (no PID file)"
fi
\`\`\`

## Security Considerations

1. Service account files contain sensitive credentials - never commit them to version control
2. The scheduler daemon has access to all environments - run it on a secure server
3. Be careful when scheduling migrations that include sensitive data
4. Use environment-specific transformations to sanitize data when appropriate
