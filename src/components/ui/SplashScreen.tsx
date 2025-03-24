import React, { useEffect, useState, useMemo } from 'react';
import { motion, Variants, Transition } from 'framer-motion';
import { useTheme } from 'next-themes';
import { FiCode, FiDatabase, FiCpu } from 'react-icons/fi';

// Extended type definition to properly type framer-motion properties
interface ExtendedTransition extends Transition {
  repeat?: number | boolean;
  repeatType?: 'loop' | 'reverse' | 'mirror';
}

const SplashScreen: React.FC = () => {
  const [animationComplete, setAnimationComplete] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  const [randomTech, setRandomTech] = useState('');
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';
  
  // Memoize tech terms to prevent recreation on each render
  const techTerms = useMemo(() => [
    'Python', 'Machine Learning', 'Data Science', 
    'React', 'IoT', 'Big Data', 'AI', 
    'Neural Networks', 'SQL', 'Data Mining'
  ], []);
  
  // Disable body scroll when splash screen is shown
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    // Simulate loading with progress
    const interval = setInterval(() => {
      setProgressValue(prevValue => {
        const newValue = prevValue + (100 - prevValue) / 10;
        return Math.min(newValue, 100);
      });
    }, 100);
    
    // Change tech terms every second
    const techInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * techTerms.length);
      setRandomTech(techTerms[randomIndex]);
    }, 800);
    
    // Start exit animation after 2.5 seconds
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 2500);
    
    return () => {
      document.body.style.overflow = '';
      clearTimeout(timer);
      clearInterval(interval);
      clearInterval(techInterval);
    };
  }, [techTerms]);

  // Animation variants using framer-motion with corrected types
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.2
      } 
    },
    exit: { 
      opacity: 0,
      transition: { 
        // Use string-based easing or single numeric value instead of array
        ease: "easeInOut",
        duration: 0.5
      } 
    }
  };
  
  const logoVariants: Variants = {
    hidden: { 
      scale: 0.5,
      opacity: 0,
      rotateY: 90
    },
    visible: { 
      scale: 1,
      opacity: 1,
      rotateY: 0,
      transition: { 
        type: "spring",
        stiffness: 200,
        damping: 15
      } 
    }
  };
  
  const textVariants: Variants = {
    hidden: { 
      opacity: 0,
      y: 20 
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 25
      } 
    }
  };
  
  const iconVariants: Variants = {
    hidden: { scale: 0, rotate: -30, opacity: 0 },
    visible: { 
      scale: 1,
      rotate: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15
      }
    },
    hover: { 
      scale: 1.2,
      rotate: 5,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div
      className={`fixed inset-0 z-[9999] flex items-center justify-center ${
        isDarkMode ? 'bg-black' : 'bg-white'
      }`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      style={{
        opacity: animationComplete ? 0 : 1,
        pointerEvents: animationComplete ? 'none' : 'auto',
        transition: 'opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1)'
      }}
    >
      <div className="relative flex flex-col items-center">
        {/* Logo Animation */}
        <motion.div
          className={`w-32 h-32 mb-8 rounded-full ${
            isDarkMode 
              ? 'bg-gradient-to-br from-primary-600 via-primary-500 to-accent-500' 
              : 'bg-gradient-to-br from-primary-500 to-accent-500'
          } flex items-center justify-center relative overflow-hidden`}
          variants={logoVariants}
        >
          {/* Animated background with particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-full bg-white/30"
                initial={{ 
                  x: Math.random() * 100 - 50, 
                  y: Math.random() * 100 - 50,
                  opacity: 0.2 + Math.random() * 0.3
                }}
                animate={{ 
                  x: Math.random() * 100 - 50,
                  y: Math.random() * 100 - 50,
                  opacity: 0.1 + Math.random() * 0.3
                }}
                transition={{ 
                  // Use type assertion to handle the extended transition properties
                  ...(({
                    repeat: Infinity,
                    repeatType: "mirror",
                    duration: 3 + Math.random() * 2
                  } as ExtendedTransition))
                }}
              />
            ))}
          </div>
          
          <span 
            className="text-4xl font-bold text-white z-10"
          >
            SA
          </span>
          
          {/* Floating Tech Icons around the logo */}
          <motion.div
            className="absolute w-12 h-12 top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
            variants={iconVariants}
            whileHover="hover"
          >
            <div className="w-10 h-10 rounded-full bg-white/90 dark:bg-black/20 backdrop-blur-sm shadow-lg flex items-center justify-center">
              <FiCode className="text-primary-600 dark:text-primary-400" size={20} />
            </div>
          </motion.div>
          
          <motion.div
            className="absolute w-12 h-12 bottom-0 left-0 -translate-x-1/2 translate-y-1/2"
            variants={iconVariants}
            whileHover="hover"
          >
            <div className="w-10 h-10 rounded-full bg-white/90 dark:bg-black/20 backdrop-blur-sm shadow-lg flex items-center justify-center">
              <FiDatabase className="text-accent-500 dark:text-accent-400" size={20} />
            </div>
          </motion.div>
          
          <motion.div
            className="absolute w-12 h-12 bottom-0 right-0 translate-x-1/2 translate-y-1/2"
            variants={iconVariants}
            whileHover="hover"
          >
            <div className="w-10 h-10 rounded-full bg-white/90 dark:bg-black/20 backdrop-blur-sm shadow-lg flex items-center justify-center">
              <FiCpu className="text-blue-500 dark:text-blue-400" size={20} />
            </div>
          </motion.div>
          
          {/* Orbiting dot */}
          <motion.div 
            className="absolute w-4 h-4 rounded-full bg-white shadow-md"
            initial={{ pathOffset: 0 }}
            animate={{ pathOffset: 1 }}
            transition={{ 
              duration: 2, 
              ease: "linear", 
              // Use type assertion to handle the extended transition properties
              ...(({
                repeat: Infinity
              } as ExtendedTransition))
            }}
            style={{
              offsetPath: "path('M 0, 0 m -60, 0 a 60, 60 0 1, 0 120, 0 a 60, 60 0 1, 0 -120, 0')",
            }}
          />
        </motion.div>
        
        {/* Name and Title */}
        <motion.div
          className="text-center mb-8"
          variants={textVariants}
        >
          <h1 
            className="text-3xl md:text-4xl font-bold mb-2"
          >
            <span className="text-primary-600 dark:text-primary-500">Syahril</span>
            <span className="text-secondary-900 dark:text-white">.dev</span>
          </h1>
          
          <p 
            className="text-sm text-secondary-600 dark:text-secondary-400"
          >
            <span className="inline-block min-h-[20px]">{randomTech || 'AI & Big Data Enthusiast'}</span>
          </p>
        </motion.div>
        
        {/* Loading Progress Bar */}
        <motion.div 
          className="w-64 h-1.5 bg-secondary-200 dark:bg-secondary-800 rounded-full overflow-hidden"
          variants={textVariants}
        >
          <motion.div 
            className="h-full bg-primary-600 dark:bg-primary-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressValue}%` }}
            transition={{ ease: "easeOut" }}
          />
        </motion.div>
        
        {/* Loading Text */}
        <motion.p 
          className="mt-3 text-xs text-secondary-500 dark:text-secondary-400"
          variants={textVariants}
        >
          {progressValue < 100 ? 'Loading Portfolio...' : 'Welcome!'}
        </motion.p>
      </div>
      
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Top right decorative circle */}
        <motion.div 
          className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-primary-500/10 dark:bg-primary-500/5"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        
        {/* Bottom left decorative circle */}
        <motion.div 
          className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-accent-500/10 dark:bg-accent-500/5"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
        />
        
        {/* Small decorative dots */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-primary-500/30 dark:bg-primary-500/20"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ 
              duration: 0.8, 
              delay: 0.5 + Math.random() * 1.5 
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default SplashScreen;