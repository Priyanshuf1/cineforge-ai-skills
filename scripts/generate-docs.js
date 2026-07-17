const fs = require('fs-extra');
const path = require('path');

const guideDir = path.join(process.cwd(), 'website', 'source', 'guide');
fs.ensureDirSync(guideDir);

const pages = [
  { file: 'index.md', title: 'Getting Started', content: '# Getting Started\n\nWelcome to the Rabto AI Skills documentation. This experimental toolkit provides creative-web skills for autonomous agents.\n' },
  { file: 'installation.md', title: 'Installation', content: '# Installation\n\nFollow the instructions on the [GitHub repository](https://github.com/Priyanshuf1/rabto) for stable releases.\n' },
  { file: 'cli.md', title: 'CLI Reference', content: '# CLI Reference\n\nLearn how to use `rabto install`, `update`, `backup`, and `restore`.\n' },
  { file: 'agents.md', title: 'Supported Agents', content: '# Supported Agents\n\n- Antigravity (Verified)\n- Claude Code (Experimental)\n- Gemini CLI (Experimental)\n' },
  { file: 'presets.md', title: 'Presets', content: '# Presets\n\nInstall groups of skills using `--preset` (e.g. `cinematic-web`).\n' },
  { file: 'skills.md', title: 'Skills Structure', content: '# Skills Structure\n\nEach skill requires a `SKILL.md` file with strict frontmatter.\n' },
  { file: 'security.md', title: 'Security Architecture', content: '# Security Architecture\n\nRabto implements strict path boundaries, transactional atomicity, and modified file protections.\n' },
  { file: 'troubleshooting.md', title: 'Troubleshooting', content: '# Troubleshooting\n\nIf updates fail, verify you have not locally modified the files, or use `--force`.\n' },
  { file: 'contributing.md', title: 'Contributing', content: '# Contributing\n\nWe welcome PRs. Ensure all CI tests, including Playwright E2E and installer matrices, pass.\n' },
  { file: 'limitations.md', title: 'Limitations', content: '# Limitations\n\nThis is an experimental toolkit. Always verify outputs visually.\n' }
];

for (const page of pages) {
  fs.writeFileSync(path.join(guideDir, page.file), page.content);
}

console.log('Generated 10 guide pages.');
