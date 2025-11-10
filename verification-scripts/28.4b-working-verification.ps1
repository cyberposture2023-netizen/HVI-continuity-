# HVI Continuity Platform - WORKING Verification Script
Write-Host "HVI Continuity Platform - WORKING Verification" -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Cyan

# Test Backend with GUARANTEED endpoints
Write-Host "1. Testing Backend Server..." -ForegroundColor Yellow

# Clean up first
taskkill /F /IM node.exe 2>$null
Start-Sleep -Seconds 3

# Start backend directly
Set-Location "backend"
$backendProcess = Start-Process -FilePath "node" -ArgumentList "server.js" -PassThru -WindowStyle Hidden
Write-Host "Backend server starting..." -ForegroundColor Gray
Start-Sleep -Seconds 8  # Give more time to start

# Test health endpoint with multiple attempts
Write-Host "Testing endpoints (multiple attempts)..." -ForegroundColor Gray
$healthSuccess = $false
for ($i = 1; $i -le 10; $i++) {
    try {
        Write-Host "  Attempt $i..." -NoNewline
        $response = Invoke-RestMethod -Uri "http://localhost:5000/api/health" -TimeoutSec 5
        if ($response.status -eq "healthy") {
            Write-Host " SUCCESS" -ForegroundColor Green
            Write-Host "  ✓ Health Check: $($response.status)" -ForegroundColor Green
            Write-Host "  ✓ Server: $($response.server)" -ForegroundColor Green
            Write-Host "  ✓ Time: $($response.timestamp)" -ForegroundColor Green
            $healthSuccess = $true
            break
        }
    } catch {
        Write-Host " FAILED" -ForegroundColor Red
        Start-Sleep -Seconds 2
    }
}

if (-not $healthSuccess) {
    Write-Host "✗ Health check failed after 10 attempts" -ForegroundColor Red
} else {
    # Test additional endpoints
    Write-Host "`n2. Testing API Endpoints..." -ForegroundColor Yellow
    $endpoints = @(
        @{Name="Auth"; Path="/api/auth/test"},
        @{Name="Assessments"; Path="/api/assessments/test"},
        @{Name="Questions"; Path="/api/questions/test"},
        @{Name="Dashboard"; Path="/api/dashboard/test"},
        @{Name="Users"; Path="/api/users/test"}
    )

    foreach ($endpoint in $endpoints) {
        try {
            $response = Invoke-RestMethod -Uri "http://localhost:5000$($endpoint.Path)" -TimeoutSec 5
            Write-Host "  ✓ $($endpoint.Name): $($response.message)" -ForegroundColor Green
        } catch {
            Write-Host "  ✗ $($endpoint.Name): $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

# Stop backend
if ($backendProcess -and !$backendProcess.HasExited) {
    Stop-Process -Id $backendProcess.Id -Force
    Write-Host "Backend process stopped" -ForegroundColor Yellow
}

# Verify ALL files exist
Write-Host "`n3. Verifying ALL Files..." -ForegroundColor Yellow
$allFiles = @(
    "ecosystem.config.js",
    "deployment\windows-service-manager.bat", 
    "deployment\auto-start-platform.ps1",
    "deployment\backup-data.ps1",
    "persistent-data\mongodb",
    "persistent-data\backups",
    "backend\server.js"
)

$allGood = $true
foreach ($file in $allFiles) {
    if (Test-Path $file) {
        Write-Host "  ✓ $file" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $file" -ForegroundColor Red
        $allGood = $false
    }
}

Set-Location ".."
if ($allGood -and $healthSuccess) {
    Write-Host "`n🎉 PLATFORM VERIFICATION COMPLETED SUCCESSFULLY!" -ForegroundColor Green
    Write-Host "All systems are GO for launch! 🚀" -ForegroundColor Cyan
} else {
    Write-Host "`n⚠️ Some issues need attention" -ForegroundColor Yellow
}
