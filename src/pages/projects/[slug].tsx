import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiExternalLink, FiGithub } from 'react-icons/fi';
import { projects } from '@/utils/data';

// Define project type based on your project data structure
interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  featured: boolean;
  technologies: string[];
  link?: string;
}

export default function ProjectDetail() {
  const router = useRouter();
  const { slug } = router.query;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      // Find the project by id/slug
      const foundProject = projects.find(p => p.id === slug);
      
      if (foundProject) {
        setProject(foundProject as Project);
      }
      
      setLoading(false);
    }
  }, [slug]);

  // Go back to projects page
  const goBack = () => {
    router.push('/#projects');
  };

  // If project not found or still loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <h1 className="text-3xl font-bold text-secondary-900 dark:text-white mb-4">Project Not Found</h1>
        <p className="text-secondary-600 dark:text-secondary-400 mb-8">The project you&apos;re looking for doesn&apos;t exist or has been removed.</p>
        <button
          onClick={goBack}
          className="flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg"
        >
          <FiArrowLeft className="mr-2" width={20} height={20} />
          Back to Projects
        </button>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{project.title} | Syahril&apos;s Portfolio</title>
        <meta name="description" content={project.description} />
      </Head>

      <main className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Back button */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <button
              onClick={goBack}
              className="flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
            >
              <FiArrowLeft className="mr-2" width={20} height={20} />
              Back to Projects
            </button>
          </motion.div>

          {/* Project Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <div className="flex flex-wrap gap-3 mb-4">
              <span className="px-3 py-1 text-sm font-medium rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300">
                {project.category}
              </span>
              
              {project.featured && (
                <span className="px-3 py-1 text-sm font-medium rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                  Featured Project
                </span>
              )}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-secondary-900 dark:text-white mb-4">
              {project.title}
            </h1>
            
            <p className="text-xl text-secondary-600 dark:text-secondary-400 max-w-4xl">
              {project.description}
            </p>
          </motion.div>

          {/* Project Image */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-12"
          >
            <div className="relative w-full h-96 rounded-xl overflow-hidden">
              <div className="bg-secondary-200 dark:bg-secondary-700 w-full h-full flex items-center justify-center text-secondary-400 dark:text-secondary-500">
                <span className="text-sm">Project Image Placeholder</span>
              </div>
            </div>
          </motion.div>

          {/* Project Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Project Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="lg:col-span-2"
            >
              <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-md p-6 border border-secondary-100 dark:border-secondary-700">
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mb-4">Project Overview</h2>
                
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <p>
                    This project demonstrates my skills in {project.technologies.join(', ')}. 
                    It was created to solve real-world problems in the {project.category} domain 
                    and showcases my ability to develop comprehensive solutions.
                  </p>
                  
                  <p>
                    Throughout this project, I focused on delivering high-quality code while 
                    ensuring the solution met all requirements. The implementation follows best 
                    practices and industry standards.
                  </p>
                  
                  <h3>Key Features</h3>
                  <ul>
                    <li>Feature one of the project with detailed implementation</li>
                    <li>Feature two highlighting the technical challenges overcome</li>
                    <li>Feature three demonstrating problem-solving approach</li>
                  </ul>
                  
                  <h3>Technical Implementation</h3>
                  <p>
                    The project architecture was carefully designed to ensure scalability and maintainability.
                    Key technical aspects include database optimization, efficient API design, and responsive UI implementation.
                  </p>
                </div>
                
                {/* Project Links */}
                <div className="mt-8 flex flex-wrap gap-4">
                  <a 
                    href={project.link || '#'} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                  >
                    <FiExternalLink className="mr-2" width={20} height={20} />
                    View Live Project
                  </a>
                  
                  <a 
                    href="#" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center px-6 py-3 bg-secondary-100 dark:bg-secondary-700 text-secondary-900 dark:text-white hover:bg-secondary-200 dark:hover:bg-secondary-600 rounded-lg transition-colors"
                  >
                    <FiGithub className="mr-2" width={20} height={20} />
                    View Source Code
                  </a>
                </div>
              </div>
            </motion.div>
            
            {/* Right Column - Technologies & Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-md p-6 border border-secondary-100 dark:border-secondary-700 mb-6">
                <h3 className="text-xl font-bold text-secondary-900 dark:text-white mb-4">Technologies Used</h3>
                
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech: string, index: number) => (
                    <span 
                      key={index} 
                      className="px-3 py-1 text-sm rounded-full bg-secondary-100 dark:bg-secondary-700 text-secondary-800 dark:text-secondary-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-md p-6 border border-secondary-100 dark:border-secondary-700">
                <h3 className="text-xl font-bold text-secondary-900 dark:text-white mb-4">Project Information</h3>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-secondary-500 dark:text-secondary-400">Category</p>
                    <p className="font-medium text-secondary-900 dark:text-white">{project.category}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-secondary-500 dark:text-secondary-400">Completion Date</p>
                    <p className="font-medium text-secondary-900 dark:text-white">December 2023</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-secondary-500 dark:text-secondary-400">Role</p>
                    <p className="font-medium text-secondary-900 dark:text-white">Developer</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* More Projects Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mb-6">More Projects</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects
                .filter(p => p.id !== project.id)
                .slice(0, 3)
                .map((relatedProject) => (
                  <motion.div
                    key={relatedProject.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    whileHover={{ y: -5 }}
                    className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm p-5 border border-secondary-100 dark:border-secondary-700"
                  >
                    <div className="relative w-full h-40 mb-4 rounded-lg overflow-hidden">
                      <div className="bg-secondary-200 dark:bg-secondary-700 w-full h-full flex items-center justify-center text-secondary-400 dark:text-secondary-500">
                        <span className="text-sm">Image Placeholder</span>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-bold text-secondary-900 dark:text-white mb-2">{relatedProject.title}</h3>
                    <p className="text-secondary-600 dark:text-secondary-400 text-sm line-clamp-2 mb-4">{relatedProject.description}</p>
                    
                    <Link 
                      href={`/projects/${relatedProject.id}`}
                      className="text-primary-600 dark:text-primary-400 font-medium hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                    >
                      View Project →
                    </Link>
                  </motion.div>
                ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}