#!/usr/bin/env pwsh

Write-Host "🚀 FINAL PLATFORM VERIFICATION - Step 25.1" -ForegroundColor Magenta
Write-Host "=========================================" -ForegroundColor Magenta

function Test-Backend {
    Write-Host "`n🔧 Testing Backend..." -ForegroundColor Cyan
    
    # Kill any existing processes
    try {
        Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue | ForEach-Object {
            Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue
        }
        Start-Sleep -Seconds 2
    } catch { }
    
    # Start backend
    $backendProcess = Start-Process -FilePath "node" -ArgumentList "backend/server.js" -PassThru -NoNewWindow
    
    # Wait for startup
    $maxWait = 20
    $waitCount = 0
    $backendReady = $false
    
    while ($waitCount -lt $maxWait -and -not $backendReady) {
        try {
            $response = Invoke-RestMethod -Uri "http://localhost:5000/api/health" -Method GET -TimeoutSec 2
            if ($response.status -eq "ok") {
                $backendReady = $true
                Write-Host "✅ Backend server started" -ForegroundColor Green
            }
        } catch {
            $waitCount++
            Start-Sleep -Seconds 1
        }
    }
    
    if (-not $backendReady) {
        Write-Host "❌ Backend failed to start" -ForegroundColor Red
        return $null
    }
    
    return $backendProcess
}

function Test-FrontendBuild {
    Write-Host "`n🏗️ Testing Frontend Build..." -ForegroundColor Cyan
    
    Set-Location "frontend"
    
    # Clean previous build
    if (Test-Path "build") {
        Remove-Item -Recurse -Force "build"
    }
    
    # Build
    npm run build *>$null
    if ($LASTEXITCODE -eq 0 -and (Test-Path "build")) {
        Write-Host "✅ Frontend build successful" -ForegroundColor Green
        Set-Location ".."
        return $true
    } else {
        Write-Host "❌ Frontend build failed" -ForegroundColor Red
        Set-Location ".."
        return $false
    }
}

function Test-IntegrationTests {
    Write-Host "`n🧪 Running Integration Tests..." -ForegroundColor Cyan
    
    Set-Location "backend"
    $env:NODE_ENV = "test"
    npm test *>$null
    $testResult = $LASTEXITCODE
    Set-Location ".."
    
    if ($testResult -eq 0) {
        Write-Host "✅ Integration tests passed" -ForegroundColor Green
        return $true
    } else {
        Write-Host "❌ Integration tests failed" -ForegroundColor Red
        return $false
    }
}

# Main test sequence
try {
    $backendProcess = Test-Backend
    if (-not $backendProcess) {
        Write-Host "`n❌ PLATFORM VERIFICATION FAILED - Backend issues" -ForegroundColor Red
        exit 1
    }
    
    $frontendOk = Test-FrontendBuild
    $testsOk = Test-IntegrationTests
    
    # Cleanup
    if ($backendProcess) {
        Stop-Process -Id $backendProcess.Id -Force -ErrorAction SilentlyContinue
    }
    
    # Final verdict
    Write-Host "`n📊 FINAL VERIFICATION RESULTS" -ForegroundColor Magenta
    Write-Host "===========================" -ForegroundColor Magenta
    Write-Host "Backend: ✅ OPERATIONAL" -ForegroundColor Green
    Write-Host "Frontend Build: $(if ($frontendOk) { '✅ PASS' } else { '❌ FAIL' })" -ForegroundColor $(if ($frontendOk) { "Green" } else { "Red" })
    Write-Host "Integration Tests: $(if ($testsOk) { '✅ PASS' } else { '❌ FAIL' })" -ForegroundColor $(if ($testsOk) { "Green" } else { "Red" })
    
    if ($frontendOk -and $testsOk) {
        Write-Host "`n🎉 PLATFORM VERIFICATION COMPLETE - READY FOR DEPLOYMENT!" -ForegroundColor Green
        Write-Host "All systems are fully operational and integrated." -ForegroundColor White
        exit 0
    } else {
        Write-Host "`n⚠️ Platform verification completed with some issues" -ForegroundColor Yellow
        exit 1
    }
}
catch {
    Write-Host "❌ Verification process failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
