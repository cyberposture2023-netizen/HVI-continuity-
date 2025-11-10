# HVI Continuity Platform - Data Backup Script
param(
    [string]$Action = "backup",
    [string]$BackupName = "backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
)

$BackupDir = "persistent-data\backups"
$MongoDataDir = "persistent-data\mongodb"

if ($Action -eq "backup") {
    Write-Host "Creating backup: $BackupName" -ForegroundColor Green
    if (Test-Path $MongoDataDir) {
        Compress-Archive -Path $MongoDataDir -DestinationPath "$BackupDir\$BackupName.zip" -Force
        Write-Host "Backup created: $BackupDir\$BackupName.zip" -ForegroundColor Green
    } else {
        Write-Host "No MongoDB data directory found to backup" -ForegroundColor Yellow
    }
} elseif ($Action -eq "restore") {
    Write-Host "Restoring backup: $BackupName" -ForegroundColor Green
    if (Test-Path "$BackupDir\$BackupName.zip") {
        Remove-Item $MongoDataDir -Recurse -Force -ErrorAction SilentlyContinue
        Expand-Archive -Path "$BackupDir\$BackupName.zip" -DestinationPath "persistent-data\" -Force
        Write-Host "Backup restored from: $BackupDir\$BackupName.zip" -ForegroundColor Green
    } else {
        Write-Host "Backup file not found: $BackupDir\$BackupName.zip" -ForegroundColor Red
    }
} else {
    Write-Host "Usage: .\backup-data.ps1 [backup|restore] [backup-name]" -ForegroundColor Yellow
}
