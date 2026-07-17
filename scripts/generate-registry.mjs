import fs from 'fs-extra';
import path from 'path';
import crypto from 'crypto';

function parseFrontmatter(content) {
  const lines = content.split('\n');
  if (lines[0].trim() !== '---') return null;
  
  const yaml = {};
  let i = 1;
  while (i < lines.length && lines[i].trim() !== '---') {
    const line = lines[i];
    const colonIdx = line.indexOf(':');
    if (colonIdx !== -1) {
      const key = line.substring(0, colonIdx).trim();
      let value = line.substring(colonIdx + 1).trim();
      // Handle simple arrays
      if (value.startsWith('[') && value.endsWith(']')) {
         value = value.substring(1, value.length - 1).split(',').map(v => v.trim().replace(/^['"]|['"]$/g, ''));
      } else {
         value = value.replace(/^['"]|['"]$/g, '');
      }
      yaml[key] = value;
    }
    i++;
  }
  return yaml;
}

async function generateRegistry() {
  const skillsDir = path.join(process.cwd(), 'skills');
  const registryDir = path.join(process.cwd(), 'registry');
  const skillDirs = await fs.readdir(skillsDir);
  
  const registry = {
    skills: {},
    metadata: {
      generated_at: new Date().toISOString(),
      count: 0
    }
  };
  
  for (const dir of skillDirs) {
    const skillPath = path.join(skillsDir, dir, 'SKILL.md');
    if (await fs.pathExists(skillPath)) {
      const content = await fs.readFile(skillPath, 'utf8');
      const yaml = parseFrontmatter(content);
      
      if (yaml && yaml.name) {
        // Enforce required fields with defaults for existing legacy skills
        yaml.status = yaml.status || 'BETA';
        yaml.version = yaml.version || '0.1.0';
        yaml.categories = yaml.categories || ['creative-web'];
        
        // Write the normalized frontmatter back to file if missing fields (simplistic hardening)
        registry.skills[yaml.name] = yaml;
        registry.metadata.count++;
      }
    }
  }
  
  await fs.ensureDir(registryDir);
  await fs.writeJson(path.join(registryDir, 'skills.json'), registry, { spaces: 2 });
  console.log(`Generated registry with ${registry.metadata.count} skills.`);
  
  // Calculate checksums
  const checksums = {};
  for (const dir of skillDirs) {
     const skillPath = path.join(skillsDir, dir, 'SKILL.md');
     if (await fs.pathExists(skillPath)) {
        const content = await fs.readFile(skillPath, 'utf8');
        checksums[`skills/${dir}/SKILL.md`] = crypto.createHash('sha256').update(content).digest('hex');
     }
  }
  await fs.writeJson(path.join(registryDir, 'checksums.json'), checksums, { spaces: 2 });
  console.log(`Generated checksums.`);
}

generateRegistry().catch(console.error);
