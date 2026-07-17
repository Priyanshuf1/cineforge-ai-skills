# Installation

This guide covers everything you need to know about installing and managing Rabto AI Skills across different platforms and target agents.

> [!CAUTION]
> **EXPERIMENTAL SOFTWARE**
> Rabto is currently in an experimental phase (v0.1.0). Use in production at your own risk.

## Requirements

- **Node.js**: `v18.0.0` or higher.
- **Git**: Required for fetching upstream updates and clone installations.
- **Agent Environment**: 
  - Antigravity (Local config folder `~/.gemini/config` or `.agents/`)
  - Claude Code (EXPERIMENTAL)
  - Gemini CLI (EXPERIMENTAL)

---

## 1. Local Clone Installation (PR Testing / Dev)

The safest and most reliable way to install Rabto during its Beta phase is by cloning the repository locally.

**macOS / Linux:**
```bash
git clone https://github.com/Priyanshuf1/rabto.git
cd rabto-ai-skills
export RABTO_SOURCE_DIR=$(pwd)
./installers/install.sh --target antigravity
```

**Windows (PowerShell):**
```powershell
git clone https://github.com/Priyanshuf1/rabto.git
cd rabto-ai-skills
$env:RABTO_SOURCE_DIR = $PWD.Path
.\installers\install.ps1 -target antigravity
```

---

## 2. CLI Installation

If you prefer to use the Rabto CLI (which orchestrates everything internally), you can install the CLI globally via `npm` or run it directly using `npx`:

```bash
# Global installation (coming soon to npm)
# npm install -g rabto-cli 

# Using NPX locally in the cloned repo
npx rabto install --target antigravity --preset cinematic-web
```

---

## 3. Shell Script Installation (Automated)

> [!NOTE]
> These direct endpoints will be fully supported after the official `v0.1.0` release.

**macOS / Linux:**
```bash
curl -fsSL https://raw.githubusercontent.com/Priyanshuf1/rabto/v0.1.0/installers/install.sh | bash -s -- --target antigravity
```

**Windows (PowerShell):**
```powershell
iwr https://raw.githubusercontent.com/Priyanshuf1/rabto/v0.1.0/installers/install.ps1 -useb | iex
```

---

## Managing Your Installation

Rabto operates on a secure, transactional staging architecture to protect your local configurations. 

### Antigravity Global vs. Workspace Installation

By default, Rabto installs to the **Global** Antigravity config directory (`~/.gemini/config/skills`).

If you are currently inside an active Antigravity workspace, Rabto will automatically detect the `.agents/` folder and install the skills there. You can force workspace scope by using the `--scope workspace` flag on the CLI.

### Updating

Rabto fetches the latest verified checksums from upstream to ensure safe updates. 
If your local files have been manually modified, the update will be blocked to prevent overwriting your custom changes.

```bash
rabto update --target antigravity
```

*To force an update and overwrite local changes, append `--force`.*

### Backup & Restore

Rabto generates cryptographic backup manifests so you can easily revert to a previous state.

**Create a Backup:**
```bash
rabto backup --target antigravity --out ./my-backup
```

**Restore from a Backup:**
```bash
rabto restore --manifest ./my-backup/backup-manifest.json
```

### Safe Uninstall

Uninstalling removes the skills and the local manifest safely. If local files have been modified, uninstallation requires explicit `--force` confirmation to prevent accidental loss of user data.

```bash
rabto uninstall --target antigravity
```

## Troubleshooting

- **"Checksum mismatch" during Update/Uninstall:** You manually edited a skill file. Use `--force` to overwrite it or backup your changes.
- **"Unknown Target":** You specified an unsupported target. Valid targets are `antigravity`, `claude`, and `gemini`.
- **EPERM / Access Denied (Windows):** Ensure your PowerShell execution policy allows local scripts (`Set-ExecutionPolicy RemoteSigned -Scope CurrentUser`).
