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
    
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
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