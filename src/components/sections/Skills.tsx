import { useState, useRef, useEffect } from 'react';
import { 
  FiCode, 
  FiGlobe, 
  FiSettings, 
  FiAward, 
  FiCpu, 
  FiDatabase, 
  FiServer,
  FiMonitor,
  FiTerminal
} from 'react-icons/fi';
import { skills } from '@/utils/data';
import Card from '../ui/Card';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

// Removed unused categoryIcons object

type SkillCategory = {
  name: string;
  icon: JSX.Element;
  items: string[];
};

// Custom hook for intersection observer
function useInView(options = { threshold: 0.1, once: false }) {
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

const Skills = () => {
  const { ref: sectionRef, isInView } = useInView({ once: false, threshold: 0.1 });
  const prefersReducedMotion = usePrefersReducedMotion();

  // Organized skill categories
  const skillCategories: SkillCategory[] = [
    {
      name: "Programming & Technical",
      icon: <FiCode size={24} />,
      items: skills.technical
    },
    {
      name: "Tools & Technologies",
      icon: <FiSettings size={24} />,
      items: skills.tools
    },
    {
      name: "IoT & Systems",
      icon: <FiCpu size={24} />,
      items: ["Real-time Monitoring", "Internet of Things (IoT)", "Database Management System (DBMS)"]
    },
  ];

  const [activeTab, setActiveTab] = useState<string>(skillCategories[0].name);
  const [previousTab, setPreviousTab] = useState<string>(skillCategories[0].name);
  const [isAnimating, setIsAnimating] = useState(false);

  // Handle tab change with animation timing
  const handleTabChange = (tabName: string) => {
    if (tabName === activeTab || isAnimating) return;
    
    setIsAnimating(true);
    setPreviousTab(activeTab);
    setActiveTab(tabName);
    
    // Reset animation state after animation completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  // Apply transitions based on reduced motion preference
  const getTransition = () => {
    return prefersReducedMotion ? 'none' : 'all 0.5s ease-in-out';
  };

  // Get animation delay for staggered items
  const getAnimationDelay = (index: number) => {
    if (prefersReducedMotion) return '0s';
    return `${index * 0.05}s`;
  };

  return (
    <section 
      id="skills" 
      ref={sectionRef}
      className="py-20 bg-white dark:bg-secondary-900 relative overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute top-0 left-0 -z-10 w-72 h-72 bg-primary-500/5 dark:bg-primary-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 -z-10 w-96 h-96 bg-accent-500/5 dark:bg-accent-500/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Title */}
        <div
          className="text-center mb-16 transition-all duration-700"
          style={{
            opacity: isInView ? 1 : 0,
            transform: `translateY(${isInView ? 0 : 20}px)`,
            transition: getTransition()
          }}
        >
          <h2 className="section-title mx-auto">Skills & Expertise</h2>
          <p className="text-secondary-600 dark:text-secondary-400 max-w-2xl mx-auto mt-6">
            My technical toolkit and areas of expertise that enable me to build innovative solutions.
          </p>
        </div>
        
        {/* Skill Tabs */}
        <div
          className="flex flex-wrap justify-center gap-4 mb-10"
          style={{
            opacity: isInView ? 1 : 0,
            transform: `translateY(${isInView ? 0 : 10}px)`,
            transition: getTransition(),
            transitionDelay: '0.1s'
          }}
        >
          {skillCategories.map((category) => (
            <button
              key={category.name}
              onClick={() => handleTabChange(category.name)}
              className={`px-4 py-2.5 rounded-lg flex items-center gap-2 text-sm font-medium transition-all duration-300 ${
                activeTab === category.name 
                  ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300' 
                  : 'bg-white dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700/80'
              }`}
              style={{
                transform: `scale(${activeTab === category.name ? 1 : 1})`,
                transition: 'transform 0.2s ease-in-out'
              }}
              onMouseOver={(e) => {
                if (activeTab !== category.name) {
                  e.currentTarget.style.transform = 'scale(1.05)';
                }
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
              onMouseDown={(e) => {
                if (activeTab !== category.name) {
                  e.currentTarget.style.transform = 'scale(0.95)';
                }
              }}
              onMouseUp={(e) => {
                if (activeTab !== category.name) {
                  e.currentTarget.style.transform = 'scale(1.05)';
                }
              }}
            >
              <span className={activeTab === category.name ? 'text-primary-600 dark:text-primary-400' : ''}>
                {category.icon}
              </span>
              {category.name}
            </button>
          ))}
        </div>
        
        {/* Skills Content */}
        <div className="max-w-5xl mx-auto relative">
          {skillCategories.map((category) => (
            <div 
              key={category.name} 
              className={`transition-all duration-500 absolute w-full ${
                activeTab === category.name 
                  ? 'opacity-100 translate-y-0 z-10' 
                  : previousTab === category.name && isAnimating
                    ? 'opacity-0 -translate-y-8 z-0'
                    : 'opacity-0 translate-y-8 z-0 hidden'
              }`}
              style={{ transition: getTransition() }}
            >
              <Card className="p-6 md:p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 mr-4">
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-bold text-secondary-900 dark:text-white">{category.name}</h3>
                </div>
                
                {/* Skills Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  {category.items.map((skill, index) => (
                    <div
                      key={skill}
                      className="transition-all duration-300"
                      style={{ 
                        opacity: isInView && activeTab === category.name ? 1 : 0,
                        transform: isInView && activeTab === category.name ? 'scale(1)' : 'scale(0.9)',
                        transition: getTransition(),
                        transitionDelay: getAnimationDelay(index)
                      }}
                    >
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary-50 dark:bg-secondary-800/60 hover:bg-primary-50 hover:dark:bg-primary-900/10 transition-colors group">
                        <div className="w-8 h-8 rounded-md flex items-center justify-center bg-white dark:bg-secondary-700 shadow-sm group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 transition-colors">
                          {getSkillIcon(skill)}
                        </div>
                        <span className="font-medium text-secondary-800 dark:text-secondary-200 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors">
                          {skill}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* For Languages section */}
                {category.name === "Languages" && (
                  <div className="space-y-4 mt-4">
                    {skills.languages && skills.languages.map((language, index) => (
                      <div key={language.name} className="mb-4">
                        <div className="flex justify-between mb-1">
                          <span className="font-medium text-secondary-700 dark:text-secondary-300">{language.name}</span>
                          <span className="text-primary-600 dark:text-primary-400 text-sm">{language.level}</span>
                        </div>
                        <div className="w-full h-2 bg-secondary-100 dark:bg-secondary-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-1000 ${
                              language.level === 'Native' ? 'bg-primary-600 dark:bg-primary-500' : 
                              language.level === 'Limited Working' ? 'bg-accent-500 dark:bg-accent-600' : 
                              'bg-secondary-500 dark:bg-secondary-600'
                            }`}
                            style={{
                              width: isInView 
                                ? (language.level === 'Native' ? '100%' : 
                                   language.level === 'Limited Working' ? '60%' : 
                                   language.level === 'Elementary' ? '30%' : '50%')
                                : '0%',
                              transition: `width 1s ease-out ${index * 0.1}s`
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Additional information section */}
                {category.name === "Programming & Technical" && (
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-primary-50 dark:bg-primary-900/10 rounded-lg border border-primary-100 dark:border-primary-800/30">
                      <h4 className="font-semibold text-primary-700 dark:text-primary-400 mb-2 flex items-center gap-2">
                        <FiAward size={16} />
                        Specialized Areas
                      </h4>
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
                    
                    <div className="p-4 bg-secondary-50 dark:bg-secondary-800/60 rounded-lg border border-secondary-100 dark:border-secondary-700/30">
                      <h4 className="font-semibold text-secondary-900 dark:text-white mb-2 flex items-center gap-2">
                        <FiTerminal size={16} />
                        Technical Interests
                      </h4>
                      <ul className="space-y-1 text-secondary-700 dark:text-secondary-300 text-sm">
                        <li className="flex items-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-secondary-500 dark:bg-secondary-400 mr-2"></div>
                          Machine Learning & AI
                        </li>
                        <li className="flex items-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-secondary-500 dark:bg-secondary-400 mr-2"></div>
                          Big Data Analytics
                        </li>
                        <li className="flex items-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-secondary-500 dark:bg-secondary-400 mr-2"></div>
                          Business Intelligence
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          ))}
        </div>
        
        {/* Skill Level Legend */}
        <div
          className="mt-10 flex justify-center transition-all duration-500"
          style={{
            opacity: isInView ? 1 : 0,
            transition: getTransition(),
            transitionDelay: '0.3s'
          }}
        >
          <div className="flex flex-wrap items-center gap-4 justify-center text-sm text-secondary-600 dark:text-secondary-400">
            <span>Skill Level:</span>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-primary-200 dark:bg-primary-900/40 rounded-full mr-1"></div>
              <span>Beginner</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-primary-400 dark:bg-primary-700 rounded-full mr-1"></div>
              <span>Intermediate</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-primary-600 dark:bg-primary-500 rounded-full mr-1"></div>
              <span>Advanced</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Helper function to get an icon for a skill
const getSkillIcon = (skill: string) => {
  const skillLower = skill.toLowerCase();
  
  if (skillLower.includes('python')) return <FiCode className="text-blue-500" />;
  if (skillLower.includes('data')) return <FiDatabase className="text-green-500" />;
  if (skillLower.includes('iot') || skillLower.includes('monitoring')) return <FiCpu className="text-orange-500" />;
  if (skillLower.includes('sql')) return <FiDatabase className="text-blue-500" />;
  if (skillLower.includes('react')) return <FiMonitor className="text-blue-400" />;
  if (skillLower.includes('web')) return <FiGlobe className="text-indigo-500" />;
  if (skillLower.includes('api')) return <FiServer className="text-purple-500" />;
  
  // Default icon
  return <FiSettings className="text-gray-500" />;
};

export default Skills;