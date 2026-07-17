import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export const RotatingCube = () => {
  const meshRef = useRef();
  useFrame((state, delta) => {
    // Mutate ref directly, NO setState
    meshRef.current.rotation.x += delta * 0.5;
  });
  return <mesh ref={meshRef}><boxGeometry /><meshStandardMaterial /></mesh>;
};