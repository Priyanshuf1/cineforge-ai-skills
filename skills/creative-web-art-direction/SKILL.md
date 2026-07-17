---
name: creative-web-art-direction
status: EXPERIMENTAL
version: 0.1.0
categories: ["creative-web"]
description: Guides overall visual direction, color harmony, and mood for premium web experiences. Activate when establishing the initial design system or visual theme.
triggers:
  - "add creative-web-art-direction"
  - "implement creative web art direction"
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

# creative-web-art-direction

## Purpose
Establishes a unified, premium visual language (typography scale, color tokens, easing curves) before building components.

## When to activate
Use when starting a new project or major visual overhaul. Do not use for minor bug fixes or single-component updates.

## When not to activate
Do not use for minor bug fixes or single-component updates.

## Required inputs
- Verified target DOM structure.
- Context of whether this is a React/Next.js environment.

## Tool-selection rules
- Use `@gsap/react` for any GSAP logic in React components.
- Do not install extra packages without a compatibility audit.

## Implementation workflow
1. Setup structure.
2. Initialize animation or styling.
3. **React/Next.js Cleanup**: Art direction logic (e.g., theme toggling) should use `useEffect` safely and clean up any global event listeners.

## Performance requirements
- Avoid layout thrashing (animate transforms and opacity, not height/width).

## Accessibility requirements (Reduced Motion)
- Art direction must specify a fallback state with no transitions when `prefers-reduced-motion` is detected.
- Listen for `window.matchMedia('(prefers-reduced-motion: reduce)')`.

## Verification (Acceptance-Test Checklist)
- [ ] Custom font families loaded correctly without FOIT.
- [ ] Color contrast meets WCAG AA minimum.
- [ ] Semantic CSS variables applied globally.

## Good vs Bad Usage
**Good**: Defining a semantic CSS variable system (e.g., `--color-surface-elevated`).
**Bad**: Hardcoding hex values or relying on default Tailwind color palettes without curation.

---
*Last Reviewed: 2026-07-17*
