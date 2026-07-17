import * as THREE from 'three';
// Example of deep disposal
export const disposeNode = (node) => {
  if (node.geometry) node.geometry.dispose();
  if (node.material) {
    if (Array.isArray(node.material)) node.material.forEach(m => m.dispose());
    else node.material.dispose();
  }
};