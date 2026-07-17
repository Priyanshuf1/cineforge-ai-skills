---
name: rapier-physics-integration
description: Adds rigid body physics simulations to 3D scenes. Activate when objects need gravity, collisions, or realistic interaction.
---

# rapier-physics-integration

## Purpose
Provides deterministic, high-performance physics simulation for 3D objects.

## When to activate
Use only for genuine physics (falling debris, dice rolls, character controllers). **Never use physics for ordinary typography or UI.**

## When not to activate
When unnecessary performance overhead would compromise the core user experience on standard devices.

## Required inputs
- Verification of 3D asset availability.
- Target device performance budget.

## Tool-selection rules
- Use Vanilla Three.js for standalone components; use React Three Fiber for React apps.
- Use Theatre.js strictly for complex keyframing, not basic motion.

## Implementation workflow & Principles
### Technical & Artistic Directives
- **Rigid bodies & Colliders**: Use `<RigidBody>` wrappers. Choose collider shapes carefully (prefer Cuboid or Sphere over Trimesh/Hull for performance).
- **Collision events**: Use `onCollisionEnter` for triggering sound effects or impacts.
- **Debris**: Use InstancedMesh wrapped in an InstancedRigidBody for hundreds of falling particles.
- **React/R3F version compatibility**: Ensure `@react-three/rapier` is aligned with the R3F version.
- **Performance**: Physics calculations are heavy. Put physics bodies to sleep (`sleep()_)` when they stop moving.

**React/Next.js Cleanup**: 
Physics worlds must be disposed; R3F Rapier handles this automatically on `<Physics>` unmount.

## Performance requirements
- Avoid triggering React state updates (`setState`) inside render loops (`useFrame`).
- Explicitly dispose of materials, textures, and geometries when unmounting vanilla components.

## Accessibility requirements (Reduced Motion)
- N/A (If physics are core to the experience, they stay, but disable non-essential floating physics).
- Listen for `window.matchMedia('(prefers-reduced-motion: reduce)')`.

## Verification (Acceptance-Test Checklist)
- [ ] Physics are not used for simple UI/typography animations.
- [ ] Complex colliders (Trimesh) are avoided where simple shapes work.
- [ ] Objects fall asleep when stationary.

## Common mistakes
- **Bad**: Mutating React state at 60fps inside `useFrame`.
- **Bad**: Leaving a permanent full-screen bloom pass on, ruining contrast.
- **Bad**: Shipping the Theatre.js Studio bundle to production.
- **Bad**: Forgetting to use Draco or KTX2 compression on heavy GLB files.

---
*Last Reviewed: 2026-07-17*
