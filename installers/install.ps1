$ErrorActionPreference = 'Stop'

Write-Host "Rabto AI Skills - PowerShell Installer"

$InstallDir = "$env:USERPROFILE\.local\share\rabto"
$BinDir = "$env:USERPROFILE\.local\bin"

if (-not (Get-Command "npm" -ErrorAction SilentlyContinue)) {
    Write-Error "npm is required but not found."
    exit 1
}

if (Test-Path $InstallDir) {
    Remove-Item -Recurse -Force $InstallDir
}
$parentDir = Split-Path $InstallDir
if (-not (Test-Path $parentDir)) {
    New-Item -ItemType Directory -Force -Path $parentDir | Out-Null
}

if ($env:RABTO_SOURCE_DIR) {
    Write-Host "Using local source from $env:RABTO_SOURCE_DIR"
    Copy-Item -Path $env:RABTO_SOURCE_DIR -Destination $InstallDir -Recurse
} else {
    if (-not (Get-Command "git" -ErrorAction SilentlyContinue)) {
        Write-Error "git is required but not found."
        exit 1
    }
    Write-Host "Cloning repository to $InstallDir..."
    git clone --depth 1 https://github.com/Priyanshuf1/rabto-ai-skills.git $InstallDir
}

Set-Location $InstallDir
Write-Host "Installing dependencies..."
npm ci

Write-Host "Building workspaces..."
npm run build --workspaces

if (-not (Test-Path $BinDir)) {
    New-Item -ItemType Directory -Force -Path $BinDir | Out-Null
}

$CliBin = "$InstallDir\packages\cli\dist\bin\rabto.js"
$ShimPath = "$BinDir\rabto.cmd"

$ShimContent = @"
@ECHO OFF
node "$CliBin" %*
"@

Set-Content -Path $ShimPath -Value $ShimContent
Write-Host "Installed CLI shim into $ShimPath"
Write-Host "Please ensure $BinDir is in your PATH."
Write-Host "Run 'rabto --help' to get started."
