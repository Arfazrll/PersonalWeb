import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiLinkedin, FiGithub, FiMail, FiChevronUp, FiCode, FiCpu, FiDatabase } from 'react-icons/fi';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';

const EnhancedFooter = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const year = new Date().getFullYear();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Handle mouse move for interactive gradient
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white dark:bg-true-black relative pt-16 pb-6 overflow-hidden">
      {/* Animated separator at the top of the footer */}
      <div className="absolute top-0 left-0 right-0 z-10 h-[3px] overflow-hidden transform rotate-180">
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

      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        {/* Tech Network Grid */}
        <div className={`tech-grid ${isDark ? 'tech-grid-dark' : 'tech-grid-light'}`}></div>
        
        {/* Interactive gradient overlay that follows mouse */}
        <div 
          className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
          style={{
            background: `radial-gradient(circle 300px at ${mousePosition.x}px ${mousePosition.y}px, 
              ${isDark ? 'rgba(59, 130, 246, 0.05)' : 'rgba(59, 130, 246, 0.08)'}, 
              transparent)`,
            transition: 'background 0.3s ease-out'
          }}
        ></div>
        
        {/* Background glowing orbs */}
        <div className={`absolute bottom-0 left-1/4 w-1/5 h-1/2 rounded-full blur-3xl ${
          isDark ? 'bg-primary-900/5 animate-pulse-slow' : 'bg-primary-200/20 animate-pulse-slow'
        }`} style={{ animationDuration: '10s' }}></div>
        
        <div className={`absolute top-1/4 right-1/4 w-1/6 h-1/3 rounded-full blur-3xl ${
          isDark ? 'bg-accent-900/5 animate-pulse-slow' : 'bg-accent-200/20 animate-pulse-slow'
        }`} style={{ animationDuration: '15s', animationDelay: '2s' }}></div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-10">
          {/* Logo & Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="md:col-span-5"
          >
            <Link href="/" className="group flex items-center" aria-label="Home">
              <div className={`${
                isDark 
                  ? 'bg-primary-900/30 text-primary-400' 
                  : 'bg-primary-100 text-primary-600'
              } w-10 h-10 rounded-lg flex items-center justify-center mr-3 transition-transform group-hover:scale-110 duration-300`}>
                <FiCode size={20} className="group-hover:animate-pulse" aria-hidden="true" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-600 dark:from-primary-400 dark:to-accent-400">
                  Syahril Arfian Almazril 
                </span>
                <span className={`text-xs ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  AI & Data Enthusiast
                </span>
              </div>
            </Link>
            
            <p className="mt-4 text-secondary-600 dark:text-secondary-400 max-w-md relative">
              Information Technology Student | AI & Big Data Enthusiast | 
              Passionate About Technology for Business Growth
            </p>

            {/* Tech Badges */}
            <div className="flex flex-wrap gap-3 mt-4">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs ${
                isDark 
                  ? 'bg-primary-900/30 text-primary-400' 
                  : 'bg-primary-50 text-primary-600'
              }`}>
                <FiCpu className="mr-1" size={12} />
                AI & Machine Learning 
              </div>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs ${
                isDark 
                  ? 'bg-accent-900/30 text-accent-400' 
                  : 'bg-accent-50 text-accent-600'
              }`}>
                <FiDatabase className="mr-1" size={12} />
                Big Data
              </div>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs ${
                isDark 
                  ? 'bg-indigo-900/30 text-indigo-400' 
                  : 'bg-indigo-50 text-indigo-600'
              }`}>
                <FiCode className="mr-1" size={12} />
                FrontEnd Developer
              </div>
            </div>
          </motion.div>
          
          {/* Quick Links Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-3"
          >
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Quick Links</h3>
            <ul className="space-y-2">
              {['Home', 'About', 'Experience', 'Skills', 'Projects', 'Contact'].map((item) => (
                <li key={item} className="group">
                  <Link 
                    href={item === 'Home' ? '/' : `/#${item.toLowerCase()}`}
                    className={`inline-block text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors relative`}
                  >
                    <span className="relative z-10">{item}</span>
                    <span className={`absolute left-0 bottom-0 h-[1px] w-0 group-hover:w-full transition-all duration-300 ${
                      isDark ? 'bg-primary-500' : 'bg-primary-600'
                    }`}></span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
          
          {/* Connect Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:col-span-4"
          >
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Connect</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <motion.a 
                  href="https://www.linkedin.com/in/syahril-arfianalmazril-215a12231" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`w-10 h-10 flex items-center justify-center rounded-lg ${
                    isDark 
                      ? 'bg-secondary-800 text-secondary-400 hover:bg-primary-900/30 hover:text-primary-400' 
                      : 'bg-secondary-100 text-secondary-600 hover:bg-primary-100 hover:text-primary-600'
                  } transition-all duration-300 relative overflow-hidden group`}
                  aria-label="LinkedIn"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiLinkedin size={18} className="relative z-10" />
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary-600 to-primary-500 scale-x-0 transform origin-left group-hover:scale-x-100 transition-transform duration-300 -z-0" />
                </motion.a>
                <motion.a 
                  href="mailto:azril4974@gmail.com" 
                  className={`w-10 h-10 flex items-center justify-center rounded-lg ${
                    isDark 
                      ? 'bg-secondary-800 text-secondary-400 hover:bg-primary-900/30 hover:text-primary-400' 
                      : 'bg-secondary-100 text-secondary-600 hover:bg-primary-100 hover:text-primary-600'
                  } transition-all duration-300 relative overflow-hidden group`}
                  aria-label="Email"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiMail size={18} className="relative z-10" />
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary-600 to-primary-500 scale-x-0 transform origin-left group-hover:scale-x-100 transition-transform duration-300 -z-0" />
                </motion.a>
                <motion.a 
                  href="https://github.com/syahrilarfian" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`w-10 h-10 flex items-center justify-center rounded-lg ${
                    isDark 
                      ? 'bg-secondary-800 text-secondary-400 hover:bg-primary-900/30 hover:text-primary-400' 
                      : 'bg-secondary-100 text-secondary-600 hover:bg-primary-100 hover:text-primary-600'
                  } transition-all duration-300 relative overflow-hidden group`}
                  aria-label="GitHub"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiGithub size={18} className="relative z-10" />
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary-600 to-primary-500 scale-x-0 transform origin-left group-hover:scale-x-100 transition-transform duration-300 -z-0" />
                </motion.a>
              </div>
              
              <motion.button
                onClick={scrollToTop}
                className={`px-4 py-2 rounded-lg ${
                  isDark 
                    ? 'bg-primary-900/30 text-primary-400 hover:bg-primary-800/40' 
                    : 'bg-primary-100 text-primary-600 hover:bg-primary-200'
                } transition-all duration-300 flex items-center space-x-2 relative overflow-hidden group`}
                aria-label="Scroll to top"
                whileHover={{ y: -3 }}
                whileTap={{ y: 0 }}
              >
                <FiChevronUp size={16} className="relative z-10" />
                <span className="relative z-10">Back to top</span>
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary-600 to-accent-600 scale-x-0 transform origin-left group-hover:scale-x-100 transition-transform duration-300 -z-0" />
              </motion.button>
            </div>
          </motion.div>
        </div>
        
        {/* Border with Tech Pattern */}
        <div className={`relative h-px w-full mb-6 ${isDark ? 'bg-secondary-800' : 'bg-secondary-200'} overflow-hidden`}>
          <div className="absolute inset-0">
            {Array.from({ length: 30 }).map((_, i) => (
              <div 
                key={`border-node-${i}`}
                className={`absolute h-1 w-1 rounded-full ${
                  i % 5 === 0 
                    ? isDark ? 'bg-primary-500' : 'bg-primary-500' 
                    : isDark ? 'bg-secondary-700' : 'bg-secondary-300'
                } ${i % 5 === 0 ? 'animate-pulse' : ''}`}
                style={{ 
                  left: `${(i / 30) * 100}%`,
                  top: '-1px',
                  animationDuration: '3s',
                  animationDelay: `${i * 0.2}s`
                }}
              />
            ))}
          </div>
        </div>
        
        {/* Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left text-sm">
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-secondary-600 dark:text-secondary-400"
          >
            © {year} Developed by Syahril Arfian Almazril
          </motion.p>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-secondary-500 dark:text-secondary-500 mt-2 md:mt-0"
          >
            <span className="code-snippet px-2 py-1 rounded text-xs font-mono tracking-tight">
              <span className="text-primary-500">const</span>{" "}
              <span className={isDark ? "text-accent-400" : "text-accent-600"}>passion</span> = {" "}
              <span className="text-green-500">&apos;code + coffee&apos;</span>;
            </span>
          </motion.p>
        </div>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        /* Tech Grid */
        .tech-grid {
          position: absolute;
          width: 100%;
          height: 100%;
          background-size: 40px 40px;
          opacity: 0.4;
        }
        
        .tech-grid-dark {
          background-image: radial-gradient(rgba(59, 130, 246, 0.15) 1px, transparent 1px);
        }
        
        .tech-grid-light {
          background-image: radial-gradient(rgba(59, 130, 246, 0.2) 1px, transparent 1px);
        }
        
        /* Pulse animation */
        @keyframes pulse {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.8;
          }
        }
        
        .animate-pulse-slow {
          animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        /* Code snippet styling */
        .code-snippet {
          background: ${isDark ? 'rgba(30, 41, 59, 0.5)' : 'rgba(241, 245, 249, 0.8)'};
          border: 1px solid ${isDark ? 'rgba(51, 65, 85, 0.5)' : 'rgba(226, 232, 240, 0.8)'};
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
    </footer>
  );
};

export default EnhancedFooter;