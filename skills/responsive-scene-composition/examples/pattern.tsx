import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';

export const ResponsiveCamera = () => {
  const { camera, size } = useThree();
  useEffect(() => {
    camera.fov = size.width < 768 ? 75 : 50;
    camera.updateProjectionMatrix();
  }, [size, camera]);
  return null;
};