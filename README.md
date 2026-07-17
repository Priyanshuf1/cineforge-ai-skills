# CineForge AI Skills

![CineForge Banner](./assets/readme/hero.svg)

> **Installable creative-web skills for AI coding agents — GSAP, Three.js, WebGL, PixiJS, cinematic typography, scroll experiences, shaders and VFX.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![CI](https://github.com/apriy/cineforge-ai-skills/actions/workflows/ci.yml/badge.svg)](https://github.com/apriy/cineforge-ai-skills/actions)

CineForge provides a production-ready skill library that teaches AI coding agents to build cinematic, animated, anime-inspired, and real-time 3D web experiences. 

## Features
- **33 Canonical Skills**: Covering everything from typography to GLSL shaders.
- **Agent Adapters**: Officially supported bindings for Antigravity, Claude Code, and Gemini CLI.
- **Cross-Platform CLI**: Safe installation with backups, dry-runs, and validation.

## Installation

### Method 1: Clone and Run (Recommended)
```bash
git clone https://github.com/apriy/cineforge-ai-skills.git
cd cineforge-ai-skills
npm ci
npm run setup
```

### Method 2: Target Commands
```bash
npm run install:antigravity
```

### Method 3: CLI
```bash
cineforge install --target antigravity --preset cinematic-web
```

## Available Presets
- `cinematic-web`: Core typography, scroll, and compositing skills.
- `anime-vfx`: Impact frames, particle systems, and slashes.
- `threejs`: R3F, shaders, cel-shading, and 3D modeling.
- `scroll-experience`: Single-window video scrub storytelling.

## Documentation
Full documentation is available at [https://apriy.github.io/cineforge-ai-skills](https://apriy.github.io/cineforge-ai-skills).

## Contributing
Please see our [CONTRIBUTING.md](./CONTRIBUTING.md) for details on how to add new skills or agent adapters.

## Disclaimer
This is an unofficial community project and is not affiliated with Google, Anthropic, OpenAI, GSAP, or Three.js.
