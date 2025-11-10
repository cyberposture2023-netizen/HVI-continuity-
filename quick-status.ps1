# quick-status.ps1 - Project Status Check for Next Session
Write-Host "=== HVI CONTINUITY PLATFORM - STATUS CHECK ===" -ForegroundColor Cyan

$projectRoot = "D:\HVI-Continuity\hvi-continuity-platform"

Write-Host "Backend Status:" -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod "http://localhost:5000/api/health" -TimeoutSec 3
    Write-Host "✅ Backend running on port 5000" -ForegroundColor Green
    Write-Host "   Endpoints: $($health.endpoints.Count) available" -ForegroundColor White
} catch {
    Write-Host "❌ Backend not running on port 5000" -ForegroundColor Red
}

Write-Host "`nFrontend Status:" -ForegroundColor Yellow
try {
    $frontend = Invoke-WebRequest "http://localhost:3000" -TimeoutSec 3
    Write-Host "✅ Frontend running on port 3000" -ForegroundColor Green
} catch {
    Write-Host "❌ Frontend not running on port 3000" -ForegroundColor Red
}

Write-Host "`nCritical Issues:" -ForegroundColor Red
Write-Host "❌ Missing: D1-D4 scoring endpoints" -ForegroundColor Red
Write-Host "❌ Missing: Dashboard trend data" -ForegroundColor Red
Write-Host "❌ Broken: Assessment workflow" -ForegroundColor Red
Write-Host "❌ Broken: Login screen" -ForegroundColor Red

Write-Host "`n🎯 Next Session Focus: Restore scoring system and fix broken features" -ForegroundColor Cyan
