import React, { useState, useRef, useEffect } from 'react';

type TagColor = 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger' | 'info' | 'custom';
type TagSize = 'xs' | 'sm' | 'md' | 'lg';
type TagVariant = 'solid' | 'outline' | 'subtle' | 'ghost' | 'gradient';

interface FilterTagProps {
  /**
   * Text displayed on the filter tag
   */
  label: string;
  
  /**
   * Whether the tag is currently selected/active
   */
  isActive: boolean;
  
  /**
   * Function called when the tag is clicked
   */
  onClick: () => void;
  
  /**
   * Additional CSS classes to apply
   */
  className?: string;
  
  /**
   * Small icon displayed before the label
   */
  icon?: React.ReactNode;
  
  /**
   * Small icon displayed after the label
   */
  trailingIcon?: React.ReactNode;
  
  /**
   * Color theme for the tag
   */
  color?: TagColor;
  
  /**
   * Custom color value (only used when color="custom")
   */
  customColor?: string;
  
  /**
   * Visual style variant of the tag
   */
  variant?: TagVariant;
  
  /**
   * Size of the tag
   */
  size?: TagSize;
  
  /**
   * Number badge to display (e.g., for showing count of items)
   */
  count?: number;
  
  /**
   * Whether to show a ripple effect on click
   */
  withRipple?: boolean;
  
  /**
   * Whether to show a glow effect when active
   */
  withGlow?: boolean;
  
  /**
   * Whether to apply a pulse animation to draw attention to the tag
   */
  withPulse?: boolean;
  
  /**
   * Whether the tag is disabled
   */
  disabled?: boolean;
  
  /**
   * Tooltip text to show on hover
   */
  tooltip?: string;
  
  /**
   * Custom animation speed (in ms)
   */
  animationDuration?: number;
}

const FilterTag: React.FC<FilterTagProps> = ({
  label,
  isActive,
  onClick,
  className = '',
  icon,
  trailingIcon,
  color = 'primary',
  customColor,
  variant = 'solid',
  size = 'md',
  count,
  withRipple = true,
  withGlow = true,
  withPulse = false,
  disabled = false,
  tooltip,
  animationDuration = 200,
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  // Clean up ripples after they animate out
  useEffect(() => {
    const timeoutIds: number[] = [];
    
    ripples.forEach(ripple => {
      const timeoutId = window.setTimeout(() => {
        setRipples(prevRipples => prevRipples.filter(r => r.id !== ripple.id));
      }, 800); // Match the CSS animation duration
      
      timeoutIds.push(timeoutId);
    });
    
    return () => {
      timeoutIds.forEach(id => clearTimeout(id));
    };
  }, [ripples]);
  
  // Handle ripple effect on click
  const handleRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!withRipple || disabled) return;
    
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple = {
      id: Date.now(),
      x,
      y
    };
    
    setRipples(prev => [...prev, newRipple]);
  };
  
  // Calculate appropriate scale based on interaction state
  const getScale = () => {
    if (disabled) return 'scale-100';
    
    if (!isActive) {
      if (isPressed) return 'scale-95';
      if (isHovering) return 'scale-105';
    }
    
    return 'scale-100';
  };
  
  // Get size-specific classes
  const getSizeClasses = () => {
    switch (size) {
      case 'xs': return 'px-2 py-0.5 text-xs';
      case 'sm': return 'px-3 py-1 text-sm';
      case 'lg': return 'px-5 py-2.5 text-base';
      default: return 'px-4 py-2 text-sm'; // 'md' size (default)
    }
  };
  
  // Function to get color-specific classes
  const getColorClasses = () => {
    // Only used for non-active states when variant is not 'solid'
    if (color === 'custom' && customColor) {
      // For custom colors, we'll use inline styles
      return '';
    }
    
    switch (color) {
      case 'secondary':
        return 'text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700';
      case 'accent':
        return 'text-pink-700 dark:text-pink-300 border-pink-300 dark:border-pink-700 hover:bg-pink-50 dark:hover:bg-pink-900/20';
      case 'success':
        return 'text-green-700 dark:text-green-300 border-green-300 dark:border-green-700 hover:bg-green-50 dark:hover:bg-green-900/20';
      case 'warning':
        return 'text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700 hover:bg-yellow-50 dark:hover:bg-yellow-900/20';
      case 'danger':
        return 'text-red-700 dark:text-red-300 border-red-300 dark:border-red-700 hover:bg-red-50 dark:hover:bg-red-900/20';
      case 'info':
        return 'text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20';
      default: // 'primary'
        return 'text-primary-700 dark:text-primary-300 border-primary-300 dark:border-primary-700 hover:bg-primary-50 dark:hover:bg-primary-900/20';
    }
  };
  
  // Get active background colors based on color prop
  const getActiveBackground = () => {
    if (color === 'custom' && customColor) {
      return customColor;
    }
    
    switch (color) {
      case 'secondary': return 'bg-gray-600 dark:bg-gray-600';
      case 'accent': return 'bg-pink-600 dark:bg-pink-600';
      case 'success': return 'bg-green-600 dark:bg-green-600';
      case 'warning': return 'bg-yellow-600 dark:bg-yellow-600';
      case 'danger': return 'bg-red-600 dark:bg-red-600';
      case 'info': return 'bg-blue-600 dark:bg-blue-600';
      default: return 'bg-primary-600 dark:bg-primary-600'; // 'primary'
    }
  };
  
  // Get glow color based on color prop
  const getGlowColor = () => {
    if (color === 'custom' && customColor) {
      return customColor;
    }
    
    switch (color) {
      case 'secondary': return 'rgba(107, 114, 128, 0.5)';
      case 'accent': return 'rgba(236, 72, 153, 0.5)';
      case 'success': return 'rgba(22, 163, 74, 0.5)';
      case 'warning': return 'rgba(234, 179, 8, 0.5)';
      case 'danger': return 'rgba(220, 38, 38, 0.5)';
      case 'info': return 'rgba(37, 99, 235, 0.5)';
      default: return 'rgba(79, 70, 229, 0.5)'; // 'primary'
    }
  };
  
  // Get styles for different visual variants
  const getVariantStyles = () => {
    if (isActive) {
      return {
        base: 'text-white border',
        background: getActiveBackground(),
      };
    }
    
    const colorClasses = getColorClasses();
    
    switch (variant) {
      case 'outline':
        return {
          base: `bg-transparent border-2 ${colorClasses}`,
          background: 'transparent',
        };
      case 'subtle':
        return {
          base: `bg-opacity-10 border ${colorClasses}`,
          background: color === 'secondary' ? 'bg-gray-100 dark:bg-gray-800' :
                      color === 'primary' ? 'bg-primary-50 dark:bg-primary-900/20' :
                      color === 'accent' ? 'bg-pink-50 dark:bg-pink-900/20' :
                      color === 'success' ? 'bg-green-50 dark:bg-green-900/20' :
                      color === 'warning' ? 'bg-yellow-50 dark:bg-yellow-900/20' :
                      color === 'danger' ? 'bg-red-50 dark:bg-red-900/20' :
                      'bg-blue-50 dark:bg-blue-900/20',
        };
      case 'ghost':
        return {
          base: `bg-transparent border ${colorClasses}`,
          background: 'transparent',
        };
      case 'gradient':
        return {
          base: 'text-white border border-transparent',
          background: color === 'primary' ? 'bg-gradient-to-r from-primary-500 to-indigo-600' :
                      color === 'accent' ? 'bg-gradient-to-r from-pink-500 to-rose-500' :
                      color === 'success' ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
                      color === 'info' ? 'bg-gradient-to-r from-blue-500 to-cyan-600' :
                      color === 'warning' ? 'bg-gradient-to-r from-yellow-500 to-amber-600' :
                      color === 'danger' ? 'bg-gradient-to-r from-red-500 to-rose-600' :
                      'bg-gradient-to-r from-gray-500 to-gray-600',
        };
      default: // 'solid'
        return {
          base: 'bg-white dark:bg-secondary-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-secondary-700',
          background: '',
        };
    }
  };
  
  // Combine all styles
  const variantStyles = getVariantStyles();
  const sizeClasses = getSizeClasses();
  const scale = getScale();
  
  // Inline styles for custom effects and animations
  const tagStyle: React.CSSProperties = {
    transition: `all ${animationDuration}ms cubic-bezier(0.17, 0.67, 0.83, 0.67), transform ${animationDuration}ms cubic-bezier(0.17, 0.67, 0.83, 0.67)`,
    ...(isActive && withGlow && !disabled ? { 
      boxShadow: `0 0 8px 2px ${getGlowColor()}`,
    } : {}),
    ...(color === 'custom' && customColor && isActive ? {
      backgroundColor: customColor,
      borderColor: customColor,
    } : {}),
    ...(withPulse && !disabled ? { 
      animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' 
    } : {})
  };
  
  // Render the tag with all enhancements
  return (
    <button
      ref={buttonRef}
      onClick={(e) => {
        handleRipple(e);
        if (!disabled) onClick();
      }}
      onMouseEnter={() => !disabled && setIsHovering(true)}
      onMouseLeave={() => {
        if (!disabled) {
          setIsHovering(false);
          setIsPressed(false);
        }
      }}
      onMouseDown={() => !disabled && setIsPressed(true)}
      onMouseUp={() => !disabled && setIsPressed(false)}
      className={`
        relative rounded-full font-medium capitalize 
        ${scale} ${sizeClasses} ${variantStyles.base} 
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      style={tagStyle}
      disabled={disabled}
      title={tooltip}
      aria-pressed={isActive}
    >
      {/* Main content container */}
      <div className="relative z-10 flex items-center justify-center gap-1.5">
        {/* Leading icon if provided */}
        {icon && <span className="shrink-0">{icon}</span>}
        
        {/* Label text */}
        <span>{label}</span>
        
        {/* Item count if provided */}
        {count !== undefined && (
          <span className={`
            inline-flex items-center justify-center rounded-full text-xs 
            ${isActive 
              ? 'bg-white bg-opacity-30 text-white' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            } 
            ${size === 'xs' ? 'w-3.5 h-3.5 text-[10px]' : 'min-w-[1.25rem] h-5 px-1'}
          `}>
            {count}
          </span>
        )}
        
        {/* Trailing icon if provided */}
        {trailingIcon && <span className="shrink-0">{trailingIcon}</span>}
      </div>
      
      {/* Active state background */}
      {isActive && (
        <div
          className="absolute inset-0 rounded-full -z-10 active-background"
          style={{
            backgroundColor: variantStyles.background,
            transition: `all ${animationDuration}ms cubic-bezier(0.17, 0.67, 0.83, 0.67)`
          }}
        />
      )}
      
      {/* Ripple effects */}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-white bg-opacity-30 animate-ripple pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            transform: 'translate(-50%, -50%)'
          }}
        />
      ))}
      
      {/* Animation styles */}
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
        
        @keyframes ripple {
          0% {
            width: 0;
            height: 0;
            opacity: 0.6;
          }
          100% {
            width: 250px;
            height: 250px;
            opacity: 0;
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
        
        .active-background {
          animation: fadeIn ${animationDuration}ms cubic-bezier(0.17, 0.67, 0.83, 0.67) forwards;
        }
        
        .animate-ripple {
          animation: ripple 800ms cubic-bezier(0.17, 0.67, 0.83, 0.67) forwards;
        }
      `}</style>
    </button>
  );
};

export default FilterTag;