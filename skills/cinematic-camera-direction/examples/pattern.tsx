import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

export const CameraParallax = () => {
  const vec = new THREE.Vector3();
  useFrame((state) => {
    state.camera.position.lerp(vec.set(state.pointer.x * 2, state.pointer.y * 2, 5), 0.05);
    state.camera.lookAt(0, 0, 0);
  });
  return null;
};