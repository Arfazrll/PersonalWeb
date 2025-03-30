import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { FiCalendar, FiClock, FiMapPin, FiStar, FiTag, FiPlus, FiMinus } from 'react-icons/fi';

interface TimelineItem {
  id: string | number;
  title: string;
  subtitle?: string;
  date: string;
  description: string;
  icon?: React.ReactNode;
  tags?: string[];
  location?: string;
  isActive?: boolean;
}

interface TimelineProps {
  items: TimelineItem[];
  title?: string;
  alternating?: boolean;
  className?: string;
  theme?: 'default' | 'tech' | 'minimal';
  expandable?: boolean;
}

const Timeline: React.FC<TimelineProps> = ({
  items,
  title,
  alternating = false,
  className = '',
  theme = 'default',
  expandable = false
}) => {
  // State for animation visibility
  const [isVisible, setIsVisible] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Record<string | number, boolean>>({});
  const [hoveredItem, setHoveredItem] = useState<string | number | null>(null);
  
  // Ref for timeline container
  const timelineRef = useRef<HTMLDivElement>(null);
  
  // Theme
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const prefersReducedMotion = usePrefersReducedMotion();
  
  // Mouse position for interactive gradient effect
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Set up IntersectionObserver to detect when timeline enters viewport
  useEffect(() => {
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }
    
    const currentRef = timelineRef.current;
    if (!currentRef) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Stop observing after becoming visible
        }
      },
      {
        threshold: 0.1, // Trigger when at least 10% of element is visible
        rootMargin: '0px' // No additional margin
      }
    );
    
    observer.observe(currentRef);
    
    // Cleanup observer on unmount
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

  // Toggle item expansion
  const toggleItemExpansion = (id: string | number) => {
    if (!expandable) return;
    
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Generate random particles for tech theme
  const generateParticles = (count: number) => {
    return Array.from({ length: count }).map((_, index) => (
      <div 
        key={index}
        className={`absolute w-2 h-2 rounded-full ${isDark ? 'bg-primary-500/20' : 'bg-primary-500/10'}`}
        style={{
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animation: `float ${5 + Math.random() * 10}s infinite ease-in-out ${Math.random() * 5}s`
        }}
      />
    ));
  };

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
  
  // Determine dot color based on item date or active status
  const getDotColor = useCallback((item: TimelineItem, index: number) => {
    if (item.isActive) {
      return 'bg-green-500 dark:bg-green-400';
    }
    
    // Check if date includes "Present"
    if (item.date.toLowerCase().includes('present')) {
      return 'bg-primary-500 dark:bg-primary-400';
    }
    
    // For past items, use a gradient based on how recent they are
    const itemCount = items.length;
    const position = itemCount - index;
    
    if (position <= Math.ceil(itemCount / 3)) {
      return 'bg-accent-500 dark:bg-accent-400';
    } else if (position <= Math.ceil(itemCount * 2 / 3)) {
      return 'bg-indigo-500 dark:bg-indigo-400';
    } else {
      return 'bg-secondary-500 dark:bg-secondary-400';
    }
  }, [items]);

  // Get a decorative badge for the timeline item
  const getItemBadge = (item: TimelineItem) => {
    const lowerTitle = item.title.toLowerCase();
    const lowerSubtitle = item.subtitle?.toLowerCase() || '';
    
    if (lowerTitle.includes('award') || lowerTitle.includes('certification') || lowerSubtitle.includes('award')) {
      return (
        <span className="absolute -top-3 -right-3 w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center text-yellow-600 dark:text-yellow-400 shadow-sm border border-yellow-200 dark:border-yellow-800/50">
          <FiStar size={14} />
        </span>
      );
    }
    
    if (item.isActive) {
      return (
        <span className="absolute -top-3 -right-3 w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 shadow-sm border border-green-200 dark:border-green-800/50">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
        </span>
      );
    }
    
    return null;
  };
  
  // Select text colors based on theme
  const textColors = useMemo(() => {
    if (theme === 'tech') {
      return {
        title: 'text-secondary-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400',
        subtitle: 'text-primary-600 dark:text-primary-400',
        description: 'text-secondary-700 dark:text-secondary-300',
      };
    }
    
    if (theme === 'minimal') {
      return {
        title: 'text-secondary-900 dark:text-white',
        subtitle: 'text-secondary-700 dark:text-secondary-400',
        description: 'text-secondary-600 dark:text-secondary-300',
      };
    }
    
    return {
      title: 'text-secondary-900 dark:text-white',
      subtitle: 'text-primary-600 dark:text-primary-400',
      description: 'text-secondary-700 dark:text-secondary-300',
    };
  }, [theme]);
  
  // Prepare the timeline background elements based on theme
  const renderBackgroundElements = () => {
    if (theme !== 'tech') return null;
    
    return (
      <div className="absolute inset-0 z-0">
        {/* Tech Network Grid */}
        <div className={`tech-grid ${isDark ? 'tech-grid-dark' : 'tech-grid-light'}`}></div>
        
        {/* Floating particles */}
        <div className="particles-container">
          {generateParticles(15)}
        </div>
        
        {/* Interactive gradient overlay that follows mouse */}
        <div 
          className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
          style={{
            background: `radial-gradient(circle 300px at ${mousePosition.x}px ${mousePosition.y}px, 
              ${isDark ? 'rgba(59, 130, 246, 0.03)' : 'rgba(59, 130, 246, 0.05)'}, 
              transparent)`,
            transition: 'background 0.3s ease-out'
          }}
        ></div>
        
        {/* Animated gradient meshes */}
        <div className={`absolute -bottom-20 -left-20 w-1/4 h-1/3 rounded-full blur-3xl ${
          isDark ? 'bg-primary-900/5 animate-pulse-slow' : 'bg-primary-500/5 animate-pulse-slow'
        }`} style={{ animationDuration: '15s' }}></div>
      </div>
    );
  };

  // Apply different styling based on the selected theme
  const getContainerClass = () => {
    if (theme === 'tech') {
      return 'relative overflow-hidden rounded-xl p-6 bg-white/80 dark:bg-secondary-900/20 backdrop-blur-sm border border-secondary-200/60 dark:border-secondary-700/40 shadow-sm';
    }
    
    if (theme === 'minimal') {
      return '';
    }
    
    return '';
  };

  return (
    <div className={`relative ${getContainerClass()} ${className}`}>
      {/* Background elements based on theme */}
      {renderBackgroundElements()}
      
      <div className="relative z-10">
        {title && (
          <motion.h3
            initial={{ opacity: 0, y: -10 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold text-secondary-900 dark:text-white mb-8 flex items-center"
          >
            {theme === 'tech' && (
              <span className="mr-3 p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                <FiClock size={20} />
              </span>
            )}
            {title}
          </motion.h3>
        )}
        
        <motion.div
          ref={timelineRef}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={containerVariants}
          className={alternating ? 'relative' : 'timeline-container'}
        >
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              className={alternating 
                ? `mb-16 last:mb-0 ${index % 2 === 0 ? 'sm:ml-[50%] sm:pl-12' : 'sm:mr-[50%] sm:pr-12'}`
                : 'timeline-item group'
              }
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {alternating ? (
                /* Alternating Timeline Layout */
                <>
                  {/* Center Line */}
                  {index < items.length - 1 && (
                    <div className="hidden sm:block absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full mt-6 bg-gradient-to-b from-primary-600 to-accent-500 dark:from-primary-500 dark:to-accent-400" />
                  )}
                  
                  {/* Timeline Dot */}
                  <div className={`hidden sm:block absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full ${getDotColor(item, index)} z-10 shadow-md ${
                    index % 2 === 0 ? 'sm:-ml-9' : 'sm:ml-3'
                  }`}>
                    <div className="w-4 h-4 bg-white dark:bg-secondary-900 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  
                  {/* Content Card */}
                  <div 
                    className={`bg-white dark:bg-secondary-800 rounded-lg border border-secondary-100 dark:border-secondary-700 shadow-sm hover:shadow-md ${expandable ? 'cursor-pointer' : ''} p-6 relative transition-all duration-300 ${
                      hoveredItem === item.id ? 'translate-y-[-5px]' : ''
                    }`}
                    onClick={() => toggleItemExpansion(item.id)}
                  >
                    {/* Decorative badge */}
                    {getItemBadge(item)}
                    
                    {/* Mobile dot */}
                    <div className="sm:hidden absolute left-0 top-6 w-6 h-6 rounded-full bg-primary-600 dark:bg-primary-500 transform -translate-x-1/2">
                      <div className="w-4 h-4 bg-white dark:bg-secondary-900 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    
                    <div className="flex flex-wrap justify-between items-start mb-3 sm:mb-2 pl-4 sm:pl-0">
                      <h3 className={`text-xl font-bold ${textColors.title}`}>{item.title}</h3>
                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300 flex items-center">
                        <FiCalendar className="mr-1.5" size={12} />
                        {item.date}
                      </span>
                    </div>
                    
                    {item.subtitle && (
                      <p className={`text-lg font-semibold ${textColors.subtitle} mb-2 pl-4 sm:pl-0`}>{item.subtitle}</p>
                    )}
                    
                    {item.location && (
                      <div className="flex items-center mb-3 pl-4 sm:pl-0 text-sm text-secondary-600 dark:text-secondary-400">
                        <FiMapPin className="mr-1.5 text-secondary-500 dark:text-secondary-400 flex-shrink-0" size={14} />
                        <span>{item.location}</span>
                      </div>
                    )}
                    
                    <AnimatePresence>
                      {(!expandable || expandedItems[item.id]) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <p className={`${textColors.description} pl-4 sm:pl-0`}>
                            {item.description}
                          </p>
                          
                          {item.tags && item.tags.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2 pl-4 sm:pl-0">
                              {item.tags.map((tag, tagIndex) => (
                                <span
                                  key={tagIndex}
                                  className="px-2 py-1 text-xs rounded-full bg-secondary-100 dark:bg-secondary-700/60 text-secondary-700 dark:text-secondary-300 flex items-center"
                                >
                                  <FiTag className="mr-1" size={10} />
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    {expandable && (
                      <div className="mt-2 pl-4 sm:pl-0">
                        <button 
                          className="text-primary-600 dark:text-primary-400 text-sm font-medium flex items-center hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleItemExpansion(item.id);
                          }}
                        >
                          {expandedItems[item.id] ? (
                            <>
                              <FiMinus size={14} className="mr-1" /> 
                              Show Less
                            </>
                          ) : (
                            <>
                              <FiPlus size={14} className="mr-1" /> 
                              Show More
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                /* Vertical Timeline Layout */
                <>
                  {/* Timeline Dot */}
                  <div className={`timeline-dot ${getDotColor(item, index)}`} />
                  
                  {/* Content Card */}
                  <div 
                    className={`bg-white dark:bg-secondary-800 rounded-lg border border-secondary-100 dark:border-secondary-700 shadow-sm hover:shadow-md ${expandable ? 'cursor-pointer' : ''} p-6 transition-all duration-300 ${
                      hoveredItem === item.id ? '-translate-y-1' : ''
                    }`}
                    onClick={() => toggleItemExpansion(item.id)}
                  >
                    {/* Decorative badge */}
                    {getItemBadge(item)}
                    
                    <div className="flex flex-wrap justify-between items-start mb-3">
                      <h3 className={`text-xl font-bold ${textColors.title}`}>{item.title}</h3>
                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300 flex items-center">
                        <FiCalendar className="mr-1.5" size={12} />
                        {item.date}
                      </span>
                    </div>
                    
                    {item.subtitle && (
                      <p className={`text-lg font-semibold ${textColors.subtitle} mb-2`}>{item.subtitle}</p>
                    )}
                    
                    {item.location && (
                      <div className="flex items-center mb-3 text-sm text-secondary-600 dark:text-secondary-400">
                        <FiMapPin className="mr-1.5 text-secondary-500 dark:text-secondary-400 flex-shrink-0" size={14} />
                        <span>{item.location}</span>
                      </div>
                    )}
                    
                    <AnimatePresence>
                      {(!expandable || expandedItems[item.id]) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <p className={`${textColors.description} text-sm`}>
                            {item.description}
                          </p>
                          
                          {item.tags && item.tags.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                              {item.tags.map((tag, tagIndex) => (
                                <span
                                  key={tagIndex}
                                  className="px-2 py-1 text-xs rounded-full bg-secondary-100 dark:bg-secondary-700/60 text-secondary-700 dark:text-secondary-300 flex items-center"
                                >
                                  <FiTag className="mr-1" size={10} />
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    {expandable && (
                      <div className="mt-2">
                        <button 
                          className="text-primary-600 dark:text-primary-400 text-sm font-medium flex items-center hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleItemExpansion(item.id);
                          }}
                        >
                          {expandedItems[item.id] ? (
                            <>
                              <FiMinus size={14} className="mr-1" /> 
                              Show Less
                            </>
                          ) : (
                            <>
                              <FiPlus size={14} className="mr-1" /> 
                              Show More
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
      
      {/* Subtle footer with information (only for tech theme) */}
      {theme === 'tech' && items.length > 0 && (
        <motion.div 
          className="mt-8 flex justify-between text-sm text-secondary-500 dark:text-secondary-400"
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <span className="flex items-center">
            <span className="w-2 h-2 rounded-full bg-green-500 dark:bg-green-400 mr-2"></span>
            Current
          </span>
          <div className="flex items-center gap-4">
            <span className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-primary-500 dark:bg-primary-400 mr-2"></span>
              Present
            </span>
            <span className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-accent-500 dark:bg-accent-400 mr-2"></span>
              Recent
            </span>
            <span className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-secondary-500 dark:bg-secondary-400 mr-2"></span>
              Past
            </span>
          </div>
        </motion.div>
      )}
      
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
          z-index: 1;
        }
        
        /* Timeline styling */
        .timeline-container {
          position: relative;
          border-left-width: 2px;
          border-image: linear-gradient(to bottom, var(--tw-gradient-stops)) 1;
          --tw-gradient-from: #4f46e5;
          --tw-gradient-to: #0ea5e9;
          --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
          padding-left: 1.5rem;
          margin-left: 0.75rem;
        }

        .dark .timeline-container {
          --tw-gradient-from: #6366f1;
          --tw-gradient-to: #38bdf8;
        }
        
        .timeline-item {
          margin-bottom: 2rem;
        }
        
        .timeline-item:last-child {
          margin-bottom: 0;
        }
        
        .timeline-dot {
          position: absolute;
          width: 1rem;
          height: 1rem;
          border-radius: 9999px;
          margin-top: 0.375rem;
          left: -0.625rem;
          z-index: 10;
        }
      `}</style>
    </div>
  );
};

export default Timeline;