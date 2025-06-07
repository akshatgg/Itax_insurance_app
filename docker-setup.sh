#!/bin/bash

echo "🐳 Setting up Docker environment for Insurance App..."

# Create environment file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOL
# Firebase Configuration
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id

# Database Configuration
POSTGRES_DB=insurance_db
POSTGRES_USER=insurance_user
POSTGRES_PASSWORD=insurance_pass

# Redis Configuration
REDIS_URL=redis://redis:6379

# App Configuration
NODE_ENV=production
PORT=3000
EOL
    echo "✅ .env file created. Please update with your actual values."
fi

# Build and start services
echo "🏗️ Building Docker images..."
docker-compose build

echo "🚀 Starting services..."
docker-compose up -d

echo "✅ Insurance App is running!"
echo "🌐 Web App: http://localhost:3000"
echo "📊 Database: localhost:5432"
echo "🔄 Redis: localhost:6379"

# Show running containers
echo "📋 Running containers:"
docker-compose ps
