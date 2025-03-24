import { useState, useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import { FiSun, FiMoon, FiMonitor, FiSettings } from 'react-icons/fi';

const ThemeToggle: React.FC = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showRipple, setShowRipple] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Once mounted, we can show the toggle
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder with the same dimensions to prevent layout shift
    return <div className="w-10 h-10 rounded-full"></div>; 
  }

  const currentTheme = theme === 'system' ? resolvedTheme : theme;
  
  const toggleTheme = (newTheme: string) => {
    setTheme(newTheme);
    setIsOpen(false);
    
    // Create ripple effect when changing theme
    setShowRipple(true);
    setTimeout(() => setShowRipple(false), 800);
  };

  // Animation variants for icon switch
  const sunIconVariants = {
    inactive: { 
      scale: 0,
      rotate: -90,
      opacity: 0
    },
    active: { 
      scale: 1, 
      rotate: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 15 }
    }
  };

  const moonIconVariants = {
    inactive: { 
      scale: 0,
      rotate: 90,
      opacity: 0 
    },
    active: { 
      scale: 1, 
      rotate: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 15 }
    }
  };

  // Get background gradient based on theme
  const getButtonGradient = () => {
    if (currentTheme === 'dark') {
      return 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 dark:from-blue-900/30 dark:to-purple-900/30';
    }
    return 'bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        aria-label={`Current theme: ${currentTheme}`}
        className={`w-10 h-10 rounded-full flex items-center justify-center ${getButtonGradient()} shadow-md dark:shadow-lg dark:shadow-black/30 relative overflow-hidden z-10 border border-secondary-200 dark:border-secondary-800`}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Sun icon - show when in light mode */}
        <motion.div
          className="absolute"
          variants={sunIconVariants}
          initial="inactive"
          animate={currentTheme === 'light' ? 'active' : 'inactive'}
        >
          <FiSun className="text-yellow-500" size={20} />
        </motion.div>
        
        {/* Moon icon - show when in dark mode */}
        <motion.div
          className="absolute"
          variants={moonIconVariants}
          initial="inactive"
          animate={currentTheme === 'dark' ? 'active' : 'inactive'}
        >
          <FiMoon className="text-blue-400" size={20} />
        </motion.div>
        
        {/* System icon - show when in system mode */}
        <motion.div
          className="absolute"
          variants={moonIconVariants} // Reuse the same animation
          initial="inactive"
          animate={theme === 'system' ? 'active' : 'inactive'}
        >
          <FiMonitor className="text-green-500 dark:text-green-400" size={18} />
        </motion.div>
        
        {/* Ripple animation when changing theme */}
        {showRipple && (
          <span 
            className="absolute w-full h-full bg-white dark:bg-secondary-800 rounded-full" 
            style={{
              animation: 'ripple 0.8s ease-out',
              opacity: 0,
            }}
          />
        )}
      </motion.button>
      
      {/* Dropdown menu with enhanced animations */}
      <motion.div
        className="absolute right-0 mt-2 w-56 bg-white dark:bg-secondary-800 rounded-xl shadow-xl overflow-hidden z-50 border border-secondary-200 dark:border-secondary-700"
        initial={{ opacity: 0, scale: 0.9, y: -5 }}
        animate={{
          opacity: isOpen ? 1 : 0,
          scale: isOpen ? 1 : 0.9,
          y: isOpen ? 0 : -5,
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
        transition={{ 
          duration: 0.2, 
          ease: [0.23, 1, 0.32, 1]
        }}
      >
        <div className="p-2 flex flex-col gap-1">
          <motion.button
            className={`w-full text-left px-4 py-3 flex items-center ${
              currentTheme === 'light' ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium' : 'text-secondary-700 dark:text-secondary-300'
            } hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-lg transition-colors`}
            onClick={() => toggleTheme('light')}
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.98 }}
          >
            <div 
              className="w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex justify-center items-center mr-3"
            >
              <FiSun size={18} className={currentTheme === 'light' ? 'text-yellow-500' : 'text-yellow-400'} />
            </div>
            <div>
              <span className="font-medium text-sm">Light Mode</span>
              <p className="text-xs text-secondary-500 dark:text-secondary-400">Bright and clean interface</p>
            </div>
          </motion.button>
          
          <motion.button
            className={`w-full text-left px-4 py-3 flex items-center ${
              currentTheme === 'dark' ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium' : 'text-secondary-700 dark:text-secondary-300'
            } hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-lg transition-colors`}
            onClick={() => toggleTheme('dark')}
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.98 }}
          >
            <div 
              className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex justify-center items-center mr-3"
            >
              <FiMoon size={18} className={currentTheme === 'dark' ? 'text-blue-400' : 'text-blue-500'} />
            </div>
            <div>
              <span className="font-medium text-sm">Dark Mode</span>
              <p className="text-xs text-secondary-500 dark:text-secondary-400">Easy on the eyes at night</p>
            </div>
          </motion.button>
          
          <motion.button
            className={`w-full text-left px-4 py-3 flex items-center ${
              theme === 'system' ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium' : 'text-secondary-700 dark:text-secondary-300'
            } hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-lg transition-colors`}
            onClick={() => toggleTheme('system')}
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.98 }}
          >
            <div 
              className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex justify-center items-center mr-3"
            >
              <FiMonitor size={18} className={theme === 'system' ? 'text-green-500 dark:text-green-400' : 'text-green-500'} />
            </div>
            <div>
              <span className="font-medium text-sm">System</span>
              <p className="text-xs text-secondary-500 dark:text-secondary-400">Follows your device settings</p>
            </div>
          </motion.button>
        </div>
        
        {/* Extra theme settings hint at bottom */}
        <div className="border-t border-secondary-100 dark:border-secondary-700 p-3">
          <div className="flex items-center text-xs text-secondary-500 dark:text-secondary-400">
            <FiSettings size={12} className="mr-1.5" />
            <span>More theme options coming soon</span>
          </div>
        </div>
      </motion.div>
      
      {/* CSS Animations */}
      <style jsx>{`
        @keyframes ripple {
          0% {
            transform: scale(0);
            opacity: 0.5;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default ThemeToggle;