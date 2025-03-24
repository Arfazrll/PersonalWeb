// src/hooks/useScrollIndicator.ts
import { useState, useEffect } from 'react';

export const useScrollIndicator = () => {
  const [scrollPercentage, setScrollPercentage] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      
      // Calculate scroll percentage
      const scrolled = (scrollTop / (documentHeight - windowHeight)) * 100;
      setScrollPercentage(Math.min(Math.max(scrolled, 0), 100));
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initialize scroll percentage
    handleScroll();
    
    // Clean up event listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return { scrollPercentage };
};