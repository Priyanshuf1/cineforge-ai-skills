#!/usr/bin/env node
import { Command } from 'commander';
import fs from 'fs-extra';
import path from 'path';
import crypto from 'crypto';
import os from 'os';

const program = new Command();

// Resolve paths relative to installed location
// During dev: source is at ../../../../ relative to dist/bin/
// During prod: CINEFORGE_ROOT env or fallback to resolved dir
const CINEFORGE_ROOT = process.env.CINEFORGE_ROOT
  ? path.resolve(process.env.CINEFORGE_ROOT)
  : path.resolve(__dirname, '../../../../');

const SKILLS_DIR = path.join(CINEFORGE_ROOT, 'skills');
const REGISTRY_PATH = path.join(CINEFORGE_ROOT, 'registry', 'skills.json');
const PRESETS_PATH = path.join(CINEFORGE_ROOT, 'registry', 'presets.json');
const CHECKSUMS_PATH = path.join(CINEFORGE_ROOT, 'registry', 'checksums.json');

program
  .name('cineforge')
  .description('CineForge AI Skills CLI - Installable creative-web skills for AI coding agents.')
  .version('0.1.0');

// ─── SECURITY: Boundary-safe path join ────────────────────────────────────────
// Uses path.relative to detect traversal. Uses fs.realpathSync to resolve
// symlinks before comparison so a symlink cannot escape the boundary.
function safeJoin(base: string, target: string): string {
  const resolvedBase = fs.existsSync(base)
    ? fs.realpathSync(base)
    : path.resolve(base);

  const candidate = path.resolve(resolvedBase, target);

  // Resolve symlinks of the candidate too, only if it exists
  const resolvedCandidate = fs.existsSync(candidate)
    ? fs.realpathSync(candidate)
    : candidate;

  const rel = path.relative(resolvedBase, resolvedCandidate);
  if (rel.startsWith('..') || path.isAbsolute(rel)) {
    throw new Error(`Path traversal detected: "${target}" escapes base "${base}"`);
  }
  return resolvedCandidate;
}

// ─── ADAPTERS ──────────────────────────────────────────────────────────────────
const ADAPTERS: Record<string, { path: (scope: string) => string; verified: boolean; note?: string }> = {
  antigravity: {
    path: (scope) =>
      scope === 'global'
        ? path.join(os.homedir(), '.gemini', 'config', 'skills')
        : path.join(process.cwd(), '.agents', 'skills'),
    verified: true,
  },
  'claude-code': {
    path: (scope) =>
      scope === 'global'
        ? path.join(os.homedir(), '.claude', 'skills')
        : path.join(process.cwd(), '.claude', 'skills'),
    verified: false,
    note: 'EXPERIMENTAL - Claude Code skill path not yet officially documented.',
  },
  'gemini-cli': {
    path: (scope) =>
      scope === 'global'
        ? path.join(os.homedir(), '.config', 'gemini', 'skills')
        : path.join(process.cwd(), '.gemini', 'skills'),
    verified: false,
    note: 'EXPERIMENTAL - Gemini CLI skill path not yet officially documented.',
  },
};

function getTargetDir(target: string, scope: string): string {
  const adapter = ADAPTERS[target];
  if (!adapter) {
    console.error(`Error: Unknown target '${target}'. Run 'cineforge adapters' to see supported targets.`);
    process.exit(1);
  }
  if (!adapter.verified) {
    console.warn(`Warning: ${adapter.note}`);
  }
  return adapter.path(scope);
}

// ─── MANIFEST HELPERS ──────────────────────────────────────────────────────────
interface ManifestEntry {
  installedAt: string;
  updatedAt?: string;
  sourceHash: string;
  backupPath?: string;
  owner: string;
}
interface Manifest {
  version: string;
  agent: string;
  scope: string;
  createdAt: string;
  updatedAt: string;
  installed: Record<string, ManifestEntry>;
}

async function readManifest(manifestPath: string, agent: string, scope: string): Promise<Manifest> {
  if (await fs.pathExists(manifestPath)) {
    return fs.readJson(manifestPath);
  }
  return {
    version: '1',
    agent,
    scope,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    installed: {},
  };
}

function hashFile(filePath: string): string {
  const content = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(content).digest('hex');
}

function hashDir(dirPath: string): string {
  const hash = crypto.createHash('sha256');
  const files = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const f of files.sort((a, b) => a.name.localeCompare(b.name))) {
    const fPath = path.join(dirPath, f.name);
    if (f.isDirectory()) {
      hash.update(hashDir(fPath));
    } else {
      hash.update(fs.readFileSync(fPath));
    }
  }
  return hash.digest('hex');
}

// ─── COMMANDS ──────────────────────────────────────────────────────────────────

program
  .command('install')
  .description('Install a skill or preset')
  .option('-t, --target <agent>', 'Target agent (antigravity, claude-code, gemini-cli)', 'antigravity')
  .option('-s, --scope <scope>', 'Installation scope (global or workspace)', 'workspace')
  .option('--skills <skills>', 'Comma-separated skill IDs to install')
  .option('--preset <preset>', 'Preset name to install (see registry/presets.json)')
  .option('--all', 'Install all available skills')
  .option('--dry-run', 'Simulate without writing files')
  .action(async (options) => {
    const targetAgent: string = options.target;
    if (!ADAPTERS[targetAgent]) {
      console.error(`Error: Unknown target '${targetAgent}'. Supported: ${Object.keys(ADAPTERS).join(', ')}`);
      process.exit(1);
    }

    console.log(`Installing for agent: ${targetAgent}`);
    if (options.dryRun) console.log('DRY RUN: No files will be written.');

    let skillsToInstall: string[] = options.skills ? options.skills.split(',').map((s: string) => s.trim()) : [];

    if (options.all) {
      skillsToInstall = await fs.readdir(SKILLS_DIR);
    } else if (options.preset) {
      if (!(await fs.pathExists(PRESETS_PATH))) {
        console.error('Error: registry/presets.json not found. Cannot resolve preset.');
        process.exit(1);
      }
      const presets = await fs.readJson(PRESETS_PATH);
      if (!presets[options.preset]) {
        console.error(`Error: Unknown preset '${options.preset}'. Valid presets: ${Object.keys(presets).join(', ')}`);
        process.exit(1);
      }
      skillsToInstall = presets[options.preset].skills;
      console.log(`Preset '${options.preset}': ${skillsToInstall.length} skills.`);
    }

    if (skillsToInstall.length === 0) {
      console.error('Error: Specify --skills <ids>, --preset <name>, or --all.');
      process.exit(1);
    }

    const targetDir = getTargetDir(targetAgent, options.scope);
    const manifestPath = path.join(targetDir, '.cineforge-manifest.json');
    const manifest = await readManifest(manifestPath, targetAgent, options.scope);

    for (const skill of skillsToInstall) {
      const sourcePath = path.join(SKILLS_DIR, skill);
      if (!(await fs.pathExists(sourcePath))) {
        console.error(`Skill '${skill}' not found in ${SKILLS_DIR}.`);
        continue;
      }

      // Safe destination
      let destPath: string;
      try {
        // Use unsafeDest first, then safeJoin after dir creation
        const unsafeDest = path.resolve(targetDir, skill);
        await fs.ensureDir(targetDir);
        destPath = safeJoin(targetDir, skill);
      } catch (e: any) {
        console.error(`Security: ${e.message}`);
        process.exit(1);
      }

      const sourceHash = hashDir(sourcePath);
      let backupPath: string | undefined;

      if (!options.dryRun) {
        if (await fs.pathExists(destPath)) {
          backupPath = `${destPath}.backup-${Date.now()}`;
          console.log(`  Backing up existing '${skill}' → ${backupPath}`);
          await fs.copy(destPath, backupPath);
        }
        console.log(`  Installing '${skill}'...`);
        await fs.copy(sourcePath, destPath);
        manifest.installed[skill] = {
          installedAt: manifest.installed[skill]?.installedAt ?? new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          sourceHash,
          backupPath,
          owner: 'cineforge',
        };
      } else {
        console.log(`  [dry-run] Would install '${skill}'`);
      }
    }

    if (!options.dryRun) {
      manifest.updatedAt = new Date().toISOString();
      await fs.writeJson(manifestPath, manifest, { spaces: 2 });
      console.log(`Manifest written to ${manifestPath}`);
    }
    console.log('Installation complete.');
  });

program
  .command('uninstall')
  .description('Safely uninstall managed CineForge skills')
  .option('-t, --target <agent>', 'Target agent', 'antigravity')
  .option('-s, --scope <scope>', 'Installation scope', 'workspace')
  .option('--skills <skills>', 'Comma-separated skill IDs to remove (omit to remove all managed skills)')
  .action(async (options) => {
    const targetDir = getTargetDir(options.target, options.scope);
    const manifestPath = path.join(targetDir, '.cineforge-manifest.json');

    if (!(await fs.pathExists(manifestPath))) {
      console.log('No manifest found. Nothing to uninstall.');
      return;
    }

    const manifest: Manifest = await fs.readJson(manifestPath);
    const toRemove = options.skills
      ? options.skills.split(',').map((s: string) => s.trim())
      : Object.keys(manifest.installed);

    for (const skill of toRemove) {
      const entry = manifest.installed[skill];
      if (!entry || entry.owner !== 'cineforge') {
        console.warn(`  Skipping '${skill}': not managed by cineforge.`);
        continue;
      }
      let destPath: string;
      try {
        destPath = safeJoin(targetDir, skill);
      } catch (e: any) {
        console.error(`Security: ${e.message}`);
        continue;
      }
      if (await fs.pathExists(destPath)) {
        console.log(`  Removing '${skill}'...`);
        await fs.remove(destPath);
      }
      delete manifest.installed[skill];
    }

    if (Object.keys(manifest.installed).length === 0) {
      await fs.remove(manifestPath);
      console.log('All managed skills removed. Manifest deleted.');
    } else {
      manifest.updatedAt = new Date().toISOString();
      await fs.writeJson(manifestPath, manifest, { spaces: 2 });
    }
    console.log('Uninstall complete.');
  });

program
  .command('list')
  .description('List available skills from the registry')
  .action(async () => {
    if (!(await fs.pathExists(REGISTRY_PATH))) {
      console.error('Registry not found. Run from the repository root or set CINEFORGE_ROOT.');
      process.exit(1);
    }
    const registry = await fs.readJson(REGISTRY_PATH);
    console.log(`\nAvailable skills (${Object.keys(registry.skills).length} total):\n`);
    for (const [id, meta] of Object.entries(registry.skills) as any) {
      const status = meta.status ?? 'unknown';
      console.log(`  ${id.padEnd(40)} [${status}]`);
    }
  });

program
  .command('adapters')
  .description('Show supported target agents and their install paths')
  .action(() => {
    console.log('\nSupported target adapters:\n');
    for (const [name, adapter] of Object.entries(ADAPTERS)) {
      const verified = adapter.verified ? '✓ VERIFIED' : '⚠ EXPERIMENTAL';
      const globalPath = adapter.path('global');
      const workspacePath = adapter.path('workspace');
      console.log(`  ${name}`);
      console.log(`    Status:    ${verified}`);
      console.log(`    Global:    ${globalPath}`);
      console.log(`    Workspace: ${workspacePath}`);
      if (adapter.note) console.log(`    Note:      ${adapter.note}`);
      console.log();
    }
  });

program
  .command('init')
  .description('Initialize a CineForge workspace configuration')
  .option('-t, --target <agent>', 'Target agent', 'antigravity')
  .action(async (options) => {
    const configPath = path.join(process.cwd(), '.cineforge.json');
    if (await fs.pathExists(configPath)) {
      console.log('.cineforge.json already exists.');
      return;
    }
    const config = {
      version: '1',
      agent: options.target,
      scope: 'workspace',
      createdAt: new Date().toISOString(),
    };
    await fs.writeJson(configPath, config, { spaces: 2 });
    console.log(`Initialized CineForge workspace for agent '${options.target}'.`);
    console.log(`Config written to ${configPath}`);
  });

program
  .command('info <skill>')
  .description('Show metadata for a specific skill')
  .action(async (skill: string) => {
    const skillDir = path.join(SKILLS_DIR, skill);
    if (!(await fs.pathExists(skillDir))) {
      console.error(`Skill '${skill}' not found.`);
      process.exit(1);
    }
    const skillMd = path.join(skillDir, 'SKILL.md');
    if (await fs.pathExists(skillMd)) {
      const content = await fs.readFile(skillMd, 'utf8');
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
      if (frontmatterMatch) {
        console.log(`\nSkill: ${skill}\n`);
        console.log(frontmatterMatch[1]);
      } else {
        console.log(content.substring(0, 500));
      }
    } else {
      console.log(`Skill directory exists but no SKILL.md found.`);
    }
  });

program
  .command('backup')
  .description('Create a timestamped backup of installed skills')
  .option('-t, --target <agent>', 'Target agent', 'antigravity')
  .option('-s, --scope <scope>', 'Scope', 'workspace')
  .action(async (options) => {
    const targetDir = getTargetDir(options.target, options.scope);
    const backupDest = `${targetDir}.backup-${Date.now()}`;
    if (!(await fs.pathExists(targetDir))) {
      console.error('No installed skills directory found to back up.');
      process.exit(1);
    }
    await fs.copy(targetDir, backupDest);
    console.log(`Backup created at: ${backupDest}`);
  });

program
  .command('restore')
  .description('Restore skills from a backup directory')
  .argument('<backup-path>', 'Path to backup directory')
  .option('-t, --target <agent>', 'Target agent', 'antigravity')
  .option('-s, --scope <scope>', 'Scope', 'workspace')
  .action(async (backupPath: string, options) => {
    const resolvedBackup = path.resolve(backupPath);
    if (!(await fs.pathExists(resolvedBackup))) {
      console.error(`Backup path not found: ${resolvedBackup}`);
      process.exit(1);
    }
    const targetDir = getTargetDir(options.target, options.scope);
    console.log(`Restoring from ${resolvedBackup} → ${targetDir}...`);
    await fs.copy(resolvedBackup, targetDir, { overwrite: true });
    console.log('Restore complete.');
  });

program
  .command('doctor')
  .description('Run diagnostics on the CineForge environment')
  .action(async () => {
    console.log('\nCineForge Doctor\n');
    console.log(`Node version:    ${process.version}`);
    console.log(`Platform:        ${os.platform()} ${os.arch()} ${os.release()}`);
    console.log(`CINEFORGE_ROOT:  ${CINEFORGE_ROOT}`);

    const skillsOk = await fs.pathExists(SKILLS_DIR);
    const registryOk = await fs.pathExists(REGISTRY_PATH);
    const presetsOk = await fs.pathExists(PRESETS_PATH);

    console.log(`Skills dir:      ${skillsOk ? '✓ OK' : '✗ MISSING'} (${SKILLS_DIR})`);
    console.log(`Registry:        ${registryOk ? '✓ OK' : '✗ MISSING'} (${REGISTRY_PATH})`);
    console.log(`Presets:         ${presetsOk ? '✓ OK' : '✗ MISSING'} (${PRESETS_PATH})`);

    if (!skillsOk || !registryOk || !presetsOk) process.exit(1);
    console.log('\nAll checks passed.\n');
  });

program
  .command('validate')
  .description('Validate registry checksums for integrity')
  .action(async () => {
    if (!(await fs.pathExists(CHECKSUMS_PATH))) {
      console.log('No checksum file found — skipping integrity check.');
      return;
    }
    console.log('Validating checksums...');
    const checksums: Record<string, string> = await fs.readJson(CHECKSUMS_PATH);
    let allPassed = true;
    for (const [file, expected] of Object.entries(checksums)) {
      const filePath = path.resolve(CINEFORGE_ROOT, file);
      if (!(await fs.pathExists(filePath))) {
        console.error(`  MISSING  ${file}`);
        allPassed = false;
        continue;
      }
      const content = await fs.readFile(filePath, 'utf8');
      const actual = crypto.createHash('sha256').update(content).digest('hex');
      if (actual !== expected) {
        console.error(`  MISMATCH ${file}`);
        allPassed = false;
      } else {
        console.log(`  OK       ${file}`);
      }
    }
    if (!allPassed) process.exit(1);
    console.log('All checksums valid.');
  });

program
  .command('update')
  .description('Fetch the latest registry and update installed skills')
  .option('-t, --target <agent>', 'Target agent', 'antigravity')
  .option('-s, --scope <scope>', 'Scope', 'workspace')
  .action(async (options) => {
    // Fetch latest registry from GitHub
    const REGISTRY_URL =
      'https://raw.githubusercontent.com/Priyanshuf1/cineforge-ai-skills/master/registry/skills.json';
    console.log(`Fetching latest registry from ${REGISTRY_URL}...`);
    let latestRegistry: any;
    try {
      const res = await fetch(REGISTRY_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      latestRegistry = await res.json();
    } catch (e: any) {
      console.error(`Failed to fetch registry: ${e.message}`);
      process.exit(1);
    }

    const targetDir = getTargetDir(options.target, options.scope);
    const manifestPath = path.join(targetDir, '.cineforge-manifest.json');

    if (!(await fs.pathExists(manifestPath))) {
      console.log('No manifest found. Nothing to update. Run install first.');
      return;
    }

    const manifest: Manifest = await fs.readJson(manifestPath);
    let updatedCount = 0;

    for (const skill of Object.keys(manifest.installed)) {
      const localEntry = manifest.installed[skill];
      const registryMeta = latestRegistry.skills?.[skill];
      if (!registryMeta) {
        console.warn(`  Skill '${skill}' not in upstream registry — skipping.`);
        continue;
      }

      const sourcePath = path.join(SKILLS_DIR, skill);
      if (!(await fs.pathExists(sourcePath))) continue;

      const currentHash = hashDir(sourcePath);
      if (currentHash !== localEntry.sourceHash) {
        console.log(`  Updating '${skill}'...`);
        let destPath: string;
        try {
          destPath = safeJoin(targetDir, skill);
        } catch (e: any) {
          console.error(`Security: ${e.message}`);
          continue;
        }
        const backupPath = `${destPath}.backup-${Date.now()}`;
        if (await fs.pathExists(destPath)) await fs.copy(destPath, backupPath);
        await fs.copy(sourcePath, destPath);
        manifest.installed[skill] = {
          ...localEntry,
          updatedAt: new Date().toISOString(),
          sourceHash: currentHash,
          backupPath,
        };
        updatedCount++;
      }
    }

    manifest.updatedAt = new Date().toISOString();
    await fs.writeJson(manifestPath, manifest, { spaces: 2 });
    console.log(`Updated ${updatedCount} skill(s). Manifest saved.`);
  });

program
  .command('demo')
  .description('Show an example skill install command')
  .action(() => {
    console.log('\nCineForge Demo\n');
    console.log('Install the cinematic-web preset into Antigravity (workspace scope):');
    console.log('  cineforge install --preset cinematic-web --target antigravity --scope workspace\n');
    console.log('Install a single skill:');
    console.log('  cineforge install --skills gsap-motion-direction --target antigravity\n');
    console.log('List all available skills:');
    console.log('  cineforge list\n');
    console.log('Show adapter paths:');
    console.log('  cineforge adapters\n');
  });

program.parse(process.argv);
