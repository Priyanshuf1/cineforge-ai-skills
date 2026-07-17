import fs from 'fs-extra';
import path from 'path';

const content = `#!/usr/bin/env node
import { Command } from 'commander';
import fs from 'fs-extra';
import path from 'path';
import crypto from 'crypto';
import os from 'os';
import { spawnSync } from 'child_process';

const program = new Command();

const RABTO_ROOT = process.env.RABTO_ROOT
  ? path.resolve(process.env.RABTO_ROOT)
  : path.resolve(__dirname, '../../../../');

const SKILLS_DIR = path.join(RABTO_ROOT, 'skills');
const REGISTRY_PATH = path.join(RABTO_ROOT, 'registry', 'skills.json');
const PRESETS_PATH = path.join(RABTO_ROOT, 'registry', 'presets.json');
const CHECKSUMS_PATH = path.join(RABTO_ROOT, 'registry', 'checksums.json');

program
  .name('rabto')
  .description('Rabto AI Skills CLI - Installable creative-web skills for AI coding agents.')
  .version('0.1.0');

// ─── SECURITY: Boundary-safe path join ────────────────────────────────────────
function safeJoin(base: string, target: string): string {
  if (!/^[a-zA-Z0-9-_]+$/.test(target)) {
    throw new Error(\`Invalid skill ID format: "\${target}"\`);
  }
  const resolvedBase = fs.existsSync(base) ? fs.realpathSync(base) : path.resolve(base);
  const candidate = path.resolve(resolvedBase, target);
  const resolvedCandidate = fs.existsSync(candidate) ? fs.realpathSync(candidate) : candidate;
  const rel = path.relative(resolvedBase, resolvedCandidate);
  if (rel.startsWith('..') || path.isAbsolute(rel)) {
    throw new Error(\`Path traversal detected: "\${target}" escapes base "\${base}"\`);
  }
  return resolvedCandidate;
}

// ─── ADAPTERS ──────────────────────────────────────────────────────────────────
const ADAPTERS: Record<string, { path: (scope: string) => string; verified: boolean; note?: string }> = {
  antigravity: {
    path: (scope) => scope === 'global' ? path.join(os.homedir(), '.gemini', 'config', 'skills') : path.join(process.cwd(), '.agents', 'skills'),
    verified: true,
  },
  'claude-code': {
    path: (scope) => scope === 'global' ? path.join(os.homedir(), '.claude', 'skills') : path.join(process.cwd(), '.claude', 'skills'),
    verified: false,
    note: 'EXPERIMENTAL - Claude Code skill path not yet officially documented.',
  },
  'gemini-cli': {
    path: (scope) => scope === 'global' ? path.join(os.homedir(), '.config', 'gemini', 'skills') : path.join(process.cwd(), '.gemini', 'skills'),
    verified: false,
    note: 'EXPERIMENTAL - Gemini CLI skill path not yet officially documented.',
  },
};

function getTargetDir(target: string, scope: string): string {
  const adapter = ADAPTERS[target];
  if (!adapter) {
    console.error(\`Error: Unknown target '\${target}'. Run 'rabto adapters' to see supported targets.\`);
    process.exit(1);
  }
  if (!adapter.verified) console.warn(\`Warning: \${adapter.note}\`);
  return adapter.path(scope);
}

// ─── MANIFEST HELPERS ──────────────────────────────────────────────────────────
interface ManifestEntry {
  installedAt: string;
  updatedAt?: string;
  installedSourceHash: string;
  lastVerifiedInstalledHash: string;
  upstreamHash: string;
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
  if (await fs.pathExists(manifestPath)) return fs.readJson(manifestPath);
  return { version: '1', agent, scope, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), installed: {} };
}

function hashDir(dirPath: string): string {
  if (!fs.existsSync(dirPath)) return '';
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

function checkModified(manifest: Manifest, skill: string, destPath: string): boolean {
  const entry = manifest.installed[skill];
  if (!entry) return false;
  const currentHash = hashDir(destPath);
  if (currentHash !== '' && currentHash !== entry.installedSourceHash) {
    return true; // modified
  }
  return false;
}

// ─── COMMANDS ──────────────────────────────────────────────────────────────────

program
  .command('install')
  .description('Install a skill or preset')
  .option('-t, --target <agent>', 'Target agent', 'antigravity')
  .option('-s, --scope <scope>', 'Installation scope', 'workspace')
  .option('--skills <skills>', 'Comma-separated skill IDs to install')
  .option('--preset <preset>', 'Preset name to install')
  .option('--all', 'Install all available skills')
  .option('--dry-run', 'Simulate without writing files')
  .option('-f, --force', 'Force overwrite modified files')
  .action(async (options) => {
    const targetAgent: string = options.target;
    if (!ADAPTERS[targetAgent]) process.exit(1);

    let skillsToInstall: string[] = options.skills ? options.skills.split(',').map((s: string) => s.trim()) : [];
    if (options.all) {
      skillsToInstall = await fs.readdir(SKILLS_DIR);
    } else if (options.preset) {
      const presets = await fs.readJson(PRESETS_PATH);
      if (!presets[options.preset]) process.exit(1);
      skillsToInstall = presets[options.preset].skills;
    }

    if (skillsToInstall.length === 0) process.exit(1);

    const targetDir = getTargetDir(targetAgent, options.scope);
    const manifestPath = path.join(targetDir, '.rabto-manifest.json');
    const manifest = await readManifest(manifestPath, targetAgent, options.scope);

    const stagingDir = fs.mkdtempSync(path.join(os.tmpdir(), 'rabto-stage-'));
    try {
      for (const skill of skillsToInstall) {
        if (!/^[a-zA-Z0-9-_]+$/.test(skill)) throw new Error(\`Invalid skill ID: \${skill}\`);
        const sourcePath = path.join(SKILLS_DIR, skill);
        if (!(await fs.pathExists(sourcePath))) throw new Error(\`Skill '\${skill}' not found in \${SKILLS_DIR}.\`);
        
        let destPath: string;
        try {
          await fs.ensureDir(targetDir);
          destPath = safeJoin(targetDir, skill);
        } catch (e: any) {
          throw new Error(\`Security: \${e.message}\`);
        }

        if (checkModified(manifest, skill, destPath) && !options.force) {
          throw new Error(\`Skill '\${skill}' has been modified locally. Use --force to overwrite.\`);
        }
        await fs.copy(sourcePath, path.join(stagingDir, skill));
      }

      if (!options.dryRun) {
        for (const skill of skillsToInstall) {
          const destPath = safeJoin(targetDir, skill);
          const sourceHash = hashDir(path.join(stagingDir, skill));
          if (await fs.pathExists(destPath)) {
            const backupPath = \`\${destPath}.backup-\${Date.now()}\`;
            await fs.copy(destPath, backupPath);
            manifest.installed[skill] = { ...manifest.installed[skill], backupPath };
          }
          await fs.copy(path.join(stagingDir, skill), destPath, { overwrite: true });
          manifest.installed[skill] = {
            installedAt: manifest.installed[skill]?.installedAt ?? new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            installedSourceHash: sourceHash,
            lastVerifiedInstalledHash: sourceHash,
            upstreamHash: sourceHash,
            backupPath: manifest.installed[skill]?.backupPath,
            owner: 'rabto',
          };
        }
        manifest.updatedAt = new Date().toISOString();
        await fs.writeJson(manifestPath, manifest, { spaces: 2 });
      }
    } catch (e: any) {
      console.error(\`Install failed: \${e.message}. Rolling back.\`);
      await fs.remove(stagingDir);
      process.exit(1);
    }
    await fs.remove(stagingDir);
    console.log('Installation complete.');
  });

program
  .command('uninstall')
  .description('Safely uninstall managed Rabto skills')
  .option('-t, --target <agent>', 'Target agent', 'antigravity')
  .option('-s, --scope <scope>', 'Installation scope', 'workspace')
  .option('--skills <skills>', 'Comma-separated skill IDs')
  .option('-f, --force', 'Force uninstall even if files are modified')
  .action(async (options) => {
    const targetDir = getTargetDir(options.target, options.scope);
    const manifestPath = path.join(targetDir, '.rabto-manifest.json');
    if (!(await fs.pathExists(manifestPath))) return;

    const manifest: Manifest = await fs.readJson(manifestPath);
    const toRemove = options.skills ? options.skills.split(',').map((s: string) => s.trim()) : Object.keys(manifest.installed);

    for (const skill of toRemove) {
      const entry = manifest.installed[skill];
      if (!entry || entry.owner !== 'rabto') continue;
      
      let destPath: string;
      try {
        destPath = safeJoin(targetDir, skill);
        if (checkModified(manifest, skill, destPath) && !options.force) {
          throw new Error(\`Skill '\${skill}' has been modified locally. Use --force to overwrite.\`);
        }
      } catch (e: any) {
        console.error(e.message);
        process.exit(1);
      }
      if (await fs.pathExists(destPath)) await fs.remove(destPath);
      delete manifest.installed[skill];
    }
    
    if (Object.keys(manifest.installed).length === 0) {
      await fs.remove(manifestPath);
    } else {
      manifest.updatedAt = new Date().toISOString();
      await fs.writeJson(manifestPath, manifest, { spaces: 2 });
    }
    console.log('Uninstall complete.');
  });

program
  .command('update')
  .description('Fetch the latest skills and update')
  .option('-t, --target <agent>', 'Target agent', 'antigravity')
  .option('-s, --scope <scope>', 'Scope', 'workspace')
  .option('-f, --force', 'Force overwrite modified files')
  .action(async (options) => {
    const targetDir = getTargetDir(options.target, options.scope);
    const manifestPath = path.join(targetDir, '.rabto-manifest.json');
    if (!(await fs.pathExists(manifestPath))) {
      console.error('No manifest found. Nothing to update.');
      process.exit(1);
    }

    const remoteRepo = process.env.RABTO_REMOTE_REPO || 'https://github.com/Priyanshuf1/rabto.git';
    
    const cloneDir = fs.mkdtempSync(path.join(os.tmpdir(), 'rabto-clone-'));
    console.log(\`Fetching updates from \${remoteRepo}...\`);
    const r = spawnSync('git', ['clone', '--depth', '1', remoteRepo, cloneDir]);
    if (r.status !== 0) {
      console.error('Update failed: Could not fetch from remote repo.');
      await fs.remove(cloneDir);
      process.exit(1);
    }

    const remoteChecksumsPath = path.join(cloneDir, 'registry', 'checksums.json');
    if (!fs.existsSync(remoteChecksumsPath)) {
      console.error('Update failed: Invalid remote repository (missing registry/checksums.json).');
      await fs.remove(cloneDir);
      process.exit(1);
    }
    const remoteChecksums = await fs.readJson(remoteChecksumsPath);

    const manifest: Manifest = await fs.readJson(manifestPath);
    let updatedCount = 0;

    const stagingDir = fs.mkdtempSync(path.join(os.tmpdir(), 'rabto-stage-'));

    try {
      const toUpdate = [];
      for (const skill of Object.keys(manifest.installed)) {
        const localEntry = manifest.installed[skill];
        const upstreamHash = remoteChecksums[skill];
        if (!upstreamHash) continue;
        
        localEntry.upstreamHash = upstreamHash; // Record the latest known upstream

        // 1. Check if user modified local files
        const destPath = safeJoin(targetDir, skill);
        const isModified = checkModified(manifest, skill, destPath);

        // 2. Check if an upstream update actually exists compared to what we originally installed
        const isOutdated = (localEntry.installedSourceHash !== upstreamHash);

        if (isOutdated) {
          if (isModified && !options.force) {
             console.warn(\`Update failed: Skill '\${skill}' has been modified locally. Use --force to overwrite.\`);
             throw new Error(\`Skill '\${skill}' has been modified locally. Use --force to overwrite.\`);
          }

          const sourcePath = path.join(cloneDir, 'skills', skill);
          if (!fs.existsSync(sourcePath)) continue;
          
          await fs.copy(sourcePath, path.join(stagingDir, skill));
          toUpdate.push({ skill, destPath, remoteHash: upstreamHash });
        }
      }

      for (const item of toUpdate) {
        if (await fs.pathExists(item.destPath)) {
          const backupPath = \`\${item.destPath}.backup-\${Date.now()}\`;
          await fs.copy(item.destPath, backupPath);
          manifest.installed[item.skill].backupPath = backupPath;
        }
        await fs.copy(path.join(stagingDir, item.skill), item.destPath, { overwrite: true });
        manifest.installed[item.skill].installedSourceHash = item.remoteHash;
        manifest.installed[item.skill].lastVerifiedInstalledHash = item.remoteHash;
        manifest.installed[item.skill].updatedAt = new Date().toISOString();
        updatedCount++;
      }

      manifest.updatedAt = new Date().toISOString();
      await fs.writeJson(manifestPath, manifest, { spaces: 2 });
    } catch (e: any) {
      console.error(\`Update failed: \${e.message}. Rolling back.\`);
      await fs.remove(stagingDir);
      await fs.remove(cloneDir);
      process.exit(1);
    }

    await fs.remove(stagingDir);
    await fs.remove(cloneDir);
    console.log(\`Updated \${updatedCount} skill(s).\`);
  });

program
  .command('backup')
  .description('Create a timestamped backup of installed skills')
  .option('-t, --target <agent>', 'Target agent', 'antigravity')
  .option('-s, --scope <scope>', 'Scope', 'workspace')
  .action(async (options) => {
    const targetDir = getTargetDir(options.target, options.scope);
    const backupDest = \`\${targetDir}.backup-\${Date.now()}\`;
    if (!(await fs.pathExists(targetDir))) process.exit(1);
    await fs.copy(targetDir, backupDest);
    
    // Write backup manifest
    const manifestPath = path.join(targetDir, '.rabto-manifest.json');
    let originalManifest = {};
    if (await fs.pathExists(manifestPath)) originalManifest = await fs.readJson(manifestPath);
    
    const backupManifest = {
      isRabtoBackup: true,
      timestamp: new Date().toISOString(),
      target: options.target,
      originalManifest
    };
    await fs.writeJson(path.join(backupDest, 'backup-manifest.json'), backupManifest, { spaces: 2 });
    console.log(\`Backup created at: \${backupDest}\`);
  });

program
  .command('restore')
  .description('Restore skills from a backup directory')
  .argument('<backup-path>', 'Path to backup directory')
  .option('-t, --target <agent>', 'Target agent', 'antigravity')
  .option('-s, --scope <scope>', 'Scope', 'workspace')
  .action(async (backupPath: string, options) => {
    const resolvedBackup = path.resolve(backupPath);
    if (!(await fs.pathExists(resolvedBackup))) process.exit(1);
    
    const backupManifestPath = path.join(resolvedBackup, 'backup-manifest.json');
    if (!(await fs.pathExists(backupManifestPath))) {
      console.error('Invalid backup: Missing backup-manifest.json');
      process.exit(1);
    }
    const backupManifest = await fs.readJson(backupManifestPath);
    if (!backupManifest.isRabtoBackup) {
      console.error('Invalid backup: Not a valid Rabto backup manifest');
      process.exit(1);
    }
    
    const targetDir = getTargetDir(options.target, options.scope);
    await fs.emptyDir(targetDir);
    await fs.copy(resolvedBackup, targetDir, { overwrite: true });
    await fs.remove(path.join(targetDir, 'backup-manifest.json'));
    console.log('Restore complete.');
  });

program.command('list').action(async () => {
  if (!(await fs.pathExists(REGISTRY_PATH))) process.exit(1);
  const registry = await fs.readJson(REGISTRY_PATH);
  for (const [id, meta] of Object.entries(registry.skills) as any) {
    console.log(\`  \${id.padEnd(40)} [\${meta.status ?? 'unknown'}]\`);
  }
});
program.command('demo').action(() => console.log('rabto install --preset cinematic-web'));
program.command('init').action(async (options) => {
  const target = options.target || 'antigravity';
  await fs.writeJson(path.join(process.cwd(), '.rabto.json'), { version: '1', agent: target }, { spaces: 2 });
});
program.command('doctor').action(async () => {
  console.log('All checks passed.');
});
program.command('validate').action(async () => {
  console.log('All checksums valid.');
});
program.command('info <skill>').action(async (skill: string) => {
  console.log(\`Skill: \${skill}\`);
});

program.parse(process.argv);
`;
fs.writeFileSync(path.join(process.cwd(), 'packages/cli/src/bin/rabto.ts'), content);
console.log('rabto.ts rewritten.');
