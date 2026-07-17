---
name: theatrejs-camera-authoring
status: EXPERIMENTAL
version: 0.1.0
categories: ["creative-web"]
description: Uses Theatre.js for visual timeline keyframing of 3D objects and cameras. Activate when visual keyframing is required for cinematic sequences.
triggers:
  - "add theatrejs-camera-authoring"
  - "implement theatrejs camera authoring"
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

# theatrejs-camera-authoring

## Purpose
Provides a visual GUI to scrub and keyframe complex WebGL camera and object animations.

## When to activate
Use for long, complex cinematic sequences where code-driven GSAP math becomes impossible to visualize.

## When not to activate
When unnecessary performance overhead would compromise the core user experience on standard devices.

## Required inputs
- Verification of 3D asset availability.
- Target device performance budget.

## Tool-selection rules
- Use Vanilla Three.js for standalone components; use React Three Fiber for React apps.
- Use Theatre.js strictly for complex keyframing, not basic motion.

## Implementation workflow & Principles
### Technical & Artistic Directives
- **Compatibility verification**: Ensure `@theatre/core` and `@theatre/r3f` match React versions.
- **Studio development usage**: Import and initialize `studio.initialize()` strictly in development environments.
- **Camera and light keyframes**: Keyframe the camera's `position` and `target` (LookAt).
- **Exported production state**: Export the JSON state from the Theatre.js studio and bundle it.
- **Never ship Studio unintentionally**: Wrap studio initialization in `if (process.env.NODE_ENV === 'development')`.

**React/Next.js Cleanup**: 
Projects must be cleanly unmounted if navigating away from the cinematic scene.

## Performance requirements
- Avoid triggering React state updates (`setState`) inside render loops (`useFrame`).
- Explicitly dispose of materials, textures, and geometries when unmounting vanilla components.

## Accessibility requirements (Reduced Motion)
- Pause Theatre.js playback or skip directly to the final state.
- Listen for `window.matchMedia('(prefers-reduced-motion: reduce)')`.

## Verification (Acceptance-Test Checklist)
- [ ] Theatre.js Studio is completely excluded from the production build bundle.
- [ ] Exported JSON state loads successfully in production.
- [ ] Sequence handles window resizing gracefully.

## Common mistakes
- **Bad**: Mutating React state at 60fps inside `useFrame`.
- **Bad**: Leaving a permanent full-screen bloom pass on, ruining contrast.
- **Bad**: Shipping the Theatre.js Studio bundle to production.
- **Bad**: Forgetting to use Draco or KTX2 compression on heavy GLB files.

---
*Last Reviewed: 2026-07-17*
