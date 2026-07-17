import { useEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollStage() {
  const container = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const elements = useRef<HTMLDivElement[]>([]);

  // Initialize Lenis for smooth scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  // GSAP ScrollTrigger Choreography
  useGSAP(() => {
    if (!stage.current || elements.current.length === 0) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: stage.current,
        start: 'top top',
        end: '+=3000', // Scroll 3000px to play through the animation
        scrub: 1, // Smooth scrub
        pin: true,
        anticipatePin: 1
      }
    });

    // Animate each element sequentially
    elements.current.forEach((el, index) => {
      if (!el) return;
      tl.fromTo(el, 
        { y: 100, opacity: 0, scale: 0.8 }, 
        { y: 0, opacity: 1, scale: 1, duration: 1, ease: 'power2.out' }
      )
      .to(el, {
        y: -100, opacity: 0, scale: 1.2, duration: 1, ease: 'power2.in'
      }, "+=0.5");
    });

  }, { scope: container });

  return (
    <div ref={container} style={{ backgroundColor: '#000', color: '#fff' }}>
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h2>Scroll Down to Enter Stage</h2>
      </div>
      
      {/* Pinned Stage Container */}
      <div ref={stage} style={{ height: '100vh', width: '100%', position: 'relative', overflow: 'hidden', backgroundColor: '#111' }}>
        {['Act I: The Setup', 'Act II: The Conflict', 'Act III: The Resolution'].map((text, i) => (
          <div 
            key={i} 
            ref={el => { if(el) elements.current[i] = el; }}
            style={{ 
              position: 'absolute', 
              top: '50%', left: '50%', 
              transform: 'translate(-50%, -50%)',
              fontSize: 'clamp(2rem, 5vw, 5rem)',
              fontWeight: 'bold',
              opacity: 0, // Initial state
              whiteSpace: 'nowrap'
            }}
          >
            {text}
          </div>
        ))}
      </div>

      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h2>End of Experience</h2>
      </div>
    </div>
  );
}
