---
name: anime-particle-systems
status: EXPERIMENTAL
version: 0.1.0
categories: ["creative-web"]
description: Creates stylized particle emissions like sparks, cherry blossoms, or energy dust. Activate when generating 2D or 3D particle bursts.
triggers:
  - "add anime-particle-systems"
  - "implement anime particle systems"
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

# anime-particle-systems

## Purpose
Renders stylized environmental FX synonymous with anime cinematography.

## When to activate
Use to enhance ambient mood or emphasize physical interactions (e.g., button clicks).

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
### Shared PixiJS/Three.js Principles
- Applies the exact same technical constraints as `pixijs-2d-vfx` (Texture atlases, ParticleContainer, Adaptive counts, Resource destruction).
- **Art Direction**: 
  - Fire embers: Glowing orange/yellow, rising with erratic sine-wave horizontal motion.
  - Blue mist: Large, soft sprites, very low opacity, additive blending.
  - Sparks: Fast initial velocity, rapid deceleration, high gravity, drawn as stretched lines matching velocity vector.
  - Smoke: Scaling up while fading out.
  - Debris: Hard-edged geometry, rotating on all axes.

**React/Next.js Cleanup**: 
Destroy textures, materials, and geometries on unmount to prevent WebGL context loss.

## Performance requirements
- Deeply destroy and garbage collect all WebGL resources (PixiJS apps, Three.js geometries) on unmount.

## Accessibility requirements (Reduced Motion / Audio)
- Fade out all ambient particles. Action-triggered particles (clicks) can remain but should have shorter lifespans and less erratic movement.
- Respect `window.matchMedia('(prefers-reduced-motion: reduce)')`.

## Verification (Acceptance-Test Checklist)
- [ ] Resource destruction verified (no WebGL memory leak).
- [ ] Additive blending used for sparks and fire.
- [ ] Adaptive particle counts based on device.

## Common mistakes
- **Bad**: Causing memory leaks by failing to destroy PixiJS apps in React `useEffect` cleanups.
- **Bad**: Trying to use 1000 DOM elements for particles instead of PixiJS `ParticleContainer`.
- **Bad**: Autoplaying audio without a user gesture.

---
*Last Reviewed: 2026-07-17*
