import fs from 'fs-extra';
import path from 'path';

const SKILLS_DIR = path.join(process.cwd(), 'skills');
const REQUIRED_FIELDS = [
  'name', 'version', 'status', 'description', 'categories', 'triggers',
  'related_skills', 'conflicting_skills', 'primary_tools', 'minimum_inputs',
  'verification_required', 'last_reviewed'
];

async function run() {
  const skills = await fs.readdir(SKILLS_DIR);
  let hasError = false;

  for (const skill of skills) {
    const skillPath = path.join(SKILLS_DIR, skill);
    if (!(await fs.stat(skillPath)).isDirectory()) continue;

    const skillMdPath = path.join(skillPath, 'SKILL.md');
    if (await fs.pathExists(skillMdPath)) {
      const content = await fs.readFile(skillMdPath, 'utf8');
      const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
      
      if (!match) {
        console.error(`[ERROR] Skill ${skill} is missing frontmatter entirely!`);
        hasError = true;
        continue;
      }
      
      const frontmatter = match[1];
      for (const field of REQUIRED_FIELDS) {
        if (!frontmatter.includes(`${field}:`)) {
          console.error(`[ERROR] Skill ${skill} is missing required field: ${field}`);
          hasError = true;
        }
      }
    } else {
      console.error(`[ERROR] Skill ${skill} is missing SKILL.md!`);
      hasError = true;
    }
  }

  if (hasError) {
    console.error('Skill metadata validation failed.');
    process.exit(1);
  }
  
  console.log('Skill metadata validation passed.');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
