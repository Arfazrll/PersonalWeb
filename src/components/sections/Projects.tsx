import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiExternalLink } from 'react-icons/fi';
import { projects } from '@/utils/data';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

type ProjectCategory = 'all' | 'featured' | string;

const Projects = () => {
  const [filter, setFilter] = useState<ProjectCategory>('all');
  const { ref, controls } = useScrollAnimation();

  // Get unique categories from projects
  const categories = ['all', 'featured', ...Array.from(new Set(projects.map(p => p.category)))];

  // Filter projects based on selected category
  const filteredProjects = filter === 'all'
    ? projects
    : filter === 'featured'
      ? projects.filter(project => project.featured)
      : projects.filter(project => project.category === filter);

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
    <section id="projects" className="py-20 bg-secondary-50 dark:bg-secondary-900/30">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="section-title mx-auto">Projects & Work</h2>
          <p className="text-secondary-600 dark:text-secondary-400 max-w-2xl mx-auto mt-6">
            Explore my projects showcasing my skills and experience in AI, data analysis, IoT, and software development.
          </p>
        </motion.div>
        
        {/* Filter Categories */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors
                ${filter === category 
                  ? 'bg-primary-600 text-white dark:bg-primary-500' 
                  : 'bg-white dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700'
                }
              `}
            >
              {category}
            </button>
          ))}
        </div>
        
        {/* Projects Grid */}
        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls ? "visible" : "hidden"}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              variants={itemVariants}
            >
              <Card hover className="h-full flex flex-col">
                {/* Project Image */}
                <div className="relative w-full h-48 mb-4 overflow-hidden rounded-lg">
                  <div className="bg-secondary-200 dark:bg-secondary-700 w-full h-full flex items-center justify-center text-secondary-400 dark:text-secondary-500">
                    <span className="text-sm">Image Placeholder</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                {/* Project Info */}
                <div className="flex-grow">
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300">
                      {project.category}
                    </span>
                    
                    {project.featured && (
                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                        Featured
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold text-secondary-900 dark:text-white mb-2">{project.title}</h3>
                  
                  <p className="text-secondary-600 dark:text-secondary-400 text-sm mb-4">
                    {project.description}
                  </p>
                  
                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech) => (
                      <span 
                        key={tech} 
                        className="px-2 py-1 text-xs rounded bg-secondary-100 dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Project Links */}
                <div className="mt-auto pt-4 border-t border-secondary-100 dark:border-secondary-800">
                  <div className="flex justify-end space-x-3">
                    <a 
                      href={project.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-secondary-100 dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300 hover:bg-primary-100 hover:text-primary-600 dark:hover:bg-primary-900/20 dark:hover:text-primary-400 transition-colors"
                      aria-label="View project"
                    >
                      <FiExternalLink width={18} height={18} />
                    </a>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
        
        {/* No Projects Found */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-16">
            <p className="text-secondary-600 dark:text-secondary-400 mb-4">No projects found in this category.</p>
            <Button 
              onClick={() => setFilter('all')}
              variant="primary"
            >
              View All Projects
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;