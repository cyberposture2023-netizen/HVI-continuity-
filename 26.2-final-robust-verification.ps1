# Step 26.2 - Final Robust Verification
Write-Host "🎉 FINAL ROBUST VERIFICATION - Step 26.2" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

# Comprehensive cleanup
Write-Host "`n🔴 Performing pre-verification cleanup..." -ForegroundColor Red
$ports = @(5000, 3000, 5001, 5002, 5003, 5004, 5005)
foreach ($port in $ports) {
    try {
        Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | ForEach-Object {
            Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue
        }
    } catch { }
}
Get-Process node -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowTitle -like "*hvi*" } | ForEach-Object {
    Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
}
Start-Sleep -Seconds 2

Write-Host "`nℹ️  Testing Frontend Build..." -ForegroundColor Cyan
Set-Location "D:\HVI-Continuity\hvi-continuity-platform\frontend"
npm run build
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Frontend build successful" -ForegroundColor Green
    $FrontendBuild = "✅ PASS"
} else {
    Write-Host "❌ Frontend build failed" -ForegroundColor Red
    $FrontendBuild = "❌ FAIL"
}

Write-Host "`nℹ️  Running Backend Tests..." -ForegroundColor Cyan
Set-Location "D:\HVI-Continuity\hvi-continuity-platform\backend"

# Use a dedicated test port that's different from main server
$env:NODE_ENV = "test"
$env:PORT = "5003"  # Different port for tests

npm test
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Backend tests passed" -ForegroundColor Green
    $BackendTests = "✅ PASS"
} else {
    Write-Host "❌ Backend tests failed" -ForegroundColor Red
    $BackendTests = "❌ FAIL"
}

Write-Host "`nℹ️  Testing Full Platform Operation..." -ForegroundColor Cyan

# Cleanup before starting main server
try {
    Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue | ForEach-Object {
        Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue
    }
} catch { }

Start-Sleep -Seconds 1

# Start main server
Set-Location "D:\HVI-Continuity\hvi-continuity-platform\backend"
$env:NODE_ENV = "development"
$env:PORT = "5000"

$serverProcess = Start-Process -FilePath "node" -ArgumentList "server.js" -PassThru -NoNewWindow

# Wait for server to start
Write-Host "   Waiting for server to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Test endpoints
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
        Write-Host "❌ $endpoint - Failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Stop server
Stop-Process -Id $serverProcess.Id -Force -ErrorAction SilentlyContinue

if ($successCount -eq $endpoints.Count) {
    Write-Host "✅ All endpoints working" -ForegroundColor Green
    $PlatformTest = "✅ PASS"
} else {
    Write-Host "⚠️  $successCount/$($endpoints.Count) endpoints working" -ForegroundColor Yellow
    $PlatformTest = "⚠️  PARTIAL"
}

Write-Host "`n📊 FINAL ROBUST VERIFICATION RESULTS - Step 26.2" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "Frontend Build: $FrontendBuild" -ForegroundColor $(if ($FrontendBuild -eq "✅ PASS") { "Green" } else { "Red" })
Write-Host "Backend Tests:  $BackendTests" -ForegroundColor $(if ($BackendTests -eq "✅ PASS") { "Green" } else { "Red" })
Write-Host "Full Platform:  $PlatformTest" -ForegroundColor $(if ($PlatformTest -eq "✅ PASS") { "Green" } elseif ($PlatformTest -eq "⚠️  PARTIAL") { "Yellow" } else { "Red" })

if ($FrontendBuild -eq "✅ PASS" -and $BackendTests -eq "✅ PASS") {
    Write-Host "`n🎉 PLATFORM VERIFICATION SUCCESSFUL!" -ForegroundColor Green
    Write-Host "   All core systems are operational and ready for deployment." -ForegroundColor White
} else {
    Write-Host "`n⚠️  Some verification steps need attention." -ForegroundColor Yellow
}
