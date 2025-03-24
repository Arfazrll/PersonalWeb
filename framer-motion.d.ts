import { useEffect, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';

// Create a minimal implementation that works with your components
export const useScrollAnimation = (threshold = 0.2, triggerOnce = true) => {
  // Create a memoized controls object to avoid recreating it on every render
  const controls = useMemo(() => ({
    start: (variant: string) => {
      // Simple implementation that satisfies the type system
      console.log(`Animation started: ${variant}`);
      return Promise.resolve();
    }
  }), []);
  
  const [ref, inView] = useInView({
    triggerOnce,
    threshold
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    } else {
      if (!triggerOnce) {
        controls.start('hidden');
      }
    }
  }, [inView, triggerOnce, controls]);

  return { ref, controls, inView };
};