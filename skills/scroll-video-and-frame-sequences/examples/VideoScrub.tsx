import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export default function VideoScrub() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // 1. Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    const video = videoRef.current;
    let tl: gsap.core.Timeline | null = null;

    if (video) {
      const initScrub = () => {
        tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: '+=4000', // 4000px scroll duration
            scrub: true,
            pin: true,
            anticipatePin: 1,
            markers: true // for lab debugging
          }
        });

        // Scrub video time linearly based on scroll progress
        tl.fromTo(video, 
          { currentTime: 0 }, 
          { currentTime: video.duration || 1, ease: 'none' }
        );
      };

      if (video.readyState >= 1) {
        initScrub();
      } else {
        video.addEventListener('loadedmetadata', initScrub);
      }
      // Force load to ensure readyState resolves
      video.load();
    }

    return () => {
      if (video) {
        video.removeEventListener('loadedmetadata', () => {});
      }
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
      if (tl) tl.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <>
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', color: '#fff' }}>
        <h1>Scroll down to begin Video Scrub</h1>
      </div>
      <div 
        ref={containerRef} 
        style={{ height: '100vh', width: '100%', overflow: 'hidden', position: 'relative', backgroundColor: '#000' }}
      >
        <video
          ref={videoRef}
          src="/video.mp4"
          playsInline
          muted
          preload="auto"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white', fontSize: '3rem', fontWeight: 'bold', textShadow: '0 2px 10px rgba(0,0,0,0.8)', pointerEvents: 'none' }}>
          Video Scrub Testing
        </div>
      </div>
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', color: '#fff' }}>
        <h1>End of Scrub</h1>
      </div>
    </>
  );
}
