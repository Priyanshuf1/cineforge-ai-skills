---
name: gsap-motion-direction
description: Orchestrates complex UI animations, layout transitions, and timeline sequences. Activate when building multi-step animations or interactive UI motion.
---

# gsap-motion-direction

## Purpose
Provides a single source of truth for complex DOM and WebGL choreographies.

## When to activate
Use for cinematic sequences or sequential reveals. Do not use for simple hover states (use CSS).

## When not to activate
Do not use for simple hover states (use CSS).

## Required inputs
- Verified target DOM structure.
- Context of whether this is a React/Next.js environment.

## Tool-selection rules
- Use `@gsap/react` for any GSAP logic in React components.
- Do not install extra packages without a compatibility audit.

## Implementation workflow
1. Setup structure.
2. Initialize animation or styling.
3. **React/Next.js Cleanup**: GSAP must be properly cleaned up in React using `@gsap/react` `useGSAP({ scope })`.

## Performance requirements
- Avoid layout thrashing (animate transforms and opacity, not height/width).

## Accessibility requirements (Reduced Motion)
- Use `gsap.matchMedia()` to disable animations for `prefers-reduced-motion: reduce`.
- Listen for `window.matchMedia('(prefers-reduced-motion: reduce)')`.

## Verification (Acceptance-Test Checklist)
- [ ] `useGSAP()` is used instead of `useEffect` for all animations.
- [ ] Timelines kill() and revert() on unmount.
- [ ] Animations disable when reduced-motion is requested.

## Good vs Bad Usage
**Good**: Using `useGSAP()` hook for automatic cleanup in React.
**Bad**: Using generic fade-up animations as the main motion language; or failing to revert timelines on unmount.

---
*Last Reviewed: 2026-07-17*
