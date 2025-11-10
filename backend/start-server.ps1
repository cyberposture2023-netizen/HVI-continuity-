# Fixed Demo Launcher - Shows Server Window
$ErrorActionPreference = "Stop"
Write-Host "🚀 Starting HVI Continuity Platform Demo..." -ForegroundColor Cyan

# Check Node.js
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed." -ForegroundColor Red
    exit 1
}

# Stop any existing Node processes
Write-Host "🔄 Stopping any existing servers..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

# Install dependencies if needed
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
}

# Start the server in current window
Write-Host "🎯 Starting backend server..." -ForegroundColor Green
Write-Host "📊 Server will run in THIS window. Open a NEW window to run tests." -ForegroundColor Yellow
Write-Host "🔗 API will be available at: http://localhost:3001" -ForegroundColor Cyan
node server.js
