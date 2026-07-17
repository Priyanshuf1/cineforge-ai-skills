---
name: pixijs-2d-vfx
status: EXPERIMENTAL
version: 0.1.0
categories: ["creative-web"]
description: Utilizes PixiJS for high-performance 2D WebGL effects like displacement maps or sprite particles. Activate for 2D WebGL VFX.
---

# pixijs-2d-vfx

## Purpose
Delivers highly performant 2D visual effects (water, heat distortion, fire embers) that CSS cannot handle.

## When to activate
Use when 2D particle counts exceed 100 or when per-pixel distortion (shaders/displacement) is required.

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
### Implementation Requirements
- **Transparent overlay canvas**: Place the PixiJS canvas over the DOM using `pointer-events: none` and `mix-blend-mode`.
- **Sprite batching & ParticleContainer**: Use `ParticleContainer` instead of standard `Container` for massive performance gains on embers/sparks.
- **Texture atlases**: Never load 50 individual PNGs; pack them into a JSON atlas.
- **Displacement filters**: Use `PIXI.DisplacementFilter` fed by a scrolling noise sprite for heat or water distortion.
- **Effect types**: Fire embers, Blue mist, Sparks, Smoke, Debris.
- **Interactivity**: Scroll-direction response (particles drift up on scroll down) and pointer disturbance (repelling particles).
- **Adaptive counts & Mobile fallback**: Halve the particle count if frame rate drops, or disable PixiJS entirely on low-tier mobile.
- **Resource destruction**: `app.destroy(true, { children: true, texture: true, baseTexture: true })` is mandatory on unmount.

**React/Next.js Cleanup**: 
Call the full, deep `.destroy()` on the Pixi Application inside the React `useEffect` cleanup.

## Performance requirements
- Deeply destroy and garbage collect all WebGL resources (PixiJS apps, Three.js geometries) on unmount.

## Accessibility requirements (Reduced Motion / Audio)
- Pause the ticker or destroy the app immediately.
- Respect `window.matchMedia('(prefers-reduced-motion: reduce)')`.

## Verification (Acceptance-Test Checklist)
- [ ] Pixi app deeply destroyed on unmount to prevent memory leaks.
- [ ] Displacement maps do not bleed outside intended bounds.
- [ ] Performance holds at 60fps; otherwise scales down.

## Common mistakes
- **Bad**: Causing memory leaks by failing to destroy PixiJS apps in React `useEffect` cleanups.
- **Bad**: Trying to use 1000 DOM elements for particles instead of PixiJS `ParticleContainer`.
- **Bad**: Autoplaying audio without a user gesture.

---
*Last Reviewed: 2026-07-17*
