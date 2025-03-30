import { useState, useRef, useEffect } from 'react';
import { 
  FiCode, 
  FiGlobe, 
  FiSettings, 
  FiAward, 
  FiCpu, 
  FiDatabase, 
  FiServer,
  FiMonitor,
  FiTerminal
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { skills } from '@/utils/data';
import Card from '../ui/Card';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useTheme } from 'next-themes';

type SkillCategory = {
  name: string;
  icon: JSX.Element;
  items: string[];
};

const Skills = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [prefersReducedMotion]);

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

  // Organized skill categories
  const skillCategories: SkillCategory[] = [
    {
      name: "Programming & Technical",
      icon: <FiCode size={24} />,
      items: skills.technical || []
    },
    {
      name: "Tools & Technologies",
      icon: <FiSettings size={24} />,
      items: skills.tools || []
    },
    {
      name: "IoT & Systems",
      icon: <FiCpu size={24} />,
      items: ["Real-time Monitoring", "Internet of Things (IoT)", "Database Management System (DBMS)"]
    },
  ];

  const [activeTab, setActiveTab] = useState<string>(skillCategories[0].name);

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
      id="skills" 
      ref={sectionRef}
      className="py-20 bg-white dark:bg-true-black relative overflow-hidden"
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
        
        {/* Code snippets decoration */}
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
              {index === 0 ? 'function learnSkill() { }' : 
               index === 1 ? 'const skills = ["Python", "SQL"];' : 
               index === 2 ? 'import tensorflow as tf' :
               index === 3 ? 'class DataAnalysis { }' : 
               'SELECT * FROM skills'}
            </div>
          ))}
        </div>
      </div>
      
      {/* Background Mesh Pattern */}
      <div 
        className="absolute inset-0 bg-mesh-pattern opacity-5 dark:opacity-5 -z-10"
        aria-hidden="true"
      ></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Title with enhanced animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-accent-500 dark:from-primary-400 dark:to-accent-400 mb-6">
            Skills & Expertise
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full mx-auto mt-2 opacity-70"></div>
          <p className="text-secondary-600 dark:text-secondary-400 max-w-2xl mx-auto mt-6 text-lg">
            My technical toolkit and areas of expertise that enable me to build innovative solutions.
          </p>
        </motion.div>
        
        {/* Skill Tabs with enhanced animation and styling */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-wrap justify-center gap-4 mb-10"
        >
          {skillCategories.map((category, index) => (
            <motion.button
              key={category.name}
              onClick={() => setActiveTab(category.name)}
              className={`px-4 py-2.5 rounded-lg flex items-center gap-2 text-sm font-medium transition-all duration-300 shadow-sm ${
                activeTab === category.name 
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white' 
                  : 'bg-white dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700/80'
              } card-glow`}
              whileHover={{ y: -3, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.3, 
                delay: index * 0.1,
                ease: [0.22, 1, 0.36, 1] 
              }}
            >
              <span className={activeTab === category.name ? 'text-white' : 'text-primary-600 dark:text-primary-400'}>
                {category.icon}
              </span>
              {category.name}
            </motion.button>
          ))}
        </motion.div>
        
        {/* Skills Content with enhanced animation */}
        <div className="max-w-5xl mx-auto h-[600px] relative">
          <AnimatePresence>
            {skillCategories.map((category) => (
              activeTab === category.name && (
                <motion.div 
                  key={category.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  <Card className="p-6 md:p-8 card-glow relative overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-primary-500 to-accent-500 dark:from-primary-400 dark:to-accent-400 opacity-70"></div>
                    <div className="absolute -right-12 -bottom-12 w-32 h-32 bg-primary-100/30 dark:bg-primary-900/10 rounded-full"></div>
                    
                    <motion.div 
                      className="flex items-center mb-6"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div 
                        className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/30 dark:to-accent-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 mr-4 shadow-md icon-glow"
                        whileHover={{ rotate: 10, scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        {category.icon}
                      </motion.div>
                      <h3 className="text-xl font-bold text-secondary-900 dark:text-white">{category.name}</h3>
                    </motion.div>
                    
                    {/* Skills Grid with enhanced animation */}
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
                    >
                      {category.items.map((skill) => (
                        <motion.div
                          key={skill}
                          variants={itemVariants}
                          whileHover={{ y: -5, scale: 1.02, transition: { duration: 0.2 } }}
                          className="card-glow"
                        >
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary-50 dark:bg-secondary-800/60 hover:bg-primary-50 hover:dark:bg-primary-900/10 transition-colors group">
                            <motion.div 
                              className="w-8 h-8 rounded-md flex items-center justify-center bg-white dark:bg-secondary-700 shadow-sm group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 transition-colors icon-glow"
                              whileHover={{ rotate: 5, scale: 1.1 }}
                              transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                              {getSkillIcon(skill)}
                            </motion.div>
                            <span className="font-medium text-secondary-800 dark:text-secondary-200 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors">
                              {skill}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                    
                    {/* Additional information section with enhanced animation */}
                    {category.name === "Programming & Technical" && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"
                      >
                        <motion.div 
                          className="p-4 bg-primary-50 dark:bg-primary-900/10 rounded-lg border border-primary-100 dark:border-primary-800/30 card-glow"
                          whileHover={{ y: -5, scale: 1.02 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          <h4 className="font-semibold text-primary-700 dark:text-primary-400 mb-2 flex items-center gap-2">
                            <FiAward size={16} />
                            Specialized Areas
                          </h4>
                          <ul className="space-y-2 text-secondary-700 dark:text-secondary-300 text-sm">
                            <motion.li 
                              className="flex items-center"
                              whileHover={{ x: 3 }}
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-primary-600 dark:bg-primary-400 mr-2"></div>
                              Real-time Monitoring Systems
                            </motion.li>
                            <motion.li 
                              className="flex items-center"
                              whileHover={{ x: 3 }}
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-primary-600 dark:bg-primary-400 mr-2"></div>
                              Internet of Things (IoT) Development
                            </motion.li>
                            <motion.li 
                              className="flex items-center"
                              whileHover={{ x: 3 }}
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-primary-600 dark:bg-primary-400 mr-2"></div>
                              Database Management Systems
                            </motion.li>
                          </ul>
                        </motion.div>
                        
                        <motion.div 
                          className="p-4 bg-secondary-50 dark:bg-secondary-800/60 rounded-lg border border-secondary-100 dark:border-secondary-700/30 card-glow"
                          whileHover={{ y: -5, scale: 1.02 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          <h4 className="font-semibold text-secondary-900 dark:text-white mb-2 flex items-center gap-2">
                            <FiTerminal size={16} />
                            Technical Interests
                          </h4>
                          <ul className="space-y-2 text-secondary-700 dark:text-secondary-300 text-sm">
                            <motion.li 
                              className="flex items-center"
                              whileHover={{ x: 3 }}
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-secondary-500 dark:bg-secondary-400 mr-2"></div>
                              Machine Learning & AI
                            </motion.li>
                            <motion.li 
                              className="flex items-center"
                              whileHover={{ x: 3 }}
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-secondary-500 dark:bg-secondary-400 mr-2"></div>
                              Big Data Analytics
                            </motion.li>
                            <motion.li 
                              className="flex items-center"
                              whileHover={{ x: 3 }}
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-secondary-500 dark:bg-secondary-400 mr-2"></div>
                              Business Intelligence
                            </motion.li>
                          </ul>
                        </motion.div>
                      </motion.div>
                    )}
                    
                    {/* For Tools section */}
                    {category.name === "Tools & Technologies" && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"
                      >
                        <motion.div 
                          className="p-4 bg-primary-50 dark:bg-primary-900/10 rounded-lg border border-primary-100 dark:border-primary-800/30 card-glow"
                          whileHover={{ y: -5, scale: 1.02 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          <h4 className="font-semibold text-primary-700 dark:text-primary-400 mb-2 flex items-center gap-2">
                            <FiAward size={16} />
                            Development Tools
                          </h4>
                          <ul className="space-y-2 text-secondary-700 dark:text-secondary-300 text-sm">
                            <motion.li 
                              className="flex items-center"
                              whileHover={{ x: 3 }}
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-primary-600 dark:bg-primary-400 mr-2"></div>
                              Git & Version Control
                            </motion.li>
                            <motion.li 
                              className="flex items-center"
                              whileHover={{ x: 3 }}
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-primary-600 dark:bg-primary-400 mr-2"></div>
                              CI/CD Pipelines
                            </motion.li>
                            <motion.li 
                              className="flex items-center"
                              whileHover={{ x: 3 }}
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-primary-600 dark:bg-primary-400 mr-2"></div>
                              Docker & Containerization
                            </motion.li>
                          </ul>
                        </motion.div>
                        
                        <motion.div 
                          className="p-4 bg-secondary-50 dark:bg-secondary-800/60 rounded-lg border border-secondary-100 dark:border-secondary-700/30 card-glow"
                          whileHover={{ y: -5, scale: 1.02 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          <h4 className="font-semibold text-secondary-900 dark:text-white mb-2 flex items-center gap-2">
                            <FiTerminal size={16} />
                            Cloud Platforms
                          </h4>
                          <ul className="space-y-2 text-secondary-700 dark:text-secondary-300 text-sm">
                            <motion.li 
                              className="flex items-center"
                              whileHover={{ x: 3 }}
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-secondary-500 dark:bg-secondary-400 mr-2"></div>
                              AWS Services
                            </motion.li>
                            <motion.li 
                              className="flex items-center"
                              whileHover={{ x: 3 }}
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-secondary-500 dark:bg-secondary-400 mr-2"></div>
                              Google Cloud Platform
                            </motion.li>
                            <motion.li 
                              className="flex items-center"
                              whileHover={{ x: 3 }}
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-secondary-500 dark:bg-secondary-400 mr-2"></div>
                              Serverless Architecture
                            </motion.li>
                          </ul>
                        </motion.div>
                      </motion.div>
                    )}
                    
                    {/* For IoT section */}
                    {category.name === "IoT & Systems" && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"
                      >
                        <motion.div 
                          className="p-4 bg-primary-50 dark:bg-primary-900/10 rounded-lg border border-primary-100 dark:border-primary-800/30 card-glow"
                          whileHover={{ y: -5, scale: 1.02 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          <h4 className="font-semibold text-primary-700 dark:text-primary-400 mb-2 flex items-center gap-2">
                            <FiCpu size={16} />
                            IoT Expertise
                          </h4>
                          <ul className="space-y-2 text-secondary-700 dark:text-secondary-300 text-sm">
                            <motion.li 
                              className="flex items-center"
                              whileHover={{ x: 3 }}
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-primary-600 dark:bg-primary-400 mr-2"></div>
                              Sensor Integration
                            </motion.li>
                            <motion.li 
                              className="flex items-center"
                              whileHover={{ x: 3 }}
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-primary-600 dark:bg-primary-400 mr-2"></div>
                              Data Collection Systems
                            </motion.li>
                            <motion.li 
                              className="flex items-center"
                              whileHover={{ x: 3 }}
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-primary-600 dark:bg-primary-400 mr-2"></div>
                              Protocol Implementation
                            </motion.li>
                          </ul>
                        </motion.div>
                        
                        <motion.div 
                          className="p-4 bg-secondary-50 dark:bg-secondary-800/60 rounded-lg border border-secondary-100 dark:border-secondary-700/30 card-glow"
                          whileHover={{ y: -5, scale: 1.02 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          <h4 className="font-semibold text-secondary-900 dark:text-white mb-2 flex items-center gap-2">
                            <FiDatabase size={16} />
                            Database Management
                          </h4>
                          <ul className="space-y-2 text-secondary-700 dark:text-secondary-300 text-sm">
                            <motion.li 
                              className="flex items-center"
                              whileHover={{ x: 3 }}
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-secondary-500 dark:bg-secondary-400 mr-2"></div>
                              Time-Series Databases
                            </motion.li>
                            <motion.li 
                              className="flex items-center"
                              whileHover={{ x: 3 }}
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-secondary-500 dark:bg-secondary-400 mr-2"></div>
                              Data Warehousing
                            </motion.li>
                            <motion.li 
                              className="flex items-center"
                              whileHover={{ x: 3 }}
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-secondary-500 dark:bg-secondary-400 mr-2"></div>
                              ETL Process Design
                            </motion.li>
                          </ul>
                        </motion.div>
                      </motion.div>
                    )}
                  </Card>
                </motion.div>
              )
            ))}
          </AnimatePresence>
        </div>
        
        {/* Skill Level Legend with enhanced animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex justify-center"
        >
          <div className="flex flex-wrap items-center gap-4 justify-center text-sm text-secondary-600 dark:text-secondary-400 bg-white dark:bg-secondary-800/50 backdrop-blur-sm rounded-xl border border-gray-100 dark:border-gray-700/50 shadow-md card-glow p-4">
            <span className="font-medium">Skill Level:</span>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-primary-200 dark:bg-primary-900/40 rounded-full mr-2"></div>
              <span>Beginner</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-primary-400 dark:bg-primary-700 rounded-full mr-2"></div>
              <span>Intermediate</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-primary-600 dark:bg-primary-500 rounded-full mr-2"></div>
              <span>Advanced</span>
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
      `}</style>
    </section>
  );
};

// Helper function to get an icon for a skill
const getSkillIcon = (skill: string) => {
  const skillLower = skill.toLowerCase();
  
  if (skillLower.includes('python')) return <FiCode className="text-blue-500" />;
  if (skillLower.includes('data')) return <FiDatabase className="text-green-500" />;
  if (skillLower.includes('iot') || skillLower.includes('monitoring')) return <FiCpu className="text-orange-500" />;
  if (skillLower.includes('sql')) return <FiDatabase className="text-blue-500" />;
  if (skillLower.includes('react')) return <FiMonitor className="text-blue-400" />;
  if (skillLower.includes('web')) return <FiGlobe className="text-indigo-500" />;
  if (skillLower.includes('api')) return <FiServer className="text-purple-500" />;
  
  // Default icon
  return <FiSettings className="text-gray-500" />;
};

export default Skills;