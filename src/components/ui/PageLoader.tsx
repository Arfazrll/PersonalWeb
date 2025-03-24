// src/components/ui/PageLoader.tsx
import React, { useEffect, useState } from 'react';

const PageLoader: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  // Handle initial fade-in and progress animation
  useEffect(() => {
    // Set a small delay before showing to allow for transition
    const visibilityTimer = setTimeout(() => {
      setIsVisible(true);
    }, 10);

    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 - prev) / 10;
        return Math.min(newProgress, 100);
      });
    }, 100);

    return () => {
      clearTimeout(visibilityTimer);
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-white dark:bg-true-black"
      style={{
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out'
      }}
    >
      <div className="flex flex-col items-center">
        {/* Logo spinner with blue theme */}
        <div className="relative">
          <div
            className="w-16 h-16 rounded-full border-4 border-gray-200 dark:border-gray-800"
            style={{
              animation: 'spin 2s linear infinite'
            }}
          >
            <div 
              className="absolute top-0 left-1/2 w-4 h-4 -mt-1 -ml-2 rounded-full bg-primary-500 dark:bg-primary-400"
              style={{
                animation: 'pulse 1s ease-in-out infinite'
              }}
            />
          </div>
          
          {/* Center logo */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-8 h-8 rounded-full bg-white dark:bg-true-black shadow-md flex items-center justify-center"
              style={{
                animation: 'breathe 2s ease-in-out infinite'
              }}
            >
              <span className="text-xs font-bold text-primary-600 dark:text-primary-400">S</span>
            </div>
          </div>
        </div>
        
        <p
          className="mt-4 text-sm text-gray-600 dark:text-gray-400"
          style={{
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.5s ease-in-out',
            transitionDelay: '0.3s'
          }}
        >
          Loading...
        </p>
        
        {/* Loading bar with progress animation */}
        <div 
          className="mt-4 w-32 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(5px)',
            transition: 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out',
            transitionDelay: '0.3s'
          }}
        >
          <div 
            className="h-full bg-primary-500 dark:bg-primary-400 rounded-full"
            style={{
              width: `${progress}%`,
              transition: 'width 0.3s ease-out'
            }}
          />
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.2);
          }
        }

        @keyframes breathe {
          0%, 100% {
            transform: scale(0.9);
          }
          50% {
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  );
};

export default PageLoader;