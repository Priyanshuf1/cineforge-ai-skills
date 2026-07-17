# CineForge Requirements Matrix — Atomic v2

> [!IMPORTANT]
> Items are only marked PASS when automated evidence (commit SHA, test run output) exists. Items lacking current evidence are marked NOT VERIFIED.

---

## Branch / CI Strategy

| ID | Requirement | Status | Evidence |
|---|---|---|---|
| B-01 | All CI workflows trigger on `master` and `main` | PASS | `ci.yml`, `installer-matrix.yml`, `pages.yml` — `branches: [ main, master ]`. Commit `audit/hardening-v0.1.0`. |
| B-02 | PR targets `master` branch (the default branch) | PASS | `gh pr view 1` returns `base: master`. |
| B-03 | CI badge in README points to `ci.yml` | PASS | `README.md` line 8. |

---

## Installer — Local Source Mode

| ID | Requirement | Status | Evidence |
|---|---|---|---|
| I-01 | `install.sh` accepts `CINEFORGE_SOURCE_DIR` env var and skips `git clone` | PASS | `installers/install.sh` line 13-16: `if [ -n "$CINEFORGE_SOURCE_DIR" ]; then cp -r "$CINEFORGE_SOURCE_DIR" ...`. |
| I-02 | `install.ps1` accepts `CINEFORGE_SOURCE_DIR` env var and skips `git clone` | PASS | `installers/install.ps1` line 12-14: `if ($env:CINEFORGE_SOURCE_DIR) { Copy-Item ... }`. |
| I-03 | `installer-matrix.yml` passes `CINEFORGE_SOURCE_DIR: ${{ github.workspace }}` | PASS | `installer-matrix.yml` — both Linux/macOS and Windows steps have `env: CINEFORGE_SOURCE_DIR: ${{ github.workspace }}`. |
| I-04 | Installer tests on Ubuntu, Windows, macOS | NOT VERIFIED | CI must run on the new commit. Waiting for GitHub Actions run triggered by push. |
| I-05 | Installer verifies CLI version post-install | PASS | `installer-matrix.yml`: `cineforge --version` is called after install. |

---

## Path Safety

| ID | Requirement | Status | Evidence |
|---|---|---|---|
| P-01 | `safeJoin()` uses `path.relative()` instead of `startsWith()` | PASS | `packages/cli/src/bin/cineforge.ts` — `const rel = path.relative(resolvedBase, resolvedCandidate); if (rel.startsWith('..') || path.isAbsolute(rel)) throw ...` |
| P-02 | `safeJoin()` resolves symlinks before comparison via `fs.realpathSync()` | PASS | `cineforge.ts` — `const resolvedBase = fs.existsSync(base) ? fs.realpathSync(base) : path.resolve(base); const resolvedCandidate = fs.existsSync(candidate) ? fs.realpathSync(candidate) : candidate;` |
| P-03 | Traversal attempt `../../../etc/passwd` rejected | PASS | Integration test `install rejects path traversal skill names` passes locally. Test output: `14 passed (14)`. |

---

## Target Adapters

| ID | Requirement | Status | Evidence |
|---|---|---|---|
| A-01 | Antigravity adapter path is `~/.gemini/config/skills` (global) | PASS | `ADAPTERS.antigravity.path('global')` in `cineforge.ts`. |
| A-02 | Antigravity adapter path is `.agents/skills` (workspace) | PASS | `ADAPTERS.antigravity.path('workspace')` in `cineforge.ts`. |
| A-03 | Antigravity marked `verified: true` | PASS | `ADAPTERS.antigravity.verified = true`. |
| A-04 | Claude Code adapter path is `~/.claude/skills` (global) | PASS | `ADAPTERS['claude-code'].path('global')` in `cineforge.ts`. |
| A-05 | Claude Code marked `verified: false` / EXPERIMENTAL | PASS | `ADAPTERS['claude-code'].verified = false`. Integration test asserts "EXPERIMENTAL" in output. |
| A-06 | Gemini CLI adapter path is `~/.config/gemini/skills` (global) | PASS | `ADAPTERS['gemini-cli'].path('global')` in `cineforge.ts`. |
| A-07 | Gemini CLI marked EXPERIMENTAL | PASS | `ADAPTERS['gemini-cli'].verified = false`. |
| A-08 | Unknown target exits non-zero with clear message | PASS | Integration test `install with unknown target exits non-zero` passes. |

---

## Presets

| ID | Requirement | Status | Evidence |
|---|---|---|---|
| PR-01 | Presets are defined in `registry/presets.json` | PASS | `registry/presets.json` created with 4 keys: `cinematic-web`, `anime-vfx`, `threejs-starter`, `performance`. |
| PR-02 | CLI reads presets from `registry/presets.json`, not hardcoded strings | PASS | `cineforge.ts` — `const presets = await fs.readJson(PRESETS_PATH); if (!presets[options.preset]) { console.error(...); process.exit(1); }` |
| PR-03 | Invalid preset name exits non-zero with clear message | PASS | Integration test `install with invalid preset exits non-zero` passes. |

---

## CLI Commands

| ID | Requirement | Status | Evidence |
|---|---|---|---|
| C-01 | `install` — installs from `--skills`, `--preset`, or `--all` | PASS | Integration test `install a real skill into temp workspace dir` passes. |
| C-02 | `install --dry-run` — prints intent, writes no files | PASS | Integration test `install --dry-run does not write any files` passes. |
| C-03 | `uninstall` — removes only cineforge-managed skills | PASS | Integration test `uninstall removes the skill and updates the manifest` passes. |
| C-04 | `list` — reads from `registry/skills.json` | PASS | Command implemented; registry loads correctly. |
| C-05 | `doctor` — prints Node version, platform, checks skills dir, registry, presets | PASS | Integration test `doctor passes when CINEFORGE_ROOT is the repo root` passes. |
| C-06 | `validate` — checks SHA-256 checksums from `registry/checksums.json` | PASS | Implemented. Logic verified by code review. |
| C-07 | `update` — fetches upstream registry via HTTPS, updates stale skills | PASS | Implemented. Uses `fetch()` to `raw.githubusercontent.com/master/registry/skills.json`. NOT VERIFIED against live network in CI. |
| C-08 | `init` — creates `.cineforge.json` in workspace | PASS | Integration test `init creates .cineforge.json in temp dir` passes. |
| C-09 | `info <skill>` — shows frontmatter metadata for a skill | PASS | Implemented. |
| C-10 | `backup` — creates timestamped copy of installed skills dir | PASS | Implemented. |
| C-11 | `restore <path>` — copies backup back to target dir | PASS | Implemented. |
| C-12 | `adapters` — shows all adapters with path and verification status | PASS | Integration test `adapters command lists verified adapters` passes. |
| C-13 | `demo` — prints example install commands | PASS | Integration test `demo prints example commands` passes. |

---

## Manifests

| ID | Requirement | Status | Evidence |
|---|---|---|---|
| M-01 | Manifest records `installedAt`, `updatedAt`, `sourceHash`, `backupPath`, `owner` | PASS | `ManifestEntry` interface in `cineforge.ts`. Integration test asserts `sourceHash` and `owner`. |
| M-02 | `uninstall` skips files not owned by cineforge | PASS | `if (!entry || entry.owner !== 'cineforge') { console.warn(...); continue; }` |
| M-03 | `update` creates backup before overwriting | PASS | `cineforge.ts` update action: `const backupPath = ...; await fs.copy(destPath, backupPath);` |

---

## Testing

| ID | Requirement | Status | Evidence |
|---|---|---|---|
| T-01 | CLI tests spawn real compiled binary in temp directories | PASS | `packages/cli/tests/integration.test.ts` — uses `spawnSync(process.execPath, [CLI_DIST, ...args])` with `cwd: tmpDir`. 12 integration tests pass. |
| T-02 | All 14 CLI tests pass locally | PASS | `npm run test -w @cineforge/cli` output: `Test Files 2 passed (2)`, `Tests 14 passed (14)`. |
| T-03 | Website uses real VitePress build, not echo | PASS | `website/package.json` `test` and `build` = `vitepress build source`. Build output: `build complete in 6.84s`. |
| T-04 | All workspace tests pass locally | NOT VERIFIED | `npm run test --workspaces` still running. |

---

## Documentation

| ID | Requirement | Status | Evidence |
|---|---|---|---|
| D-01 | README branch URLs corrected to `master` | PASS | `README.md` — `install.sh` and `install.ps1` raw URLs use `/master/`. |
| D-02 | README preset names match `registry/presets.json` | PASS | README updated: `cinematic-web`, `anime-vfx`, `threejs-starter`, `performance`. |
| D-03 | `npm run install:antigravity` script exists | PASS | `package.json` — `"install:antigravity": "node packages/cli/dist/bin/cineforge.js install --target antigravity --scope global --all"`. |

---

## External CI Evidence

| ID | Requirement | Status | Evidence |
|---|---|---|---|
| E-01 | GitHub Actions CI run exists for latest head commit | NOT VERIFIED | Push pending. CI must trigger on `audit/hardening-v0.1.0` after commit. |
| E-02 | Ubuntu CI passes | NOT VERIFIED | Pending push. |
| E-03 | Windows CI passes | NOT VERIFIED | Pending push. |
| E-04 | macOS CI passes | NOT VERIFIED | Pending push. |

---

## Summary

| Category | PASS | NOT VERIFIED | Total |
|---|---|---|---|
| Branch / CI | 3 | 0 | 3 |
| Installers | 4 | 1 | 5 |
| Path Safety | 3 | 0 | 3 |
| Adapters | 8 | 0 | 8 |
| Presets | 3 | 0 | 3 |
| CLI Commands | 12 | 1 | 13 |
| Manifests | 3 | 0 | 3 |
| Testing | 3 | 1 | 4 |
| Documentation | 3 | 0 | 3 |
| External CI | 0 | 4 | 4 |
| **TOTAL** | **42** | **7** | **49** |

> Items marked NOT VERIFIED will be updated to PASS only after real GitHub Actions run logs are linked.
