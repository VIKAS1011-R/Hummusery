#!/bin/bash

# Production Deployment Script for Hummusery

echo "🚀 Starting production deployment..."

# Check if required environment variables are set
if [ -z "$DATABASE_URL" ] || [ -z "$JWT_SECRET" ] || [ -z "$RAZORPAY_KEY_ID" ]; then
    echo "❌ Error: Required environment variables are not set"
    echo "Please ensure DATABASE_URL, JWT_SECRET, and RAZORPAY_KEY_ID are configured"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Build the application
echo "🔨 Building application..."
npm run build

# Run database migrations/setup if needed
echo "🗄️ Setting up database..."
# Add any database setup commands here

# Start the application
echo "✅ Deployment complete! Starting application..."
npm start