import React from 'react';
import { motion } from 'framer-motion';

interface TimelineItem {
  id: string | number;
  title: string;
  subtitle?: string;
  date: string;
  description: string;
  icon?: React.ReactNode;
  tags?: string[];
}

interface TimelineProps {
  items: TimelineItem[];
  title?: string;
  alternating?: boolean;
  className?: string;
}

const Timeline: React.FC<TimelineProps> = ({
  items,
  title,
  alternating = false,
  className = ''
}) => {
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
    <div className={`max-w-4xl mx-auto ${className}`}>
      {title && (
        <h3 className="text-2xl font-bold text-secondary-900 dark:text-white mb-8">{title}</h3>
      )}
      
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className={alternating ? 'relative' : 'timeline-container'}
      >
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            variants={itemVariants}
            className={alternating 
              ? `mb-16 last:mb-0 ${index % 2 === 0 ? 'sm:ml-[50%] sm:pl-12' : 'sm:mr-[50%] sm:pr-12'}`
              : 'timeline-item'
            }
          >
            {alternating ? (
              /* Alternating Timeline Layout */
              <>
                {/* Center Line */}
                {index < items.length - 1 && (
                  <div className="hidden sm:block absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full mt-6 bg-primary-600 dark:bg-primary-500" />
                )}
                
                {/* Timeline Dot */}
                <div className={`hidden sm:block absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-primary-600 dark:bg-primary-500 z-10 ${
                  index % 2 === 0 ? 'sm:-ml-9' : 'sm:ml-3'
                }`}>
                  <div className="w-4 h-4 bg-white dark:bg-secondary-900 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                </div>
                
                {/* Content Card */}
                <div className="bg-white dark:bg-secondary-800 rounded-lg border border-secondary-100 dark:border-secondary-700 shadow-sm p-6 relative">
                  {/* Mobile dot */}
                  <div className="sm:hidden absolute left-0 top-6 w-6 h-6 rounded-full bg-primary-600 dark:bg-primary-500 transform -translate-x-1/2">
                    <div className="w-4 h-4 bg-white dark:bg-secondary-900 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  
                  <div className="flex flex-wrap justify-between items-start mb-3 sm:mb-2 pl-4 sm:pl-0">
                    <h3 className="text-xl font-bold text-secondary-900 dark:text-white">{item.title}</h3>
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300">
                      {item.date}
                    </span>
                  </div>
                  
                  {item.subtitle && (
                    <p className="text-lg font-semibold text-primary-600 dark:text-primary-400 mb-2 pl-4 sm:pl-0">{item.subtitle}</p>
                  )}
                  
                  <p className="text-secondary-700 dark:text-secondary-300 pl-4 sm:pl-0">
                    {item.description}
                  </p>
                  
                  {item.tags && item.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2 pl-4 sm:pl-0">
                      {item.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-2 py-1 text-xs rounded bg-secondary-100 dark:bg-secondary-700 text-secondary-700 dark:text-secondary-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Vertical Timeline Layout */
              <>
                {/* Timeline Dot */}
                <div className="timeline-dot" />
                
                {/* Content Card */}
                <div className="bg-white dark:bg-secondary-800 rounded-lg border border-secondary-100 dark:border-secondary-700 shadow-sm p-6 transition-transform hover:-translate-y-1 duration-300">
                  <div className="flex flex-wrap justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-secondary-900 dark:text-white">{item.title}</h3>
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300">
                      {item.date}
                    </span>
                  </div>
                  
                  {item.subtitle && (
                    <p className="text-lg font-semibold text-primary-600 dark:text-primary-400 mb-2">{item.subtitle}</p>
                  )}
                  
                  <p className="text-secondary-700 dark:text-secondary-300 text-sm">
                    {item.description}
                  </p>
                  
                  {item.tags && item.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {item.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-2 py-1 text-xs rounded bg-secondary-100 dark:bg-secondary-700 text-secondary-700 dark:text-secondary-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Timeline;