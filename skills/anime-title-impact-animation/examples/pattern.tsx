import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export const ImpactTitle = ({ text }) => {
  const title = useRef();
  useGSAP(() => {
    gsap.from(title.current, { scale: 3, opacity: 0, duration: 0.3, ease: 'power4.in', onComplete: () => {
      gsap.fromTo(title.current, { x: -10 }, { x: 10, clearProps: 'x', duration: 0.1, yoyo: true, repeat: 3 });
    }});
  });
  return <h1 ref={title} style={{ textShadow: '0 0 20px rgba(255,0,0,0.5)' }}>{text}</h1>;
};
