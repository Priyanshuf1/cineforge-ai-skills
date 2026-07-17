---
name: postprocessing-and-colour-grading
description: Applies full-screen WebGL effects like bloom, depth of field, and color correction. Activate to enhance 3D scene visual quality.
---

# postprocessing-and-colour-grading

## Purpose
Applies the final visual polish to a 3D scene, matching standard film grading techniques.

## When to activate
Use for high-end cinematic scenes. **Avoid on low-end mobile devices**.

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
- **EffectComposer**: Use `@react-three/postprocessing` for optimized, batched passes.
- **Selective bloom**: Only bloom emissive materials, not the whole screen.
- **Tone mapping & Scene-specific grading**: Use ACESFilmicToneMapping globally.
- **Vignette, Noise, Chromatic aberration**: Apply subtly to mimic physical lenses.
- **Depth of field**: Use Bokeh passes selectively (expensive on performance).
- **Why permanent bloom is bad**: Oversaturates the image, reduces contrast, and strains the user's eyes. Use it strictly for specific emissive accents.

**React/Next.js Cleanup**: 
R3F postprocessing handles its own cleanup. Ensure the composer unmounts correctly.

## Performance requirements
- Avoid triggering React state updates (`setState`) inside render loops (`useFrame`).
- Explicitly dispose of materials, textures, and geometries when unmounting vanilla components.

## Accessibility requirements (Reduced Motion)
- N/A
- Listen for `window.matchMedia('(prefers-reduced-motion: reduce)')`.

## Verification (Acceptance-Test Checklist)
- [ ] Permanent full-screen bloom is avoided.
- [ ] Effects are disabled on mobile hardware if FPS drops.
- [ ] Tone mapping is set correctly on the renderer.

## Common mistakes
- **Bad**: Mutating React state at 60fps inside `useFrame`.
- **Bad**: Leaving a permanent full-screen bloom pass on, ruining contrast.
- **Bad**: Shipping the Theatre.js Studio bundle to production.
- **Bad**: Forgetting to use Draco or KTX2 compression on heavy GLB files.

---
*Last Reviewed: 2026-07-17*
