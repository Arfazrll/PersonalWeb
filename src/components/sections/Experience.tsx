import { useState, useRef, useEffect } from 'react';
import { 
  FiCalendar, 
  FiMapPin, 
  FiChevronDown, 
  FiChevronUp,
  FiClock,
  FiMoreHorizontal,
  FiArrowRight,
  FiAward,
  FiCode,
  FiBriefcase,
  FiStar
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { experiences } from '@/utils/data';
import { useTheme } from 'next-themes';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

// Definisikan interface untuk Experience
interface Experience {
  position: string;
  company: string;
  duration: string;
  location: string;
  description: string;
}

// Interface untuk ProcessedExperience setelah diproses
interface ProcessedExperience extends Experience {
  year: string;
  isNewYear: boolean;
}

// Memisahkan data menjadi current dan past experiences
const currentExperiences = experiences.filter((exp: Experience) => 
  exp.duration.toLowerCase().includes('present')
);

const pastExperiences = experiences.filter((exp: Experience) => 
  !exp.duration.toLowerCase().includes('present')
);

// Create a derived version of experiences with unique year markers
const processExperienceData = (expData: Experience[]): ProcessedExperience[] => {
  return expData.map((exp: Experience, index: number, array: Experience[]) => {
    // Extract the year from duration
    const yearMatch = exp.duration.match(/\d{4}/g);
    const currentYear = yearMatch ? yearMatch[0] : 'Present';
    
    // Determine if this is a new year compared to previous entry
    const prevYearMatch = index > 0 ? array[index - 1].duration.match(/\d{4}/g) : null;
    const prevYear = prevYearMatch ? prevYearMatch[0] : null;
    
    const isNewYear = currentYear !== prevYear;
    
    return {
      ...exp,
      year: currentYear,
      isNewYear
    };
  });
};

const processedCurrentExperiences = processExperienceData(currentExperiences);
const processedPastExperiences = processExperienceData(pastExperiences);

// List of example skills for each position
const getPositionSkills = (position: string): string[] => {
  const skillSets: Record<string, string[]> = {
    'Community Member': ['Teamwork', 'Networking', 'Event Planning', 'Public Speaking'],
    'Regional Member': ['Leadership', 'Project Management', 'Strategic Planning', 'Communication'],
    'Public Relations': ['Marketing', 'Communication', 'Content Creation', 'Social Media'],
    'Member of Machine Learning': ['Python', 'TensorFlow', 'Data Analysis', 'Neural Networks'],
    'Machine Learning Code Reviewer': ['Code Review', 'Algorithms', 'Best Practices', 'Documentation'],
    // Default skills if position doesn't match
    'default': ['Problem Solving', 'Communication', 'Teamwork', 'Time Management']
  };
  
  // Find skills that match the position or use part of position as key
  const matchingKey = Object.keys(skillSets).find(key => 
    position.includes(key)
  );
  
  return matchingKey ? skillSets[matchingKey] : skillSets['default'];
};

// Custom hook for intersection observer
function useInView(options = { threshold: 0.1, once: false }) {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
        // If once is true and element is intersecting, unobserve
        if (options.once && entry.isIntersecting) {
          observer.unobserve(currentRef);
        }
      },
      { threshold: options.threshold }
    );

    observer.observe(currentRef);

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [options.once, options.threshold]);

  return { ref, isInView };
}

const Experience = () => {
  const [expandedItem, setExpandedItem] = useState<number | null>(null);
  const [showAllCurrent, setShowAllCurrent] = useState(false);
  const [showAllPast, setShowAllPast] = useState(false);
  const { ref: timelineRef, isInView: timelineInView } = useInView();
  const { ref: titleRef, isInView: titleInView } = useInView({ threshold: 0.1, once: true });
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
  
  // Toggle expanded item
  const toggleExpand = (index: number) => {
    setExpandedItem(expandedItem === index ? null : index);
  };

  // Create a function to render company logo placeholder with 3D effect
  const renderCompanyLogo = (company: string) => {
    // Extract the first letter of each word in the company name
    const initials = company
      .split(' ')
      .map(word => word[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
    
    // Get random company color based on name for variety (but consistent for same company)
    const colors = [
      { bg: 'bg-gradient-to-br from-blue-500 to-teal-400', text: 'text-white' },
      { bg: 'bg-gradient-to-br from-purple-500 to-indigo-600', text: 'text-white' },
      { bg: 'bg-gradient-to-br from-amber-500 to-orange-400', text: 'text-white' },
      { bg: 'bg-gradient-to-br from-pink-500 to-rose-400', text: 'text-white' },
      { bg: 'bg-gradient-to-br from-green-500 to-emerald-400', text: 'text-white' },
    ];
    
    // Use initials as hash to consistently select the same color for the same company
    const colorIndex = company.charCodeAt(0) % colors.length;
    const selectedColor = colors[colorIndex];
      
    return (
      <div className={`w-12 h-12 rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl relative group`}>
        <div className={`${selectedColor.bg} w-full h-full flex items-center justify-center ${selectedColor.text} font-bold text-lg shadow-inner`}>
          {initials}
        </div>
        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
    );
  };

  // Function to render experience items with enhanced styling
  const renderExperienceItems = (experiences: ProcessedExperience[], isCurrentColumn = false, showAll = false) => {
    // Limit to 3 items if not showing all
    const displayExperiences = showAll ? experiences : experiences.slice(0, 3);
    
    return (
      <>
        {displayExperiences.map((experience: ProcessedExperience, index: number) => {
          const itemKey = isCurrentColumn ? index : index + 1000;
          const isExpanded = expandedItem === itemKey;
          const skills = getPositionSkills(experience.position);
          
          return (
            <motion.div 
              key={`${isCurrentColumn ? 'current' : 'past'}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: timelineInView ? 1 : 0, 
                y: timelineInView ? 0 : 20 
              }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="mb-10 last:mb-0"
            >
              {/* Year marker */}
              {experience.isNewYear && (
                <motion.div 
                  className="flex items-center mb-6"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-5 py-2 rounded-full text-sm font-medium inline-flex items-center shadow-md">
                    <FiCalendar className="mr-2" />
                    {experience.year}
                  </div>
                </motion.div>
              )}
              
              {/* Experience item */}
              <div className="relative">
                {/* Connecting line to timeline */}
                <div className="absolute left-6 top-0 h-full w-1 bg-gradient-to-b from-primary-400/20 to-primary-600/20 rounded-full hidden md:block"></div>
                
                {/* Timeline dot */}
                <div className="absolute left-6 top-6 transform -translate-x-1/2 hidden md:block">
                  <motion.div 
                    className={`w-4 h-4 rounded-full border-2 z-10 ${isExpanded ? 'bg-primary-500 border-primary-400' : 'bg-white dark:bg-secondary-800 border-primary-500'}`}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: isExpanded ? 1.2 : 1 }}
                    transition={{ duration: 0.3 }}
                  ></motion.div>
                </div>
                
                {/* Card with experience details */}
                <div className="md:ml-10">
                  <motion.div 
                    className={`rounded-xl overflow-hidden shadow-lg border-0 hover:shadow-xl transition-all duration-300 ${
                      isExpanded 
                        ? 'bg-gradient-to-b from-primary-50 to-white dark:from-primary-900/40 dark:to-secondary-800' 
                        : 'bg-white dark:bg-secondary-800 hover:-translate-y-1'
                    }`}
                    whileHover={{ y: isExpanded ? 0 : -4 }}
                    animate={{ 
                      boxShadow: isExpanded 
                        ? '0 10px 25px -5px rgba(59, 130, 246, 0.2), 0 8px 10px -6px rgba(59, 130, 246, 0.1)' 
                        : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)'
                    }}
                    transition={{ duration: 0.3 }}
                    layout
                  >
                    {/* Card Header with position and duration */}
                    <div 
                      className="p-6 cursor-pointer"
                      onClick={() => toggleExpand(itemKey)}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                        <div className="flex items-start gap-4">
                          {renderCompanyLogo(experience.company)}
                          <div>
                            <h3 className="text-xl font-bold text-secondary-900 dark:text-white">{experience.position}</h3>
                            <div className="mt-1">
                              <h4 className="text-lg font-semibold text-primary-600 dark:text-primary-400">
                                {experience.company}
                              </h4>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900/50 dark:text-primary-300 flex items-center shadow-sm">
                            <FiClock className="mr-1" />
                            {experience.duration}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-sm mb-3 text-secondary-600 dark:text-secondary-400">
                        <FiMapPin className="mr-1.5 text-secondary-500 dark:text-secondary-400" />
                        <span>{experience.location}</span>
                      </div>
                      
                      {/* Description preview - always visible */}
                      <p className={`text-secondary-700 dark:text-secondary-300 ${
                        isExpanded ? '' : 'line-clamp-2'
                      } leading-relaxed`}>
                        {experience.description}
                      </p>
                    </div>
                    
                    {/* Expanded content */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pt-0 pb-6">
                            <div className="h-px w-full bg-gradient-to-r from-transparent via-primary-200 dark:via-primary-800/30 to-transparent my-4"></div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <h5 className="font-semibold text-secondary-900 dark:text-white mb-3 flex items-center">
                                  <FiBriefcase className="mr-2 text-primary-500" />
                                  Key Responsibilities
                                </h5>
                                <ul className="space-y-2 text-secondary-700 dark:text-secondary-300">
                                  <li className="flex items-start">
                                    <div className="min-w-[8px] h-2 rounded-full bg-primary-500 dark:bg-primary-400 mt-2 mr-2"></div>
                                    <span>Collaborate with cross-functional teams to develop and implement innovative solutions.</span>
                                  </li>
                                  <li className="flex items-start">
                                    <div className="min-w-[8px] h-2 rounded-full bg-primary-500 dark:bg-primary-400 mt-2 mr-2"></div>
                                    <span>Create and maintain detailed documentation of projects and processes.</span>
                                  </li>
                                  <li className="flex items-start">
                                    <div className="min-w-[8px] h-2 rounded-full bg-primary-500 dark:bg-primary-400 mt-2 mr-2"></div>
                                    <span>Participate in regular team meetings to discuss progress and address challenges.</span>
                                  </li>
                                </ul>
                              </div>
                              
                              <div>
                                <h5 className="font-semibold text-secondary-900 dark:text-white mb-3 flex items-center">
                                  <FiAward className="mr-2 text-primary-500" />
                                  Skills Developed
                                </h5>
                                <div className="flex flex-wrap gap-2">
                                  {skills.map((skill, skillIndex) => (
                                    <div 
                                      key={skillIndex}
                                      className="px-3 py-1.5 rounded-lg text-sm bg-gradient-to-br from-secondary-100 to-secondary-50 dark:from-secondary-700/80 dark:to-secondary-800/80 text-secondary-700 dark:text-secondary-300 shadow-sm flex items-center"
                                    >
                                      <FiStar className="text-primary-500 dark:text-primary-400 mr-1.5" size={12} />
                                      {skill}
                                    </div>
                                  ))}
                                </div>
                                
                                <div className="mt-4">
                                  <h5 className="font-semibold text-secondary-900 dark:text-white mb-3 flex items-center">
                                    <FiCode className="mr-2 text-primary-500" />
                                    Technologies Used
                                  </h5>
                                  <div className="flex flex-wrap gap-2">
                                    {['Communication', 'Project Management', 'Research', 'Teamwork'].map((tech, techIndex) => (
                                      <span 
                                        key={techIndex}
                                        className="px-2 py-1 rounded-md text-xs bg-secondary-100/80 dark:bg-secondary-700/50 text-secondary-700 dark:text-secondary-300"
                                      >
                                        {tech}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    {/* Toggle button */}
                    <div className="px-6 pb-5">
                      <button
                        className="flex items-center text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors group"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpand(itemKey);
                        }}
                      >
                        {isExpanded ? (
                          <>
                            <FiChevronUp className="mr-1.5 transition-transform duration-300 group-hover:-translate-y-0.5" size={16} />
                            Show Less
                          </>
                        ) : (
                          <>
                            <FiChevronDown className="mr-1.5 transition-transform duration-300 group-hover:translate-y-0.5" size={16} />
                            Show More
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          );
        })}
        
        {/* "Show More" button - only if there are more than 3 experiences */}
        {experiences.length > 3 && (
          <motion.div 
            className="text-center mt-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => isCurrentColumn ? setShowAllCurrent(!showAllCurrent) : setShowAllPast(!showAllPast)}
              className="px-5 py-2.5 bg-gradient-to-r from-primary-500/90 to-primary-600/90 text-white rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center mx-auto"
            >
              {isCurrentColumn 
                ? (showAllCurrent ? (
                  <>
                    <FiChevronUp className="mr-2" />
                    Show Less
                  </>
                ) : (
                  <>
                    <FiMoreHorizontal className="mr-2" />
                    Show All ({experiences.length})
                  </>
                )) 
                : (showAllPast ? (
                  <>
                    <FiChevronUp className="mr-2" />
                    Show Less
                  </>
                ) : (
                  <>
                    <FiMoreHorizontal className="mr-2" />
                    Show All ({experiences.length})
                  </>
                ))
              }
            </motion.button>
          </motion.div>
        )}
      </>
    );
  };

  return (
    <section id="experience" className="py-20 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 z-0">
        {/* Tech Network Grid */}
        <div className={`tech-grid ${isDark ? 'tech-grid-dark' : 'tech-grid-light'}`}></div>
        
        {/* Animated particles */}
        <div className="particles-container">
          {Array.from({ length: 20 }).map((_, index) => (
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
          {Array.from({ length: 10 }).map((_, index) => (
            <div 
              key={index} 
              className="rain-column"
              style={{
                left: `${(index * 10) + Math.random() * 5}%`,
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
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Title */}
        <motion.div 
          ref={titleRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: titleInView ? 1 : 0, 
            y: titleInView ? 0 : 20 
          }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <div className="inline-block mb-4">
            <div className="flex items-center justify-center bg-primary-100 dark:bg-primary-900/40 w-16 h-16 rounded-full mx-auto mb-4">
              <FiBriefcase className="text-primary-600 dark:text-primary-400" size={28} />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-400 dark:to-primary-600">
              My Experience
            </h2>
          </div>
          <div className="h-1 w-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full mx-auto my-2"></div>
          <p className="text-secondary-600 dark:text-secondary-400 max-w-2xl mx-auto mt-6 text-lg">
            My professional journey and the experiences that have shaped my career in technology.
          </p>
        </motion.div>
        
        {/* Experience Timeline - Two Column Layout with Shadow Card Container */}
        <motion.div 
          ref={timelineRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: timelineInView ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl p-8 bg-white/50 dark:bg-secondary-900/30 shadow-lg backdrop-blur-sm border border-secondary-100 dark:border-secondary-800/40"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
            {/* Left Column - Past Experiences */}
            <div className="relative">
              <div className="absolute -top-8 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-primary-400/50 dark:via-primary-500/30 to-transparent rounded-full"></div>
              <motion.h3 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="text-xl font-bold text-center mb-8 text-secondary-900 dark:text-white pb-3 border-b border-primary-100 dark:border-primary-800/30 flex items-center justify-center"
              >
                <span className="bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 w-8 h-8 rounded-full flex items-center justify-center mr-2">
                  <FiArrowRight size={16} className="transform rotate-180" />
                </span>
                Past Experience
              </motion.h3>
              {renderExperienceItems(processedPastExperiences, false, showAllPast)}
            </div>
            
            {/* Right Column - Current Experiences */}
            <div className="relative">
              <div className="absolute -top-8 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-primary-400/50 dark:via-primary-500/30 to-transparent rounded-full"></div>
              <motion.h3 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-xl font-bold text-center mb-8 text-secondary-900 dark:text-white pb-3 border-b border-primary-100 dark:border-primary-800/30 flex items-center justify-center"
              >
                <span className="bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 w-8 h-8 rounded-full flex items-center justify-center mr-2">
                  <FiArrowRight size={16} />
                </span>
                Current Experience
              </motion.h3>
              {renderExperienceItems(processedCurrentExperiences, true, showAllCurrent)}
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
          pointer-events: none;
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
          pointer-events: none;
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

export default Experience;