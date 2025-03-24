import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { 
  FiLinkedin, 
  FiGithub, 
  FiMail, 
  FiDownload, 
  FiArrowDown, 
  FiCode, 
  FiDatabase, 
  FiCpu
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import { personalInfo } from '@/utils/data';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import useTypewriter from '@/hooks/useTypewriter';
import { useParticles } from '@/utils/particleGenerator';

// Card component for better separation of concerns
const ProfileCard = ({ isRevealed }: { isRevealed: boolean }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  
  // Setup 3D effect for the card
  useEffect(() => {
    if (prefersReducedMotion || !cardRef.current) return;
    
    const card = cardRef.current;
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const maxRotation = 8; // Reduced for more subtle effect
      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;
      
      // Calculate distance from center to determine effect intensity
      const maxDistance = Math.max(rect.width, rect.height) * 1.5;
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
      
      if (distance < maxDistance) {
        // Calculate rotation based on mouse position
        const rotationY = (distanceX / rect.width) * maxRotation;
        const rotationX = -(distanceY / rect.height) * maxRotation;
        
        card.style.transform = `
          perspective(1000px) 
          rotateX(${rotationX}deg) 
          rotateY(${rotationY}deg)
          scale3d(1.02, 1.02, 1.02)
        `;
      } else {
        // Reset transform when mouse is far away
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      }
    };
    
    const handleMouseLeave = () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    };
    
    // Use passive event listeners for better performance
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    card.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [prefersReducedMotion]);
  
  return (
    <motion.div
      className={`lg:col-span-5 profile-image-container ${isRevealed ? 'is-revealed' : ''}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: isRevealed ? 1 : 0, scale: isRevealed ? 1 : 0.9 }}
      transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
    >
      <div 
        ref={cardRef}
        className="profile-card relative w-full max-w-md mx-auto transition-all duration-300"
        style={{
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
      >
        <div className="w-full aspect-square rounded-full bg-gradient-to-br from-primary-500 to-accent-500 p-1.5 rotating-container shadow-lg dark:shadow-primary-500/20">
          <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-true-black p-3 backdrop-blur-sm">
            <div className="w-full h-full rounded-full overflow-hidden relative bg-gray-100 dark:bg-gray-800">
              <div className="absolute inset-0 rounded-full overflow-hidden flex items-center justify-center">
                {/* Profile image placeholder */}
                <div className="w-full h-full bg-gradient-to-br from-primary-500/30 to-accent-500/30 flex items-center justify-center">
                  <span 
                    className="text-7xl font-bold text-primary-700 dark:text-primary-300 animate-fade-in-up"
                    aria-label="User initials"
                  >
                    SA
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Animated orbit effect around avatar */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] rounded-full pointer-events-none">
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary-400/30 dark:border-primary-500/30 animate-spin-slow"></div>
          
          {/* Orbiting dot */}
          <div 
            className="absolute w-5 h-5 rounded-full bg-primary-500 dark:bg-primary-400 shadow-glow animate-orbit"
            style={{ 
              transformOrigin: 'center',
            }}
            aria-hidden="true"
          />
        </div>
        
        {/* Floating badges - accessible with appropriate ARIA attributes */}
        <motion.div 
          className="badge absolute top-5 right-0 bg-white dark:bg-gray-800 rounded-lg p-3 shadow-lg dark:shadow-gray-900/50"
          initial={{ opacity: 0, y: 20, x: 20 }}
          animate={{ opacity: isRevealed ? 1 : 0, y: isRevealed ? 0 : 20, x: isRevealed ? 0 : 20 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          whileHover={{ y: -5, x: 0, scale: 1.05 }}
          role="presentation"
          aria-hidden="true"
        >
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-full bg-primary-100 dark:bg-primary-900/30">
              <FiCpu className="text-primary-600 dark:text-primary-400" size={16} />
            </div>
            <div>
              <span className="text-xs text-gray-500 dark:text-gray-400 block">Specializing in</span>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">AI & Big Data</h3>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="badge absolute -bottom-2 -left-2 bg-white dark:bg-gray-800 rounded-lg p-3 shadow-lg dark:shadow-gray-900/50"
          initial={{ opacity: 0, y: 20, x: -20 }}
          animate={{ opacity: isRevealed ? 1 : 0, y: isRevealed ? 0 : 20, x: isRevealed ? 0 : -20 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          whileHover={{ y: -5, x: 0, scale: 1.05 }}
          role="presentation"
          aria-hidden="true"
        >
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-full bg-accent-100 dark:bg-accent-900/30">
              <FiDatabase className="text-accent-600 dark:text-accent-400" size={16} />
            </div>
            <div>
              <span className="text-xs text-gray-500 dark:text-gray-400 block">Achievement</span>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Top 15 in Data Mining</h3>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Skill pill component for better modularity
const SkillPill = ({ 
  icon, 
  label, 
  delay 
}: { 
  icon: React.ReactNode, 
  label: string, 
  delay: string 
}) => (
  <motion.div 
    className={`skill-pill flex items-center bg-primary-100/80 dark:bg-primary-900/30 px-4 py-2 rounded-full text-primary-700 dark:text-primary-300 shadow-sm ${delay}`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.2 }}
  >
    <span className="mr-2">{icon}</span>
    <span>{label}</span>
  </motion.div>
);

// Background particles component
const ParticleBackground = ({ 
  particles 
}: { 
  particles: Array<{ 
    id: number, 
    x: string, 
    y: string, 
    size: number, 
    color: string, 
    speed: number,
    delay: number
  }> 
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  
  return (
    <div className="absolute inset-0 overflow-hidden -z-10">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: particle.x,
            top: particle.y,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            animation: prefersReducedMotion 
              ? 'none' 
              : `floatParticle ${particle.speed * 10}s infinite linear, 
                 pulseParticle ${particle.speed * 6}s infinite ease-in-out ${particle.delay}s`,
          }}
          aria-hidden="true"
        />
      ))}
    </div>
  );
};

// Main Hero component
const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Enhanced typing phrases with emojis and tech specifics
  const phrases = useMemo(() => [
    'AI & Big Data Enthusiast ✨',
    'Machine Learning Engineer 🤖',
    'Python Developer 🐍',
    'Technology Innovator 💡',
    'Data Science Explorer 📊'
  ], []);

  // Custom hook for typewriter effect
  const { text: typedText } = useTypewriter({
    phrases,
    typingSpeed: 70,
    deletingSpeed: 30,
    pauseDuration: 1500
  });

  // Custom hook for generating particles
  const particles = useParticles(prefersReducedMotion ? 10 : 25, prefersReducedMotion);

  // Intersection observer for reveal animations
  useEffect(() => {
    if (prefersReducedMotion) {
      setIsRevealed(true);
      return;
    }
    
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
  }, [prefersReducedMotion]);

  // Detect scroll for scroll indicator animation with debounce
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const handleScroll = () => {
      // Clear existing timeout to debounce the function
      clearTimeout(timeoutId);
      
      // Set a new timeout
      timeoutId = setTimeout(() => {
        setHasScrolled(window.scrollY > 10);
      }, 50); // 50ms debounce
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  // Scroll smoothly to About section
  const scrollToAbout = useCallback(() => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <section 
      id="home" 
      ref={heroRef}
      className={`min-h-screen flex items-center relative overflow-hidden pt-24 pb-12 bg-white dark:bg-true-black`}
      aria-labelledby="hero-heading"
    >
      {/* Animated Particle Background */}
      <ParticleBackground particles={particles} />
      
      {/* Background Gradients */}
      <div 
        className="absolute top-0 right-0 -z-10 w-1/2 h-1/2 bg-primary-400/10 dark:bg-primary-600/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"
        aria-hidden="true"
      ></div>
      <div 
        className="absolute bottom-0 left-0 -z-10 w-1/2 h-1/2 bg-accent-400/10 dark:bg-accent-600/10 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3"
        aria-hidden="true"
      ></div>
      
      {/* Background Mesh Pattern */}
      <div 
        className="absolute inset-0 bg-mesh-pattern opacity-5 dark:opacity-5 -z-10"
        aria-hidden="true"
      ></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Content */}
          <motion.div
            className={`lg:col-span-7 content-area ${isRevealed ? 'is-revealed' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isRevealed ? 1 : 0, y: isRevealed ? 0 : 20 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="space-y-6">
              <h1 id="hero-heading" className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-gray-900 dark:text-white block">Hi, I&apos;m </span>
                <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-accent-500 dark:from-primary-400 dark:to-accent-400">
                  Syahril Arfian
                </span>
              </h1>
              
              <h2 className="text-2xl md:text-3xl font-medium text-gray-700 dark:text-gray-300">
                <span>{personalInfo.title}</span>
                <div className="mt-2 h-10 flex items-center" aria-live="polite">
                  <span className="text-primary-600 dark:text-primary-400">{typedText}</span>
                  <span className="inline-block w-0.5 h-6 bg-primary-600 dark:text-primary-400 ml-1 animate-blink" aria-hidden="true"></span>
                </div>
              </h2>
              
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
                {personalInfo.about.split('.')[0] + '.'}
              </p>
              
              <div className="flex flex-wrap gap-4 pt-2">
                <Button 
                  href="#contact" 
                  variant="primary"
                  icon={<FiMail size={20} />}
                  className="group hover-effect relative overflow-hidden"
                  aria-label="Contact me via email"
                >
                  <span className="relative z-10">
                    Get In Touch
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white dark:bg-white group-hover:w-full transition-all duration-300"></span>
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-500 dark:from-primary-500 dark:to-primary-400 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></span>
                </Button>
                
                <Button 
                  href={personalInfo.resumeLink} 
                  variant="outline"
                  icon={<FiDownload size={20} />}
                  download={true}
                  isExternal={true}
                  className="group relative overflow-hidden"
                  aria-label="Download CV"
                >
                  <span className="relative z-10">
                    Download CV
                  </span>
                  <span className="absolute inset-0 bg-primary-50 dark:bg-primary-900/30 transform -translate-y-full group-hover:translate-y-0 transition-transform duration-500"></span>
                </Button>
              </div>
              
              <div className="flex items-center gap-4 mt-6">
                <motion.a 
                  href={personalInfo.socialLinks.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-icon-wrapper"
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="LinkedIn Profile"
                >
                  <div className="social-icon">
                    <FiLinkedin size={20} />
                  </div>
                </motion.a>
                
                <motion.a 
                  href={personalInfo.socialLinks.github}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-icon-wrapper"
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="GitHub Profile"
                >
                  <div className="social-icon">
                    <FiGithub size={20} />
                  </div>
                </motion.a>
                
                <motion.a 
                  href={`mailto:${personalInfo.email}`}
                  className="social-icon-wrapper"
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Email Me"
                >
                  <div className="social-icon">
                    <FiMail size={20} />
                  </div>
                </motion.a>
              </div>

              {/* Skill Pills with Icons */}
              <div className="flex flex-wrap gap-4 mt-8">
                <SkillPill 
                  icon={<FiCode size={16} />}
                  label="Python" 
                  delay="delay-100"
                />
                
                <SkillPill 
                  icon={<FiDatabase size={16} />}
                  label="Big Data" 
                  delay="delay-200"
                />
                
                <SkillPill 
                  icon={<FiCpu size={16} />}
                  label="Machine Learning" 
                  delay="delay-300"
                />
              </div>
            </div>
          </motion.div>
          
          {/* Profile Image Card with 3D Effect */}
          <ProfileCard isRevealed={isRevealed} />
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: hasScrolled ? 0 : 1, y: hasScrolled ? 10 : 0 }}
          transition={{ duration: 0.3 }}
          aria-hidden="true"
        >
          <span className="text-sm text-gray-500 dark:text-gray-400 mb-2 animate-bounce-slow">
            Scroll Down
          </span>
          <button 
            onClick={scrollToAbout}
            className="w-10 h-10 rounded-full border-2 border-gray-300 dark:border-gray-700 flex items-center justify-center hover:border-primary-500 dark:hover:border-primary-400 transition-colors duration-300"
            aria-label="Scroll to About section"
          >
            <FiArrowDown className="text-gray-400 dark:text-gray-500" size={18} />
          </button>
        </motion.div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        .animated-gradient {
          background-size: 200% 200%;
          animation: gradientShift 8s linear infinite;
        }
        
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .rotating-container {
          animation: gentleRotate 10s ease-in-out infinite alternate;
        }
        
        @keyframes gentleRotate {
          0% { transform: rotate(0deg); }
          25% { transform: rotate(5deg); }
          50% { transform: rotate(0deg); }
          75% { transform: rotate(-5deg); }
          100% { transform: rotate(0deg); }
        }
        
        @keyframes floatParticle {
          0% { transform: translate(0, 0); }
          25% { transform: translate(10px, 10px); }
          50% { transform: translate(0, 20px); }
          75% { transform: translate(-10px, 10px); }
          100% { transform: translate(0, 0); }
        }
        
        @keyframes pulseParticle {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.2; transform: scale(1.1); }
        }
        
        .animate-blink {
          animation: blink 1s step-end infinite;
        }
        
        @keyframes blink {
          from, to { opacity: 1; }
          50% { opacity: 0; }
        }
        
        .hover-effect {
          position: relative;
          overflow: hidden;
        }

        /* Animation for the orbiting dot */
        @keyframes orbit {
          0% {
            transform: translateX(-50%) rotate(0deg) translateY(-40px) rotate(0deg);
          }
          100% {
            transform: translateX(-50%) rotate(360deg) translateY(-40px) rotate(-360deg);
          }
        }

        .animate-orbit {
          animation: orbit 8s linear infinite;
        }

        /* Animation for the spinning orbit circle */
        @keyframes spin-slow {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .animate-spin-slow {
          animation: spin-slow 40s linear infinite;
        }

        /* Animation for the bouncing scroll text */
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }

        /* Animation for the fading in up effect */
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default Hero;