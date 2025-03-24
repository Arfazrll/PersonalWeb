import React, { useEffect, useState, useCallback, useRef } from 'react';
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
  intensityFactor: number; // Added for varying glow intensity
  shape: 'circle' | 'square' | 'triangle'; // Added for shape variety
}

interface GlowingParticlesProps {
  count?: number;
  minSize?: number;
  maxSize?: number;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
}

const GlowingParticles: React.FC<GlowingParticlesProps> = ({
  count = 20,
  minSize = 6,
  maxSize = 30,
  className = '',
  intensity = 'medium',
}) => {
  const [particles, setParticles] = useState<GlowingParticle[]>([]);
  const { theme, resolvedTheme } = useTheme();
  const prefersReducedMotion = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const isDark = resolvedTheme === 'dark';
  
  // Determine intensity factor
  const getIntensityValue = useCallback(() => {
    switch(intensity) {
      case 'low': return 0.6;
      case 'high': return 1.4;
      default: return 1;
    }
  }, [intensity]);
  
  // Memoize the generateParticles function to fix the exhaustive-deps warning
  const generateParticles = useCallback((amount: number): GlowingParticle[] => {
    const newParticles: GlowingParticle[] = [];
    const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1000;
    const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
    const intensityValue = getIntensityValue();
    
    // Define color palettes based on theme
    let primaryRgb = '99, 102, 241'; // Default (indigo)
    let accentRgb = '16, 185, 129';  // Default (emerald) 
    
    // Adjust colors based on theme
    if (theme === 'purple') {
      primaryRgb = '168, 85, 247'; // Purple
      accentRgb = '244, 114, 182'; // Pink
    } else if (theme === 'blue') {
      primaryRgb = '59, 130, 246'; // Blue
      accentRgb = '245, 158, 11';  // Amber
    } else if (theme === 'neon') {
      primaryRgb = '6, 182, 212';  // Cyan
      accentRgb = '236, 72, 153';  // Pink
    }
    
    const shapes: Array<'circle' | 'square' | 'triangle'> = ['circle', 'square', 'triangle'];
    
    for (let i = 0; i < amount; i++) {
      // Randomly choose between primary and accent colors with some variation
      const baseRgb = Math.random() > 0.65 ? accentRgb : primaryRgb;
      
      // Add slight variation to the RGB values for diversity
      const [r, g, b] = baseRgb.split(',').map(Number);
      const variation = 20; // RGB variation range
      const variedR = Math.max(0, Math.min(255, r + (Math.random() - 0.5) * variation));
      const variedG = Math.max(0, Math.min(255, g + (Math.random() - 0.5) * variation));
      const variedB = Math.max(0, Math.min(255, b + (Math.random() - 0.5) * variation));
      
      const particleRgb = `${variedR.toFixed(0)}, ${variedG.toFixed(0)}, ${variedB.toFixed(0)}`;
      
      // Higher opacity for dark mode to make particles more visible
      const opacityBase = isDark ? 0.2 : 0.15;
      
      newParticles.push({
        id: i,
        x: Math.random() * viewportWidth,
        y: Math.random() * viewportHeight,
        size: Math.random() * (maxSize - minSize) + minSize,
        opacity: Math.random() * 0.3 + opacityBase,
        delay: Math.random() * 3,
        duration: Math.random() * 10 + 15,
        color: `rgba(${particleRgb}, ${Math.random() * 0.6 + 0.2})`,
        translateX: Math.random() * 40 - 20,
        translateY: Math.random() * 60 - 30,
        intensityFactor: Math.random() * 0.5 + intensityValue * 0.5, // Random variation + base intensity
        shape: shapes[Math.floor(Math.random() * shapes.length)]
      });
    }
    
    return newParticles;
  }, [maxSize, minSize, theme, isDark, getIntensityValue]);

  // Track window resize and update particles accordingly
  useEffect(() => {
    const handleResize = () => {
      // Regenerate particles on window resize for proper positioning
      setParticles(generateParticles(count));
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [count, generateParticles]);
  
  useEffect(() => {
    if (prefersReducedMotion) {
      // Show fewer, static particles for users who prefer reduced motion
      setParticles(generateParticles(Math.max(5, Math.floor(count / 4))));
      return;
    }
    
    setParticles(generateParticles(count));
  }, [count, generateParticles, prefersReducedMotion, theme, resolvedTheme]);

  // Add scroll-based parallax effect
  useEffect(() => {
    if (prefersReducedMotion || !containerRef.current) return;
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (containerRef.current) {
        containerRef.current.style.transform = `translateY(${scrollPosition * 0.1}px)`;
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [prefersReducedMotion]);

  if (particles.length === 0) return null;

  return (
    <div 
      ref={containerRef}
      className={`fixed inset-0 pointer-events-none overflow-hidden ${className}`}
      style={{ zIndex: -5 }}
    >
      {particles.map((particle) => {
        // Create different shapes based on the particle's shape property
        let shapeCss = {};
        
        if (particle.shape === 'square') {
          shapeCss = {
            borderRadius: '20%',
            transform: `rotate(${Math.random() * 45}deg)`,
          };
        } else if (particle.shape === 'triangle') {
          // Use a different approach for triangles (pseudo-element used in CSS)
          shapeCss = {
            width: 0,
            height: 0,
            borderLeft: `${particle.size}px solid transparent`,
            borderRight: `${particle.size}px solid transparent`,
            borderBottom: `${particle.size * 1.5}px solid ${particle.color}`,
            background: 'transparent',
            filter: 'none',
            opacity: particle.opacity * 0.7, // Triangles need a little opacity adjustment
          };
        }
        
        return (
          <div
            key={particle.id}
            className={`absolute ${particle.shape !== 'triangle' ? 'rounded-full' : ''}`}
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.shape !== 'triangle' ? particle.color : 'transparent',
              opacity: particle.opacity,
              filter: particle.shape !== 'triangle' ? `blur(${particle.size / 3}px)` : 'none',
              animation: prefersReducedMotion 
                ? 'none' 
                : `glow ${particle.duration * particle.intensityFactor}s infinite ease-in-out ${particle.delay}s, 
                   float-x ${particle.duration * 0.8}s infinite ease-in-out ${particle.delay}s, 
                   float-y ${particle.duration}s infinite ease-in-out ${particle.delay * 1.2}s`,
              zIndex: Math.floor(particle.size),
              ...shapeCss
            }}
          />
        );
      })}

      {/* Enhanced keyframe animations via style tag */}
      <style jsx>{`
        @keyframes glow {
          0%, 100% {
            transform: scale(0.7);
            opacity: ${particles[0]?.opacity ? particles[0].opacity * 0.5 : 0.05};
          }
          50% {
            transform: scale(1.3);
            opacity: ${particles[0]?.opacity || 0.1};
          }
        }
        
        @keyframes float-x {
          0%, 100% {
            transform: translateX(-15px) rotate(0deg);
          }
          50% {
            transform: translateX(15px) rotate(5deg);
          }
        }
        
        @keyframes float-y {
          0%, 100% {
            transform: translateY(-20px);
          }
          50% {
            transform: translateY(20px);
          }
        }
      `}</style>
    </div>
  );
};

export default GlowingParticles;