# 🔧 Troubleshooting Guide

## Common Installation Issues

### 1. **Missing tailwindcss-animate**
\`\`\`bash
# Quick Fix
npm install tailwindcss-animate

# Or remove from config
# Edit tailwind.config.js and remove require("tailwindcss-animate")
\`\`\`

### 2. **Node Version Issues**
\`\`\`bash
# Check Node version
node --version

# Should be 18+ for Next.js 15
# Update Node.js from https://nodejs.org
\`\`\`

### 3. **Cache Issues**
\`\`\`bash
# Clear all caches
npm run clean
npm run fresh-install
\`\`\`

### 4. **TypeScript Errors**
\`\`\`bash
# Regenerate TypeScript config
rm tsconfig.json
npx tsc --init
\`\`\`

### 5. **Port Already in Use**
\`\`\`bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
npm run dev -- -p 3001
\`\`\`

### 6. **Permission Errors (Windows)**
\`\`\`bash
# Run as Administrator
# Or use yarn instead of npm
npm install -g yarn
yarn install
yarn dev
\`\`\`

### 7. **Network/Proxy Issues**
\`\`\`bash
# Clear npm cache
npm cache clean --force

# Set registry
npm config set registry https://registry.npmjs.org/
\`\`\`

## Quick Commands

| Issue | Command |
|-------|---------|
| Fresh install | `npm run fresh-install` |
| Fix dependencies | `npm run fix-deps` |
| Check outdated | `npm run check-deps` |
| Clean build | `npm run clean && npm run build` |
| Force reinstall | `rm -rf node_modules && npm install` |

## Environment Setup

### Required Software:
- ✅ Node.js 18+
- ✅ npm 9+
- ✅ Git (optional)

### Optional Tools:
- 🔧 VS Code with extensions:
  - ES7+ React/Redux/React-Native snippets
  - Tailwind CSS IntelliSense
  - TypeScript Importer

## Still Having Issues?

1. **Check logs**: Look for specific error messages
2. **Update everything**: `npm update`
3. **Try yarn**: `yarn install && yarn dev`
4. **Restart system**: Sometimes helps with permission issues
5. **Check firewall**: Ensure port 3000 is not blocked
