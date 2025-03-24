import { motion } from 'framer-motion';
import { FiBookOpen, FiCalendar } from 'react-icons/fi';
import { education, certifications } from '@/utils/data';
import Card from '../ui/Card';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const Education = () => {
  const { ref: eduRef, controls: eduControls } = useScrollAnimation();
  const { ref: certRef, controls: certControls } = useScrollAnimation();

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
          viewport={{ once: true }}
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
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-2xl font-bold text-secondary-900 dark:text-white mb-8 flex items-center"
            >
              <FiBookOpen className="mr-3 text-primary-600 dark:text-primary-400" width={24} height={24} />
              Academic Background
            </motion.h3>
            
            <motion.div
              ref={eduRef}
              initial="hidden"
              animate={eduControls ? "visible" : "hidden"}
              variants={containerVariants}
              className="space-y-6"
            >
              {education.map((item, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                >
                  <Card hover className="p-6">
                    <div className="mb-3">
                      <div className="flex justify-between items-start">
                        <h4 className="text-xl font-bold text-secondary-900 dark:text-white">{item.institution}</h4>
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300 flex items-center">
                          <FiCalendar className="mr-1" width={16} height={16} />
                          {item.duration}
                        </span>
                      </div>
                      <p className="text-lg font-semibold text-primary-600 dark:text-primary-400 mt-1">{item.degree}</p>
                    </div>
                    
                    <p className="text-secondary-700 dark:text-secondary-300 text-sm">
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
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-2xl font-bold text-secondary-900 dark:text-white mb-8 flex items-center"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6 mr-3 text-primary-600 dark:text-primary-400" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Certifications
            </motion.h3>
            
            <motion.div
              ref={certRef}
              initial="hidden"
              animate={certControls ? "visible" : "hidden"}
              variants={containerVariants}
              className="space-y-4"
            >
              {certifications.map((cert, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.01 }}
                >
                  <a 
                    href={cert.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block bg-white dark:bg-secondary-800 rounded-lg border border-secondary-100 dark:border-secondary-700 shadow-sm hover:shadow-md transition-all duration-300 p-5"
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="text-lg font-semibold text-secondary-900 dark:text-white">{cert.title}</h4>
                      <span className="text-xs text-secondary-500 dark:text-secondary-400">{cert.date}</span>
                    </div>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-2">
                      {cert.issuer}
                    </p>
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