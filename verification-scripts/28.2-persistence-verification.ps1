# Step 28.2: Persistence Layer Verification
Write-Host "Step 28.2: Testing Persistence Layer" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Cyan

# Test Backend with Simple Health Check
Write-Host "1. Testing Backend with Simple Health Check..." -ForegroundColor Yellow

# Clean up first
taskkill /F /IM node.exe 2>
Start-Sleep -Seconds 2

# Start backend directly
Set-Location "backend"
\System.Diagnostics.Process (Idle) = Start-Process -FilePath "node" -ArgumentList "server.js" -PassThru -WindowStyle Hidden
Write-Host "Backend starting (PID: \)..." -ForegroundColor Gray
Start-Sleep -Seconds 5

# Test simple health endpoint
try {
    \ = Invoke-WebRequest -Uri "http://localhost:5000/api/health" -TimeoutSec 5
    if (\.StatusCode -eq 200) {
        \ = \.Content | ConvertFrom-Json
        Write-Host "✓ BACKEND HEALTH CHECK PASSED!" -ForegroundColor Green
        Write-Host "  Status: \" -ForegroundColor Gray
        Write-Host "  Server: \" -ForegroundColor Gray
        Write-Host "  Time: \" -ForegroundColor Gray
    }
} catch {
    Write-Host "✗ Health check failed: \" -ForegroundColor Red
}

# Test additional endpoints
Write-Host "
2. Testing API Endpoints..." -ForegroundColor Yellow
\ = @("auth", "assessments", "questions", "dashboard", "users")

foreach (\ in \) {
    try {
        \ = Invoke-WebRequest -Uri "http://localhost:5000/api/\/test" -TimeoutSec 3
        if (\.StatusCode -eq 200) {
            \ = \.Content | ConvertFrom-Json
            Write-Host "  ✓ /api/\/test - \" -ForegroundColor Green
        }
    } catch {
        Write-Host "  ✗ /api/\/test - Failed" -ForegroundColor Red
    }
}

# Stop backend
if (\System.Diagnostics.Process (Idle) -and !\System.Diagnostics.Process (Idle).HasExited) {
    Stop-Process -Id \System.Diagnostics.Process (Idle).Id -Force
    Write-Host "Backend process stopped" -ForegroundColor Yellow
}

# Verify persistence files
Write-Host "
3. Verifying Persistence Files..." -ForegroundColor Yellow
\ = @(
    "ecosystem.config.js",
    "deployment\windows-service-manager.bat", 
    "deployment\auto-start-platform.ps1",
    "deployment\backup-data.ps1",
    "persistent-data\mongodb",
    "persistent-data\backups"
)

foreach (\ in \) {
    if (Test-Path \) {
        Write-Host "  ✓ \" -ForegroundColor Green
    } else {
        Write-Host "  ✗ \" -ForegroundColor Red
    }
}

Set-Location ".."
Write-Host "
Persistence layer verification complete!" -ForegroundColor Green
Write-Host "
Next: Run 'deployment\auto-start-platform.ps1' to start the platform" -ForegroundColor Cyan
