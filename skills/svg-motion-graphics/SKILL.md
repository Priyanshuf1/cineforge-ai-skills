---
name: svg-motion-graphics
status: EXPERIMENTAL
version: 0.1.0
categories: ["creative-web"]
description: Animates vector graphics for loaders, icons, and illustrations. Activate when drawing SVG paths or morphing shapes.
---

# svg-motion-graphics

## Purpose
Provides crisp, scalable vector animations without the overhead of WebGL or Canvas.

## When to activate
Use for UI icons, loaders, and line-art illustrations.

## Tested Lessons (Lab 5: SVG Animation)

- **Vanilla DrawSVG Pattern**: You can achieve professional path drawing animations without paid plugins by using `const length = path.getTotalLength();` and animating `strokeDashoffset` from `length` to `0` via GSAP.
- **Cross-Browser SVGs**: Ensure `<svg>` has `overflow: 'visible'` if animating strokes with high `strokeWidth` or scaling paths, as Safari can occasionally clip bounding boxes.
- **Fill Compositing**: Wait until the `strokeDashoffset` animation is almost complete before fading in the SVG `fill` property (e.g., `-=0.5` position in timeline) to create a satisfying, two-step aesthetic.

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
3. **React/Next.js Cleanup**: GSAP DrawSVG or MorphSVG must be cleaned via `useGSAP()`.

## Performance requirements
- Avoid layout thrashing (animate transforms and opacity, not height/width).

## Accessibility requirements (Reduced Motion)
- Stop path drawing animations; render fully drawn instantly.
- Listen for `window.matchMedia('(prefers-reduced-motion: reduce)')`.

## Verification (Acceptance-Test Checklist)
- [ ] `viewBox` is correct and fluid.
- [ ] SVG elements don't cause layout shifts.
- [ ] No expensive SVG filters are animated.

## Good vs Bad Usage
**Good**: Animating `stroke-dashoffset` for drawing effects.
**Bad**: Animating expensive SVG filters (like `feGaussianBlur`) which destroy performance.

---
*Last Reviewed: 2026-07-17*
