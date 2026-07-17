import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';

export const PostFX = () => (
  <EffectComposer>
    <Bloom luminanceThreshold={1} mipmapBlur intensity={0.5} />
    <Vignette eskil={false} offset={0.1} darkness={1.1} />
  </EffectComposer>
);