# Step 26.4: Reliable Platform Verification Script
Write-Host "Step 26.4: Comprehensive Platform Verification" -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Cyan

# Function to check if port is in use
function Test-PortInUse {
    param([int]$Port)
    try {
        $tcp = New-Object System.Net.Sockets.TcpClient
        $tcp.Connect("localhost", $Port)
        $tcp.Close()
        return $true
    } catch {
        return $false
    }
}

# Function to kill process on port
function Stop-PortProcess {
    param([int]$Port)
    try {
        $process = netstat -ano | findstr ":$Port" | findstr "LISTENING"
        if ($process) {
            $pid = ($process -split '\s+')[-1]
            taskkill /PID $pid /F
            Write-Host "Killed process $pid on port $Port" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "No process found on port $Port" -ForegroundColor Green
    }
}

# Clean up any existing processes
Write-Host "Cleaning up existing processes..." -ForegroundColor Yellow
Stop-PortProcess -Port 3000
Stop-PortProcess -Port 5000
Start-Sleep -Seconds 2

# Verify backend structure
Write-Host "`n1. Verifying Backend Structure..." -ForegroundColor Cyan
if (Test-Path "backend") {
    Write-Host "✓ Backend directory exists" -ForegroundColor Green
    
    # Check critical backend files
    $backendFiles = @("server.js", "package.json", "routes/auth.js", "routes/assessments.js", "routes/questions.js", "routes/dashboard.js", "routes/users.js")
    foreach ($file in $backendFiles) {
        if (Test-Path "backend/$file") {
            Write-Host "  ✓ $file" -ForegroundColor Green
        } else {
            Write-Host "  ✗ Missing: $file" -ForegroundColor Red
        }
    }
} else {
    Write-Host "✗ Backend directory missing!" -ForegroundColor Red
}

# Verify frontend structure
Write-Host "`n2. Verifying Frontend Structure..." -ForegroundColor Cyan
if (Test-Path "frontend") {
    Write-Host "✓ Frontend directory exists" -ForegroundColor Green
    
    # Check critical frontend files
    $frontendFiles = @("package.json", "src/App.js", "src/services/authService.js", "src/services/assessmentService.js", "src/components/Login.js", "src/components/Dashboard.js")
    foreach ($file in $frontendFiles) {
        if (Test-Path "frontend/$file") {
            Write-Host "  ✓ $file" -ForegroundColor Green
        } else {
            Write-Host "  ✗ Missing: $file" -ForegroundColor Red
        }
    }
} else {
    Write-Host "✗ Frontend directory missing!" -ForegroundColor Red
}

# Test backend startup
Write-Host "`n3. Testing Backend Startup..." -ForegroundColor Cyan
Set-Location "backend"
try {
    # Start backend server in background
    $backendProcess = Start-Process -FilePath "node" -ArgumentList "server.js" -PassThru -WindowStyle Hidden
    Write-Host "Backend server starting (PID: $($backendProcess.Id))..." -ForegroundColor Yellow
    
    # Wait for server to start
    Start-Sleep -Seconds 5
    
    # Test health endpoint
    $healthResponse = $null
    $attempts = 0
    while ($attempts -lt 10) {
        try {
            $healthResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/health" -Method Get -TimeoutSec 5
            break
        } catch {
            $attempts++
            Start-Sleep -Seconds 2
        }
    }
    
    if ($healthResponse -and $healthResponse.status -eq "ok") {
        Write-Host "✓ Backend health check PASSED" -ForegroundColor Green
        Write-Host "  Server: $($healthResponse.server)" -ForegroundColor Gray
        Write-Host "  Timestamp: $($healthResponse.timestamp)" -ForegroundColor Gray
    } else {
        Write-Host "✗ Backend health check FAILED" -ForegroundColor Red
    }
    
    # Test additional endpoints
    Write-Host "`n4. Testing API Endpoints..." -ForegroundColor Cyan
    $endpoints = @(
        "/api/auth/test",
        "/api/assessments/test", 
        "/api/questions/test",
        "/api/dashboard/test",
        "/api/users/test"
    )
    
    foreach ($endpoint in $endpoints) {
        try {
            $response = Invoke-RestMethod -Uri "http://localhost:5000$endpoint" -Method Get -TimeoutSec 5
            Write-Host "  ✓ $endpoint - $($response.message)" -ForegroundColor Green
        } catch {
            Write-Host "  ✗ $endpoint - Failed to connect" -ForegroundColor Red
        }
    }
    
} catch {
    Write-Host "✗ Backend startup failed: $($_.Exception.Message)" -ForegroundColor Red
} finally {
    # Kill backend process
    if ($backendProcess -and !$backendProcess.HasExited) {
        Stop-Process -Id $backendProcess.Id -Force
        Write-Host "Backend process stopped" -ForegroundColor Yellow
    }
}

# Test frontend build
Write-Host "`n5. Testing Frontend Build..." -ForegroundColor Cyan
Set-Location "..\frontend"
try {
    # Check if build exists, if not create it
    if (Test-Path "build") {
        Write-Host "✓ Frontend build directory exists" -ForegroundColor Green
    } else {
        Write-Host "Building frontend..." -ForegroundColor Yellow
        npm run build
        if (Test-Path "build") {
            Write-Host "✓ Frontend build SUCCESSFUL" -ForegroundColor Green
        } else {
            Write-Host "✗ Frontend build FAILED" -ForegroundColor Red
        }
    }
} catch {
    Write-Host "✗ Frontend build test failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Final status
Write-Host "`n" + "="*50 -ForegroundColor Cyan
Write-Host "PLATFORM VERIFICATION COMPLETE" -ForegroundColor Cyan
Write-Host "="*50 -ForegroundColor Cyan

Write-Host "`nNext Steps:" -ForegroundColor Yellow
Write-Host "1. Backend API: All endpoints should show ✓" -ForegroundColor White
Write-Host "2. Frontend: Build should be successful" -ForegroundColor White  
Write-Host "3. If any ✗ appear, those components need attention" -ForegroundColor White

Set-Location ".."
Write-Host "`nVerification script completed!" -ForegroundColor Green
