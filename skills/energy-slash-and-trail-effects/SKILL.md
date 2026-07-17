---
name: energy-slash-and-trail-effects
status: EXPERIMENTAL
version: 0.1.0
categories: ["creative-web"]
description: Implements motion trails, slashes, and speed lines. Activate for dynamic swipe or movement trails.
triggers:
  - "add energy-slash-and-trail-effects"
  - "implement energy slash and trail effects"
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

# energy-slash-and-trail-effects

## Purpose
Visualizes the path of fast-moving objects or dramatic cuts in the UI.

## When to activate
Use for high-speed transitions, cursor trails, or swipe gestures.

## When not to activate
When the experience is meant to be purely informational, constrained by strict performance budgets, or if user sensory overload is a concern.

## Required inputs
- Verification of performance constraints.
- Explicit approval for stylized/VFX overrides.

## Tool-selection rules
- Use `@gsap/react` for DOM animation timelines.
- Use PixiJS for heavy 2D particle/displacement work.
- Use Howler.js for Audio.

## Implementation workflow & Principles
### Implementation Types
- **SVG slash**: Low overhead. Good for simple UI cuts. Draw an angled path and animate `stroke-dashoffset`.
- **PixiJS slash**: High performance 2D. Use `PIXI.SimpleRope` or a custom Mesh to draw a trail behind a moving point.
- **Three.js ribbon slash**: 3D spatial trails using `InstancedMesh` or custom Ribbon geometries.
### Artistic Direction
- **White-hot centre & Coloured outer edge**: The core of the slash is always #FFF, with the brand color blooming outwards.
- **Animated UV & Dissolving tail**: The trail must shrink in thickness and fade in opacity over its length (alpha taper).
- **Sparks, Local distortion & Impact flare**: Spawn particles at the head of the slash.
- **Forward and reverse playback**: Trails must handle being rewound cleanly.

**React/Next.js Cleanup**: 
Clear all trail history arrays/buffers on component unmount.

## Performance requirements
- Deeply destroy and garbage collect all WebGL resources (PixiJS apps, Three.js geometries) on unmount.

## Accessibility requirements (Reduced Motion / Audio)
- Turn off continuous trails; default to static lines or no effect.
- Respect `window.matchMedia('(prefers-reduced-motion: reduce)')`.

## Verification (Acceptance-Test Checklist)
- [ ] White-hot center is maintained (additive blending).
- [ ] Trail correctly fades/dissolves without sudden hard cuts.
- [ ] No arrays growing infinitely in memory.

## Common mistakes
- **Bad**: Causing memory leaks by failing to destroy PixiJS apps in React `useEffect` cleanups.
- **Bad**: Trying to use 1000 DOM elements for particles instead of PixiJS `ParticleContainer`.
- **Bad**: Autoplaying audio without a user gesture.

---
*Last Reviewed: 2026-07-17*
