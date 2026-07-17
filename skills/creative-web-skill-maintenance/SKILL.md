---
name: creative-web-skill-maintenance
status: EXPERIMENTAL
version: 0.1.0
categories: ["creative-web"]
description: Guidelines for updating and expanding this very skill library. Activate when authoring new skills.
triggers:
  - "add creative-web-skill-maintenance"
  - "implement creative web skill maintenance"
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

# creative-web-skill-maintenance

## Purpose
Maintains the structural integrity and relevance of the Antigravity Creative Web skill library.

## When to activate
Use whenever asked to create a new skill or modify an existing one in this workspace.

## Required inputs
- Verification of project constraints (performance budget, accessibility goals).

## Tool-selection rules
- Use Rive for complex state-driven vectors; use Lottie strictly for linear static motion.

## Implementation workflow & Principles
### Maintenance Rules
- **Check official docs before changing packages**: If an API breaks, read the docs before blindly changing code.
- **Record reviewed date**: Update the `*Last Reviewed: YYYY-MM-DD*` timestamp at the bottom of the SKILL.md.
- **Detect deprecated APIs**: Proactively update patterns (e.g., moving from old GSAP syntax to `useGSAP`).
- **Update examples & Re-run labs**: Verify that `pattern.tsx` compiles and runs in current React versions.
- **Preserve known-good versions**: Do not rewrite a perfectly working skill just because a shiny new alpha library released.
- **Maintain changelog**: Document major paradigm shifts.
- **Never blindly upgrade dependencies**: A major Three.js version bump can break an entire project. Upgrade carefully.

**React/Next.js Cleanup**: 
Ensure examples always showcase proper cleanup.

## Performance requirements
- Rigorously enforce frame-time monitoring and pause off-screen WebGL instances.
- Lottie must be destroyed on unmount.

## Accessibility requirements (Reduced Motion)
- Ensure all new skills include a reducedMotion clause.

## Verification (Acceptance-Test Checklist)
- [ ] New skills contain YAML frontmatter.
- [ ] Official documentation was consulted.
- [ ] Acceptance-test checklist is present.

## Common mistakes
- **Bad**: Trying to build an entire interactive website inside a single Lottie JSON file.
- **Bad**: Forgetting to implement a keyboard-accessible fallback for a 3D WebGL experience.
- **Bad**: Blindly upgrading Three.js without reading the migration guide.

---
*Last Reviewed: 2026-07-17*
