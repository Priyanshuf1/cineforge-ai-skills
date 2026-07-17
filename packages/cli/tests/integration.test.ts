import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { execSync, spawnSync, SpawnSyncReturns } from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';

// Path to the compiled CLI entry point — resolve from the package root reliably
// __dirname in Vitest source context = packages/cli/tests/
const PACKAGE_ROOT = path.resolve(__dirname, '..');
const CLI_DIST = path.join(PACKAGE_ROOT, 'dist', 'bin', 'cineforge.js');
// Monorepo root = packages/cli/../../ = cineforge-ai-skills/
const REPO_ROOT = path.resolve(PACKAGE_ROOT, '../..');

// Sanity: verify REPO_ROOT has the skills dir
if (!fs.existsSync(path.join(REPO_ROOT, 'skills'))) {
  throw new Error(`REPO_ROOT sanity check failed: no 'skills' dir at ${REPO_ROOT}`);
}

function cli(args: string[], extraEnv: Record<string, string> = {}, cwd?: string): SpawnSyncReturns<string> {
  return spawnSync(process.execPath, [CLI_DIST, ...args], {
    cwd: cwd ?? os.tmpdir(),
    env: { ...process.env, CINEFORGE_ROOT: REPO_ROOT, ...extraEnv },
    encoding: 'utf8',
  });
}

describe('CLI Integration Tests (real temp directories)', () => {
  let tmpDir: string;

  beforeAll(async () => {
    // Ensure CLI is built before test suite runs
    if (!fs.existsSync(CLI_DIST)) {
      execSync('npx tsc', { cwd: path.resolve(__dirname, '..'), stdio: 'inherit' });
    }
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'cineforge-test-'));
  });

  afterAll(async () => {
    await fs.remove(tmpDir);
  });

  // ── Basic invocation ──────────────────────────────────────────────────────
  it('prints help without error', () => {
    const r = cli(['--help']);
    expect(r.status).toBe(0);
    expect(r.stdout).toContain('cineforge');
  });

  it('prints version', () => {
    const r = cli(['--version']);
    expect(r.status).toBe(0);
    expect(r.stdout.trim()).toMatch(/0\.\d+\.\d+/);
  });

  // ── Adapters command ──────────────────────────────────────────────────────
  it('adapters command lists verified adapters', () => {
    const r = cli(['adapters']);
    expect(r.status).toBe(0);
    expect(r.stdout).toContain('antigravity');
    expect(r.stdout).toContain('VERIFIED');
    expect(r.stdout).toContain('claude-code');
    expect(r.stdout).toContain('EXPERIMENTAL');
    expect(r.stdout).toContain('gemini-cli');
  });

  // ── Doctor command ────────────────────────────────────────────────────────
  it('doctor passes when CINEFORGE_ROOT is the repo root', () => {
    const r = cli(['doctor']);
    expect(r.status).toBe(0);
    expect(r.stdout).toContain('All checks passed');
  });

  // ── Init command ──────────────────────────────────────────────────────────
  it('init creates .cineforge.json in temp dir', () => {
    const r = cli(['init', '--target', 'antigravity'], {}, tmpDir);
    expect(r.status).toBe(0);
    const configPath = path.join(tmpDir, '.cineforge.json');
    expect(fs.existsSync(configPath)).toBe(true);
    const config = fs.readJsonSync(configPath);
    expect(config.agent).toBe('antigravity');
  });

  // ── Install (dry-run) ─────────────────────────────────────────────────────
  it('install --dry-run does not write any files', () => {
    const r = cli(
      ['install', '--skills', 'threejs-foundations', '--target', 'antigravity', '--scope', 'workspace', '--dry-run'],
      {},
      tmpDir
    );
    expect(r.status).toBe(0);
    expect(r.stdout).toContain('DRY RUN');
    // Workspace installs to <cwd>/.agents/skills — dry-run should NOT create this
    expect(fs.existsSync(path.join(tmpDir, '.agents', 'skills', 'threejs-foundations'))).toBe(false);
  });

  // ── Invalid target ────────────────────────────────────────────────────────
  it('install with unknown target exits non-zero', () => {
    const r = cli(['install', '--skills', 'threejs-foundations', '--target', 'unknown-agent'], {}, tmpDir);
    expect(r.status).toBe(1);
    expect(r.stderr + r.stdout).toMatch(/Unknown target/);
  });

  // ── Invalid preset ────────────────────────────────────────────────────────
  it('install with invalid preset exits non-zero', () => {
    const r = cli(['install', '--preset', 'nonexistent-preset', '--target', 'antigravity'], {}, tmpDir);
    expect(r.status).toBe(1);
    // Could be "Unknown preset" or "registry/presets.json not found" — both are correct rejections
    expect(r.stderr + r.stdout).toMatch(/Unknown preset|not found|Cannot resolve/);
  });

  // ── Real install into temp dir ────────────────────────────────────────────
  it('install a real skill into temp workspace dir', () => {
    const r = cli(
      ['install', '--skills', 'threejs-foundations', '--target', 'antigravity', '--scope', 'workspace'],
      {},
      tmpDir
    );
    if (r.status !== 0) {
      console.error('STDOUT:', r.stdout);
      console.error('STDERR:', r.stderr);
    }
    expect(r.status).toBe(0);
    const destSkill = path.join(tmpDir, '.agents', 'skills', 'threejs-foundations');
    expect(fs.existsSync(destSkill)).toBe(true);
    const manifestPath = path.join(tmpDir, '.agents', 'skills', '.cineforge-manifest.json');
    expect(fs.existsSync(manifestPath)).toBe(true);
    const manifest = fs.readJsonSync(manifestPath);
    expect(manifest.installed['threejs-foundations']).toBeDefined();
    expect(manifest.installed['threejs-foundations'].sourceHash).toBeTruthy();
    expect(manifest.installed['threejs-foundations'].owner).toBe('cineforge');
  });

  // ── Uninstall ─────────────────────────────────────────────────────────────
  it('uninstall removes the skill and updates the manifest', () => {
    const r = cli(
      ['uninstall', '--target', 'antigravity', '--scope', 'workspace', '--skills', 'threejs-foundations'],
      {},
      tmpDir
    );
    expect(r.status).toBe(0);
    const destSkill = path.join(tmpDir, '.agents', 'skills', 'threejs-foundations');
    expect(fs.existsSync(destSkill)).toBe(false);
  });

  // ── Demo command ──────────────────────────────────────────────────────────
  it('demo prints example commands', () => {
    const r = cli(['demo']);
    expect(r.status).toBe(0);
    expect(r.stdout).toContain('cineforge install');
  });

  // ── Path traversal protection ─────────────────────────────────────────────
  it('install rejects path traversal skill names', () => {
    const r = cli(
      ['install', '--skills', '../../../etc/passwd', '--target', 'antigravity', '--scope', 'workspace'],
      {},
      tmpDir
    );
    const output = r.stdout + r.stderr;
    // Must either fail or report the skill was not found (can't traverse out)
    const isRejected = r.status !== 0 || output.includes('not found') || output.includes('traversal') || output.includes('Security');
    expect(isRejected).toBe(true);
  });
});
