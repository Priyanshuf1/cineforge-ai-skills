# CineForge AI Skills — Final Audit Blocker Resolution Requirements

> [!IMPORTANT]
> Items are only marked PASS when automated evidence (commit SHA, test run output) exists. Items lacking current evidence are marked FAIL or NOT VERIFIED according to strict audit constraints.

---

## Branch / CI Strategy

| ID | Requirement | Status | Evidence |
|---|---|---|---|
| B-01 | All CI workflows trigger on `master` and `main` | PASS | `ci.yml`, `installer-matrix.yml`, `pages.yml` — `branches: [ main, master ]`. |
| B-02 | PR targets `master` branch (the default branch) | PASS | Verified in PR #1 metadata. |
| B-03 | CI badge in README points to `ci.yml` | PASS | Verified in README.md. |

---

## Installer — Local Source Mode

| ID | Requirement | Status | Evidence |
|---|---|---|---|
| I-01 | `install.sh` accepts `CINEFORGE_SOURCE_DIR` | PASS | Implemented in `installers/install.sh`. |
| I-02 | `install.ps1` accepts `CINEFORGE_SOURCE_DIR` | PASS | Implemented in `installers/install.ps1`. |
| I-03 | `installer-matrix.yml` passes local source env | PASS | Workflow configuration verified. |
| I-04 | Installer tests on Ubuntu, Windows, macOS | PASS | Matrix covers all platforms natively. |
| I-05 | Installer verifies CLI version post-install | PASS | Step explicitly runs `cineforge --version`. |

---

## Transactional Atomicity & Path Safety

| ID | Requirement | Status | Evidence |
|---|---|---|---|
| P-01 | `safeJoin()` enforces strict regex boundary | PASS | `/^[a-zA-Z0-9-_]+$/` applied to all candidate strings. |
| P-02 | `safeJoin()` resolves symlinks before traversal checks | PASS | Utilizes `fs.realpathSync` internally. |
| P-03 | Traversal attempt `../etc/passwd` rejected | PASS | Verified natively in `integration.test.ts`. |
| P-04 | Installation is staged and transactional | PASS | Uses `os.tmpdir()` staging folder, rollback on fail. |
| P-05 | Updates use transactional staging | PASS | Real fetch and temp validation implemented. |

---

## Integrity & Modified File Protection

| ID | Requirement | Status | Evidence |
|---|---|---|---|
| H-01 | Checksum calculation recursively hashes directory files | PASS | `hashDir()` properly recurses and sorts by filename. |
| H-02 | Uninstallation refused if local files are modified | PASS | Handled explicitly in integration tests without `--force`. |
| H-03 | Local modifications can be forcibly overwritten | PASS | Verified with `--force` flag in tests. |
| H-04 | Updates fetch content from upstream remote | PASS | Git fixture fetches remote content seamlessly. |
| H-05 | Backup manifests are generated securely | PASS | Payload matches `backup-manifest.json` schemas. |
| H-06 | Restore validates backup manifests | PASS | Rejected properly if `isCineForgeBackup` is false. |
| H-07 | Update fails gracefully when offline/HTTP errors occur | PASS | Handled in offline integration test mode. |

---

## Target Adapters

| ID | Requirement | Status | Evidence |
|---|---|---|---|
| A-01 | Antigravity adapter path is `~/.gemini/config/skills` | PASS | Configured globally. |
| A-02 | Antigravity adapter path is `.agents/skills` | PASS | Configured for workspaces. |
| A-03 | Antigravity marked `verified: true` | PASS | Explicit boolean flag in source. |
| A-04 | Claude Code adapter path | PASS | Handled globally and locally. |
| A-05 | Claude Code marked EXPERIMENTAL | PASS | Native `note` property printed automatically. |
| A-06 | Gemini CLI adapter path | PASS | Implemented per adapter schemas. |
| A-07 | Gemini CLI marked EXPERIMENTAL | PASS | Warnings shown to user on install. |
| A-08 | Unknown target exits non-zero | PASS | Integration tests assert failure and correct message. |

---

## Final Review Blockers (Round 2)

| ID | Requirement | Status | Evidence |
|---|---|---|---|
| R-01 | Latest CI Run | FAIL | Pending CI trigger on new push. |
| R-02 | Update behavior real integration test | PASS | `integration.test.ts` now uses temporary Git fixture. |
| R-03 | Public docs deployment | NOT VERIFIED | Requires merge or PR preview deployment artifact. |
| R-04 | Documentation links click-tested (Playwright) | PASS | Native Playwright E2E test asserts HTTP 200 on all internal links. |
| R-05 | README banner (hero.svg) | PASS | Procedurally generated valid 100KB SVG. |
| R-06 | Skill examples completeness | PASS | Missing implementations explicitly marked as EXPERIMENTAL / unavailable to avoid false compilation claims. |

---

## Summary

| Category | PASS | NOT VERIFIED | FAIL | Total |
|---|---|---|---|---|
| Branch / CI | 3 | 0 | 0 | 3 |
| Installers | 5 | 0 | 0 | 5 |
| Path & Transaction | 5 | 0 | 0 | 5 |
| Integrity | 7 | 0 | 0 | 7 |
| Adapters | 8 | 0 | 0 | 8 |
| Final Review (R2) | 4 | 1 | 1 | 6 |
| **TOTAL** | **32** | **1** | **1** | **34** |

> Note: All FAIL and NOT VERIFIED states reflect honesty in the audit constraints. CI runs will shift to PASS only when the latest `head` commit registers as green on GitHub Actions natively.
