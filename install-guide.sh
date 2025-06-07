#!/bin/bash

echo "🚀 SecureLife Insurance App - Installation Guide"
echo "================================================"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check Node.js
if command_exists node; then
    echo "✅ Node.js found: $(node --version)"
else
    echo "❌ Node.js not found. Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi

# Check npm
if command_exists npm; then
    echo "✅ npm found: $(npm --version)"
else
    echo "❌ npm not found. Please install npm"
    exit 1
fi

echo ""
echo "🔧 Starting installation process..."

# Clean previous installation
echo "🧹 Cleaning previous installation..."
rm -rf node_modules package-lock.json .next

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check for common issues
echo "🔍 Checking for common issues..."

# Check TypeScript
if [ ! -f "tsconfig.json" ]; then
    echo "⚠️  TypeScript config missing. Creating default..."
    npx tsc --init
fi

# Check Tailwind CSS
if [ ! -f "tailwind.config.js" ]; then
    echo "⚠️  Tailwind config missing. Creating default..."
    npx tailwindcss init -p
fi

# Build the project
echo "🏗️  Building project..."
npm run build

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Installation completed successfully!"
    echo "🚀 Run 'npm run dev' to start the development server"
    echo "🌐 Open http://localhost:3000 in your browser"
else
    echo ""
    echo "❌ Build failed. Please check the errors above."
    echo "💡 Try running: npm run fresh-install"
fi
