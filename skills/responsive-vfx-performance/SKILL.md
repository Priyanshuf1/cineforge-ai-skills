---
name: responsive-vfx-performance
description: Manages pixel ratio, asset LOD, and effect toggling based on device capabilities. Activate to ensure smooth frame rates.
---

# responsive-vfx-performance

## Purpose
Maintains a strict 60fps performance budget across all hardware by scaling visual fidelity dynamically.

## When to activate
Mandatory on any project containing WebGL, heavy GSAP DOM animations, or video backgrounds.

## Required inputs
- Verification of project constraints (performance budget, accessibility goals).

## Tool-selection rules
- Use Rive for complex state-driven vectors; use Lottie strictly for linear static motion.

## Implementation workflow & Principles
### Technical Requirements
- **Quality tiers & Device-memory detection**: Read `navigator.deviceMemory` and `navigator.hardwareConcurrency` to assign a tier (low, med, high).
- **Device-pixel-ratio caps**: Cap `window.devicePixelRatio` to a maximum of 2.0 (or 1.5 on low tiers).
- **Mobile particle reduction & Shader resolution reduction**: Halve particle counts and downscale shader render targets on mobile.
- **Pausing hidden canvases**: Use `IntersectionObserver` to pause the animation loop of any canvas off-screen.
- **GPU memory**: Destroy old assets and trigger garbage collection immediately upon scene transition.
- **Frame-time monitoring**: Monitor `requestAnimationFrame` deltas. If FPS drops below 30 for >2 seconds, automatically degrade visual tier.
- **Lazy loading & Dynamic import**: WebGL libraries (Three.js/PixiJS) must be dynamically imported only when needed.
- **Fallback media**: Provide a static WebP image or lightweight CSS animation if the device cannot handle WebGL.

**React/Next.js Cleanup**: 
Clear all IntersectionObservers and frame-time tracking intervals on unmount.

## Performance requirements
- Rigorously enforce frame-time monitoring and pause off-screen WebGL instances.
- Lottie must be destroyed on unmount.

## Accessibility requirements (Reduced Motion)
- Set quality tier to 'accessible' (disables intensive animations).

## Verification (Acceptance-Test Checklist)
- [ ] Device pixel ratio never exceeds 2.
- [ ] Off-screen WebGL contexts pause their render loops.
- [ ] Fallback image appears if WebGL fails.

## Common mistakes
- **Bad**: Trying to build an entire interactive website inside a single Lottie JSON file.
- **Bad**: Forgetting to implement a keyboard-accessible fallback for a 3D WebGL experience.
- **Bad**: Blindly upgrading Three.js without reading the migration guide.

---
*Last Reviewed: 2026-07-17*
