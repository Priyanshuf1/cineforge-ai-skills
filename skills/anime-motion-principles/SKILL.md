---
name: anime-motion-principles
status: EXPERIMENTAL
version: 0.1.0
categories: ["creative-web"]
description: Applies traditional anime timing, spacing, and anticipation to web elements. Activate when creating energetic, stylized UI motion.
---

# anime-motion-principles

## Purpose
Infuses web animations with the distinctive, high-energy snap of anime motion by manipulating timing and spacing.

## When to activate
Use for micro-interactions, hero reveals, or major state changes requiring a punchy, stylized feel. Do not use for formal, slow-paced corporate UI.

## When not to activate
Do not use for formal, slow-paced corporate UI.

## Required inputs
- Verification of performance constraints.
- Explicit approval for stylized/VFX overrides.

## Tool-selection rules
- Use `@gsap/react` for DOM animation timelines.
- Use PixiJS for heavy 2D particle/displacement work.
- Use Howler.js for Audio.

## Implementation workflow & Principles
### Core Principles
- **Anticipation**: A brief movement in the opposite direction before the main action.
- **Timing & Spacing**: Rapid acceleration (few frames) followed by a slow ease-out (many frames) to simulate snap.
- **Holds & Restraint**: Pausing action completely to build tension before the next snap. Less is more; avoid constant floating.
- **Overshoot & Follow-through**: Elements bypass their target slightly before snapping back, while trailing elements catch up.
- **Smear-frame concepts**: Using extreme scale-stretch or CSS motion blur (via SVG filters) for 1-2 frames during fast movement.
- **Impact frames & Recovery**: Using flash frames for hits, followed by a slight visual recoil (recovery).
- **Visual hierarchy**: Only apply intense anime motion to the primary focal point.

**React/Next.js Cleanup**: 
All GSAP tweens (CustomEase) must be cleaned up in `useGSAP`.

## Performance requirements
- Deeply destroy and garbage collect all WebGL resources (PixiJS apps, Three.js geometries) on unmount.

## Accessibility requirements (Reduced Motion / Audio)
- Disable overshoot, smearing, and impact frames. Use a standard ease-in-out fade.
- Respect `window.matchMedia('(prefers-reduced-motion: reduce)')`.

## Verification (Acceptance-Test Checklist)
- [ ] CustomEase curves are aggressive (snappy).
- [ ] Anticipation and overshoot are clearly visible.
- [ ] Animations cleanly respect `prefers-reduced-motion`.

## Common mistakes
- **Bad**: Causing memory leaks by failing to destroy PixiJS apps in React `useEffect` cleanups.
- **Bad**: Trying to use 1000 DOM elements for particles instead of PixiJS `ParticleContainer`.
- **Bad**: Autoplaying audio without a user gesture.

---
*Last Reviewed: 2026-07-17*
