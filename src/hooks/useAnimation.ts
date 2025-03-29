import { useState, useEffect, useRef, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

/**
 * A unified animation hook that combines functionality from multiple animation-related hooks
 * - Handles scroll-based animations
 * - Respects reduced motion preferences
 * - Provides customizable animation options
 * - Supports different animation types
 * 
 * @param options Configuration options for the animation
 * @returns Object containing reference, visibility state, and animation controls
 */
export const useAnimation = (options = {
  threshold: 0.2,
  triggerOnce: true,
  rootMargin: '0px',
  animationDelay: 0,
  animationType: 'fade',
  animationClass: ''
}) => {
  const {
    threshold = 0.2,
    triggerOnce = true,
    rootMargin = '0px',
    animationDelay = 0,
    animationType = 'fade',
    animationClass = ''
  } = options;
  
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  
  // Use InView hook for visibility detection
  const [ref, inView] = useInView({
    threshold,
    triggerOnce,
    rootMargin
  });
  
  // Combine refs to work with both useRef and useInView
  const setRefs = useCallback((element: HTMLElement | null) => {
    // Save a reference to the element
    elementRef.current = element;
    
    // Set the ref from useInView
    if (typeof ref === 'function') {
      ref(element);
    }
  }, [ref]);

  // Handle animation classes
  useEffect(() => {
    // Skip animations for users who prefer reduced motion
    if (prefersReducedMotion) {
      if (elementRef.current) {
        elementRef.current.style.opacity = '1';
        elementRef.current.style.transform = 'none';
      }
      return;
    }
    
    // Apply animation when element comes into view
    if (elementRef.current && inView && !hasAnimated) {
      // If delay is specified, use setTimeout
      if (animationDelay > 0) {
        setTimeout(() => {
          if (elementRef.current) {
            // Apply animation class or default animation type
            if (animationClass) {
              elementRef.current.classList.add(animationClass);
            } else {
              elementRef.current.classList.add(`animate-${animationType}`);
            }
            setHasAnimated(true);
          }
        }, animationDelay * 1000);
      } else {
        // Apply animation immediately
        if (animationClass) {
          elementRef.current.classList.add(animationClass);
        } else {
          elementRef.current.classList.add(`animate-${animationType}`);
        }
        setHasAnimated(true);
      }
    }
  }, [inView, hasAnimated, animationClass, animationType, animationDelay, prefersReducedMotion]);

  // Reset animation for non-triggerOnce scenarios
  useEffect(() => {
    if (!triggerOnce && !inView && hasAnimated && elementRef.current) {
      if (animationClass) {
        elementRef.current.classList.remove(animationClass);
      } else {
        elementRef.current.classList.remove(`animate-${animationType}`);
      }
      setHasAnimated(false);
    }
  }, [inView, hasAnimated, triggerOnce, animationClass, animationType]);

  // Provide animation playback controls
  const playAnimation = useCallback(() => {
    if (elementRef.current) {
      if (animationClass) {
        elementRef.current.classList.remove(animationClass);
        // Force a reflow to restart animation
        void elementRef.current.offsetWidth;
        elementRef.current.classList.add(animationClass);
      } else {
        elementRef.current.classList.remove(`animate-${animationType}`);
        // Force a reflow to restart animation
        void elementRef.current.offsetWidth;
        elementRef.current.classList.add(`animate-${animationType}`);
      }
    }
  }, [animationClass, animationType]);

  const stopAnimation = useCallback(() => {
    if (elementRef.current) {
      if (animationClass) {
        elementRef.current.classList.remove(animationClass);
      } else {
        elementRef.current.classList.remove(`animate-${animationType}`);
      }
    }
  }, [animationClass, animationType]);

  return {
    ref: setRefs,
    inView,
    hasAnimated,
    playAnimation,
    stopAnimation
  };
};

/**
 * Hook for staggered animations of child elements
 * - Animates child elements one after another
 * - Customizable delay between each child
 * - Respects reduced motion preferences
 * 
 * @param options Configuration options for staggered animations
 * @returns Object containing parent container ref and animation functions
 */
export const useStaggeredAnimation = (options = {
  staggerDelay: 0.1,
  childSelector: '[data-animate]',
  animationType: 'fade',
  rootMargin: '0px',
  threshold: 0.1,
  triggerOnce: true
}) => {
  const {
    staggerDelay = 0.1,
    childSelector = '[data-animate]',
    animationType = 'fade',
    rootMargin = '0px',
    threshold = 0.1,
    triggerOnce = true
  } = options;
  
  const containerRef = useRef<HTMLElement | null>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  
  // Use InView hook for container visibility
  const [ref, inView] = useInView({
    threshold,
    triggerOnce,
    rootMargin
  });
  
  // Combine refs
  const setContainerRef = useCallback((element: HTMLElement | null) => {
    containerRef.current = element;
    
    if (typeof ref === 'function') {
      ref(element);
    }
  }, [ref]);
  
  // Animate children when container comes into view
  useEffect(() => {
    // Skip animations for reduced motion preference
    if (prefersReducedMotion) {
      if (containerRef.current) {
        const children = containerRef.current.querySelectorAll(childSelector);
        children.forEach(child => {
          (child as HTMLElement).style.opacity = '1';
          (child as HTMLElement).style.transform = 'none';
        });
      }
      return;
    }
    
    // Apply staggered animations to children
    if (containerRef.current && inView && !hasAnimated) {
      const children = containerRef.current.querySelectorAll(childSelector);
      
      children.forEach((child, index) => {
        const delay = index * staggerDelay;
        
        setTimeout(() => {
          // Add animation class based on child's data attributes or default
          const customAnimation = child.getAttribute('data-animation');
          if (customAnimation) {
            child.classList.add(customAnimation);
          } else {
            child.classList.add(`animate-${animationType}`);
          }
        }, delay * 1000);
      });
      
      setHasAnimated(true);
    }
  }, [inView, hasAnimated, childSelector, staggerDelay, animationType, prefersReducedMotion]);
  
  // Reset animations if needed
  const resetAnimations = useCallback(() => {
    if (containerRef.current) {
      const children = containerRef.current.querySelectorAll(childSelector);
      
      children.forEach((child) => {
        // Remove all animation classes
        const customAnimation = child.getAttribute('data-animation');
        if (customAnimation) {
          child.classList.remove(customAnimation);
        } else {
          child.classList.remove(`animate-${animationType}`);
        }
      });
      
      setHasAnimated(false);
    }
  }, [childSelector, animationType]);
  
  return {
    ref: setContainerRef,
    inView,
    hasAnimated,
    resetAnimations
  };
};

/**
 * Hook for scroll-triggered animations
 * - Triggers animations based on scroll position
 * - Can animate based on scroll progress
 * - Optimized performance with passive event handlers
 * 
 * @param options Configuration options for scroll animations
 * @returns Object containing element ref and scroll progress
 */
export const useScrollAnimation = (options = {
  triggerOffset: 0,
  progressAnimation: false,
  clamp: true
}) => {
  const {
    triggerOffset = 0,
    progressAnimation = false,
    clamp = true
  } = options;
  
  const elementRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();
  
  // Handle scroll events
  useEffect(() => {
    // Skip intensive animations for reduced motion preference
    if (prefersReducedMotion && progressAnimation) {
      if (elementRef.current) {
        elementRef.current.style.opacity = '1';
        elementRef.current.style.transform = 'none';
      }
      return;
    }
    
    const handleScroll = () => {
      if (!elementRef.current) return;
      
      const rect = elementRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Element is considered visible when its top edge is below the trigger offset
      // and its bottom edge is above the bottom of the viewport
      const isInView = rect.top < windowHeight - triggerOffset && rect.bottom > 0;
      
      setIsVisible(isInView);
      
      // Calculate scroll progress for progress-based animations
      if (progressAnimation && isInView) {
        // Calculate how far the element has been scrolled through the viewport
        // 0 = just entered viewport, 1 = about to leave viewport
        let progress = 1 - (rect.bottom / windowHeight);
        
        // Clamp values between 0 and 1 if requested
        if (clamp) {
          progress = Math.max(0, Math.min(1, progress));
        }
        
        setScrollProgress(progress);
      }
    };
    
    // Run once on mount to check initial state
    handleScroll();
    
    // Add scroll event listener with passive flag for performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [triggerOffset, progressAnimation, clamp, prefersReducedMotion]);
  
  return {
    ref: elementRef,
    isVisible,
    scrollProgress
  };
};

/**
 * Simple wrapper for the useScrollAnimation hook
 * - Maintained for backward compatibility
 * - Simplified API for basic scroll animations
 */
export const useSimpleScrollAnimation = (threshold = 0.2, triggerOnce = true) => {
  // Use the more comprehensive InView hook implementation
  const [ref, inView] = useInView({
    threshold,
    triggerOnce
  });
  
  return { ref, inView };
};