import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiLinkedin, FiGithub, FiMail, FiChevronUp } from 'react-icons/fi';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const year = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-secondary-900 border-t border-secondary-200 dark:border-secondary-800 pt-12 pb-6">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 md:mb-0"
          >
            <Link href="/" className="text-2xl font-bold">
              <span className="text-primary-600 dark:text-primary-500">
                Syahril
              </span>
              <span className="text-secondary-900 dark:text-white">
                .dev
              </span>
            </Link>
            <p className="mt-2 text-secondary-600 dark:text-secondary-400 max-w-md">
              Information Technology Student | AI & Big Data Enthusiast | 
              Passionate About Technology for Business Growth
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col md:flex-row md:items-center gap-4"
          >
            <div className="flex space-x-4">
              <a 
                href="https://www.linkedin.com/in/syahril-arfianalmazril-215a12231" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-secondary-100 dark:bg-secondary-800 text-secondary-600 dark:text-secondary-400 hover:bg-primary-100 hover:text-primary-600 dark:hover:bg-primary-900/20 dark:hover:text-primary-400 transition-colors"
                aria-label="LinkedIn"
              >
                <FiLinkedin width={20} height={20} />
              </a>
              <a 
                href="mailto:azril4974@gmail.com" 
                className="w-10 h-10 flex items-center justify-center rounded-full bg-secondary-100 dark:bg-secondary-800 text-secondary-600 dark:text-secondary-400 hover:bg-primary-100 hover:text-primary-600 dark:hover:bg-primary-900/20 dark:hover:text-primary-400 transition-colors"
                aria-label="Email"
              >
                <FiMail width={20} height={20} />
              </a>
              <a 
                href="https://github.com/syahrilarfian" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-secondary-100 dark:bg-secondary-800 text-secondary-600 dark:text-secondary-400 hover:bg-primary-100 hover:text-primary-600 dark:hover:bg-primary-900/20 dark:hover:text-primary-400 transition-colors"
                aria-label="GitHub"
              >
                <FiGithub width={20} height={20} />
              </a>
            </div>
            
            <button
              onClick={scrollToTop}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-primary-600 text-white hover:bg-primary-700 transition-colors ml-0 md:ml-4"
              aria-label="Scroll to top"
            >
              <FiChevronUp width={20} height={20} />
            </button>
          </motion.div>
        </div>
        
        <div className="pt-6 border-t border-secondary-200 dark:border-secondary-800 text-center text-sm text-secondary-600 dark:text-secondary-400">
          <p>© {year} Syahril Arfian Almazril. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;