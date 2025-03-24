import React from 'react';
import { motion } from 'framer-motion';

type MotionDivProps = React.ComponentProps<typeof motion.div>;

interface CardProps extends Omit<MotionDivProps, 'hover'> {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  variant?: 'default' | 'elevated' | 'outline' | 'glass';
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  onClick = undefined,
  variant = 'default',
  ...props
}) => {
  // Determine class based on variant
  const getVariantClass = () => {
    switch (variant) {
      case 'elevated':
        return 'shadow-md bg-white dark:bg-gray-900 border-0';
      case 'outline':
        return 'bg-transparent border border-gray-200 dark:border-gray-800';
      case 'glass':
        return 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-white/20 dark:border-gray-800/30';
      default:
        return 'bg-white dark:bg-true-black border border-gray-100 dark:border-gray-800/50 shadow-sm';
    }
  };

  return (
    <motion.div
      className={`card rounded-xl p-6 transition-all duration-300 ${getVariantClass()} ${hover ? 'card-hover' : ''} ${className}`}
      whileHover={hover ? { 
        y: -5, 
        boxShadow: '0 10px 25px -3px rgba(0, 115, 255, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        borderColor: 'rgba(0, 115, 255, 0.2)'
      } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;