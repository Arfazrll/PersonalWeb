import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  FiX, 
  FiExternalLink, 
  FiGithub, 
  FiChevronRight, 
  FiCalendar, 
  FiTag, 
  FiAward,
  FiCpu,
  FiFeather,
  FiCode,
  FiShare2,
  FiHeart,
  FiBookmark,
  FiArrowLeft,
  FiLayout,
  FiList,
  FiInfo
} from 'react-icons/fi';
import { projects } from '@/utils/data';
import { motion } from 'framer-motion';

interface ProjectModalProps {
  isOpen: boolean;
  projectId: string | null;
  onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ isOpen, projectId, onClose }) => {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isVisible, setIsVisible] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [animationPhase, setAnimationPhase] = useState('initial');
  
  const modalRef = useRef<HTMLDivElement>(null);
  const tabContentRef = useRef<HTMLDivElement>(null);
  
  // Mount component only on client side
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle modal visibility with CSS transitions
  useEffect(() => {
    if (isOpen) {
      // Small delay to allow for animation
      document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
      
      setAnimationPhase('opening');
      const timer = setTimeout(() => {
        setIsVisible(true);
        setAnimationPhase('visible');
      }, 10);
      return () => clearTimeout(timer);
    } else {
      setAnimationPhase('closing');
      setIsVisible(false);
      
      // Restore scrolling after closing animation completes
      const timer = setTimeout(() => {
        document.body.style.overflow = '';
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Find the selected project
  const project = projectId ? projects.find(p => p.id === projectId) : null;

  // Handle click outside the modal to close it
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle keyboard events (close on Escape key)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Smooth scroll to top when changing tabs
  useEffect(() => {
    if (tabContentRef.current) {
      tabContentRef.current.scrollTop = 0;
    }
  }, [activeTab]);

  // Define related projects (mock data since it's not in the original project type)
  const relatedProjects = project 
    ? projects.filter(p => p.category === project.category && p.id !== project.id).slice(0, 3)
    : [];

  // Share project functionality
  const shareProject = () => {
    if (navigator.share && project) {
      navigator.share({
        title: project.title,
        text: `Check out this project: ${project.title}`,
        url: window.location.href,
      })
      .catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback for browsers that don't support the Web Share API
      if (project) {
        navigator.clipboard.writeText(window.location.href)
          .then(() => {
            alert('Link copied to clipboard!');
          })
          .catch((error) => console.error('Error copying to clipboard:', error));
      }
    }
  };

  // Don't render anything on server side
  if (!mounted) return null;

  // If no project is selected, don't render the modal
  if (!project) return null;

  // Don't render if not open
  if (!isOpen && animationPhase === 'initial') return null;

  // Tab icons for better visual representation
  const tabIcons = {
    overview: <FiInfo size={16} />,
    gallery: <FiLayout size={16} />,
    details: <FiList size={16} />,
  };

  // Mock completion date since it's not in the original project type
  const completionDate = 'August 2023';

  return createPortal(
    <div 
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-6 transition-all duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      } ${animationPhase === 'closing' ? 'pointer-events-none' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
    >
      {/* Backdrop with blur effect */}
      <div 
        className="absolute inset-0 bg-secondary-900/75 backdrop-blur-sm transition-opacity duration-300"
        onClick={handleBackdropClick}
        style={{
          opacity: isVisible ? 1 : 0
        }}
      />
      
      {/* Modal container */}
      <div 
        ref={modalRef}
        className={`relative bg-white dark:bg-secondary-800 rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col transition-all duration-300 z-10 ${
          isVisible 
            ? 'opacity-100 scale-100 translate-y-0' 
            : 'opacity-0 scale-95 translate-y-8'
        }`}
        aria-labelledby="project-modal-title"
      >
        {/* Close button with improved positioning and appearance */}
        <button
          className="absolute top-5 right-5 z-50 p-2 bg-white/90 dark:bg-secondary-800/90 backdrop-blur-sm rounded-full text-secondary-800 dark:text-secondary-200 hover:bg-secondary-200 dark:hover:bg-secondary-700 transition-colors shadow-md hover:scale-105 active:scale-95 transform duration-150"
          onClick={onClose}
          aria-label="Close modal"
        >
          <FiX size={20} />
        </button>
        
        {/* Cover Image with parallax effect */}
        <div 
          className="relative w-full h-72 md:h-80 overflow-hidden bg-gradient-to-br from-secondary-900 to-secondary-700 flex items-center justify-center"
        >
          <div 
            className="absolute inset-0 bg-center bg-cover filter brightness-75 transform transition-transform duration-700 ease-out"
            style={{
              backgroundImage: `url(${project.image || '/path/to/default-cover.jpg'})`,
              transform: isVisible ? 'scale(1)' : 'scale(1.1)'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary-900/90 via-secondary-900/30 to-transparent transition-opacity duration-500" />
          
          {/* Improved Back button for easy navigation */}
          <motion.button
            onClick={onClose}
            className="absolute top-5 left-5 z-50 flex items-center gap-2 py-1.5 px-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full text-white text-sm font-medium transition-colors shadow-md"
            whileHover={{ scale: 1.05, x: -3 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            aria-label="Go back"
          >
            <FiArrowLeft size={14} />
            <span>Back</span>
          </motion.button>
          
          {/* Project info overlay */}
          <div className="absolute bottom-0 left-0 w-full p-6 z-10">
            <h2 
              id="project-modal-title"
              className="text-white text-3xl font-bold mb-2 transform transition-all duration-500 delay-100"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)'
              }}
            >
              {project.title}
            </h2>
            
            <div 
              className="flex flex-wrap gap-2 mb-3 transform transition-all duration-500 delay-200"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)'
              }}
            >
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary-600/80 text-white backdrop-blur-sm flex items-center">
                <FiTag size={12} className="mr-1" />
                {project.category}
              </span>
              
              {project.featured && (
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-yellow-500/80 text-white backdrop-blur-sm flex items-center">
                  <FiAward size={12} className="mr-1" />
                  Featured
                </span>
              )}
              
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-white/20 text-white backdrop-blur-sm flex items-center">
                <FiCalendar size={12} className="mr-1" />
                {completionDate}
              </span>
            </div>
            
            <p 
              className="text-white/80 text-sm mb-4 max-w-3xl line-clamp-2 transform transition-all duration-500 delay-300"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)'
              }}
            >
              {project.description}
            </p>
            
            {/* Technology tags with horizontal scroll on mobile */}
            <div 
              className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide transform transition-all duration-500 delay-400"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)'
              }}
            >
              {project.technologies.map((tech) => (
                <span 
                  key={tech} 
                  className="px-2.5 py-1 rounded-full bg-white/10 text-white/90 backdrop-blur-sm text-xs whitespace-nowrap"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        {/* Quick actions toolbar */}
        <div className="bg-white dark:bg-secondary-800 border-b border-secondary-100 dark:border-secondary-700 py-1.5 px-6 flex justify-between items-center">
          <div className="text-sm text-secondary-500 dark:text-secondary-400 flex items-center gap-1.5">
            <span className="hidden sm:inline">Project</span>
            <FiChevronRight size={14} className="hidden sm:inline" />
            <span className="font-medium text-secondary-700 dark:text-secondary-300">{project.title}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsLiked(!isLiked)}
              className={`p-1.5 rounded-full transition-colors ${
                isLiked 
                  ? 'text-red-500 bg-red-50 dark:bg-red-900/20' 
                  : 'text-secondary-400 hover:text-secondary-500 hover:bg-secondary-50 dark:hover:bg-secondary-700/50'
              }`}
              aria-label={isLiked ? "Unlike project" : "Like project"}
            >
              <FiHeart 
                size={16} 
                className={`${isLiked ? 'fill-current' : ''}`} 
              />
            </button>
            
            <button 
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`p-1.5 rounded-full transition-colors ${
                isBookmarked 
                  ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' 
                  : 'text-secondary-400 hover:text-secondary-500 hover:bg-secondary-50 dark:hover:bg-secondary-700/50'
              }`}
              aria-label={isBookmarked ? "Remove bookmark" : "Bookmark project"}
            >
              <FiBookmark 
                size={16} 
                className={`${isBookmarked ? 'fill-current' : ''}`} 
              />
            </button>
            
            <button 
              onClick={shareProject}
              className="p-1.5 rounded-full text-secondary-400 hover:text-secondary-500 hover:bg-secondary-50 dark:hover:bg-secondary-700/50 transition-colors"
              aria-label="Share project"
            >
              <FiShare2 size={16} />
            </button>
          </div>
        </div>
        
        {/* Enhanced Tab Navigation */}
        <div className="flex border-b border-secondary-100 dark:border-secondary-700 px-6">
          {Object.entries(tabIcons).map(([tab, icon]) => (
            <button
              key={tab}
              className={`relative py-3 px-4 font-medium text-sm flex items-center gap-2 transition-colors ${
                activeTab === tab 
                  ? 'text-primary-600 dark:text-primary-400' 
                  : 'text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-secondary-200'
              }`}
              onClick={() => setActiveTab(tab)}
              aria-selected={activeTab === tab}
              role="tab"
            >
              {icon}
              <span className="capitalize">{tab}</span>
              
              {/* Animated underline indicator */}
              <span 
                className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 dark:bg-primary-400 transform transition-transform duration-300 ${
                  activeTab === tab ? 'scale-x-100' : 'scale-x-0'
                }`} 
              />
            </button>
          ))}
        </div>
        
        {/* Tab Content with smooth transitions */}
        <div 
          ref={tabContentRef}
          className="flex-grow overflow-y-auto custom-scrollbar scroll-smooth"
        >
          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8 animate-fade-in">
                <div>
                  <h3 className="text-xl font-bold text-secondary-900 dark:text-white mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
                      <FiInfo size={18} />
                    </span>
                    Project Overview
                  </h3>
                  <p className="text-secondary-600 dark:text-secondary-400 mb-6 leading-relaxed">
                    {project.description}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-lg font-semibold text-secondary-900 dark:text-white mb-3 flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-500 dark:bg-primary-400 mr-2"></span>
                        About the Project
                      </h4>
                      <p className="text-secondary-600 dark:text-secondary-400 mb-4 leading-relaxed">
                        This project demonstrates my skills in {project.technologies.join(', ')}. 
                        It was created to solve real-world problems in the {project.category} domain 
                        and showcases my ability to develop comprehensive solutions.
                      </p>
                      <p className="text-secondary-600 dark:text-secondary-400 leading-relaxed">
                        Throughout this project, I focused on delivering high-quality code while 
                        ensuring the solution met all requirements. The implementation follows best 
                        practices and industry standards.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-semibold text-secondary-900 dark:text-white mb-3 flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-500 dark:bg-primary-400 mr-2"></span>
                        Key Features
                      </h4>
                      <ul className="space-y-3 text-secondary-600 dark:text-secondary-400">
                        <li className="flex items-start transform hover:translate-x-1 transition-transform">
                          <FiChevronRight className="mt-1 mr-2 text-primary-600 dark:text-primary-400 flex-shrink-0" size={16} />
                          <span>Feature one of the project with detailed implementation</span>
                        </li>
                        <li className="flex items-start transform hover:translate-x-1 transition-transform">
                          <FiChevronRight className="mt-1 mr-2 text-primary-600 dark:text-primary-400 flex-shrink-0" size={16} />
                          <span>Feature two highlighting the technical challenges overcome</span>
                        </li>
                        <li className="flex items-start transform hover:translate-x-1 transition-transform">
                          <FiChevronRight className="mt-1 mr-2 text-primary-600 dark:text-primary-400 flex-shrink-0" size={16} />
                          <span>Feature three demonstrating problem-solving approach</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-secondary-100 dark:border-secondary-700 pt-8">
                  <h4 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4 flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500 dark:bg-primary-400 mr-2"></span>
                    Project Outcome
                  </h4>
                  <p className="text-secondary-600 dark:text-secondary-400 mb-6 leading-relaxed">
                    The project resulted in a robust solution that successfully addressed the intended 
                    needs and requirements. The implementation demonstrated high performance, 
                    scalability, and maintainability.
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div className="bg-secondary-50 dark:bg-secondary-800/60 rounded-lg p-4 text-center transform hover:scale-105 transition-transform duration-300 hover:shadow-lg">
                      <FiCpu className="mx-auto mb-2 text-primary-600 dark:text-primary-400" size={24} />
                      <h5 className="font-medium text-secondary-900 dark:text-white mb-1">Performance</h5>
                      <p className="text-xs text-secondary-500 dark:text-secondary-400">Optimized for speed</p>
                    </div>
                    
                    <div className="bg-secondary-50 dark:bg-secondary-800/60 rounded-lg p-4 text-center transform hover:scale-105 transition-transform duration-300 hover:shadow-lg">
                      <FiFeather className="mx-auto mb-2 text-primary-600 dark:text-primary-400" size={24} />
                      <h5 className="font-medium text-secondary-900 dark:text-white mb-1">Lightweight</h5>
                      <p className="text-xs text-secondary-500 dark:text-secondary-400">Minimal resource usage</p>
                    </div>
                    
                    <div className="bg-secondary-50 dark:bg-secondary-800/60 rounded-lg p-4 text-center transform hover:scale-105 transition-transform duration-300 hover:shadow-lg">
                      <FiCode className="mx-auto mb-2 text-primary-600 dark:text-primary-400" size={24} />
                      <h5 className="font-medium text-secondary-900 dark:text-white mb-1">Clean Code</h5>
                      <p className="text-xs text-secondary-500 dark:text-secondary-400">Well-structured design</p>
                    </div>
                    
                    <div className="bg-secondary-50 dark:bg-secondary-800/60 rounded-lg p-4 text-center transform hover:scale-105 transition-transform duration-300 hover:shadow-lg">
                      <FiAward className="mx-auto mb-2 text-primary-600 dark:text-primary-400" size={24} />
                      <h5 className="font-medium text-secondary-900 dark:text-white mb-1">Quality</h5>
                      <p className="text-xs text-secondary-500 dark:text-secondary-400">Thoroughly tested</p>
                    </div>
                  </div>
                </div>
                
                {/* Related Projects Section */}
                {relatedProjects.length > 0 && (
                  <div className="border-t border-secondary-100 dark:border-secondary-700 pt-8">
                    <h4 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4 flex items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-500 dark:bg-primary-400 mr-2"></span>
                      Related Projects
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {relatedProjects.map((relatedProject) => (
                        <div
                          key={relatedProject.id}
                          className="bg-white dark:bg-secondary-800/50 rounded-lg overflow-hidden shadow-sm border border-secondary-100 dark:border-secondary-700 hover:shadow-md transition-shadow cursor-pointer group"
                          onClick={() => {
                            // Handle related project click
                          }}
                        >
                          <div className="h-32 bg-secondary-200 dark:bg-secondary-700 relative">
                            <div className="absolute inset-0 flex items-center justify-center bg-secondary-900/30">
                              <span className="text-white/80 text-sm font-medium">Project Image</span>
                            </div>
                          </div>
                          <div className="p-4">
                            <h5 className="font-medium text-secondary-900 dark:text-white mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                              {relatedProject.title}
                            </h5>
                            <p className="text-xs text-secondary-500 dark:text-secondary-400 line-clamp-2">
                              {relatedProject.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Gallery Tab content */}
            {activeTab === 'gallery' && (
              <div className="animate-fade-in">
                <h3 className="text-xl font-bold text-secondary-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
                    <FiLayout size={18} />
                  </span>
                  Project Gallery
                </h3>
                <p className="text-secondary-600 dark:text-secondary-400 mb-6 leading-relaxed">
                  Project screenshots and visual documentation will be displayed here. The gallery is currently being updated with the latest images.
                </p>
                
                {/* Simple gallery placeholder */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {[1, 2, 3, 4].map((index) => (
                    <div 
                      key={index}
                      className="relative h-48 bg-secondary-200 dark:bg-secondary-700 rounded-lg flex items-center justify-center overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-secondary-500/5 dark:from-primary-500/10 dark:to-secondary-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <span className="text-secondary-500 dark:text-secondary-400 text-sm">Screenshot {index}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Details Tab content */}
            {activeTab === 'details' && (
              <div className="animate-fade-in">
                <h3 className="text-xl font-bold text-secondary-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
                    <FiList size={18} />
                  </span>
                  Technical Details
                </h3>
                
                <div className="space-y-8">
                  <div>
                    <h4 className="text-lg font-semibold text-secondary-900 dark:text-white mb-3 flex items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-500 dark:bg-primary-400 mr-2"></span>
                      Technologies Used
                    </h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech) => (
                        <span 
                          key={tech} 
                          className="px-3 py-1.5 rounded-full bg-secondary-100 dark:bg-secondary-700 text-secondary-700 dark:text-secondary-300 text-sm hover:bg-primary-50 hover:text-primary-700 dark:hover:bg-primary-900/30 dark:hover:text-primary-300 transition-colors cursor-default"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-secondary-900 dark:text-white mb-3 flex items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-500 dark:bg-primary-400 mr-2"></span>
                      Architecture
                    </h4>
                    <p className="text-secondary-600 dark:text-secondary-400 mb-4 leading-relaxed">
                      The project architecture was carefully designed to ensure scalability and maintainability.
                      Key technical aspects include database optimization, efficient API design, and responsive UI implementation.
                    </p>
                    
                    {/* Architecture diagram with hover effect */}
                    <div className="relative h-64 bg-secondary-100 dark:bg-secondary-800/60 rounded-lg flex items-center justify-center overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-secondary-500/5 dark:from-primary-500/10 dark:to-secondary-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <span className="text-secondary-500 dark:text-secondary-400 text-sm">Architecture Diagram Placeholder</span>
                      
                      {/* Fancy ornamental corners that appear on hover */}
                      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary-500/0 group-hover:border-primary-500/50 transition-colors duration-300" />
                      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary-500/0 group-hover:border-primary-500/50 transition-colors duration-300" />
                      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary-500/0 group-hover:border-primary-500/50 transition-colors duration-300" />
                      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary-500/0 group-hover:border-primary-500/50 transition-colors duration-300" />
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-secondary-900 dark:text-white mb-3 flex items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-500 dark:bg-primary-400 mr-2"></span>
                      Implementation Challenges
                    </h4>
                    <ul className="space-y-4 text-secondary-600 dark:text-secondary-400">
                      {[1, 2, 3].map((num) => (
                        <li key={num} className="flex items-start">
                          <div className="flex-shrink-0 mt-1">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs font-medium">
                              {num}
                            </span>
                          </div>
                          <div className="ml-3">
                            <h5 className="font-medium text-secondary-900 dark:text-white mb-1">
                              Challenge {num}: {num === 1 ? 'Performance Optimization' : num === 2 ? 'API Integration' : 'Mobile Responsiveness'}
                            </h5>
                            <p className="text-sm text-secondary-600 dark:text-secondary-400 leading-relaxed">
                              {num === 1 
                                ? 'Improved load times by implementing data caching and lazy loading of components, resulting in a 40% performance boost.'
                                : num === 2 
                                  ? 'Developed a secure and efficient API integration layer to connect with multiple third-party services while maintaining data consistency.'
                                  : 'Created a responsive design system that ensures a seamless experience across all device sizes, from mobile phones to large desktop screens.'
                              }
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Enhanced footer with action buttons */}
        <div className="p-6 border-t border-secondary-100 dark:border-secondary-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex space-x-3 w-full sm:w-auto">
            <motion.a 
              href={project.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white rounded-lg transition-colors w-full sm:w-auto justify-center font-medium shadow-sm hover:shadow group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiExternalLink size={16} className="group-hover:rotate-12 transition-transform" />
              <span>Visit Project</span>
            </motion.a>
            
            <motion.a 
              href="#" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 bg-secondary-100 dark:bg-secondary-700 hover:bg-secondary-200 dark:hover:bg-secondary-600 active:bg-secondary-300 dark:active:bg-secondary-800 text-secondary-900 dark:text-white rounded-lg transition-colors w-full sm:w-auto justify-center font-medium shadow-sm hover:shadow"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiGithub size={16} className="group-hover:scale-110 transition-transform" />
              <span>View Code</span>
            </motion.a>
          </div>
          
          <div className="flex items-center gap-2 text-secondary-500 dark:text-secondary-400 text-sm w-full sm:w-auto justify-center sm:justify-end">
            <FiCalendar size={14} />
            <span>Completed: {completionDate}</span>
          </div>
        </div>
        
        {/* CSS Animations */}
        <style jsx global>{`
          /* Custom scrollbar */
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(156, 163, 175, 0.5);
            border-radius: 9999px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(156, 163, 175, 0.7);
          }
          
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .animate-fade-in {
            animation: fade-in 0.3s ease-out forwards;
          }
          
          /* Hide scrollbar for WebKit browsers */
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          
          /* Hide scrollbar for IE, Edge, and Firefox */
          .scrollbar-hide {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
          }
        `}</style>
      </div>
    </div>,
    document.body
  );
};

export default ProjectModal;