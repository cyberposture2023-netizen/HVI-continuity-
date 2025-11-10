# HVI Continuity Platform - API Endpoint Testing
$ErrorActionPreference = "Stop"
Write-Host "🧪 Testing HVI Continuity Platform API Endpoints..." -ForegroundColor Cyan

$baseUrl = "http://localhost:3001"
$testResults = @()

# Function to test endpoint with color-coded results
function Test-Endpoint {
    param($Method, $Endpoint, $Body)
    
    try {
        $uri = "$baseUrl$Endpoint"
        $headers = @{"Content-Type" = "application/json"}
        
        if ($Method -eq "GET") {
            $response = Invoke-RestMethod -Uri $uri -Method GET -Headers $headers
        } else {
            $response = Invoke-RestMethod -Uri $uri -Method POST -Headers $headers -Body ($Body | ConvertTo-Json)
        }
        
        return @{Status = "✅ SUCCESS"; Response = $response; Error = $null}
    } catch {
        return @{Status = "❌ FAILED"; Response = $null; Error = $_.Exception.Message}
    }
}

Write-Host "`n🔍 Testing endpoints..." -ForegroundColor Yellow

# Test 1: Health Check Endpoint
Write-Host "`n1. Testing GET /api/health..." -ForegroundColor White
$healthTest = Test-Endpoint -Method "GET" -Endpoint "/api/health"
Write-Host "   Status: $($healthTest.Status)" -ForegroundColor $(if ($healthTest.Status -eq "✅ SUCCESS") { "Green" } else { "Red" })
if ($healthTest.Response) {
    Write-Host "   Response: $($healthTest.Response | ConvertTo-Json -Compress)" -ForegroundColor Gray
}

# Test 2: Authentication Demo Endpoint
Write-Host "`n2. Testing POST /api/auth/login..." -ForegroundColor White
$authTest = Test-Endpoint -Method "POST" -Endpoint "/api/auth/login" -Body @{username = "demo-user"; password = "demo-pass"}
Write-Host "   Status: $($authTest.Status)" -ForegroundColor $(if ($authTest.Status -eq "✅ SUCCESS") { "Green" } else { "Red" })

# Test 3: Assessments Endpoint
Write-Host "`n3. Testing GET /api/assessments..." -ForegroundColor White
$assessmentsTest = Test-Endpoint -Method "GET" -Endpoint "/api/assessments"
Write-Host "   Status: $($assessmentsTest.Status)" -ForegroundColor $(if ($assessmentsTest.Status -eq "✅ SUCCESS") { "Green" } else { "Red" })

# Test 4: Questions Endpoint
Write-Host "`n4. Testing GET /api/questions..." -ForegroundColor White
$questionsTest = Test-Endpoint -Method "GET" -Endpoint "/api/questions"
Write-Host "   Status: $($questionsTest.Status)" -ForegroundColor $(if ($questionsTest.Status -eq "✅ SUCCESS") { "Green" } else { "Red" })

# Test 5: Dashboard Endpoint
Write-Host "`n5. Testing GET /api/dashboard..." -ForegroundColor White
$dashboardTest = Test-Endpoint -Method "GET" -Endpoint "/api/dashboard"
Write-Host "   Status: $($dashboardTest.Status)" -ForegroundColor $(if ($dashboardTest.Status -eq "✅ SUCCESS") { "Green" } else { "Red" })

# Test 6: Users Endpoint
Write-Host "`n6. Testing GET /api/users..." -ForegroundColor White
$usersTest = Test-Endpoint -Method "GET" -Endpoint "/api/users"
Write-Host "   Status: $($usersTest.Status)" -ForegroundColor $(if ($usersTest.Status -eq "✅ SUCCESS") { "Green" } else { "Red" })

# Summary
Write-Host "`n📊 TEST SUMMARY:" -ForegroundColor Cyan
$successCount = (@($healthTest, $authTest, $assessmentsTest, $questionsTest, $dashboardTest, $usersTest) | Where-Object { $_.Status -eq "✅ SUCCESS" }).Count
Write-Host "   Successful: $successCount/6" -ForegroundColor $(if ($successCount -eq 6) { "Green" } else { "Yellow" })

if ($successCount -eq 6) {
    Write-Host "🎉 All endpoints are operational!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Some endpoints need attention. Check server logs." -ForegroundColor Yellow
}

Write-Host "`n🔗 API Base URL: $baseUrl" -ForegroundColor Cyan
Write-Host "📋 Health Check: $baseUrl/api/health" -ForegroundColor Cyan
