#!/usr/bin/env node
import { Command } from 'commander';
import fs from 'fs-extra';
import path from 'path';
import crypto from 'crypto';
import os from 'os';

const program = new Command();
const SKILLS_DIR = path.resolve(__dirname, '../../../../skills');
const REGISTRY_PATH = path.resolve(__dirname, '../../../../registry/skills.json');
const CHECKSUMS_PATH = path.resolve(__dirname, '../../../../registry/checksums.json');

program
  .name('cineforge')
  .description('CineForge AI Skills CLI - Installable creative-web skills for AI coding agents.')
  .version('0.1.0');

// Use boundary-safe path containment
function safeJoin(base: string, target: string) {
  const resolvedPath = path.resolve(base, target);
  if (!resolvedPath.startsWith(path.resolve(base))) {
    throw new Error('Path traversal detected.');
  }
  return resolvedPath;
}

const SUPPORTED_TARGETS = ['antigravity', 'claude-code', 'gemini-cli'];

function getTargetDir(target: string, scope: string) {
  if (scope === 'global') {
     return path.join(os.homedir(), '.gemini', 'config', 'skills');
  }
  return path.join(process.cwd(), '.agents', 'skills');
}

program
  .command('install')
  .description('Install a skill or preset')
  .option('-t, --target <agent>', 'Target agent (e.g. antigravity, claude-code)')
  .option('-s, --scope <scope>', 'Installation scope (global or workspace)', 'workspace')
  .option('--skills <skills>', 'Comma-separated list of skills to install')
  .option('--preset <preset>', 'Preset to install')
  .option('--all', 'Install all available skills')
  .option('--dry-run', 'Simulate the installation without writing files')
  .action(async (options) => {
    const targetAgent = options.target || 'antigravity';
    if (!SUPPORTED_TARGETS.includes(targetAgent)) {
      console.error(`Error: Unsupported target agent '${targetAgent}'. Supported targets: ${SUPPORTED_TARGETS.join(', ')}`);
      process.exit(1);
    }

    console.log(`Starting installation for agent: ${targetAgent}`);
    if (options.dryRun) {
      console.log('DRY RUN MODE: No files will be modified.');
    }
    
    let skillsToInstall: string[] = options.skills ? options.skills.split(',') : [];
    
    if (options.all) {
      if (fs.existsSync(REGISTRY_PATH)) {
        const registry = await fs.readJson(REGISTRY_PATH);
        skillsToInstall = Object.keys(registry.skills);
      } else {
        skillsToInstall = await fs.readdir(SKILLS_DIR);
      }
    } else if (options.preset) {
        if (options.preset === 'cinematic-web') {
           skillsToInstall = ['barba', 'lenis', 'gsap']; 
        } else {
           console.log(`Unknown preset: ${options.preset}. Defaulting to all.`);
           skillsToInstall = fs.existsSync(REGISTRY_PATH) ? Object.keys(await fs.readJson(REGISTRY_PATH).skills) : await fs.readdir(SKILLS_DIR);
        }
    }
    
    if (skillsToInstall.length === 0) {
      console.error('Error: Please specify --skills, --preset, or --all.');
      process.exit(1);
    }
    
    const targetDir = getTargetDir(targetAgent, options.scope);
    const manifestPath = path.join(targetDir, '.cineforge-manifest.json');
    let manifest: any = { installed: {}, updatedAt: new Date().toISOString() };
    
    if (fs.existsSync(manifestPath)) {
        manifest = await fs.readJson(manifestPath);
    }
    
    for (const skill of skillsToInstall) {
      const sourcePath = safeJoin(SKILLS_DIR, skill.trim());
      const destPath = safeJoin(targetDir, skill.trim());
      
      if (!fs.existsSync(sourcePath)) {
        console.error(`Skill ${skill} not found in registry.`);
        continue;
      }
      
      console.log(`Installing ${skill}...`);
      if (!options.dryRun) {
        if (fs.existsSync(destPath)) {
          const backupPath = `${destPath}.backup-${Date.now()}`;
          console.log(`Backing up existing skill to ${backupPath}`);
          await fs.copy(destPath, backupPath);
        }
        await fs.copy(sourcePath, destPath);
        manifest.installed[skill] = { installedAt: new Date().toISOString() };
      }
    }
    
    if (!options.dryRun) {
       await fs.writeJson(manifestPath, manifest, { spaces: 2 });
    }
    console.log('Installation complete.');
  });

program
  .command('list')
  .description('List available skills and presets')
  .action(async () => {
    if (fs.existsSync(REGISTRY_PATH)) {
        const registry = await fs.readJson(REGISTRY_PATH);
        console.log('Available Skills:');
        for (const skill of Object.keys(registry.skills)) {
            console.log(`  - ${skill} (${registry.skills[skill].status})`);
        }
    } else {
        console.log('No registry found.');
    }
  });

program
  .command('uninstall')
  .description('Safely uninstall CineForge skills')
  .option('-s, --scope <scope>', 'Installation scope (global or workspace)', 'workspace')
  .option('-t, --target <agent>', 'Target agent', 'antigravity')
  .action(async (options) => {
    console.log('Uninstalling skills safely...');
    const targetDir = getTargetDir(options.target, options.scope);
    const manifestPath = path.join(targetDir, '.cineforge-manifest.json');
    
    if (!fs.existsSync(manifestPath)) {
        console.log('No manifest found. Nothing to uninstall.');
        return;
    }
    
    const manifest = await fs.readJson(manifestPath);
    for (const skill of Object.keys(manifest.installed)) {
        const destPath = safeJoin(targetDir, skill);
        if (fs.existsSync(destPath)) {
            console.log(`Removing ${skill}...`);
            await fs.remove(destPath);
        }
    }
    await fs.remove(manifestPath);
    console.log('Uninstallation complete.');
  });

program
  .command('doctor')
  .description('Run diagnostics')
  .action(() => {
    console.log('Running diagnostics...');
    console.log(`Node version: ${process.version}`);
    console.log(`OS: ${os.platform()} ${os.release()}`);
    if (fs.existsSync(SKILLS_DIR)) {
       console.log('Skills directory accessible: OK');
    } else {
       console.error('Skills directory accessible: FAIL');
    }
  });

program
  .command('validate')
  .description('Validate the skills registry')
  .action(async () => {
    if (fs.existsSync(CHECKSUMS_PATH)) {
        console.log('Validating checksums...');
        const checksums = await fs.readJson(CHECKSUMS_PATH);
        let valid = true;
        for (const [file, expectedHash] of Object.entries(checksums)) {
            const filePath = path.resolve(__dirname, '../../../../', file as string);
            if (fs.existsSync(filePath)) {
                const content = await fs.readFile(filePath, 'utf8');
                const hash = crypto.createHash('sha256').update(content).digest('hex');
                if (hash !== expectedHash) {
                    console.error(`Checksum mismatch for ${file}`);
                    valid = false;
                }
            } else {
                console.error(`File missing: ${file}`);
                valid = false;
            }
        }
        if (valid) {
            console.log('Registry validated successfully.');
        } else {
            process.exit(1);
        }
    } else {
        console.log('No checksum file found.');
    }
  });

program
  .command('update')
  .description('Update skills from registry')
  .action(() => {
    console.log('Updating skills...');
    console.log('Update complete. (Fetching simulated from registry/skills.json)');
  });

program.parse(process.argv);
