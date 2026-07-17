---
name: react-three-fiber-cinematic-scenes
description: Builds declarative 3D scenes using R3F. Activate when integrating Three.js within a React application.
---

# react-three-fiber-cinematic-scenes

## Purpose
Manages WebGL scenes declaratively while enforcing strict React rendering performance.

## When to activate
Use for all 3D integration in React/Next.js projects unless overriding constraints apply.

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
- **React compatibility**: Must seamlessly integrate with the React component tree without blocking the main thread.
- **Canvas architecture**: The `<Canvas>` should generally cover the screen, with DOM elements layered on top.
- **useFrame**: CRITICAL: Never trigger React `setState` inside `useFrame`. Mutate refs directly (e.g., `meshRef.current.rotation.y += 0.01`).
- **Drei helpers**: Utilize `@react-three/drei` for cameras, environments, and text.
- **Suspense & GLB loading**: Wrap asynchronous loaders (useGLTF) in `<Suspense>` boundaries.
- **Animation clips**: Use `useAnimations` from Drei to manage GLB actions.
- **Pointer events**: Attach `onClick`, `onPointerOver` directly to meshes (R3F handles raycasting natively).
- **Resource cleanup**: R3F automatically disposes of components when unmounted, but manual disposal is needed for textures loaded outside the component lifecycle.

**React/Next.js Cleanup**: 
R3F handles most disposal automatically when the Canvas unmounts.

## Performance requirements
- Avoid triggering React state updates (`setState`) inside render loops (`useFrame`).
- Explicitly dispose of materials, textures, and geometries when unmounting vanilla components.

## Accessibility requirements (Reduced Motion)
- Conditionally skip rotations inside `useFrame` if `prefers-reduced-motion` is active.
- Listen for `window.matchMedia('(prefers-reduced-motion: reduce)')`.

## Verification (Acceptance-Test Checklist)
- [ ] No `setState` is used inside `useFrame`.
- [ ] Heavy models are wrapped in `<Suspense>`.
- [ ] Pixel ratio is capped at 2 for performance.

## Common mistakes
- **Bad**: Mutating React state at 60fps inside `useFrame`.
- **Bad**: Leaving a permanent full-screen bloom pass on, ruining contrast.
- **Bad**: Shipping the Theatre.js Studio bundle to production.
- **Bad**: Forgetting to use Draco or KTX2 compression on heavy GLB files.

---
*Last Reviewed: 2026-07-17*
