import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface AnimatedCounterProps {
  endValue: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  endValue,
  duration = 2000,
  prefix = '',
  suffix = '',
  className = '',
}) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  
  // Visibility detection using native Intersection Observer
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    
    observer.observe(element);
    
    return () => {
      observer.disconnect();
    };
  }, []);
  
  // Animation implementation
  useEffect(() => {
    if (!isVisible) return;
    
    let startTime: number;
    let animationFrameId: number;
    const startCount = 0;
    
    const easeOutQuart = (t: number): number => {
      return 1 - Math.pow(1 - t, 4);
    };
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easedProgress = easeOutQuart(progress);
      
      setCount(Math.floor(startCount + (endValue - startCount) * easedProgress));
      
      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };
    
    animationFrameId = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isVisible, endValue, duration]);
  
  return (
    <motion.div
      ref={containerRef}
      className={`font-bold ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.4 }}
    >
      {prefix}{count.toLocaleString()}{suffix}
    </motion.div>
  );
};

export default AnimatedCounter;