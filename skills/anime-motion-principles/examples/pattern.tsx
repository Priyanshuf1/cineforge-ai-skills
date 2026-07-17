import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import CustomEase from 'gsap/CustomEase';
gsap.registerPlugin(CustomEase);

export const AnimeButton = () => {
  const btn = useRef();
  useGSAP(() => {
    CustomEase.create('animeSnap', 'M0,0 C0.1,0.8 0.2,1 1,1');
    gsap.from(btn.current, { scale: 0, rotation: -15, duration: 0.6, ease: 'animeSnap' });
  });
  return <button ref={btn}>Click Me</button>;
};