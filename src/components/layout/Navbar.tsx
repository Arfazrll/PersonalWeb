import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiMenu, FiX, FiDownload } from 'react-icons/fi';
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

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);

  // Function to determine active section based on scroll position
  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY;
    
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

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'py-3 bg-white/90 dark:bg-secondary-900/90 backdrop-blur shadow-md' : 'py-5 bg-transparent'
    }`}>
      <nav className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" className="text-2xl font-bold" aria-label="Home">
              <span className="text-primary-600 dark:text-primary-500">Syahril</span>
              <span className="text-secondary-900 dark:text-white">.dev</span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.path}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Link 
                  href={link.path}
                  className={`nav-link transition-colors duration-300 ${
                    activeSection === link.path.replace('/#', '') || 
                    (activeSection === 'home' && link.path === '/') 
                      ? 'active' 
                      : ''
                  }`}
                  onClick={handleLinkClick}
                  aria-current={
                    activeSection === link.path.replace('/#', '') ||
                    (activeSection === 'home' && link.path === '/')
                      ? 'page'
                      : undefined
                  }
                >
                  {link.name}
                </Link>
              </motion.div>
            ))}
            
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <a 
                href={personalInfo.resumeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 hover:bg-primary-600 hover:text-white dark:hover:bg-primary-600 transition-colors duration-300"
                download
              >
                <FiDownload className="mr-2" width={20} height={20} />
                <span>Resume</span>
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
            <ThemeToggle />
            
            <button
              className="text-secondary-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              onClick={toggleMenu}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
              {isOpen ? (
                <FiX width={24} height={24} aria-hidden="true" />
              ) : (
                <FiMenu width={24} height={24} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            id="mobile-menu"
            initial="closed"
            animate="open"
            exit="closed"
            variants={mobileMenuVariants}
            className="md:hidden mt-4 overflow-hidden"
          >
            <div className="rounded-lg bg-white dark:bg-secondary-800 shadow-lg border border-secondary-100 dark:border-secondary-700 p-4 space-y-4">
              {navLinks.map((link) => (
                <motion.div
                  key={link.path}
                  variants={menuItemVariants}
                  className="block"
                >
                  <Link 
                    href={link.path}
                    className={`block py-2 px-4 rounded-lg ${
                      activeSection === link.path.replace('/#', '') || 
                      (activeSection === 'home' && link.path === '/') 
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium' 
                        : 'text-secondary-800 dark:text-secondary-200 hover:bg-secondary-50 dark:hover:bg-secondary-700/50'
                    } transition-colors duration-300`}
                    onClick={handleLinkClick}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              
              <motion.div variants={menuItemVariants}>
                <a 
                  href={personalInfo.resumeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full py-2 px-4 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 hover:bg-primary-600 hover:text-white dark:hover:bg-primary-600 transition-colors duration-300 mt-2"
                  download
                  onClick={handleLinkClick}
                >
                  <FiDownload className="mr-2" width={20} height={20} />
                  <span>Download Resume</span>
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;