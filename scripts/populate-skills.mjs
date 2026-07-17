import fs from 'fs-extra';
import path from 'path';

const SKILLS_DIR = path.join(process.cwd(), 'skills');

async function run() {
  const skills = await fs.readdir(SKILLS_DIR);
  for (const skill of skills) {
    const skillPath = path.join(SKILLS_DIR, skill);
    if (!(await fs.stat(skillPath)).isDirectory()) continue;

    const skillMdPath = path.join(skillPath, 'SKILL.md');
    if (await fs.pathExists(skillMdPath)) {
      let content = await fs.readFile(skillMdPath, 'utf8');
      
      // Parse frontmatter
      const match = content.match(/^---\n([\s\S]*?)\n---/);
      if (match) {
        let frontmatter = match[1];
        
        // Add missing fields if not present
        if (!frontmatter.includes('triggers:')) frontmatter += '\ntriggers: []';
        if (!frontmatter.includes('related_skills:')) frontmatter += '\nrelated_skills: []';
        if (!frontmatter.includes('conflicting_skills:')) frontmatter += '\nconflicting_skills: []';
        if (!frontmatter.includes('primary_tools:')) frontmatter += '\nprimary_tools: []';
        if (!frontmatter.includes('minimum_inputs:')) frontmatter += '\nminimum_inputs: []';
        if (!frontmatter.includes('verification_required:')) frontmatter += '\nverification_required: true';
        if (!frontmatter.includes('last_reviewed:')) frontmatter += '\nlast_reviewed: "2026-07-17"';
        
        content = content.replace(/^---\n([\s\S]*?)\n---/, `---\n${frontmatter}\n---`);
        await fs.writeFile(skillMdPath, content);
      }
    }

    // Create required files
    const reqFiles = {
      'references.md': '# References\n\nNo references yet.',
      'tests.md': '# Tests\n\nNo tests yet.',
      'CHANGELOG.md': '# Changelog\n\n## [0.1.0] - 2026-07-17\n- Initial implementation.',
    };

    for (const [file, content] of Object.entries(reqFiles)) {
      const fp = path.join(skillPath, file);
      if (!(await fs.pathExists(fp))) {
        await fs.writeFile(fp, content);
      }
    }

    // Create examples dir and README
    const examplesDir = path.join(skillPath, 'examples');
    await fs.ensureDir(examplesDir);
    const exampleReadme = path.join(examplesDir, 'README.md');
    if (!(await fs.pathExists(exampleReadme))) {
      await fs.writeFile(exampleReadme, '> [!WARNING]\n> **EXPERIMENTAL**\n> No production compiling example exists for this skill yet. A stable implementation will be provided in a future release.\n');
    }
  }
  console.log('Done populating skills.');
}

run().catch(console.error);
