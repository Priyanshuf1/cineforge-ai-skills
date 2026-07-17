---
name: glsl-shader-effects
description: Authors custom vertex and fragment shaders for unique materials and distortions. Activate when standard 3D materials are insufficient.
---

# glsl-shader-effects

## Purpose
Creates highly customized, non-standard visual materials and distortions via WebGL shaders.

## When to activate
Use for organic effects (water, fire), dissolve transitions, or bespoke deformations.

## When not to activate
When unnecessary performance overhead would compromise the core user experience on standard devices.

## Required inputs
- Verification of 3D asset availability.
- Target device performance budget.

## Tool-selection rules
- Use Vanilla Three.js for standalone components; use React Three Fiber for React apps.
- Use Theatre.js strictly for complex keyframing, not basic motion.

## Implementation workflow & Principles
### Technical Requirements
- **Vertex & Fragment shaders**: Keep vertex shaders light. Do heavy lifting in fragment shaders only if needed.
- **Uniforms**: Update uniforms via `useFrame` by mutating `materialRef.current.uniforms.uTime.value`.
- **UV coordinates**: Ensure models have proper UV mapping for texture distortions.
- **Noise & Displacement**: Use Simplex or Perlin noise functions within the shader for localized distortion.
- **Effect Types**: Fire (scrolling noise + color ramps), Water (normal map distortion), Lightning (fractal noise branches), Dissolve (alpha thresholding based on noise).
- **Aspect-ratio correction**: Pass screen aspect ratio as a uniform to prevent stretching on circular or localized effects.
- **Mobile simplification**: Drop complex branching or loop logic in shaders for mobile GPUs.

**React/Next.js Cleanup**: 
Dispose of `ShaderMaterial` on unmount.

## Performance requirements
- Avoid triggering React state updates (`setState`) inside render loops (`useFrame`).
- Explicitly dispose of materials, textures, and geometries when unmounting vanilla components.

## Accessibility requirements (Reduced Motion)
- Slow down the `uTime` increment rate.
- Listen for `window.matchMedia('(prefers-reduced-motion: reduce)')`.

## Verification (Acceptance-Test Checklist)
- [ ] Shaders compile without warnings.
- [ ] Uniforms are updated via refs, not state.
- [ ] Effects do not stretch when the window resizes.

## Common mistakes
- **Bad**: Mutating React state at 60fps inside `useFrame`.
- **Bad**: Leaving a permanent full-screen bloom pass on, ruining contrast.
- **Bad**: Shipping the Theatre.js Studio bundle to production.
- **Bad**: Forgetting to use Draco or KTX2 compression on heavy GLB files.

---
*Last Reviewed: 2026-07-17*
