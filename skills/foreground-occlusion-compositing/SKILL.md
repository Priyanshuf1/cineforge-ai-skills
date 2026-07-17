---
name: foreground-occlusion-compositing
status: EXPERIMENTAL
version: 0.1.0
categories: ["creative-web"]
description: Integrates foreground DOM elements seamlessly with background 3D or video scenes to create depth. Activate when layering UI with 3D.
triggers: []
related_skills: []
conflicting_skills: []
primary_tools: []
minimum_inputs: []
verification_required: true
last_reviewed: "2026-07-17"
---

# foreground-occlusion-compositing

## Purpose
Creates a parallax depth effect where 2D DOM elements appear to weave in and out of 3D objects.

## When to activate
Use when blending 3D worlds with standard web UI.

## Tested Lessons (Lab 4: Foreground Occlusion)

- **Parallax Directionality**: To maximize the illusion of depth without stretching the viewport too far, move the background element positively (e.g., `y: '50%'`), the middle element slightly (e.g., `y: '20%'`), and the foreground element negatively (e.g., `y: '-50%'`).
- **Cinematic Compositing**: Applying `mixBlendMode: 'difference'` (or exclusion/overlay) to the foreground text layer creates a premium aesthetic when it overlaps images, tying directly into the `background-aware-contrast-compositing` skill.
- **Scroll Synchronization**: Ensure GSAP ScrollTrigger timelines are strictly clamped to a `containerRef` with `overflow: 'hidden'` to prevent parallax elements from breaking the page's horizontal or vertical scrolling flow.

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
3. **React/Next.js Cleanup**: Event listeners syncing DOM to 3D must unmount.

## Performance requirements
- Avoid layout thrashing (animate transforms and opacity, not height/width).

## Accessibility requirements (Reduced Motion)
- N/A
- Listen for `window.matchMedia('(prefers-reduced-motion: reduce)')`.

## Verification (Acceptance-Test Checklist)
- [ ] Occlusion masks are anti-aliased and clean.
- [ ] Foreground occlusion must avoid rough automatic masks.
- [ ] Pointer events don't block necessary interactions.

## Good vs Bad Usage
**Good**: Using careful `z-index` layering and matching DOM elements to 3D projected coordinates.
**Bad**: Foreground occlusion must avoid rough automatic masks that cause pixelated edges.

---
*Last Reviewed: 2026-07-17*
