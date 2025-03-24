import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'glass' | 'accent';
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  isExternal?: boolean;
  download?: boolean | string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  withRipple?: boolean;
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
  size = 'md',
  fullWidth = false,
  withRipple = true,
  ...props
}) => {
  const [rippleEffect, setRippleEffect] = useState<{ x: number, y: number, active: boolean }>({
    x: 0,
    y: 0,
    active: false
  });

  // Handle ripple effect on click
  const handleRipple = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    if (!withRipple) return;
    
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setRippleEffect({ x, y, active: true });
    
    // Reset ripple after animation
    setTimeout(() => {
      setRippleEffect({ x: 0, y: 0, active: false });
    }, 600);
    
    // Execute onClick handler if provided
    if (onClick) {
      onClick();
    }
  };

  // Get the appropriate class name based on variant and size
  const getButtonClasses = () => {
    // Base classes
    let classes = 'relative overflow-hidden rounded-lg font-medium transition-all duration-300 flex items-center justify-center';
    
    // Size classes
    switch (size) {
      case 'sm':
        classes += ' text-sm py-2 px-4';
        break;
      case 'lg':
        classes += ' text-lg py-4 px-8';
        break;
      default: // md
        classes += ' py-3 px-6';
    }
    
    // Width class
    if (fullWidth) {
      classes += ' w-full';
    }
    
    // Variant classes
    switch (variant) {
      case 'primary':
        classes += ' bg-primary-500 hover:bg-primary-600 text-white shadow-sm hover:shadow-md';
        break;
      case 'secondary':
        classes += ' bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 shadow-sm hover:shadow-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700';
        break;
      case 'outline':
        classes += ' bg-transparent hover:bg-primary-50 text-primary-500 border border-primary-500 dark:text-primary-400 dark:border-primary-400 dark:hover:bg-primary-900/20';
        break;
      case 'glass':
        classes += ' bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/30 shadow-sm hover:shadow-md';
        break;
      case 'accent':
        classes += ' bg-accent-500 hover:bg-accent-600 text-white shadow-sm hover:shadow-md';
        break;
      default:
        classes += ' bg-primary-500 hover:bg-primary-600 text-white shadow-sm hover:shadow-md';
    }
    
    // Disabled state
    if (disabled) {
      classes += ' opacity-60 cursor-not-allowed pointer-events-none';
    }
    
    return classes;
  };

  // Combine all classes
  const buttonClasses = `${getButtonClasses()} ${className}`;

  // Button content with icon
  const content = (
    <>
      {icon && iconPosition === 'left' && <span className="mr-2">{icon}</span>}
      <span className="relative z-10">{children}</span>
      {icon && iconPosition === 'right' && <span className="ml-2">{icon}</span>}
      
      {/* Ripple effect */}
      {rippleEffect.active && withRipple && (
        <span 
          className="absolute rounded-full bg-white/30 animate-ripple"
          style={{
            top: rippleEffect.y,
            left: rippleEffect.x,
            transform: 'translate(-50%, -50%)',
          }}
        />
      )}
    </>
  );

  // Animation properties
  const motionProps = {
    whileHover: disabled ? undefined : { scale: 1.02 },
    whileTap: disabled ? undefined : { scale: 0.98 },
    transition: { type: "spring", stiffness: 400, damping: 17 }
  };

  // If it's a regular button
  if (!href) {
    return (
      <motion.button
        type="button"
        onClick={handleRipple}
        className={buttonClasses}
        disabled={disabled}
        {...motionProps}
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
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClasses}
        download={download}
        onClick={handleRipple}
        {...motionProps}
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
        className={buttonClasses}
        onClick={handleRipple}
        {...motionProps}
        {...props}
      >
        {content}
      </motion.a>
    </Link>
  );
};

export default Button;