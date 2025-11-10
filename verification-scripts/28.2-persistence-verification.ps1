# Step 28.2: Persistence Layer Verification
Write-Host "Step 28.2: Testing Persistence Layer" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Cyan

# Test Backend with Simple Health Check
Write-Host "1. Testing Backend with Simple Health Check..." -ForegroundColor Yellow

# Clean up first
taskkill /F /IM node.exe 2>$null
Start-Sleep -Seconds 2

# Start backend directly
Set-Location "backend"
$backendProcess = Start-Process -FilePath "node" -ArgumentList "server.js" -PassThru -WindowStyle Hidden
Write-Host "Backend starting..." -ForegroundColor Gray
Start-Sleep -Seconds 5

# Test simple health endpoint
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/health" -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        $healthData = $response.Content | ConvertFrom-Json
        Write-Host "BACKEND HEALTH CHECK PASSED!" -ForegroundColor Green
        Write-Host "  Status: $($healthData.status)" -ForegroundColor Gray
        Write-Host "  Server: $($healthData.server)" -ForegroundColor Gray
        Write-Host "  Time: $($healthData.timestamp)" -ForegroundColor Gray
    }
} catch {
    Write-Host "Health check failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test additional endpoints
Write-Host "2. Testing API Endpoints..." -ForegroundColor Yellow
$endpoints = @("auth", "assessments", "questions", "dashboard", "users")

foreach ($endpoint in $endpoints) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5000/api/$endpoint/test" -TimeoutSec 3
        if ($response.StatusCode -eq 200) {
            $data = $response.Content | ConvertFrom-Json
            Write-Host "  /api/$endpoint/test - $($data.message)" -ForegroundColor Green
        }
    } catch {
        Write-Host "  /api/$endpoint/test - Failed" -ForegroundColor Red
    }
}

# Stop backend
if ($backendProcess -and !$backendProcess.HasExited) {
    Stop-Process -Id $backendProcess.Id -Force
    Write-Host "Backend process stopped" -ForegroundColor Yellow
}

# Verify persistence files
Write-Host "3. Verifying Persistence Files..." -ForegroundColor Yellow
$persistenceFiles = @(
    "ecosystem.config.js",
    "deployment\windows-service-manager.bat", 
    "deployment\auto-start-platform.ps1",
    "deployment\backup-data.ps1",
    "persistent-data\mongodb",
    "persistent-data\backups"
)

foreach ($file in $persistenceFiles) {
    if (Test-Path $file) {
        Write-Host "  $file - EXISTS" -ForegroundColor Green
    } else {
        Write-Host "  $file - MISSING" -ForegroundColor Red
    }
}

Set-Location ".."
Write-Host "Persistence layer verification complete!" -ForegroundColor Green
Write-Host "Next: Run 'deployment\auto-start-platform.ps1' to start the platform" -ForegroundColor Cyan
