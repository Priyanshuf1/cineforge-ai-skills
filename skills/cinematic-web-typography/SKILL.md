---
name: cinematic-web-typography
status: EXPERIMENTAL
version: 0.1.0
categories: ["creative-web"]
description: Implements high-end typographic scales, pairings, and layout for web. Activate when styling text elements for a cinematic or editorial feel.
triggers: []
related_skills: []
conflicting_skills: []
primary_tools: []
minimum_inputs: []
verification_required: true
last_reviewed: "2026-07-17"
---

# cinematic-web-typography

## Purpose
Treats typography as the primary visual element, ensuring cinematic framing and scale.

## When to activate
Use for hero sections, editorial articles, or text-heavy WebGL overlays. Do not use for dense dashboard data grids.

## When not to activate
Do not use for dense dashboard data grids.

## Required inputs
- Verified target DOM structure.
- Context of whether this is a React/Next.js environment.

## Tool-selection rules
- Use `@gsap/react` for any GSAP logic in React components.
- Do not install extra packages without a compatibility audit.

## Implementation workflow
1. Setup structure.
2. Initialize animation or styling.
3. **React/Next.js Cleanup**: No specific React cleanup needed for CSS typography, but ensure GSAP text animations use `useGSAP()`.

## Performance requirements
- Avoid layout thrashing (animate transforms and opacity, not height/width).

## Accessibility requirements (Reduced Motion)
- Disable elaborate typographic reveals; default to simple fade-ins.
- Listen for `window.matchMedia('(prefers-reduced-motion: reduce)')`.

## Verification (Acceptance-Test Checklist)
- [ ] Fluid typography scales correctly.
- [ ] Sharp readable foreground text remains separate from decorative glow.
- [ ] Text scenes include enter, hold, and exit phases.

## Good vs Bad Usage
**Good**: Using `clamp()` for fluid typography.
**Bad**: Setting fixed pixel sizes that break on small devices.

---
*Last Reviewed: 2026-07-17*

## Tested Lessons (Lab 1)

- **Dependency-Free Text Splitting**: Instead of relying on paid plugins like SplitText, a vanilla React component that recursively splits words and characters into inline-blocks works perfectly with GSAP for typography choreographies.
- **Performance**: Automated cleanup inside '@gsap/react' useGSAP hook successfully ensures zero memory leaks during rapid hot-reloads.
- **Mobile Adaptation**: Using CSS clamp() for font sizing removes the need for complex JS-based resize listeners.

