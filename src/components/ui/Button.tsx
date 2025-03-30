import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'glass' | 'accent' | 'gradient' | 'soft' | 'text' | 'icon';
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  isExternal?: boolean;
  download?: boolean | string;
  disabled?: boolean;
  loading?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  withRipple?: boolean;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  withShadow?: boolean | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  stretch?: boolean;
  active?: boolean;
  hoverEffect?: 'none' | 'scale' | 'lift' | 'glow' | 'shine';
  gradientDirection?: 'left-to-right' | 'top-to-bottom' | 'diagonal' | 'radial';
  [key: string]: React.ReactNode | string | boolean | (() => void) | undefined;
}

const Button: React.FC<ButtonProps> = ({
  children,
  href,
  onClick,
  variant = 'primary',
  className = '',
  icon = null,
  iconPosition = 'left',
  isExternal = false,
  download = false,
  disabled = false,
  loading = false,
  size = 'md',
  fullWidth = false,
  withRipple = true,
  rounded = 'md',
  withShadow = false,
  stretch = false,
  active = false,
  hoverEffect = 'scale',
  gradientDirection = 'left-to-right',
  ...props
}) => {
  const [rippleEffect, setRippleEffect] = useState<{ x: number; y: number; active: boolean; id: number }>({
    x: 0,
    y: 0,
    active: false,
    id: 0,
  });
  
  const [shineEffect, setShineEffect] = useState<{ active: boolean }>({
    active: false
  });
  
  const buttonRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
  
  // Loading Spinner
  const loadingSpinner = (
    <svg
      className={`animate-spin h-5 w-5 text-current ${size === 'xs' || size === 'sm' ? 'h-4 w-4' : size === 'lg' || size === 'xl' ? 'h-6 w-6' : 'h-5 w-5'}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );

  // Handle shine effect on mouseenter
  useEffect(() => {
    if (hoverEffect === 'shine' && buttonRef.current) {
      const handleMouseEnter = () => {
        setShineEffect({ active: true });
      };
      
      const handleMouseLeave = () => {
        setShineEffect({ active: false });
      };
      
      const button = buttonRef.current;
      button.addEventListener('mouseenter', handleMouseEnter);
      button.addEventListener('mouseleave', handleMouseLeave);
      
      return () => {
        button.removeEventListener('mouseenter', handleMouseEnter);
        button.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, [hoverEffect]);

  // Handle ripple effect on click
  const handleRipple = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    if (!withRipple || disabled || loading) return;
    
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setRippleEffect({ 
      x, 
      y, 
      active: true,
      id: Date.now() // Unique ID for key prop
    });
    
    // Reset ripple after animation
    setTimeout(() => {
      setRippleEffect(prev => ({ ...prev, active: false }));
    }, 600);
    
    // Execute onClick handler if provided
    if (onClick) {
      onClick();
    }
  };

  // Get border radius based on the rounded prop
  const getBorderRadius = () => {
    switch (rounded) {
      case 'none': return '';
      case 'sm': return 'rounded';
      case 'lg': return 'rounded-xl';
      case 'full': return 'rounded-full';
      default: return 'rounded-lg'; // md
    }
  };
  
  // Get shadow classes
  const getShadowClasses = () => {
    if (!withShadow) return '';
    
    if (typeof withShadow === 'string') {
      return `shadow-${withShadow}`;
    }
    
    return 'shadow-md';
  };
  
  // Get specific hover effect classes
  const getHoverEffectClasses = () => {
    if (disabled || loading) return '';
    
    switch (hoverEffect) {
      case 'none': 
        return '';
      case 'scale': 
        return '';
      case 'lift': 
        return 'hover:-translate-y-1 active:translate-y-0';
      case 'glow': 
        return 'hover:ring-2 ring-offset-2 ring-offset-background';
      case 'shine': 
        return 'overflow-hidden';
      default: 
        return '';
    }
  };
  
  // Get gradient classes if variant is gradient
  const getGradientClasses = () => {
    if (variant !== 'gradient') return '';
    
    switch (gradientDirection) {
      case 'top-to-bottom':
        return 'bg-gradient-to-b from-primary-400 to-primary-600 dark:from-primary-500 dark:to-primary-800';
      case 'diagonal':
        return 'bg-gradient-to-br from-primary-400 to-accent-500 dark:from-primary-500 dark:to-accent-600';
      case 'radial':
        return 'radial-gradient'; // We'll use a custom style for this
      default: // left-to-right
        return 'bg-gradient-to-r from-primary-500 to-accent-500 dark:from-primary-600 dark:to-accent-600';
    }
  };

  // Get the appropriate class name based on variant and size
  const getButtonClasses = () => {
    // Base classes
    let classes = `relative ${getBorderRadius()} font-medium transition-all duration-300 flex items-center justify-center ${getShadowClasses()} ${getHoverEffectClasses()}`;
    
    // Size classes
    switch (size) {
      case 'xs':
        classes += ' text-xs py-1 px-2.5 gap-1';
        if (variant === 'icon') classes += ' p-1';
        break;
      case 'sm':
        classes += ' text-sm py-1.5 px-3.5 gap-1.5';
        if (variant === 'icon') classes += ' p-1.5';
        break;
      case 'lg':
        classes += ' text-lg py-3 px-7 gap-2.5';
        if (variant === 'icon') classes += ' p-3';
        break;
      case 'xl':
        classes += ' text-xl py-4 px-8 gap-3';
        if (variant === 'icon') classes += ' p-4';
        break;
      default: // md
        classes += ' py-2 px-5 gap-2';
        if (variant === 'icon') classes += ' p-2';
    }
    
    // Stretch behavior
    if (stretch) {
      classes += ' h-full';
    }
    
    // Width class
    if (fullWidth) {
      classes += ' w-full';
    }
    
    // Variant classes
    switch (variant) {
      case 'primary':
        classes += ' bg-primary-500 hover:bg-primary-600 text-white shadow-primary-500/20 hover:shadow-primary-600/30 dark:bg-primary-600 dark:hover:bg-primary-500';
        break;
      case 'secondary':
        classes += ' bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 shadow-gray-200/50 hover:shadow-gray-200/70 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700 dark:shadow-none';
        break;
      case 'outline':
        classes += ' bg-transparent hover:bg-primary-50 text-primary-500 border border-primary-500 dark:text-primary-400 dark:border-primary-400 dark:hover:bg-primary-900/20';
        break;
      case 'glass':
        classes += ' bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border border-white/30 shadow-lg shadow-black/5';
        break;
      case 'accent':
        classes += ' bg-accent-500 hover:bg-accent-600 text-white shadow-accent-500/20 hover:shadow-accent-600/30 dark:bg-accent-600 dark:hover:bg-accent-500';
        break;
      case 'gradient':
        classes += ` ${getGradientClasses()} text-white shadow-primary-500/20 hover:shadow-primary-600/30`;
        break;
      case 'soft':
        classes += ' bg-primary-100 hover:bg-primary-200 text-primary-700 dark:bg-primary-900/40 dark:hover:bg-primary-900/60 dark:text-primary-300';
        break;
      case 'text':
        classes += ' bg-transparent hover:bg-gray-100 text-primary-500 dark:hover:bg-gray-800 dark:text-primary-400';
        break;
      case 'icon':
        classes += ' aspect-square items-center justify-center bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 shadow-sm hover:shadow-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700';
        break;
      default:
        classes += ' bg-primary-500 hover:bg-primary-600 text-white shadow-primary-500/20 hover:shadow-primary-600/30';
    }
    
    // Active state
    if (active) {
      switch (variant) {
        case 'primary':
          classes += ' bg-primary-600 dark:bg-primary-700';
          break;
        case 'secondary':
          classes += ' bg-gray-100 dark:bg-gray-700';
          break;
        case 'outline':
          classes += ' bg-primary-50 dark:bg-primary-900/30';
          break;
        case 'glass':
          classes += ' bg-white/40';
          break;
        case 'accent':
          classes += ' bg-accent-600 dark:bg-accent-700';
          break;
        case 'soft':
          classes += ' bg-primary-200 dark:bg-primary-900/70';
          break;
        case 'text':
          classes += ' bg-gray-100 dark:bg-gray-800';
          break;
        case 'icon':
          classes += ' bg-gray-100 dark:bg-gray-700';
          break;
      }
    }
    
    // Disabled state
    if (disabled) {
      classes += ' opacity-60 cursor-not-allowed pointer-events-none';
    }
    
    return classes;
  };

  // Combine all classes
  const buttonClasses = `${getButtonClasses()} ${className}`;

  // Only include hover/tap effects if not disabled and not loading
  const getMotionProps = () => {
    if (disabled || loading) return {};
    
    const motionProps: {
      transition: { type: string; stiffness: number; damping: number };
      whileHover?: { scale?: number; boxShadow?: string };
      whileTap?: { scale?: number };
    } = {
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 17 
      }
    };
    
    // Add motion effects based on hover effect
    if (hoverEffect === 'scale') {
      motionProps.whileHover = { scale: 1.02 };
      motionProps.whileTap = { scale: 0.98 };
    }
    
    // Add glow effect
    if (hoverEffect === 'glow') {
      const glowColor = variant === 'primary' ? 'rgb(59, 130, 246)' : 
                        variant === 'accent' ? 'rgb(236, 72, 153)' : 
                        'rgb(99, 102, 241)';
                        
      motionProps.whileHover = { 
        boxShadow: `0 0 10px 2px ${glowColor}` 
      };
    }
    
    return motionProps;
  };

  // Button content with icon
  const content = (
    <>
      {/* Shine effect */}
      {hoverEffect === 'shine' && shineEffect.active && (
        <span 
          className="absolute top-0 left-0 w-full h-full overflow-hidden"
        >
          <motion.span 
            className="absolute top-0 -left-[50%] w-[200%] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent transform"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </span>
      )}
    
      {/* Loading state replaces content with spinner */}
      {loading ? (
        <span className="flex items-center justify-center">
          {loadingSpinner}
        </span>
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="inline-flex shrink-0">{icon}</span>}
          {variant !== 'icon' && <span className="relative z-10">{children}</span>}
          {icon && iconPosition === 'right' && <span className="inline-flex shrink-0">{icon}</span>}
        </>
      )}
      
      {/* Ripple effect */}
      <AnimatePresence>
        {rippleEffect.active && withRipple && (
          <motion.span 
            key={rippleEffect.id}
            initial={{ opacity: 0.6, scale: 0 }}
            animate={{ opacity: 0, scale: 2.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute rounded-full bg-white/30"
            style={{
              top: rippleEffect.y,
              left: rippleEffect.x,
              width: '10px',
              height: '10px',
              transform: 'translate(-50%, -50%)',
            }}
          />
        )}
      </AnimatePresence>
      
      {/* Add additional styling for gradient variant with radial direction */}
      {variant === 'gradient' && gradientDirection === 'radial' && (
        <span className="absolute inset-0 rounded-lg overflow-hidden bg-gradient-to-r from-primary-500 to-accent-500">
          <span className="absolute inset-0 bg-radial-gradient"></span>
        </span>
      )}
    </>
  );

  // If it's a regular button
  if (!href) {
    return (
      <motion.button
        ref={buttonRef as React.RefObject<HTMLButtonElement>}
        type="button"
        onClick={handleRipple}
        className={buttonClasses}
        disabled={disabled || loading}
        {...getMotionProps()}
        {...props}
      >
        {content}
      </motion.button>
    );
  }

  // If it's an external link
  if (isExternal) {
    return (
      <motion.a
        ref={buttonRef as React.RefObject<HTMLAnchorElement>}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClasses}
        download={download}
        onClick={handleRipple}
        {...getMotionProps()}
        {...props}
      >
        {content}
      </motion.a>
    );
  }

  // Otherwise, it's an internal link
  return (
    <Link href={href} passHref>
      <motion.a
        ref={buttonRef as React.RefObject<HTMLAnchorElement>}
        className={buttonClasses}
        onClick={handleRipple}
        {...getMotionProps()}
        {...props}
      >
        {content}
      </motion.a>
    </Link>
  );
};

export default Button;