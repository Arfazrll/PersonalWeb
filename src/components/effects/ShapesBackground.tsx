import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from 'next-themes';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

interface Shape {
  id: number;
  type: 'circle' | 'square' | 'triangle' | 'donut';
  x: string;
  y: string;
  size: number;
  rotation: number;
  color: string;
  delay: number;
  duration: number;
}

const ShapesBackground: React.FC = () => {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const { theme } = useTheme();
  const prefersReducedMotion = usePrefersReducedMotion();

  // Memoize generateShapes to fix the exhaustive-deps warning
  const generateShapes = useCallback((count: number): Shape[] => {
    const newShapes: Shape[] = [];
    const shapeTypes: Array<'circle' | 'square' | 'triangle' | 'donut'> = ['circle', 'square', 'triangle', 'donut'];
    
    // Primary colors based on theme
    const primaryColor = theme === 'dark' ? '99, 102, 241' : '79, 70, 229'; // Primary RGB
    const accentColor = theme === 'dark' ? '16, 185, 129' : '10, 185, 129'; // Accent RGB
    
    for (let i = 0; i < count; i++) {
      // Randomly choose between primary and accent colors with low opacity
      const color = Math.random() > 0.7 ? primaryColor : accentColor;
      const opacity = Math.random() * 0.1 + 0.05;
      
      // Random shape type
      const type = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
      
      // Position as percentages to be responsive
      const x = `${Math.random() * 100}%`;
      const y = `${Math.random() * 100}%`;
      
      // Size range
      const size = Math.random() * 100 + 50;
      
      newShapes.push({
        id: i,
        type,
        x,
        y,
        size,
        rotation: Math.random() * 360,
        color: `rgba(${color}, ${opacity})`,
        delay: Math.random() * 5,
        duration: Math.random() * 50 + 50,
      });
    }
    
    return newShapes;
  }, [theme]);

  useEffect(() => {
    const shapeCount = prefersReducedMotion ? 5 : 12;
    const generatedShapes = generateShapes(shapeCount);
    setShapes(generatedShapes);
  }, [theme, prefersReducedMotion, generateShapes]);

  // Helper to render different shapes
  const renderShape = (shape: Shape) => {
    switch (shape.type) {
      case 'circle':
        return (
          <div 
            className="absolute rounded-full" 
            style={{
              width: shape.size,
              height: shape.size,
              backgroundColor: shape.color,
            }}
          />
        );
      case 'square':
        return (
          <div 
            className="absolute"
            style={{
              width: shape.size,
              height: shape.size,
              backgroundColor: shape.color,
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
            }}
          />
        );
      case 'donut':
        return (
          <div 
            className="absolute rounded-full border-8 border-solid"
            style={{
              width: shape.size,
              height: shape.size,
              borderColor: shape.color,
              backgroundColor: 'transparent',
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="absolute inset-0 overflow-hidden -z-10">
      {shapes.map((shape) => (
        <div
          key={shape.id}
          className="absolute origin-center"
          style={{
            left: shape.x,
            top: shape.y,
            transform: `rotate(${shape.rotation}deg)`,
            opacity: 0.8,
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

      {/* Add keyframe animations via a style tag */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(${shapes[0]?.rotation || 0}deg);
          }
          50% {
            transform: translateY(-20px) rotate(${(shapes[0]?.rotation || 0) + 180}deg);
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
            opacity: 0.5;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  );
};

export default ShapesBackground;