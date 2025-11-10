#!/usr/bin/env pwsh

Write-Host "🧪 Comprehensive Route Test - Step 24.7" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan

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

# Start the server
Write-Host "Starting server..." -ForegroundColor Yellow
$serverProcess = Start-Process -FilePath "node" -ArgumentList "backend/server.js" -PassThru -NoNewWindow

# Wait for server to start
Write-Host "Waiting for server to start (15 seconds)..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Test all endpoints
$successCount = 0
$totalTests = 0

function Test-Endpoint {
    param($Url, $Name)
    $totalTests++
    try {
        $response = Invoke-RestMethod -Uri $Url -Method GET -TimeoutSec 5
        Write-Host "✅ $Name - $($response.message)" -ForegroundColor Green
        $script:successCount++
        return $true
    } catch {
        Write-Host "❌ $Name - Failed: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

Write-Host "`nTesting all route endpoints..." -ForegroundColor Yellow

# Test basic endpoints
Test-Endpoint -Url "http://localhost:5000/api/health" -Name "Health Check"
Test-Endpoint -Url "http://localhost:5000/" -Name "Root Endpoint"

# Test route-specific endpoints
Test-Endpoint -Url "http://localhost:5000/api/auth/test/health" -Name "Auth Route"
Test-Endpoint -Url "http://localhost:5000/api/assessments/test/health" -Name "Assessments Route"
Test-Endpoint -Url "http://localhost:5000/api/questions/test/health" -Name "Questions Route"
Test-Endpoint -Url "http://localhost:5000/api/dashboard/test/health" -Name "Dashboard Route"
Test-Endpoint -Url "http://localhost:5000/api/users/test/health" -Name "Users Route"

# Summary
Write-Host "`n📊 TEST SUMMARY" -ForegroundColor Magenta
Write-Host "=============" -ForegroundColor Magenta
Write-Host "Passed: $successCount/$totalTests" -ForegroundColor $(if ($successCount -eq $totalTests) { "Green" } else { "Yellow" })

# Cleanup
if ($serverProcess -and -not $serverProcess.HasExited) {
    Write-Host "Stopping server..." -ForegroundColor Yellow
    Stop-Process -Id $serverProcess.Id -Force -ErrorAction SilentlyContinue
    Write-Host "✅ Server stopped" -ForegroundColor Green
}

if ($successCount -eq $totalTests) {
    Write-Host "`n🎉 ALL ROUTES ARE WORKING CORRECTLY!" -ForegroundColor Green
    Write-Host "The server is now ready for deployment." -ForegroundColor White
    exit 0
} else {
    Write-Host "`n⚠️ Some routes still have issues." -ForegroundColor Yellow
    Write-Host "Check the server console output for specific route loading errors." -ForegroundColor White
    exit 1
}
