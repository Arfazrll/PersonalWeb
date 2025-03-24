import React, { useEffect, useState } from 'react';
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
  FiCode
} from 'react-icons/fi';
import { projects } from '@/utils/data';

interface ProjectModalProps {
  isOpen: boolean;
  projectId: string | null;
  onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ isOpen, projectId, onClose }) => {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  
  // Mount component only on client side
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle modal visibility with CSS transitions instead of framer-motion
  useEffect(() => {
    if (isOpen) {
      // Small delay to allow for animation
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 10);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
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

  // Define mock image gallery for the project
  const mockImages = [
    '/path/to/image1.jpg',
    '/path/to/image2.jpg',
    '/path/to/image3.jpg',
  ];

  // Navigate through images
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % mockImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => prevIndex === 0 ? mockImages.length - 1 : prevIndex - 1);
  };

  // Create an activeIndicator style for tab selection
  const getActiveIndicatorStyle = (isActive: boolean) => {
    return {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '2px',
      backgroundColor: isActive ? 'var(--color-primary-600)' : 'transparent',
      transition: 'background-color 0.3s ease'
    } as React.CSSProperties;
  };

  // Don't render anything on server side
  if (!mounted) return null;

  // If no project is selected, don't render the modal
  if (!project) return null;

  // Don't render if not open
  if (!isOpen) return null;

  return createPortal(
    <div 
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-6 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-secondary-900/80 backdrop-blur-sm"
        onClick={handleBackdropClick}
      />
      
      {/* Modal */}
      <div 
        className={`relative bg-white dark:bg-secondary-800 rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col transition-all duration-300 ${
          isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-8'
        }`}
      >
        {/* Close button */}
        <button
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 dark:bg-secondary-800/80 backdrop-blur-sm rounded-full text-secondary-800 dark:text-secondary-200 hover:bg-secondary-200 dark:hover:bg-secondary-700 transition-colors"
          onClick={onClose}
          aria-label="Close modal"
        >
          <FiX size={20} />
        </button>
        
        {/* Cover Image */}
        <div className="relative w-full h-64 bg-secondary-200 dark:bg-secondary-700 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-transparent to-secondary-900/30">
            <span className="text-white/80 text-lg">Project Cover Image</span>
          </div>
          <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/70 to-transparent">
            <h2 className="text-white text-3xl font-bold">{project.title}</h2>
            <div className="flex flex-wrap gap-2 mt-2">
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
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-grow overflow-y-auto custom-scrollbar">
          {/* Tabs */}
          <div className="flex border-b border-secondary-200 dark:border-secondary-700 px-6">
            <button
              className={`py-4 px-4 font-medium text-sm relative ${
                activeTab === 'overview' 
                  ? 'text-primary-600 dark:text-primary-400' 
                  : 'text-secondary-600 dark:text-secondary-400'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
              <div style={getActiveIndicatorStyle(activeTab === 'overview')} />
            </button>
            <button
              className={`py-4 px-4 font-medium text-sm relative ${
                activeTab === 'gallery' 
                  ? 'text-primary-600 dark:text-primary-400' 
                  : 'text-secondary-600 dark:text-secondary-400'
              }`}
              onClick={() => setActiveTab('gallery')}
            >
              Gallery
              <div style={getActiveIndicatorStyle(activeTab === 'gallery')} />
            </button>
            <button
              className={`py-4 px-4 font-medium text-sm relative ${
                activeTab === 'details' 
                  ? 'text-primary-600 dark:text-primary-400' 
                  : 'text-secondary-600 dark:text-secondary-400'
              }`}
              onClick={() => setActiveTab('details')}
            >
              Technical Details
              <div style={getActiveIndicatorStyle(activeTab === 'details')} />
            </button>
          </div>
          
          {/* Tab Content */}
          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="animate-fade-in">
                <h3 className="text-xl font-bold text-secondary-900 dark:text-white mb-4">Project Overview</h3>
                <p className="text-secondary-600 dark:text-secondary-400 mb-6">{project.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-semibold text-secondary-900 dark:text-white mb-3">About the Project</h4>
                    <p className="text-secondary-600 dark:text-secondary-400 mb-4">
                      This project demonstrates my skills in {project.technologies.join(', ')}. 
                      It was created to solve real-world problems in the {project.category} domain 
                      and showcases my ability to develop comprehensive solutions.
                    </p>
                    <p className="text-secondary-600 dark:text-secondary-400">
                      Throughout this project, I focused on delivering high-quality code while 
                      ensuring the solution met all requirements. The implementation follows best 
                      practices and industry standards.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-secondary-900 dark:text-white mb-3">Key Features</h4>
                    <ul className="space-y-2 text-secondary-600 dark:text-secondary-400">
                      <li className="flex items-start">
                        <FiChevronRight className="mt-1 mr-2 text-primary-600 dark:text-primary-400 flex-shrink-0" size={16} />
                        <span>Feature one of the project with detailed implementation</span>
                      </li>
                      <li className="flex items-start">
                        <FiChevronRight className="mt-1 mr-2 text-primary-600 dark:text-primary-400 flex-shrink-0" size={16} />
                        <span>Feature two highlighting the technical challenges overcome</span>
                      </li>
                      <li className="flex items-start">
                        <FiChevronRight className="mt-1 mr-2 text-primary-600 dark:text-primary-400 flex-shrink-0" size={16} />
                        <span>Feature three demonstrating problem-solving approach</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-8 border-t border-secondary-200 dark:border-secondary-700 pt-6">
                  <h4 className="text-lg font-semibold text-secondary-900 dark:text-white mb-3">Project Outcome</h4>
                  <p className="text-secondary-600 dark:text-secondary-400 mb-4">
                    The project resulted in a robust solution that successfully addressed the intended 
                    needs and requirements. The implementation demonstrated high performance, 
                    scalability, and maintainability.
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <div className="bg-secondary-50 dark:bg-secondary-800/60 rounded-lg p-4 text-center">
                      <FiCpu className="mx-auto mb-2 text-primary-600 dark:text-primary-400" size={24} />
                      <h5 className="font-medium text-secondary-900 dark:text-white mb-1">Performance</h5>
                      <p className="text-xs text-secondary-500 dark:text-secondary-400">Optimized for speed</p>
                    </div>
                    
                    <div className="bg-secondary-50 dark:bg-secondary-800/60 rounded-lg p-4 text-center">
                      <FiFeather className="mx-auto mb-2 text-primary-600 dark:text-primary-400" size={24} />
                      <h5 className="font-medium text-secondary-900 dark:text-white mb-1">Lightweight</h5>
                      <p className="text-xs text-secondary-500 dark:text-secondary-400">Minimal resource usage</p>
                    </div>
                    
                    <div className="bg-secondary-50 dark:bg-secondary-800/60 rounded-lg p-4 text-center">
                      <FiCode className="mx-auto mb-2 text-primary-600 dark:text-primary-400" size={24} />
                      <h5 className="font-medium text-secondary-900 dark:text-white mb-1">Clean Code</h5>
                      <p className="text-xs text-secondary-500 dark:text-secondary-400">Well-structured design</p>
                    </div>
                    
                    <div className="bg-secondary-50 dark:bg-secondary-800/60 rounded-lg p-4 text-center">
                      <FiAward className="mx-auto mb-2 text-primary-600 dark:text-primary-400" size={24} />
                      <h5 className="font-medium text-secondary-900 dark:text-white mb-1">Quality</h5>
                      <p className="text-xs text-secondary-500 dark:text-secondary-400">Thoroughly tested</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Gallery Tab */}
            {activeTab === 'gallery' && (
              <div className="animate-fade-in">
                <h3 className="text-xl font-bold text-secondary-900 dark:text-white mb-4">Project Gallery</h3>
                
                <div className="relative mb-6 rounded-lg overflow-hidden bg-secondary-200 dark:bg-secondary-700 h-96 flex items-center justify-center">
                  <span className="text-secondary-500 dark:text-secondary-400">Image placeholder for project gallery</span>
                  
                  {/* Image navigation */}
                  <button 
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/80 dark:bg-secondary-800/80 rounded-full shadow-md text-secondary-800 dark:text-white backdrop-blur-sm"
                    onClick={prevImage}
                    aria-label="Previous image"
                  >
                    <FiChevronRight className="transform rotate-180" size={20} />
                  </button>
                  
                  <button 
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/80 dark:bg-secondary-800/80 rounded-full shadow-md text-secondary-800 dark:text-white backdrop-blur-sm"
                    onClick={nextImage}
                    aria-label="Next image"
                  >
                    <FiChevronRight size={20} />
                  </button>
                  
                  {/* Image counter */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-white/80 dark:bg-secondary-800/80 rounded-full text-xs font-medium text-secondary-800 dark:text-white backdrop-blur-sm">
                    {currentImageIndex + 1} / {mockImages.length}
                  </div>
                </div>
                
                {/* Thumbnails */}
                <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                  {mockImages.map((_, index) => (
                    <button
                      key={index}
                      className={`w-20 h-16 bg-secondary-200 dark:bg-secondary-700 rounded flex-shrink-0 ${
                        index === currentImageIndex && 'ring-2 ring-primary-600 dark:ring-primary-400'
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                      aria-label={`View image ${index + 1}`}
                    />
                  ))}
                </div>
                
                <div className="mt-8 space-y-4">
                  <h4 className="text-lg font-semibold text-secondary-900 dark:text-white">About the Gallery</h4>
                  <p className="text-secondary-600 dark:text-secondary-400">
                    These screenshots showcase different aspects of the {project.title} project,
                    including the user interface, key features, and technical implementations.
                  </p>
                </div>
              </div>
            )}
            
            {/* Technical Details Tab */}
            {activeTab === 'details' && (
              <div className="animate-fade-in">
                <h3 className="text-xl font-bold text-secondary-900 dark:text-white mb-4">Technical Details</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-secondary-900 dark:text-white mb-3">Technologies Used</h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech) => (
                        <span 
                          key={tech} 
                          className="px-3 py-1.5 rounded-full bg-secondary-100 dark:bg-secondary-700 text-secondary-700 dark:text-secondary-300 text-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-secondary-900 dark:text-white mb-3">Architecture</h4>
                    <p className="text-secondary-600 dark:text-secondary-400 mb-4">
                      The project architecture was carefully designed to ensure scalability and maintainability.
                      Key technical aspects include database optimization, efficient API design, and responsive UI implementation.
                    </p>
                    <div className="relative h-48 bg-secondary-100 dark:bg-secondary-800/60 rounded-lg flex items-center justify-center">
                      <span className="text-secondary-500 dark:text-secondary-400 text-sm">Architecture Diagram Placeholder</span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-secondary-900 dark:text-white mb-3">Implementation Challenges</h4>
                    <ul className="space-y-2 text-secondary-600 dark:text-secondary-400">
                      <li className="flex items-start">
                        <FiChevronRight className="mt-1 mr-2 text-primary-600 dark:text-primary-400 flex-shrink-0" size={16} />
                        <span>Challenge 1: Describe a significant challenge you faced and how you overcame it</span>
                      </li>
                      <li className="flex items-start">
                        <FiChevronRight className="mt-1 mr-2 text-primary-600 dark:text-primary-400 flex-shrink-0" size={16} />
                        <span>Challenge 2: Another significant technical hurdle and your solution</span>
                      </li>
                      <li className="flex items-start">
                        <FiChevronRight className="mt-1 mr-2 text-primary-600 dark:text-primary-400 flex-shrink-0" size={16} />
                        <span>Challenge 3: A performance or optimization issue you addressed</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-secondary-900 dark:text-white mb-3">Code Highlights</h4>
                    <div className="bg-secondary-900 text-white rounded-lg overflow-hidden">
                      <div className="bg-secondary-800 px-4 py-2 text-xs font-medium">
                        Example Code Snippet
                      </div>
                      <pre className="p-4 text-sm overflow-x-auto">
                        <code>{`// Sample code from ${project.title}
function processData(data) {
  const results = data
    .filter(item => item.value > 0)
    .map(item => ({
      ...item,
      processed: true,
      timestamp: new Date()
    }));
    
  return results;
}`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer with action buttons */}
        <div className="p-6 border-t border-secondary-200 dark:border-secondary-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex space-x-4 w-full sm:w-auto">
            <a 
              href={project.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors w-full sm:w-auto justify-center"
            >
              <FiExternalLink size={16} />
              <span>Visit Project</span>
            </a>
            
            <a 
              href="#" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-secondary-100 dark:bg-secondary-700 hover:bg-secondary-200 dark:hover:bg-secondary-600 text-secondary-900 dark:text-white rounded-lg transition-colors w-full sm:w-auto justify-center"
            >
              <FiGithub size={16} />
              <span>View Code</span>
            </a>
          </div>
          
          <div className="flex items-center gap-2 text-secondary-500 dark:text-secondary-400 text-sm w-full sm:w-auto justify-center sm:justify-end">
            <FiCalendar size={14} />
            <span>Completed: August 2023</span>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ProjectModal;