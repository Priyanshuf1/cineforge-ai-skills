#!/usr/bin/env bash
set -e

echo "Rabto AI Skills - Shell Uninstaller"

INSTALL_DIR="$HOME/.local/share/rabto"
BIN_DIR="$HOME/.local/bin"

if [ -d "$INSTALL_DIR" ]; then
    echo "Removing installation directory $INSTALL_DIR..."
    rm -rf "$INSTALL_DIR"
fi

if [ -L "$BIN_DIR/rabto" ] || [ -f "$BIN_DIR/rabto" ]; then
    echo "Removing CLI executable $BIN_DIR/rabto..."
    rm -f "$BIN_DIR/rabto"
fi

echo "Uninstallation complete."
