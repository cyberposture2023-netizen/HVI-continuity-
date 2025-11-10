# HVI Continuity Platform - One-Click Demo Launcher
$ErrorActionPreference = "Stop"
Write-Host "🚀 Starting HVI Continuity Platform Demo..." -ForegroundColor Cyan

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Check if MongoDB service is running
Write-Host "🔍 Checking MongoDB service..." -ForegroundColor Yellow
$mongoProcess = Get-Process -Name "mongod" -ErrorAction SilentlyContinue

if (-not $mongoProcess) {
    Write-Host "⚠️  MongoDB not running. Attempting to start..." -ForegroundColor Yellow
    try {
        Start-Process -FilePath "mongod" -ArgumentList "--dbpath", "C:\data\db" -WindowStyle Hidden
        Start-Sleep -Seconds 3
        Write-Host "✅ MongoDB started successfully" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to start MongoDB. Please ensure MongoDB is installed and configured." -ForegroundColor Red
        Write-Host "💡 You can download MongoDB from: https://www.mongodb.com/try/download/community" -ForegroundColor Yellow
    }
} else {
    Write-Host "✅ MongoDB is already running" -ForegroundColor Green
}

# Install dependencies if node_modules doesn't exist
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green
}

# Start the backend server
Write-Host "🔄 Starting backend server on port 3001..." -ForegroundColor Yellow
Start-Process -FilePath "node" -ArgumentList "server.js" -WindowStyle Normal
Start-Sleep -Seconds 3

# Test the API endpoints
Write-Host "🧪 Testing API endpoints..." -ForegroundColor Yellow
.\test-endpoints.ps1

Write-Host "🎉 Demo is now running!" -ForegroundColor Green
Write-Host "📊 Backend API available at: http://localhost:3001" -ForegroundColor Cyan
Write-Host "🔍 Health check: http://localhost:3001/api/health" -ForegroundColor Cyan
Write-Host "⏹️  To stop the demo, close the server window or press Ctrl+C" -ForegroundColor Yellow
