import React from 'react';
import { motion, Variants } from 'framer-motion';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
  // Enhanced customization options
  variant?: 'default' | 'gradient' | 'underlined' | 'boxed' | 'accent';
  animationVariant?: 'fade' | 'slide' | 'scale' | 'staggered' | 'none';
  accentColor?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  titleClassName?: string;
  subtitleClassName?: string;
  withDecoration?: boolean;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  highlightWords?: string[];
}

// Animation variants - Fixed to match the expected type
const fadeVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { 
      duration: 0.5,
      staggerChildren: 0.1 
    }
  }
};

const slideVariants: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { 
      duration: 0.6,
      staggerChildren: 0.1,
      type: "spring", 
      stiffness: 50
    }
  }
};

const scaleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { 
      duration: 0.5,
      staggerChildren: 0.1,
      type: "spring", 
      stiffness: 100
    }
  }
};

const SectionHeading: React.FC<SectionHeadingProps> = ({
  title,
  subtitle,
  centered = true,
  className = '',
  variant = 'default',
  animationVariant = 'fade',
  accentColor = 'primary',
  size = 'md',
  titleClassName = '',
  subtitleClassName = '',
  withDecoration = true,
  as = 'h2',
  highlightWords = [],
}) => {
  // Function to apply highlighting to specific words in title
  const renderHighlightedTitle = () => {
    if (highlightWords.length === 0) {
      return title;
    }

    // Create RegExp to match highlighted words (with word boundaries)
    const regex = new RegExp(`\\b(${highlightWords.join('|')})\\b`, 'gi');
    
    // Split the title by matched words
    const parts = title.split(regex);
    
    // Return an array of JSX elements where matched words are wrapped in spans
    return parts.map((part, index) => {
      // If this part matches one of the highlighted words
      if (highlightWords.some(word => part.toLowerCase() === word.toLowerCase())) {
        return (
          <span 
            key={index}
            className={`relative inline-block
              ${accentColor === 'primary' ? 'text-primary-600 dark:text-primary-400' : 
               accentColor === 'secondary' ? 'text-secondary-600 dark:text-secondary-400' : 
               accentColor === 'accent' ? 'text-accent-600 dark:text-accent-400' : 
               accentColor}`}
          >
            {part}
            {variant === 'underlined' && (
              <span className="absolute bottom-0 left-0 w-full h-[0.15em] -mb-1 bg-current opacity-60 rounded-sm"></span>
            )}
          </span>
        );
      }
      // For regular words
      return part;
    });
  };

  // Generate classes based on props
  const sizeClasses = {
    sm: 'text-2xl md:text-3xl',
    md: 'text-3xl md:text-4xl',
    lg: 'text-4xl md:text-5xl',
    xl: 'text-5xl md:text-6xl',
  }[size];

  // Get container classes
  const containerClasses = `section-heading ${centered ? 'text-center' : ''} ${className}`;
  
  // Get title classes
  const titleClasses = `font-bold ${sizeClasses} ${
    variant === 'gradient' 
      ? 'bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-500 dark:from-primary-400 dark:to-accent-400' 
      : 'text-gray-900 dark:text-white'
  } ${titleClassName}`;

  // Get subtitle classes
  const subtitleClasses = `mt-4 ${
    size === 'sm' ? 'text-base' :
    size === 'md' ? 'text-lg' :
    size === 'lg' ? 'text-xl' :
    'text-2xl'
  } text-gray-600 dark:text-gray-400 ${
    centered ? 'max-w-3xl mx-auto' : 'max-w-3xl'
  } ${subtitleClassName}`;

  // Determine which HTML heading element to use
  const HeadingTag = as;

  // Generate decoration elements based on variant
  const renderDecorationElement = () => {
    if (!withDecoration) return null;
    
    switch (variant) {
      case 'accent':
        return (
          <motion.div 
            className={`w-16 h-1.5 rounded-full mb-4 ${centered ? 'mx-auto' : ''} bg-primary-500 dark:bg-primary-400`}
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 64, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
        );
      case 'boxed':
        return (
          <motion.div 
            className="w-12 h-12 mb-4 rounded-lg bg-primary-500/10 dark:bg-primary-400/10 flex items-center justify-center"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, type: 'spring', stiffness: 150 }}
          >
            <span className="w-6 h-6 rounded-md bg-primary-500 dark:bg-primary-400" />
          </motion.div>
        );
      case 'underlined':
        return (
          <motion.div 
            className={`h-0.5 mt-4 mb-6 ${centered ? 'mx-auto' : ''} bg-gradient-to-r from-primary-500 via-accent-500 to-transparent`}
            style={{ width: centered ? '120px' : '140px' }}
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: centered ? 120 : 140, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          />
        );
      default:
        return null;
    }
  };

  // Helper function to get appropriate variants based on animation type
  const getVariants = () => {
    if (animationVariant === 'none') return undefined;
    
    switch (animationVariant) {
      case 'fade': return fadeVariants;
      case 'slide': return slideVariants;
      case 'scale': return scaleVariants;
      default: return fadeVariants;
    }
  };

  return (
    <div className={containerClasses}>
      {variant === 'accent' && renderDecorationElement()}
      
      {variant === 'boxed' && centered && renderDecorationElement()}
      
      <div className={`flex items-center ${centered ? 'justify-center' : 'justify-start'} mb-4`}>
        {variant === 'boxed' && !centered && renderDecorationElement()}
        
        <motion.div
          className="relative"
          variants={getVariants()}
          initial={animationVariant !== 'none' ? "hidden" : undefined}
          animate={animationVariant !== 'none' ? "visible" : undefined}
          whileInView={animationVariant !== 'none' ? { opacity: 1, y: 0 } : undefined}
          
        >
          <HeadingTag className={titleClasses}>
            {renderHighlightedTitle()}
          </HeadingTag>
          
          {variant === 'underlined' && renderDecorationElement()}
        </motion.div>
      </div>
      
      {subtitle && (
        <motion.p 
          className={subtitleClasses}
          variants={getVariants()}
          initial={animationVariant !== 'none' ? "hidden" : undefined}
          animate={animationVariant !== 'none' ? "visible" : undefined}
          whileInView={animationVariant !== 'none' ? { opacity: 1, y: 0 } : undefined}
          
          transition={{ delay: 0.1 }}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
};

export default SectionHeading;