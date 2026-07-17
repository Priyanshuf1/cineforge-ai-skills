---
name: gsap-splittext-choreography
status: EXPERIMENTAL
version: 0.1.0
categories: ["creative-web"]
description: Creates intricate text reveal and typographic animations. Activate when animating individual words, lines, or characters of text.
triggers: []
related_skills: []
conflicting_skills: []
primary_tools: []
minimum_inputs: []
verification_required: true
last_reviewed: "2026-07-17"
---

# gsap-splittext-choreography

## Purpose
Animates text at the line, word, or character level for dramatic reveals.

## When to activate
Use for hero headlines or major section titles. Do not use on large paragraphs of body text (performance/accessibility cost).

## When not to activate
Do not use on large paragraphs of body text (performance/accessibility cost).

## Required inputs
- Verified target DOM structure.
- Context of whether this is a React/Next.js environment.

## Tool-selection rules
- Use `@gsap/react` for any GSAP logic in React components.
- Do not install extra packages without a compatibility audit.

## Implementation workflow
1. Setup structure.
2. Initialize animation or styling.
3. **React/Next.js Cleanup**: SplitText instances must call `.revert()` inside the `useGSAP()` cleanup phase to restore the original DOM.

## Performance requirements
- Avoid layout thrashing (animate transforms and opacity, not height/width).

## Accessibility requirements (Reduced Motion)
- Fallback to a simple opacity fade for the whole block.
- Listen for `window.matchMedia('(prefers-reduced-motion: reduce)')`.

## Verification (Acceptance-Test Checklist)
- [ ] Text scenes require enter, hold and exit phases.
- [ ] SplitText reverts on unmount.
- [ ] Resizing does not break text layout.

## Good vs Bad Usage
**Good**: Wrapping SplitText logic inside `useGSAP()` and reverting the DOM on unmount.
**Bad**: Leaving orphaned `<div>` tags from split text after the component unmounts, breaking layout.

---
*Last Reviewed: 2026-07-17*
