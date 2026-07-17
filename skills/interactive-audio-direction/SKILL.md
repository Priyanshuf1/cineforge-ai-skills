---
name: interactive-audio-direction
status: EXPERIMENTAL
version: 0.1.0
categories: ["creative-web"]
description: Manages web audio, sound effects, and spatial audio tied to interactions. Activate when adding auditory feedback to UI or 3D.
triggers: []
related_skills: []
conflicting_skills: []
primary_tools: []
minimum_inputs: []
verification_required: true
last_reviewed: "2026-07-17"
---

# interactive-audio-direction

## Purpose
Deepens immersion by pairing visual impacts and UI states with high-quality sound design.

## When to activate
Use for premium interactive experiences. Never force audio on informational/standard websites.

## When not to activate
When the experience is meant to be purely informational, constrained by strict performance budgets, or if user sensory overload is a concern.

## Required inputs
- Verification of performance constraints.
- Explicit approval for stylized/VFX overrides.

## Tool-selection rules
- Use `@gsap/react` for DOM animation timelines.
- Use PixiJS for heavy 2D particle/displacement work.
- Use Howler.js for Audio.

## Implementation workflow & Principles
### Strict Audio Rules
- **User-gesture requirements**: Browsers block audio until the user clicks or interacts. Never attempt autoplay on load.
- **Muted default**: The site must start muted. Provide a highly visible, stylized 'Unmute' button.
- **Ambient loops & Impact sounds**: Keep ambient loops quiet (-12dB or lower) to leave headroom for punchy impact SFX.
- **Scroll-scrub limitations**: Do not tie audio playback rate directly to scroll speed (causes terrible audio artifacts). Use scroll thresholds to trigger one-shot sounds instead.
- **Volume reduction**: Overall mix should be mastered professionally to avoid clipping.
- **Mobile behaviour**: Respect the physical hardware mute switch on iOS.
- **Accessibility controls**: Always provide global mute/volume controls clearly in the UI.

**React/Next.js Cleanup**: 
Use Howler.js. Call `Howler.unload()` or stop specific sound instances on unmount.

## Performance requirements
- Deeply destroy and garbage collect all WebGL resources (PixiJS apps, Three.js geometries) on unmount.

## Accessibility requirements (Reduced Motion / Audio)
- Audio is generally fine, but consider sensory overload if the user requests reduced motion (perhaps disable non-essential ambient noise).
- Respect `window.matchMedia('(prefers-reduced-motion: reduce)')`.

## Verification (Acceptance-Test Checklist)
- [ ] Audio strictly starts muted.
- [ ] Howler instances are unloaded on unmount.
- [ ] Sounds don't overlap into a distorted mess on rapid clicking.

## Common mistakes
- **Bad**: Causing memory leaks by failing to destroy PixiJS apps in React `useEffect` cleanups.
- **Bad**: Trying to use 1000 DOM elements for particles instead of PixiJS `ParticleContainer`.
- **Bad**: Autoplaying audio without a user gesture.

---
*Last Reviewed: 2026-07-17*
