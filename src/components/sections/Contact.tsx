import { useState, FormEvent, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiMapPin, FiLinkedin, FiGithub, FiSend } from 'react-icons/fi';
import { personalInfo } from '@/utils/data';
import Card from '../ui/Card';

const Contact = () => {
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

  return (
    <section id="contact" className="py-20 bg-white dark:bg-secondary-900">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <motion.div
          id="contact-header"
          initial={{ opacity: 0, y: 20 }}
          animate={headerVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="section-title mx-auto">Get In Touch</h2>
          <p className="text-secondary-600 dark:text-secondary-400 max-w-2xl mx-auto mt-6">
            Feel free to contact me for any project inquiries, collaboration opportunities, or just to say hello!
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Contact Info */}
          <motion.div
            id="contact-info"
            initial={{ opacity: 0, x: -20 }}
            animate={infoVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2"
          >
            <Card className="h-full">
              <h3 className="text-2xl font-bold text-secondary-900 dark:text-white mb-6">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex">
                  <div className="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 mr-4">
                    <FiMail width={24} height={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-secondary-900 dark:text-white">Email</h4>
                    <a 
                      href={`mailto:${personalInfo.email}`} 
                      className="text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                      {personalInfo.email}
                    </a>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 mr-4">
                    <FiMapPin width={24} height={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-secondary-900 dark:text-white">Location</h4>
                    <p className="text-secondary-600 dark:text-secondary-400">{personalInfo.location}</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 mr-4">
                    <FiLinkedin width={24} height={24} />
                  </div>
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
                </div>
                
                <div className="flex">
                  <div className="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 mr-4">
                    <FiGithub width={24} height={24} />
                  </div>
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
                </div>
              </div>
              
              <div className="mt-10 pt-6 border-t border-secondary-100 dark:border-secondary-800">
                <h4 className="text-lg font-semibold text-secondary-900 dark:text-white mb-3">Open To:</h4>
                <ul className="space-y-2 text-secondary-600 dark:text-secondary-400">
                  <li className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    Internship Opportunities
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    Freelance Projects
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    Research Collaborations
                  </li>
                </ul>
              </div>
            </Card>
          </motion.div>
          
          {/* Contact Form */}
          <motion.div
            id="contact-form"
            initial={{ opacity: 0, x: 20 }}
            animate={formVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <Card className="h-full">
              <h3 className="text-2xl font-bold text-secondary-900 dark:text-white mb-6">Send Me a Message</h3>
              
              {submitted ? (
                <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 p-4 rounded-lg mb-6">
                  <p>Thank you for your message! I&apos;ll get back to you as soon as possible.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 p-4 rounded-lg">
                      <p>{error}</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 rounded-lg border border-secondary-300 dark:border-secondary-700 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                        Your Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 rounded-lg border border-secondary-300 dark:border-secondary-700 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 rounded-lg border border-secondary-300 dark:border-secondary-700 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-2 rounded-lg border border-secondary-300 dark:border-secondary-700 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                    ></textarea>
                  </div>
                  
                  <div className="text-right">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
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
                          <FiSend className="mr-2" width={16} height={16} />
                          Send Message
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;