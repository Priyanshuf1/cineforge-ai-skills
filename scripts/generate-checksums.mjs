import fs from 'fs-extra';
import path from 'path';
import crypto from 'crypto';

const SKILLS_DIR = path.join(process.cwd(), 'skills');
const REGISTRY_DIR = path.join(process.cwd(), 'registry');
const CHECKSUMS_PATH = path.join(REGISTRY_DIR, 'checksums.json');

function hashDir(dirPath) {
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

async function run() {
  const skills = await fs.readdir(SKILLS_DIR);
  const checksums = {};
  
  for (const skill of skills) {
    const skillPath = path.join(SKILLS_DIR, skill);
    if (!(await fs.stat(skillPath)).isDirectory()) continue;
    
    checksums[skill] = hashDir(skillPath);
  }
  
  await fs.ensureDir(REGISTRY_DIR);
  await fs.writeJson(CHECKSUMS_PATH, checksums, { spaces: 2 });
  console.log('Done generating checksums.json.');
}

run().catch(console.error);
