import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function SvgMotion() {
  const pathRef = useRef<SVGPathElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    // Calculate total length for CSS stroke animation
    const length = path.getTotalLength();

    // Set initial dash array and offset to simulate 'undrawn' state
    gsap.set(path, {
      strokeDasharray: length,
      strokeDashoffset: length,
    });

    const tl = gsap.timeline({ repeat: -1, yoyo: true });
    
    // Animate stroke-dashoffset to 0 to "draw" the path
    tl.to(path, {
      strokeDashoffset: 0,
      duration: 2,
      ease: "power2.inOut"
    });
    
    // Fill color appears after drawing
    tl.to(path, {
      fill: 'rgba(255, 51, 102, 0.5)',
      duration: 0.5,
      ease: "power1.inOut"
    }, "-=0.5");

    gsap.fromTo(containerRef.current, 
      { scale: 0.8, opacity: 0 }, 
      { scale: 1, opacity: 1, duration: 1.2, ease: 'elastic.out(1, 0.5)' }
    );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', color: '#fff' }}>
      <div ref={containerRef} style={{ textAlign: 'center' }}>
        <h1 style={{ marginBottom: '2rem', fontSize: '2rem' }}>Vanilla DrawSVG Pattern</h1>
        <svg 
          width="300" 
          height="300" 
          viewBox="0 0 100 100" 
          xmlns="http://www.w3.org/2000/svg"
          style={{ overflow: 'visible' }}
        >
          <path 
            ref={pathRef}
            d="M 50 10 C 20 10 10 40 50 90 C 90 40 80 10 50 10 Z" 
            fill="transparent" 
            stroke="#ff3366" 
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
