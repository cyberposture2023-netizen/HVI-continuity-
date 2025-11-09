# MongoDB Setup for HVI-Continuity Platform

## Option 1: Install MongoDB Locally
1. Download MongoDB Community Server from: https://www.mongodb.com/try/download/community
2. Run the installer with default settings
3. MongoDB will start automatically as a service

## Option 2: Use MongoDB Atlas (Cloud)
1. Go to: https://www.mongodb.com/cloud/atlas
2. Create a free account and cluster
3. Update your .env file:
   \\\
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hvi-continuity
   \\\

## Option 3: Use Docker
\\\ash
docker run -d -p 27017:27017 --name mongodb mongo:latest
\\\

## Verification
After installation, test with:
\\\ash
cd backend
node -e "require('mongoose').connect('mongodb://localhost:27017/hvi-continuity').then(() => console.log('Connected'), err => console.log('Error:', err.message))"
\\\

## Current Configuration
- Database: hvi-continuity
- Host: localhost:27017
- Connection String: mongodb://localhost:27017/hvi-continuity
