import { motion } from 'framer-motion';
import { FiCode, FiGlobe, FiSettings } from 'react-icons/fi';
import { skills } from '@/utils/data';
import Card from '../ui/Card';
import SkillBadge from '../ui/SkillBadge';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const Skills = () => {
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
    <section id="skills" className="py-20 bg-white dark:bg-secondary-900">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="section-title mx-auto">Skills & Expertise</h2>
        </motion.div>
        
        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls ? "visible" : "hidden"}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {/* Technical Skills */}
          <motion.div variants={itemVariants}>
            <Card className="h-full">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 mr-4">
                  <FiCode width={24} height={24} />
                </div>
                <h3 className="text-xl font-bold text-secondary-900 dark:text-white">Technical Skills</h3>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {skills.technical.map((skill, index) => (
                  <SkillBadge 
                    key={skill} 
                    skill={skill} 
                    delay={index * 0.05}
                  />
                ))}
              </div>
            </Card>
          </motion.div>
          
          {/* Languages */}
          <motion.div variants={itemVariants}>
            <Card className="h-full">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-lg bg-accent-100 dark:bg-accent-900/30 flex items-center justify-center text-accent-600 dark:text-accent-400 mr-4">
                  <FiGlobe width={24} height={24} />
                </div>
                <h3 className="text-xl font-bold text-secondary-900 dark:text-white">Languages</h3>
              </div>
              
              <div className="space-y-4">
                {skills.languages.map((language, index) => (
                  <div key={language.name} className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium text-secondary-700 dark:text-secondary-300">{language.name}</span>
                      <span className="text-primary-600 dark:text-primary-400 text-sm">{language.level}</span>
                    </div>
                    <div className="w-full h-2 bg-secondary-100 dark:bg-secondary-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ 
                          width: language.level === 'Native' ? '100%' : 
                                  language.level === 'Limited Working' ? '60%' : 
                                  language.level === 'Elementary' ? '30%' : '50%' 
                        }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className={`h-full ${language.level === 'Native' ? 'bg-primary-600 dark:bg-primary-500' : 
                                            language.level === 'Limited Working' ? 'bg-accent-500 dark:bg-accent-600' : 
                                            'bg-secondary-500 dark:bg-secondary-600'}`}
                      ></motion.div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
          
          {/* Tools & Technologies */}
          <motion.div variants={itemVariants}>
            <Card className="h-full">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-lg bg-secondary-100 dark:bg-secondary-800 flex items-center justify-center text-secondary-600 dark:text-secondary-400 mr-4">
                  <FiSettings width={24} height={24} />
                </div>
                <h3 className="text-xl font-bold text-secondary-900 dark:text-white">Tools & Technologies</h3>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {skills.tools.map((tool, index) => (
                  <SkillBadge 
                    key={tool} 
                    skill={tool} 
                    delay={index * 0.05}
                    className="bg-secondary-100 text-secondary-800 dark:bg-secondary-800 dark:text-secondary-200"
                  />
                ))}
              </div>
              
              {/* Additional Skills Highlight */}
              <div className="mt-8 p-4 bg-primary-50 dark:bg-primary-900/10 rounded-lg border border-primary-100 dark:border-primary-800/30">
                <h4 className="font-semibold text-primary-700 dark:text-primary-400 mb-2">Specialized In</h4>
                <ul className="space-y-1 text-secondary-700 dark:text-secondary-300 text-sm">
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-600 dark:bg-primary-400 mr-2"></div>
                    Real-time Monitoring Systems
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-600 dark:bg-primary-400 mr-2"></div>
                    Internet of Things (IoT) Development
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-600 dark:bg-primary-400 mr-2"></div>
                    Database Management Systems
                  </li>
                </ul>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;