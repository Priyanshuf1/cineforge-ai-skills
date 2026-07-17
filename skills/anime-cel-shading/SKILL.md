---
name: anime-cel-shading
status: EXPERIMENTAL
version: 0.1.0
categories: ["creative-web"]
description: Implements toon/cel shading materials for 3D models. Activate when aiming for a stylized, non-photorealistic 3D look.
triggers:
  - "add anime-cel-shading"
  - "implement anime cel shading"
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

# anime-cel-shading

## Purpose
Renders 3D models to look like 2D anime illustrations.

## When to activate
Use exclusively when art direction demands a stylized, illustrated aesthetic.

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
- **Hard light bands**: Use a `MeshToonMaterial` with a `gradientMap` (NearestFilter) for sharp color stepping.
- **Two- and three-tone shading**: Define highlight, midtone, and shadow steps clearly in the gradient map.
- **Rim lighting & Fresnel accents**: Add a custom shader pass to highlight the edges of the model facing away from the camera.
- **Inverted-hull outline**: To draw outlines, render a slightly scaled-up, inverted, purely black copy of the mesh (BackSide rendering).
- **Emissive edges**: Use emissive mapping to make certain stylized lines glow (e.g., sci-fi panel lines).
- **Halftone shadow concepts**: For manga styles, map shadows to a halftone dot texture instead of flat colors.
- **Outline thickness control**: Use vertex normals to push the inverted hull outward; scale uniformly based on camera distance.

**React/Next.js Cleanup**: 
Dispose of both the main material and the outline material.

## Performance requirements
- Avoid triggering React state updates (`setState`) inside render loops (`useFrame`).
- Explicitly dispose of materials, textures, and geometries when unmounting vanilla components.

## Accessibility requirements (Reduced Motion)
- N/A
- Listen for `window.matchMedia('(prefers-reduced-motion: reduce)')`.

## Verification (Acceptance-Test Checklist)
- [ ] Outlines use BackSide culling.
- [ ] Gradient map uses NearestFilter (no blur).
- [ ] Shadows are stepped, not smooth.

## Common mistakes
- **Bad**: Mutating React state at 60fps inside `useFrame`.
- **Bad**: Leaving a permanent full-screen bloom pass on, ruining contrast.
- **Bad**: Shipping the Theatre.js Studio bundle to production.
- **Bad**: Forgetting to use Draco or KTX2 compression on heavy GLB files.

---
*Last Reviewed: 2026-07-17*
