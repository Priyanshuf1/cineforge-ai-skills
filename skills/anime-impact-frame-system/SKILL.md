---
name: anime-impact-frame-system
status: EXPERIMENTAL
version: 0.1.0
categories: ["creative-web"]
description: Implements high-contrast, brief flash frames to emphasize powerful animations. Activate to add 'punch' to significant interactions.
triggers:
  - "add anime-impact-frame-system"
  - "implement anime impact frame system"
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

# anime-impact-frame-system

## Purpose
Injects a 1-to-3 frame high-contrast flash (often black/white or inverted) to sell the power of an impact.

## When to activate
Use strictly for the absolute climax of an animation (e.g., final title hit, critical button press).

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
### Sequence Breakdown
1. **Preparation**: Normal colors, anticipation motion.
2. **Fast acceleration**: Element moves too fast to see (1 frame).
3. **Bright impact frame / Optional inverse frame**: 1 frame of pure white or inverted colors.
4. **Speed lines & Local camera shake**: Radial lines drawn behind, and container shakes.
5. **Debris**: Particles burst outward.
6. **Brief hold**: Time slows or stops for a fraction of a second.
7. **Recovery**: Colors return, easing settles.
8. **Flash-safety restrictions**: Flash MUST not violate WCAG epilepsy guidelines (no more than 3 flashes per second).

**React/Next.js Cleanup**: 
Remove all overlay DOM nodes immediately after the flash to avoid blocking pointer events.

## Performance requirements
- Deeply destroy and garbage collect all WebGL resources (PixiJS apps, Three.js geometries) on unmount.

## Accessibility requirements (Reduced Motion / Audio)
- Impact frames MUST be disabled if `prefers-reduced-motion` is active. This is a hard accessibility rule.
- Respect `window.matchMedia('(prefers-reduced-motion: reduce)')`.

## Verification (Acceptance-Test Checklist)
- [ ] Flash-safety restrictions strictly followed.
- [ ] Inverse frames don't stay visible if the thread hangs.
- [ ] Overlays are `pointer-events: none`.

## Common mistakes
- **Bad**: Causing memory leaks by failing to destroy PixiJS apps in React `useEffect` cleanups.
- **Bad**: Trying to use 1000 DOM elements for particles instead of PixiJS `ParticleContainer`.
- **Bad**: Autoplaying audio without a user gesture.

---
*Last Reviewed: 2026-07-17*
