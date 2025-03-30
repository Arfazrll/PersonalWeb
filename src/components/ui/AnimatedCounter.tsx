import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';

interface AnimatedCounterProps {
  endValue: number;
  startValue?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  formatValue?: (value: number) => string;
  highlightDigits?: boolean;
  animationVariant?: 'basic' | 'bounce' | 'spring' | 'pulse';
  roundingPrecision?: number;
  colorTransition?: boolean;
  withThousandSeparator?: boolean;
  decimalPlaces?: number;
  overrideFontSize?: string;
  onComplete?: () => void;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  endValue,
  startValue = 0,
  duration = 2000,
  prefix = '',
  suffix = '',
  className = '',
  formatValue,
  highlightDigits = false,
  animationVariant = 'basic',
  roundingPrecision = 0,
  colorTransition = false,
  withThousandSeparator = true,
  decimalPlaces = 0,
  overrideFontSize,
  onComplete,
}) => {
  const [count, setCount] = useState(startValue);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  
  // Function to format number with options
  const formatNumberWithOptions = useCallback(
    (
      num: number, 
      useSeparator: boolean, 
      decimals: number
    ): string => {
      if (formatValue) {
        return formatValue(num);
      }
      
      // Round to specified precision for display
      const roundedNum = roundingPrecision > 0 
        ? Math.round(num / roundingPrecision) * roundingPrecision 
        : num;
      
      if (useSeparator) {
        return roundedNum.toLocaleString(undefined, {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        });
      }
      
      return roundedNum.toFixed(decimals);
    },
    [formatValue, roundingPrecision]
  );
  
  // For digit-by-digit highlighting
  const digits = useMemo(() => {
    if (!highlightDigits) return [];
    
    // Format the number with correct decimal places and separators
    const formattedNumber = formatNumberWithOptions(
      count, 
      withThousandSeparator, 
      decimalPlaces
    );
    
    // Convert string to array of characters
    return formattedNumber.split('');
  }, [count, highlightDigits, withThousandSeparator, decimalPlaces, formatNumberWithOptions]);
  
  // Determine color based on progress (for colorTransition option)
  const getProgressColor = (currentValue: number): string => {
    if (!colorTransition) return '';
    
    const progress = Math.min(currentValue / endValue, 1);
    
    if (progress < 0.25) return 'text-blue-500';
    if (progress < 0.5) return 'text-purple-500';
    if (progress < 0.75) return 'text-pink-500';
    if (progress < 1) return 'text-orange-500';
    return 'text-green-500';
  };
  
  // Define easing functions
  const easings = useMemo(() => ({
    basic: (t: number): number => 1 - Math.pow(1 - t, 3),
    bounce: (t: number): number => {
      const n1 = 7.5625;
      const d1 = 2.75;
      
      if (t < 1 / d1) {
        return n1 * t * t;
      } else if (t < 2 / d1) {
        return n1 * (t -= 1.5 / d1) * t + 0.75;
      } else if (t < 2.5 / d1) {
        return n1 * (t -= 2.25 / d1) * t + 0.9375;
      }
      return n1 * (t -= 2.625 / d1) * t + 0.984375;
    },
    spring: (t: number): number => {
      return 1 - (Math.cos(t * 4.5 * Math.PI) * Math.exp(-t * 6));
    },
    pulse: (t: number): number => {
      return t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
  }), []);
  
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
      { threshold: 0.1, rootMargin: '0px 0px -10% 0px' }
    );
    
    observer.observe(element);
    
    return () => {
      observer.disconnect();
    };
  }, []);
  
  // Animation implementation with selected easing
  useEffect(() => {
    if (!isVisible) return;
    
    let startTime: number;
    const easingFn = easings[animationVariant];
    
    const animate = (timestamp: number) => {
      if (!startTime) {
        startTime = timestamp;
      }
      
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easingFn(progress);
      
      // Use clamped to ensure we don't exceed endValue due to easing
      const newCount = startValue + (endValue - startValue) * easedProgress;
      setCount(Math.min(newCount, endValue));
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Ensure final value is exact
        setCount(endValue);
        setIsAnimationComplete(true);
        if (onComplete) onComplete();
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isVisible, endValue, startValue, duration, animationVariant, onComplete, easings]);
  
  // Animation variants for framer-motion (fixed to be compatible with Variants type)
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        type: animationVariant === 'spring' ? 'spring' : 'tween',
        stiffness: 120,
        damping: 10
      }
    }
  };
  
  // Digit-level animation variants (fixed to be compatible with Variants type)
  const digitVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0
    }
  };
  
  // Separate transition for digits to avoid TypeScript error with ease array
  const digitTransition = {
    duration: 0.3,
    ease: [0.175, 0.885, 0.32, 1.275]
  };
  
  // Function to render highlight digits if enabled
  const renderHighlightedDigits = () => {
    if (!highlightDigits) return null;
    
    return (
      <div className="flex">
        {digits.map((digit, index) => (
          <motion.span
            key={`${index}-${digit}`}
            initial="initial"
            animate="animate"
            variants={digitVariants}
            transition={{ 
              ...digitTransition,
              delay: index * 0.03 
            }}
            className={`${digit === ',' || digit === '.' ? 'mx-px' : ''} transition-colors duration-300`}
            style={{
              display: 'inline-block',
              fontVariantNumeric: 'tabular-nums'
            }}
          >
            {digit}
          </motion.span>
        ))}
      </div>
    );
  };
  
  // Prepare responsive font size
  const getFontSizeClass = () => {
    if (overrideFontSize) return '';
    
    // The longer the number, the smaller the font to prevent overflow
    const numberLength = endValue.toString().length;
    
    if (numberLength > 10) return 'text-xl sm:text-2xl';
    if (numberLength > 8) return 'text-2xl sm:text-3xl';
    if (numberLength > 6) return 'text-3xl sm:text-4xl';
    if (numberLength > 4) return 'text-4xl sm:text-5xl';
    return 'text-5xl sm:text-6xl';
  };
  
  return (
    <motion.div
      ref={containerRef}
      className={`relative font-bold ${getFontSizeClass()} ${getProgressColor(count)} ${className}`}
      style={{ fontVariantNumeric: 'tabular-nums', ...(overrideFontSize ? { fontSize: overrideFontSize } : {}) }}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={containerVariants}
    >
      {/* Background glow effect when animation completes */}
      {isAnimationComplete && (
        <motion.div 
          className="absolute inset-0 bg-current rounded-full opacity-0 z-0"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1.5, opacity: 0.15 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      )}
      
      {/* Actual counter display */}
      <motion.div className="relative z-10">
        {highlightDigits ? (
          <div className="flex items-center">
            {prefix && <span className="mr-1">{prefix}</span>}
            {renderHighlightedDigits()}
            {suffix && <span className="ml-1">{suffix}</span>}
          </div>
        ) : (
          <>
            {prefix}{formatNumberWithOptions(count, withThousandSeparator, decimalPlaces)}{suffix}
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default AnimatedCounter;