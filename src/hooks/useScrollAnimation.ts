import { useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';

// Define a type for animation controls
interface AnimationControls {
  start: (variant: string) => Promise<void>;
}

export const useScrollAnimation = (threshold = 0.2, triggerOnce = true) => {
  // Create a simple controls object that fulfills the expected interface
  const controls = useRef<AnimationControls>({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    start: (variant) => {
      // Minimal implementation that resolves immediately
      return Promise.resolve();
    }
  }).current;
  
  const [ref, inView] = useInView({
    triggerOnce,
    threshold
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    } else if (!triggerOnce) {
      controls.start('hidden');
    }
  }, [inView, triggerOnce, controls]);

  return { ref, controls, inView };
};