---
name: anime-title-impact-animation
status: EXPERIMENTAL
version: 0.1.0
categories: ["creative-web"]
description: Creates dramatic, large-scale title reveals with screen shake or impact frames. Activate for hero section typographic impacts.
triggers:
  - "add anime-title-impact-animation"
  - "implement anime title impact animation"
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

# anime-title-impact-animation

## Purpose
Delivers a heavy, high-impact typographic reveal typical of anime opening sequences.

## When to activate
Use for page load hero text or major chapter transitions.

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
### Technical & Artistic Directives
- **Slash & Masked Reveal**: Revealing text diagonally or from the center via CSS `clip-path`.
- **Impact Pop & Depth Arrival**: Text scaling down aggressively from 3D space hitting the screen plane.
- **Word Replacement & Manga-panel transition**: Rapidly flashing words or splitting the screen with sharp angled lines before the title hits.
- **Sharp text core & Controlled glow**: The font itself must have hard edges; glow is applied strictly behind it (via `text-shadow` or absolute positioned blurred clones).
- **Particle-supported exit**: When leaving the screen, the text shatters or dissolves into particles.
- **Reversible GSAP timelines**: Ensure the timeline can seamlessly reverse without state-jumping.

**React/Next.js Cleanup**: 
All GSAP timelines must be stored in variables and `.revert()` in the `useGSAP` cleanup.

## Performance requirements
- Deeply destroy and garbage collect all WebGL resources (PixiJS apps, Three.js geometries) on unmount.

## Accessibility requirements (Reduced Motion / Audio)
- Completely disable screen shake, flash frames, and aggressive scaling.
- Respect `window.matchMedia('(prefers-reduced-motion: reduce)')`.

## Verification (Acceptance-Test Checklist)
- [ ] Sharp text core remains legible above glow.
- [ ] Timeline can reverse cleanly.
- [ ] Screen shake does not trigger scrollbars.

## Common mistakes
- **Bad**: Causing memory leaks by failing to destroy PixiJS apps in React `useEffect` cleanups.
- **Bad**: Trying to use 1000 DOM elements for particles instead of PixiJS `ParticleContainer`.
- **Bad**: Autoplaying audio without a user gesture.

---
*Last Reviewed: 2026-07-17*
