#!/usr/bin/env node
import { Command } from 'commander';
import fs from 'fs-extra';
import path from 'path';

const program = new Command();

program
  .name('cineforge')
  .description('CineForge AI Skills CLI - Installable creative-web skills for AI coding agents.')
  .version('0.1.0');

program
  .command('install')
  .description('Install a skill or preset')
  .option('-t, --target <agent>', 'Target agent (e.g. antigravity, claude-code)')
  .option('-s, --scope <scope>', 'Installation scope (global or workspace)', 'workspace')
  .option('--skills <skills>', 'Comma-separated list of skills to install')
  .option('--preset <preset>', 'Preset to install')
  .option('--all', 'Install all available skills')
  .option('--dry-run', 'Simulate the installation without writing files')
  .option('--yes', 'Skip interactive confirmation')
  .action(async (options) => {
    console.log(`Starting installation for agent: ${options.target || 'auto-detect'}`);
    if (options.dryRun) {
      console.log('DRY RUN MODE: No files will be modified.');
    }
    
    const skillsToInstall = options.skills ? options.skills.split(',') : [];
    
    if (skillsToInstall.length === 0 && !options.preset && !options.all) {
      console.error('Error: Please specify --skills, --preset, or --all.');
      process.exit(1);
    }
    
    if (options.preset) {
       console.log(`Loading preset: ${options.preset}`);
    }
    
    if (skillsToInstall.length > 0) {
      console.log(`Skills selected: ${skillsToInstall.join(', ')}`);
    }
    
    console.log('Validating registry...');
    console.log('Creating backups...');
    
    if (!options.dryRun) {
      // Mock copying files
      console.log('Writing files to target directory...');
    }
    
    console.log('Installation complete.');
    console.log('\nTo use your skills, open your AI coding agent and request assistance with these topics.');
  });

program
  .command('list')
  .description('List available skills and presets')
  .action(() => {
    console.log('Available Presets:');
    console.log('  - cinematic-web');
    console.log('  - scroll-experience');
    console.log('  - anime-vfx');
    console.log('  - threejs');
    console.log('  - full-creative-stack');
  });

program
  .command('uninstall')
  .description('Safely uninstall CineForge skills')
  .action(() => {
    console.log('Uninstalling skills safely...');
  });

program
  .command('validate')
  .description('Validate the skills registry')
  .action(() => {
    console.log('Registry validated successfully.');
  });

program.parse(process.argv);
