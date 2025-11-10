# Improved API Test with Better Timing
$ErrorActionPreference = "Stop"
Write-Host "🧪 Testing HVI Continuity Platform API Endpoints..." -ForegroundColor Cyan

$baseUrl = "http://localhost:3001"

# Wait for server to fully start
Write-Host "⏳ Waiting for server to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

function Test-EndpointWithRetry {
    param($Method, $Endpoint, $Body, $MaxRetries = 3)
    
    for ($i = 1; $i -le $MaxRetries; $i++) {
        try {
            $uri = "$baseUrl$Endpoint"
            $headers = @{"Content-Type" = "application/json"}
            
            if ($Method -eq "GET") {
                $response = Invoke-RestMethod -Uri $uri -Method GET -Headers $headers -TimeoutSec 10
            } else {
                $response = Invoke-RestMethod -Uri $uri -Method POST -Headers $headers -Body ($Body | ConvertTo-Json) -TimeoutSec 10
            }
            
            return @{Status = "✅ SUCCESS"; Response = $response; Error = $null}
        } catch {
            if ($i -eq $MaxRetries) {
                return @{Status = "❌ FAILED"; Response = $null; Error = $_.Exception.Message}
            }
            Start-Sleep -Seconds 2
        }
    }
}

# Test endpoints with retry logic
$healthTest = Test-EndpointWithRetry -Method "GET" -Endpoint "/api/health"
Write-Host "1. Health Check: $($healthTest.Status)" -ForegroundColor $(if ($healthTest.Status -eq "✅ SUCCESS") { "Green" } else { "Red" })

if ($healthTest.Status -eq "✅ SUCCESS") {
    # Test other endpoints only if health check passes
    $authTest = Test-EndpointWithRetry -Method "POST" -Endpoint "/api/auth/login" -Body @{username = "demo"; password = "demo"}
    $assessmentsTest = Test-EndpointWithRetry -Method "GET" -Endpoint "/api/assessments"
    $questionsTest = Test-EndpointWithRetry -Method "GET" -Endpoint "/api/questions"
    $dashboardTest = Test-EndpointWithRetry -Method "GET" -Endpoint "/api/dashboard"
    $usersTest = Test-EndpointWithRetry -Method "GET" -Endpoint "/api/users"
    
    Write-Host "2. Authentication: $($authTest.Status)" -ForegroundColor $(if ($authTest.Status -eq "✅ SUCCESS") { "Green" } else { "Red" })
    Write-Host "3. Assessments: $($assessmentsTest.Status)" -ForegroundColor $(if ($assessmentsTest.Status -eq "✅ SUCCESS") { "Green" } else { "Red" })
    Write-Host "4. Questions: $($questionsTest.Status)" -ForegroundColor $(if ($questionsTest.Status -eq "✅ SUCCESS") { "Green" } else { "Red" })
    Write-Host "5. Dashboard: $($dashboardTest.Status)" -ForegroundColor $(if ($dashboardTest.Status -eq "✅ SUCCESS") { "Green" } else { "Red" })
    Write-Host "6. Users: $($usersTest.Status)" -ForegroundColor $(if ($usersTest.Status -eq "✅ SUCCESS") { "Green" } else { "Red" })
    
    $successCount = (@($healthTest, $authTest, $assessmentsTest, $questionsTest, $dashboardTest, $usersTest) | Where-Object { $_.Status -eq "✅ SUCCESS" }).Count
    Write-Host "`n📊 FINAL SCORE: $successCount/6 endpoints operational" -ForegroundColor $(if ($successCount -eq 6) { "Green" } else { "Yellow" })
} else {
    Write-Host "`n❌ Server not responding. Check the server window for errors." -ForegroundColor Red
}
