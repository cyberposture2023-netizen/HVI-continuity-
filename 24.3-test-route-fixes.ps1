#!/usr/bin/env pwsh

Write-Host "🧪 Quick Route Fix Verification" -ForegroundColor Cyan

try {
    # Start backend
    Write-Host "Starting backend server..." -ForegroundColor Yellow
    \System.Diagnostics.Process = Start-Process -FilePath "node" -ArgumentList "backend/server.js" -PassThru
    
    # Wait for server to start
    Start-Sleep -Seconds 5
    
    # Test health endpoint
    Write-Host "Testing API endpoints..." -ForegroundColor Yellow
    \@{status=healthy; timestamp=11/10/2025 02:52:52; message=Main server is running} = Invoke-RestMethod -Uri "http://localhost:5000/api/health" -Method GET
    Write-Host "✅ Health endpoint: \" -ForegroundColor Green
    
    # Test auth test endpoint
    \ = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/test/health" -Method GET
    Write-Host "✅ Auth test endpoint: \" -ForegroundColor Green
    
    # Test assessments test endpoint  
    \ = Invoke-RestMethod -Uri "http://localhost:5000/api/assessments/test/health" -Method GET
    Write-Host "✅ Assessments test endpoint: \" -ForegroundColor Green
    
    Write-Host "🎉 All route fixes verified successfully!" -ForegroundColor Green
}
catch {
    Write-Host "❌ Verification failed: \" -ForegroundColor Red
}
finally {
    # Cleanup
    if (\System.Diagnostics.Process) {
        Stop-Process -Id \System.Diagnostics.Process.Id -Force -ErrorAction SilentlyContinue
    }
}
