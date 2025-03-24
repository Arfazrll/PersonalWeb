import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiLinkedin, FiGithub, FiMail, FiDownload } from 'react-icons/fi';
import Button from '../ui/Button';
import { personalInfo } from '@/utils/data';

const Hero = () => {
  const [typedText, setTypedText] = useState('');
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);

  const phrases = useMemo(() => [
    'AI & Big Data Enthusiast',
    'Technology Innovator',
    'Problem Solver',
    'Aspiring Developer'
  ], []);

  useEffect(() => {
    const currentPhrase = phrases[currentPhraseIndex];
    
    // Handle the typing effect
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

  return (
    <section id="home" className="pt-32 pb-20 min-h-screen flex items-center relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 -z-10 w-1/2 h-1/2 bg-primary-100/50 dark:bg-primary-900/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 -z-10 w-1/2 h-1/2 bg-accent-100/30 dark:bg-accent-900/10 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>
      
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Content */}
          <motion.div 
            className="lg:col-span-7"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-6">
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold"
                animate={{ opacity: 1 }}
                initial={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
              >
                <span className="text-secondary-900 dark:text-white">Hi, I&apos;m </span>
                <span className="text-gradient">Syahril Arfian</span>
              </motion.h1>
              
              <motion.h2 
                className="text-2xl md:text-3xl font-medium text-secondary-700 dark:text-secondary-300 h-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                <span>{personalInfo.title}</span>
                <div className="mt-2 h-8">
                  <span className="text-primary-600 dark:text-primary-400">{typedText}</span>
                  <span className="inline-block w-0.5 h-6 bg-primary-600 dark:bg-primary-400 ml-1 animate-pulse"></span>
                </div>
              </motion.h2>
              
              <motion.p 
                className="text-lg text-secondary-600 dark:text-secondary-400 max-w-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                {personalInfo.about.split('.')[0] + '.'}
              </motion.p>
              
              <motion.div 
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                <Button 
                  href="#contact" 
                  variant="primary"
                  icon={<FiMail width={20} height={20} />}
                >
                  Get In Touch
                </Button>
                
                <Button 
                  href={personalInfo.resumeLink} 
                  variant="outline"
                  icon={<FiDownload width={20} height={20} />}
                  download={true}
                  isExternal={true}
                >
                  Download CV
                </Button>
              </motion.div>
              
              <motion.div 
                className="flex items-center gap-4 mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
              >
                <a 
                  href={personalInfo.socialLinks.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-secondary-100 dark:bg-secondary-800 text-secondary-600 dark:text-secondary-400 hover:bg-primary-100 hover:text-primary-600 dark:hover:bg-primary-900/20 dark:hover:text-primary-400 transition-colors"
                  aria-label="LinkedIn"
                >
                  <FiLinkedin width={20} height={20} />
                </a>
                
                <a 
                  href={personalInfo.socialLinks.github}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-secondary-100 dark:bg-secondary-800 text-secondary-600 dark:text-secondary-400 hover:bg-primary-100 hover:text-primary-600 dark:hover:bg-primary-900/20 dark:hover:text-primary-400 transition-colors"
                  aria-label="GitHub"
                >
                  <FiGithub width={20} height={20} />
                </a>
                
                <a 
                  href={`mailto:${personalInfo.email}`}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-secondary-100 dark:bg-secondary-800 text-secondary-600 dark:text-secondary-400 hover:bg-primary-100 hover:text-primary-600 dark:hover:bg-primary-900/20 dark:hover:text-primary-400 transition-colors"
                  aria-label="Email"
                >
                  <FiMail width={20} height={20} />
                </a>
              </motion.div>
            </div>
          </motion.div>
          
          {/* Profile Image */}
          <motion.div 
            className="lg:col-span-5"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="relative">
              <div className="w-full max-w-md mx-auto aspect-square rounded-full bg-gradient-to-br from-primary-500 to-accent-500 p-1.5">
                <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-secondary-900 p-3">
                  <div className="w-full h-full rounded-full overflow-hidden relative bg-secondary-100 dark:bg-secondary-800">
                    <div className="absolute inset-0 rounded-full overflow-hidden">
                      {/* Replace with your actual profile image */}
                      <div className="w-full h-full bg-gradient-to-br from-primary-500/30 to-accent-500/30 flex items-center justify-center">
                        <span className="text-6xl font-bold text-primary-700 dark:text-primary-300">SA</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating badges */}
              <motion.div 
                className="absolute top-5 -right-4 bg-white dark:bg-secondary-800 p-3 rounded-lg shadow-lg max-w-[140px]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                whileHover={{ y: -5, scale: 1.05 }}
              >
                <span className="text-xs text-secondary-500 dark:text-secondary-400">Specializing in</span>
                <h3 className="font-semibold text-secondary-900 dark:text-white">AI & Big Data</h3>
              </motion.div>
              
              <motion.div 
                className="absolute -bottom-2 -left-4 bg-white dark:bg-secondary-800 p-3 rounded-lg shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.6 }}
                whileHover={{ y: -5, scale: 1.05 }}
              >
                <span className="text-xs text-secondary-500 dark:text-secondary-400">Achievement</span>
                <h3 className="font-semibold text-secondary-900 dark:text-white">Top 15 in Data Mining ADIKARA 2024</h3>
              </motion.div>
            </div>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: 1.6, 
            duration: 0.8,
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        >
          <div className="flex flex-col items-center">
            <span className="text-sm text-secondary-500 dark:text-secondary-400 mb-2">Scroll Down</span>
            <div className="w-6 h-10 border-2 border-secondary-400 dark:border-secondary-600 rounded-full flex justify-center">
              <motion.div 
                className="w-1.5 h-1.5 bg-secondary-600 dark:bg-secondary-400 rounded-full mt-1.5"
                initial={{ y: 0 }}
                animate={{ 
                  y: 15
                }}
                transition={{ 
                  duration: 0.75,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;