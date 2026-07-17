$ErrorActionPreference = 'Stop'

Write-Host "CineForge AI Skills - PowerShell Installer"

$InstallDir = "$env:USERPROFILE\.local\share\cineforge"
$BinDir = "$env:USERPROFILE\.local\bin"

if (-not (Get-Command "npm" -ErrorAction SilentlyContinue)) {
    Write-Error "npm is required but not found."
    exit 1
}

if (Test-Path $InstallDir) {
    Remove-Item -Recurse -Force $InstallDir
}

if ($env:CINEFORGE_SOURCE_DIR) {
    Write-Host "Using local source from $env:CINEFORGE_SOURCE_DIR"
    Copy-Item -Path $env:CINEFORGE_SOURCE_DIR -Destination $InstallDir -Recurse
} else {
    if (-not (Get-Command "git" -ErrorAction SilentlyContinue)) {
        Write-Error "git is required but not found."
        exit 1
    }
    Write-Host "Cloning repository to $InstallDir..."
    git clone --depth 1 https://github.com/Priyanshuf1/cineforge-ai-skills.git $InstallDir
}

Set-Location $InstallDir
Write-Host "Installing dependencies..."
npm ci

Write-Host "Building workspaces..."
npm run build --workspaces

if (-not (Test-Path $BinDir)) {
    New-Item -ItemType Directory -Force -Path $BinDir | Out-Null
}

$CliBin = "$InstallDir\packages\cli\dist\bin\cineforge.js"
$ShimPath = "$BinDir\cineforge.cmd"

$ShimContent = @"
@ECHO OFF
node "$CliBin" %*
"@

Set-Content -Path $ShimPath -Value $ShimContent
Write-Host "Installed CLI shim into $ShimPath"
Write-Host "Please ensure $BinDir is in your PATH."
Write-Host "Run 'cineforge --help' to get started."
