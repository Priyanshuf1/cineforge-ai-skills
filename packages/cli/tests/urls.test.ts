import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Repository URLs', () => {
  it('should not contain outdated rabto-ai-skills or cineforge URLs', () => {
    const rootDir = path.resolve(__dirname, '../../..');
    
    const filesToCheck = [
      'README.md',
      'website/source/.vitepress/config.mjs',
      'website/tests/e2e.spec.ts',
      'website/playwright.config.ts',
      'packages/cli/src/bin/rabto.ts',
      'installers/install.sh',
      'installers/install.ps1',
      'installers/uninstall.sh',
      'installers/uninstall.ps1'
    ];

    const forbiddenPatterns = [
      /github\.com\/Priyanshuf1\/rabto-ai-skills/i,
      /github\.com\/Priyanshuf1\/cineforge-ai-skills/i,
      /Priyanshuf1\.github\.io\/rabto-ai-skills/i,
      /Priyanshuf1\.github\.io\/cineforge-ai-skills/i
    ];

    for (const file of filesToCheck) {
      const fullPath = path.join(rootDir, file);
      if (!fs.existsSync(fullPath)) continue;

      const content = fs.readFileSync(fullPath, 'utf8');
      for (const pattern of forbiddenPatterns) {
        if (pattern.test(content)) {
          throw new Error(`File ${file} contains forbidden pattern ${pattern.toString()}`);
        }
      }
    }
  });
});
