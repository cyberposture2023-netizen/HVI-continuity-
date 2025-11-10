# Verification script to check if Unicode errors are fixed

Write-Host "🔍 Verifying Unicode Error Fixes" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

$filesToCheck = @(
    "frontend/src/components/Dashboard.js",
    "frontend/src/services/assessmentService.js", 
    "frontend/src/services/authService.js",
    "frontend/src/services/dashboardService.js",
    "frontend/src/services/userService.js"
)

$allClean = $true

foreach ($file in $filesToCheck) {
    Write-Host "`nChecking: $file" -ForegroundColor White
    
    if (-not (Test-Path $file)) {
        Write-Host "   ❌ File not found" -ForegroundColor Red
        $allClean = $false
        continue
    }
    
    $content = Get-Content $file -Raw
    
    $hasUnicode = $content -match '[^\x00-\x7F\r\n\t]'
    $hasUnicodeEscapes = $content -match '\\u[0-9A-Fa-f]{4}'
    
    if (-not $hasUnicode) {
        Write-Host "   ✅ No non-ASCII characters" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Contains non-ASCII characters" -ForegroundColor Red
        $allClean = $false
    }
    
    if (-not $hasUnicodeEscapes) {
        Write-Host "   ✅ No Unicode escape sequences" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Contains Unicode escape sequences" -ForegroundColor Red
        $allClean = $false
    }
}

Write-Host "`n" + "="*50 -ForegroundColor Cyan
if ($allClean) {
    Write-Host "✅ VERIFICATION PASSED: All files are clean!" -ForegroundColor Green
    Write-Host "You can now build and run the application." -ForegroundColor Cyan
} else {
    Write-Host "❌ VERIFICATION FAILED: Some files still have issues." -ForegroundColor Red
    Write-Host "Run the fix script again or check manually." -ForegroundColor Yellow
}
Write-Host "="*50 -ForegroundColor Cyan