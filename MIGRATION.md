# EcoSure Data Migration Guide

This document provides instructions for migrating data between different Firebase environments (development, staging, production) for the EcoSure insurance app.

## Prerequisites

Before you begin, make sure you have:

1. Firebase service account JSON files for each environment
2. Node.js and npm installed
3. Firebase CLI installed globally (`npm install -g firebase-tools`)
4. Proper access permissions to all Firebase projects

## Setup

### 1. Create Service Account Files

First, create service account files for each environment:

\`\`\`bash
npm run create-service-account
\`\`\`

This interactive script will guide you through creating service account files for different environments. You'll need to download service account JSON files from the Firebase console first:

1. Go to Firebase Console > Project Settings > Service accounts
2. Click "Generate new private key"
3. Save the JSON file
4. Run the script and provide the path to the downloaded JSON file

### 2. Install Dependencies

Make sure all dependencies are installed:

\`\`\`bash
npm install
\`\`\`

## Running Migrations

### Interactive Mode

The easiest way to run a migration is using interactive mode:

\`\`\`bash
npm run migrate-interactive
\`\`\`

This will guide you through the migration process with prompts for:

- Source environment
- Target environment
- Collections to migrate
- Query filters
- Dry run option
- Batch size
- User collection inclusion
- Data transformation options
- Backup options

### Command Line Mode

For automated scripts or CI/CD pipelines, you can use command line mode:

\`\`\`bash
npm run migrate -- --source development --target staging --collections users,insuranceApplications --dry-run
\`\`\`

Available options:

- `-s, --source <env>`: Source environment (development, staging, production, custom)
- `-t, --target <env>`: Target environment (development, staging, production, custom)
- `-c, --collections <collections>`: Comma-separated list of collections to migrate
- `-q, --query <query>`: Query to filter documents (e.g., "status == pending")
- `-d, --dry-run`: Perform a dry run without writing data
- `-b, --batch-size <size>`: Batch size for writes (default: 500)
- `-u, --include-users`: Include users collection in migration
- `-t, --transform-data`: Transform data during migration
- `-b, --backup`: Create backup before migration
- `--source-credentials <path>`: Path to custom source credentials JSON file
- `--target-credentials <path>`: Path to custom target credentials JSON file

## Restoring Backups

If you need to restore a backup:

\`\`\`bash
npm run restore-backup
\`\`\`

This interactive script will:

1. Show available backups
2. Let you select collections to restore
3. Ask for the target environment
4. Confirm before restoring

## Data Transformations

The migration script automatically transforms data based on the source and target environments:

1. Updates storage URLs to match the target environment
2. Sanitizes sensitive data when migrating to non-production environments:
   - Masks PAN numbers
   - Masks Aadhaar numbers
   - Masks phone numbers

You can customize these transformations in the `transformData` function in `scripts/migrate-data.ts`.

## Best Practices

1. **Always run a dry run first** to see what would be migrated without making changes
2. **Create backups** before migrations (enabled by default)
3. **Test in development** before migrating to production
4. **Be selective** with collections to migrate - only migrate what you need
5. **Schedule migrations** during low-traffic periods
6. **Check logs** after migration to verify success

## Troubleshooting

### Common Issues

1. **Authentication errors**: Make sure your service account files are correct and have proper permissions
2. **Rate limiting**: Large migrations might hit Firestore rate limits. Try reducing batch size or adding delays
3. **Missing collections**: Verify collection names and check if they exist in the source environment
4. **Transformation errors**: Check the transformation logic if you see errors during data transformation

### Logs

Migration logs are stored in the `logs` directory with timestamps. Check these logs for details about any failed migrations.

## Security Considerations

1. Service account files contain sensitive credentials - never commit them to version control
2. The `.gitignore` file is automatically updated to exclude the `credentials` directory
3. Be careful when migrating user data - consider privacy regulations like GDPR
4. Sanitize sensitive data when migrating to non-production environments
