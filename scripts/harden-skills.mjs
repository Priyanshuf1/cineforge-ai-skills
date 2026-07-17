import fs from 'fs-extra';
import path from 'path';

async function hardenSkills() {
  const skillsDir = path.join(process.cwd(), 'skills');
  const skillDirs = await fs.readdir(skillsDir);
  
  for (const dir of skillDirs) {
    const skillPath = path.join(skillsDir, dir, 'SKILL.md');
    if (await fs.pathExists(skillPath)) {
      let content = await fs.readFile(skillPath, 'utf8');
      
      // Basic hardening: if no explicit status is set, inject status: EXPERIMENTAL
      if (!content.includes('status: ')) {
          content = content.replace(/^name: (.*)$/m, 'name: $1\nstatus: EXPERIMENTAL\nversion: 0.1.0\ncategories: ["creative-web"]');
          await fs.writeFile(skillPath, content, 'utf8');
          console.log(`Hardened ${dir} -> EXPERIMENTAL`);
      }
    }
  }
}

hardenSkills().catch(console.error);
