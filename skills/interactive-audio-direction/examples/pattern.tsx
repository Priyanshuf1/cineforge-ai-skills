import { Howl, Howler } from 'howler';
import { useEffect } from 'react';

export const useSound = (src) => {
  useEffect(() => {
    const sound = new Howl({ src: [src] });
    return () => sound.unload();
  }, [src]);
  // Return a play function
};
