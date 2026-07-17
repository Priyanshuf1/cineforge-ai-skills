#!/usr/bin/env bash
set -e

echo "CineForge AI Skills - Shell Uninstaller"

INSTALL_DIR="$HOME/.local/share/cineforge"
BIN_DIR="$HOME/.local/bin"

if [ -d "$INSTALL_DIR" ]; then
    echo "Removing installation directory $INSTALL_DIR..."
    rm -rf "$INSTALL_DIR"
fi

if [ -L "$BIN_DIR/cineforge" ] || [ -f "$BIN_DIR/cineforge" ]; then
    echo "Removing CLI executable $BIN_DIR/cineforge..."
    rm -f "$BIN_DIR/cineforge"
fi

echo "Uninstallation complete."
