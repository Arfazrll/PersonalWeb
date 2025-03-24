import React, { useEffect, useState } from 'react';
// Remove the useTheme import since we're not using it
// import { useTheme } from 'next-themes';

const SplashScreen: React.FC = () => {
  const [animationComplete, setAnimationComplete] = useState(false);
  
  // Disable body scroll when splash screen is shown
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    // Start exit animation after 2 seconds
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 2500);
    
    return () => {
      document.body.style.overflow = '';
      clearTimeout(timer);
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-white dark:bg-secondary-950 transition-opacity duration-800 ease-out ${
        animationComplete ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)'
      }}
    >
      <div className="flex flex-col items-center">
        {/* Logo Animation */}
        <div
          className="w-24 h-24 mb-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center relative"
          style={{
            animation: 'logo-entrance 1.2s ease-out forwards, logo-wobble 5s ease-in-out infinite',
            opacity: 0,
            transform: 'scale(0.5)'
          }}
        >
          <span 
            className="text-3xl font-bold text-white"
            style={{
              animation: 'content-fade-in 0.6s ease-out forwards',
              animationDelay: '0.4s',
              opacity: 0,
              transform: 'scale(0)'
            }}
          >
            SA
          </span>
          
          {/* Orbiting dot */}
          <div 
            className="absolute w-3 h-3 rounded-full bg-white"
            style={{
              top: '-5%',
              left: '50%',
              transform: 'translateX(-50%)',
              transformOrigin: '50% 50%',
              animation: 'orbit 2s linear infinite'
            }}
          />
        </div>
        
        {/* Text Animation */}
        <div
          className="text-center"
          style={{
            animation: 'move-up 0.8s ease-out forwards',
            animationDelay: '0.5s',
            opacity: 0,
            transform: 'translateY(20px)'
          }}
        >
          <h1 
            className="text-2xl md:text-3xl font-bold mb-2"
            style={{
              animation: 'content-fade-in 0.5s ease-out forwards',
              animationDelay: '0.8s',
              opacity: 0
            }}
          >
            <span className="text-primary-600 dark:text-primary-500">Syahril</span>
            <span className="text-secondary-900 dark:text-white">.dev</span>
          </h1>
          
          <p 
            className="text-sm text-secondary-600 dark:text-secondary-400"
            style={{
              animation: 'content-fade-in 0.5s ease-out forwards',
              animationDelay: '1.1s',
              opacity: 0
            }}
          >
            AI & Big Data Enthusiast
          </p>
        </div>
        
        {/* Loading indicator */}
        <div 
          className="mt-8 relative w-40 h-1 bg-secondary-200 dark:bg-secondary-800 rounded-full overflow-hidden"
          style={{
            animation: 'content-fade-in 0.5s ease-out forwards',
            animationDelay: '1s',
            opacity: 0
          }}
        >
          <div 
            className="absolute top-0 left-0 h-full bg-primary-600 dark:bg-primary-500 rounded-full"
            style={{
              animation: 'loading-progress 1.5s ease-in-out forwards',
              width: '0%'
            }}
          />
        </div>
      </div>
      
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Top right circle */}
        <div 
          className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-primary-500/10 dark:bg-primary-500/5"
          style={{
            animation: 'scale-in 1.5s ease-out forwards',
            transform: 'scale(0)'
          }}
        />
        
        {/* Bottom left circle */}
        <div 
          className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-accent-500/10 dark:bg-accent-500/5"
          style={{
            animation: 'scale-in 1.5s ease-out forwards',
            animationDelay: '0.3s',
            transform: 'scale(0)'
          }}
        />
        
        {/* Small decorative dots */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-primary-500/30 dark:bg-primary-500/20"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: 'content-fade-in 0.8s ease-out forwards',
              animationDelay: `${0.5 + Math.random() * 1.5}s`,
              opacity: 0
            }}
          />
        ))}
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes logo-entrance {
          0% {
            opacity: 0;
            transform: scale(0.5);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes logo-wobble {
          0%, 100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(10deg);
          }
          50% {
            transform: rotate(0deg);
          }
          75% {
            transform: rotate(-10deg);
          }
        }
        
        @keyframes content-fade-in {
          0% {
            opacity: 0;
            transform: scale(0);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes move-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes loading-progress {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }
        
        @keyframes orbit {
          0% {
            transform: translateX(-50%) rotate(0deg) translateY(-40px) rotate(0deg);
          }
          100% {
            transform: translateX(-50%) rotate(360deg) translateY(-40px) rotate(-360deg);
          }
        }
        
        @keyframes scale-in {
          0% {
            transform: scale(0);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;