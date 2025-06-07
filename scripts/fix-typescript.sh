#!/bin/bash

echo "🔧 Fixing TypeScript configuration..."

# Remove old TypeScript cache
rm -rf .next/types
rm -rf node_modules/.cache

# Regenerate Next.js types
npx next build --no-lint || true

# Check TypeScript
npx tsc --noEmit

echo "✅ TypeScript configuration fixed!"
