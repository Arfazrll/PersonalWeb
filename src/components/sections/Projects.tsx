import { useState, useEffect, useRef } from 'react';
import { 
  FiExternalLink, 
  FiGithub, 
  FiFilter,
  FiGrid,
  FiList,
  FiArrowRight,
  FiCode,
  FiDatabase,
  FiLayers
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { projects } from '@/utils/data';
import Button from '../ui/Button';
import Card from '../ui/Card';
import SearchBar from '../ui/SearchBar';
import SectionHeading from '../ui/SectionHeading';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import FilterTag from '../ui/FilterTag';
import { useTheme } from 'next-themes';
// Import the ProjectModal component
import ProjectModal from '../ui/ProjectModal';

type ProjectCategory = 'all' | 'featured' | string;
type ViewMode = 'grid' | 'list';

// Extended project type with visible flag
interface ExtendedProject {
  id: string;
  title: string;
  description: string;
  category: string;
  featured: boolean;
  technologies: string[];
  link?: string;
  image?: string;
  visible: boolean;
}

// Custom hook for intersection observer with proper typing
function useCustomInView(options = { threshold: 0.1, once: false }) {
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

// Project Card Component - Encapsulates animation logic
interface ProjectCardProps {
  project: ExtendedProject;
  index: number;
  viewMode: ViewMode;
  prefersReducedMotion: boolean;
  onViewDetails: (projectId: string) => void; // Add handler for view details
}

const ProjectCard = ({ project, index, viewMode, prefersReducedMotion, onViewDetails }: ProjectCardProps) => {
  // Initialize refs with proper typing
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  // Get tech icon based on technology name
  const getTechIcon = (tech: string) => {
    const lowerTech = tech.toLowerCase();
    if (lowerTech.includes('python') || lowerTech.includes('javascript') || lowerTech.includes('typescript')) {
      return <FiCode size={12} />;
    } else if (lowerTech.includes('sql') || lowerTech.includes('data')) {
      return <FiDatabase size={12} />;
    } else {
      return <FiLayers size={12} />;
    }
  };
  
  // Set up intersection observer directly in the component
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Once visible, unobserve
          if (cardRef.current) {
            observer.unobserve(cardRef.current);
          }
        }
      },
      { threshold: 0.1 }
    );
    
    // Capture current ref value to avoid stale closures in cleanup
    const currentCardRef = cardRef.current;
    
    // Start observing when component mounts
    if (currentCardRef) {
      observer.observe(currentCardRef);
    }
    
    // Clean up observer on unmount using captured reference
    return () => {
      if (currentCardRef) {
        observer.unobserve(currentCardRef);
      }
    };
  }, []);
  
  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ 
        duration: 0.5, 
        delay: prefersReducedMotion ? 0 : index * 0.1,
        ease: [0.22, 1, 0.36, 1] 
      }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="card-container"
      data-project-id={project.id}
    >
      {viewMode === 'grid' ? (
        <Card hover className="h-full flex flex-col group card-glow overflow-hidden">
          {/* Project Image with enhanced styling */}
          <div className="relative w-full h-48 mb-4 overflow-hidden rounded-lg group-hover:shadow-md transition-shadow duration-300">
            <div className={`bg-gray-200 dark:bg-gray-700 w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500 ${
              isDark ? 'tech-grid-dark' : 'tech-grid-light'
            }`}>
              <span className="text-sm">Image Placeholder</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-end p-4">
              <motion.button
                className="bg-white text-gray-900 p-2 rounded-full shadow-lg icon-glow"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                aria-label={`View ${project.title} details`}
                onClick={() => onViewDetails(project.id)}
              >
                <FiExternalLink size={18} />
              </motion.button>
            </div>
            
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-accent-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          
          {/* Project Info */}
          <div className="flex-grow">
            <div className="flex items-center justify-between mb-2">
              <motion.span 
                className="px-3 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300 focus-point"
                whileHover={{ scale: 1.05 }}
              >
                {project.category}
              </motion.span>
              
              {project.featured && (
                <motion.span 
                  className="px-3 py-1 text-xs font-medium rounded-full bg-accent-100 text-accent-800 dark:bg-accent-900/30 dark:text-accent-300 focus-point"
                  whileHover={{ scale: 1.05 }}
                >
                  Featured
                </motion.span>
              )}
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{project.title}</h3>
            
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
              {project.description}
            </p>
            
            {/* Technologies with enhanced styling */}
            <div className="flex flex-wrap gap-2 mb-4">
              {project.technologies.slice(0, 3).map((tech) => (
                <motion.span 
                  key={tech} 
                  className="px-2 py-1 text-xs rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 flex items-center gap-1 focus-point"
                  whileHover={{ y: -3, scale: 1.05 }}
                >
                  {getTechIcon(tech)}
                  {tech}
                </motion.span>
              ))}
              {project.technologies.length > 3 && (
                <motion.span 
                  className="px-2 py-1 text-xs rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus-point"
                  whileHover={{ y: -3, scale: 1.05 }}
                >
                  +{project.technologies.length - 3} more
                </motion.span>
              )}
            </div>
          </div>
          
          {/* Project Links with enhanced styling */}
          <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <motion.button
                className="flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 transition-colors font-medium text-sm group view-details-button"
                whileHover={{ x: 5 }}
                onClick={() => onViewDetails(project.id)} // Add click handler
              >
                View Details
                <FiArrowRight className="ml-1 group-hover:ml-2 transition-all duration-300" size={16} />
              </motion.button>
              
              <div className="flex space-x-3">
                {project.link && (
                  <motion.a 
                    href={project.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-primary-100 hover:text-primary-600 dark:hover:bg-primary-900/20 dark:hover:text-primary-400 transition-colors icon-glow"
                    whileHover={{ scale: 1.1, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="View project"
                  >
                    <FiExternalLink size={16} />
                  </motion.a>
                )}
                <motion.a 
                  href="#" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-primary-100 hover:text-primary-600 dark:hover:bg-primary-900/20 dark:hover:text-primary-400 transition-colors icon-glow"
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="View source code"
                >
                  <FiGithub size={16} />
                </motion.a>
              </div>
            </div>
          </div>
        </Card>
      ) : (
        // List view with enhanced styling
        <Card hover className="p-0 overflow-hidden group card-glow">
          <div className="flex flex-col md:flex-row">
            {/* Project Image with enhanced styling */}
            <div className={`relative md:w-64 h-48 md:h-auto overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center ${
              isDark ? 'tech-grid-dark' : 'tech-grid-light'
            }`}>
              <span className="text-sm text-gray-400 dark:text-gray-500">Image Placeholder</span>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Animated gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-accent-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            
            {/* Project Info */}
            <div className="flex-grow p-6">
              <div className="flex flex-wrap items-start justify-between mb-2">
                <div className="flex gap-2 mb-2">
                  <motion.span 
                    className="px-3 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300 flex items-center focus-point"
                    whileHover={{ scale: 1.05 }}
                  >
                    {project.category}
                  </motion.span>
                  
                  {project.featured && (
                    <motion.span 
                      className="px-3 py-1 text-xs font-medium rounded-full bg-accent-100 text-accent-800 dark:bg-accent-900/30 dark:text-accent-300 flex items-center focus-point"
                      whileHover={{ scale: 1.05 }}
                    >
                      Featured
                    </motion.span>
                  )}
                </div>
                
                <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                  2023
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{project.title}</h3>
              
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                {project.description}
              </p>
              
              {/* Technologies with enhanced styling */}
              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies.map((tech) => (
                  <motion.span 
                    key={tech} 
                    className="px-2 py-1 text-xs rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 flex items-center gap-1 focus-point"
                    whileHover={{ y: -3, scale: 1.05 }}
                  >
                    {getTechIcon(tech)}
                    {tech}
                  </motion.span>
                ))}
              </div>
              
              {/* Action Buttons with enhanced styling */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                <motion.button
                  className="flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 transition-colors font-medium group view-details-button"
                  whileHover={{ x: 5 }}
                  onClick={() => onViewDetails(project.id)} // Add click handler
                >
                  View Details
                  <FiArrowRight className="ml-1 group-hover:ml-2 transition-all duration-300" size={16} />
                </motion.button>
                
                <div className="flex space-x-3">
                  {project.link && (
                    <motion.a 
                      href={project.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-primary-100 hover:text-primary-600 dark:hover:bg-primary-900/20 dark:hover:text-primary-400 transition-colors icon-glow"
                      whileHover={{ scale: 1.1, y: -3 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label="View project"
                    >
                      <FiExternalLink size={18} />
                    </motion.a>
                  )}
                  <motion.a 
                    href="#" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-primary-100 hover:text-primary-600 dark:hover:bg-primary-900/20 dark:hover:text-primary-400 transition-colors icon-glow"
                    whileHover={{ scale: 1.1, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="View source code"
                  >
                    <FiGithub size={18} />
                  </motion.a>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </motion.div>
  );
};

const Projects = () => {
  const [filter, setFilter] = useState<ProjectCategory>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [projectsData, setProjectsData] = useState<ExtendedProject[]>([]);
  const [isEmpty, setIsEmpty] = useState<boolean>(false);
  const [visibleCount, setVisibleCount] = useState<number>(6);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  // Add state variables for modal functionality
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Mouse position for interactive gradient effect
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const { ref: sectionRef, isInView } = useCustomInView({ once: false, threshold: 0.1 });
  const prefersReducedMotion = usePrefersReducedMotion();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  // Handle project details modal
  const openProjectDetails = (projectId: string) => {
    setSelectedProjectId(projectId);
    setIsModalOpen(true);
  };

  const closeProjectModal = () => {
    setIsModalOpen(false);
    // Optional: Add a short timeout before clearing the ID to allow for exit animations
    setTimeout(() => setSelectedProjectId(null), 300);
  };

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

  // Get unique categories from projects
  const categories = ['all', 'featured', ...Array.from(new Set(projects.map(p => p.category)))];

  // Initialize projects data with visibility flag
  useEffect(() => {
    setProjectsData(
      projects.map(project => ({
        ...project,
        visible: true
      }))
    );
  }, []);

  // Filter and search projects
  useEffect(() => {
    const searchLower = searchQuery.toLowerCase();
    
    const filtered = projects.map(project => {
      // Check if project matches the filter
      const matchesFilter = filter === 'all' || 
        (filter === 'featured' && project.featured) || 
        project.category === filter;
      
      // Check if project matches the search query
      const matchesSearch = searchQuery === '' || 
        project.title.toLowerCase().includes(searchLower) || 
        project.description.toLowerCase().includes(searchLower) || 
        project.technologies.some(tech => tech.toLowerCase().includes(searchLower));
      
      return {
        ...project,
        visible: matchesFilter && matchesSearch
      };
    });
    
    setProjectsData(filtered);
    
    // Check if there are no visible projects
    const hasVisibleProjects = filtered.some(project => project.visible);
    setIsEmpty(!hasVisibleProjects);
  }, [filter, searchQuery]);

  // Load more projects functionality
  const loadMoreProjects = () => {
    setIsLoadingMore(true);
    
    // Simulate loading delay
    setTimeout(() => {
      setVisibleCount(prevCount => Math.min(prevCount + 3, projectsData.length));
      setIsLoadingMore(false);
    }, 400);
  };

  // Get visible projects based on current count limit
  const getVisibleProjects = () => {
    return projectsData
      .filter(project => project.visible)
      .slice(0, visibleCount);
  };

  // Handle search query change
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    
    // Reset visible count to initial value when search changes
    setVisibleCount(6);
  };

  // Add handlers for direct View Details links
  useEffect(() => {
    // Select all standalone view details links
    const linksSelector = 'a[href*="view-details"]';
    const viewDetailsLinks = document.querySelectorAll(linksSelector);
    
    // Add click handlers to each link
    viewDetailsLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const projectId = link.getAttribute('href')?.split('view-details-')[1];
        if (projectId) {
          openProjectDetails(projectId);
        }
      });
    });
    
    return () => {
      // Clean up event listeners
      document.querySelectorAll(linksSelector).forEach(link => {
        link.removeEventListener('click', () => {});
      });
    };
  }, []);

  return (
    <section 
      id="projects" 
      ref={sectionRef}
      className="py-20 bg-gray-50 dark:bg-true-black relative overflow-hidden"
    >
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 z-0">
        {/* Tech Network Grid */}
        <div className={`tech-grid ${isDark ? 'tech-grid-dark' : 'tech-grid-light'}`}></div>
        
        {/* Animated particles */}
        <div className="particles-container">
          {Array.from({ length: 25 }).map((_, index) => (
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
          {Array.from({ length: 12 }).map((_, index) => (
            <div 
              key={index} 
              className="rain-column"
              style={{
                left: `${(index * 8) + Math.random() * 5}%`,
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
        
        {/* Data stream animations */}
        <div className="data-streams">
          {Array.from({ length: 8 }).map((_, index) => (
            <div 
              key={index}
              className={`data-stream ${isDark ? 'data-stream-dark' : 'data-stream-light'}`}
              style={{
                top: `${Math.random() * 100}%`,
                left: `-50px`,
                width: `${Math.random() * 200 + 100}px`,
                height: '1px',
                animationDuration: `${Math.random() * 5 + 5}s`,
                animationDelay: `${Math.random() * 5}s`,
                transform: `rotate(${Math.random() * 20 - 10}deg)`
              }}
            ></div>
          ))}
        </div>
        
        {/* Floating code snippets */}
        <div className="code-snippets">
          {Array.from({ length: 6 }).map((_, index) => (
            <div 
              key={index}
              className={`code-snippet ${isDark ? 'code-snippet-dark' : 'code-snippet-light'}`}
              style={{
                top: `${Math.random() * 80 + 10}%`,
                left: `${Math.random() * 80 + 10}%`,
                animationDuration: `${Math.random() * 10 + 20}s`,
                animationDelay: `${Math.random() * 10}s`
              }}
            >
              {index === 0 ? 'const project = new Project();' : 
               index === 1 ? 'import { useState } from "react";' : 
               index === 2 ? 'function analyze(data) { return result; }' :
               index === 3 ? 'class AIModel extends BaseModel {}' : 
               index === 4 ? 'const data = fetchAPI("/endpoint");' : 
               'export default Projects;'}
            </div>
          ))}
        </div>
        
        {/* Floating tech elements */}
        <div className={`absolute ${isDark ? 'tech-elements-dark' : 'tech-elements-light'}`}></div>
      </div>
      
      {/* Background Mesh Pattern */}
      <div 
        className="absolute inset-0 bg-mesh-pattern opacity-5 dark:opacity-5 -z-10"
        aria-hidden="true"
      ></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Title with enhanced animation */}
        <SectionHeading
          title="Projects & Work"
          subtitle="Explore my projects showcasing my skills and experience in AI, data analysis, IoT, and software development."
        />
        
        {/* Project Controls with enhanced animation and styling */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between"
        >
          <div className="w-full md:w-auto">
            <SearchBar 
              placeholder="Search projects..." 
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          
          <div className="flex items-center gap-4">
            <motion.div 
              className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm card-glow"
              whileHover={{ scale: 1.02 }}
            >
              <motion.button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 ${viewMode === 'grid' 
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md' 
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}
                whileHover={viewMode !== 'grid' ? { scale: 1.1, backgroundColor: '#f0f9ff' } : {}}
                whileTap={{ scale: 0.95 }}
                aria-label="Grid view"
              >
                <FiGrid size={18} />
              </motion.button>
              <motion.button
                onClick={() => setViewMode('list')}
                className={`p-2.5 ${viewMode === 'list' 
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md' 
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}
                whileHover={viewMode !== 'list' ? { scale: 1.1, backgroundColor: '#f0f9ff' } : {}}
                whileTap={{ scale: 0.95 }}
                aria-label="List view"
              >
                <FiList size={18} />
              </motion.button>
            </motion.div>
            
            <motion.div
              className="relative"
              whileHover={{ scale: 1.02 }}
            >
              <motion.button
                className="flex items-center gap-2 py-2 px-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-800 dark:text-gray-200 shadow-sm card-glow"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Filter projects"
              >
                <FiFilter size={16} />
                <span className="text-sm font-medium">Filter</span>
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Filter Categories with enhanced animation and styling */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-wrap justify-center gap-3 mb-12 px-4 py-4 bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-100 dark:border-gray-700/50 shadow-md card-glow"
        >
          {categories.map((category, index) => (
            <AnimatePresence key={category}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.3, 
                  delay: index * 0.05, 
                  ease: [0.22, 1, 0.36, 1] 
                }}
              >
                <FilterTag
                  key={category}
                  label={category}
                  isActive={filter === category}
                  onClick={() => setFilter(category)}
                />
              </motion.div>
            </AnimatePresence>
          ))}
        </motion.div>
        
        {/* Projects Grid/List with enhanced animation */}
        <div ref={containerRef}>
          {isEmpty ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="text-center py-16 bg-white dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700/50 shadow-md card-glow"
            >
              <motion.div 
                className="mx-auto w-24 h-24 mb-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-600 icon-glow"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 14h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </motion.div>
              <motion.h3 
                className="text-xl font-bold text-gray-900 dark:text-white mb-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                No projects found
              </motion.h3>
              <motion.p 
                className="text-gray-600 dark:text-gray-400 mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                No projects match your current filter and search criteria.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Button 
                  onClick={() => {
                    setFilter('all');
                    setSearchQuery('');
                  }}
                  variant="primary"
                  className="hover-effect"
                >
                  View All Projects
                </Button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.5 }}
              className={viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" 
                : "flex flex-col gap-6"
              }
            >
              {getVisibleProjects().map((project, index) => (
                <ProjectCard 
                  key={project.id}
                  project={project}
                  index={index}
                  viewMode={viewMode}
                  prefersReducedMotion={prefersReducedMotion}
                  onViewDetails={openProjectDetails} // Pass the handler
                />
              ))}
            </motion.div>
          )}
          
          {/* Load More Button with enhanced animation and styling */}
          {!isEmpty && getVisibleProjects().length < projectsData.filter(p => p.visible).length && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="mt-12 text-center"
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={loadMoreProjects}
                  variant="outline"
                  className="min-w-[180px] card-glow"
                  disabled={isLoadingMore}
                >
                  {isLoadingMore ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                      Loading...
                    </div>
                  ) : (
                    <>Load More Projects</>
                  )}
                </Button>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
      
      {/* Add the Project Modal component */}
      <ProjectModal 
        isOpen={isModalOpen}
        projectId={selectedProjectId}
        onClose={closeProjectModal}
      />
      
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
        
        /* Floating Code Snippets */
        .code-snippets {
          position: absolute;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
        
        .code-snippet {
          position: absolute;
          font-family: monospace;
          font-size: 10px;
          padding: 5px;
          border-radius: 4px;
          animation: code-float infinite ease-in-out;
          white-space: nowrap;
          opacity: 0.3;
        }
        
        .code-snippet-dark {
          background: rgba(30, 41, 59, 0.7);
          color: rgba(59, 130, 246, 0.8);
          border: 1px solid rgba(59, 130, 246, 0.2);
        }
        
        .code-snippet-light {
          background: rgba(241, 245, 249, 0.8);
          color: rgba(30, 64, 175, 0.8);
          border: 1px solid rgba(59, 130, 246, 0.3);
        }
        
        @keyframes code-float {
          0%, 100% {
            transform: translateY(0) translateX(0) rotate(0deg);
          }
          25% {
            transform: translateY(-30px) translateX(10px) rotate(1deg);
          }
          50% {
            transform: translateY(0) translateX(20px) rotate(0deg);
          }
          75% {
            transform: translateY(30px) translateX(10px) rotate(-1deg);
          }
        }
        
        /* Tech Elements */
        .tech-elements-dark::before,
        .tech-elements-dark::after,
        .tech-elements-light::before,
        .tech-elements-light::after {
          content: "";
          position: absolute;
          border-radius: 50%;
        }
        
        .tech-elements-dark::before {
          width: 250px;
          height: 250px;
          top: 15%;
          left: 10%;
          animation: rotate 40s linear infinite;
          border: 1px solid rgba(59, 130, 246, 0.2);
          box-shadow: 0 0 40px rgba(59, 130, 246, 0.1);
        }
        
        .tech-elements-dark::after {
          width: 300px;
          height: 300px;
          bottom: 5%;
          right: 5%;
          animation: rotate 50s linear infinite reverse;
          border: 1px solid rgba(147, 51, 234, 0.2);
          box-shadow: 0 0 50px rgba(147, 51, 234, 0.1);
        }
        
        .tech-elements-light::before {
          width: 250px;
          height: 250px;
          top: 15%;
          left: 10%;
          animation: rotate 40s linear infinite;
          border: 1.5px solid rgba(59, 130, 246, 0.4);
          box-shadow: 0 0 40px rgba(59, 130, 246, 0.2);
        }
        
        .tech-elements-light::after {
          width: 300px;
          height: 300px;
          bottom: 5%;
          right: 5%;
          animation: rotate 50s linear infinite reverse;
          border: 1.5px solid rgba(147, 51, 234, 0.4);
          box-shadow: 0 0 50px rgba(147, 51, 234, 0.2);
        }
        
        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
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
        
        /* Glowing focus points */
        .focus-point {
          position: relative;
        }
        
        .focus-point::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .focus-point:hover::after {
          opacity: 1;
        }
        
        /* Hover effect for buttons */
        .hover-effect {
          position: relative;
          overflow: hidden;
        }
        
        .hover-effect::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.2), transparent);
          transform: translateX(-100%);
          transition: transform 0.6s;
        }
        
        .hover-effect:hover::before {
          transform: translateX(100%);
        }
      `}</style>
    </section>
  );
};

export default Projects;