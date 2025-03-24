import React from 'react';
import { motion } from 'framer-motion';

interface SkillBadgeProps {
  skill: string;
  delay?: number;
  className?: string;
}

const SkillBadge: React.FC<SkillBadgeProps> = ({ 
  skill, 
  delay = 0,
  className = '' 
}) => {
  return (
    <motion.span
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 100, 
        damping: 10, 
        delay: delay 
      }}
      whileHover={{ 
        scale: 1.05, 
        backgroundColor: '#c7d2fe', // Hex untuk primary-200
        color: '#312e81'  // Hex untuk primary-900
      }}
      className={`skill-badge ${className}`}
    >
      {skill}
    </motion.span>
  );
};

export default SkillBadge;