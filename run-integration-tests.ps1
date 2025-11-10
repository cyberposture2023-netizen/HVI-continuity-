# Integration Test Runner Script
Write-Host "Starting HVI-Continuity Platform Integration Tests..." -ForegroundColor Green

# Check if backend and frontend are running
Write-Host "Checking services..." -ForegroundColor Yellow

# Start backend if not running
try {
    \ = Invoke-RestMethod -Uri "http://localhost:5000/api/health" -TimeoutSec 5
    Write-Host "✅ Backend is running" -ForegroundColor Green
} catch {
    Write-Host "Starting backend server..." -ForegroundColor Yellow
    Start-Process -FilePath "node" -ArgumentList "server.js" -WorkingDirectory "backend" -WindowStyle Hidden
    Start-Sleep -Seconds 5
}

# Start frontend if not running  
try {
    \ = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 5
    Write-Host "✅ Frontend is running" -ForegroundColor Green
} catch {
    Write-Host "Frontend not detected on port 3000" -ForegroundColor Yellow
    Write-Host "To start frontend: cd frontend && npm start" -ForegroundColor Cyan
}

# Run backend integration tests
Write-Host "
Running Backend Integration Tests..." -ForegroundColor Green
Set-Location backend
npm test -- integration.test.js
Set-Location ..

Write-Host "
Integration Test Setup Complete!" -ForegroundColor Green
Write-Host "Next: Run manual integration tests using the test utilities" -ForegroundColor Yellow
