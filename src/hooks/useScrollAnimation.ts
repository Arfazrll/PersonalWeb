import { useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';

/**
 * A simplified version of the scroll animation hook that doesn't rely on framer-motion.
 * It uses CSS classes to handle animations instead.
 * 
 * @param threshold Value between 0 and 1 indicating what percentage of the element should be visible
 * @param triggerOnce Whether to trigger the animation only once
 * @param className The CSS animation class to apply when element is in view
 * @returns Object containing ref (to attach to DOM element) and inView status
 */
export const useScrollAnimation = (
  threshold = 0.2, 
  triggerOnce = true,
  className = 'animate-fade-in'
) => {
  const elementRef = useRef<HTMLElement | null>(null);
  const [ref, inView] = useInView({
    triggerOnce,
    threshold
  });

  // Combine refs
  const setRefs = (element: HTMLElement | null) => {
    // Save a reference to the element
    elementRef.current = element;
    
    // Set the ref from useInView
    if (typeof ref === 'function') {
      ref(element);
    }
  };

  // Apply animation class when element comes into view
  useEffect(() => {
    if (elementRef.current && inView) {
      elementRef.current.classList.add(className);
    } else if (elementRef.current && !triggerOnce && !inView) {
      elementRef.current.classList.remove(className);
    }
  }, [inView, className, triggerOnce]);

  return { ref: setRefs, inView };
};

export default useScrollAnimation;