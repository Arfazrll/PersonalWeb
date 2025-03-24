import { useState, useRef, useEffect } from 'react';
import { 
  FiBriefcase, 
  FiCalendar, 
  FiMapPin, 
  FiChevronDown, 
  FiChevronUp,
  FiClock
} from 'react-icons/fi';
import { experiences } from '@/utils/data';

// Create a derived version of experiences with unique year markers
const processedExperiences = experiences.map((exp, index) => {
  // Extract the year from duration
  const yearMatch = exp.duration.match(/\d{4}/g);
  const currentYear = yearMatch ? yearMatch[0] : 'Present';
  
  // Determine if this is a new year compared to previous entry
  const prevYearMatch = index > 0 ? experiences[index - 1].duration.match(/\d{4}/g) : null;
  const prevYear = prevYearMatch ? prevYearMatch[0] : null;
  
  const isNewYear = currentYear !== prevYear;
  
  return {
    ...exp,
    year: currentYear,
    isNewYear
  };
});

// Custom hook for intersection observer
function useInView(options = { threshold: 0.1, once: false }) {
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

const Experience = () => {
  const [expandedItem, setExpandedItem] = useState<number | null>(null);
  const { ref: timelineRef, isInView: timelineInView } = useInView();
  const { ref: titleRef, isInView: titleInView } = useInView({ threshold: 0.1, once: true });
  const { ref: summaryRef, isInView: summaryInView } = useInView({ threshold: 0.1, once: true });
  
  // Toggle expanded item
  const toggleExpand = (index: number) => {
    setExpandedItem(expandedItem === index ? null : index);
  };

  // Create a function to render company logo placeholder
  const renderCompanyLogo = (company: string) => {
    // Extract the first letter of each word in the company name
    const initials = company
      .split(' ')
      .map(word => word[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
      
    return (
      <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-semibold">
        {initials}
      </div>
    );
  };

  return (
    <section id="experience" className="py-20 bg-white dark:bg-secondary-900">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div 
          ref={titleRef}
          className="text-center mb-16 transition-all duration-700 transform"
          style={{
            opacity: titleInView ? 1 : 0,
            transform: titleInView ? 'translateY(0)' : 'translateY(20px)'
          }}
        >
          <h2 className="section-title mx-auto">Work Experience</h2>
          <p className="text-secondary-600 dark:text-secondary-400 max-w-2xl mx-auto mt-6">
            My professional journey and the experiences that have shaped my career in technology.
          </p>
        </div>
        
        {/* Experience Timeline */}
        <div
          ref={timelineRef}
          className="max-w-4xl mx-auto relative"
        >
          {/* Timeline center line */}
          <div className="absolute left-16 top-0 bottom-0 w-0.5 bg-primary-200 dark:bg-primary-800/50 z-0 ml-2.5 hidden md:block"></div>
          
          {processedExperiences.map((experience, index) => (
            <div 
              key={index} 
              className="mb-10 last:mb-0 transition-all duration-500"
              style={{
                opacity: timelineInView ? 1 : 0,
                transform: timelineInView 
                  ? 'translateX(0)' 
                  : 'translateX(-20px)',
                transitionDelay: `${index * 100}ms`
              }}
            >
              {/* Year marker */}
              {experience.isNewYear && (
                <div 
                  className="flex items-center mb-6 md:pl-20 transition-all duration-500"
                  style={{
                    opacity: timelineInView ? 1 : 0,
                    transform: timelineInView 
                      ? 'translateY(0)' 
                      : 'translateY(20px)',
                    transitionDelay: `${index * 100}ms`
                  }}
                >
                  <div className="bg-primary-500 dark:bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium inline-flex items-center">
                    <FiCalendar className="mr-1.5" />
                    {experience.year}
                  </div>
                </div>
              )}
              
              {/* Experience item */}
              <div
                className="relative md:pl-20"
              >
                {/* Timeline dot - visible only on md screens and up */}
                <div className="absolute left-16 top-5 hidden md:flex">
                  <div className="w-5 h-5 rounded-full bg-white dark:bg-secondary-900 border-2 border-primary-500 dark:border-primary-400 z-10"></div>
                </div>
                
                {/* Card with experience details */}
                <div 
                  className={`bg-white dark:bg-secondary-800 rounded-lg shadow-md p-6 border border-secondary-100 dark:border-secondary-700 cursor-pointer transition-all duration-300 hover:-translate-y-1 ${
                    expandedItem === index ? 'ring-2 ring-primary-500 dark:ring-primary-400' : ''
                  }`}
                  onClick={() => toggleExpand(index)}
                >
                  <div className="flex flex-wrap justify-between items-start gap-4 mb-3">
                    <div className="flex">
                      <div className="mr-4 hidden sm:block">
                        {renderCompanyLogo(experience.company)}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-secondary-900 dark:text-white">{experience.position}</h3>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                          <h4 className="text-lg font-semibold text-primary-600 dark:text-primary-400">
                            {experience.company}
                          </h4>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300 flex items-center">
                        <FiClock className="mr-1" />
                        {experience.duration}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-secondary-600 dark:text-secondary-400 flex items-center text-sm mb-3">
                    <FiMapPin className="mr-1.5 text-secondary-400 dark:text-secondary-500" />
                    <span className="inline-block">{experience.location}</span>
                  </div>
                  
                  {/* Description preview - always visible */}
                  <p className={`text-secondary-700 dark:text-secondary-300 text-sm ${
                    expandedItem !== index ? 'line-clamp-2' : ''
                  }`}>
                    {experience.description}
                  </p>
                  
                  {/* Expanded content with CSS transition instead of framer-motion */}
                  <div 
                    className={`mt-4 pt-4 border-t border-secondary-100 dark:border-secondary-700 overflow-hidden transition-all duration-300 ${
                      expandedItem === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 border-t-0 pt-0 mt-0'
                    }`}
                  >
                    <div className="space-y-4">
                      <div>
                        <h5 className="font-semibold text-secondary-900 dark:text-white mb-2">Key Responsibilities</h5>
                        <ul className="space-y-2 text-secondary-700 dark:text-secondary-300 text-sm">
                          <li className="flex items-start">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary-500 dark:bg-primary-400 mt-1.5 mr-2"></div>
                            <span>Collaborate with cross-functional teams to develop and implement innovative solutions.</span>
                          </li>
                          <li className="flex items-start">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary-500 dark:bg-primary-400 mt-1.5 mr-2"></div>
                            <span>Create and maintain detailed documentation of projects and processes.</span>
                          </li>
                          <li className="flex items-start">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary-500 dark:bg-primary-400 mt-1.5 mr-2"></div>
                            <span>Participate in regular team meetings to discuss progress and address challenges.</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div>
                        <h5 className="font-semibold text-secondary-900 dark:text-white mb-2">Skills Developed</h5>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-2 py-1 text-xs rounded bg-secondary-100 dark:bg-secondary-700 text-secondary-700 dark:text-secondary-300">
                            Teamwork
                          </span>
                          <span className="px-2 py-1 text-xs rounded bg-secondary-100 dark:bg-secondary-700 text-secondary-700 dark:text-secondary-300">
                            Problem Solving
                          </span>
                          <span className="px-2 py-1 text-xs rounded bg-secondary-100 dark:bg-secondary-700 text-secondary-700 dark:text-secondary-300">
                            Communication
                          </span>
                          <span className="px-2 py-1 text-xs rounded bg-secondary-100 dark:bg-secondary-700 text-secondary-700 dark:text-secondary-300">
                            Time Management
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Toggle button */}
                  <button
                    className="mt-3 flex items-center text-xs font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(index);
                    }}
                  >
                    {expandedItem === index ? (
                      <>
                        <FiChevronUp className="mr-1" size={14} />
                        Show Less
                      </>
                    ) : (
                      <>
                        <FiChevronDown className="mr-1" size={14} />
                        Show More
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Experience Summary */}
        <div
          ref={summaryRef}
          className="max-w-4xl mx-auto mt-16 bg-white dark:bg-secondary-800 rounded-lg shadow-md p-6 border border-secondary-100 dark:border-secondary-700 transition-all duration-700 transform"
          style={{
            opacity: summaryInView ? 1 : 0,
            transform: summaryInView ? 'translateY(0)' : 'translateY(20px)'
          }}
        >
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 mr-4">
              <FiBriefcase size={24} />
            </div>
            <h3 className="text-xl font-bold text-secondary-900 dark:text-white">Professional Summary</h3>
          </div>
          
          <p className="text-secondary-700 dark:text-secondary-300 mb-4">
            My professional journey has been focused on developing expertise in the areas of data analysis, 
            machine learning, and technology innovation. Through my diverse experiences, I&apos;ve cultivated a 
            strong foundation in both technical skills and collaborative teamwork.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-secondary-50 dark:bg-secondary-900/50 rounded-lg p-4 border border-secondary-100 dark:border-secondary-800">
              <h4 className="font-semibold text-secondary-900 dark:text-white mb-2">Technical Roles</h4>
              <p className="text-secondary-600 dark:text-secondary-400 text-sm">
                Experience in technical positions focused on data analysis, software development, and system management.
              </p>
            </div>
            
            <div className="bg-secondary-50 dark:bg-secondary-900/50 rounded-lg p-4 border border-secondary-100 dark:border-secondary-800">
              <h4 className="font-semibold text-secondary-900 dark:text-white mb-2">Community Involvement</h4>
              <p className="text-secondary-600 dark:text-secondary-400 text-sm">
                Active participation in technology communities and organizations to promote knowledge sharing.
              </p>
            </div>
            
            <div className="bg-secondary-50 dark:bg-secondary-900/50 rounded-lg p-4 border border-secondary-100 dark:border-secondary-800">
              <h4 className="font-semibold text-secondary-900 dark:text-white mb-2">Educational Initiatives</h4>
              <p className="text-secondary-600 dark:text-secondary-400 text-sm">
                Involvement in educational programs and mentorship opportunities to develop skills in teaching and leadership.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;