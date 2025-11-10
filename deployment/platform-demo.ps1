# HVI Continuity Platform - Live Demo Script
Write-Host "HVI Continuity Platform - LIVE DEMO" -ForegroundColor Green
Write-Host "===================================" -ForegroundColor Cyan

# Kill any existing processes
Write-Host "Preparing environment..." -ForegroundColor Yellow
taskkill /F /IM node.exe 2>$null
Start-Sleep -Seconds 2

# Start backend
Write-Host "Starting Backend Server..." -ForegroundColor Cyan
$backendProcess = Start-Process -FilePath "node" -ArgumentList "backend\server.js" -PassThru -WindowStyle Hidden
Write-Host "Backend starting (PID: $($backendProcess.Id))..." -ForegroundColor Gray
Start-Sleep -Seconds 5

# Test all endpoints
Write-Host "Testing API Endpoints..." -ForegroundColor Yellow

$endpoints = @(
    @{Path="/api/health"; Name="Health Check"},
    @{Path="/api/auth/test"; Name="Authentication"},
    @{Path="/api/assessments/test"; Name="Assessments"},
    @{Path="/api/questions/test"; Name="Questions"},
    @{Path="/api/dashboard/test"; Name="Dashboard"},
    @{Path="/api/users/test"; Name="Users"}
)

foreach ($endpoint in $endpoints) {
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:5000$($endpoint.Path)" -TimeoutSec 3
        Write-Host "  ✓ $($endpoint.Name) - $($response.message)" -ForegroundColor Green
    } catch {
        Write-Host "  ✗ $($endpoint.Name) - Connection failed" -ForegroundColor Red
    }
}

# Show platform information
Write-Host "`nPlatform Information:" -ForegroundColor Cyan
Write-Host "  Backend URL: http://localhost:5000" -ForegroundColor White
Write-Host "  Frontend URL: http://localhost:3000 (run 'cd frontend && npm start')" -ForegroundColor White
Write-Host "  API Health: http://localhost:5000/api/health" -ForegroundColor White

# Start frontend if requested
Write-Host "`nWould you like to start the frontend? (y/n)" -ForegroundColor Yellow
$startFrontend = Read-Host

if ($startFrontend -eq 'y' -or $startFrontend -eq 'Y') {
    Write-Host "Starting Frontend Development Server..." -ForegroundColor Cyan
    Set-Location "frontend"
    $frontendProcess = Start-Process -FilePath "npm" -ArgumentList "start" -PassThru -WindowStyle Normal
    Set-Location ".."
    Write-Host "Frontend starting in new window..." -ForegroundColor Green
}

Write-Host "`nDemo Instructions:" -ForegroundColor Yellow
Write-Host "1. Backend is running on http://localhost:5000" -ForegroundColor White
Write-Host "2. Open browser to test API endpoints" -ForegroundColor White
Write-Host "3. For full demo, start frontend and open http://localhost:3000" -ForegroundColor White
Write-Host "4. Press Ctrl+C to stop all services" -ForegroundColor White

Write-Host "`nPlatform is now LIVE and ready for demonstration!" -ForegroundColor Green

# Keep running until user stops
try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
} finally {
    # Cleanup on exit
    if ($backendProcess -and !$backendProcess.HasExited) {
        Stop-Process -Id $backendProcess.Id -Force
    }
    if ($frontendProcess -and !$frontendProcess.HasExited) {
        Stop-Process -Id $frontendProcess.Id -Force
    }
    Write-Host "`nDemo ended. All services stopped." -ForegroundColor Yellow
}
