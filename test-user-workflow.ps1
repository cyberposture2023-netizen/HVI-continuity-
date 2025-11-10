# User Workflow Test Script
Write-Host "HVI Continuity Platform - User Workflow Test" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green

# Check if services are running
Write-Host "
1. Checking Services..." -ForegroundColor Yellow

try {
    \ = Invoke-RestMethod -Uri "http://localhost:5000/api/health" -TimeoutSec 5
    Write-Host "   ✅ Backend is running on http://localhost:5000" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Backend is not running. Start with: cd backend && node server.js" -ForegroundColor Red
    exit 1
}

try {
    \ = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 5
    Write-Host "   ✅ Frontend is running on http://localhost:3000" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Frontend is not running. Start with: cd frontend && npm start" -ForegroundColor Red
    Write-Host "   Note: Frontend may take a few minutes to start initially." -ForegroundColor Yellow
}

Write-Host "
2. Test User Workflow:" -ForegroundColor Yellow
Write-Host "   • Open http://localhost:3000 in your browser" -ForegroundColor White
Write-Host "   • Register a new account" -ForegroundColor White
Write-Host "   • Login with your credentials" -ForegroundColor White
Write-Host "   • Access the Dashboard" -ForegroundColor White
Write-Host "   • Create a new assessment" -ForegroundColor White
Write-Host "   • View your assessments list" -ForegroundColor White

Write-Host "
3. Expected Behavior:" -ForegroundColor Yellow
Write-Host "   ✅ User registration should create account in database" -ForegroundColor Green
Write-Host "   ✅ Login should return JWT token and user data" -ForegroundColor Green
Write-Host "   ✅ Dashboard should display user-specific data" -ForegroundColor Green
Write-Host "   ✅ Assessment creation should persist to database" -ForegroundColor Green
Write-Host "   ✅ Assessments should be retrievable for the logged-in user" -ForegroundColor Green

Write-Host "
4. API Endpoints to Verify:" -ForegroundColor Yellow
Write-Host "   • POST /api/auth/register" -ForegroundColor White
Write-Host "   • POST /api/auth/login" -ForegroundColor White
Write-Host "   • GET  /api/dashboard" -ForegroundColor White
Write-Host "   • POST /api/assessments" -ForegroundColor White
Write-Host "   • GET  /api/assessments/user/{userId}" -ForegroundColor White

Write-Host "
🚀 Ready for User Testing!" -ForegroundColor Cyan
Write-Host "   The platform is now fully integrated and ready for end-to-end testing." -ForegroundColor White
