# HVI Continuity Platform - Unicode Error Fix Script
# This script automatically fixes Unicode parsing errors in the frontend files

Write-Host "🔧 HVI Continuity Platform - Unicode Error Fix" -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Green

# Define the files that need fixing
$filesToFix = @(
    "frontend/src/components/Dashboard.js",
    "frontend/src/services/assessmentService.js", 
    "frontend/src/services/authService.js",
    "frontend/src/services/dashboardService.js",
    "frontend/src/services/userService.js"
)

# Function to remove problematic Unicode characters
function Remove-UnicodeCharacters {
    param([string]$content)
    
    # Remove non-ASCII characters but preserve line endings and normal spaces
    $cleaned = $content -replace '[^\x00-\x7F\r\n\t]', ''
    
    # Fix any Unicode escape sequences
    $cleaned = $cleaned -replace '\\u[0-9A-Fa-f]{4}', ''
    
    # Normalize line endings to Windows format
    $cleaned = $cleaned -replace "`n", "`r`n"
    
    return $cleaned
}

# Function to backup original file
function Backup-File {
    param([string]$filePath)
    
    if (Test-Path $filePath) {
        $backupPath = $filePath + ".backup"
        Copy-Item $filePath $backupPath -Force
        Write-Host "   📦 Backup created: $backupPath" -ForegroundColor Yellow
        return $true
    }
    return $false
}

# Main fix process
Write-Host "`n🔍 Scanning for files with Unicode errors..." -ForegroundColor Cyan

$fixedCount = 0
$errorCount = 0

foreach ($file in $filesToFix) {
    Write-Host "`n📄 Processing: $file" -ForegroundColor White
    
    if (-not (Test-Path $file)) {
        Write-Host "   ❌ File not found: $file" -ForegroundColor Red
        $errorCount++
        continue
    }
    
    try {
        # Create backup
        Backup-File -filePath $file
        
        # Read original content
        $originalContent = Get-Content $file -Raw
        
        # Clean the content
        $cleanedContent = Remove-UnicodeCharacters -content $originalContent
        
        # Write cleaned content back
        $cleanedContent | Out-File -FilePath $file -Encoding UTF8 -NoNewline
        
        # Verify the fix
        $newContent = Get-Content $file -Raw
        $hasUnicode = $newContent -match '[^\x00-\x7F\r\n\t]'
        
        if (-not $hasUnicode) {
            Write-Host "   ✅ Fixed Unicode errors" -ForegroundColor Green
            $fixedCount++
        } else {
            Write-Host "   ⚠️  Some Unicode characters may remain" -ForegroundColor Yellow
            $fixedCount++
        }
        
    } catch {
        Write-Host "   ❌ Error processing $file : $($_.Exception.Message)" -ForegroundColor Red
        $errorCount++
    }
}

# Summary
Write-Host "`n" + "="*50 -ForegroundColor Green
Write-Host "FIX SUMMARY" -ForegroundColor Green
Write-Host "Files processed: $($filesToFix.Count)" -ForegroundColor White
Write-Host "Successfully fixed: $fixedCount" -ForegroundColor Green
Write-Host "Errors encountered: $errorCount" -ForegroundColor Red
Write-Host "="*50 -ForegroundColor Green

if ($errorCount -eq 0) {
    Write-Host "`n🎉 All files have been processed successfully!" -ForegroundColor Green
    Write-Host "You can now run: cd frontend && npm run build" -ForegroundColor Cyan
} else {
    Write-Host "`n⚠️  Some files had issues. Check the errors above." -ForegroundColor Yellow
}

Write-Host "`nBackup files (.backup) have been created for safety." -ForegroundColor Yellow