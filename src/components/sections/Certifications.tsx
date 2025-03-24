import { motion } from 'framer-motion';
import { FiAward, FiChevronRight, FiExternalLink } from 'react-icons/fi';
import { certifications } from '@/utils/data';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const Certifications = () => {
  const { ref, controls } = useScrollAnimation();

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
    <section id="certifications" className="py-20 bg-secondary-50 dark:bg-secondary-900/30">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="section-title mx-auto">Certifications</h2>
          <p className="text-secondary-600 dark:text-secondary-400 max-w-2xl mx-auto mt-6">
            Professional certifications and credentials that demonstrate my expertise and commitment to continuous learning.
          </p>
        </motion.div>
        
        {/* Certifications Grid */}
        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls ? "visible" : "hidden"}
          variants={containerVariants}
          className="max-w-4xl mx-auto"
        >
          {certifications.map((cert, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="mb-6 last:mb-0"
            >
              <div className="relative bg-white dark:bg-secondary-800 rounded-lg border border-secondary-200 dark:border-secondary-700 shadow-sm hover:shadow-md transition-all duration-300 p-5 pl-16">
                <div className="absolute left-5 top-5">
                  <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
                    <FiAward size={18} />
                  </div>
                </div>
                
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">{cert.title}</h3>
                    <p className="text-primary-600 dark:text-primary-400 text-sm mt-1">Issued by: {cert.issuer}</p>
                    <p className="text-secondary-500 dark:text-secondary-400 text-sm mt-1">Issued: {cert.date}</p>
                  </div>
                  
                  <a 
                    href={cert.link} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-secondary-100 dark:bg-secondary-700 text-secondary-800 dark:text-secondary-200 hover:bg-primary-100 hover:text-primary-700 dark:hover:bg-primary-900/30 dark:hover:text-primary-300 transition-colors duration-300"
                    aria-label={`View ${cert.title} certification`}
                  >
                    <FiExternalLink size={12} className="mr-1" />
                    View
                  </a>
                </div>
                
                <div className="mt-4 pt-4 border-t border-secondary-100 dark:border-secondary-700">
                  <div className="flex items-center">
                    <div className="flex-grow h-0.5 bg-secondary-100 dark:bg-secondary-700 rounded"></div>
                    <a
                      href={cert.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center ml-4 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-300"
                    >
                      View Certificate 
                      <FiChevronRight size={16} className="ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Certifications;