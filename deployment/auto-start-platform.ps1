# HVI Continuity Platform - Auto Startup Script
Write-Host "HVI Continuity Platform - Auto Starting Services..." -ForegroundColor Green

# Kill any existing processes
Write-Host "Cleaning up existing processes..." -ForegroundColor Yellow
taskkill /F /IM node.exe 2>$null
Start-Sleep -Seconds 2

# Start Backend
Write-Host "Starting Backend Server..." -ForegroundColor Cyan
Start-Process -FilePath "node" -ArgumentList "backend\server.js" -WindowStyle Hidden -PassThru
Start-Sleep -Seconds 5

# Test backend
try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/health" -TimeoutSec 5
    Write-Host "Backend started successfully: $($response.status)" -ForegroundColor Green
} catch {
    Write-Host "Backend failed to start: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "Backend API: http://localhost:5000" -ForegroundColor Cyan
Write-Host "Frontend Dev: cd frontend && npm start" -ForegroundColor Yellow
Write-Host "Platform startup complete!" -ForegroundColor Green
