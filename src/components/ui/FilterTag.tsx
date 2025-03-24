import React, { useState } from 'react';

interface FilterTagProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  className?: string;
}

const FilterTag: React.FC<FilterTagProps> = ({
  label,
  isActive,
  onClick,
  className = '',
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  // Only apply hover/press effects if the tag is not active
  const scale = !isActive 
    ? isPressed 
      ? 'scale-95' 
      : isHovering 
        ? 'scale-105' 
        : 'scale-100'
    : 'scale-100';

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setIsPressed(false);
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      className={`relative px-4 py-2 rounded-full text-sm font-medium capitalize transition-all duration-200 ${scale} ${className} ${
        isActive 
          ? 'text-white' 
          : 'bg-white dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700'
      }`}
      style={{
        transition: 'transform 0.2s cubic-bezier(0.17, 0.67, 0.83, 0.67), background-color 0.2s ease'
      }}
    >
      {label}
      {isActive && (
        <div
          className="absolute inset-0 bg-primary-600 dark:bg-primary-500 rounded-full -z-10 active-background"
          style={{
            // This matches the spring animation from framer-motion
            transition: 'all 0.3s cubic-bezier(0.17, 0.67, 0.83, 0.67)'
          }}
        />
      )}

      {/* Styles for mimicking layoutId transition */}
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

        .active-background {
          animation: fadeIn 0.3s cubic-bezier(0.17, 0.67, 0.83, 0.67) forwards;
        }
      `}</style>
    </button>
  );
};

export default FilterTag;