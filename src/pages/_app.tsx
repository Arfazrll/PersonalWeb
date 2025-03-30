// File: src/pages/_app.tsx
import { useEffect, useState } from 'react';
import { ThemeProvider } from 'next-themes';
import type { AppProps } from 'next/app';
import Layout from '../components/layout/Layout';
import '../styles/globals.css';

function MyApp({ Component, pageProps, router }: AppProps) {
  const [domLoaded, setDomLoaded] = useState(false);

  // Ensure we only render animations on the client
  useEffect(() => {
    setDomLoaded(true);
    
    // Force scroll to top when route changes
    const handleRouteChange = () => {
      window.scrollTo(0, 0);
    };
    
    router.events.on('routeChangeComplete', handleRouteChange);
    
    // Add this code to enforce dark mode styles
    const enforceDarkMode = () => {
      if (document.documentElement.classList.contains('dark')) {
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
          aboutSection.style.backgroundColor = '#000000';
        }
      }
    };

    // Watch for class changes on HTML element
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          enforceDarkMode();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    // Initial call
    enforceDarkMode();
    
    // Clean up function
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
      observer.disconnect();
    };
  }, [router.events]);

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={true}>
      <Layout>
        {domLoaded && (
          <Component {...pageProps} key={router.asPath} />
        )}
      </Layout>
    </ThemeProvider>
  );
}

export default MyApp;