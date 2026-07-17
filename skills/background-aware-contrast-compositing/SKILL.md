---
name: background-aware-contrast-compositing
status: EXPERIMENTAL
version: 0.1.0
categories: ["creative-web"]
description: Ensures text and UI elements remain legible over dynamic, moving, or 3D backgrounds. Activate when placing content over video or WebGL canvases.
triggers:
  - "add background-aware-contrast-compositing"
  - "implement background aware contrast compositing"
related_skills: []
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

# background-aware-contrast-compositing

## Purpose
Maintains accessibility and readability when UI sits above complex, unpredictable backgrounds.

## When to activate
Use over WebGL canvases, videos, or image sequences. Do not use over solid, predictable color blocks.

## When not to activate
Do not use over solid, predictable color blocks.

## Required inputs
- Verified target DOM structure.
- Context of whether this is a React/Next.js environment.

## Tool-selection rules
- Use `@gsap/react` for any GSAP logic in React components.
- Do not install extra packages without a compatibility audit.

## Implementation workflow
1. Setup structure.
2. Initialize animation or styling.
3. **React/Next.js Cleanup**: Ensure background tracking observers or color-thief listeners are cleaned up on unmount.

## Performance requirements
- Avoid layout thrashing (animate transforms and opacity, not height/width).

## Accessibility requirements (Reduced Motion)
- N/A for contrast, but if backgrounds animate rapidly, consider pausing them for accessibility.
- Listen for `window.matchMedia('(prefers-reduced-motion: reduce)')`.

## Verification (Acceptance-Test Checklist)
- [ ] Sharp readable foreground text must remain separate from decorative glow.
- [ ] Background-aware text must be tested across multiple moving frames.
- [ ] Essential text must not depend on unstable blend modes.

## Good vs Bad Usage
**Good**: Using backdrop-filter blur combined with a subtle semi-transparent dark overlay.
**Bad**: Depending on unstable `mix-blend-mode` for essential text, rendering it illegible on certain frames.

---
*Last Reviewed: 2026-07-17*
