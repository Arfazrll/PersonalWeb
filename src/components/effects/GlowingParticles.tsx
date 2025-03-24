import React, { useEffect, useState, useCallback } from 'react';
import { useTheme } from 'next-themes';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

interface GlowingParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  delay: number;
  duration: number;
  color: string;
  translateX: number;
  translateY: number;
}

interface GlowingParticlesProps {
  count?: number;
  minSize?: number;
  maxSize?: number;
  className?: string;
}

const GlowingParticles: React.FC<GlowingParticlesProps> = ({
  count = 15,
  minSize = 6,
  maxSize = 20,
  className = '',
}) => {
  const [particles, setParticles] = useState<GlowingParticle[]>([]);
  const { theme } = useTheme();
  const prefersReducedMotion = usePrefersReducedMotion();

  // Memoize the generateParticles function to fix the exhaustive-deps warning
  const generateParticles = useCallback((amount: number): GlowingParticle[] => {
    const newParticles: GlowingParticle[] = [];
    const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1000;
    const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
    
    // Primary and accent colors based on theme
    const primaryColor = theme === 'dark' ? '99, 102, 241' : '79, 70, 229'; // Primary RGB
    const accentColor = theme === 'dark' ? '16, 185, 129' : '10, 185, 129'; // Accent RGB
    
    for (let i = 0; i < amount; i++) {
      // Randomly choose between primary and accent colors
      const color = Math.random() > 0.6 ? primaryColor : accentColor;
      
      newParticles.push({
        id: i,
        x: Math.random() * viewportWidth,
        y: Math.random() * viewportHeight,
        size: Math.random() * (maxSize - minSize) + minSize,
        opacity: Math.random() * 0.4 + 0.1,
        delay: Math.random() * 2,
        duration: Math.random() * 10 + 20,
        color: `rgba(${color}, ${Math.random() * 0.5 + 0.1})`,
        translateX: Math.random() * 20 - 10,
        translateY: Math.random() * 30 - 15
      });
    }
    
    return newParticles;
  }, [maxSize, minSize, theme]);

  useEffect(() => {
    if (prefersReducedMotion) {
      // Show fewer, static particles for users who prefer reduced motion
      setParticles(generateParticles(5));
      return;
    }
    
    setParticles(generateParticles(count));
  }, [count, generateParticles, prefersReducedMotion]);

  if (particles.length === 0) return null;

  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden ${className}`}>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            opacity: particle.opacity,
            filter: `blur(${particle.size / 3}px)`,
            animation: prefersReducedMotion 
              ? 'none' 
              : `glow ${particle.duration}s infinite ease-in-out ${particle.delay}s, 
                 float-x ${particle.duration * 0.7}s infinite ease-in-out ${particle.delay}s, 
                 float-y ${particle.duration * 0.9}s infinite ease-in-out ${particle.delay * 1.2}s`,
          }}
        />
      ))}

      {/* Add keyframe animations via a style tag */}
      <style jsx>{`
        @keyframes glow {
          0%, 100% {
            transform: scale(0.7);
            opacity: ${particles[0]?.opacity ? particles[0].opacity * 0.5 : 0.05};
          }
          50% {
            transform: scale(1.2);
            opacity: ${particles[0]?.opacity || 0.1};
          }
        }
        
        @keyframes float-x {
          0%, 100% {
            transform: translateX(-10px);
          }
          50% {
            transform: translateX(10px);
          }
        }
        
        @keyframes float-y {
          0%, 100% {
            transform: translateY(-15px);
          }
          50% {
            transform: translateY(15px);
          }
        }
      `}</style>
    </div>
  );
};

export default GlowingParticles;