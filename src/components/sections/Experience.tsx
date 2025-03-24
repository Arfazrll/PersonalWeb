import { motion } from 'framer-motion';
import { experiences } from '@/utils/data';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const Experience = () => {
  const { ref, controls } = useScrollAnimation(0.1);

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
    <section id="experience" className="py-20 bg-white dark:bg-secondary-900">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="section-title mx-auto">Work Experience</h2>
        </motion.div>
        
        {/* Experience Timeline */}
        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls ? "visible" : "hidden"}
          variants={containerVariants}
          className="max-w-4xl mx-auto timeline-container"
        >
          {experiences.map((experience, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="timeline-item"
            >
              {/* Timeline dot */}
              <div className="timeline-dot"></div>
              
              {/* Content */}
              <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-md p-6 border border-secondary-100 dark:border-secondary-700 transition-transform hover:-translate-y-1 duration-300">
                <div className="flex flex-wrap justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-secondary-900 dark:text-white">{experience.position}</h3>
                  <div className="flex flex-wrap gap-2 mt-1 sm:mt-0">
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300">
                      {experience.duration}
                    </span>
                  </div>
                </div>
                
                <h4 className="text-lg font-semibold text-primary-600 dark:text-primary-400 mb-2">
                  {experience.company}
                </h4>
                
                <div className="text-secondary-600 dark:text-secondary-400 mb-3 text-sm">
                  <span className="inline-block mr-2">{experience.location}</span>
                </div>
                
                <p className="text-secondary-700 dark:text-secondary-300 text-sm">
                  {experience.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Experience;