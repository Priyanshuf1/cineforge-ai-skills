import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export const AnimatedBox = () => {
  const container = useRef();
  useGSAP(() => {
    gsap.from('.box', { y: 100, opacity: 0, duration: 1, ease: 'power3.out' });
  }, { scope: container });
  return <div ref={container}><div className="box">Content</div></div>;
};