import fs from 'fs-extra';
import path from 'path';

const SKILLS_DIR = path.join(process.cwd(), 'skills');

const TOOLS_MAP = {
  'gsap': ['write_to_file', 'npm', 'run_command'],
  'threejs': ['write_to_file', 'npm', 'run_command'],
  'webgl': ['write_to_file', 'run_command'],
  'vfx': ['write_to_file', 'npm'],
  'default': ['write_to_file', 'replace_file_content', 'run_command']
};

const INPUTS_MAP = {
  'gsap': ['User provides element class or ID to animate', 'User states the desired scroll or timeline effect'],
  'threejs': ['User provides 3D asset paths or procedural requirements', 'User provides lighting and camera requirements'],
  'default': ['User specifies the desired visual outcome', 'User confirms target project framework']
};

async function run() {
  const skills = await fs.readdir(SKILLS_DIR);
  
  for (const skill of skills) {
    const skillPath = path.join(SKILLS_DIR, skill);
    if (!(await fs.stat(skillPath)).isDirectory()) continue;

    const skillMdPath = path.join(skillPath, 'SKILL.md');
    if (await fs.pathExists(skillMdPath)) {
      let content = await fs.readFile(skillMdPath, 'utf8');
      const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
      
      if (match) {
        let frontmatter = match[1];
        
        // Parse current frontmatter line by line to rewrite arrays
        const lines = frontmatter.split(/\r?\n/);
        const newLines = [];
        
        let inArray = false;
        for (const line of lines) {
          if (line.match(/^[\w_]+:\s*\[\s*\]$/)) {
            // It's an empty array on a single line
            const key = line.split(':')[0].trim();
            if (key === 'triggers') {
              newLines.push(`triggers:\n  - "add ${skill}"\n  - "implement ${skill.replace(/-/g, ' ')}"`);
            } else if (key === 'categories') {
              const cat = skill.includes('gsap') ? 'animation' : (skill.includes('three') ? '3d' : 'vfx');
              newLines.push(`categories:\n  - "${cat}"`);
            } else if (key === 'primary_tools') {
              const tools = skill.includes('gsap') ? TOOLS_MAP['gsap'] : (skill.includes('three') ? TOOLS_MAP['threejs'] : TOOLS_MAP['default']);
              newLines.push(`primary_tools:\n${tools.map(t => `  - "${t}"`).join('\n')}`);
            } else if (key === 'minimum_inputs') {
              const inputs = skill.includes('gsap') ? INPUTS_MAP['gsap'] : (skill.includes('three') ? INPUTS_MAP['threejs'] : INPUTS_MAP['default']);
              newLines.push(`minimum_inputs:\n${inputs.map(i => `  - "${i}"`).join('\n')}`);
            } else {
              newLines.push(line);
            }
          } else {
            newLines.push(line);
          }
        }
        
        frontmatter = newLines.join('\n');
        content = content.replace(/^---\r?\n([\s\S]*?)\r?\n---/, `---\n${frontmatter}\n---`);
        await fs.writeFile(skillMdPath, content);
      }
    }
  }
  console.log('Injected realistic metadata.');
}

run().catch(console.error);
