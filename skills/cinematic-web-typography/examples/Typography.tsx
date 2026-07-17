import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const SplitText = ({ text }: { text: string }) => {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {text.split(' ').map((word, i) => (
        <span key={i} style={{ display: 'inline-block', whiteSpace: 'pre', overflow: 'hidden' }}>
          {word.split('').map((char, j) => (
            <span key={j} className="char" style={{ display: 'inline-block', transformOrigin: 'bottom center' }}>{char}</span>
          ))}
          {' '}
        </span>
      ))}
    </div>
  );
}

export default function Typography() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const chars = container.current?.querySelectorAll('.char');
    if (!chars) return;
    
    // GSAP SplitText Choreography Pattern
    // Adding a subtle rotation and y-offset for a cinematic "rise" effect
    gsap.from(chars, {
      y: 150,
      rotationX: -90,
      opacity: 0,
      stagger: 0.02,
      duration: 1.2,
      ease: "power4.out"
    });
  }, { scope: container });

  return (
    <div ref={container} style={{ 
      padding: '4rem', 
      fontFamily: '"Inter", sans-serif', 
      backgroundColor: '#050505', 
      color: '#ffffff', 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }}>
      <h1 style={{ 
        fontSize: 'clamp(3rem, 8vw, 8rem)', 
        textTransform: 'uppercase', 
        lineHeight: 0.9, 
        margin: 0,
        fontWeight: 900,
        letterSpacing: '-0.02em'
      }}>
        <SplitText text="Cinematic Typography" />
      </h1>
      <div style={{ marginTop: '2rem', fontSize: 'clamp(1rem, 2vw, 2rem)', opacity: 0.6, fontWeight: 300, maxWidth: '600px' }}>
        <SplitText text="Mastering GSAP split text choreography. A pure CSS/React implementation avoiding external paid plugins, focusing on accessible structure and automated cleanup." />
      </div>
    </div>
  );
}
