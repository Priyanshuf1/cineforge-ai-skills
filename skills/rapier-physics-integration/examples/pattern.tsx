import { Physics, RigidBody, CuboidCollider } from '@react-three/rapier';

export const FallingBox = () => (
  <Physics>
    <RigidBody position={[0, 5, 0]}>
      <mesh><boxGeometry /><meshStandardMaterial /></mesh>
    </RigidBody>
    <CuboidCollider position={[0, -1, 0]} args={[10, 0.5, 10]} />
  </Physics>
);