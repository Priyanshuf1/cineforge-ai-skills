import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export default function Occlusion() {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgTextRef = useRef<HTMLHeadingElement>(null);
  const fgTextRef = useRef<HTMLHeadingElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      }
    });

    // Parallax background text slower
    tl.to(bgTextRef.current, { y: '50%', ease: 'none' }, 0);
    
    // Middle image moves slightly slower
    tl.to(imageRef.current, { y: '20%', ease: 'none' }, 0);
    
    // Foreground text moves faster in the opposite direction
    tl.to(fgTextRef.current, { y: '-50%', ease: 'none' }, 0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
      tl.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <>
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', color: '#fff' }}>
        <h1>Scroll down for Occlusion Parallax</h1>
      </div>
      
      <div 
        ref={containerRef}
        style={{ 
          height: '150vh', 
          width: '100%', 
          position: 'relative', 
          backgroundColor: '#000',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {/* Background Layer: z-index 1 */}
        <h1 
          ref={bgTextRef}
          style={{ 
            position: 'absolute', 
            fontSize: '15vw', 
            fontWeight: '900', 
            color: '#333', 
            whiteSpace: 'nowrap',
            zIndex: 1 
          }}
        >
          BACKGROUND
        </h1>

        {/* Middle Layer (Image): z-index 2 */}
        <div 
          ref={imageRef}
          style={{ 
            position: 'absolute', 
            width: '400px', 
            height: '600px', 
            backgroundColor: '#ff3366',
            backgroundImage: 'url("https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=600&auto=format&fit=crop")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 2,
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            borderRadius: '10px'
          }}
        />

        {/* Foreground Layer (Occlusion): z-index 3 */}
        <h1 
          ref={fgTextRef}
          style={{ 
            position: 'absolute', 
            fontSize: '15vw', 
            fontWeight: '900', 
            color: '#fff', 
            whiteSpace: 'nowrap',
            zIndex: 3,
            mixBlendMode: 'difference' // Cinematic compositing over the image
          }}
        >
          FOREGROUND
        </h1>
      </div>

      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', color: '#fff' }}>
        <h1>End of Occlusion</h1>
      </div>
    </>
  );
}
