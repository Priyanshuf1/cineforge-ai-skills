---
name: threejs-foundations
status: EXPERIMENTAL
version: 0.1.0
categories: ["creative-web"]
description: Handles core Three.js setup including scene, renderer, and basic lighting. Activate when establishing a vanilla Three.js environment.
---

# threejs-foundations

## Purpose
Establishes a robust vanilla WebGL foundation focusing on strict memory management and responsive rendering.

## When to activate
Use when vanilla Three.js is required (no React) or for extremely low-level WebGL setups.

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
- **Scene, Camera, Renderer**: Standard setup, ensuring `antialias: true` and correct pixel ratio.
- **Geometry & Materials**: Share geometries and materials across meshes to save memory.
- **Lighting & Fog**: Use AmbientLight and DirectionalLight minimally. Fog should match the background clear color to hide far clipping.
- **Textures**: Ensure dimensions are powers of two. Use compressed textures (KTX2) where possible.
- **Raycasting**: Throttle raycaster checks (do not run every frame unless necessary).
- **Animation loop**: Use `renderer.setAnimationLoop()` instead of native `requestAnimationFrame` for WebXR compatibility.
- **Resize handling**: Update camera aspect ratio and renderer size on window resize.
- **Disposal**: CRITICAL: Always call `.dispose()` on geometries, materials, textures, and the renderer on unmount.

**React/Next.js Cleanup**: 
N/A for vanilla. If integrating vanilla in React, deep disposal is required in `useEffect` cleanup.

## Performance requirements
- Avoid triggering React state updates (`setState`) inside render loops (`useFrame`).
- Explicitly dispose of materials, textures, and geometries when unmounting vanilla components.

## Accessibility requirements (Reduced Motion)
- Pause the animation loop or limit camera auto-rotation.
- Listen for `window.matchMedia('(prefers-reduced-motion: reduce)')`.

## Verification (Acceptance-Test Checklist)
- [ ] Geometries and materials are disposed.
- [ ] Renderer pixel ratio is capped (e.g., `Math.min(window.devicePixelRatio, 2)`).
- [ ] Fog matches background color.

## Common mistakes
- **Bad**: Mutating React state at 60fps inside `useFrame`.
- **Bad**: Leaving a permanent full-screen bloom pass on, ruining contrast.
- **Bad**: Shipping the Theatre.js Studio bundle to production.
- **Bad**: Forgetting to use Draco or KTX2 compression on heavy GLB files.

---
*Last Reviewed: 2026-07-17*
