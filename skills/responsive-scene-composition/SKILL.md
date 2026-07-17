---
name: responsive-scene-composition
status: EXPERIMENTAL
version: 0.1.0
categories: ["creative-web"]
description: Handles layout and positioning of 3D and 2D elements across different screen sizes. Activate when ensuring a scene looks good on both desktop and mobile.
---

# responsive-scene-composition

## Purpose
Ensures 3D canvas and 2D DOM elements scale and align coherently on all devices.

## When to activate
Use whenever 3D elements (Three.js) must align visually with DOM elements.

## When not to activate
When performance is constrained or context implies simple styling.

## Required inputs
- Verified target DOM structure.
- Context of whether this is a React/Next.js environment.

## Tool-selection rules
- Use `@gsap/react` for any GSAP logic in React components.
- Do not install extra packages without a compatibility audit.

## Implementation workflow
1. Setup structure.
2. Initialize animation or styling.
3. **React/Next.js Cleanup**: Resize observers must be disconnected on unmount.

## Performance requirements
- Avoid layout thrashing (animate transforms and opacity, not height/width).

## Accessibility requirements (Reduced Motion)
- N/A directly to layout.
- Listen for `window.matchMedia('(prefers-reduced-motion: reduce)')`.

## Verification (Acceptance-Test Checklist)
- [ ] WebGL canvas does not stretch.
- [ ] 3D models remain centered or framed correctly on mobile.
- [ ] ResizeObserver cleans up perfectly.

## Good vs Bad Usage
**Good**: Adjusting Camera FOV dynamically based on aspect ratio.
**Bad**: Stretching the WebGL canvas, distorting the 3D models.

---
*Last Reviewed: 2026-07-17*
