import { useEffect, useState, useMemo, useRef } from 'react';
import { FiLinkedin, FiGithub, FiMail, FiDownload, FiArrowDown, FiCode, FiDatabase, FiCpu } from 'react-icons/fi';
import Button from '../ui/Button';
import { personalInfo } from '@/utils/data';
import { useTheme } from 'next-themes';

const Hero = () => {
  const [typedText, setTypedText] = useState('');
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);
  const [isRevealed, setIsRevealed] = useState(false);
  // Remove unused theme variable if not needed
  const { resolvedTheme } = useTheme();
  const heroRef = useRef<HTMLDivElement>(null);

  const phrases = useMemo(() => [
    'AI & Big Data Enthusiast',
    'Technology Innovator',
    'Problem Solver',
    'Aspiring Developer'
  ], []);

  // Typing effect
  useEffect(() => {
    const currentPhrase = phrases[currentPhraseIndex];
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        setTypedText(currentPhrase.substring(0, typedText.length + 1));
        
        // If finished typing, pause and then delete
        if (typedText.length === currentPhrase.length) {
          setIsDeleting(true);
          setTypingSpeed(1500); // Pause before deleting
        }
      } else {
        // Deleting
        setTypedText(currentPhrase.substring(0, typedText.length - 1));
        
        // If finished deleting, move to next phrase
        if (typedText.length === 0) {
          setIsDeleting(false);
          setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
          setTypingSpeed(200); // Speed for typing
        }
      }
    }, typingSpeed);
    
    return () => clearTimeout(timeout);
  }, [typedText, isDeleting, currentPhraseIndex, typingSpeed, phrases]);

  // Intersection observer for reveal animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // 3D tilt card effect with vanilla JS
  const setupTiltEffect = () => {
    const card = document.querySelector('.profile-card') as HTMLElement;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const cardRect = card.getBoundingClientRect();
      const centerX = cardRect.left + cardRect.width / 2;
      const centerY = cardRect.top + cardRect.height / 2;
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      
      const rotateX = (mouseY - centerY) / 20;
      const rotateY = (centerX - mouseX) / 20;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const handleMouseLeave = () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  };

  useEffect(() => {
    // Set up tilt effect after component mounts
    const cleanup = setupTiltEffect();
    
    // Add reveal class to trigger animations when in view
    if (isRevealed && heroRef.current) {
      heroRef.current.classList.add('is-revealed');
    }
    
    return cleanup;
  }, [isRevealed]);

  // Example of using resolvedTheme to conditionally render or style elements
  const isDarkMode = resolvedTheme === 'dark';

  return (
    <section 
      id="home" 
      ref={heroRef}
      className={`pt-32 pb-20 min-h-screen flex items-center relative overflow-hidden ${isDarkMode ? 'dark-mode-section' : ''}`}
    >
      {/* Background decorative elements */}
      <div className="shapes-bg">
        <div className="shape shape-circle"></div>
        <div className="shape shape-square"></div>
        <div className="shape shape-triangle"></div>
      </div>
      
      {/* Subtle glow effect */}
      <div className="absolute top-0 right-0 -z-10 w-1/2 h-1/2 bg-primary-100/50 dark:bg-primary-900/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 -z-10 w-1/2 h-1/2 bg-accent-100/30 dark:bg-accent-900/10 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>
      
      {/* Glowing particles (simplified) */}
      <div className="glowing-particles">
        {[...Array(10)].map((_, i) => (
          <div key={i} className={`particle particle-${i+1}`}></div>
        ))}
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Content */}
          <div className={`lg:col-span-7 content-area ${isRevealed ? 'animate-slide-up' : 'opacity-0'}`}>
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                <span className="text-secondary-900 dark:text-white block">Hi, I&apos;m </span>
                <span className="text-gradient animated-gradient">
                  Syahril Arfian
                </span>
              </h1>
              
              <h2 className="text-2xl md:text-3xl font-medium text-secondary-700 dark:text-secondary-300">
                <span>{personalInfo.title}</span>
                <div className="mt-2 h-8 flex items-center">
                  <span className="text-primary-600 dark:text-primary-400">{typedText}</span>
                  <span className="inline-block w-0.5 h-6 bg-primary-600 dark:bg-primary-400 ml-1 cursor-blink"></span>
                </div>
              </h2>
              
              <p className="text-lg text-secondary-600 dark:text-secondary-400 max-w-2xl">
                {personalInfo.about.split('.')[0] + '.'}
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Button 
                  href="#contact" 
                  variant="primary"
                  icon={<FiMail width={20} height={20} />}
                  className="group hover-underline-animation"
                >
                  <span className="relative inline-block">
                    Get In Touch
                    <span className="button-underline"></span>
                  </span>
                </Button>
                
                <Button 
                  href={personalInfo.resumeLink} 
                  variant="outline"
                  icon={<FiDownload width={20} height={20} />}
                  download={true}
                  isExternal={true}
                  className="group overflow-hidden hover-underline-animation"
                >
                  <span className="relative inline-block">
                    Download CV
                    <span className="button-underline"></span>
                  </span>
                  <span className="button-shine"></span>
                </Button>
              </div>
              
              <div className="flex items-center gap-4 mt-6">
                <a 
                  href={personalInfo.socialLinks.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-icon-wrapper hover-scale"
                  aria-label="LinkedIn"
                >
                  <div className="social-icon">
                    <FiLinkedin width={20} height={20} />
                  </div>
                </a>
                
                <a 
                  href={personalInfo.socialLinks.github}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-icon-wrapper hover-scale"
                  aria-label="GitHub"
                >
                  <div className="social-icon">
                    <FiGithub width={20} height={20} />
                  </div>
                </a>
                
                <a 
                  href={`mailto:${personalInfo.email}`}
                  className="social-icon-wrapper hover-scale"
                  aria-label="Email"
                >
                  <div className="social-icon">
                    <FiMail width={20} height={20} />
                  </div>
                </a>
              </div>

              {/* Skill Pills */}
              <div className="flex flex-wrap gap-3 mt-8">
                <div className="skill-pill delay-100">
                  <FiCode className="mr-2" />
                  <span>Python</span>
                </div>
                <div className="skill-pill delay-200">
                  <FiDatabase className="mr-2" />
                  <span>Big Data</span>
                </div>
                <div className="skill-pill delay-300">
                  <FiCpu className="mr-2" />
                  <span>Machine Learning</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Profile Image */}
          <div className={`lg:col-span-5 profile-image-container ${isRevealed ? 'animate-scale-up' : 'opacity-0'}`}>
            <div className="relative profile-card">
              <div className="w-full max-w-md mx-auto aspect-square rounded-full bg-gradient-to-br from-primary-500 to-accent-500 p-1.5 rotating-container">
                <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-secondary-900 p-3 backdrop-blur-sm">
                  <div className="w-full h-full rounded-full overflow-hidden relative bg-secondary-100 dark:bg-secondary-800">
                    <div className="absolute inset-0 rounded-full overflow-hidden flex items-center justify-center">
                      {/* Profile image placeholder */}
                      <div className="w-full h-full bg-gradient-to-br from-primary-500/30 to-accent-500/30 flex items-center justify-center">
                        <span className="text-6xl font-bold text-primary-700 dark:text-primary-300 fade-in-scale">
                          SA
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Animated circle around avatar */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full rounded-full pointer-events-none rotating-border">
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary-400/30 dark:border-primary-500/30"></div>
              </div>
              
              {/* Floating badges */}
              <div className="badge badge-top-right hover-lift">
                <span className="text-xs text-secondary-500 dark:text-secondary-400">Specializing in</span>
                <h3 className="font-semibold text-secondary-900 dark:text-white">AI & Big Data</h3>
              </div>
              
              <div className="badge badge-bottom-left hover-lift">
                <span className="text-xs text-secondary-500 dark:text-secondary-400">Achievement</span>
                <h3 className="font-semibold text-secondary-900 dark:text-white">Top 15 in Data Mining ADIKARA 2024</h3>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="scroll-indicator">
          <div className="flex flex-col items-center">
            <span className="text-sm text-secondary-500 dark:text-secondary-400 mb-2 scroll-text">
              Scroll Down
            </span>
            <div className="w-6 h-10 border-2 border-secondary-400 dark:border-secondary-600 rounded-full flex justify-center">
              <div className="w-1.5 h-1.5 bg-secondary-600 dark:bg-secondary-400 rounded-full mt-1.5 scroll-dot"></div>
            </div>
          </div>
        </div>

        {/* Arrow down bounce animation */}
        <div className="arrow-down">
          <FiArrowDown 
            className="text-primary-600 dark:text-primary-400" 
            size={24} 
          />
        </div>
      </div>

      {/* Add extra styles for animations */}
      <style jsx>{`
        /* Animations for cursor blinking */
        .cursor-blink {
          animation: blink 1s infinite;
        }
        
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        
        /* Animated gradient text */
        .animated-gradient {
          background-size: 200% 200%;
          animation: gradientShift 8s linear infinite;
        }
        
        /* Rotate animation for circle */
        .rotating-border {
          animation: rotate 40s linear infinite;
        }
        
        .rotating-container {
          animation: gentleRotate 10s ease-in-out infinite alternate;
        }
        
        @keyframes rotate {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
        
        @keyframes gentleRotate {
          0% { transform: rotate(0deg); }
          25% { transform: rotate(5deg); }
          50% { transform: rotate(0deg); }
          75% { transform: rotate(-5deg); }
          100% { transform: rotate(0deg); }
        }
        
        /* Scale in animation for profile initial */
        .fade-in-scale {
          opacity: 0;
          transform: scale(0.8);
          animation: fadeInScale 0.8s 0.5s forwards;
        }
        
        @keyframes fadeInScale {
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        /* Skill pills */
        .skill-pill {
          display: flex;
          align-items: center;
          padding: 0.5rem 1rem;
          border-radius: 9999px;
          background-color: rgba(var(--color-primary-100), 1);
          color: rgba(var(--color-primary-700), 1);
          opacity: 0;
          transform: translateY(20px);
          animation: fadeInUp 0.5s forwards;
        }
        
        .dark .skill-pill {
          background-color: rgba(var(--color-primary-900), 0.3);
          color: rgba(var(--color-primary-400), 1);
        }
        
        /* Animation delays */
        .delay-100 {
          animation-delay: 0.7s;
        }
        
        .delay-200 {
          animation-delay: 0.9s;
        }
        
        .delay-300 {
          animation-delay: 1.1s;
        }
        
        /* Badges */
        .badge {
          position: absolute;
          background-color: white;
          padding: 0.75rem;
          border-radius: 0.5rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          opacity: 0;
          transform: translateY(20px);
          animation: fadeInUp 0.6s 1.2s forwards;
          transition: transform 0.3s ease;
        }
        
        .dark .badge {
          background-color: rgba(var(--color-secondary-800), 1);
        }
        
        .badge-top-right {
          top: 1.25rem;
          right: -1rem;
          max-width: 140px;
        }
        
        .badge-bottom-left {
          bottom: -0.5rem;
          left: -1rem;
        }
        
        .hover-lift:hover {
          transform: translateY(-5px) scale(1.05);
        }
        
        /* Scroll animations */
        .scroll-indicator {
          position: absolute;
          bottom: 2.5rem;
          left: 50%;
          transform: translateX(-50%);
          opacity: 0;
          animation: fadeIn 0.8s 1.6s forwards;
        }
        
        .scroll-text {
          animation: floatUpDown 1.5s infinite alternate;
        }
        
        .scroll-dot {
          animation: scrollDownDot 1.5s infinite;
        }
        
        @keyframes scrollDownDot {
          0% { transform: translateY(0); }
          100% { transform: translateY(15px); }
        }
        
        .arrow-down {
          position: absolute;
          bottom: 1rem;
          left: 50%;
          transform: translateX(-50%);
          opacity: 0;
          animation: bounceUpDown 2s 2s infinite;
        }
        
        @keyframes bounceUpDown {
          0%, 100% { transform: translate(-50%, 0); opacity: 1; }
          50% { transform: translate(-50%, 10px); opacity: 0.7; }
        }
        
        /* Reveal animations */
        .content-area, .profile-image-container {
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        
        .animate-slide-up {
          animation: slideUp 0.5s forwards;
        }
        
        .animate-scale-up {
          animation: scaleUp 0.5s 0.3s forwards;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        
        @keyframes floatUpDown {
          from { transform: translateY(0); }
          to { transform: translateY(-5px); }
        }
        
        /* Button animation */
        .button-underline {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background-color: currentColor;
          transition: width 0.3s ease;
        }
        
        .hover-underline-animation:hover .button-underline {
          width: 100%;
        }
        
        .button-shine {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg, 
            transparent, 
            rgba(255, 255, 255, 0.1), 
            transparent
          );
          transform: translateX(-100%);
          transition: transform 0.5s;
        }
        
        .hover-underline-animation:hover .button-shine {
          transform: translateX(100%);
        }
        
        /* Social icons */
        .hover-scale {
          transition: transform 0.3s ease;
        }
        
        .hover-scale:hover {
          transform: scale(1.1);
        }
        
        .hover-scale:active {
          transform: scale(0.95);
        }
        
        /* Shapes background */
        .shapes-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: -1;
        }
        
        .shape {
          position: absolute;
          opacity: 0.1;
        }
        
        .shape-circle {
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background: linear-gradient(45deg, #6366f1, #10b981);
          top: -100px;
          right: -50px;
        }
        
        .shape-square {
          width: 200px;
          height: 200px;
          background: linear-gradient(45deg, #10b981, #3b82f6);
          bottom: -50px;
          left: -50px;
          transform: rotate(30deg);
        }
        
        .shape-triangle {
          width: 0;
          height: 0;
          border-left: 150px solid transparent;
          border-right: 150px solid transparent;
          border-bottom: 250px solid rgba(99, 102, 241, 0.1);
          right: 20%;
          bottom: 20%;
        }
        
        /* Glowing particles */
        .glowing-particles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 0;
        }
        
        .particle {
          position: absolute;
          background-color: rgba(99, 102, 241, 0.3);
          border-radius: 50%;
          filter: blur(10px);
        }
        
        .dark .particle {
          background-color: rgba(99, 102, 241, 0.2);
        }
        
        .particle-1 {
          width: 20px;
          height: 20px;
          top: 20%;
          left: 10%;
          animation: floatParticle 20s linear infinite;
        }
        
        .particle-2 {
          width: 15px;
          height: 15px;
          top: 30%;
          left: 80%;
          animation: floatParticle 15s linear infinite 2s;
        }
        
        .particle-3 {
          width: 25px;
          height: 25px;
          top: 70%;
          left: 20%;
          animation: floatParticle 25s linear infinite 1s;
        }
        
        .particle-4 {
          width: 10px;
          height: 10px;
          top: 40%;
          left: 30%;
          animation: floatParticle 18s linear infinite 3s;
        }
        
        .particle-5 {
          width: 18px;
          height: 18px;
          top: 60%;
          left: 70%;
          animation: floatParticle 22s linear infinite;
        }
        
        .particle-6 {
          width: 12px;
          height: 12px;
          top: 10%;
          left: 60%;
          animation: floatParticle 19s linear infinite 2s;
        }
        
        .particle-7 {
          width: 30px;
          height: 30px;
          top: 80%;
          left: 40%;
          animation: floatParticle 30s linear infinite 1s;
        }
        
        .particle-8 {
          width: 14px;
          height: 14px;
          top: 50%;
          left: 50%;
          animation: floatParticle 17s linear infinite 3s;
        }
        
        .particle-9 {
          width: 22px;
          height: 22px;
          top: 90%;
          left: 90%;
          animation: floatParticle 24s linear infinite;
        }
        
        .particle-10 {
          width: 16px;
          height: 16px;
          top: 15%;
          left: 85%;
          animation: floatParticle 21s linear infinite 2s;
        }
        
        @keyframes floatParticle {
          0% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(50px, 50px);
          }
          50% {
            transform: translate(0, 100px);
          }
          75% {
            transform: translate(-50px, 50px);
          }
          100% {
            transform: translate(0, 0);
          }
        }
        
        /* Dark mode specific styles */
        .dark-mode-section {
          /* Additional dark mode styles if needed */
        }
      `}</style>
    </section>
  );
};

export default Hero;