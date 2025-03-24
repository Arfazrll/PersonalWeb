import { useState, useRef, useEffect } from 'react';

// React components for icons
import { 
  FiExternalLink, 
  FiGithub, 
  FiFileText, 
  FiAward, 
  FiCalendar, 
  FiTag,
  FiArrowRight,
  FiFilter,
  FiGrid,
  FiList,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';
import { projects } from '@/utils/data';
import Button from '../ui/Button';
import Card from '../ui/Card';
import SearchBar from '../ui/SearchBar';
import ProjectModal from '../ui/ProjectModal';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import FilterTag from '../ui/FilterTag';

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

// Custom hook for intersection observer (replacement for useInView)
function useCustomInView(options = { threshold: 0.1, once: false }) {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLElement | null>(null);

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

const Projects = () => {
  const [filter, setFilter] = useState<ProjectCategory>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [projectsData, setProjectsData] = useState<ExtendedProject[]>([]);
  const [isEmpty, setIsEmpty] = useState<boolean>(false);
  const [visibleCount, setVisibleCount] = useState<number>(6);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const { ref: sectionRef, isInView } = useCustomInView({ once: false, threshold: 0.1 });
  const prefersReducedMotion = usePrefersReducedMotion();

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
    }, 600);
  };

  // Get visible projects based on current count limit
  const getVisibleProjects = () => {
    return projectsData
      .filter(project => project.visible)
      .slice(0, visibleCount);
  };

  // Open project modal
  const openProjectModal = (projectId: string) => {
    setSelectedProject(projectId);
    setIsModalOpen(true);
    
    // Prevent scrolling when modal is open
    document.body.style.overflow = 'hidden';
  };

  // Close project modal
  const closeProjectModal = () => {
    setIsModalOpen(false);
    
    // Re-enable scrolling when modal is closed
    document.body.style.overflow = 'auto';
  };

  // Handle search query change
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    
    // Reset visible count to initial value when search changes
    setVisibleCount(6);
  };

  // Animation transition settings
  const getBaseTransition = () => {
    return prefersReducedMotion ? 'none' : 'opacity 0.5s, transform 0.5s';
  };

  return (
    <section id="projects" ref={sectionRef} className="py-20 bg-secondary-50 dark:bg-secondary-900/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-primary-500/10 dark:bg-primary-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent-500/10 dark:bg-accent-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Title */}
        <div
          className="text-center mb-16"
          style={{
            opacity: isInView ? 1 : 0,
            transform: `translateY(${isInView ? 0 : 20}px)`,
            transition: getBaseTransition()
          }}
        >
          <h2 className="section-title mx-auto">Projects & Work</h2>
          <p className="text-secondary-600 dark:text-secondary-400 max-w-2xl mx-auto mt-6">
            Explore my projects showcasing my skills and experience in AI, data analysis, IoT, and software development.
          </p>
        </div>
        
        {/* Project Controls */}
        <div
          className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between"
          style={{
            opacity: isInView ? 1 : 0,
            transform: `translateY(${isInView ? 0 : 10}px)`,
            transition: getBaseTransition(),
            transitionDelay: '0.1s'
          }}
        >
          <div className="w-full md:w-auto">
            <SearchBar 
              placeholder="Search projects..." 
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center border border-secondary-200 dark:border-secondary-700 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 ${viewMode === 'grid' 
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' 
                  : 'bg-white dark:bg-secondary-800 text-secondary-600 dark:text-secondary-400'}`}
                aria-label="Grid view"
              >
                <FiGrid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 ${viewMode === 'list' 
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' 
                  : 'bg-white dark:bg-secondary-800 text-secondary-600 dark:text-secondary-400'}`}
                aria-label="List view"
              >
                <FiList size={18} />
              </button>
            </div>
            
            <div className="relative">
              <button
                className="flex items-center gap-2 py-2 px-4 bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-lg text-secondary-800 dark:text-secondary-200"
                aria-label="Filter projects"
                style={{
                  transition: 'transform 0.2s',
                }}
                onMouseDown={() => {
                  const button = document.activeElement as HTMLElement;
                  if (button) button.style.transform = 'scale(0.95)';
                }}
                onMouseUp={() => {
                  const button = document.activeElement as HTMLElement;
                  if (button) button.style.transform = 'scale(1)';
                }}
                onMouseOver={() => {
                  const button = document.activeElement as HTMLElement;
                  if (button) button.style.transform = 'scale(1.05)';
                }}
                onMouseOut={() => {
                  const button = document.activeElement as HTMLElement;
                  if (button) button.style.transform = 'scale(1)';
                }}
              >
                <FiFilter size={16} />
                <span className="text-sm font-medium">Filter</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Filter Categories */}
        <div
          className="flex flex-wrap justify-center gap-3 mb-12 px-4 py-4 bg-white dark:bg-secondary-800/50 backdrop-blur-sm rounded-xl border border-secondary-100 dark:border-secondary-700/50"
          style={{
            opacity: isInView ? 1 : 0,
            transform: `translateY(${isInView ? 0 : 10}px)`,
            transition: getBaseTransition(),
            transitionDelay: '0.2s'
          }}
        >
          {categories.map((category) => (
            <FilterTag
              key={category}
              label={category}
              isActive={filter === category}
              onClick={() => setFilter(category)}
            />
          ))}
        </div>
        
        {/* Projects Grid/List */}
        <div ref={containerRef}>
          {isEmpty ? (
            <div
              className="text-center py-16"
              style={{
                opacity: isInView ? 1 : 0,
                transition: getBaseTransition()
              }}
            >
              <div className="mx-auto w-24 h-24 mb-6 rounded-full bg-secondary-100 dark:bg-secondary-800 flex items-center justify-center text-secondary-400 dark:text-secondary-600">
                <FiFileText size={32} />
              </div>
              <h3 className="text-xl font-bold text-secondary-900 dark:text-white mb-2">No projects found</h3>
              <p className="text-secondary-600 dark:text-secondary-400 mb-6">
                No projects match your current filter and search criteria.
              </p>
              <Button 
                onClick={() => {
                  setFilter('all');
                  setSearchQuery('');
                }}
                variant="primary"
              >
                View All Projects
              </Button>
            </div>
          ) : (
            <div
              className={viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" 
                : "flex flex-col gap-6"
              }
              style={{
                opacity: isInView ? 1 : 0,
                transition: getBaseTransition()
              }}
            >
              {getVisibleProjects().map((project, index) => (
                <div
                  key={project.id}
                  style={{
                    opacity: isInView ? 1 : 0,
                    transform: `translateY(${isInView ? 0 : 20}px)`,
                    transition: getBaseTransition(),
                    transitionDelay: prefersReducedMotion ? '0s' : `${index * 0.1}s`
                  }}
                >
                  {viewMode === 'grid' ? (
                    <Card hover className="h-full flex flex-col group">
                      {/* Project Image */}
                      <div className="relative w-full h-48 mb-4 overflow-hidden rounded-lg group-hover:shadow-md transition-shadow duration-300">
                        <div className="bg-secondary-200 dark:bg-secondary-700 w-full h-full flex items-center justify-center text-secondary-400 dark:text-secondary-500">
                          <span className="text-sm">Image Placeholder</span>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-end p-4">
                          <button
                            onClick={() => openProjectModal(project.id)}
                            className="bg-white text-secondary-900 p-2 rounded-full"
                            aria-label={`View ${project.title} details`}
                            style={{
                              transition: 'transform 0.2s',
                            }}
                            onMouseOver={(e) => {
                              (e.target as HTMLElement).style.transform = 'scale(1.1)';
                            }}
                            onMouseOut={(e) => {
                              (e.target as HTMLElement).style.transform = 'scale(1)';
                            }}
                            onMouseDown={(e) => {
                              (e.target as HTMLElement).style.transform = 'scale(0.9)';
                            }}
                            onMouseUp={(e) => {
                              (e.target as HTMLElement).style.transform = 'scale(1.1)';
                            }}
                          >
                            <FiExternalLink size={18} />
                          </button>
                        </div>
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
                        
                        <h3 className="text-xl font-bold text-secondary-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{project.title}</h3>
                        
                        <p className="text-secondary-600 dark:text-secondary-400 text-sm mb-4 line-clamp-3">
                          {project.description}
                        </p>
                        
                        {/* Technologies */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.technologies.slice(0, 3).map((tech) => (
                            <span 
                              key={tech} 
                              className="px-2 py-1 text-xs rounded bg-secondary-100 dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300"
                            >
                              {tech}
                            </span>
                          ))}
                          {project.technologies.length > 3 && (
                            <span className="px-2 py-1 text-xs rounded bg-secondary-100 dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300">
                              +{project.technologies.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Project Links */}
                      <div className="mt-auto pt-4 border-t border-secondary-100 dark:border-secondary-800">
                        <div className="flex items-center justify-between">
                          <button
                            onClick={() => openProjectModal(project.id)}
                            className="flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 transition-colors font-medium text-sm"
                          >
                            View Details
                            <FiArrowRight className="ml-1" size={16} />
                          </button>
                          
                          <div className="flex space-x-3">
                            <a 
                              href={project.link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="p-2 rounded-full bg-secondary-100 dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300 hover:bg-primary-100 hover:text-primary-600 dark:hover:bg-primary-900/20 dark:hover:text-primary-400 transition-colors"
                              aria-label="View project"
                            >
                              <FiExternalLink size={16} />
                            </a>
                            <a 
                              href="#" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="p-2 rounded-full bg-secondary-100 dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300 hover:bg-primary-100 hover:text-primary-600 dark:hover:bg-primary-900/20 dark:hover:text-primary-400 transition-colors"
                              aria-label="View source code"
                            >
                              <FiGithub size={16} />
                            </a>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ) : (
                    // List view
                    <Card hover className="p-0 overflow-hidden group">
                      <div className="flex flex-col md:flex-row">
                        {/* Project Image (smaller in list view) */}
                        <div className="relative md:w-64 h-48 md:h-auto overflow-hidden bg-secondary-200 dark:bg-secondary-700 flex items-center justify-center">
                          <span className="text-sm text-secondary-400 dark:text-secondary-500">Image Placeholder</span>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        
                        {/* Project Info */}
                        <div className="flex-grow p-6">
                          <div className="flex flex-wrap items-start justify-between mb-2">
                            <div className="flex gap-2 mb-2">
                              <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300 flex items-center">
                                <FiTag size={12} className="mr-1" />
                                {project.category}
                              </span>
                              
                              {project.featured && (
                                <span className="px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 flex items-center">
                                  <FiAward size={12} className="mr-1" />
                                  Featured
                                </span>
                              )}
                            </div>
                            
                            <span className="text-xs text-secondary-500 dark:text-secondary-400 flex items-center">
                              <FiCalendar size={12} className="mr-1" />
                              2023
                            </span>
                          </div>
                          
                          <h3 className="text-xl font-bold text-secondary-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{project.title}</h3>
                          
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
                          
                          {/* Action Buttons */}
                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-secondary-100 dark:border-secondary-800">
                            <button
                              onClick={() => openProjectModal(project.id)}
                              className="flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 transition-colors font-medium"
                            >
                              View Details
                              <FiArrowRight className="ml-1" size={16} />
                            </button>
                            
                            <div className="flex space-x-3">
                              <a 
                                href={project.link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="p-2 rounded-full bg-secondary-100 dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300 hover:bg-primary-100 hover:text-primary-600 dark:hover:bg-primary-900/20 dark:hover:text-primary-400 transition-colors"
                                aria-label="View project"
                              >
                                <FiExternalLink size={18} />
                              </a>
                              <a 
                                href="#" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="p-2 rounded-full bg-secondary-100 dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300 hover:bg-primary-100 hover:text-primary-600 dark:hover:bg-primary-900/20 dark:hover:text-primary-400 transition-colors"
                                aria-label="View source code"
                              >
                                <FiGithub size={18} />
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {/* Load More Button - Only show if there are more projects to load */}
          {!isEmpty && getVisibleProjects().length < projectsData.filter(p => p.visible).length && (
            <div
              className="mt-12 text-center"
              style={{
                opacity: isInView ? 1 : 0,
                transition: getBaseTransition()
              }}
            >
              <Button
                onClick={loadMoreProjects}
                variant="outline"
                className="min-w-[180px]"
                disabled={isLoadingMore}
              >
                {isLoadingMore ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                    Loading...
                  </div>
                ) : (
                  <>Load More Projects</>
                )}
              </Button>
            </div>
          )}
          
          {/* Pagination - Alternative to "Load More" */}
          {!isEmpty && getVisibleProjects().length > 6 && (
            <div
              className="mt-12 flex justify-center items-center gap-2"
              style={{
                opacity: isInView ? 1 : 0,
                transform: `translateY(${isInView ? 0 : 20}px)`,
                transition: getBaseTransition()
              }}
            >
              <button
                className="p-2 rounded-full bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 text-secondary-700 dark:text-secondary-300 hover:bg-primary-100 hover:text-primary-600 dark:hover:bg-primary-900/20 dark:hover:text-primary-400 transition-colors"
                aria-label="Previous page"
              >
                <FiChevronLeft size={18} />
              </button>
              
              {[1, 2, 3].map((page) => (
                <button
                  key={page}
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    page === 1 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 text-secondary-700 dark:text-secondary-300 hover:bg-primary-100 hover:text-primary-600 dark:hover:bg-primary-900/20 dark:hover:text-primary-400'
                  } transition-colors`}
                >
                  {page}
                </button>
              ))}
              
              <button
                className="p-2 rounded-full bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 text-secondary-700 dark:text-secondary-300 hover:bg-primary-100 hover:text-primary-600 dark:hover:bg-primary-900/20 dark:hover:text-primary-400 transition-colors"
                aria-label="Next page"
              >
                <FiChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Project Modal */}
      <ProjectModal
        isOpen={isModalOpen}
        projectId={selectedProject}
        onClose={closeProjectModal}
      />
    </section>
  );
};

export default Projects;