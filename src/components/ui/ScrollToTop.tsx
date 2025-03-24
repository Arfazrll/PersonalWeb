import React, { useState, useEffect } from 'react';
import { FiChevronUp } from 'react-icons/fi';

const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  // Show button when page is scrolled beyond threshold
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      <button
        onClick={scrollToTop}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => {
          setIsHovering(false);
          setIsPressed(false);
        }}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        className={`fixed right-6 bottom-6 z-50 w-12 h-12 flex items-center justify-center rounded-full bg-primary-600 dark:bg-primary-500 text-white shadow-lg transition-all duration-300
          ${!isVisible ? 'opacity-0 translate-y-20 scale-80 pointer-events-none' : 'opacity-100 translate-y-0 scale-100'}
          ${isHovering && !isPressed ? 'scale-110 shadow-xl' : ''}
          ${isPressed ? 'scale-90' : ''}
        `}
        aria-label="Scroll to top"
        style={{
          transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s ease, box-shadow 0.3s ease'
        }}
      >
        <FiChevronUp size={24} />
        
        {/* Ripple effects using CSS animations instead of framer-motion */}
        <div 
          className="absolute inset-0 rounded-full bg-primary-500 dark:bg-primary-400 opacity-0"
          style={{
            animation: isVisible ? 'ripple 2s linear infinite' : 'none'
          }}
        />
        
        <div 
          className="absolute inset-0 rounded-full bg-primary-500 dark:bg-primary-400 opacity-0"
          style={{
            animation: isVisible ? 'ripple 2s linear infinite 1s' : 'none'
          }}
        />
      </button>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes ripple {
          0% {
            transform: scale(0);
            opacity: 0.5;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
};

export default ScrollToTop;