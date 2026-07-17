import { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';

export const PixiOverlay = () => {
  const canvasRef = useRef();
  useEffect(() => {
    const app = new PIXI.Application({ view: canvasRef.current, transparent: true, resizeTo: window });
    // Setup particles...
    return () => app.destroy(true, { children: true, texture: true, baseTexture: true });
  }, []);
  return <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 100 }} />;
};