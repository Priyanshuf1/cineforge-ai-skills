---
name: gltf-asset-optimization
status: EXPERIMENTAL
version: 0.1.0
categories: ["creative-web"]
description: Compresses and optimizes 3D assets for fast web delivery. Activate before deploying heavy 3D models.
triggers: []
related_skills: []
conflicting_skills: []
primary_tools: []
minimum_inputs: []
verification_required: true
last_reviewed: "2026-07-17"
---

# gltf-asset-optimization

## Purpose
Ensures 3D models load instantly and consume minimal VRAM.

## When to activate
Mandatory for all production 3D assets.

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
- **Meshopt & Draco**: Use Draco compression for geometry. (Draco is slower to decode but much smaller over the network).
- **KTX2 & Texture resizing**: Convert all textures to KTX2 (Basis Universal) so they remain compressed in GPU memory. Never use 4K textures; resize to 1K or 2K max.
- **WebP and AVIF**: Use for UI or 2D fallbacks.
- **Geometry simplification**: Decimate high-poly models in Blender before export.
- **Removing unused data**: Strip cameras, lights, and empty nodes from the GLB using `gltf-transform`.
- **Desktop/mobile variants**: Consider loading a lower-poly `_mobile.glb` on phones.
- **File-size and GPU-memory measurement**: Use `gltf-report` or Spector.js to verify memory usage.

**React/Next.js Cleanup**: 
N/A (Build step optimization).

## Performance requirements
- Avoid triggering React state updates (`setState`) inside render loops (`useFrame`).
- Explicitly dispose of materials, textures, and geometries when unmounting vanilla components.

## Accessibility requirements (Reduced Motion)
- N/A
- Listen for `window.matchMedia('(prefers-reduced-motion: reduce)')`.

## Verification (Acceptance-Test Checklist)
- [ ] Textures are KTX2 or highly compressed WebP.
- [ ] Draco compression applied.
- [ ] Unused nodes/lights are stripped from the file.

## Common mistakes
- **Bad**: Mutating React state at 60fps inside `useFrame`.
- **Bad**: Leaving a permanent full-screen bloom pass on, ruining contrast.
- **Bad**: Shipping the Theatre.js Studio bundle to production.
- **Bad**: Forgetting to use Draco or KTX2 compression on heavy GLB files.

---
*Last Reviewed: 2026-07-17*
