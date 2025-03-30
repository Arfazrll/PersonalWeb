import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { FiMapPin, FiMail, FiCalendar, FiCode, FiDatabase, FiCpu } from 'react-icons/fi';
import { personalInfo } from '@/utils/data';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

// Enhanced Profile Card with 3D effect - matching the Hero component
const AboutProfileCard = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  
  // Setup 3D effect for the card - same as in Hero
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
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto lg:mx-0 w-full max-w-md"
    >
      <div 
        ref={cardRef}
        className="profile-card relative w-full aspect-square rounded-2xl overflow-hidden transition-all duration-300"
        style={{
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
      >
        <div className="w-full h-full rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 p-1.5 rotating-container shadow-lg dark:shadow-primary-500/20">
          <div className="w-full h-full rounded-2xl overflow-hidden bg-white dark:bg-true-black p-3 backdrop-blur-sm">
            <div className="w-full h-full rounded-2xl overflow-hidden relative bg-gray-100 dark:bg-gray-800">
              {/* Circuit board pattern overlay - matching the Hero version */}
              <div className={`absolute inset-0 circuit-board ${isDark ? 'circuit-dark' : 'circuit-light'}`}></div>
              
              {/* Data stream animations - matching the Hero version */}
              <div className="data-streams absolute inset-0 rounded-2xl overflow-hidden">
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
              
              <div className="absolute inset-0 rounded-2xl overflow-hidden flex items-center justify-center">
                {/* Profile image placeholder with glow effect - matching the Hero style */}
                <div className="w-3/4 h-3/4 rounded-full bg-gradient-to-br from-primary-500/30 to-accent-500/30 flex items-center justify-center glow-effect">
                  <span 
                    className="text-8xl font-bold text-primary-700 dark:text-primary-300 animate-fade-in-up"
                    aria-label="User initials"
                  >
                    SA
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Animated orbit effect around avatar - just like in Hero */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] rounded-full pointer-events-none">
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary-400/30 dark:border-primary-500/30 animate-spin-slow"></div>
          
          {/* Multiple orbiting dots - matching Hero */}
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
        
        {/* Floating badges - with enhanced styling - matching Hero component */}
        <motion.div 
          className="badge absolute top-5 right-0 bg-white dark:bg-gray-800 rounded-lg p-3 shadow-lg dark:shadow-gray-900/50 card-glow"
          initial={{ opacity: 0, y: 20, x: 20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
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
          animate={{ opacity: 1, y: 0, x: 0 }}
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

// Enhanced skill pill component - matching Hero component
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

// Main About component
const EnhancedAbout = () => {
  const aboutRef = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  
  // Mouse position for interactive gradient - matching Hero component
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

  // Intersection observer for reveal animations - matching Hero component
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

    if (aboutRef.current) {
      observer.observe(aboutRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [prefersReducedMotion]);

  return (
    <section 
      id="about" 
      ref={aboutRef}
      className={`relative min-h-screen flex items-center py-20 overflow-hidden ${isDark ? 'bg-true-black' : 'bg-white'}`}
      aria-labelledby="about-heading"
    >
      {/* Enhanced Background Elements - matching Hero background */}
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
        {/* Section Title - Consistent with Hero styling */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isRevealed ? 1 : 0, y: isRevealed ? 0 : 20 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <h2 
            id="about-heading" 
            className="text-4xl md:text-5xl font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-accent-500 dark:from-primary-400 dark:to-accent-400"
          >
            About Me
          </h2>
          {/* Subtle gradient underline - matching Hero styling */}
          <div className="w-32 h-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full mx-auto mt-2 opacity-70"></div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Profile Image and Cards - Left Column */}
          <motion.div
            className={`lg:col-span-5 content-area ${isRevealed ? 'is-revealed' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isRevealed ? 1 : 0, y: isRevealed ? 0 : 20 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* 3D Profile Card Component */}
            <AboutProfileCard />
            
            {/* Contact Info Cards - With improved styling matching Hero */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mt-6">
              <motion.div 
                whileHover={{ scale: 1.03, boxShadow: "0 8px 25px -5px rgba(59, 130, 246, 0.3)" }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className={`flex items-center space-x-4 p-5 ${
                  isDark 
                    ? 'bg-blue-900/20 border-blue-500/20 hover:border-blue-500/60' 
                    : 'bg-gray-50 border-gray-200 hover:border-blue-400'
                } backdrop-blur-sm rounded-lg border transition-all duration-300 group h-24 card-glow`}
              >
                <div className={`w-12 h-12 rounded-full ${
                  isDark 
                    ? 'bg-blue-500/10 text-blue-400 group-hover:text-blue-300' 
                    : 'bg-blue-100 text-blue-600 group-hover:text-blue-500'
                } flex items-center justify-center transition-colors icon-glow`}>
                  <FiMapPin className="text-xl" />
                </div>
                <div>
                  <h3 className={`text-sm font-medium ${isDark ? 'text-blue-200/80' : 'text-gray-500'}`}>Location</h3>
                  <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>{personalInfo.location}</p>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.03, boxShadow: "0 8px 25px -5px rgba(139, 92, 246, 0.3)" }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className={`flex items-center space-x-4 p-5 ${
                  isDark 
                    ? 'bg-blue-900/20 border-blue-500/20 hover:border-purple-500/60' 
                    : 'bg-gray-50 border-gray-200 hover:border-purple-400'
                } backdrop-blur-sm rounded-lg border transition-all duration-300 group h-24 card-glow`}
              >
                <div className={`w-12 h-12 rounded-full ${
                  isDark 
                    ? 'bg-purple-500/10 text-purple-400 group-hover:text-purple-300' 
                    : 'bg-purple-100 text-purple-600 group-hover:text-purple-500'
                } flex items-center justify-center transition-colors icon-glow`}>
                  <FiMail className="text-xl" />
                </div>
                <div>
                  <h3 className={`text-sm font-medium ${isDark ? 'text-blue-200/80' : 'text-gray-500'}`}>Email</h3>
                  <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'} text-sm truncate max-w-[140px]`}>{personalInfo.email}</p>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.03, boxShadow: "0 8px 25px -5px rgba(99, 102, 241, 0.3)" }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className={`flex items-center space-x-4 p-5 ${
                  isDark 
                    ? 'bg-blue-900/20 border-blue-500/20 hover:border-indigo-500/60' 
                    : 'bg-gray-50 border-gray-200 hover:border-indigo-400'
                } backdrop-blur-sm rounded-lg border transition-all duration-300 group sm:col-span-2 h-24 card-glow`}
              >
                <div className={`w-12 h-12 rounded-full ${
                  isDark 
                    ? 'bg-indigo-500/10 text-indigo-400 group-hover:text-indigo-300' 
                    : 'bg-indigo-100 text-indigo-600 group-hover:text-indigo-500'
                } flex items-center justify-center transition-colors icon-glow`}>
                  <FiCalendar className="text-xl" />
                </div>
                <div>
                  <h3 className={`text-sm font-medium ${isDark ? 'text-blue-200/80' : 'text-gray-500'}`}>Experience</h3>
                  <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>Data & Technology Enthusiast</p>
                </div>
              </motion.div>
            </div>
            
            {/* Enhanced Skill Pills with different colors - matching Hero */}
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
          </motion.div>

          {/* About Text Content - Right Column */}
          <motion.div
            className={`lg:col-span-7 ${isRevealed ? 'is-revealed' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isRevealed ? 1 : 0, y: isRevealed ? 0 : 20 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className={`space-y-6 ${
              isDark 
                ? 'bg-blue-900/10 border-blue-500/20' 
                : 'bg-gray-50 border-gray-200'
            } backdrop-blur-sm p-8 rounded-xl border hover:shadow-xl transition-all duration-500 h-full content-card-glow`}>
              <motion.h3 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-2xl md:text-3xl font-bold text-gray-700 dark:text-gray-300"
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-accent-500 dark:from-primary-400 dark:to-accent-400">
                  Information Technology Student & AI/Big Data Enthusiast
                </span>
              </motion.h3>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className={`space-y-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
              >
                <p className="text-lg">
                  {personalInfo.about}
                </p>
                <p className="text-lg">
                  In addition, I am pursuing certifications in Machine Learning and Data Analysis, reflecting my commitment to continuous learning and staying at the forefront of technological advancements. I am eager to explore opportunities that allow me to apply my expertise, expand my knowledge, and contribute meaningfully to the technology industry.
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className={`pt-4 border-t ${isDark ? 'border-blue-500/20' : 'border-gray-200'}`}
              >
                <h4 className={`text-xl font-semibold mb-5 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  What I&apos;m Focusing On
                </h4>
                <ul className="space-y-4">
                  {/* Enhanced list items with animation */}
                  <motion.li 
                    className="flex items-start group"
                    whileHover={{ x: 8 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <div className={`w-6 h-6 rounded-full ${
                      isDark ? 'bg-primary-500/20' : 'bg-primary-100'
                    } flex-shrink-0 flex items-center justify-center mt-1 mr-4 group-hover:scale-110 transition-transform focus-point`}>
                      <div className={`w-2.5 h-2.5 rounded-full ${isDark ? 'bg-primary-400' : 'bg-primary-600'} animate-pulse`}></div>
                    </div>
                    <span className={`${
                      isDark 
                        ? 'text-gray-300 group-hover:text-primary-300' 
                        : 'text-gray-700 group-hover:text-primary-600'
                    } transition-colors`}>Deepening my understanding of Artificial Intelligence and Machine Learning</span>
                  </motion.li>
                  
                  <motion.li 
                    className="flex items-start group"
                    whileHover={{ x: 8 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <div className={`w-6 h-6 rounded-full ${
                      isDark ? 'bg-accent-500/20' : 'bg-accent-100'
                    } flex-shrink-0 flex items-center justify-center mt-1 mr-4 group-hover:scale-110 transition-transform focus-point`}>
                      <div className={`w-2.5 h-2.5 rounded-full ${isDark ? 'bg-accent-400' : 'bg-accent-600'} animate-pulse`}></div>
                    </div>
                    <span className={`${
                      isDark 
                        ? 'text-gray-300 group-hover:text-accent-300' 
                        : 'text-gray-700 group-hover:text-accent-600'
                    } transition-colors`}>Developing practical skills in Big Data Analytics and IoT systems</span>
                  </motion.li>
                  
                  <motion.li 
                    className="flex items-start group"
                    whileHover={{ x: 8 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <div className={`w-6 h-6 rounded-full ${
                      isDark ? 'bg-indigo-500/20' : 'bg-indigo-100'
                    } flex-shrink-0 flex items-center justify-center mt-1 mr-4 group-hover:scale-110 transition-transform focus-point`}>
                      <div className={`w-2.5 h-2.5 rounded-full ${isDark ? 'bg-indigo-400' : 'bg-indigo-600'} animate-pulse`}></div>
                    </div>
                    <span className={`${
                      isDark 
                        ? 'text-gray-300 group-hover:text-indigo-300' 
                        : 'text-gray-700 group-hover:text-indigo-600'
                    } transition-colors`}>Building innovative technology solutions for real-world business problems</span>
                  </motion.li>
                </ul>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* CSS Animations - matching Hero component */}
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
        
        /* Content card glow effect */
        .content-card-glow {
          position: relative;
          overflow: hidden;
        }
        
        .content-card-glow::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(59, 130, 246, 0.05),
            transparent
          );
          transition: 0.5s;
          pointer-events: none;
        }
        
        .content-card-glow:hover::before {
          left: 100%;
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
        
        /* Shadow with glow effect */
        .shadow-glow {
          box-shadow: 0 0 15px rgba(59, 130, 246, 0.5);
        }
      `}</style>
    </section>
  );
};

export default EnhancedAbout;