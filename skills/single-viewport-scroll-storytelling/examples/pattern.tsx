import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export const ScrollStory = () => {
  const container = useRef();
  useGSAP(() => {
    gsap.to('.element', {
      x: 500,
      scrollTrigger: {
        trigger: container.current,
        pin: true,
        scrub: 1,
        end: '+=1000'
      }
    });
  }, { scope: container });
  return <div ref={container} className="h-screen"><div className="element">Move me</div></div>;
};