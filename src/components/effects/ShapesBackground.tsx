import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTheme } from 'next-themes';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

interface Shape {
  id: number;
  type: 'circle' | 'square' | 'triangle' | 'donut' | 'hexagon' | 'star';
  x: string;
  y: string;
  size: number;
  rotation: number;
  color: string;
  delay: number;
  duration: number;
  blurAmount: number;
  shadowColor: string;
  shadowIntensity: number;
  borderWidth?: number;
}

const ShapesBackground: React.FC = () => {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const { theme, resolvedTheme } = useTheme();
  const prefersReducedMotion = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const isDark = resolvedTheme === 'dark';

  // Memoize generateShapes to fix the exhaustive-deps warning and add enhanced shapes
  const generateShapes = useCallback((count: number): Shape[] => {
    const newShapes: Shape[] = [];
    const shapeTypes: Array<'circle' | 'square' | 'triangle' | 'donut' | 'hexagon' | 'star'> = 
      ['circle', 'square', 'triangle', 'donut', 'hexagon', 'star'];
    
    // Set primary and accent colors based on theme
    let primaryRgb = '99, 102, 241'; // Default (indigo)
    let accentRgb = '16, 185, 129';  // Default (emerald)
    
    if (theme === 'purple') {
      primaryRgb = '168, 85, 247';  // Purple
      accentRgb = '244, 114, 182';  // Pink
    } else if (theme === 'blue') {
      primaryRgb = '59, 130, 246';  // Blue
      accentRgb = '245, 158, 11';   // Amber
    } else if (theme === 'neon') {
      primaryRgb = '6, 182, 212';   // Cyan
      accentRgb = '236, 72, 153';   // Pink
    }
    
    // Adjust opacity based on theme
    const baseOpacity = isDark ? 0.08 : 0.05;
    
    // Shadow intensity based on theme
    const shadowBaseIntensity = isDark ? 0.4 : 0.2;
    
    for (let i = 0; i < count; i++) {
      // Randomly choose between primary and accent colors with variation
      const colorBase = Math.random() > 0.65 ? accentRgb : primaryRgb;
      
      // Add slight variation to RGB values
      const [r, g, b] = colorBase.split(',').map(Number);
      const variation = 20;
      const variedR = Math.max(0, Math.min(255, r + (Math.random() - 0.5) * variation));
      const variedG = Math.max(0, Math.min(255, g + (Math.random() - 0.5) * variation));
      const variedB = Math.max(0, Math.min(255, b + (Math.random() - 0.5) * variation));
      
      const shapeRgb = `${variedR.toFixed(0)}, ${variedG.toFixed(0)}, ${variedB.toFixed(0)}`;
      const opacity = Math.random() * 0.1 + baseOpacity;
      
      // Random shape type
      const type = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
      
      // Position as percentages to be responsive
      const x = `${Math.random() * 100}%`;
      const y = `${Math.random() * 100}%`;
      
      // Size range - vary based on shape type for visual interest
      const baseSize = Math.random() * 120 + 40;
      const sizeMultiplier = type === 'star' ? 0.7 : 
                             type === 'hexagon' ? 0.9 : 
                             type === 'triangle' ? 1.2 : 1;
      const size = baseSize * sizeMultiplier;
      
      // Create a shadow glow effect for some shapes
      const shadowIntensity = Math.random() > 0.7 ? 
                               Math.random() * 0.5 + shadowBaseIntensity : 
                               0;
      
      // Border width only for donut type
      const borderWidth = type === 'donut' ? Math.floor(size / 8) : undefined;
      
      newShapes.push({
        id: i,
        type,
        x,
        y,
        size,
        rotation: Math.random() * 360,
        color: `rgba(${shapeRgb}, ${opacity})`,
        delay: Math.random() * 5,
        duration: Math.random() * 60 + 40,
        blurAmount: Math.random() > 0.5 ? Math.random() * 20 + 5 : 0,
        shadowColor: `rgba(${shapeRgb}, ${shadowIntensity})`,
        shadowIntensity,
        borderWidth
      });
    }
    
    return newShapes;
  }, [theme, isDark]);

  // Track window resize for responsive shapes
  useEffect(() => {
    const handleResize = () => {
      const shapeCount = prefersReducedMotion ? 5 : 15;
      const generatedShapes = generateShapes(shapeCount);
      setShapes(generatedShapes);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [generateShapes, prefersReducedMotion]);

  useEffect(() => {
    const shapeCount = prefersReducedMotion ? 5 : 15;
    const generatedShapes = generateShapes(shapeCount);
    setShapes(generatedShapes);
  }, [theme, prefersReducedMotion, generateShapes]);

  // Add parallax scrolling effect
  useEffect(() => {
    if (prefersReducedMotion || !containerRef.current) return;
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const parallaxFactor = 0.05; // Adjust for stronger/weaker effect
      
      if (containerRef.current) {
        containerRef.current.style.transform = `translateY(${scrollPosition * parallaxFactor}px)`;
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [prefersReducedMotion]);

  // Helper to render different shapes
  const renderShape = (shape: Shape) => {
    const commonStyle: React.CSSProperties = {
      width: shape.size,
      height: shape.size,
      backgroundColor: shape.type !== 'triangle' ? shape.color : 'transparent',
      filter: shape.blurAmount ? `blur(${shape.blurAmount}px)` : 'none',
      boxShadow: shape.shadowIntensity > 0 ? `0 0 ${shape.size / 3}px ${shape.shadowColor}` : 'none',
    };
    
    switch (shape.type) {
      case 'circle':
        return <div className="absolute rounded-full" style={commonStyle} />;
        
      case 'square':
        return (
          <div 
            className="absolute"
            style={{
              ...commonStyle,
              borderRadius: shape.size * 0.1,
            }}
          />
        );
        
      case 'triangle':
        return (
          <div 
            className="absolute"
            style={{
              width: 0,
              height: 0,
              borderLeft: `${shape.size / 2}px solid transparent`,
              borderRight: `${shape.size / 2}px solid transparent`,
              borderBottom: `${shape.size}px solid ${shape.color}`,
              filter: shape.blurAmount ? `blur(${shape.blurAmount}px)` : 'none',
              boxShadow: shape.shadowIntensity > 0 ? `0 0 ${shape.size / 3}px ${shape.shadowColor}` : 'none',
            }}
          />
        );
        
      case 'donut':
        return (
          <div 
            className="absolute rounded-full"
            style={{
              width: shape.size,
              height: shape.size,
              border: `${shape.borderWidth}px solid ${shape.color}`,
              backgroundColor: 'transparent',
              filter: shape.blurAmount ? `blur(${shape.blurAmount}px)` : 'none',
              boxShadow: shape.shadowIntensity > 0 ? `0 0 ${shape.size / 3}px ${shape.shadowColor}` : 'none',
            }}
          />
        );
        
      case 'hexagon':
        // Hexagon using clip-path
        return (
          <div
            className="absolute"
            style={{
              ...commonStyle,
              clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            }}
          />
        );
        
      case 'star':
        // Star using clip-path
        return (
          <div
            className="absolute"
            style={{
              ...commonStyle,
              clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
            }}
          />
        );
        
      default:
        return null;
    }
  };

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 overflow-hidden"
      style={{ zIndex: -10 }}
    >
      {shapes.map((shape) => (
        <div
          key={shape.id}
          className="absolute origin-center"
          style={{
            left: shape.x,
            top: shape.y,
            transform: `rotate(${shape.rotation}deg)`,
            opacity: 1,
            animation: prefersReducedMotion 
              ? 'none' 
              : `float ${shape.duration}s infinite ease-in-out ${shape.delay}s, 
                 rotate ${shape.duration * 1.5}s infinite linear ${shape.delay}s, 
                 pulse ${shape.duration}s infinite ease-in-out ${shape.delay}s`,
          }}
        >
          {renderShape(shape)}
        </div>
      ))}

      {/* Enhanced keyframe animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(${shapes[0]?.rotation || 0}deg);
          }
          50% {
            transform: translateY(-30px) rotate(${(shapes[0]?.rotation || 0) + 180}deg);
          }
        }
        
        @keyframes rotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  );
};

export default ShapesBackground;