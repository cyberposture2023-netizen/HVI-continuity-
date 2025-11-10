#!/usr/bin/env pwsh

Write-Host "🎯 FINAL BUILD & TEST VERIFICATION - Step 25.3" -ForegroundColor Magenta
Write-Host "============================================" -ForegroundColor Magenta

function Test-FrontendBuild {
    Write-Host "`n🏗️ Testing Frontend Build..." -ForegroundColor Cyan
    Set-Location "frontend"
    
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install *>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Frontend dependency installation failed" -ForegroundColor Red
        Set-Location ".."
        return $false
    }
    
    Write-Host "Building frontend..." -ForegroundColor Yellow
    $buildResult = npm run build 2>&1
    if ($LASTEXITCODE -eq 0 -and (Test-Path "build")) {
        Write-Host "✅ Frontend build successful" -ForegroundColor Green
        Set-Location ".."
        return $true
    } else {
        Write-Host "❌ Frontend build failed" -ForegroundColor Red
        Write-Host "Build errors:" -ForegroundColor Red
        Write-Host $buildResult -ForegroundColor Red
        Set-Location ".."
        return $false
    }
}

function Test-BackendTests {
    Write-Host "`n🧪 Running Backend Tests..." -ForegroundColor Cyan
    Set-Location "backend"
    
    Write-Host "Installing test dependencies..." -ForegroundColor Yellow
    npm install *>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Backend dependency installation failed" -ForegroundColor Red
        Set-Location ".."
        return $false
    }
    
    Write-Host "Running integration tests..." -ForegroundColor Yellow
    $testResult = npm test 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Backend tests passed" -ForegroundColor Green
        Set-Location ".."
        return $true
    } else {
        Write-Host "❌ Backend tests failed" -ForegroundColor Red
        Write-Host "Test output:" -ForegroundColor Red
        Write-Host $testResult -ForegroundColor Red
        Set-Location ".."
        return $false
    }
}

function Test-BackendServer {
    Write-Host "`n🔧 Testing Backend Server..." -ForegroundColor Cyan
    
    # Cleanup
    try {
        Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue | ForEach-Object {
            Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue
        }
        Start-Sleep -Seconds 2
    } catch { }
    
    # Start server
    $serverProcess = Start-Process -FilePath "node" -ArgumentList "server.js" -PassThru -NoNewWindow
    
    # Wait for startup
    Start-Sleep -Seconds 5
    
    # Test endpoints
    try {
        $health = Invoke-RestMethod -Uri "http://localhost:5000/api/health" -Method GET -TimeoutSec 5
        Write-Host "✅ Backend server running: $($health.message)" -ForegroundColor Green
        $serverOk = $true
    } catch {
        Write-Host "❌ Backend server not responding" -ForegroundColor Red
        $serverOk = $false
    }
    
    # Cleanup
    if ($serverProcess) {
        Stop-Process -Id $serverProcess.Id -Force -ErrorAction SilentlyContinue
    }
    
    return $serverOk
}

# Main execution
try {
    $frontendBuild = Test-FrontendBuild
    $backendTests = Test-BackendTests
    $backendServer = Test-BackendServer
    
    Write-Host "`n📊 FINAL RESULTS" -ForegroundColor Magenta
    Write-Host "==============" -ForegroundColor Magenta
    Write-Host "Frontend Build: $(if ($frontendBuild) { '✅ PASS' } else { '❌ FAIL' })" -ForegroundColor $(if ($frontendBuild) { "Green" } else { "Red" })
    Write-Host "Backend Tests: $(if ($backendTests) { '✅ PASS' } else { '❌ FAIL' })" -ForegroundColor $(if ($backendTests) { "Green" } else { "Red" })
    Write-Host "Backend Server: $(if ($backendServer) { '✅ PASS' } else { '❌ FAIL' })" -ForegroundColor $(if ($backendServer) { "Green" } else { "Red" })
    
    if ($frontendBuild -and $backendTests -and $backendServer) {
        Write-Host "`n🎉 PLATFORM VERIFICATION COMPLETE - ALL SYSTEMS OPERATIONAL!" -ForegroundColor Green
        Write-Host "The HVI Continuity Platform is ready for deployment." -ForegroundColor White
        exit 0
    } else {
        Write-Host "`n⚠️ Some components need attention before deployment." -ForegroundColor Yellow
        exit 1
    }
}
catch {
    Write-Host "❌ Verification failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
