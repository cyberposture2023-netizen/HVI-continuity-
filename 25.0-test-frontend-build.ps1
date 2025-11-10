#!/usr/bin/env pwsh

Write-Host "🏗️ Testing Frontend Build - Step 24.9" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan

Set-Location "frontend"

Write-Host "Cleaning previous build..." -ForegroundColor Yellow
if (Test-Path "build") {
    Remove-Item -Recurse -Force "build"
    Write-Host "✅ Previous build cleaned" -ForegroundColor Green
}

Write-Host "Installing dependencies if needed..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules")) {
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Dependency installation failed" -ForegroundColor Red
        Set-Location ".."
        exit 1
    }
    Write-Host "✅ Dependencies installed" -ForegroundColor Green
}

Write-Host "Building frontend..." -ForegroundColor Yellow
$buildOutput = npm run build 2>&1

if ($LASTEXITCODE -eq 0 -and (Test-Path "build")) {
    Write-Host "✅ Frontend build successful!" -ForegroundColor Green
    Write-Host "Build output created in: frontend/build" -ForegroundColor White
    
    # Test if the build works by serving it
    Write-Host "Testing built application..." -ForegroundColor Yellow
    if (Test-Path "build/index.html") {
        Write-Host "✅ index.html exists" -ForegroundColor Green
    }
    if (Test-Path "build/static/js") {
        $jsFiles = Get-ChildItem "build/static/js" -Filter "*.js"
        Write-Host "✅ JavaScript bundles: $($jsFiles.Count) files" -ForegroundColor Green
    }
    if (Test-Path "build/static/css") {
        $cssFiles = Get-ChildItem "build/static/css" -Filter "*.css"
        Write-Host "✅ CSS bundles: $($cssFiles.Count) files" -ForegroundColor Green
    }
    
    Write-Host "`n🎉 FRONTEND BUILD COMPLETED SUCCESSFULLY!" -ForegroundColor Green
    Set-Location ".."
    exit 0
} else {
    Write-Host "❌ Frontend build failed" -ForegroundColor Red
    Write-Host "Build output:" -ForegroundColor Red
    Write-Host $buildOutput -ForegroundColor Red
    Set-Location ".."
    exit 1
}
