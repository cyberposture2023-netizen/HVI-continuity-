# HVI Continuity Platform - API Endpoint Testing (PORT 5000)
$ErrorActionPreference = "Stop"
Write-Host "🧪 Testing HVI Continuity Platform API Endpoints on PORT 5000..." -ForegroundColor Cyan

$baseUrl = "http://localhost:5000"

function Test-Endpoint {
    param($Method, $Endpoint, $Body)
    
    try {
        $uri = "$baseUrl$Endpoint"
        $headers = @{"Content-Type" = "application/json"}
        
        Write-Host "Testing: $Method $Endpoint" -ForegroundColor Gray
        
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

Write-Host "`n🔍 Testing endpoints on port 5000..." -ForegroundColor Yellow

# Test all endpoints
$healthTest = Test-Endpoint -Method "GET" -Endpoint "/api/health"
$authTest = Test-Endpoint -Method "POST" -Endpoint "/api/auth/login" -Body @{username = "demo"; password = "demo"}
$assessmentsTest = Test-Endpoint -Method "GET" -Endpoint "/api/assessments"
$questionsTest = Test-Endpoint -Method "GET" -Endpoint "/api/questions"
$dashboardTest = Test-Endpoint -Method "GET" -Endpoint "/api/dashboard"
$usersTest = Test-Endpoint -Method "GET" -Endpoint "/api/users"

# Display results
Write-Host "`n1. Health Check: $($healthTest.Status)" -ForegroundColor $(if ($healthTest.Status -eq "✅ SUCCESS") { "Green" } else { "Red" })
Write-Host "2. Authentication: $($authTest.Status)" -ForegroundColor $(if ($authTest.Status -eq "✅ SUCCESS") { "Green" } else { "Red" })
Write-Host "3. Assessments: $($assessmentsTest.Status)" -ForegroundColor $(if ($assessmentsTest.Status -eq "✅ SUCCESS") { "Green" } else { "Red" })
Write-Host "4. Questions: $($questionsTest.Status)" -ForegroundColor $(if ($questionsTest.Status -eq "✅ SUCCESS") { "Green" } else { "Red" })
Write-Host "5. Dashboard: $($dashboardTest.Status)" -ForegroundColor $(if ($dashboardTest.Status -eq "✅ SUCCESS") { "Green" } else { "Red" })
Write-Host "6. Users: $($usersTest.Status)" -ForegroundColor $(if ($usersTest.Status -eq "✅ SUCCESS") { "Green" } else { "Red" })

# Summary
$successCount = (@($healthTest, $authTest, $assessmentsTest, $questionsTest, $dashboardTest, $usersTest) | Where-Object { $_.Status -eq "✅ SUCCESS" }).Count
Write-Host "`n📊 TEST SUMMARY: $successCount/6 endpoints successful" -ForegroundColor $(if ($successCount -eq 6) { "Green" } else { "Yellow" })
Write-Host "🔗 API Base URL: $baseUrl" -ForegroundColor Cyan
