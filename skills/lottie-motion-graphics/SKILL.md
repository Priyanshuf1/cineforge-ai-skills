---
name: lottie-motion-graphics
status: EXPERIMENTAL
version: 0.1.0
categories: ["creative-web"]
description: Implements After Effects exported animations using Lottie. Activate for pre-rendered vector animations without complex state.
triggers:
  - "add lottie-motion-graphics"
  - "implement lottie motion graphics"
related_skills:
  - "visual-browser-qa"
conflicting_skills: []
primary_tools:
  - "write_to_file"
  - "replace_file_content"
  - "run_command"
minimum_inputs:
  - "User specifies the desired visual outcome"
  - "User confirms target project framework"
verification_required: true
last_reviewed: "2026-07-17"
---

# lottie-motion-graphics

## Purpose
Renders complex After Effects animations directly in the browser.

## When to activate
Use strictly for static, linear animations that do not require state-machine reactivity.

## Required inputs
- Verification of project constraints (performance budget, accessibility goals).

## Tool-selection rules
- Use Rive for complex state-driven vectors; use Lottie strictly for linear static motion.

## Implementation workflow & Principles
### Technical & Artistic Directives
- **Small decorative motion, Loaders, Icons**: Ideal for non-interactive visual flair.
- **Lightweight symbols**: Optimize AE files before export. Remove unused layers.
- **Playback control**: Standard play/pause/reverse, tied to scroll or hover.
- **Why Lottie should not run the complete immersive environment**: Lottie parses heavy JSON and manipulates massive DOM trees (or canvas paths) on the CPU. It is **not** a game engine. Never build a full website inside a Lottie file.

**React/Next.js Cleanup**: 
Call `.destroy()` on the Lottie instance when the component unmounts to free CPU resources.

## Performance requirements
- Rigorously enforce frame-time monitoring and pause off-screen WebGL instances.
- Lottie must be destroyed on unmount.

## Accessibility requirements (Reduced Motion)
- Pause the Lottie instance on the first frame or a specific safe frame.

## Verification (Acceptance-Test Checklist)
- [ ] JSON filesize is under 1MB (ideally <300kb).
- [ ] Lottie is used for decoration, not interactive architecture.
- [ ] Instance is destroyed on unmount.

## Common mistakes
- **Bad**: Trying to build an entire interactive website inside a single Lottie JSON file.
- **Bad**: Forgetting to implement a keyboard-accessible fallback for a 3D WebGL experience.
- **Bad**: Blindly upgrading Three.js without reading the migration guide.

---
*Last Reviewed: 2026-07-17*
