import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { 
  FiLinkedin, 
  FiGithub, 
  FiMail, 
  FiDownload, 
  FiArrowDown, 
  FiCode, 
  FiDatabase, 
  FiCpu
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import { personalInfo } from '@/utils/data';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import useTypewriter from '@/hooks/useTypewriter';
import { useTheme } from 'next-themes';
import Image from 'next/image'; // Tambahkan import Image

// Card component for better separation of concerns
const ProfileCard = ({ isRevealed }: { isRevealed: boolean }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  
  // Setup 3D effect for the card
  useEffect(() => {
    if (prefersReducedMotion || !cardRef.current) return;
    
    const card = cardRef.current;
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const maxRotation = 8; // Reduced for more subtle effect
      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;
      
      // Calculate distance from center to determine effect intensity
      const maxDistance = Math.max(rect.width, rect.height) * 1.5;
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
      
      if (distance < maxDistance) {
        // Calculate rotation based on mouse position
        const rotationY = (distanceX / rect.width) * maxRotation;
        const rotationX = -(distanceY / rect.height) * maxRotation;
        
        card.style.transform = `
          perspective(1000px) 
          rotateX(${rotationX}deg) 
          rotateY(${rotationY}deg)
          scale3d(1.02, 1.02, 1.02)
        `;
      } else {
        // Reset transform when mouse is far away
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      }
    };
    
    const handleMouseLeave = () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    };
    
    // Use passive event listeners for better performance
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    card.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [prefersReducedMotion]);
  
  return (
    <motion.div
      className={`lg:col-span-5 profile-image-container ${isRevealed ? 'is-revealed' : ''}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: isRevealed ? 1 : 0, scale: isRevealed ? 1 : 0.9 }}
      transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
    >
      <div 
        ref={cardRef}
        className="profile-card relative w-full max-w-md mx-auto transition-all duration-300"
        style={{
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
      >
        <div className="w-full aspect-square rounded-full bg-gradient-to-br from-primary-500 to-accent-500 p-1.5 rotating-container shadow-lg dark:shadow-primary-500/20">
          <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-true-black p-3 backdrop-blur-sm">
            <div className="w-full h-full rounded-full overflow-hidden relative bg-gray-100 dark:bg-gray-800">
              {/* Circuit board pattern overlay */}
              <div className={`absolute inset-0 circuit-board ${isDark ? 'circuit-dark' : 'circuit-light'}`}></div>
              
              {/* Data stream animations */}
              <div className="data-streams absolute inset-0 rounded-full overflow-hidden">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div 
                    key={index}
                    className={`data-stream ${isDark ? 'data-stream-dark' : 'data-stream-light'}`}
                    style={{
                      top: `${Math.random() * 100}%`,
                      left: `-50px`,
                      width: `${Math.random() * 100 + 100}px`,
                      height: '1px',
                      animationDuration: `${Math.random() * 5 + 5}s`,
                      animationDelay: `${Math.random() * 5}s`,
                      transform: `rotate(${Math.random() * 20 - 10}deg)`
                    }}
                  ></div>
                ))}
              </div>
              
              <div className="absolute inset-0 rounded-full overflow-hidden flex items-center justify-center">
                {/* Mengubah initials SA dengan foto profil */}
                <div className="w-full h-full bg-gradient-to-br from-primary-500/30 to-accent-500/30 flex items-center justify-center relative glow-effect">
                  <div className="relative w-full h-full rounded-full overflow-hidden">
                    <Image
                      src="/azril poto.jpg"
                      alt="Syahril Arfian Almazril"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 400px"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Animated orbit effect around avatar */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] rounded-full pointer-events-none">
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary-400/30 dark:border-primary-500/30 animate-spin-slow"></div>
          
          {/* Multiple orbiting dots */}
          <div 
            className="absolute w-5 h-5 rounded-full bg-primary-500 dark:bg-primary-400 shadow-glow animate-orbit focus-point"
            style={{ 
              transformOrigin: 'center',
            }}
            aria-hidden="true"
          />
          
          <div 
            className="absolute w-4 h-4 rounded-full bg-accent-500 dark:bg-accent-400 shadow-glow animate-orbit"
            style={{ 
              transformOrigin: 'center',
              animationDelay: '1s',
              animationDuration: '10s'
            }}
            aria-hidden="true"
          />
          
          <div 
            className="absolute w-3 h-3 rounded-full bg-indigo-500 dark:bg-indigo-400 shadow-glow animate-orbit"
            style={{ 
              transformOrigin: 'center',
              animationDelay: '2s',
              animationDuration: '12s'
            }}
            aria-hidden="true"
          />
        </div>
        
        {/* Floating badges - with enhanced styling */}
        <motion.div 
          className="badge absolute top-5 right-0 bg-white dark:bg-gray-800 rounded-lg p-3 shadow-lg dark:shadow-gray-900/50 card-glow"
          initial={{ opacity: 0, y: 20, x: 20 }}
          animate={{ opacity: isRevealed ? 1 : 0, y: isRevealed ? 0 : 20, x: isRevealed ? 0 : 20 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          whileHover={{ y: -5, x: 0, scale: 1.05 }}
          role="presentation"
          aria-hidden="true"
        >
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-full bg-primary-100 dark:bg-primary-900/30 icon-glow">
              <FiCpu className="text-primary-600 dark:text-primary-400" size={16} />
            </div>
            <div>
              <span className="text-xs text-gray-500 dark:text-gray-400 block">Specializing in</span>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">AI & Big Data</h3>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="badge absolute -bottom-2 -left-2 bg-white dark:bg-gray-800 rounded-lg p-3 shadow-lg dark:shadow-gray-900/50 card-glow"
          initial={{ opacity: 0, y: 20, x: -20 }}
          animate={{ opacity: isRevealed ? 1 : 0, y: isRevealed ? 0 : 20, x: isRevealed ? 0 : -20 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          whileHover={{ y: -5, x: 0, scale: 1.05 }}
          role="presentation"
          aria-hidden="true"
        >
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-full bg-accent-100 dark:bg-accent-900/30 icon-glow">
              <FiDatabase className="text-accent-600 dark:text-accent-400" size={16} />
            </div>
            <div>
              <span className="text-xs text-gray-500 dark:text-gray-400 block">Achievement</span>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Top 15 in Data Mining</h3>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Enhanced skill pill component
const SkillPill = ({ 
  icon, 
  label, 
  delay,
  color = 'primary'
}: { 
  icon: React.ReactNode, 
  label: string, 
  delay: string,
  color?: 'primary' | 'accent' | 'indigo'
}) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  
  // Determine background and text colors based on color prop
  const getBgColor = () => {
    switch(color) {
      case 'accent': return isDark 
        ? 'bg-accent-900/30 hover:bg-accent-800/40' 
        : 'bg-accent-100/80 hover:bg-accent-200/80';
      case 'indigo': return isDark 
        ? 'bg-indigo-900/30 hover:bg-indigo-800/40' 
        : 'bg-indigo-100/80 hover:bg-indigo-200/80';
      default: return isDark 
        ? 'bg-primary-900/30 hover:bg-primary-800/40' 
        : 'bg-primary-100/80 hover:bg-primary-200/80';
    }
  };
  
  const getTextColor = () => {
    switch(color) {
      case 'accent': return 'text-accent-700 dark:text-accent-300';
      case 'indigo': return 'text-indigo-700 dark:text-indigo-300';
      default: return 'text-primary-700 dark:text-primary-300';
    }
  };
  
  return (
    <motion.div 
      className={`skill-pill flex items-center ${getBgColor()} ${getTextColor()} px-4 py-2 rounded-full shadow-sm ${delay} transition-colors duration-300 focus-point`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      whileHover={{ y: -3, scale: 1.05 }}
    >
      <span className="mr-2">{icon}</span>
      <span>{label}</span>
    </motion.div>
  );
};

// Main Hero component
const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  
  // Mouse position for interactive gradient
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Handle mouse move for interactive gradient
  useEffect(() => {
    if (prefersReducedMotion) return;
    
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
  }, [prefersReducedMotion]);

  // Enhanced typing phrases with emojis and tech specifics
  const phrases = useMemo(() => [
    'AI & Big Data Enthusiast ✨',
    'Machine Learning Engineer 🤖',
    'Python Developer 🐍',
    'Technology Innovator 💡',
    'Data Science Explorer 📊'
  ], []);

  // Custom hook for typewriter effect
  const { text: typedText } = useTypewriter({
    phrases,
    typingSpeed: 70,
    deletingSpeed: 30,
    pauseDuration: 1500
  });

  // Intersection observer for reveal animations
  useEffect(() => {
    if (prefersReducedMotion) {
      setIsRevealed(true);
      return;
    }
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [prefersReducedMotion]);

  // Detect scroll for scroll indicator animation with debounce
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const handleScroll = () => {
      // Clear existing timeout to debounce the function
      clearTimeout(timeoutId);
      
      // Set a new timeout
      timeoutId = setTimeout(() => {
        setHasScrolled(window.scrollY > 10);
      }, 50); // 50ms debounce
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  // Scroll smoothly to About section
  const scrollToAbout = useCallback(() => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <section 
      id="home" 
      ref={heroRef}
      className={`min-h-screen flex items-center relative overflow-hidden pt-24 pb-12 ${isDark ? 'bg-true-black' : 'bg-white'}`}
      aria-labelledby="hero-heading"
    >
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 z-0">
        {/* Tech Network Grid */}
        <div className={`tech-grid ${isDark ? 'tech-grid-dark' : 'tech-grid-light'}`}></div>
        
        {/* Animated particles */}
        <div className="particles-container">
          {Array.from({ length: 25 }).map((_, index) => (
            <div 
              key={index}
              className={`particle ${isDark ? 'bg-blue-500' : 'bg-blue-600'}`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 6 + 3}px`,
                height: `${Math.random() * 6 + 3}px`,
                opacity: isDark ? Math.random() * 0.5 + 0.1 : Math.random() * 0.3 + 0.1,
                animationDuration: `${Math.random() * 15 + 15}s`,
                animationDelay: `${Math.random() * 5}s`
              }}
            />
          ))}
        </div>
        
        {/* Digital rain effect */}
        <div className={`digital-rain ${isDark ? 'digital-rain-dark' : 'digital-rain-light'}`}>
          {Array.from({ length: 15 }).map((_, index) => (
            <div 
              key={index} 
              className="rain-column"
              style={{
                left: `${(index * 7) + Math.random() * 5}%`,
                animationDuration: `${Math.random() * 10 + 10}s`,
                animationDelay: `${Math.random() * 5}s`
              }}
            ></div>
          ))}
        </div>
        
        {/* Interactive gradient overlay that follows mouse */}
        <div 
          className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
          style={{
            background: `radial-gradient(circle 400px at ${mousePosition.x}px ${mousePosition.y}px, 
              ${isDark ? 'rgba(59, 130, 246, 0.08)' : 'rgba(59, 130, 246, 0.1)'}, 
              transparent)`,
            transition: 'background 0.3s ease-out'
          }}
        ></div>
        
        {/* Animated gradient meshes */}
        <div className={`absolute top-0 left-0 w-1/3 h-1/3 rounded-full blur-3xl ${
          isDark ? 'bg-blue-900/15 animate-pulse-slow' : 'bg-blue-500/20 animate-pulse-slow'
        }`} style={{ animationDuration: '15s' }}></div>
        
        <div className={`absolute bottom-0 right-0 w-1/4 h-1/3 rounded-full blur-3xl ${
          isDark ? 'bg-purple-900/15 animate-pulse-slow' : 'bg-purple-500/20 animate-pulse-slow'
        }`} style={{ animationDuration: '20s', animationDelay: '2s' }}></div>
        
        <div className={`absolute top-1/3 right-1/4 w-1/4 h-1/4 rounded-full blur-3xl ${
          isDark ? 'bg-indigo-900/10 animate-pulse-slow' : 'bg-indigo-500/20 animate-pulse-slow'
        }`} style={{ animationDuration: '25s', animationDelay: '5s' }}></div>
        
        {/* Data stream animations */}
        <div className="data-streams">
          {Array.from({ length: 8 }).map((_, index) => (
            <div 
              key={index}
              className={`data-stream ${isDark ? 'data-stream-dark' : 'data-stream-light'}`}
              style={{
                top: `${Math.random() * 100}%`,
                left: `-50px`,
                width: `${Math.random() * 200 + 100}px`,
                height: '1px',
                animationDuration: `${Math.random() * 5 + 5}s`,
                animationDelay: `${Math.random() * 5}s`,
                transform: `rotate(${Math.random() * 20 - 10}deg)`
              }}
            ></div>
          ))}
        </div>
        
        {/* Floating code snippets */}
        <div className="code-snippets">
          {Array.from({ length: 6 }).map((_, index) => (
            <div 
              key={index}
              className={`code-snippet ${isDark ? 'code-snippet-dark' : 'code-snippet-light'}`}
              style={{
                top: `${Math.random() * 80 + 10}%`,
                left: `${Math.random() * 80 + 10}%`,
                animationDuration: `${Math.random() * 10 + 20}s`,
                animationDelay: `${Math.random() * 10}s`
              }}
            >
              {Math.random() > 0.5 ? '<div className="tech">' : 'const data = await fetch(api);'}
            </div>
          ))}
        </div>
        
        {/* Floating tech elements */}
        <div className={`absolute ${isDark ? 'tech-elements-dark' : 'tech-elements-light'}`}></div>
      </div>
      
      {/* Background Mesh Pattern */}
      <div 
        className="absolute inset-0 bg-mesh-pattern opacity-5 dark:opacity-5 -z-10"
        aria-hidden="true"
      ></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Content */}
          <motion.div
            className={`lg:col-span-7 content-area ${isRevealed ? 'is-revealed' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isRevealed ? 1 : 0, y: isRevealed ? 0 : 20 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="space-y-6">
              <h1 id="hero-heading" className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <motion.span 
                  className="text-gray-900 dark:text-white block"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  Hi, I&apos;m 
                </motion.span>
                <motion.span 
                  className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-accent-500 dark:from-primary-400 dark:to-accent-400"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  Syahril Arfian Almazril
                </motion.span>
              </h1>
              
              <h2 className="text-2xl md:text-3xl font-medium text-gray-700 dark:text-gray-300">
                <span>{personalInfo.title}</span>
                <div className="mt-2 h-10 flex items-center" aria-live="polite">
                  <span className="text-primary-600 dark:text-primary-400">{typedText}</span>
                  <span className="inline-block w-0.5 h-6 bg-primary-600 dark:text-primary-400 ml-1 animate-blink" aria-hidden="true"></span>
                </div>
              </h2>
              
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
                {personalInfo.about.split('.')[0] + '.'}
              </p>
              
              <div className="flex flex-wrap gap-4 pt-2">
                <Button 
                  href="#contact" 
                  variant="primary"
                  icon={<FiMail size={20} />}
                  className="group hover-effect relative overflow-hidden card-glow"
                  aria-label="Contact me via email"
                >
                  <span className="relative z-10">
                    Get In Touch
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white dark:bg-white group-hover:w-full transition-all duration-300"></span>
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-500 dark:from-primary-500 dark:to-primary-400 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></span>
                </Button>
                
                <Button 
                  href={personalInfo.resumeLink} 
                  variant="outline"
                  icon={<FiDownload size={20} />}
                  download={true}
                  isExternal={true}
                  className="group relative overflow-hidden card-glow"
                  aria-label="Download CV"
                >
                  <span className="relative z-10">
                    Download CV
                  </span>
                  <span className="absolute inset-0 bg-primary-50 dark:bg-primary-900/30 transform -translate-y-full group-hover:translate-y-0 transition-transform duration-500"></span>
                </Button>
              </div>
              
              <div className="flex items-center gap-4 mt-6">
                <motion.a 
                  href={personalInfo.socialLinks.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-icon-wrapper icon-glow"
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="LinkedIn Profile"
                >
                  <div className="social-icon">
                    <FiLinkedin size={20} />
                  </div>
                </motion.a>
                
                <motion.a 
                  href={personalInfo.socialLinks.github}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-icon-wrapper icon-glow"
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="GitHub Profile"
                >
                  <div className="social-icon">
                    <FiGithub size={20} />
                  </div>
                </motion.a>
                
                <motion.a 
                  href={`mailto:${personalInfo.email}`}
                  className="social-icon-wrapper icon-glow"
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Email Me"
                >
                  <div className="social-icon">
                    <FiMail size={20} />
                  </div>
                </motion.a>
              </div>

              {/* Enhanced Skill Pills with different colors */}
              <div className="flex flex-wrap gap-4 mt-8">
                <SkillPill 
                  icon={<FiCode size={16} />}
                  label="Python" 
                  delay="delay-100"
                  color="primary"
                />
                
                <SkillPill 
                  icon={<FiDatabase size={16} />}
                  label="Big Data" 
                  delay="delay-200"
                  color="accent"
                />
                
                <SkillPill 
                  icon={<FiCpu size={16} />}
                  label="Machine Learning" 
                  delay="delay-300"
                  color="indigo"
                />
              </div>
            </div>
          </motion.div>
          
          {/* Enhanced Profile Image Card with 3D Effect */}
          <ProfileCard isRevealed={isRevealed} />
        </div>
        
        {/* Enhanced Scroll Indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: hasScrolled ? 0 : 1, y: hasScrolled ? 10 : 0 }}
          transition={{ duration: 0.3 }}
          aria-hidden="true"
        >
          <span className="text-sm text-gray-500 dark:text-gray-400 mb-2 animate-bounce-slow">
            Scroll Down
          </span>
          <button 
            onClick={scrollToAbout}
            className="w-10 h-10 rounded-full border-2 border-gray-300 dark:border-gray-700 flex items-center justify-center hover:border-primary-500 dark:hover:border-primary-400 transition-colors duration-300 icon-glow"
            aria-label="Scroll to About section"
          >
            <FiArrowDown className="text-gray-400 dark:text-gray-500" size={18} />
          </button>
        </motion.div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        /* Base animations */
        .animate-pulse-slow {
          animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .animate-float-slow {
          animation: float 4s ease-in-out infinite;
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.2);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        /* Particle system */
        .particles-container {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        
        .particle {
          position: absolute;
          border-radius: 50%;
          animation: particle-float 15s infinite ease-in-out;
          z-index: 1;
        }
        
        @keyframes particle-float {
          0% {
            transform: translateY(0) translateX(0) rotate(0);
            opacity: 0.2;
          }
          10% {
            opacity: 0.8;
          }
          50% {
            transform: translateY(-100px) translateX(50px) rotate(180deg);
          }
          90% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(0) translateX(0) rotate(360deg);
            opacity: 0.2;
          }
        }
        
        /* Tech Network Grid */
        .tech-grid {
          position: absolute;
          width: 100%;
          height: 100%;
          background-size: 40px 40px;
          opacity: 0.4;
        }
        
        .tech-grid-dark {
          background-image: radial-gradient(rgba(59, 130, 246, 0.2) 1px, transparent 1px);
        }
        
        .tech-grid-light {
          background-image: radial-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px);
        }
        
        /* Digital Rain Effect */
        .digital-rain {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        
        .rain-column {
          position: absolute;
          top: -300px;
          width: 2px;
          height: 200px;
          animation: digital-rain-fall linear infinite;
        }
        
        .digital-rain-dark .rain-column {
          background: linear-gradient(to bottom, transparent, rgba(59, 130, 246, 0.4), transparent);
        }
        
        .digital-rain-light .rain-column {
          background: linear-gradient(to bottom, transparent, rgba(59, 130, 246, 0.5), transparent);
        }
        
        @keyframes digital-rain-fall {
          0% {
            transform: translateY(-100%);
            opacity: 0;
          }
          10% {
            opacity: 0.5;
          }
          90% {
            opacity: 0.5;
          }
          100% {
            transform: translateY(1000px);
            opacity: 0;
          }
        }
        
        /* Data Streams */
        .data-streams {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        
        .data-stream {
          position: absolute;
          animation: data-stream-move linear infinite;
        }
        
        .data-stream-dark {
          background: linear-gradient(to right, transparent, rgba(59, 130, 246, 0.4), transparent);
        }
        
        .data-stream-light {
          background: linear-gradient(to right, transparent, rgba(59, 130, 246, 0.5), transparent);
        }
        
        @keyframes data-stream-move {
          0% {
            transform: translateX(-100px);
            opacity: 0;
          }
          10% {
            opacity: 0.7;
          }
          90% {
            opacity: 0.7;
          }
          100% {
            transform: translateX(2000px);
            opacity: 0;
          }
        }
        
        /* Floating Code Snippets */
        .code-snippets {
          position: absolute;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
        
        .code-snippet {
          position: absolute;
          font-family: monospace;
          font-size: 10px;
          padding: 5px;
          border-radius: 4px;
          animation: code-float infinite ease-in-out;
          white-space: nowrap;
          opacity: 0.3;
        }
        
        .code-snippet-dark {
          background: rgba(30, 41, 59, 0.7);
          color: rgba(59, 130, 246, 0.8);
          border: 1px solid rgba(59, 130, 246, 0.2);
        }
        
        .code-snippet-light {
          background: rgba(241, 245, 249, 0.8);
          color: rgba(30, 64, 175, 0.8);
          border: 1px solid rgba(59, 130, 246, 0.3);
        }
        
        @keyframes code-float {
          0%, 100% {
            transform: translateY(0) translateX(0) rotate(0deg);
          }
          25% {
            transform: translateY(-30px) translateX(10px) rotate(1deg);
          }
          50% {
            transform: translateY(0) translateX(20px) rotate(0deg);
          }
          75% {
            transform: translateY(30px) translateX(10px) rotate(-1deg);
          }
        }
        
        /* Circuit Board Pattern */
        .circuit-board {
          background-size: 40px 40px;
          opacity: 0.4;
        }
        
        .circuit-dark {
          background-image: 
            linear-gradient(rgba(59, 130, 246, 0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.2) 1px, transparent 1px);
        }
        
        .circuit-light {
          background-image: 
            linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px);
        }
        
        /* Tech Elements */
        .tech-elements-dark::before,
        .tech-elements-dark::after,
        .tech-elements-light::before,
        .tech-elements-light::after {
          content: "";
          position: absolute;
          border-radius: 50%;
        }
        
        .tech-elements-dark::before {
          width: 250px;
          height: 250px;
          top: 15%;
          left: 10%;
          animation: rotate 40s linear infinite;
          border: 1px solid rgba(59, 130, 246, 0.2);
          box-shadow: 0 0 40px rgba(59, 130, 246, 0.1);
        }
        
        .tech-elements-dark::after {
          width: 300px;
          height: 300px;
          bottom: 5%;
          right: 5%;
          animation: rotate 50s linear infinite reverse;
          border: 1px solid rgba(147, 51, 234, 0.2);
          box-shadow: 0 0 50px rgba(147, 51, 234, 0.1);
        }
        
        .tech-elements-light::before {
          width: 250px;
          height: 250px;
          top: 15%;
          left: 10%;
          animation: rotate 40s linear infinite;
          border: 1.5px solid rgba(59, 130, 246, 0.4);
          box-shadow: 0 0 40px rgba(59, 130, 246, 0.2);
        }
        
        .tech-elements-light::after {
          width: 300px;
          height: 300px;
          bottom: 5%;
          right: 5%;
          animation: rotate 50s linear infinite reverse;
          border: 1.5px solid rgba(147, 51, 234, 0.4);
          box-shadow: 0 0 50px rgba(147, 51, 234, 0.2);
        }
        
        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        /* Enhanced card effects */
        .card-glow {
          position: relative;
          overflow: hidden;
        }
        
        .card-glow::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(
            circle,
            rgba(59, 130, 246, 0.1) 0%,
            transparent 70%
          );
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }
        
        .card-glow:hover::after {
          opacity: 1;
        }
        
        /* Icon glow effect */
        .icon-glow {
          position: relative;
        }
        
        .icon-glow::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 50%;
          padding: 3px;
          background: linear-gradient(45deg, rgba(59, 130, 246, 0.5), rgba(147, 51, 234, 0.5));
          -webkit-mask: 
            linear-gradient(#fff 0 0) content-box, 
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .icon-glow:hover::after {
          opacity: 1;
        }
        
        /* Glowing focus points */
        .focus-point {
          position: relative;
        }
        
        .focus-point::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .focus-point:hover::after {
          opacity: 1;
        }
        
        /* Glow effect for profile */
        .glow-effect {
          position: relative;
        }
        
        .glow-effect::after {
          content: '';
          position: absolute;
          inset: -5px;
          border-radius: 50%;
          background: linear-gradient(45deg, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2));
          filter: blur(10px);
          opacity: 0;
          transition: opacity 0.5s ease;
        }
        
        .glow-effect:hover::after {
          opacity: 1;
        }

        /* Animation for the orbiting dot */
        @keyframes orbit {
          0% {
            transform: translateX(-50%) rotate(0deg) translateY(-40px) rotate(0deg);
          }
          100% {
            transform: translateX(-50%) rotate(360deg) translateY(-40px) rotate(-360deg);
          }
        }

        .animate-orbit {
          animation: orbit 8s linear infinite;
        }

        /* Animation for the spinning orbit circle */
        @keyframes spin-slow {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .animate-spin-slow {
          animation: spin-slow 40s linear infinite;
        }

        /* Animation for the bouncing scroll text */
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }

        /* Animation for the fading in up effect */
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        
        .animated-gradient {
          background-size: 200% 200%;
          animation: gradientShift 8s linear infinite;
        }
        
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .rotating-container {
          animation: gentleRotate 10s ease-in-out infinite alternate;
        }
        
        @keyframes gentleRotate {
          0% { transform: rotate(0deg); }
          25% { transform: rotate(5deg); }
          50% { transform: rotate(0deg); }
          75% { transform: rotate(-5deg); }
          100% { transform: rotate(0deg); }
        }
        
        .animate-blink {
          animation: blink 1s step-end infinite;
        }
        
        @keyframes blink {
          from, to { opacity: 1; }
          50% { opacity: 0; }
        }
        
        .hover-effect {
          position: relative;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
};

export default Hero;