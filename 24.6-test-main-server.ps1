#!/usr/bin/env pwsh

Write-Host "🚀 Testing Main Server Startup - Step 24.5" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Kill any existing processes on port 5000
try {
    Write-Host "Cleaning up port 5000..." -ForegroundColor Yellow
    $processes = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue
    foreach ($process in $processes) {
        Stop-Process -Id $process.OwningProcess -Force -ErrorAction SilentlyContinue
        Write-Host "Stopped process $($process.OwningProcess)" -ForegroundColor Yellow
    }
    Start-Sleep -Seconds 2
} catch {
    Write-Host "No processes to clean up" -ForegroundColor Green
}

# Start the main server
Write-Host "Starting main server..." -ForegroundColor Yellow
$serverProcess = Start-Process -FilePath "node" -ArgumentList "backend/server.js" -PassThru -NoNewWindow

# Wait for server to start
Write-Host "Waiting for server to start (10 seconds)..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Test endpoints
$success = $false
try {
    Write-Host "Testing server endpoints..." -ForegroundColor Yellow
    
    $healthResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/health" -Method GET -TimeoutSec 5
    Write-Host "✅ Health endpoint: $($healthResponse.status) - $($healthResponse.message)" -ForegroundColor Green
    
    $rootResponse = Invoke-RestMethod -Uri "http://localhost:5000/" -Method GET -TimeoutSec 5
    Write-Host "✅ Root endpoint: $($rootResponse.message)" -ForegroundColor Green
    
    Write-Host "🎉 Main server is working correctly!" -ForegroundColor Green
    $success = $true
} catch {
    Write-Host "❌ Server test failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Checking if server process is running..." -ForegroundColor Yellow
    if ($serverProcess -and -not $serverProcess.HasExited) {
        Write-Host "Server process is running but not responding. There may be route loading issues." -ForegroundColor Red
    } else {
        Write-Host "Server process has exited. Check the console output for errors." -ForegroundColor Red
    }
}

# Cleanup
if ($serverProcess -and -not $serverProcess.HasExited) {
    Write-Host "Stopping server..." -ForegroundColor Yellow
    Stop-Process -Id $serverProcess.Id -Force -ErrorAction SilentlyContinue
    Write-Host "✅ Server stopped" -ForegroundColor Green
}

if ($success) {
    Write-Host "`n🎉 SERVER STARTUP FIXED SUCCESSFULLY!" -ForegroundColor Green
    exit 0
} else {
    Write-Host "`n❌ Server still has issues. Need further debugging." -ForegroundColor Red
    exit 1
}
