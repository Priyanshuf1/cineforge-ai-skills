#!/usr/bin/env bash
set -e

echo "Rabto AI Skills - Shell Installer"

INSTALL_DIR="$HOME/.local/share/rabto"
BIN_DIR="$HOME/.local/bin"

echo "Checking dependencies (git, npm)..."
if ! command -v npm &> /dev/null; then
    echo "Error: npm is required."
    exit 1
fi

rm -rf "$INSTALL_DIR"
mkdir -p "$(dirname "$INSTALL_DIR")"

if [ -n "$RABTO_SOURCE_DIR" ]; then
    echo "Using local source from $RABTO_SOURCE_DIR"
    cp -r "$RABTO_SOURCE_DIR" "$INSTALL_DIR"
else
    if ! command -v git &> /dev/null; then
        echo "Error: git is required when downloading from remote."
        exit 1
    fi
    echo "Cloning repository to $INSTALL_DIR..."
    git clone --depth 1 https://github.com/Priyanshuf1/rabto.git "$INSTALL_DIR"
fi

cd "$INSTALL_DIR"
echo "Installing dependencies..."
npm ci

echo "Building workspaces..."
npm run build --workspaces

mkdir -p "$BIN_DIR"
# Link the CLI
CLI_BIN="$INSTALL_DIR/packages/cli/dist/bin/rabto.js"
if [ ! -f "$CLI_BIN" ]; then
   # Fallback to TS source if build failed but ts-node might be present (not ideal, but safe)
   CLI_BIN="$INSTALL_DIR/packages/cli/src/bin/rabto.ts"
fi

# Ensure executable
chmod +x "$CLI_BIN"

# Create symlink
ln -sf "$CLI_BIN" "$BIN_DIR/rabto"

echo "Installed CLI into $BIN_DIR/rabto"
echo "Please ensure $BIN_DIR is in your PATH."
echo "Run 'rabto --help' to get started."
