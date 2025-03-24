// src/components/layout/Layout.tsx
import { useEffect, ReactNode, useState } from 'react';
import { useRouter } from 'next/router';
import Header from './Header';
import Footer from './Footer';
import CustomCursor from '../ui/CustomCursor';
import ParticleBackground from '../effects/ParticleBackground';
import ScrollToTop from '../ui/ScrollToTop';
import PageLoader from '../ui/PageLoader';
import { useScrollIndicator } from '@/hooks/useScrollIndicator';
import SplashScreen from '../ui/SplashScreen';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const [pageTransition, setPageTransition] = useState(false);
  const router = useRouter();
  const { scrollPercentage } = useScrollIndicator();
  const [routeKey, setRouteKey] = useState(router.asPath);

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
    
    // Force scroll to top initially
    window.scrollTo(0, 0);
    
    // Check if user has visited before
    const hasVisited = sessionStorage.getItem('hasVisited');
    if (hasVisited) {
      setShowSplash(false);
      setTimeout(() => setLoading(false), 500);
    } else {
      // Set splash screen timer
      setTimeout(() => {
        setShowSplash(false);
        sessionStorage.setItem('hasVisited', 'true');
        setTimeout(() => setLoading(false), 500);
      }, 2000);
    }
  }, []);

  // Add scroll detection for header effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Handle route change start
  useEffect(() => {
    const handleStart = () => {
      setLoading(true);
      setPageTransition(true);
      setRouteKey(router.asPath);
      // Critical: Force scroll to top on route changes
      window.scrollTo(0, 0);
    };
    
    const handleComplete = () => {
      setTimeout(() => {
        setLoading(false);
        setPageTransition(false);
      }, 500);
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  // Smooth scrolling for anchor links
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLAnchorElement;
      
      if (target.hash && target.pathname === window.location.pathname) {
        e.preventDefault();
        
        const targetElement = document.querySelector(target.hash);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.getBoundingClientRect().top + window.scrollY - 80,
            behavior: 'smooth'
          });
          
          // Update URL but without scrolling
          window.history.pushState(null, '', target.hash);
        }
      }
    };
    
    document.addEventListener('click', handleAnchorClick);
    
    return () => {
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  // Prefetch route data for smoother transitions
  useEffect(() => {
    router.prefetch('/');
  }, [router]);

  return (
    <>
      {/* Splash Screen with CSS transition */}
      {showSplash && <SplashScreen />}

      {/* Page Loader with CSS transition */}
      {loading && !showSplash && <PageLoader />}

      {/* Custom Cursor */}
      {mounted && <CustomCursor />}

      {/* Particle Background */}
      {mounted && <ParticleBackground />}

      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-transparent z-[9999]">
        <div 
          className="h-full bg-primary-600 dark:bg-primary-400 transition-all duration-300 ease-out"
          style={{ width: `${scrollPercentage}%` }}
        />
      </div>

      <div className="flex flex-col min-h-screen">
        <Header scrolled={scrolled} />
        
        <main className="flex-grow relative">
          {mounted && !loading && (
            <div
              key={routeKey}
              className={`${pageTransition ? 'opacity-0 -translate-y-4' : 'opacity-100 translate-y-0'}`}
              style={{ 
                transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)' 
              }}
            >
              {children}
            </div>
          )}
        </main>
        
        <Footer />
      </div>

      {/* Scroll to Top Button */}
      <ScrollToTop />

      {/* Add global styles for transitions */}
      <style jsx global>{`
        .page-transition-enter {
          opacity: 0;
          transform: translateY(10px);
        }
        .page-transition-enter-active {
          opacity: 1;
          transform: translateY(0);
          transition: opacity 300ms, transform 300ms;
        }
        .page-transition-exit {
          opacity: 1;
          transform: translateY(0);
        }
        .page-transition-exit-active {
          opacity: 0;
          transform: translateY(-10px);
          transition: opacity 300ms, transform 300ms;
        }
      `}</style>
    </>
  );
};

export default Layout;