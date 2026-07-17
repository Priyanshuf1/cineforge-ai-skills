import { useGLTF, useAnimations } from '@react-three/drei';
import { useEffect } from 'react';

export const Model = ({ url }) => {
  const { scene, animations } = useGLTF(url);
  const { actions } = useAnimations(animations, scene);
  useEffect(() => {
    actions.Idle?.play();
  }, [actions]);
  return <primitive object={scene} onPointerOver={() => actions.Hover?.play()} />;
};
