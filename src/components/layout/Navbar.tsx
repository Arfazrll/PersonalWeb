import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiDownload, FiCode, FiTerminal, FiGithub } from 'react-icons/fi';
import { useTheme } from 'next-themes';
import ThemeToggle from '../ui/ThemeToggle';
import { personalInfo } from '@/utils/data';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/#about' },
  { name: 'Experience', path: '/#experience' },
  { name: 'Skills', path: '/#skills' },
  { name: 'Projects', path: '/#projects' },
  { name: 'Contact', path: '/#contact' },
];

const EnhancedNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const navRef = useRef<HTMLElement>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  // Function to determine active section based on scroll position
  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY;
    const winHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;
    
    // Calculate scroll progress percentage
    const scrollPercentage = (scrollPosition / (docHeight - winHeight)) * 100;
    setScrollProgress(scrollPercentage);
    
    // Set navbar background opacity based on scroll
    if (scrollPosition > 10) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
    
    // Find active section
    const sections = document.querySelectorAll('section[id]');
    
    sections.forEach((section) => {
      const sectionTop = (section as HTMLElement).offsetTop - 100;
      const sectionHeight = (section as HTMLElement).offsetHeight;
      const sectionId = section.getAttribute('id') || '';
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        setActiveSection(sectionId);
      }
    });
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    
    // Call once to set initial active section
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Close menu when clicking a link
  const handleLinkClick = () => {
    setIsOpen(false);
  };

  // Animation variants
  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        when: "afterChildren",
      }
    },
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const menuItemVariants = {
    closed: {
      opacity: 0,
      x: -20
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3
      }
    }
  };
  
  // Animation props types workaround
  type SpringTransition = {
    type: string;
    duration: number;
    stiffness: number;
    damping: number;
  };

  // Floating particles effect for navbar
  const renderParticles = () => {
    return Array.from({ length: 8 }).map((_, index) => (
      <div 
        key={index}
        className={`particle absolute rounded-full ${isDark ? 'bg-primary-500/30' : 'bg-primary-500/20'}`}
        style={{
          width: `${Math.random() * 4 + 2}px`,
          height: `${Math.random() * 4 + 2}px`,
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animationDuration: `${Math.random() * 10 + 10}s`,
          animationDelay: `${Math.random() * 5}s`
        }}
      />
    ));
  };

  return (
    <header 
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? `py-3 ${isDark 
            ? 'bg-secondary-900/80 border-b border-secondary-800/50' 
            : 'bg-white/80 border-b border-secondary-100/50'} backdrop-blur-md shadow-lg`
          : 'py-5 bg-transparent'
      }`}
    >
      {/* Scroll progress indicator */}
      <div 
        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500 z-10"
        style={{ width: `${scrollProgress}%`, transition: 'width 0.1s ease-out' }}
      />
      
      {/* Particles background effect */}
      <div className="absolute inset-0 overflow-hidden">
        {renderParticles()}
      </div>
      
      <nav className="container mx-auto px-4 relative">
        <div className="flex justify-between items-center">
          {/* Enhanced Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <Link href="/" className="group flex items-center" aria-label="Home">
              <div className={`${
                isDark 
                  ? 'bg-primary-900/30 text-primary-400' 
                  : 'bg-primary-100 text-primary-600'
              } w-10 h-10 rounded-lg flex items-center justify-center mr-3 transition-transform group-hover:scale-110 duration-300`}>
                <FiTerminal size={20} className="group-hover:animate-pulse" aria-hidden="true" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-600 dark:from-primary-400 dark:to-accent-400">
                  Syahril
                </span>
                <span className={`text-xs ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  AI & Data Specialist
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navLinks.map((link, index) => {
              const isActive = activeSection === link.path.replace('/#', '') || 
                        (activeSection === 'home' && link.path === '/');
              
              return (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="relative"
                >
                  <Link 
                    href={link.path}
                    className={`nav-link block py-2 px-3 rounded-md relative transition-all duration-300 hover:text-primary-600 dark:hover:text-primary-400 ${
                      isActive 
                        ? 'text-primary-600 dark:text-primary-400' 
                        : `${isDark ? 'text-gray-300' : 'text-gray-700'}`
                    }`}
                    onClick={handleLinkClick}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <span className="relative z-10">{link.name}</span>
                    
                    {/* Animated background for active link */}
                    {isActive && (
                      <motion.span 
                        className={`absolute inset-0 rounded-md ${
                          isDark ? 'bg-primary-900/30' : 'bg-primary-50'
                        } -z-0`}
                        layoutId="activeNavBackground"
                        transition={{ type: 'spring', duration: 0.6, stiffness: 200, damping: 25 } as SpringTransition}
                      />
                    )}
                  </Link>
                </motion.div>
              );
            })}
            
            {/* Enhanced Resume Button */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <a 
                href={personalInfo.resumeLink}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center px-4 py-2 rounded-md overflow-hidden ${
                  isDark 
                    ? 'bg-primary-900/30 text-primary-400 hover:bg-primary-800/50' 
                    : 'bg-primary-50 text-primary-600 hover:bg-primary-100'
                } transition-all duration-300 relative group`}
                download
              >
                <span className="relative z-10 flex items-center">
                  <FiDownload className="mr-2" size={16} />
                  <span>Resume</span>
                </span>
                
                {/* Interactive hover effect */}
                <span className="absolute inset-0 h-full w-full bg-gradient-to-r from-primary-600 to-accent-500 scale-x-0 transition-transform duration-300 origin-left group-hover:scale-x-100 -z-0" />
                <span className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle,_rgba(255,255,255,0.2)_0%,_transparent_70%)]" />
              </a>
            </motion.div>
            
            {/* GitHub Link */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.5 }}
              whileHover={{ scale: 1.1, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
              className="flex items-center"
            >
              <a 
                href={personalInfo.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-full ${
                  isDark 
                    ? 'bg-gray-800 text-gray-300 hover:bg-primary-900/30 hover:text-primary-400' 
                    : 'bg-gray-100 text-gray-700 hover:bg-primary-50 hover:text-primary-600'
                } transition-all duration-300`}
                aria-label="GitHub Profile"
              >
                <FiGithub size={18} />
              </a>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <ThemeToggle />
            </motion.div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center space-x-4 md:hidden">
            <a 
              href={personalInfo.socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 rounded-full ${
                isDark 
                  ? 'bg-gray-800 text-gray-300 hover:bg-primary-900/30 hover:text-primary-400' 
                  : 'bg-gray-100 text-gray-700 hover:bg-primary-50 hover:text-primary-600'
              } transition-all duration-300`}
              aria-label="GitHub Profile"
            >
              <FiGithub size={18} />
            </a>
            
            <ThemeToggle />
            
            <motion.button
              className={`p-2 rounded-md ${
                isDark 
                  ? 'bg-gray-800 text-gray-300 hover:bg-primary-900/30 hover:text-primary-400' 
                  : 'bg-gray-100 text-gray-700 hover:bg-primary-50 hover:text-primary-600'
              } transition-all duration-300`}
              onClick={toggleMenu}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isOpen ? (
                <FiX size={20} aria-hidden="true" />
              ) : (
                <FiMenu size={20} aria-hidden="true" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Enhanced Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              id="mobile-menu"
              initial="closed"
              animate="open"
              exit="closed"
              variants={mobileMenuVariants}
              className="md:hidden mt-4 overflow-hidden"
            >
              <motion.div 
                className={`rounded-lg ${
                  isDark 
                    ? 'bg-secondary-800/90 border border-secondary-700' 
                    : 'bg-white/90 border border-gray-100'
                } backdrop-blur-md shadow-xl p-4 space-y-3`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {navLinks.map((link, index) => {
                  const isActive = activeSection === link.path.replace('/#', '') || 
                    (activeSection === 'home' && link.path === '/');
                    
                  return (
                    <motion.div
                      key={link.path}
                      variants={menuItemVariants}
                      className="block"
                    >
                      <Link 
                        href={link.path}
                        className={`py-3 px-4 rounded-md flex items-center ${
                          isActive
                            ? `${isDark 
                              ? 'bg-primary-900/30 text-primary-400' 
                              : 'bg-primary-50 text-primary-600'}`
                            : `${isDark 
                              ? 'text-gray-300 hover:bg-gray-700/50' 
                              : 'text-gray-700 hover:bg-gray-50'}`
                        } transition-all duration-300`}
                        onClick={handleLinkClick}
                      >
                        {index === 0 && <FiCode className="mr-3" size={18} />}
                        {link.name}
                        
                        {isActive && (
                          <motion.span 
                            className={`ml-auto w-2 h-2 rounded-full ${
                              isDark ? 'bg-primary-400' : 'bg-primary-600'
                            }`}
                            layoutId="activeNavDot"
                            transition={{ duration: 0.3 }}
                          />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
                
                <motion.div 
                  variants={menuItemVariants} 
                  className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
                >
                  <a 
                    href={personalInfo.resumeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center w-full py-3 px-4 rounded-md ${
                      isDark 
                        ? 'bg-primary-900/30 text-primary-400 hover:bg-primary-800/50' 
                        : 'bg-primary-50 text-primary-600 hover:bg-primary-100'
                    } transition-all duration-300 relative group overflow-hidden`}
                    download
                    onClick={handleLinkClick}
                  >
                    <span className="relative z-10 flex items-center">
                      <FiDownload className="mr-2" size={18} />
                      <span>Download Resume</span>
                    </span>
                    
                    {/* Interactive hover effect */}
                    <span className="absolute inset-0 h-full w-full bg-gradient-to-r from-primary-600 to-accent-500 scale-x-0 transition-transform duration-300 origin-left group-hover:scale-x-100 -z-0" />
                    <span className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle,_rgba(255,255,255,0.2)_0%,_transparent_70%)]" />
                  </a>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* CSS for floating particles */}
      <style jsx>{`
        /* Particle animations */
        .particle {
          position: absolute;
          z-index: 0;
          animation: float 15s infinite ease-in-out;
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0.5;
          }
          25% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.8;
          }
          50% {
            transform: translateY(-10px) translateX(20px);
            opacity: 0.6;
          }
          75% {
            transform: translateY(10px) translateX(-15px);
            opacity: 0.7;
          }
        }
        
        /* Data packet animation */
        .data-packet {
          animation: slidePacket linear infinite;
        }
        
        @keyframes slidePacket {
          0% {
            transform: translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateX(calc(100vw + 50px));
            opacity: 0;
          }
        }
        
        /* Wave pulse animation */
        .wave-pulse {
          width: 100px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(59, 130, 246, 0.3) 0%,
            rgba(59, 130, 246, 0) 70%
          );
          animation: pulsate linear infinite;
        }
        
        @keyframes pulsate {
          0% {
            transform: translateX(-100px) scale(0.2);
            opacity: 0;
          }
          20% {
            opacity: 0.5;
          }
          70% {
            opacity: 0.2;
          }
          100% {
            transform: translateX(calc(100vw + 100px)) scale(1);
            opacity: 0;
          }
        }
        
        /* Digital noise animation */
        .digital-noise {
          animation: flicker steps(1) infinite;
        }
        
        @keyframes flicker {
          0%, 100% {
            opacity: 0;
          }
          50% {
            opacity: 0.8;
          }
        }
      `}</style>
    </header>
  );
};

export default EnhancedNavbar;