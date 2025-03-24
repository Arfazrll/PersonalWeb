import { useState, useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import { FiSun, FiMoon, FiMonitor } from 'react-icons/fi';

const ThemeToggle: React.FC = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Once mounted, we can show the toggle
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder with the same dimensions to prevent layout shift
    return <div className="w-10 h-10 rounded-full"></div>; 
  }

  const currentTheme = theme === 'system' ? resolvedTheme : theme;
  
  const toggleTheme = (newTheme: string) => {
    setTheme(newTheme);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        aria-label={`Current theme: ${currentTheme}`}
        className={`w-10 h-10 rounded-full flex items-center justify-center bg-secondary-100 dark:bg-secondary-800 hover:bg-secondary-200 dark:hover:bg-secondary-700 transition-colors duration-200 relative z-10 ${
          isButtonPressed ? 'scale-95' : isHovering ? 'scale-105' : 'scale-100'
        }`}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => {
          setIsHovering(false);
          setIsButtonPressed(false);
        }}
        onMouseDown={() => setIsButtonPressed(true)}
        onMouseUp={() => setIsButtonPressed(false)}
        style={{
          opacity: mounted ? 1 : 0,
          transform: `scale(${isButtonPressed ? 0.95 : isHovering ? 1.05 : 1})`,
          transition: 'transform 0.2s ease, opacity 0.3s ease'
        }}
      >
        {/* Show different icon based on current theme */}
        <div 
          className={`absolute transition-all duration-300 ${
            currentTheme === 'dark' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-50'
          }`}
        >
          <FiMoon className="text-sky-300" size={20} />
        </div>
        
        <div 
          className={`absolute transition-all duration-300 ${
            currentTheme === 'light' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-50'
          }`}
        >
          <FiSun className="text-yellow-500" size={20} />
        </div>
      </button>
      
      {/* Dropdown menu */}
      <div
        className={`absolute right-0 mt-2 w-40 bg-white dark:bg-secondary-800 rounded-lg shadow-lg overflow-hidden z-50 border border-secondary-200 dark:border-secondary-700 transition-all duration-200 ease-out ${
          isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 -translate-y-3 pointer-events-none'
        }`}
      >
        <button
          className={`w-full text-left px-4 py-2.5 flex items-center ${
            currentTheme === 'light' ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' : 'text-secondary-700 dark:text-secondary-300'
          } hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors`}
          onClick={() => toggleTheme('light')}
        >
          <div 
            className="w-8 flex justify-center transition-transform duration-200"
            style={{ 
              transform: `scale(${currentTheme === 'light' ? 1.1 : 1})` 
            }}
          >
            <FiSun size={18} className={currentTheme === 'light' ? 'text-yellow-500' : ''} />
          </div>
          <span className="ml-2 text-sm font-medium">Light</span>
        </button>
        
        <button
          className={`w-full text-left px-4 py-2.5 flex items-center ${
            currentTheme === 'dark' ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' : 'text-secondary-700 dark:text-secondary-300'
          } hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors`}
          onClick={() => toggleTheme('dark')}
        >
          <div 
            className="w-8 flex justify-center transition-transform duration-200"
            style={{ 
              transform: `scale(${currentTheme === 'dark' ? 1.1 : 1})` 
            }}
          >
            <FiMoon size={18} className={currentTheme === 'dark' ? 'text-sky-300' : ''} />
          </div>
          <span className="ml-2 text-sm font-medium">Dark</span>
        </button>
        
        <button
          className={`w-full text-left px-4 py-2.5 flex items-center ${
            theme === 'system' ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' : 'text-secondary-700 dark:text-secondary-300'
          } hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors`}
          onClick={() => toggleTheme('system')}
        >
          <div 
            className="w-8 flex justify-center transition-transform duration-200"
            style={{ 
              transform: `scale(${theme === 'system' ? 1.1 : 1})` 
            }}
          >
            <FiMonitor size={18} className={theme === 'system' ? 'text-green-400' : ''} />
          </div>
          <span className="ml-2 text-sm font-medium">System</span>
        </button>
      </div>
    </div>
  );
};

export default ThemeToggle;