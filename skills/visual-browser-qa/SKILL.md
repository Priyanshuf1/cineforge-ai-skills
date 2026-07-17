---
name: visual-browser-qa
status: EXPERIMENTAL
version: 0.1.0
categories: ["creative-web"]
description: Checklist and procedures for cross-browser visual verification of WebGL and advanced CSS. Activate before finalizing a feature.
triggers: []
related_skills: []
conflicting_skills: []
primary_tools: []
minimum_inputs: []
verification_required: true
last_reviewed: "2026-07-17"
---

# visual-browser-qa

## Purpose
Systematizes the QA process to catch visual glitches inherent to complex web animation.

## When to activate
Mandatory before shipping any milestone.

## Required inputs
- Verification of project constraints (performance budget, accessibility goals).

## Tool-selection rules
- Use Rive for complex state-driven vectors; use Lottie strictly for linear static motion.

## Implementation workflow & Principles
### Verification Procedures
- **Desktop & Mobile screenshots**: Verify layout stability across viewports.
- **Video recording**: Record complex animations to scrub and check for dropped frames or weird overlaps.
- **Console checks**: Zero warnings/errors.
- **Overflow detection**: Ensure no horizontal scrollbars appear during GSAP off-screen animations.
- **Layering checks**: Z-index verification (ensure WebGL doesn't overlap dropdown menus).
- **Contrast checks**: Ensure text is readable over all phases of a dynamic background.
- **Fast and reverse scroll tests**: Scroll up and down violently to break GSAP ScrollTrigger timelines. Fix any state bugs.
- **Interaction testing**: Click rapidly during transitions.
- **Performance recording**: Run Chrome DevTools Performance tab to check for long tasks.
- **Visual comparison**: Compare against original Figma/design references.

**React/Next.js Cleanup**: 
N/A (Process skill).

## Performance requirements
- Rigorously enforce frame-time monitoring and pause off-screen WebGL instances.
- Lottie must be destroyed on unmount.

## Accessibility requirements (Reduced Motion)
- Test the site specifically with the OS-level reduced motion flag enabled.

## Verification (Acceptance-Test Checklist)
- [ ] Violent scrolling does not break layout.
- [ ] No horizontal overflow.
- [ ] WebGL layers sit correctly below UI.

## Common mistakes
- **Bad**: Trying to build an entire interactive website inside a single Lottie JSON file.
- **Bad**: Forgetting to implement a keyboard-accessible fallback for a 3D WebGL experience.
- **Bad**: Blindly upgrading Three.js without reading the migration guide.

---
*Last Reviewed: 2026-07-17*
