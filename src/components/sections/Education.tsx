import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiBookOpen, FiCalendar, FiAward, FiCpu, FiDatabase, FiCode, FiCheck } from 'react-icons/fi';
import { education, certifications } from '@/utils/data';
import Card from '../ui/Card';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useTheme } from 'next-themes';

const Education = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('education');
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  
  // Mouse position for interactive gradient effect
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Handle mouse movement for gradient effect
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

  // Detect when section becomes visible
  useEffect(() => {
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [prefersReducedMotion]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section 
      id="education" 
      ref={sectionRef}
      className="py-20 relative overflow-hidden bg-white dark:bg-true-black"
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
          {Array.from({ length: 12 }).map((_, index) => (
            <div 
              key={index} 
              className="rain-column"
              style={{
                left: `${(index * 8) + Math.random() * 5}%`,
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
          {Array.from({ length: 5 }).map((_, index) => (
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
              {index % 2 === 0 ? 'const education = ["BSc", "MSc"];' : 'function learn() { return knowledge; }'}
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
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-accent-500 dark:from-primary-400 dark:to-accent-400 mb-6">
            Education & Certifications
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full mx-auto mt-2 opacity-70"></div>
          <p className="text-secondary-600 dark:text-secondary-400 max-w-2xl mx-auto mt-6 text-lg">
            My academic journey and professional certifications that have shaped my knowledge and expertise.
          </p>
        </motion.div>
        
        {/* Tabs for switching between Education and Certifications */}
        <div className="flex justify-center mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex p-1 bg-secondary-100 dark:bg-secondary-800/60 rounded-xl shadow-lg card-glow"
          >
            <button
              onClick={() => setActiveTab('education')}
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                activeTab === 'education'
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md'
                : 'text-secondary-600 dark:text-secondary-400 hover:bg-secondary-200 dark:hover:bg-secondary-700/70'
              }`}
            >
              <span className="flex items-center gap-2">
                <FiBookOpen className="text-lg" />
                Education
              </span>
            </button>
            <button
              onClick={() => setActiveTab('certifications')}
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                activeTab === 'certifications'
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md'
                : 'text-secondary-600 dark:text-secondary-400 hover:bg-secondary-200 dark:hover:bg-secondary-700/70'
              }`}
            >
              <span className="flex items-center gap-2">
                <FiAward className="text-lg" />
                Certifications
              </span>
            </button>
          </motion.div>
        </div>
        
        {/* Education Content */}
        {activeTab === 'education' && (
          <motion.div
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            variants={containerVariants}
            className="max-w-4xl mx-auto"
          >
            <div className="space-y-8">
              {education.map((item, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  className="group"
                >
                  <Card 
                    className="p-0 overflow-hidden border border-secondary-200/60 dark:border-secondary-700/40 group-hover:border-primary-300 dark:group-hover:border-primary-600/40 transition-all duration-300 card-glow"
                    hover
                  >
                    <div className="relative">
                      {/* Animated glow bar */}
                      <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-primary-500 to-accent-500 dark:from-primary-400 dark:to-accent-400 opacity-70 group-hover:opacity-100 group-hover:h-1.5 transition-all duration-500"></div>
                      
                      <div className="p-6 md:p-8">
                        <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6">
                          {/* Institution Logo/Icon with enhanced styling */}
                          <div className="flex-shrink-0">
                            <motion.div 
                              className="w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br from-primary-500/10 to-accent-500/10 dark:from-primary-900/20 dark:to-accent-900/20 border border-primary-200 dark:border-primary-800/60 icon-glow relative overflow-hidden"
                              whileHover={{ scale: 1.05, rotate: 5 }}
                              transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                              {/* Animated background */}
                              <div className="absolute inset-0 bg-gradient-to-br from-primary-400/10 to-accent-400/10 dark:from-primary-600/10 dark:to-accent-600/10 animated-gradient"></div>
                              <FiBookOpen className="text-primary-600 dark:text-primary-400 relative z-10" size={28} />
                              
                              {/* Orbiting dot */}
                              <div 
                                className="absolute w-2 h-2 rounded-full bg-primary-500 dark:bg-primary-400 shadow-glow animate-orbit"
                                style={{ 
                                  transformOrigin: 'center',
                                  animationDuration: '8s'
                                }}
                                aria-hidden="true"
                              />
                            </motion.div>
                          </div>
                          
                          {/* Content */}
                          <div className="flex-grow">
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                              <div>
                                <h3 className="text-xl font-bold text-secondary-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                  {item.institution}
                                </h3>
                                <p className="text-lg font-semibold text-primary-600 dark:text-primary-400 mt-1">
                                  {item.degree}
                                </p>
                              </div>
                              
                              <motion.span 
                                className="px-4 py-1.5 text-sm font-medium rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300 flex items-center self-start shadow-sm"
                                whileHover={{ scale: 1.05, y: -2 }}
                              >
                                <FiCalendar className="mr-2" size={14} />
                                {item.duration}
                              </motion.span>
                            </div>
                            
                            <div className="mt-4 p-4 bg-secondary-50 dark:bg-secondary-800/30 rounded-lg shadow-inner">
                              <p className="text-secondary-700 dark:text-secondary-300">
                                {item.description}
                              </p>
                            </div>
                            
                            {/* Skills/Keywords Section with enhanced animation */}
                            <div className="mt-4 pt-4 border-t border-secondary-100 dark:border-secondary-800/50">
                              <h4 className="text-sm font-medium text-secondary-600 dark:text-secondary-400 mb-2">Key Focus Areas:</h4>
                              <div className="flex flex-wrap gap-2">
                                {item.institution.includes("Telkom") ? (
                                  <>
                                    <motion.span 
                                      className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 focus-point"
                                      whileHover={{ y: -3, scale: 1.05 }}
                                    >
                                      <FiCpu className="mr-1.5" size={10} />
                                      AI & Machine Learning
                                    </motion.span>
                                    <motion.span 
                                      className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 focus-point"
                                      whileHover={{ y: -3, scale: 1.05 }}
                                    >
                                      <FiDatabase className="mr-1.5" size={10} />
                                      Big Data Analytics
                                    </motion.span>
                                    <motion.span 
                                      className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 focus-point"
                                      whileHover={{ y: -3, scale: 1.05 }}
                                    >
                                      <FiCode className="mr-1.5" size={10} />
                                      Software Development
                                    </motion.span>
                                  </>
                                ) : (
                                  <>
                                    <motion.span 
                                      className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 focus-point"
                                      whileHover={{ y: -3, scale: 1.05 }}
                                    >
                                      <FiCheck className="mr-1.5" size={10} />
                                      Science
                                    </motion.span>
                                    <motion.span 
                                      className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300 focus-point"
                                      whileHover={{ y: -3, scale: 1.05 }}
                                    >
                                      <FiCheck className="mr-1.5" size={10} />
                                      Mathematics
                                    </motion.span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
        
        {/* Certifications Content */}
        {activeTab === 'certifications' && (
          <motion.div
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            variants={containerVariants}
            className="max-w-4xl mx-auto"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {certifications.map((cert, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.3 } }}
                >
                  <a 
                    href={cert.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block h-full"
                  >
                    <Card className="h-full p-6 group border border-secondary-200/60 dark:border-secondary-700/40 group-hover:border-primary-300 dark:group-hover:border-primary-600/40 transition-all duration-300 relative overflow-hidden card-glow">
                      {/* Geometric Decoration */}
                      <div className="absolute -right-12 -bottom-12 w-32 h-32 rounded-full bg-primary-100/50 dark:bg-primary-900/20 
                      transform scale-0 group-hover:scale-100 transition-transform duration-500"></div>
                      <div className="absolute top-0 right-0 w-16 h-16 rounded-full bg-accent-50 dark:bg-accent-900/10 -translate-y-1/2 translate-x-1/2"></div>
                      
                      {/* Content */}
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                          <motion.div 
                            className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/30 dark:to-accent-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 shadow-md icon-glow"
                            whileHover={{ rotate: 10, scale: 1.1 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                          >
                            <FiAward size={22} />
                          </motion.div>
                          <motion.span 
                            className="px-3 py-1 text-xs font-medium rounded-full bg-accent-100 text-accent-800 dark:bg-accent-900/30 dark:text-accent-300 focus-point"
                            whileHover={{ scale: 1.1 }}
                          >
                            {cert.date}
                          </motion.span>
                        </div>
                        
                        <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                          {cert.title}
                        </h3>
                        
                        <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-4">
                          Issued by: <span className="font-medium">{cert.issuer}</span>
                        </p>
                        
                        <div className="mt-4 flex justify-end">
                          <span className="inline-flex items-center text-primary-600 dark:text-primary-400 text-sm font-medium group-hover:translate-x-2 transition-transform">
                            View Certificate
                            <svg className="ml-1 w-4 h-4 group-hover:ml-2 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </Card>
                  </a>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
        
        {/* Education Progress with enhanced styling */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 max-w-3xl mx-auto"
        >
          <div className="bg-white dark:bg-secondary-800/30 rounded-xl p-6 shadow-sm border border-secondary-200/60 dark:border-secondary-700/40 card-glow">
            <motion.h3 
              className="text-xl font-bold text-secondary-900 dark:text-white mb-6 flex items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <FiCpu className="mr-3 text-primary-600 dark:text-primary-400" size={22} />
              Educational Journey
            </motion.h3>
            
            <div className="relative">
              {/* Progress Bar with animation */}
              <div className="h-2 bg-secondary-100 dark:bg-secondary-700/50 rounded-full overflow-hidden mb-4">
                <motion.div 
                  className="h-full bg-gradient-to-r from-primary-500 to-accent-500 dark:from-primary-400 dark:to-accent-400 rounded-full" 
                  initial={{ width: "0%" }}
                  animate={{ width: "35%" }}
                  transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
                ></motion.div>
              </div>
              
              {/* Milestones with enhanced styling */}
              <div className="flex justify-between text-sm text-secondary-600 dark:text-secondary-400">
                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1 }}
                >
                  <div className="w-2 h-2 bg-primary-500 dark:bg-primary-400 rounded-full mx-auto mb-1"></div>
                  <span>High School</span>
                  <p className="text-xs text-primary-600 dark:text-primary-400">Completed</p>
                </motion.div>
                
                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                >
                  <div className="w-4 h-4 border-2 border-primary-500 dark:border-primary-400 bg-white dark:bg-true-black rounded-full mx-auto mb-1 animate-pulse"></div>
                  <span>Bachelors</span>
                  <p className="text-xs text-primary-600 dark:text-primary-400">In Progress</p>
                </motion.div>
                
                <motion.div 
                  className="text-center opacity-50"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 0.5, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.4 }}
                >
                  <div className="w-2 h-2 bg-secondary-300 dark:bg-secondary-600 rounded-full mx-auto mb-1"></div>
                  <span>Future Goals</span>
                  <p className="text-xs">Planned</p>
                </motion.div>
              </div>
            </div>
            
            {/* Quick Stats with enhanced animations */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <motion.div 
                className="bg-secondary-50 dark:bg-secondary-800/50 p-4 rounded-lg text-center shadow-sm"
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">2</div>
                <div className="text-sm text-secondary-600 dark:text-secondary-400">Institutions</div>
              </motion.div>
              
              <motion.div 
                className="bg-secondary-50 dark:bg-secondary-800/50 p-4 rounded-lg text-center shadow-sm"
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">5</div>
                <div className="text-sm text-secondary-600 dark:text-secondary-400">Certifications</div>
              </motion.div>
              
              <motion.div 
                className="bg-secondary-50 dark:bg-secondary-800/50 p-4 rounded-lg text-center shadow-sm"
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">3+</div>
                <div className="text-sm text-secondary-600 dark:text-secondary-400">Years</div>
              </motion.div>
              
              <motion.div 
                className="bg-secondary-50 dark:bg-secondary-800/50 p-4 rounded-lg text-center shadow-sm"
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">∞</div>
                <div className="text-sm text-secondary-600 dark:text-secondary-400">Learning</div>
              </motion.div>
            </div>
          </div>
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
        
        .animated-gradient {
          background-size: 200% 200%;
          animation: gradientShift 8s linear infinite;
        }
        
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </section>
  );
};

export default Education;