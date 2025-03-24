import React, { useState, useRef, useEffect } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search...',
  value,
  onChange,
  className = '',
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on component mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleClear = () => {
    onChange('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div
      className={`relative w-full ${className}`}
    >
      <div
        className={`flex items-center w-full px-3 py-2 rounded-lg border dark:border-secondary-700 bg-white dark:bg-secondary-800 transition-all duration-200`}
        style={{
          borderColor: isFocused 
            ? 'rgba(99, 102, 241, 1)' 
            : 'rgba(203, 213, 225, 1)',
          boxShadow: isFocused 
            ? 'rgba(99, 102, 241, 0.25) 0px 0px 0px 3px' 
            : 'none',
        }}
      >
        <FiSearch 
          className={`mr-2 ${
            isFocused 
              ? 'text-primary-600 dark:text-primary-400' 
              : 'text-secondary-400 dark:text-secondary-500'
          } transition-colors duration-200`} 
          size={18} 
        />
        
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="flex-grow bg-transparent outline-none text-secondary-800 dark:text-white placeholder-secondary-400 dark:placeholder-secondary-500"
        />
        
        {value && (
          <button
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => {
              setIsHovering(false);
              setIsPressed(false);
            }}
            onMouseDown={() => setIsPressed(true)}
            onMouseUp={() => setIsPressed(false)}
            onClick={handleClear}
            className="p-1 rounded-full text-secondary-400 hover:text-secondary-600 dark:text-secondary-500 dark:hover:text-secondary-300 transition-all duration-200"
            aria-label="Clear search"
            style={{
              transform: `scale(${isPressed ? 0.9 : isHovering ? 1.1 : 1})`,
              opacity: 1,
              animation: value.length === 1 ? 'fadeIn 0.2s ease-out forwards' : 'none'
            }}
          >
            <FiX size={16} />
          </button>
        )}
      </div>
      
      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        button {
          opacity: 0;
          animation: fadeIn 0.2s ease-out forwards;
        }
      `}</style>
      
      {/* Search suggestions could be added here */}
    </div>
  );
};

export default SearchBar;