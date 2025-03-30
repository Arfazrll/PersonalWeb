import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

type MotionDivProps = React.ComponentProps<typeof motion.div>;

interface CardProps extends Omit<MotionDivProps, 'hover'> {
  children: React.ReactNode;
  className?: string;
  hover?: boolean | 'subtle' | 'float' | 'glow' | 'scale' | 'tilt' | 'spotlight';
  onClick?: () => void;
  variant?: 'default' | 'elevated' | 'outline' | 'glass' | 'gradient' | 'flat' | 'minimal' | 'dark';
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  border?: boolean;
  borderColor?: string;
  shadow?: boolean | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'inner' | 'none';
  interactive?: boolean;
  layoutId?: string;
  gradient?: string;
  glowColor?: string;
  elevation?: number;
  withRipple?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  onClick = undefined,
  variant = 'default',
  radius = 'md',
  padding = 'md',
  border = true,
  borderColor,
  shadow = true,
  interactive = false,
  layoutId,
  gradient,
  glowColor,
  elevation = 0,
  withRipple = false,
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Handle ripple effect on click
  const handleRipple = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!withRipple) return;
    
    const rect = cardRef.current?.getBoundingClientRect() || { left: 0, top: 0 };
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple = {
      id: Date.now(),
      x,
      y
    };
    
    setRipples(prev => [...prev, newRipple]);
    
    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);
  };
  
  // Handle mouse move for spotlight effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (hover !== 'spotlight' && hover !== 'tilt') return;
    
    const rect = cardRef.current?.getBoundingClientRect() || { left: 0, top: 0, width: 0, height: 0 };
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setMousePosition({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100
    });
  };
  
  // Cleanup animation frames
  useEffect(() => {
    return () => {
      setRipples([]);
    };
  }, []);
  
  // Determine border radius based on prop
  const getBorderRadius = () => {
    switch (radius) {
      case 'none': return '';
      case 'sm': return 'rounded';
      case 'lg': return 'rounded-xl';
      case 'xl': return 'rounded-2xl';
      case 'full': return 'rounded-full';
      default: return 'rounded-lg'; // md is default
    }
  };
  
  // Determine padding based on prop
  const getPadding = () => {
    switch (padding) {
      case 'none': return 'p-0';
      case 'sm': return 'p-3';
      case 'lg': return 'p-8';
      case 'xl': return 'p-10';
      default: return 'p-6'; // md is default
    }
  };
  
  // Determine shadow based on prop
  const getShadow = () => {
    if (!shadow) return '';
    
    switch (shadow) {
      case 'sm': return 'shadow-sm';
      case 'lg': return 'shadow-lg';
      case 'xl': return 'shadow-xl';
      case '2xl': return 'shadow-2xl';
      case 'inner': return 'shadow-inner';
      case 'none': return '';
      default: return typeof shadow === 'boolean' ? 'shadow' : 'shadow-md'; // md is default
    }
  };
  
  // Dynamic elevation style based on elevation prop and hover state
  const getElevationStyle = () => {
    if (elevation === 0 && !isHovered) return {};
    
    const baseElevation = elevation;
    const hoverElevation = isHovered ? elevation + 4 : elevation;
    const actualElevation = isHovered ? hoverElevation : baseElevation;
    
    if (actualElevation === 0) return {};
    
    return {
      transform: `translateY(${-actualElevation / 2}px)`,
      boxShadow: `0 ${actualElevation}px ${actualElevation * 2}px rgba(0, 0, 0, ${0.05 + (actualElevation * 0.01)})`
    };
  };
  
  // Get variant-specific classes and styles
  const getVariantStyles = () => {
    let classes = '';
    let customStyle = {};
    
    switch (variant) {
      case 'elevated':
        classes = 'shadow-md bg-white dark:bg-gray-900 border-0';
        break;
      case 'outline':
        classes = 'bg-transparent border border-gray-200 dark:border-gray-800';
        break;
      case 'glass':
        classes = 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-white/20 dark:border-gray-800/30';
        customStyle = { backdropFilter: 'blur(8px)' };
        break;
      case 'gradient':
        classes = 'border-0';
        customStyle = {
          background: gradient || 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
        };
        break;
      case 'flat':
        classes = 'bg-gray-50 dark:bg-gray-900 border-0';
        break;
      case 'minimal':
        classes = 'bg-transparent border-0 shadow-none';
        break;
      case 'dark':
        classes = 'bg-gray-900 text-white border border-gray-800';
        break;
      default:
        classes = 'bg-white dark:bg-true-black border border-gray-100 dark:border-gray-800/50 shadow-sm';
    }
    
    return { classes, customStyle };
  };
  
  // Helper function to create type-safe hover animations
  const createHoverAnimation = (props: Record<string, string | number>) => {
    return props;
  };

  // Get hover animation properties based on hover type
  const getHoverAnimation = () => {
    if (!hover) return undefined;
    
    switch (hover) {
      case 'subtle':
        return createHoverAnimation({ 
          y: -2,
          boxShadow: '0 5px 10px rgba(0, 0, 0, 0.05)'
        });
      case 'float':
        return createHoverAnimation({ 
          y: -8, 
          boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1), 0 5px 15px rgba(0, 0, 0, 0.04)'
        });
      case 'glow':
        return createHoverAnimation({ 
          boxShadow: `0 0 15px 2px ${glowColor || 'rgba(66, 153, 225, 0.5)'}`
        });
      case 'scale':
        return createHoverAnimation({ 
          scale: 1.03
        });
      case 'tilt':
      case 'spotlight':
        // These are handled via CSS/inline styles
        return undefined; 
      default:
        if (hover === true) {
          return createHoverAnimation({ 
            y: -5, 
            boxShadow: '0 10px 25px -3px rgba(0, 115, 255, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            borderColor: 'rgba(0, 115, 255, 0.2)'
          });
        }
        return undefined;
    }
  };
  
  // Get spotlight gradient style when hover is 'spotlight'
  const getSpotlightStyle = () => {
    if (hover !== 'spotlight' || !isHovered) return {};
    
    return {
      background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 50%)`
    };
  };
  
  // Get tilt transform style when hover is 'tilt'
  const getTiltStyle = () => {
    if (hover !== 'tilt' || !isHovered) return {};
    
    // Convert 0-100 position to degrees of tilt (max ±10 degrees)
    const maxTilt = 10;
    const tiltY = ((mousePosition.x - 50) / 50) * maxTilt;
    const tiltX = ((mousePosition.y - 50) / 50) * -maxTilt;
    
    return {
      transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.03)`,
      transition: isHovered ? 'none' : 'transform 0.5s ease'
    };
  };
  
  // Combine all classes and styles
  const { classes: variantClasses, customStyle: variantStyle } = getVariantStyles();
  const elevationStyle = getElevationStyle();
  const spotlightStyle = getSpotlightStyle();
  const tiltStyle = getTiltStyle();
  
  // Border style if custom border color is specified
  const borderStyle = borderColor ? {
    borderColor: borderColor
  } : {};
  
  // Combined inline styles
  const combinedStyle = {
    ...variantStyle,
    ...elevationStyle,
    ...spotlightStyle,
    ...tiltStyle,
    ...borderStyle
  };
  
  return (
    <motion.div
      ref={cardRef}
      className={`card ${getBorderRadius()} ${getPadding()} transition-all duration-300 ${variantClasses} ${!border ? 'border-0' : ''} ${getShadow()} ${className}`}
      layoutId={layoutId}
      whileHover={getHoverAnimation()}
      whileTap={onClick || interactive ? { scale: 0.98 } : undefined}
      onClick={(e) => {
        handleRipple(e);
        if (onClick) onClick();
      }}
      onMouseOver={() => setIsHovered(true)}
      onMouseOut={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      style={combinedStyle}
      {...props}
    >
      {/* Ripple effect */}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-white/20 animate-ripple pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            transform: 'translate(-50%, -50%)'
          }}
        />
      ))}
      
      {/* Card content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Styles for animations */}
      <style jsx global>{`
        @keyframes ripple {
          0% {
            width: 0;
            height: 0;
            opacity: 0.6;
          }
          100% {
            width: 500px;
            height: 500px;
            opacity: 0;
          }
        }
        
        .animate-ripple {
          animation: ripple 0.6s linear forwards;
        }
      `}</style>
    </motion.div>
  );
};

export default Card;