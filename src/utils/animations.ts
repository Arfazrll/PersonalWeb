import { Variants } from 'framer-motion';

// Fade in animation
export const fadeInAnimation: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.3 } }
};

// Fade in from bottom animation
export const fadeInUpAnimation: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: 20, transition: { duration: 0.3 } }
};

// Fade in from top animation
export const fadeInDownAnimation: Variants = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

// Fade in from left animation
export const fadeInLeftAnimation: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.3 } }
};

// Fade in from right animation
export const fadeInRightAnimation: Variants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, x: 20, transition: { duration: 0.3 } }
};

// Scale animation
export const scaleAnimation: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.3 } }
};

// Staggered container animation
export const staggerContainerAnimation: Variants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1, 
    transition: { 
      staggerChildren: 0.1,
      delayChildren: 0.3
    } 
  },
  exit: { 
    opacity: 0,
    transition: { 
      staggerChildren: 0.05,
      staggerDirection: -1
    } 
  }
};

// Staggered item animation
export const staggerItemAnimation: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.5
    }
  },
  exit: { 
    opacity: 0, 
    y: 20, 
    transition: { 
      duration: 0.3
    }
  }
};

// Page transitions
export const pageTransitionAnimation: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.3 } }
};

// Floating animation
export const floatingAnimation: Variants = {
  initial: { y: 0 },
  animate: { 
    y: -10, 
    transition: { 
      duration: 2, 
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut"
    }
  }
};

// Rotating animation
export const rotatingAnimation: Variants = {
  initial: { rotate: 0 },
  animate: { 
    rotate: 360, 
    transition: { 
      duration: 10, 
      repeat: Infinity,
      ease: "linear"
    }
  }
};

// Pulse animation
export const pulseAnimation: Variants = {
  initial: { scale: 1 },
  animate: { 
    scale: 1.05, 
    transition: { 
      duration: 1, 
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut"
    }
  }
};

// Button hover animation
export const buttonHoverAnimation = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.98 },
  transition: { duration: 0.2 }
};

// Card hover animation
export const cardHoverAnimation = {
  whileHover: { y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" },
  transition: { duration: 0.3 }
};

// Create a custom slide in animation with configurable parameters
export const createSlideAnimation = (
  direction: 'left' | 'right' | 'up' | 'down' = 'up',
  distance: number = 20,
  duration: number = 0.5
): Variants => {
  let x = 0;
  let y = 0;
  
  switch (direction) {
    case 'left':
      x = -distance;
      break;
    case 'right':
      x = distance;
      break;
    case 'up':
      y = -distance;
      break;
    case 'down':
      y = distance;
      break;
  }
  
  return {
    initial: { opacity: 0, x, y },
    animate: { 
      opacity: 1, 
      x: 0, 
      y: 0, 
      transition: { 
        duration 
      }
    },
    exit: { 
      opacity: 0, 
      x, 
      y, 
      transition: { 
        duration: duration * 0.6
      }
    }
  };
};

// Create a custom stagger animation with configurable parameters
export const createStaggerAnimation = (
  staggerDelay: number = 0.1,
  childDelay: number = 0.3,
  childDuration: number = 0.5
): {
  container: Variants;
  item: Variants;
} => {
  return {
    container: {
      initial: { opacity: 0 },
      animate: { 
        opacity: 1, 
        transition: { 
          staggerChildren: staggerDelay,
          delayChildren: childDelay
        } 
      },
      exit: { 
        opacity: 0,
        transition: { 
          staggerChildren: staggerDelay / 2,
          staggerDirection: -1
        } 
      }
    },
    item: {
      initial: { opacity: 0, y: 20 },
      animate: { 
        opacity: 1, 
        y: 0, 
        transition: { 
          duration: childDuration
        }
      },
      exit: { 
        opacity: 0, 
        y: 20, 
        transition: { 
          duration: childDuration * 0.6
        }
      }
    }
  };
};