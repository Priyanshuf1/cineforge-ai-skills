import { MeshToonMaterial, NearestFilter, TextureLoader } from 'three';
// Create a 3-step gradient map for hard cel shading
const createGradientMap = () => {
  const colors = new Uint8Array([0, 128, 255]);
  const gradientMap = new THREE.DataTexture(colors, 3, 1, THREE.LuminanceFormat);
  gradientMap.minFilter = THREE.NearestFilter;
  gradientMap.magFilter = THREE.NearestFilter;
  gradientMap.generateMipmaps = false;
  return gradientMap;
};