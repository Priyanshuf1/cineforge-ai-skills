import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import SplitText from 'gsap/SplitText'; // Ensure premium plugin is available
gsap.registerPlugin(SplitText);

export const HeroText = ({ text }) => {
  const textRef = useRef(null);
  useGSAP(() => {
    const split = new SplitText(textRef.current, { type: 'lines,words' });
    gsap.from(split.words, { y: 20, opacity: 0, stagger: 0.05 });
    return () => split.revert();
  }, []);
  return <h1 ref={textRef}>{text}</h1>;
};
