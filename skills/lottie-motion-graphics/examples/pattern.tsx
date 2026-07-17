import lottie from 'lottie-web';
import { useEffect, useRef } from 'react';

export const Loader = () => {
  const container = useRef();
  useEffect(() => {
    const anim = lottie.loadAnimation({ container: container.current, path: '/data.json', renderer: 'svg', loop: true, autoplay: true });
    return () => anim.destroy();
  }, []);
  return <div ref={container} />;
};
