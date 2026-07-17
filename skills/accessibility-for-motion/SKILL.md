---
name: accessibility-for-motion
status: EXPERIMENTAL
version: 0.1.0
categories: ["creative-web"]
description: Ensures animations respect user preferences (prefers-reduced-motion) and are keyboard accessible. Activate on every interactive project.
triggers:
  - "add accessibility-for-motion"
  - "implement accessibility for motion"
related_skills: []
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

# accessibility-for-motion

## Purpose
Protects users from motion sickness, vestibular disorders, and sensory overload.

## When to activate
Mandatory on EVERY project. This is not optional.

## Required inputs
- Verification of project constraints (performance budget, accessibility goals).

## Tool-selection rules
- Use Rive for complex state-driven vectors; use Lottie strictly for linear static motion.

## Implementation workflow & Principles
### Accessibility Requirements
- **prefers-reduced-motion**: Detect via CSS media query or JS `window.matchMedia`.
- **Static alternatives & Preserving content**: If an animation is disabled, the content MUST remain fully visible and accessible. Never leave opacity at 0.
- **Keyboard controls**: All interactive 3D/canvas elements must have visually hidden, keyboard-focusable fallback buttons (e.g., 'Skip Animation').
- **Motion & Sound toggle**: Provide a clear UI button to disable all motion/audio manually.
- **Focus states & Contrast**: Ensure focus outlines remain visible over moving canvases. Contrast must meet WCAG AA over dynamic backgrounds.
- **Avoiding dangerous flashing**: No more than 3 flashes per second. Strict adherence to epilepsy guidelines.

**React/Next.js Cleanup**: 
Clean up `matchMedia` event listeners on unmount.

## Performance requirements
- Rigorously enforce frame-time monitoring and pause off-screen WebGL instances.
- Lottie must be destroyed on unmount.

## Accessibility requirements (Reduced Motion)
- Core function of this skill. Disable parallax, continuous rotation, and fast zooms.

## Verification (Acceptance-Test Checklist)
- [ ] Site passes WCAG flash thresholds.
- [ ] All content is visible if JS/animations are disabled.
- [ ] `prefers-reduced-motion` is globally respected.

## Common mistakes
- **Bad**: Trying to build an entire interactive website inside a single Lottie JSON file.
- **Bad**: Forgetting to implement a keyboard-accessible fallback for a 3D WebGL experience.
- **Bad**: Blindly upgrading Three.js without reading the migration guide.

---
*Last Reviewed: 2026-07-17*
