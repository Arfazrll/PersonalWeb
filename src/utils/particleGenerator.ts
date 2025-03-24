// src/utils/particleGenerator.ts
import { useTheme } from 'next-themes';
import { useMemo } from 'react';

export interface Particle {
  id: number;
  x: string;
  y: string;
  size: number;
  color: string;
  speed: number;
  delay: number;
}

/**
 * Generate particles with theme-aware colors
 * 
 * @param count Number of particles to generate
 * @param isDarkMode Boolean indicating if dark mode is active
 * @returns Array of particle objects
 */
export const generateParticles = (count: number, isDarkMode: boolean): Particle[] => {
  // Primary colors based on theme
  const primaryColor = isDarkMode ? '99, 102, 241' : '79, 70, 229'; // Primary RGB
  const accentColor = isDarkMode ? '16, 185, 129' : '10, 185, 129'; // Accent RGB
  
  return Array.from({ length: count }, (_, index) => {
    // Choose between primary and accent colors with a bias toward primary
    const colorBase = Math.random() > 0.3 ? primaryColor : accentColor;
    const opacity = Math.random() * 0.2 + 0.05; // Lower opacity for subtle effect
    
    return {
      id: index,
      x: `${Math.random() * 100}%`,
      y: `${Math.random() * 100}%`,
      size: Math.random() * 4 + 1, // Smaller particles for better performance
      color: `rgba(${colorBase}, ${opacity})`,
      speed: Math.random() * 2 + 0.5,
      delay: Math.random() * 2, // Random delay for more natural movement
    };
  });
};

/**
 * Custom hook to generate and memoize particles
 * 
 * @param count Number of particles to generate
 * @param prefersReducedMotion Whether user prefers reduced motion
 * @returns Array of particle objects
 */
export const useParticles = (count: number, prefersReducedMotion: boolean) => {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';
  
  // Generate fewer particles if user prefers reduced motion
  const particleCount = prefersReducedMotion ? Math.min(5, count) : count;
  
  // Memoize particles to prevent regeneration on each render
  return useMemo(() => 
    generateParticles(particleCount, isDarkMode), 
    [particleCount, isDarkMode]
  );
};

export default useParticles;