---
name: rive-interactive-vector-graphics
status: EXPERIMENTAL
version: 0.1.0
categories: ["creative-web"]
description: Integrates Rive state machines for interactive vector animations. Activate for complex, state-driven 2D illustrations.
triggers:
  - "add rive-interactive-vector-graphics"
  - "implement rive interactive vector graphics"
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

# rive-interactive-vector-graphics

## Purpose
Embeds lightweight, highly interactive vector graphics driven by state machines.

## When to activate
Use for complex UI components (characters following cursors, reactive icons, interactive charts).

## Required inputs
- Verification of project constraints (performance budget, accessibility goals).

## Tool-selection rules
- Use Rive for complex state-driven vectors; use Lottie strictly for linear static motion.

## Implementation workflow & Principles
### Technical & Artistic Directives
- **State machines & Inputs**: Always utilize Rive's State Machine logic (Inputs/Triggers/Booleans) rather than manually playing timelines.
- **Events**: Listen to Rive events (e.g., animation finished) to trigger DOM updates.
- **React runtime**: Use `@rive-app/react-canvas` or `@rive-app/react-webgl`.
- **Canvas/WebGL choice**: Default to Canvas for simple UI icons. Use WebGL only if the Rive file is exceptionally complex or requires custom shaders.
- **Proper use cases**: Character rigs, interactive buttons, dynamic loaders, data visualization.
- **When not to use Rive**: Do not use Rive for simple static SVGs or basic CSS hover effects. It is overkill for standard UI.

**React/Next.js Cleanup**: 
The Rive React runtime handles garbage collection, but ensure you clean up any event listeners attached to the Rive instance.

## Performance requirements
- Rigorously enforce frame-time monitoring and pause off-screen WebGL instances.
- Lottie must be destroyed on unmount.

## Accessibility requirements (Reduced Motion)
- Trigger a Rive boolean input to enter a 'static' or 'reduced' state machine node.

## Verification (Acceptance-Test Checklist)
- [ ] State machines are used instead of manual timeline scrubbing.
- [ ] Canvas is preferred over WebGL unless strictly necessary.
- [ ] Correct React hook (`useRive`) is implemented.

## Common mistakes
- **Bad**: Trying to build an entire interactive website inside a single Lottie JSON file.
- **Bad**: Forgetting to implement a keyboard-accessible fallback for a 3D WebGL experience.
- **Bad**: Blindly upgrading Three.js without reading the migration guide.

---
*Last Reviewed: 2026-07-17*
