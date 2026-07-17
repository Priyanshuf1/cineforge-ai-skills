import { describe, it, expect, beforeEach } from 'vitest';
import { spawnSync, SpawnSyncReturns } from 'child_process';
import path from 'path';
import fs from 'fs-extra';
import os from 'os';
import crypto from 'crypto';

const PACKAGE_ROOT = path.resolve(__dirname, '..');
const CLI_DIST = path.join(PACKAGE_ROOT, 'dist', 'bin', 'cineforge.js');
const REPO_ROOT = path.resolve(PACKAGE_ROOT, '../..');

if (!fs.existsSync(path.join(REPO_ROOT, 'skills'))) {
  throw new Error(`REPO_ROOT sanity check failed: no 'skills' dir at ${REPO_ROOT}`);
}

function cli(args: string[], extraEnv: Record<string, string> = {}, cwd?: string): SpawnSyncReturns<string> {
  return spawnSync(process.execPath, [CLI_DIST, ...args], {
    encoding: 'utf8',
    env: {
      ...process.env,
      CINEFORGE_ROOT: REPO_ROOT,
      ...extraEnv,
    },
    cwd: cwd || process.cwd(),
  });
}

function createTempWorkspace(): string {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cineforge-test-'));
  // Write a mock package.json so workspace resolves if needed, though not strictly required
  fs.writeFileSync(path.join(tmpDir, 'package.json'), JSON.stringify({ name: "mock-ws" }));
  return tmpDir;
}

describe('CLI Integration Tests (real temp directories)', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = createTempWorkspace();
  });

  // 1. Path Security
  it('install rejects path traversal skill names', () => {
    const r = cli(['install', '--skills', '../etc/passwd'], {}, tmpDir);
    expect(r.status).not.toBe(0);
    expect(r.stderr).toContain('Invalid skill ID');
  });

  // 2. Transactional Install
  it('install a real skill into temp workspace dir', () => {
    const r = cli(['install', '--skills', 'threejs-foundations', '--target', 'antigravity'], {}, tmpDir);
    expect(r.status).toBe(0);
    const destSkill = path.join(tmpDir, '.agents', 'skills', 'threejs-foundations');
    expect(fs.existsSync(destSkill)).toBe(true);
    expect(fs.existsSync(path.join(destSkill, 'SKILL.md'))).toBe(true);
  });

  // 3. Modified File Protection
  it('uninstall refuses to remove a locally modified skill without --force', () => {
    cli(['install', '--skills', 'threejs-foundations', '--target', 'antigravity'], {}, tmpDir);
    const skillPath = path.join(tmpDir, '.agents', 'skills', 'threejs-foundations');
    // modify file
    fs.appendFileSync(path.join(skillPath, 'SKILL.md'), '\nMODIFIED');
    
    const r = cli(['uninstall', '--skills', 'threejs-foundations'], {}, tmpDir);
    expect(r.status).not.toBe(0);
    expect(r.stderr).toContain('has been modified locally');
    
    // still exists
    expect(fs.existsSync(skillPath)).toBe(true);
  });

  it('uninstall removes modified skill with --force', () => {
    cli(['install', '--skills', 'threejs-foundations', '--target', 'antigravity'], {}, tmpDir);
    const skillPath = path.join(tmpDir, '.agents', 'skills', 'threejs-foundations');
    fs.appendFileSync(path.join(skillPath, 'SKILL.md'), '\nMODIFIED');
    
    const r = cli(['uninstall', '--skills', 'threejs-foundations', '--force'], {}, tmpDir);
    expect(r.status).toBe(0);
    expect(fs.existsSync(skillPath)).toBe(false);
  });

  // 4. Update (Local Remote Mock)
  it('update fetches from remote and applies cleanly', () => {
    // Install first
    cli(['install', '--skills', 'threejs-foundations'], {}, tmpDir);
    
    // To simulate update, we change the local file, but we need --force because it's modified!
    // Or better, we don't modify it, but we change the manifest to have an old hash!
    const manifestPath = path.join(tmpDir, '.agents', 'skills', '.cineforge-manifest.json');
    const manifest = fs.readJsonSync(manifestPath);
    manifest.installed['threejs-foundations'].sourceHash = 'oldhash';
    fs.writeJsonSync(manifestPath, manifest);

    const r = cli(['update', '--target', 'antigravity'], {
      CINEFORGE_REMOTE_REPO: `file://${REPO_ROOT.replace(/\\/g, '/')}`
    }, tmpDir);
    
    expect(r.status).toBe(0);
    const manifestNew = fs.readJsonSync(manifestPath);
    expect(manifestNew.installed['threejs-foundations'].sourceHash).not.toBe('oldhash');
  });

  it('update handles HTTP/git failure gracefully (offline test)', () => {
    cli(['install', '--skills', 'threejs-foundations'], {}, tmpDir);
    const r = cli(['update'], {
      CINEFORGE_REMOTE_REPO: 'https://invalid.github.url.that.does.not.exist/repo.git'
    }, tmpDir);
    expect(r.status).not.toBe(0);
    expect(r.stderr).toContain('Could not fetch');
  });

  // 5. Safe Backup and Restore
  it('backup creates a valid backup manifest and restore validates it', () => {
    cli(['install', '--skills', 'threejs-foundations'], {}, tmpDir);
    const r = cli(['backup'], {}, tmpDir);
    expect(r.status).toBe(0);

    const backupDirMatch = r.stdout.match(/Backup created at: (.*)/);
    expect(backupDirMatch).toBeTruthy();
    const backupDir = backupDirMatch![1].trim();

    expect(fs.existsSync(path.join(backupDir, 'backup-manifest.json'))).toBe(true);

    // Empty target
    fs.emptyDirSync(path.join(tmpDir, '.agents', 'skills'));
    expect(fs.existsSync(path.join(tmpDir, '.agents', 'skills', 'threejs-foundations'))).toBe(false);

    // Restore
    const r2 = cli(['restore', backupDir], {}, tmpDir);
    expect(r2.status).toBe(0);
    expect(fs.existsSync(path.join(tmpDir, '.agents', 'skills', 'threejs-foundations'))).toBe(true);
  });

  it('restore rejects an invalid non-backup directory', () => {
    const fakeBackup = path.join(tmpDir, 'fake-backup');
    fs.mkdirSync(fakeBackup);
    const r = cli(['restore', fakeBackup], {}, tmpDir);
    expect(r.status).not.toBe(0);
    expect(r.stderr).toContain('Missing backup-manifest.json');
  });

  it('install rejects unknown target', () => {
    const r = cli(['install', '--skills', 'threejs-foundations', '--target', 'invalid-agent']);
    expect(r.status).not.toBe(0);
  });
});
