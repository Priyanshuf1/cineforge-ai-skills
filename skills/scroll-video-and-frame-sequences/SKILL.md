---
name: scroll-video-and-frame-sequences
description: Synchronizes video playback or image sequence drawing with scroll position. Activate when scrub-animating media sequences.
---

# scroll-video-and-frame-sequences

## Purpose
Achieves 'Apple-style' 3D product reveals by scrubbing video or canvas frame sequences on scroll.

## When to activate
Use for high-fidelity product renders. Do not use if mobile bandwidth or memory is highly constrained.

## When not to activate
Do not use if mobile bandwidth or memory is highly constrained.

## Required inputs
- Verified target DOM structure.
- Context of whether this is a React/Next.js environment.

## Tool-selection rules
- Use `@gsap/react` for any GSAP logic in React components.
- Do not install extra packages without a compatibility audit.

## Implementation workflow
1. Setup structure.
2. Initialize animation or styling.
3. **React/Next.js Cleanup**: Canvas contexts and ScrollTriggers must be disposed of properly.

## Performance requirements
- Avoid layout thrashing (animate transforms and opacity, not height/width).

## Accessibility requirements (Reduced Motion)
- Provide a direct skip-to-end button or disable the scrub.
- Listen for `window.matchMedia('(prefers-reduced-motion: reduce)')`.

## Verification (Acceptance-Test Checklist)
- [ ] Uses Canvas/Images over Video for precise scrubbing (especially mobile).
- [ ] Images are preloaded to prevent flashing.
- [ ] Memory is released on unmount.

## Good vs Bad Usage
**Good**: Preloading a sprite sheet or highly compressed image sequence for a canvas.
**Bad**: Using standard HTML5 `<video>` scrubbing on mobile (mobile OS often prevents fine-grained video seeking).

---
*Last Reviewed: 2026-07-17*
