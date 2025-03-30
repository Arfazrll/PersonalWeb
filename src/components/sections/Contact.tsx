import { useState, FormEvent, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiMapPin, FiLinkedin, FiGithub, FiSend, FiUser, FiMessageSquare, FiInfo } from 'react-icons/fi';
import { personalInfo } from '@/utils/data';
import Card from '../ui/Card';
import { useTheme } from 'next-themes';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

const Contact = () => {
  // Theme and preferences
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const prefersReducedMotion = usePrefersReducedMotion();
  
  // Section visibility ref
  const sectionRef = useRef<HTMLDivElement>(null);
  
  // Mouse position for interactive gradient effect
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Animation visibility states
  const [headerVisible, setHeaderVisible] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false);

  // Handle mouse movement for gradient effect
  useEffect(() => {
    if (prefersReducedMotion) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [prefersReducedMotion]);

  // Setup intersection observers for animation triggers
  useEffect(() => {
    // Observer for section header
    const headerElement = document.getElementById('contact-header');
    if (headerElement) {
      const headerObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setHeaderVisible(true);
            headerObserver.disconnect();
          }
        },
        { threshold: 0.2, rootMargin: '0px' }
      );
      
      headerObserver.observe(headerElement);
      
      // Cleanup
      return () => headerObserver.disconnect();
    }
  }, []);
  
  useEffect(() => {
    // Observer for contact info section
    const infoElement = document.getElementById('contact-info');
    if (infoElement) {
      const infoObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setInfoVisible(true);
            infoObserver.disconnect();
          }
        },
        { threshold: 0.2, rootMargin: '0px' }
      );
      
      infoObserver.observe(infoElement);
      
      // Cleanup
      return () => infoObserver.disconnect();
    }
  }, []);
  
  useEffect(() => {
    // Observer for contact form section
    const formElement = document.getElementById('contact-form');
    if (formElement) {
      const formObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setFormVisible(true);
            formObserver.disconnect();
          }
        },
        { threshold: 0.2, rootMargin: '0px' }
      );
      
      formObserver.observe(formElement);
      
      // Cleanup
      return () => formObserver.disconnect();
    }
  }, []);

  // Form handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 5000);
    } catch {
      setError('There was an error sending your message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Animation variants
  const contactInfoVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.5 }
    }
  };

  const formVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.5, delay: 0.2 }
    }
  };

  const inputVariants = {
    focus: { scale: 1.01, y: -2, boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)" }
  };

  return (
    <section 
      id="contact" 
      ref={sectionRef}
      className="py-20 bg-white dark:bg-true-black relative overflow-hidden"
    >
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 z-0">
        {/* Tech Network Grid */}
        <div className={`tech-grid ${isDark ? 'tech-grid-dark' : 'tech-grid-light'}`}></div>
        
        {/* Animated particles */}
        <div className="particles-container">
          {Array.from({ length: 20 }).map((_, index) => (
            <div 
              key={index}
              className={`particle ${isDark ? 'bg-blue-500' : 'bg-blue-600'}`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 6 + 3}px`,
                height: `${Math.random() * 6 + 3}px`,
                opacity: isDark ? Math.random() * 0.5 + 0.1 : Math.random() * 0.3 + 0.1,
                animationDuration: `${Math.random() * 15 + 15}s`,
                animationDelay: `${Math.random() * 5}s`
              }}
            />
          ))}
        </div>
        
        {/* Digital rain effect */}
        <div className={`digital-rain ${isDark ? 'digital-rain-dark' : 'digital-rain-light'}`}>
          {Array.from({ length: 10 }).map((_, index) => (
            <div 
              key={index} 
              className="rain-column"
              style={{
                left: `${(index * 10) + Math.random() * 5}%`,
                animationDuration: `${Math.random() * 10 + 10}s`,
                animationDelay: `${Math.random() * 5}s`
              }}
            ></div>
          ))}
        </div>
        
        {/* Interactive gradient overlay that follows mouse */}
        <div 
          className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
          style={{
            background: `radial-gradient(circle 400px at ${mousePosition.x}px ${mousePosition.y}px, 
              ${isDark ? 'rgba(59, 130, 246, 0.08)' : 'rgba(59, 130, 246, 0.1)'}, 
              transparent)`,
            transition: 'background 0.3s ease-out'
          }}
        ></div>
        
        {/* Animated gradient meshes */}
        <div className={`absolute top-0 left-0 w-1/3 h-1/3 rounded-full blur-3xl ${
          isDark ? 'bg-blue-900/15 animate-pulse-slow' : 'bg-blue-500/20 animate-pulse-slow'
        }`} style={{ animationDuration: '15s' }}></div>
        
        <div className={`absolute bottom-0 right-0 w-1/4 h-1/3 rounded-full blur-3xl ${
          isDark ? 'bg-purple-900/15 animate-pulse-slow' : 'bg-purple-500/20 animate-pulse-slow'
        }`} style={{ animationDuration: '20s', animationDelay: '2s' }}></div>
        
        <div className={`absolute top-1/3 right-1/4 w-1/4 h-1/4 rounded-full blur-3xl ${
          isDark ? 'bg-indigo-900/10 animate-pulse-slow' : 'bg-indigo-500/20 animate-pulse-slow'
        }`} style={{ animationDuration: '25s', animationDelay: '5s' }}></div>
        
        {/* Data stream animations */}
        <div className="data-streams">
          {Array.from({ length: 5 }).map((_, index) => (
            <div 
              key={index}
              className={`data-stream ${isDark ? 'data-stream-dark' : 'data-stream-light'}`}
              style={{
                top: `${Math.random() * 100}%`,
                left: `-50px`,
                width: `${Math.random() * 200 + 100}px`,
                height: '1px',
                animationDuration: `${Math.random() * 5 + 5}s`,
                animationDelay: `${Math.random() * 5}s`,
                transform: `rotate(${Math.random() * 20 - 10}deg)`
              }}
            ></div>
          ))}
        </div>
        
        {/* Floating message bubbles for contact theme */}
        <div className="message-bubbles">
          {Array.from({ length: 6 }).map((_, index) => (
            <div 
              key={index}
              className={`message-bubble ${isDark ? 'message-bubble-dark' : 'message-bubble-light'}`}
              style={{
                top: `${Math.random() * 80 + 10}%`,
                left: `${Math.random() * 80 + 10}%`,
                width: `${Math.random() * 60 + 40}px`,
                height: `${Math.random() * 30 + 20}px`,
                animationDuration: `${Math.random() * 10 + 10}s`,
                animationDelay: `${Math.random() * 5}s`
              }}
            ></div>
          ))}
        </div>
      </div>
      
      {/* Background Mesh Pattern */}
      <div 
        className="absolute inset-0 bg-mesh-pattern opacity-5 dark:opacity-5 -z-10"
        aria-hidden="true"
      ></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Title with enhanced animation */}
        <motion.div
          id="contact-header"
          initial={{ opacity: 0, y: 20 }}
          animate={headerVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-accent-500 dark:from-primary-400 dark:to-accent-400 mb-6">
            Get In Touch
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full mx-auto mt-2 opacity-70"></div>
          <p className="text-secondary-600 dark:text-secondary-400 max-w-2xl mx-auto mt-6 text-lg">
            Feel free to contact me for any project inquiries, collaboration opportunities, or just to say hello!
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Contact Info with enhanced animation */}
          <motion.div
            id="contact-info"
            variants={contactInfoVariants}
            initial="hidden"
            animate={infoVisible ? "visible" : "hidden"}
            className="lg:col-span-2"
          >
            <Card className="h-full p-6 card-glow relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-primary-500 to-accent-500 dark:from-primary-400 dark:to-accent-400 opacity-70"></div>
              <div className="absolute -left-12 -bottom-12 w-32 h-32 bg-primary-100/30 dark:bg-primary-900/10 rounded-full"></div>
            
              <h3 className="text-2xl font-bold text-secondary-900 dark:text-white mb-6">Contact Information</h3>
              
              <div className="space-y-6">
                <motion.div 
                  className="flex"
                  whileHover={{ x: 5, transition: { duration: 0.2 } }}
                >
                  <motion.div 
                    className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/30 dark:to-accent-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 mr-4 shadow-sm icon-glow"
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <FiMail size={24} />
                  </motion.div>
                  <div>
                    <h4 className="text-lg font-semibold text-secondary-900 dark:text-white">Email</h4>
                    <a 
                      href={`mailto:${personalInfo.email}`} 
                      className="text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                      {personalInfo.email}
                    </a>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex"
                  whileHover={{ x: 5, transition: { duration: 0.2 } }}
                >
                  <motion.div 
                    className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/30 dark:to-accent-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 mr-4 shadow-sm icon-glow"
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <FiMapPin size={24} />
                  </motion.div>
                  <div>
                    <h4 className="text-lg font-semibold text-secondary-900 dark:text-white">Location</h4>
                    <p className="text-secondary-600 dark:text-secondary-400">{personalInfo.location}</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex"
                  whileHover={{ x: 5, transition: { duration: 0.2 } }}
                >
                  <motion.div 
                    className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/30 dark:to-accent-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 mr-4 shadow-sm icon-glow"
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <FiLinkedin size={24} />
                  </motion.div>
                  <div>
                    <h4 className="text-lg font-semibold text-secondary-900 dark:text-white">LinkedIn</h4>
                    <a 
                      href={personalInfo.socialLinks.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                      Connect on LinkedIn
                    </a>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex"
                  whileHover={{ x: 5, transition: { duration: 0.2 } }}
                >
                  <motion.div 
                    className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/30 dark:to-accent-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 mr-4 shadow-sm icon-glow"
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <FiGithub size={24} />
                  </motion.div>
                  <div>
                    <h4 className="text-lg font-semibold text-secondary-900 dark:text-white">GitHub</h4>
                    <a 
                      href={personalInfo.socialLinks.github} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                      Follow on GitHub
                    </a>
                  </div>
                </motion.div>
              </div>
              
              <div className="mt-10 pt-6 border-t border-secondary-100 dark:border-secondary-800">
                <h4 className="text-lg font-semibold text-secondary-900 dark:text-white mb-3">Open To:</h4>
                <ul className="space-y-2 text-secondary-600 dark:text-secondary-400">
                  <motion.li 
                    className="flex items-center"
                    whileHover={{ x: 5, scale: 1.01, transition: { duration: 0.2 } }}
                  >
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    <div className="relative">
                      Internship Opportunities
                      <motion.div 
                        className="absolute bottom-0 left-0 h-0.5 bg-green-500 w-0"
                        whileHover={{ width: '100%', transition: { duration: 0.3 } }}
                      />
                    </div>
                  </motion.li>
                  <motion.li 
                    className="flex items-center"
                    whileHover={{ x: 5, scale: 1.01, transition: { duration: 0.2 } }}
                  >
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    <div className="relative">
                      Freelance Projects
                      <motion.div 
                        className="absolute bottom-0 left-0 h-0.5 bg-green-500 w-0"
                        whileHover={{ width: '100%', transition: { duration: 0.3 } }}
                      />
                    </div>
                  </motion.li>
                  <motion.li 
                    className="flex items-center"
                    whileHover={{ x: 5, scale: 1.01, transition: { duration: 0.2 } }}
                  >
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    <div className="relative">
                      Research Collaborations
                      <motion.div 
                        className="absolute bottom-0 left-0 h-0.5 bg-green-500 w-0"
                        whileHover={{ width: '100%', transition: { duration: 0.3 } }}
                      />
                    </div>
                  </motion.li>
                </ul>
              </div>
            </Card>
          </motion.div>
          
          {/* Contact Form with enhanced animation */}
          <motion.div
            id="contact-form"
            variants={formVariants}
            initial="hidden"
            animate={formVisible ? "visible" : "hidden"}
            className="lg:col-span-3"
          >
            <Card className="h-full p-6 card-glow relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-primary-500 to-accent-500 dark:from-primary-400 dark:to-accent-400 opacity-70"></div>
              <div className="absolute -right-12 -bottom-12 w-32 h-32 bg-primary-100/30 dark:bg-primary-900/10 rounded-full"></div>
              
              <h3 className="text-2xl font-bold text-secondary-900 dark:text-white mb-6">Send Me a Message</h3>
              
              {submitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 p-6 rounded-lg mb-6 shadow-md flex items-center space-x-4"
                >
                  <div className="bg-green-200 dark:bg-green-800/50 rounded-full p-3">
                    <svg 
                      className="w-8 h-8 text-green-600 dark:text-green-400" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-lg font-semibold">Thank you for your message!</p> 
                    <p>I&apos;ll get back to you as soon as possible.</p>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.3 }}
                      className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 p-4 rounded-lg shadow-sm"
                    >
                      <div className="flex items-start">
                        <FiInfo className="flex-shrink-0 w-5 h-5 mr-2 mt-0.5" />
                        <p>{error}</p>
                      </div>
                    </motion.div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <motion.div whileHover="focus" variants={inputVariants}>
                      <label htmlFor="name" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                        <div className="flex items-center">
                          <FiUser className="mr-2 text-primary-500 dark:text-primary-400" size={14} />
                          Your Name
                        </div>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-secondary-300 dark:border-secondary-700 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-sm transition-all duration-300"
                      />
                    </motion.div>
                    
                    <motion.div whileHover="focus" variants={inputVariants}>
                      <label htmlFor="email" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                        <div className="flex items-center">
                          <FiMail className="mr-2 text-primary-500 dark:text-primary-400" size={14} />
                          Your Email
                        </div>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-secondary-300 dark:border-secondary-700 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-sm transition-all duration-300"
                      />
                    </motion.div>
                  </div>
                  
                  <motion.div whileHover="focus" variants={inputVariants}>
                    <label htmlFor="subject" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                      <div className="flex items-center">
                        <FiInfo className="mr-2 text-primary-500 dark:text-primary-400" size={14} />
                        Subject
                      </div>
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-secondary-300 dark:border-secondary-700 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-sm transition-all duration-300"
                    />
                  </motion.div>
                  
                  <motion.div whileHover="focus" variants={inputVariants}>
                    <label htmlFor="message" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                      <div className="flex items-center">
                        <FiMessageSquare className="mr-2 text-primary-500 dark:text-primary-400" size={14} />
                        Message
                      </div>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 rounded-lg border border-secondary-300 dark:border-secondary-700 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none shadow-sm transition-all duration-300"
                    ></textarea>
                  </motion.div>
                  
                  <div className="text-right">
                    <motion.button
                      type="submit"
                      disabled={submitting}
                      className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center relative overflow-hidden hover-effect"
                      whileHover={{ y: -3, transition: { duration: 0.2 } }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {submitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </>
                      ) : (
                        <>
                          <FiSend className="mr-2" size={16} />
                          Send Message
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
      
      {/* CSS Animations */}
      <style jsx>{`
        /* Base animations */
        .animate-pulse-slow {
          animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .animate-float-slow {
          animation: float 4s ease-in-out infinite;
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.2);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        /* Particle system */
        .particles-container {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        
        .particle {
          position: absolute;
          border-radius: 50%;
          animation: particle-float 15s infinite ease-in-out;
          z-index: 1;
        }
        
        @keyframes particle-float {
          0% {
            transform: translateY(0) translateX(0) rotate(0);
            opacity: 0.2;
          }
          10% {
            opacity: 0.8;
          }
          50% {
            transform: translateY(-100px) translateX(50px) rotate(180deg);
          }
          90% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(0) translateX(0) rotate(360deg);
            opacity: 0.2;
          }
        }
        
        /* Tech Network Grid */
        .tech-grid {
          position: absolute;
          width: 100%;
          height: 100%;
          background-size: 40px 40px;
          opacity: 0.4;
        }
        
        .tech-grid-dark {
          background-image: radial-gradient(rgba(59, 130, 246, 0.2) 1px, transparent 1px);
        }
        
        .tech-grid-light {
          background-image: radial-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px);
        }
        
        /* Digital Rain Effect */
        .digital-rain {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        
        .rain-column {
          position: absolute;
          top: -300px;
          width: 2px;
          height: 200px;
          animation: digital-rain-fall linear infinite;
        }
        
        .digital-rain-dark .rain-column {
          background: linear-gradient(to bottom, transparent, rgba(59, 130, 246, 0.4), transparent);
        }
        
        .digital-rain-light .rain-column {
          background: linear-gradient(to bottom, transparent, rgba(59, 130, 246, 0.5), transparent);
        }
        
        @keyframes digital-rain-fall {
          0% {
            transform: translateY(-100%);
            opacity: 0;
          }
          10% {
            opacity: 0.5;
          }
          90% {
            opacity: 0.5;
          }
          100% {
            transform: translateY(1000px);
            opacity: 0;
          }
        }
        
        /* Data Streams */
        .data-streams {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        
        .data-stream {
          position: absolute;
          animation: data-stream-move linear infinite;
        }
        
        .data-stream-dark {
          background: linear-gradient(to right, transparent, rgba(59, 130, 246, 0.4), transparent);
        }
        
        .data-stream-light {
          background: linear-gradient(to right, transparent, rgba(59, 130, 246, 0.5), transparent);
        }
        
        @keyframes data-stream-move {
          0% {
            transform: translateX(-100px);
            opacity: 0;
          }
          10% {
            opacity: 0.7;
          }
          90% {
            opacity: 0.7;
          }
          100% {
            transform: translateX(2000px);
            opacity: 0;
          }
        }
        
        /* Message Bubbles */
        .message-bubbles {
          position: absolute;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
        
        .message-bubble {
          position: absolute;
          border-radius: 12px;
          animation: bubble-float infinite ease-in-out;
        }
        
        .message-bubble-dark {
          background: rgba(30, 41, 59, 0.2);
          border: 1px solid rgba(59, 130, 246, 0.1);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .message-bubble-light {
          background: rgba(241, 245, 249, 0.2);
          border: 1px solid rgba(59, 130, 246, 0.1);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }
        
        @keyframes bubble-float {
          0%, 100% {
            transform: translateY(0) translateX(0) rotate(0deg);
          }
          25% {
            transform: translateY(-20px) translateX(10px) rotate(2deg);
          }
          50% {
            transform: translateY(0) translateX(15px) rotate(0deg);
          }
          75% {
            transform: translateY(15px) translateX(5px) rotate(-2deg);
          }
        }
        
        /* Enhanced card effects */
        .card-glow {
          position: relative;
          overflow: hidden;
        }
        
        .card-glow::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(
            circle,
            rgba(59, 130, 246, 0.1) 0%,
            transparent 70%
          );
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }
        
        .card-glow:hover::after {
          opacity: 1;
        }
        
        /* Icon glow effect */
        .icon-glow {
          position: relative;
        }
        
        .icon-glow::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 50%;
          padding: 3px;
          background: linear-gradient(45deg, rgba(59, 130, 246, 0.5), rgba(147, 51, 234, 0.5));
          -webkit-mask: 
            linear-gradient(#fff 0 0) content-box, 
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .icon-glow:hover::after {
          opacity: 1;
        }
        
        /* Hover effect for buttons */
        .hover-effect {
          position: relative;
          overflow: hidden;
        }
        
        .hover-effect::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.2), transparent);
          transform: translateX(-100%);
          transition: transform 0.6s;
        }
        
        .hover-effect:hover::before {
          transform: translateX(100%);
        }
      `}</style>
    </section>
  );
};

export default Contact;