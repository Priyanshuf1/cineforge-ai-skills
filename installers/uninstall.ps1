$ErrorActionPreference = 'Stop'

Write-Host "CineForge AI Skills - PowerShell Uninstaller"

$InstallDir = "$env:USERPROFILE\.local\share\cineforge"
$ShimPath = "$env:USERPROFILE\.local\bin\cineforge.cmd"

if (Test-Path $InstallDir) {
    Write-Host "Removing installation directory $InstallDir..."
    Remove-Item -Recurse -Force $InstallDir
}

if (Test-Path $ShimPath) {
    Write-Host "Removing CLI executable $ShimPath..."
    Remove-Item -Force $ShimPath
}

Write-Host "Uninstallation complete."
