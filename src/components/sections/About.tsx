import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { FiMapPin, FiMail, FiCalendar, FiCode, FiDatabase, FiCpu } from 'react-icons/fi';
import { personalInfo } from '@/utils/data';

// Define the particle type
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
}

// Animated background particle component
const AnimatedBackground = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  
  useEffect(() => {
    // Generate random particles
    const generateParticles = () => {
      const newParticles: Particle[] = [];
      const particleCount = 30;
      
      // Colors for light and dark mode
      const lightColors = [
        'rgba(59, 130, 246, 0.2)', // blue
        'rgba(99, 102, 241, 0.2)', // indigo
        'rgba(139, 92, 246, 0.2)', // violet
        'rgba(16, 185, 129, 0.15)', // emerald
      ];
      
      const darkColors = [
        'rgba(96, 165, 250, 0.3)', // blue - brighter in dark mode
        'rgba(129, 140, 248, 0.3)', // indigo - brighter in dark mode
        'rgba(167, 139, 250, 0.3)', // violet - brighter in dark mode
        'rgba(52, 211, 153, 0.25)', // emerald - brighter in dark mode
      ];
      
      const colors = isDark ? darkColors : lightColors;
      
      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 4 + 1,
          duration: Math.random() * 20 + 10,
          delay: Math.random() * 5,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
      
      setParticles(newParticles);
    };
    
    generateParticles();
    
    // Regenerate particles on window resize or theme change
    const handleResize = () => {
      generateParticles();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isDark]); // Regenerate particles when theme changes
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Gradient overlay to create navy blue effect on black background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-purple-50/30 dark:from-blue-900/40 dark:to-indigo-900/40 z-0"></div>
      
      {/* Animated grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 dark:opacity-10 z-0"></div>
      
      {/* Particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full z-0"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            boxShadow: isDark 
              ? `0 0 ${particle.size * 2}px ${particle.color.replace(')', ', 0.8)')}` 
              : `0 0 ${particle.size}px ${particle.color.replace(')', ', 0.5)')}`,
            animation: `float ${particle.duration}s infinite ease-in-out ${particle.delay}s, pulse ${particle.duration/2}s infinite ease-in-out ${particle.delay}s`
          }}
        />
      ))}
      
      {/* Large glowing orbs - different for light and dark mode */}
      <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-blue-100/20 dark:bg-blue-800/20 blur-3xl z-0 animate-pulse-slow"></div>
      <div className="absolute -bottom-40 -right-20 w-96 h-96 rounded-full bg-purple-100/20 dark:bg-indigo-800/20 blur-3xl z-0 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
    </div>
  );
};

const EnhancedAbout = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeInOut" }
    }
  };

  return (
    <section id="about" className="relative py-20 bg-white dark:bg-black text-gray-800 dark:text-white overflow-hidden transition-colors duration-300">
      {/* Animated background */}
      <AnimatedBackground />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center">
            <div className="h-px w-12 bg-blue-500 dark:bg-blue-400 mr-4"></div>
            <h2 className="text-3xl md:text-4xl font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              About Me
            </h2>
            <div className="h-px w-12 bg-blue-500 dark:bg-blue-400 ml-4"></div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image and Info */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Image */}
            <motion.div
              variants={itemVariants}
              className="relative mx-auto lg:mx-0 w-full max-w-md aspect-square rounded-2xl overflow-hidden border-4 border-gray-100 dark:border-blue-900/30 shadow-xl"
            >
              <div className="w-full h-full bg-gradient-to-br from-blue-100/40 to-purple-100/40 dark:from-blue-900/40 dark:to-purple-900/40 flex items-center justify-center relative">
                {/* Rotating border effect */}
                <div className="absolute inset-0 border-2 border-blue-300/20 dark:border-blue-500/20 rounded-full animate-spin-slow"></div>
                <div className="absolute inset-2 border-2 border-purple-300/10 dark:border-purple-500/10 rounded-full animate-spin-slow" style={{ animationDirection: 'reverse' }}></div>
                
                {/* Initials */}
                <span className="text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 animate-pulse-slow">SA</span>
                
                {/* Icons orbiting around the profile */}
                <div 
                  className="absolute w-10 h-10 rounded-full bg-white dark:bg-blue-900 shadow-lg flex items-center justify-center animate-orbit"
                  style={{ animationDuration: '20s' }}
                >
                  <FiCode className="text-blue-500 dark:text-blue-400" />
                </div>
                <div 
                  className="absolute w-10 h-10 rounded-full bg-white dark:bg-blue-900 shadow-lg flex items-center justify-center animate-orbit"
                  style={{ animationDuration: '15s', animationDelay: '5s' }}
                >
                  <FiDatabase className="text-purple-500 dark:text-purple-400" />
                </div>
                <div 
                  className="absolute w-10 h-10 rounded-full bg-white dark:bg-blue-900 shadow-lg flex items-center justify-center animate-orbit"
                  style={{ animationDuration: '25s', animationDelay: '2s' }}
                >
                  <FiCpu className="text-indigo-500 dark:text-indigo-400" />
                </div>
              </div>
            </motion.div>

            {/* Contact Info Cards */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-blue-900/20 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-blue-500/20 hover:border-blue-300 dark:hover:border-blue-500/40 transition-all duration-300 group">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:text-blue-500 dark:group-hover:text-blue-300 transition-colors">
                  <FiMapPin width={20} height={20} />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-blue-200/80">Location</h3>
                  <p className="font-medium text-gray-800 dark:text-white">{personalInfo.location}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-blue-900/20 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-blue-500/20 hover:border-blue-300 dark:hover:border-blue-500/40 transition-all duration-300 group">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:text-blue-500 dark:group-hover:text-blue-300 transition-colors">
                  <FiMail width={20} height={20} />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-blue-200/80">Email</h3>
                  <p className="font-medium text-gray-800 dark:text-white">{personalInfo.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-blue-900/20 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-blue-500/20 hover:border-blue-300 dark:hover:border-blue-500/40 transition-all duration-300 group sm:col-span-2">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:text-blue-500 dark:group-hover:text-blue-300 transition-colors">
                  <FiCalendar width={20} height={20} />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-blue-200/80">Experience</h3>
                  <p className="font-medium text-gray-800 dark:text-white">Data & Technology Enthusiast</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* About Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-6 bg-gray-50 dark:bg-blue-900/10 backdrop-blur-sm p-6 rounded-xl border border-gray-200 dark:border-blue-500/20 hover:shadow-lg transition-all duration-500"
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                Information Technology Student & AI/Big Data Enthusiast
              </span>
            </h3>

            <div className="space-y-4 text-gray-700 dark:text-blue-100/90">
              <p>
                {personalInfo.about}
              </p>
              <p>
                In addition, I am pursuing certifications in Machine Learning and Data Analysis, reflecting my commitment to continuous learning and staying at the forefront of technological advancements. I am eager to explore opportunities that allow me to apply my expertise, expand my knowledge, and contribute meaningfully to the technology industry.
              </p>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-blue-500/20">
              <h4 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                What I&apos;m Focusing On
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start group">
                  <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-500/20 flex-shrink-0 flex items-center justify-center mt-1 mr-3 group-hover:scale-110 transition-transform">
                    <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse"></div>
                  </div>
                  <span className="text-gray-700 dark:text-blue-100/90 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">Deepening my understanding of Artificial Intelligence and Machine Learning</span>
                </li>
                <li className="flex items-start group">
                  <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-500/20 flex-shrink-0 flex items-center justify-center mt-1 mr-3 group-hover:scale-110 transition-transform">
                    <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse"></div>
                  </div>
                  <span className="text-gray-700 dark:text-blue-100/90 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">Developing practical skills in Big Data Analytics and IoT systems</span>
                </li>
                <li className="flex items-start group">
                  <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-500/20 flex-shrink-0 flex items-center justify-center mt-1 mr-3 group-hover:scale-110 transition-transform">
                    <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse"></div>
                  </div>
                  <span className="text-gray-700 dark:text-blue-100/90 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">Building innovative technology solutions for real-world business problems</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Additional animation: moving light beam effect */}
      <div className="absolute top-0 left-0 w-full h-20 overflow-hidden">
        <div 
          className="w-40 h-[800px] bg-blue-400/10 rotate-45 absolute -top-[600px] blur-xl"
          style={{
            animation: 'moveBeam 8s linear infinite',
            transformOrigin: 'center'
          }}
        ></div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes moveBeam {
          0% {
            left: -10%;
          }
          100% {
            left: 110%;
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-25px) translateX(15px);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 0.1;
            transform: scale(0.8);
          }
          50% {
            opacity: 0.3;
            transform: scale(1.2);
          }
        }
        
        @keyframes orbit {
          0% {
            transform: rotate(0deg) translateX(100px) rotate(0deg);
          }
          100% {
            transform: rotate(360deg) translateX(100px) rotate(-360deg);
          }
        }
      `}</style>
    </section>
  );
};

export default EnhancedAbout;