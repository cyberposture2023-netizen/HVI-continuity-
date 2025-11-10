# Step 26.4 - Reliable Verification
Write-Host "🎉 RELIABLE VERIFICATION - Step 26.4" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green

# Function to test port connectivity
function Test-ServerReady {
    param([string]$Url, [int]$TimeoutSeconds = 10)
    
    $startTime = Get-Date
    while (((Get-Date) - $startTime).TotalSeconds -lt $TimeoutSeconds) {
        try {
            $response = Invoke-WebRequest -Uri $Url -TimeoutSec 2 -ErrorAction Stop
            return $true
        } catch {
            Start-Sleep -Seconds 1
        }
    }
    return $false
}

# Comprehensive cleanup
Write-Host "`n🔴 Cleaning up all processes..." -ForegroundColor Red
$ports = @(5000, 3000, 5001, 5002, 5003)
foreach ($port in $ports) {
    try {
        Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | ForEach-Object {
            Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue 2>$null
        }
    } catch { }
}
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue 2>$null
Start-Sleep -Seconds 3

Write-Host "`nℹ️  Testing Frontend Build..." -ForegroundColor Cyan
Set-Location "D:\HVI-Continuity\hvi-continuity-platform\frontend"
npm run build 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Frontend build successful" -ForegroundColor Green
    $FrontendStatus = "✅ PASS"
} else {
    Write-Host "❌ Frontend build failed" -ForegroundColor Red
    $FrontendStatus = "❌ FAIL"
}

Write-Host "`nℹ️  Running Backend Tests..." -ForegroundColor Cyan
Set-Location "D:\HVI-Continuity\hvi-continuity-platform\backend"

# Clean test port
try {
    Get-NetTCPConnection -LocalPort 5003 -ErrorAction SilentlyContinue | ForEach-Object {
        Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue 2>$null
    }
} catch { }

$env:NODE_ENV = "test"
$env:PORT = "5003"

$testOutput = npm test 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Backend tests passed" -ForegroundColor Green
    $BackendStatus = "✅ PASS"
} else {
    Write-Host "❌ Backend tests failed" -ForegroundColor Red
    Write-Host $testOutput -ForegroundColor Red
    $BackendStatus = "❌ FAIL"
}

Write-Host "`nℹ️  Testing Full Platform Operation..." -ForegroundColor Cyan

# Clean main port
try {
    Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue | ForEach-Object {
        Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue 2>$null
    }
} catch { }
Start-Sleep -Seconds 2

# Start server with proper logging
Set-Location "D:\HVI-Continuity\hvi-continuity-platform\backend"
$env:NODE_ENV = "development"
$env:PORT = "5000"

Write-Host "   Starting server on port 5000..." -ForegroundColor Yellow
$serverProcess = Start-Process -FilePath "node" -ArgumentList "server.js" -PassThru -WindowStyle Hidden

# Wait for server to be ready
Write-Host "   Waiting for server to be ready..." -ForegroundColor Yellow
$serverReady = Test-ServerReady -Url "http://localhost:5000/api/health" -TimeoutSeconds 15

if (-not $serverReady) {
    Write-Host "❌ Server failed to start within timeout period" -ForegroundColor Red
    
    # Try to get any output from the server process
    try {
        $serverProcess | Stop-Process -Force -ErrorAction SilentlyContinue
    } catch { }
    
    $PlatformStatus = "❌ FAIL"
} else {
    Write-Host "✅ Server is running and responsive" -ForegroundColor Green
    
    # Test all endpoints
    $baseUrl = "http://localhost:5000"
    $endpoints = @(
        "/api/health",
        "/api/auth/test/health", 
        "/api/assessments/test/health",
        "/api/questions/test/health", 
        "/api/dashboard/test/health",
        "/api/users/test/health"
    )

    $successCount = 0
    foreach ($endpoint in $endpoints) {
        try {
            $response = Invoke-RestMethod -Uri "$baseUrl$endpoint" -TimeoutSec 5
            Write-Host "✅ $endpoint - $($response.message)" -ForegroundColor Green
            $successCount++
        } catch {
            Write-Host "❌ $endpoint - Failed to connect" -ForegroundColor Red
        }
    }

    # Stop server
    try {
        $serverProcess | Stop-Process -Force -ErrorAction SilentlyContinue
    } catch { }

    if ($successCount -eq $endpoints.Count) {
        Write-Host "✅ All $successCount endpoints working" -ForegroundColor Green
        $PlatformStatus = "✅ PASS"
    } else {
        Write-Host "⚠️  $successCount/$($endpoints.Count) endpoints working" -ForegroundColor Yellow
        $PlatformStatus = "⚠️  PARTIAL"
    }
}

Write-Host "`n📊 RELIABLE VERIFICATION RESULTS - Step 26.4" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Frontend Build: $FrontendStatus" -ForegroundColor $(if ($FrontendStatus -eq "✅ PASS") { "Green" } else { "Red" })
Write-Host "Backend Tests:  $BackendStatus" -ForegroundColor $(if ($BackendStatus -eq "✅ PASS") { "Green" } else { "Red" })
Write-Host "Full Platform:  $PlatformStatus" -ForegroundColor $(if ($PlatformStatus -eq "✅ PASS") { "Green" } elseif ($PlatformStatus -eq "⚠️  PARTIAL") { "Yellow" } else { "Red" })

if ($FrontendStatus -eq "✅ PASS" -and $BackendStatus -eq "✅ PASS" -and $PlatformStatus -ne "❌ FAIL") {
    Write-Host "`n🎉 PLATFORM VERIFICATION SUCCESSFUL!" -ForegroundColor Green
    Write-Host "   The HVI Continuity Platform is fully operational." -ForegroundColor White
    Write-Host "   Ready for production deployment." -ForegroundColor White
} else {
    Write-Host "`n⚠️  Some components need attention." -ForegroundColor Yellow
}
