import React from 'react';
import { motion } from 'framer-motion';

type MotionDivProps = React.ComponentProps<typeof motion.div>;

interface CardProps extends Omit<MotionDivProps, 'hover'> {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  onClick = undefined,
  ...props
}) => {
  return (
    <motion.div
      className={`card ${hover ? 'card-hover' : ''} ${className}`}
      whileHover={hover ? { y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;