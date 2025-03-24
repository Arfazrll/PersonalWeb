import Head from 'next/head';
import { useEffect } from 'react';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Experience from '@/components/sections/Experience';
import Education from '@/components/sections/Education';
import Skills from '@/components/sections/Skills';
import Projects from '@/components/sections/Projects';
import Contact from '@/components/sections/Contact';
import { personalInfo } from '@/utils/data';

export default function Home() {
  // Force scroll to top on initial load
  useEffect(() => {
    // Reset scroll position to top on initial load
    window.scrollTo(0, 0);
    
    // Smooth scroll to section when clicking on nav links
    const handleNavLinkClick = (event: MouseEvent) => {
      const target = event.target as HTMLAnchorElement;
      
      if (target.hash && target.hash.startsWith('#')) {
        event.preventDefault();
        
        const section = document.querySelector(target.hash);
        if (section) {
          window.scrollTo({
            top: section.getBoundingClientRect().top + window.scrollY - 80, // Offset for fixed header
            behavior: 'smooth'
          });
          
          // Update URL but without scrolling
          window.history.pushState(null, '', target.hash);
        }
      }
    };
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', handleNavLinkClick as EventListener);
    });
    
    return () => {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.removeEventListener('click', handleNavLinkClick as EventListener);
      });
    };
  }, []);

  return (
    <>
      <Head>
        <title>{personalInfo.name} | {personalInfo.title}</title>
        <meta name="description" content={personalInfo.about.split('.')[0]} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main className="bg-white dark:bg-true-black text-gray-900 dark:text-white">
        <Hero />
        <About />
        <Experience />
        <Education />
        <Skills />
        <Projects />
        <Contact />
      </main>
    </>
  );
}