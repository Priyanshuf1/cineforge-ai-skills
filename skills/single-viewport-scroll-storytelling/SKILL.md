---
name: single-viewport-scroll-storytelling
status: EXPERIMENTAL
version: 0.1.0
categories: ["creative-web"]
description: Builds immersive scroll-driven experiences that feel pinned or fixed. Activate when user scroll controls timeline progress rather than native scrolling.
triggers: []
related_skills: []
conflicting_skills: []
primary_tools: []
minimum_inputs: []
verification_required: true
last_reviewed: "2026-07-17"
---

# single-viewport-scroll-storytelling

## Purpose
Takes over the scrollbar to drive a timeline (Scrollytelling).

## When to activate
Use when the narrative requires sequential visual changes in a fixed viewport. Do not use for standard content pages.

## When not to activate
Do not use for standard content pages.

## Required inputs
- Verified target DOM structure.
- Context of whether this is a React/Next.js environment.

## Tool-selection rules
- Use `@gsap/react` for any GSAP logic in React components.
- Do not install extra packages without a compatibility audit.

## Implementation workflow
1. Setup structure.
2. Initialize animation or styling.
3. **React/Next.js Cleanup**: ScrollTriggers must be killed via `useGSAP()` on component unmount to prevent orphaned scroll listeners.

## Performance requirements
- Avoid layout thrashing (animate transforms and opacity, not height/width).

## Accessibility requirements (Reduced Motion)
- Scrub animations are generally OK, but auto-playing parallax should be disabled.
- Listen for `window.matchMedia('(prefers-reduced-motion: reduce)')`.

## Verification (Acceptance-Test Checklist)
- [ ] Single-viewport scrollytelling must not render ordinary stacked sections.
- [ ] No scroll jank (performance hit) during scrub.
- [ ] ScrollTrigger markers are removed for production.

## Good vs Bad Usage
**Good**: Pinning a single master container and driving a timeline with ScrollTrigger.
**Bad**: Single-viewport scrollytelling must not render ordinary stacked sections. Do not use multiple nested pins that conflict.

---
*Last Reviewed: 2026-07-17*

## Tested Lessons (Lab 2)

- **Lenis + GSAP Sync**: Registering Lenis to trigger ScrollTrigger.update inside the lenis.on('scroll') event is mandatory for preventing jitter.
- **React 19 Cleanups**: Both lenis.destroy() and gsap.ticker.remove() must execute on unmount. Without this, hot-reloading rapidly degrades frame rates.
- **ScrollTrigger Pinning**: Setting nticipatePin: 1 smoothed out the initial jitter when the viewport pin engaged.

