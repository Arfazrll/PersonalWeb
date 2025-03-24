import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useTheme } from 'next-themes';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

interface CursorPosition {
  x: number;
  y: number;
}

/**
 * Type for interactive element identification
 */
type InteractiveElementType = 'link' | 'button' | 'input' | 'card' | 'default' | null;

/**
 * Interface for cursor state management
 * 
 * @property isVisible - Whether the cursor is visible (in viewport)
 * @property isHovering - Whether the cursor is hovering over an interactive element
 * @property isClicking - Whether the cursor is in a clicking state (mouse down)
 * @property hasMoved - Whether the cursor has moved at least once (initial state detection)
 * @property interactiveElement - Type of interactive element being hovered, or null
 */
interface CursorState {
  isVisible: boolean;
  isHovering: boolean; // Strictly boolean
  isClicking: boolean;
  hasMoved: boolean;
  interactiveElement: InteractiveElementType;
}

const CustomCursor: React.FC = () => {
  // Refs for cursor elements
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const textLabelRef = useRef<HTMLDivElement>(null);
  
  // Use a single position state to reduce renders
  const [position, setPosition] = useState<CursorPosition>({ x: 0, y: 0 });
  
  // Cursor state
  const [cursorState, setCursorState] = useState<CursorState>({
    isVisible: false,
    isHovering: false,
    isClicking: false,
    hasMoved: false,
    interactiveElement: null,
  });
  
  // Theme
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';
  const prefersReducedMotion = usePrefersReducedMotion();
  
  // Animation frame ID for cleanup
  const animationFrameIdRef = useRef<number | null>(null);
  
  // Current position for animation (outside of React state for performance)
  const currentPositionRef = useRef<CursorPosition>({ x: 0, y: 0 });
  
  // Cancel animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, []);
  
  // Linear interpolation helper for smooth cursor movement
  const lerp = useCallback((start: number, end: number, factor: number): number => {
    return start + (end - start) * factor;
  }, []);
  
  // Animate cursor movement with optimized RAF
  const animateCursor = useCallback(() => {
    try {
      if (!dotRef.current || !ringRef.current) return;
      
      // Smooth out cursor movement with lerp
      currentPositionRef.current.x = lerp(
        currentPositionRef.current.x, 
        position.x, 
        0.15
      );
      currentPositionRef.current.y = lerp(
        currentPositionRef.current.y, 
        position.y, 
        0.15
      );
      
      // Update dot position - safe application with try/catch for each element
      try {
        dotRef.current.style.transform = `translate3d(${currentPositionRef.current.x - 4}px, ${currentPositionRef.current.y - 4}px, 0)`;
      } catch (e) {
        console.error('Error updating dot position:', e);
      }
      
      // Update ring position
      try {
        ringRef.current.style.transform = `translate3d(${currentPositionRef.current.x}px, ${currentPositionRef.current.y}px, 0) translate(-50%, -50%)`;
      } catch (e) {
        console.error('Error updating ring position:', e);
      }
      
      // Update text label position if visible
      if (textLabelRef.current && cursorState.isHovering && cursorState.interactiveElement) {
        try {
          textLabelRef.current.style.transform = `translate3d(${currentPositionRef.current.x}px, ${currentPositionRef.current.y + 30}px, 0) translateX(-50%)`;
        } catch (e) {
          console.error('Error updating text label position:', e);
        }
      }
    } catch (error) {
      console.error('Error in cursor animation:', error);
    } finally {
      // Always continue animation loop, even if there was an error
      animationFrameIdRef.current = requestAnimationFrame(animateCursor);
    }
  }, [position, cursorState.isHovering, cursorState.interactiveElement, lerp]);
  
  // Setup animation loop
  useEffect(() => {
    if (cursorState.hasMoved) {
      animationFrameIdRef.current = requestAnimationFrame(animateCursor);
    }
    
    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [animateCursor, cursorState.hasMoved]);
  
  // Handle mouse interactions with debouncing
  useEffect(() => {
    // Stores timeout IDs for cleanup
    const timeouts: NodeJS.Timeout[] = [];
    
    // Mouse move handler with throttling
    let lastUpdateTime = 0;
    let rafPending = false;
    
    const updatePosition = (clientX: number, clientY: number) => {
      setPosition({ x: clientX, y: clientY });
      
      if (!cursorState.hasMoved) {
        setCursorState(prev => ({ ...prev, hasMoved: true, isVisible: true }));
      }
      
      rafPending = false;
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      
      // Throttle updates to max 60fps
      if (now - lastUpdateTime > 16) {
        lastUpdateTime = now;
        
        // Use requestAnimationFrame for smoothness and to align with browser's rendering cycle
        if (!rafPending) {
          rafPending = true;
          requestAnimationFrame(() => updatePosition(e.clientX, e.clientY));
        }
      }
    };

    const handleMouseEnter = () => {
      setCursorState(prev => ({ ...prev, isVisible: true }));
    };

    const handleMouseLeave = () => {
      setCursorState(prev => ({ ...prev, isVisible: false }));
    };

    const handleMouseDown = () => {
      setCursorState(prev => ({ ...prev, isClicking: true }));
    };

    const handleMouseUp = () => {
      setCursorState(prev => ({ ...prev, isClicking: false }));
    };
    
    /**
     * Helper function to determine if an element is interactive
     * Returns a tuple of [isInteractive, elementType]
     */
    const checkInteractiveElement = (target: HTMLElement): [boolean, InteractiveElementType] => {
      // Check for interactive elements in specific order of priority
      if (target.tagName === 'A') {
        return [true, 'link'];
      }
      
      if (target.tagName === 'BUTTON' || (target.hasAttribute('role') && target.getAttribute('role') === 'button')) {
        return [true, 'button'];
      }
      
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return [true, 'input'];
      }
      
      // Card hover requires special handling for parent elements
      if (target.classList.contains('card-hover')) {
        return [true, 'card'];
      }
      
      const cardParent = target.closest('.card-hover');
      if (cardParent instanceof HTMLElement) {
        return [true, 'card'];
      }
      
      if (target.classList.contains('skill-badge')) {
        return [true, 'default'];
      }
      
      // Not interactive
      return [false, null];
    };
    
    // Debounced element hover detection
    let hoverDebounceTimeout: NodeJS.Timeout;
    const handleElementHover = (e: MouseEvent) => {
      clearTimeout(hoverDebounceTimeout);
      
      hoverDebounceTimeout = setTimeout(() => {
        const target = e.target as HTMLElement;
        
        // Use helper function to determine interactivity and element type
        const [isInteractive, elementType] = checkInteractiveElement(target);
        
        setCursorState(prev => ({
          ...prev, 
          isHovering: isInteractive,
          interactiveElement: elementType
        }));
      }, 10); // Short debounce for responsiveness
      
      timeouts.push(hoverDebounceTimeout);
    };

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleElementHover);

    // Clean up event listeners
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleElementHover);
      
      // Clear all timeouts
      timeouts.forEach(id => clearTimeout(id));
      clearTimeout(hoverDebounceTimeout);
    };
  }, [cursorState.hasMoved]);
  
  // Enhanced feature detection for touch devices
  const isTouchDevice = (() => {
    if (typeof window === 'undefined') return false;
    
    // Multiple checks for more reliable detection
    return (
      (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0) ||
      ('ontouchstart' in window) ||
      (window.matchMedia && window.matchMedia('(pointer: coarse)').matches)
    );
  })();
  
  // Browser compatibility check for required features
  const hasRequiredFeatures = (() => {
    if (typeof window === 'undefined') return false;
    
    return (
      typeof requestAnimationFrame === 'function' &&
      typeof window.getComputedStyle === 'function'
    );
  })();
  
  // Don't render cursor on touch devices, if reduced motion is preferred, or if browser lacks required features
  if (isTouchDevice || prefersReducedMotion || !hasRequiredFeatures) {
    return null;
  }
  
  // Don't render until mouse has moved at least once
  if (!cursorState.hasMoved) {
    return null;
  }
  
  // Get cursor colors based on theme and element type
  const getCursorColors = () => {
    const baseColor = isDarkMode ? 'rgba(99, 102, 241, 0.9)' : 'rgba(79, 70, 229, 0.9)';
    const ringColor = isDarkMode ? 'rgba(99, 102, 241, 0.4)' : 'rgba(79, 70, 229, 0.4)';
    
    if (cursorState.interactiveElement === 'link') {
      return {
        dot: isDarkMode ? 'rgba(147, 197, 253, 0.9)' : 'rgba(37, 99, 235, 0.9)',
        ring: isDarkMode ? 'rgba(147, 197, 253, 0.4)' : 'rgba(37, 99, 235, 0.4)'
      };
    } else if (cursorState.interactiveElement === 'button') {
      return {
        dot: isDarkMode ? 'rgba(110, 231, 183, 0.9)' : 'rgba(16, 185, 129, 0.9)',
        ring: isDarkMode ? 'rgba(110, 231, 183, 0.4)' : 'rgba(16, 185, 129, 0.4)'
      };
    } else if (cursorState.interactiveElement === 'card') {
      return {
        dot: isDarkMode ? 'rgba(249, 168, 212, 0.9)' : 'rgba(219, 39, 119, 0.9)',
        ring: isDarkMode ? 'rgba(249, 168, 212, 0.4)' : 'rgba(219, 39, 119, 0.4)'
      };
    } else if (cursorState.interactiveElement === 'input') {
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
      {/* Main cursor dot with styled div instead of framer-motion */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] cursor-dot"
        style={{
          opacity: cursorState.isVisible ? 1 : 0,
          transform: `translate3d(${position.x - 4}px, ${position.y - 4}px, 0)`,
          transition: 'opacity 0.2s ease-out',
        }}
      >
        <div
          className="w-3 h-3 rounded-full cursor-dot-inner"
          style={{
            backgroundColor: cursorColors.dot,
            boxShadow: `0 0 10px ${cursorColors.dot}`,
            opacity: cursorState.isHovering ? 0.8 : 1,
            transform: `scale(${cursorState.isHovering ? 1.5 : cursorState.isClicking ? 0.8 : 1})`,
            transition: 'transform 0.2s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.2s ease-out, background-color 0.3s ease, box-shadow 0.3s ease',
          }}
        />
      </div>

      {/* Cursor ring/outline */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998] cursor-ring"
        style={{
          width: cursorState.isHovering 
            ? (cursorState.interactiveElement === 'card' ? '80px' : '50px') 
            : '30px',
          height: cursorState.isHovering 
            ? (cursorState.interactiveElement === 'card' ? '80px' : '50px') 
            : '30px',
          transform: `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%)`,
          opacity: cursorState.isVisible ? 1 : 0,
          transition: 'width 0.25s ease-out, height 0.25s ease-out, opacity 0.2s ease-out',
        }}
      >
        <div
          className="absolute inset-0 rounded-full border-2"
          style={{
            borderColor: cursorColors.ring,
            boxShadow: cursorState.isHovering ? `0 0 20px ${cursorColors.ring}` : 'none',
            transform: `scale(${cursorState.isClicking ? 0.9 : 1})`,
            transition: 'transform 0.2s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.3s ease, box-shadow 0.3s ease',
          }}
        />
      </div>
      
      {/* Text label that appears when hovering over specific elements */}
      {cursorState.isHovering && cursorState.interactiveElement && (
        <div
          ref={textLabelRef}
          className="fixed pointer-events-none z-[9997] text-xs font-medium bg-white dark:bg-secondary-800 rounded-full px-2 py-1 shadow-sm text-center"
          style={{
            transform: `translate3d(${position.x}px, ${position.y + 30}px, 0) translateX(-50%)`,
            opacity: 0.9,
            transition: 'transform 0.2s ease-out',
          }}
        >
          {cursorState.interactiveElement === 'link' && 'Click'}
          {cursorState.interactiveElement === 'button' && 'Click'}
          {cursorState.interactiveElement === 'card' && 'View'}
          {cursorState.interactiveElement === 'input' && 'Type'}
        </div>
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
        
        /* Fallback for when JS fails or on touch devices */
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