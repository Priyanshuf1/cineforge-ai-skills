---
name: cinematic-camera-direction
status: EXPERIMENTAL
version: 0.1.0
categories: ["creative-web"]
description: Controls 3D camera movement, framing, and transitions. Activate when animating camera paths or interpolating views.
---

# cinematic-camera-direction

## Purpose
Choreographs the user's perspective through the 3D scene to guide narrative focus.

## When to activate
Use when storytelling requires dynamic framing. Disable free OrbitControls during these sequences.

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
- **Camera paths**: Use CatmullRomCurve3 to define smooth fly-through paths.
- **Look-at targets**: Animate the camera's `.lookAt()` target independently of its position.
- **FOV changes**: Dolly-zoom effects can be achieved by animating position and FOV simultaneously.
- **Parallax & Motion restraint**: Subtle pointer-based camera sway should be restricted to a tiny bounding box.
- **Focus shifts & Camera shake**: Tie shake to impact events.
- **Scene composition**: Frame subjects with the rule of thirds.
- **Scroll-controlled camera progress**: Map the scroll position to the `t` value (0 to 1) of the camera curve.

**React/Next.js Cleanup**: 
Remove scroll listeners and pointer tracking on unmount.

## Performance requirements
- Avoid triggering React state updates (`setState`) inside render loops (`useFrame`).
- Explicitly dispose of materials, textures, and geometries when unmounting vanilla components.

## Accessibility requirements (Reduced Motion)
- Disable pointer parallax and camera shake. Limit scroll paths to linear transitions.
- Listen for `window.matchMedia('(prefers-reduced-motion: reduce)')`.

## Verification (Acceptance-Test Checklist)
- [ ] OrbitControls are disabled during cinematic paths.
- [ ] Camera lookAt updates in the render loop.
- [ ] Motion restraint is applied to pointer parallax.

## Common mistakes
- **Bad**: Mutating React state at 60fps inside `useFrame`.
- **Bad**: Leaving a permanent full-screen bloom pass on, ruining contrast.
- **Bad**: Shipping the Theatre.js Studio bundle to production.
- **Bad**: Forgetting to use Draco or KTX2 compression on heavy GLB files.

---
*Last Reviewed: 2026-07-17*
