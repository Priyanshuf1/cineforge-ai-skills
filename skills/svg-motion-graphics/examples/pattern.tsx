import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export const DrawIcon = () => {
  const pathRef = useRef();
  useGSAP(() => {
    gsap.from(pathRef.current, { strokeDashoffset: 1000, duration: 2 });
  });
  return <svg><path ref={pathRef} strokeDasharray="1000" d="..." /></svg>;
};