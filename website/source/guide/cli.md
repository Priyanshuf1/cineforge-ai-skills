# CLI Reference

The CineForge CLI (`cineforge`) manages the installation, updating, and integrity of the AI skills. 
It strictly enforces path boundaries and generates transactional backups to ensure your environment is safe.

## `install`
Installs skills into the target agent environment.

**Flags:**
- `--target <agent>`: (Required) Target agent environment (`antigravity`, `claude`, `gemini`).
- `--preset <name>`: Installs a predefined group of skills (e.g. `cinematic-web`, `anime-vfx`).
- `--all`: Installs all available skills.
- `--scope <scope>`: Forces installation into a `global` or `workspace` environment.
- `--force`: Overwrites any existing installation without prompt.

**Example:**
```bash
cineforge install --target antigravity --preset cinematic-web
```

## `update`
Updates an existing installation by fetching the latest commits from the upstream source. 
It verifies file integrity using SHA-256 checksums to ensure it doesn't overwrite your local modifications.

**Flags:**
- `--target <agent>`: (Required) Target agent environment.
- `--force`: Overwrites local modifications destructively.

**Example:**
```bash
cineforge update --target antigravity
```

## `uninstall`
Removes the installed skills and the CineForge manifest from the target agent. Blocks removal if the local files have been modified by the user.

**Flags:**
- `--target <agent>`: (Required) Target agent environment.
- `--force`: Bypasses the modification check and forces removal.

**Example:**
```bash
cineforge uninstall --target antigravity
```

## `backup`
Creates a secure JSON backup manifest of the currently installed skills in the target environment, along with copying the actual files.

**Flags:**
- `--target <agent>`: (Required) Target agent environment.
- `--out <path>`: Directory to output the backup files and manifest.

**Example:**
```bash
cineforge backup --target antigravity --out ./backups/july-2026/
```

## `restore`
Restores an installation from a previously generated backup manifest.

**Flags:**
- `--manifest <path>`: (Required) Path to the `backup-manifest.json` file.
- `--force`: Overwrites current installation.

**Example:**
```bash
cineforge restore --manifest ./backups/july-2026/backup-manifest.json
```

## `adapters`
Lists all supported target adapters and their verification statuses.

**Example:**
```bash
cineforge adapters
```

## `info`
Displays current installation status, version, and the list of active skills in the target environment.

**Flags:**
- `--target <agent>`: (Required) Target agent environment.

## `init`
Initializes a new blank skill boilerplate for local development.

**Flags:**
- `--name <name>`: (Required) The internal name of the skill.

## `demo`
(Experimental) Runs a local demo of a specific skill if an interactive example is provided in its folder.
