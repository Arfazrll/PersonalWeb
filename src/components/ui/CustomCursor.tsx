import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';

interface Position {
  x: number;
  y: number;
}

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [isClicking, setIsClicking] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [hasMoved, setHasMoved] = useState<boolean>(false);
  const [interactiveElement, setInteractiveElement] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';

  useEffect(() => {
    // More precise position tracking with lerp (linear interpolation) for smoother movement
    let currentX = 0;
    let currentY = 0;
    let rafId: number;
    
    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor;
    };
    
    const animate = () => {
      // Smooth out cursor movement with lerp
      currentX = lerp(currentX, position.x, 0.2);
      currentY = lerp(currentY, position.y, 0.2);
      
      // Update dot and ring position in the DOM
      const dot = document.querySelector('.cursor-dot') as HTMLElement;
      const ring = document.querySelector('.cursor-ring') as HTMLElement;
      
      if (dot) {
        dot.style.transform = `translate3d(${currentX - 4}px, ${currentY - 4}px, 0)`;
      }
      
      if (ring) {
        ring.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
      }
      
      rafId = requestAnimationFrame(animate);
    };
    
    rafId = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [position]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!hasMoved) setHasMoved(true);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseDown = () => {
      setIsClicking(true);
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      if (
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.classList.contains('card-hover') || 
        target.closest('.card-hover') ||
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.hasAttribute('role') && target.getAttribute('role') === 'button' || 
        target.classList.contains('skill-badge')
      ) {
        setIsHovering(true);
        
        // Set the type of element for custom cursor styling
        if (target.tagName === 'A') {
          setInteractiveElement('link');
        } else if (target.tagName === 'BUTTON' || (target.hasAttribute('role') && target.getAttribute('role') === 'button')) {
          setInteractiveElement('button');
        } else if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
          setInteractiveElement('input');
        } else if (target.classList.contains('card-hover') || target.closest('.card-hover')) {
          setInteractiveElement('card');
        } else {
          setInteractiveElement('default');
        }
      } else {
        setIsHovering(false);
        setInteractiveElement(null);
      }
    };

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleElementHover);

    return () => {
      // Clean up event listeners
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleElementHover);
    };
  }, [hasMoved]);

  // Hide the cursor on touch devices
  if (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0) {
    return null;
  }

  // Only show after mouse has moved at least once
  if (!hasMoved) {
    return null;
  }

  // Get cursor colors based on theme and element type
  const getCursorColors = () => {
    const baseColor = isDarkMode ? 'rgba(99, 102, 241, 0.9)' : 'rgba(79, 70, 229, 0.9)';
    const ringColor = isDarkMode ? 'rgba(99, 102, 241, 0.4)' : 'rgba(79, 70, 229, 0.4)';
    
    if (interactiveElement === 'link') {
      return {
        dot: isDarkMode ? 'rgba(147, 197, 253, 0.9)' : 'rgba(37, 99, 235, 0.9)',
        ring: isDarkMode ? 'rgba(147, 197, 253, 0.4)' : 'rgba(37, 99, 235, 0.4)'
      };
    } else if (interactiveElement === 'button') {
      return {
        dot: isDarkMode ? 'rgba(110, 231, 183, 0.9)' : 'rgba(16, 185, 129, 0.9)',
        ring: isDarkMode ? 'rgba(110, 231, 183, 0.4)' : 'rgba(16, 185, 129, 0.4)'
      };
    } else if (interactiveElement === 'card') {
      return {
        dot: isDarkMode ? 'rgba(249, 168, 212, 0.9)' : 'rgba(219, 39, 119, 0.9)',
        ring: isDarkMode ? 'rgba(249, 168, 212, 0.4)' : 'rgba(219, 39, 119, 0.4)'
      };
    } else if (interactiveElement === 'input') {
      return {
        dot: isDarkMode ? 'rgba(253, 230, 138, 0.9)' : 'rgba(245, 158, 11, 0.9)',
        ring: isDarkMode ? 'rgba(253, 230, 138, 0.4)' : 'rgba(245, 158, 11, 0.4)'
      };
    }
    
    return { dot: baseColor, ring: ringColor };
  };
  
  const cursorColors = getCursorColors();

  return (
    <>
      {/* Main cursor dot with framer-motion */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] cursor-dot"
        animate={{
          opacity: isVisible ? 1 : 0,
          scale: isClicking ? 0.8 : isHovering ? 0.5 : 1,
        }}
        transition={{
            duration: 0.2,
            type: "spring", 
            stiffness: 500, 
            damping: 28, 
            mass: 0.5
          }}
      >
        <motion.div
          className="w-3 h-3 rounded-full cursor-dot-inner"
          style={{
            backgroundColor: cursorColors.dot,
            boxShadow: `0 0 10px ${cursorColors.dot}`,
            opacity: isHovering ? 0.8 : 1,
          }}
          animate={{
            scale: isHovering ? 1.5 : 1
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 28
          }}
        />
      </motion.div>

      {/* Cursor ring/outline */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998] cursor-ring"
        animate={{
          width: isHovering ? (interactiveElement === 'card' ? '80px' : '50px') : '30px',
          height: isHovering ? (interactiveElement === 'card' ? '80px' : '50px') : '30px',
          opacity: isVisible ? 1 : 0,
          borderColor: cursorColors.ring,
        }}
        transition={{
          type: "spring",
          stiffness: 250,
          damping: 25,
          mass: 0.8
        }}
      >
        <motion.div
          className="absolute inset-0 rounded-full border-2"
          style={{
            borderColor: cursorColors.ring,
            boxShadow: isHovering ? `0 0 20px ${cursorColors.ring}` : 'none'
          }}
          animate={{
            scale: isClicking ? 0.9 : 1
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 25
          }}
        />
      </motion.div>
      
      {/* Text label that appears when hovering over specific elements */}
      {interactiveElement && isHovering && (
        <motion.div
          className="fixed pointer-events-none z-[9997] text-xs font-medium bg-white dark:bg-secondary-800 rounded-full px-2 py-1 shadow-sm text-center"
          initial={{ opacity: 0, y: position.y + 20 }}
          animate={{ 
            opacity: 0.9, 
            y: position.y + 30,
            x: position.x
          }}
          style={{
            transform: 'translateX(-50%)'
          }}
          transition={{ 
            duration: 0.2 
          }}
        >
          {interactiveElement === 'link' && 'Click'}
          {interactiveElement === 'button' && 'Click'}
          {interactiveElement === 'card' && 'View'}
          {interactiveElement === 'input' && 'Type'}
        </motion.div>
      )}
      
      {/* Global style for hiding default cursor */}
      <style jsx global>{`
        html, 
        a, 
        button, 
        .card-hover, 
        input, 
        textarea, 
        [role="button"],
        .skill-badge {
          cursor: none !important;
        }
        
        /* Add subtle transition to cursor colors */
        .cursor-dot-inner {
          transition: background-color 0.3s ease, box-shadow 0.3s ease;
        }
        
        /* Fallback for when JS fails */
        @media (pointer: coarse) {
          html, 
          a, 
          button, 
          .card-hover, 
          input, 
          textarea, 
          [role="button"],
          .skill-badge {
            cursor: auto !important;
          }
        }
      `}</style>
    </>
  );
};

export default CustomCursor;