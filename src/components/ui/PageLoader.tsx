import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PageLoaderProps {
  /**
   * Custom text to display during loading
   */
  loadingText?: string;
  
  /**
   * Show percentage completion
   */
  showPercentage?: boolean;
  
  /**
   * Customize loading theme color
   */
  themeColor?: string;
  
  /**
   * Secondary color for gradient effects
   */
  secondaryColor?: string;
  
  /**
   * Control whether the loader is shown
   */
  isLoading?: boolean;
  
  /**
   * Animation style
   */
  animationStyle?: 'pulse' | 'rotate' | 'bounce' | 'wave' | 'particles' | 'morphing';
  
  /**
   * Automatically hide the loader after X ms (0 means never auto-hide)
   */
  autoHideAfter?: number;
  
  /**
   * Use a minimalist design
   */
  minimal?: boolean;
  
  /**
   * Custom logo/icon (ReactNode)
   */
  customIcon?: React.ReactNode;
  
  /**
   * Letter or character displayed in the center
   */
  logoLetter?: string;
  
  /**
   * Callback when loader is complete
   */
  onLoadComplete?: () => void;
  
  /**
   * Show loading tips
   */
  showTips?: boolean;
  
  /**
   * Custom loading tips
   */
  customTips?: string[];
  
  /**
   * Glass morphism effect
   */
  glassMorphism?: boolean;
}

const PageLoader: React.FC<PageLoaderProps> = ({
  loadingText = 'Loading...',
  showPercentage = true,
  themeColor,
  secondaryColor,
  isLoading = true,
  animationStyle = 'pulse',
  autoHideAfter = 0,
  minimal = false,
  customIcon,
  logoLetter = 'S',
  onLoadComplete,
  showTips = false,
  customTips,
  glassMorphism = true
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [currentTip, setCurrentTip] = useState(0);
  const loadingInterval = useRef<NodeJS.Timeout | null>(null);
  const autoHideTimeout = useRef<NodeJS.Timeout | null>(null);
  const tipInterval = useRef<NodeJS.Timeout | null>(null);
  
  // Default loading tips
  const defaultTips = [
    "Menyiapkan konten untuk Anda...",
    "Hampir selesai, sebentar lagi...",
    "Memuat data terbaru...",
    "Mengoptimalkan pengalaman pengguna...",
    "Menyesuaikan tampilan untuk Anda..."
  ];
  
  const tips = customTips || defaultTips;
  
  // Create particles for particle animation
  const particles = Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    size: Math.floor(Math.random() * 4) + 2, // 2-6px
    x: Math.random() * 100 - 50, // -50 to 50
    y: Math.random() * 100 - 50, // -50 to 50
    delay: Math.random() * 1
  }));
  
  // Get theme color with fallback
  const getThemeColor = () => {
    if (themeColor) return themeColor;
    // Default theme color using CSS variable (supports dark mode)
    return 'var(--color-primary-500, #3B82F6)';
  };
  
  // Get secondary color with fallback
  const getSecondaryColor = () => {
    if (secondaryColor) return secondaryColor;
    // Default secondary color (complementary to primary)
    return 'var(--color-accent-500, #EC4899)';
  };
  
  // Handle tips rotation
  useEffect(() => {
    if (showTips && isVisible && tips.length > 1) {
      tipInterval.current = setInterval(() => {
        setCurrentTip(prev => (prev + 1) % tips.length);
      }, 3500);
    }
    
    return () => {
      if (tipInterval.current) clearInterval(tipInterval.current);
    };
  }, [showTips, isVisible, tips.length]);
  
  // Handle initial fade-in and progress animation
  useEffect(() => {
    if (!isLoading) {
      cleanupAndHide();
      return;
    }
    
    // Set a small delay before showing to allow for transition
    const visibilityTimer = setTimeout(() => {
      setIsVisible(true);
    }, 10);
    
    // Realistic progress simulation
    loadingInterval.current = setInterval(() => {
      setProgress(prev => {
        let increment;
        if (prev < 60) {
          increment = (90 - prev) / 12; // Faster initially
        } else if (prev < 90) {
          increment = (97 - prev) / 20; // Slower in the middle
        } else {
          increment = (99.5 - prev) / 30; // Very slow at the end
        }
        
        const newProgress = prev + increment;
        
        // Auto-complete near 100% after a reasonable time
        if (prev > 95 && Math.random() > 0.7) {
          setIsComplete(true);
          if (onLoadComplete) onLoadComplete();
          return 100;
        }
        
        return Math.min(newProgress, 99.5);
      });
    }, 100);
    
    // Auto-hide functionality
    if (autoHideAfter > 0) {
      autoHideTimeout.current = setTimeout(() => {
        setProgress(100);
        setIsComplete(true);
        if (onLoadComplete) onLoadComplete();
        
        setTimeout(() => {
          setIsVisible(false);
        }, 500);
      }, autoHideAfter);
    }
    
    return cleanupAndHide;
    
    function cleanupAndHide() {
      clearTimeout(visibilityTimer);
      if (loadingInterval.current) clearInterval(loadingInterval.current);
      if (autoHideTimeout.current) clearTimeout(autoHideTimeout.current);
    }
  }, [isLoading, autoHideAfter, onLoadComplete]);
  
  // Handle completion effect
  useEffect(() => {
    if (isComplete) {
      // Fade out after completion
      const completeTimer = setTimeout(() => {
        setIsVisible(false);
      }, 800);
      
      return () => clearTimeout(completeTimer);
    }
  }, [isComplete]);
  
  // Advanced animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      } 
    },
    exit: { 
      opacity: 0,
      transition: { 
        duration: 0.3,
        when: "afterChildren",
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 24
      }
    },
    exit: { 
      y: -20, 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };
  
  // Background blur effect
  const backdropStyle = glassMorphism ? {
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)'
  } : {};
  
  // For minimal design
  if (minimal) {
    return (
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`fixed bottom-6 right-6 z-[9999] rounded-lg shadow-lg overflow-hidden p-4 flex items-center space-x-3 ${
              glassMorphism 
                ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-white/20 dark:border-gray-700/20' 
                : 'bg-white dark:bg-gray-800'
            }`}
            style={{ 
              opacity: isVisible ? 1 : 0,
              transition: 'opacity 0.3s ease-in-out',
              maxWidth: loadingText ? '220px' : '60px'
            }}
          >
            {/* Minimal spinner with gradient border */}
            <div className="relative">
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <defs>
                  <linearGradient id="spinner-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={getThemeColor()} />
                    <stop offset="100%" stopColor={getSecondaryColor()} />
                  </linearGradient>
                </defs>
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path
                  className="animate-spin origin-center"
                  d="M12 2C6.48 2 2 6.48 2 12c0 2.8 1.12 5.3 2.92 7.14"
                  stroke="url(#spinner-gradient)" 
                  strokeWidth="4" 
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </div>
            
            {/* Text content with animated dots */}
            {loadingText && (
              <div className="flex flex-col">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-200 overflow-hidden whitespace-nowrap">
                  {loadingText}
                  <span className="inline-block w-6 overflow-hidden animate-pulse-subtle">
                    <span className="inline-block">..</span>
                  </span>
                </div>
                
                {showPercentage && (
                  <div className="text-xs text-primary-600 dark:text-primary-400 font-semibold mt-0.5">
                    {Math.round(progress)}% complete
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
  
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          exit="exit"
          className={`fixed inset-0 z-[9999] flex items-center justify-center ${
            glassMorphism 
              ? 'bg-white/90 dark:bg-gray-900/90' 
              : 'bg-white dark:bg-gray-900'
          }`}
          style={{
            ...backdropStyle,
            opacity: isVisible ? 1 : 0,
            pointerEvents: isVisible ? 'auto' : 'none',
            transition: 'opacity 0.3s ease-in-out'
          }}
        >
          {/* Background decoration elements */}
          {animationStyle === 'particles' && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {particles.map(particle => (
                <div
                  key={particle.id}
                  className="absolute rounded-full animate-float-random opacity-20"
                  style={{
                    width: `${particle.size}px`,
                    height: `${particle.size}px`,
                    backgroundColor: particle.id % 2 === 0 ? getThemeColor() : getSecondaryColor(),
                    left: `calc(50% + ${particle.x}px)`,
                    top: `calc(50% + ${particle.y}px)`,
                    animationDelay: `${particle.delay}s`,
                    animationDuration: `${3 + particle.delay * 2}s`
                  }}
                />
              ))}
            </div>
          )}
          
          <div className="flex flex-col items-center relative">
            {/* Gradient decoration */}
            <div 
              className="absolute -z-10 rounded-full blur-3xl opacity-10 dark:opacity-20 animate-pulse-very-slow"
              style={{
                width: '300px',
                height: '300px',
                background: `radial-gradient(circle, ${getThemeColor()} 0%, ${getSecondaryColor()} 70%, transparent 100%)`,
                top: '-100px',
                left: '-150px',
              }}
            />
            
            <div 
              className="absolute -z-10 rounded-full blur-3xl opacity-10 dark:opacity-20 animate-pulse-slow"
              style={{
                width: '250px',
                height: '250px',
                background: `radial-gradient(circle, ${getSecondaryColor()} 0%, ${getThemeColor()} 70%, transparent 100%)`,
                bottom: '-80px',
                right: '-100px',
                animationDelay: '1s'
              }}
            />
          
            {/* Logo spinner */}
            <motion.div 
              variants={itemVariants}
              className="relative"
            >
              {/* Outer ring - Dynamic based on animation style */}
              <div className="w-24 h-24 relative">
                {/* Rotating gradient ring */}
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={getThemeColor()} />
                      <stop offset="100%" stopColor={getSecondaryColor()} />
                    </linearGradient>
                    
                    {animationStyle === 'morphing' && (
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                        <feMerge>
                          <feMergeNode in="coloredBlur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    )}
                  </defs>
                  
                  {/* Background circle */}
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="45" 
                    fill="none" 
                    stroke="rgba(200,200,200,0.1)"
                    strokeWidth="2"
                  />
                  
                  {animationStyle === 'morphing' ? (
                    /* Morphing path */
                    <path
                      d="M50,5 
                         A45,45 0 0,1 95,50 
                         A45,45 0 0,1 50,95 
                         A45,45 0 0,1 5,50 
                         A45,45 0 0,1 50,5 
                         Z"
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="3"
                      filter="url(#glow)"
                      className="animate-morph"
                    />
                  ) : (
                    /* Regular animated circle with dash */
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="45" 
                      fill="none" 
                      stroke="url(#gradient)"
                      strokeWidth="3"
                      strokeDasharray="283"
                      strokeDashoffset="0"
                      className={`
                        ${animationStyle === 'rotate' ? 'animate-spin-slow' : ''}
                        ${animationStyle === 'pulse' ? 'animate-dash-pulse' : ''}
                        ${animationStyle === 'bounce' ? 'animate-dash-bounce' : ''}
                        ${animationStyle === 'wave' || animationStyle === 'particles' ? 'animate-dash-wave' : ''}
                      `}
                      strokeLinecap="round"
                    />
                  )}
                  
                  {/* Moving dot along the path */}
                  {animationStyle !== 'morphing' && (
                    <circle 
                      cx="50" 
                      cy="5" 
                      r="5" 
                      fill={getSecondaryColor()}
                      className="animate-move-along-path"
                      filter="url(#glow)"
                    />
                  )}
                </svg>
                
                {/* Dynamic dots for certain animation styles */}
                {(animationStyle === 'bounce' || animationStyle === 'wave') && (
                  <div className="absolute inset-0 w-full h-full">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div
                        key={i}
                        className={`absolute w-3 h-3 rounded-full ${
                          animationStyle === 'bounce' ? 'animate-bounce-staggered' : 'animate-ping-staggered'
                        }`}
                        style={{
                          backgroundColor: i % 2 === 0 ? getThemeColor() : getSecondaryColor(),
                          top: i === 0 ? '0' : i === 1 ? '50%' : i === 2 ? 'auto' : '50%',
                          bottom: i === 2 ? '0' : 'auto',
                          left: i === 3 ? '0' : i === 1 ? 'auto' : '50%',
                          right: i === 1 ? '0' : 'auto',
                          transform: 'translate(-50%, -50%)',
                          animationDelay: `${i * 0.2}s`
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
              
              {/* Center logo or custom icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                {customIcon ? (
                  <div className="w-10 h-10 flex items-center justify-center">
                    {customIcon}
                  </div>
                ) : (
                  <div
                    className={`
                      w-12 h-12 rounded-full flex items-center justify-center 
                      ${glassMorphism ? 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/20' : 'bg-white dark:bg-gray-800'} 
                      shadow-lg
                    `}
                  >
                    <span 
                      className={`text-lg font-bold animate-pulse-gentle ${
                        animationStyle === 'morphing' ? 'animate-text-gradient' : ''
                      }`}
                      style={{ 
                        color: animationStyle === 'morphing' ? 'transparent' : getThemeColor(),
                        backgroundImage: animationStyle === 'morphing' ? `linear-gradient(90deg, ${getThemeColor()}, ${getSecondaryColor()}, ${getThemeColor()})` : 'none',
                        backgroundSize: '200% auto',
                        WebkitBackgroundClip: animationStyle === 'morphing' ? 'text' : 'unset',
                        backgroundClip: animationStyle === 'morphing' ? 'text' : 'unset'
                      }}
                    >
                      {logoLetter}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
            
            {/* Loading text with animation */}
            <motion.div
              variants={itemVariants}
              className="mt-8 text-center"
            >
              <AnimatePresence>
                <motion.p
                  key={`loading-${currentTip}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="text-base text-gray-600 dark:text-gray-300 font-medium mb-1"
                >
                  {loadingText}
                </motion.p>
              </AnimatePresence>
              
              {/* Tips display */}
              {showTips && (
                <AnimatePresence>
                  <motion.p
                    key={`tip-${currentTip}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="text-sm text-gray-500 dark:text-gray-400 italic"
                  >
                    {tips[currentTip]}
                  </motion.p>
                </AnimatePresence>
              )}
              
              {/* Percentage display */}
              {showPercentage && (
                <div className="flex justify-center items-center mt-2">
                  <span 
                    className="text-sm font-semibold"
                    style={{ color: getThemeColor() }}
                  >
                    {Math.round(progress)}%
                  </span>
                </div>
              )}
            </motion.div>
            
            {/* Loading bar with enhanced animations */}
            <motion.div 
              variants={itemVariants}
              className={`
                mt-5 w-64 h-1.5 rounded-full overflow-hidden
                ${glassMorphism ? 'bg-gray-200/40 dark:bg-gray-700/40' : 'bg-gray-200 dark:bg-gray-700'}
              `}
            >
              {/* Progress bar with gradient */}
              <div 
                className="h-full rounded-full relative overflow-hidden"
                style={{
                  width: `${progress}%`,
                  transition: 'width 0.3s ease-out'
                }}
              >
                {/* Gradient background */}
                <div 
                  className="absolute inset-0 animate-gradient-x"
                  style={{
                    background: `linear-gradient(90deg, ${getThemeColor()}, ${getSecondaryColor()}, ${getThemeColor()})`,
                    backgroundSize: '200% auto'
                  }}
                />
                
                {/* Shimmer effect */}
                <div className="absolute inset-0 animate-shimmer" />
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
      
      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes pulse-gentle {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.1); opacity: 1; }
        }
        
        @keyframes pulse-very-slow {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.2); opacity: 0.5; }
        }
        
        @keyframes pulse-subtle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        @keyframes morph {
          0%, 100% {
            d: "M50,5 A45,45 0 0,1 95,50 A45,45 0 0,1 50,95 A45,45 0 0,1 5,50 A45,45 0 0,1 50,5 Z";
          }
          25% {
            d: "M50,5 A40,50 0 0,1 95,50 A40,50 0 0,1 50,95 A40,50 0 0,1 5,50 A40,50 0 0,1 50,5 Z";
          }
          50% {
            d: "M50,5 A50,40 0 0,1 95,50 A50,40 0 0,1 50,95 A50,40 0 0,1 5,50 A50,40 0 0,1 50,5 Z";
          }
          75% {
            d: "M50,5 A42,48 0 0,1 95,50 A42,48 0 0,1 50,95 A42,48 0 0,1 5,50 A42,48 0 0,1 50,5 Z";
          }
        }
        
        @keyframes dash-pulse {
          0%, 100% { stroke-dashoffset: 0; }
          50% { stroke-dashoffset: 40; }
        }
        
        @keyframes dash-bounce {
          0%, 100% { stroke-dashoffset: 0; }
          50% { stroke-dashoffset: 80; }
        }
        
        @keyframes dash-wave {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: 566; } /* 283 * 2 */
        }
        
        @keyframes move-along-path {
          0% { transform: rotate(0deg) translateX(45px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(45px) rotate(-360deg); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(100%) skewX(-15deg); }
        }
        
        @keyframes float-random {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-30px) translateX(15px); }
          50% { transform: translateY(-15px) translateX(30px); }
          75% { transform: translateY(20px) translateX(-20px); }
        }
        
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes bounce-staggered {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.2); }
        }
        
        @keyframes ping-staggered {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          75%, 100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
        }
        
        @keyframes text-gradient {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
        
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        
        .animate-pulse-gentle {
          animation: pulse-gentle 2s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        
        .animate-pulse-very-slow {
          animation: pulse-very-slow 6s ease-in-out infinite;
        }
        
        .animate-pulse-subtle {
          animation: pulse-subtle 1.5s ease-in-out infinite;
        }
        
        .animate-morph {
          animation: morph 8s ease-in-out infinite;
        }
        
        .animate-dash-pulse {
          animation: dash-pulse 3s ease-in-out infinite;
        }
        
        .animate-dash-bounce {
          animation: dash-bounce 1.5s cubic-bezier(.5, 0, .5, 1) infinite;
        }
        
        .animate-dash-wave {
          animation: dash-wave 15s linear infinite;
        }
        
        .animate-move-along-path {
          animation: move-along-path 4s linear infinite;
        }
        
        .animate-shimmer {
          animation: shimmer 2s linear infinite;
          background: linear-gradient(
            90deg, 
            rgba(255, 255, 255, 0) 0%, 
            rgba(255, 255, 255, 0.4) 50%, 
            rgba(255, 255, 255, 0) 100%
          );
        }
        
        .animate-gradient-x {
          animation: gradient-x 3s linear infinite;
        }
        
        .animate-text-gradient {
          animation: text-gradient 3s linear infinite;
        }
      `}</style>
    </AnimatePresence>
  );
};

export default PageLoader;