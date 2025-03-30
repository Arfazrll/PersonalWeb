import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiAward, FiChevronRight, FiExternalLink, FiCode, FiCloud, FiDatabase, FiCheckCircle, FiServer } from 'react-icons/fi';
import { certifications } from '@/utils/data';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useTheme } from 'next-themes';

const Certifications = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [sectionVisible, setSectionVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
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
      setSectionVisible(true);
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

    // Observer for section title
    const titleObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSectionVisible(true);
          titleObserver.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: '0px' }
    );
    
    if (titleRef.current) {
      titleObserver.observe(titleRef.current);
    }

    return () => {
      observer.disconnect();
      titleObserver.disconnect();
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
  
  // Get icon based on certification title/issuer
  const getCertIcon = (title: string, issuer: string) => {
    const lowerTitle = title.toLowerCase();
    const lowerIssuer = issuer.toLowerCase();
    
    if (lowerTitle.includes('python') || lowerTitle.includes('programming')) {
      return <FiCode size={18} />;
    } else if (lowerTitle.includes('aws') || lowerIssuer.includes('aws')) {
      return <FiCloud size={18} />;
    } else if (lowerTitle.includes('sql') || lowerTitle.includes('data')) {
      return <FiDatabase size={18} />;
    } else if (lowerTitle.includes('react')) {
      return <FiServer size={18} />;
    } else {
      return <FiAward size={18} />;
    }
  };
  
  // Filter certifications by type/category
  const filterCertifications = () => {
    if (activeFilter === 'all') {
      return certifications;
    }
    
    return certifications.filter(cert => {
      const lowerTitle = cert.title.toLowerCase();
      
      if (activeFilter === 'programming' && (lowerTitle.includes('python') || lowerTitle.includes('programming') || lowerTitle.includes('react'))) {
        return true;
      } else if (activeFilter === 'data' && (lowerTitle.includes('sql') || lowerTitle.includes('data'))) {
        return true;
      } else if (activeFilter === 'cloud' && lowerTitle.includes('aws')) {
        return true;
      }
      
      return false;
    });
  };
  
  const filteredCertifications = filterCertifications();

  return (
    <section 
      id="certifications" 
      ref={sectionRef}
      className="py-20 relative overflow-hidden bg-secondary-50 dark:bg-secondary-900/30"
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
        
        {/* Code snippets decoration with more tech-related terms */}
        <div className="code-snippets">
          {Array.from({ length: 8 }).map((_, index) => (
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
              {index === 0 ? 'const aws = require("aws-sdk");' : 
               index === 1 ? 'import TensorFlow as tf' : 
               index === 2 ? 'SELECT * FROM certifications' :
               index === 3 ? 'Certificate.verify()' : 
               index === 4 ? 'import Skills from "learning"' : 
               index === 5 ? 'const knowledge = await learn()' :
               index === 6 ? 'docker-compose up -d' :
               'git commit -m "Add new skills"'}
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
        {/* Section Title with enhanced animation */}
        <motion.div
          ref={titleRef}
          id="certifications-title"
          initial={{ opacity: 0, y: 20 }}
          animate={sectionVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-accent-500 dark:from-primary-400 dark:to-accent-400 mb-6">
            Professional Certifications
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full mx-auto mt-2 opacity-70"></div>
          <p className="text-secondary-600 dark:text-secondary-400 max-w-2xl mx-auto mt-6 text-lg">
            Credentials that demonstrate my expertise and commitment to continuous learning in various technologies.
          </p>
        </motion.div>
        
        {/* Filter Controls with enhanced animation and styling */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          <motion.button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 shadow-sm ${
              activeFilter === 'all'
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md'
                : 'bg-white dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700/70'
            }`}
            whileHover={{ y: -3, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            All Certifications
          </motion.button>
          <motion.button
            onClick={() => setActiveFilter('programming')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 shadow-sm ${
              activeFilter === 'programming'
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md'
                : 'bg-white dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700/70'
            }`}
            whileHover={{ y: -3, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="flex items-center gap-1">
              <FiCode size={14} />
              Programming
            </span>
          </motion.button>
          <motion.button
            onClick={() => setActiveFilter('data')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 shadow-sm ${
              activeFilter === 'data'
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md'
                : 'bg-white dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700/70'
            }`}
            whileHover={{ y: -3, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="flex items-center gap-1">
              <FiDatabase size={14} />
              Data
            </span>
          </motion.button>
          <motion.button
            onClick={() => setActiveFilter('cloud')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 shadow-sm ${
              activeFilter === 'cloud'
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md'
                : 'bg-white dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700/70'
            }`}
            whileHover={{ y: -3, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="flex items-center gap-1">
              <FiCloud size={14} />
              Cloud
            </span>
          </motion.button>
        </motion.div>
        
        {/* Certifications Grid with enhanced animation and styling */}
        <motion.div
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={containerVariants}
          className="max-w-4xl mx-auto"
        >
          {filteredCertifications.length === 0 ? (
            <motion.div 
              variants={itemVariants}
              className="text-center py-12 bg-white dark:bg-secondary-800 rounded-lg shadow-sm card-glow"
            >
              <div className="text-4xl mb-4 text-secondary-400 dark:text-secondary-600">
                <FiAward className="mx-auto" />
              </div>
              <p className="text-secondary-600 dark:text-secondary-400">No certifications found for this filter.</p>
            </motion.div>
          ) : (
            filteredCertifications.map((cert, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="mb-6 last:mb-0"
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
              >
                <div className="relative bg-white dark:bg-secondary-800 rounded-lg border border-secondary-200/60 dark:border-secondary-700/40 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-5 pl-16 overflow-hidden group card-glow">
                  {/* Decorative elements */}
                  <div className="absolute top-0 left-0 h-full w-1.5 bg-gradient-to-b from-primary-500 to-accent-500 dark:from-primary-400 dark:to-accent-400 opacity-70 group-hover:w-2.5 transition-all duration-300"></div>
                  <div className="absolute -right-12 -bottom-12 w-32 h-32 bg-primary-100/30 dark:bg-primary-900/10 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-500"></div>
                  
                  {/* Icon with animation */}
                  <div className="absolute left-5 top-5">
                    <motion.div 
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/30 dark:to-accent-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 icon-glow shadow-md"
                      whileHover={{ rotate: 10, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      {getCertIcon(cert.title, cert.issuer)}
                    </motion.div>
                  </div>
                  
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-secondary-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {cert.title}
                      </h3>
                      <p className="text-primary-600 dark:text-primary-400 text-sm mt-1 flex items-center">
                        <span className="mr-1">Issued by:</span>
                        {cert.issuer}
                        {cert.issuer === 'AWS Academy' && (
                          <motion.span 
                            className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 focus-point"
                            whileHover={{ scale: 1.1 }}
                          >
                            <FiCheckCircle size={10} className="mr-1" />
                            Verified
                          </motion.span>
                        )}
                      </p>
                      <p className="text-secondary-500 dark:text-secondary-400 text-sm mt-1">Issued: {cert.date}</p>
                    </div>
                    
                    <motion.a 
                      href={cert.link} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-secondary-100 dark:bg-secondary-700 text-secondary-800 dark:text-secondary-200 hover:bg-primary-100 hover:text-primary-700 dark:hover:bg-primary-900/30 dark:hover:text-primary-300 transition-colors duration-300 shadow-sm focus-point"
                      aria-label={`View ${cert.title} certification`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FiExternalLink size={12} className="mr-1.5" />
                      View Certificate
                    </motion.a>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-secondary-100 dark:border-secondary-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {/* Tags based on certification type with enhanced animation */}
                        {cert.title.toLowerCase().includes('python') && (
                          <motion.span 
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 mr-2 focus-point"
                            whileHover={{ y: -3, scale: 1.05 }}
                          >
                            Python
                          </motion.span>
                        )}
                        {cert.title.toLowerCase().includes('sql') && (
                          <motion.span 
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 mr-2 focus-point"
                            whileHover={{ y: -3, scale: 1.05 }}
                          >
                            SQL
                          </motion.span>
                        )}
                        {cert.title.toLowerCase().includes('aws') && (
                          <motion.span 
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 mr-2 focus-point"
                            whileHover={{ y: -3, scale: 1.05 }}
                          >
                            AWS
                          </motion.span>
                        )}
                        {cert.title.toLowerCase().includes('react') && (
                          <motion.span 
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300 mr-2 focus-point"
                            whileHover={{ y: -3, scale: 1.05 }}
                          >
                            React
                          </motion.span>
                        )}
                        
                        {/* Add a special highlight for Gold certifications */}
                        {cert.title.toLowerCase().includes('gold') && (
                          <motion.span 
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 focus-point"
                            whileHover={{ y: -3, scale: 1.05 }}
                          >
                            Gold Level
                          </motion.span>
                        )}
                      </div>
                      
                      <motion.a
                        href={cert.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 group-hover:translate-x-1 transition-all duration-300"
                        whileHover={{ x: 5 }}
                      >
                        Details 
                        <FiChevronRight size={16} className="ml-1 group-hover:ml-2 transition-all duration-300" />
                      </motion.a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
        
        {/* Info Banner with enhanced styling and animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-12 max-w-4xl mx-auto"
        >
          <div className="bg-white dark:bg-secondary-800/60 rounded-lg border border-secondary-200/60 dark:border-secondary-700/40 p-6 shadow-md card-glow relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute -right-12 -bottom-12 w-32 h-32 bg-primary-100/30 dark:bg-primary-900/10 rounded-full opacity-50"></div>
            <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-primary-500 to-accent-500 dark:from-primary-400 dark:to-accent-400 opacity-70"></div>
            
            <div className="flex flex-col md:flex-row gap-6 items-center relative z-10">
              <div className="flex-shrink-0">
                <motion.div 
                  className="w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/30 dark:to-accent-900/30 text-primary-600 dark:text-primary-400 shadow-md icon-glow"
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <FiAward size={24} />
                </motion.div>
              </div>
              <div className="flex-grow text-center md:text-left">
                <h3 className="text-lg font-bold text-secondary-900 dark:text-white mb-2">Continuous Learning</h3>
                <p className="text-secondary-600 dark:text-secondary-400">
                  In todays rapidly evolving tech landscape, continuous learning is essential. 
                  I am actively pursuing additional certifications to deepen my expertise in AI, machine learning, 
                  and data analytics technologies.
                </p>
              </div>
              <div className="flex-shrink-0">
                <motion.div 
                  className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md"
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-2xl font-semibold">{certifications.length}</span>
                  <span className="ml-2 text-sm">Certificates</span>
                </motion.div>
              </div>
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
      `}</style>
    </section>
  );
};

export default Certifications;