import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  isExternal?: boolean;
  download?: boolean | string;
  [key: string]: React.ReactNode | string | boolean | (() => void) | undefined;
}

const Button: React.FC<ButtonProps> = ({
  children,
  href,
  onClick,
  variant = 'primary',
  className = '',
  icon = null,
  iconPosition = 'right',
  isExternal = false,
  download = false,
  ...props
}) => {
  // Get the appropriate class name based on variant
  const getButtonClass = () => {
    switch (variant) {
      case 'primary':
        return 'btn-primary';
      case 'secondary':
        return 'btn-secondary';
      case 'outline':
        return 'btn-outline';
      default:
        return 'btn-primary';
    }
  };

  // Content with icon
  const content = (
    <>
      {icon && iconPosition === 'left' && <span className="mr-2">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="ml-2">{icon}</span>}
    </>
  );

  // Animation properties
  const motionProps = {
    whileHover: { scale: 1.03 },
    whileTap: { scale: 0.98 },
    transition: { type: "spring", stiffness: 400, damping: 17 }
  };

  // If it's a regular button
  if (!href) {
    return (
      <motion.button
        type="button"
        onClick={onClick}
        className={`${getButtonClass()} flex items-center justify-center ${className}`}
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
        className={`${getButtonClass()} flex items-center justify-center ${className}`}
        download={download}
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
        className={`${getButtonClass()} flex items-center justify-center ${className}`}
        {...motionProps}
        {...props}
      >
        {content}
      </motion.a>
    </Link>
  );
};

export default Button;