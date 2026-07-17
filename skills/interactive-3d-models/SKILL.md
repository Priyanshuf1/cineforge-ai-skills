---
name: interactive-3d-models
status: EXPERIMENTAL
version: 0.1.0
categories: ["creative-web"]
description: Handles loading, playing animations, and interacting with 3D models (glTF). Activate when incorporating external 3D assets.
triggers: []
related_skills: []
conflicting_skills: []
primary_tools: []
minimum_inputs: []
verification_required: true
last_reviewed: "2026-07-17"
---

# interactive-3d-models

## Purpose
Brings static GLTF models to life through animations and user interactions.

## When to activate
Use whenever `.glb` or `.gltf` files are imported.

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
- **GLB loading**: Use `useGLTF` from Drei. Preload assets outside the component.
- **Touch and pointer interaction**: Use `onPointerOver`, `onPointerOut`, and `onClick`.
- **Animation clips**: Extract clips with `useAnimations`. Crossfade between clips using `.crossFadeFrom()`.
- **Hover state & Model selection**: Change material emission or scale slightly on hover.
- **Hit testing**: Use BVH (Bounding Volume Hierarchy) for complex models to optimize raycasting.
- **Fallbacks**: Always show a loading spinner or skeleton (via `<Suspense>`).

**React/Next.js Cleanup**: 
Animations must be stopped and `useGLTF.clear()` can be used if memory must be urgently freed.

## Performance requirements
- Avoid triggering React state updates (`setState`) inside render loops (`useFrame`).
- Explicitly dispose of materials, textures, and geometries when unmounting vanilla components.

## Accessibility requirements (Reduced Motion)
- Disable hover micro-animations (like model bouncing).
- Listen for `window.matchMedia('(prefers-reduced-motion: reduce)')`.

## Verification (Acceptance-Test Checklist)
- [ ] Models are wrapped in Suspense.
- [ ] Animation crossfades are smooth.
- [ ] Raycasting uses simplified hitboxes or BVH.

## Common mistakes
- **Bad**: Mutating React state at 60fps inside `useFrame`.
- **Bad**: Leaving a permanent full-screen bloom pass on, ruining contrast.
- **Bad**: Shipping the Theatre.js Studio bundle to production.
- **Bad**: Forgetting to use Draco or KTX2 compression on heavy GLB files.

---
*Last Reviewed: 2026-07-17*
