// src/components/layout/Header.tsx
import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { FiMenu, FiX, FiCode, FiTerminal } from 'react-icons/fi';
import ThemeToggle from '../ui/ThemeToggle';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/#about' },
  { name: 'Experience', path: '/#experience' },
  { name: 'Skills', path: '/#skills' },
  { name: 'Projects', path: '/#projects' },
  { name: 'Contact', path: '/#contact' },
];

interface HeaderProps {
  scrolled: boolean;
}

const EnhancedHeader: React.FC<HeaderProps> = ({ scrolled }) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const headerRef = useRef<HTMLElement>(null);
  
  // Handle mouse move for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  // Calculate scroll progress and update active section
  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY;
    const winHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;
    
    // Calculate scroll progress percentage
    const scrollPercentage = (scrollPosition / (docHeight - winHeight)) * 100;
    setScrollProgress(scrollPercentage);
    
    // Determine scroll direction and toggle header visibility
    // Don't hide header at the top of the page or when mobile menu is open
    if (scrollPosition > 100 && !isOpen) {
      // Scrolling down
      if (scrollPosition > lastScrollY + 10) {
        setIsVisible(false);
      }
      // Scrolling up
      else if (scrollPosition < lastScrollY - 10) {
        setIsVisible(true);
      }
    } else {
      setIsVisible(true);
    }
    setLastScrollY(scrollPosition);
    
    // Find active section
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    
    sections.forEach((section) => {
      const sectionTop = (section as HTMLElement).offsetTop - 100;
      const sectionHeight = (section as HTMLElement).offsetHeight;
      const sectionId = section.getAttribute('id') || '';
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = sectionId;
      }
    });
    
    // Default to 'home' if no section is active (top of page)
    if (current) {
      setActiveSection(current);
    } else if (scrollPosition < 100) {
      setActiveSection('home');
    }
  }, [lastScrollY, isOpen]);
  
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial call to set values
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    // Always show header when toggling menu
    setIsVisible(true);
  };

  // Floating particles effect for header
  const renderParticles = () => {
    return Array.from({ length: 6 }).map((_, index) => (
      <div 
        key={index}
        className={`particle absolute rounded-full ${isDark ? 'bg-primary-500/30' : 'bg-primary-500/15'}`}
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
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 transform ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      } ${
        scrolled 
          ? `py-3 ${isDark 
            ? 'bg-true-black/80 border-b border-gray-800/50' 
            : 'bg-white/80 border-b border-gray-100/50'} backdrop-blur-md` 
          : 'py-5 bg-transparent'
      }`}
    >
      {/* Scroll progress indicator */}
      <div 
        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500 z-10"
        style={{ width: `${scrollProgress}%`, transition: 'width 0.1s ease-out' }}
      />

      {/* Decorative separator at the bottom of the header */}
      <div className="absolute -bottom-[1px] left-0 right-0 z-10 h-[3px] overflow-hidden">
        {/* Circuit board dots - scattered throughout the width */}
        <div className="relative w-full">
          {Array.from({ length: 30 }).map((_, i) => (
            <div 
              key={`circuit-dot-${i}`}
              className={`absolute rounded-full ${isDark ? 'bg-primary-500' : 'bg-primary-400'} animate-pulse`} 
              style={{
                width: i % 3 === 0 ? '2px' : '1px',
                height: i % 3 === 0 ? '2px' : '1px',
                opacity: (i % 3 === 0 ? 0.6 : 0.3),
                left: `${(i * 3.33) + Math.random() * 2}%`,
                top: Math.random() > 0.5 ? '0px' : '1px',
                animationDuration: `${3 + Math.random() * 2}s`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>
        
        {/* Data packet animations - moving across the separator */}
        <div className="relative w-full h-full">
          {Array.from({ length: 5 }).map((_, i) => (
            <div 
              key={`data-packet-${i}`}
              className={`absolute h-[2px] data-packet ${
                isDark ? 'bg-primary-400' : 'bg-primary-500'
              }`}
              style={{
                width: `${10 + Math.random() * 15}px`,
                top: '0px',
                left: '-20px',
                opacity: 0.8,
                animationDuration: `${3 + Math.random() * 4}s`,
                animationDelay: `${i * 0.7}s`,
                animationIterationCount: 'infinite'
              }}
            />
          ))}
        </div>
        
        {/* Pulse wave animation that travels across the separator */}
        <div className="relative w-full h-full">
          {Array.from({ length: 3 }).map((_, i) => (
            <div 
              key={`wave-pulse-${i}`}
              className="absolute top-0 left-0 h-full wave-pulse"
              style={{
                animationDuration: `${7 + i * 2}s`,
                animationDelay: `${i * 2}s`,
                animationIterationCount: 'infinite'
              }}
            />
          ))}
        </div>
        
        {/* Digital noise effect */}
        <div className="relative w-full h-full">
          {Array.from({ length: 15 }).map((_, i) => (
            <div 
              key={`noise-bit-${i}`}
              className={`absolute digital-noise ${
                isDark ? 'bg-accent-400' : 'bg-accent-500'
              }`}
              style={{
                width: '1px',
                height: '1px',
                left: `${(i * 6.67) + Math.random() * 5}%`,
                top: Math.random() > 0.5 ? '0px' : '1px',
                opacity: 0,
                animationDuration: `${0.5 + Math.random() * 1}s`,
                animationDelay: `${i * 0.2}s`,
                animationIterationCount: 'infinite'
              }}
            />
          ))}
        </div>
        
        {/* Subtle gradient glow */}
        <div 
          className={`absolute inset-0 ${
            isDark 
              ? 'from-primary-700/10 via-primary-500/20 to-accent-500/10' 
              : 'from-primary-300/10 via-primary-400/30 to-accent-400/10'
          } bg-gradient-to-r blur-[1px]`}
        ></div>
      </div>
      
      {/* Subtle shadow beneath header when scrolled */}
      {scrolled && (
        <div className="absolute -bottom-5 left-0 right-0 h-5 pointer-events-none z-0">
          <div className={`w-full h-full ${
            isDark 
              ? 'bg-gradient-to-b from-true-black/50 to-transparent' 
              : 'bg-gradient-to-b from-gray-200/30 to-transparent'
          }`}></div>
        </div>
      )}
      
      {/* Particles background effect */}
      <div className="absolute inset-0 overflow-hidden">
        {renderParticles()}
      </div>
      
      {/* Interactive gradient overlay that follows mouse */}
      <div 
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
        style={{
          background: `radial-gradient(circle 300px at ${mousePosition.x}px ${mousePosition.y}px, 
            ${isDark ? 'rgba(59, 130, 246, 0.05)' : 'rgba(59, 130, 246, 0.07)'}, 
            transparent)`,
          transition: 'background 0.3s ease-out'
        }}
      ></div>

      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Enhanced Logo */}
          <Link href="/" className="group flex items-center relative z-10" aria-label="Home">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center"
            >
              <div className={`${
                isDark 
                  ? 'bg-primary-900/30 text-primary-400' 
                  : 'bg-primary-100 text-primary-600'
              } w-10 h-10 rounded-lg flex items-center justify-center mr-3 transition-transform group-hover:scale-110 duration-300`}>
                <FiTerminal size={20} className="group-hover:animate-pulse" aria-hidden="true" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-600 dark:from-primary-400 dark:to-accent-400">
                  Welcome To My Personal Blog
                </span>
                <span className={`text-xs ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Get to know about me :)
                </span>
              </div>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
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
                        transition={{ type: 'spring', duration: 0.6, stiffness: 200, damping: 25 }}
                      />
                    )}
                  </Link>
                </motion.div>
              );
            })}
            
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: navLinks.length * 0.1, duration: 0.5 }}
            >
              <ThemeToggle />
            </motion.div>
          </nav>

          {/* Mobile Menu Button with enhanced styling */}
          <div className="md:hidden flex items-center space-x-4">
            <ThemeToggle />
            <motion.button
              onClick={toggleMenu}
              className={`p-2 rounded-md ${
                isDark 
                  ? 'bg-gray-800 text-gray-300 hover:bg-primary-900/30 hover:text-primary-400' 
                  : 'bg-gray-100 text-gray-700 hover:bg-primary-50 hover:text-primary-600'
              } transition-all duration-300 relative z-20`}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </motion.button>
          </div>
        </div>

        {/* Enhanced Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden mt-4 overflow-hidden"
            >
              <motion.div 
                className={`rounded-lg ${
                  isDark 
                    ? 'bg-gray-900/90 border border-gray-800' 
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
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                    >
                      <Link 
                        href={link.path}
                        onClick={() => setIsOpen(false)}
                        className={`py-3 px-4 rounded-md flex items-center ${
                          isActive
                            ? `${isDark 
                              ? 'bg-primary-900/30 text-primary-400' 
                              : 'bg-primary-50 text-primary-600'}`
                            : `${isDark 
                              ? 'text-gray-300 hover:bg-gray-800/50' 
                              : 'text-gray-700 hover:bg-gray-50'}`
                        } transition-all duration-300`}
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
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CSS for animations */}
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

export default EnhancedHeader;