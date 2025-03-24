import { motion } from 'framer-motion';
import { FiBookOpen, FiCalendar, FiAward } from 'react-icons/fi';
import { education, certifications } from '@/utils/data';
import Card from '../ui/Card';
import { useInView } from 'react-intersection-observer';

const Education = () => {
  const [eduRef, eduInView] = useInView({
    triggerOnce: true,
    threshold: 0.2
  });
  
  const [certRef, certInView] = useInView({
    triggerOnce: true,
    threshold: 0.2
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
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
    <section id="education" className="py-20 bg-secondary-50 dark:bg-secondary-900/30">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="section-title mx-auto">Education & Certifications</h2>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Education */}
          <div>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-2xl font-bold text-secondary-900 dark:text-white mb-8 flex items-center"
            >
              <FiBookOpen className="mr-3 text-primary-600 dark:text-primary-400" size={24} />
              Academic Background
            </motion.h3>
            
            <motion.div
              ref={eduRef}
              initial="hidden"
              animate={eduInView ? "visible" : "hidden"}
              variants={containerVariants}
              className="space-y-6"
            >
              {education.map((item, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                >
                  <Card hover className="p-6 relative overflow-hidden group">
                    {/* Background pattern */}
                    <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-primary-100/50 dark:bg-primary-900/20 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-500"></div>
                    
                    <div className="mb-3 relative z-10">
                      <div className="flex justify-between items-start">
                        <h4 className="text-xl font-bold text-secondary-900 dark:text-white">{item.institution}</h4>
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300 flex items-center">
                          <FiCalendar className="mr-1" size={14} />
                          {item.duration}
                        </span>
                      </div>
                      <p className="text-lg font-semibold text-primary-600 dark:text-primary-400 mt-1">{item.degree}</p>
                    </div>
                    
                    <p className="text-secondary-700 dark:text-secondary-300 text-sm relative z-10">
                      {item.description}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
          
          {/* Certifications */}
          <div>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-2xl font-bold text-secondary-900 dark:text-white mb-8 flex items-center"
            >
              <FiAward className="mr-3 text-primary-600 dark:text-primary-400" size={24} />
              Certifications
            </motion.h3>
            
            <motion.div
              ref={certRef}
              initial="hidden"
              animate={certInView ? "visible" : "hidden"}
              variants={containerVariants}
              className="space-y-5"
            >
              {certifications.map((cert, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <a 
                    href={cert.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block bg-white dark:bg-secondary-800 rounded-lg border border-secondary-100 dark:border-secondary-700 shadow-sm hover:shadow-md transition-all duration-300 p-5 relative overflow-hidden"
                  >
                    {/* Decorative circle */}
                    <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-primary-50 dark:bg-primary-900/10 -translate-y-1/2 translate-x-1/2"></div>
                    
                    <div className="flex justify-between items-start relative z-10">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-secondary-900 dark:text-white">{cert.title}</h4>
                        <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-2">
                          {cert.issuer}
                        </p>
                      </div>
                      <div className="ml-4">
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300">
                          {cert.date}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-end">
                      <span className="flex items-center text-primary-600 dark:text-primary-400 text-sm font-medium">
                        View Certificate
                        <svg className="ml-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </span>
                    </div>
                  </a>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;