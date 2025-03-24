import { motion } from 'framer-motion';
import { FiMapPin, FiMail, FiCalendar } from 'react-icons/fi';
import { personalInfo } from '@/utils/data';
import Card from '../ui/Card';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useEffect, useState } from 'react';

const About = () => {
  // Menggunakan hook yang sudah ada dengan benar
  const { ref, inView } = useScrollAnimation();
  
  // State untuk mengontrol animasi masing-masing bagian
  const [sectionVisible, setSectionVisible] = useState(false);
  const [aboutVisible, setAboutVisible] = useState(false);
  
  // Effect untuk deteksi section title visibility dengan Intersection Observer API
  useEffect(() => {
    // Membuat referensi ke element dengan ID section-title
    const sectionTitle = document.getElementById('section-title');
    if (!sectionTitle) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setSectionVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: '0px' }
    );
    
    observer.observe(sectionTitle);
    
    return () => {
      observer.disconnect();
    };
  }, []);
  
  // Effect untuk deteksi about content visibility dengan Intersection Observer API
  useEffect(() => {
    // Membuat referensi ke element dengan ID about-content
    const aboutContent = document.getElementById('about-content');
    if (!aboutContent) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setAboutVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: '0px' }
    );
    
    observer.observe(aboutContent);
    
    return () => {
      observer.disconnect();
    };
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section id="about" className="py-20 bg-secondary-50 dark:bg-secondary-900/30">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <motion.div
          id="section-title"
          initial={{ opacity: 0, y: 20 }}
          animate={sectionVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="section-title mx-auto">About Me</h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image and Info */}
          <motion.div
            ref={ref}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={containerVariants}
            className="space-y-8"
          >
            {/* Image */}
            <motion.div
              variants={itemVariants}
              className="relative mx-auto lg:mx-0 w-full max-w-md aspect-square rounded-2xl overflow-hidden border-8 border-white dark:border-secondary-800 shadow-xl"
            >
              <div className="w-full h-full bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center">
                <span className="text-8xl font-bold text-primary-600 dark:text-primary-400">SA</span>
              </div>
            </motion.div>

            {/* Contact Info Cards */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="flex items-center space-x-4 p-4">
                <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
                  <FiMapPin width={20} height={20} />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-secondary-500 dark:text-secondary-400">Location</h3>
                  <p className="font-medium text-secondary-900 dark:text-white">{personalInfo.location}</p>
                </div>
              </Card>

              <Card className="flex items-center space-x-4 p-4">
                <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
                  <FiMail width={20} height={20} />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-secondary-500 dark:text-secondary-400">Email</h3>
                  <p className="font-medium text-secondary-900 dark:text-white">{personalInfo.email}</p>
                </div>
              </Card>

              <Card className="flex items-center space-x-4 p-4 sm:col-span-2">
                <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
                  <FiCalendar width={20} height={20} />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-secondary-500 dark:text-secondary-400">Experience</h3>
                  <p className="font-medium text-secondary-900 dark:text-white">Data & Technology Enthusiast</p>
                </div>
              </Card>
            </motion.div>
          </motion.div>

          {/* About Text */}
          <motion.div
            id="about-content"
            initial={{ opacity: 0, y: 20 }}
            animate={aboutVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-secondary-900 dark:text-white">
              Information Technology Student & AI/Big Data Enthusiast
            </h3>

            <div className="space-y-4 text-secondary-700 dark:text-secondary-300">
              <p>
                {personalInfo.about}
              </p>
              <p>
                In addition, I am pursuing certifications in Machine Learning and Data Analysis, reflecting my commitment to continuous learning and staying at the forefront of technological advancements. I am eager to explore opportunities that allow me to apply my expertise, expand my knowledge, and contribute meaningfully to the technology industry.
              </p>
            </div>

            <div className="pt-4">
              <h4 className="text-xl font-semibold mb-3 text-secondary-900 dark:text-white">
                What I&apos;m Focusing On
              </h4>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-900/30 flex-shrink-0 flex items-center justify-center mt-1 mr-3">
                    <div className="w-2 h-2 rounded-full bg-primary-600 dark:bg-primary-400"></div>
                  </div>
                  <span className="text-secondary-700 dark:text-secondary-300">Deepening my understanding of Artificial Intelligence and Machine Learning</span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-900/30 flex-shrink-0 flex items-center justify-center mt-1 mr-3">
                    <div className="w-2 h-2 rounded-full bg-primary-600 dark:bg-primary-400"></div>
                  </div>
                  <span className="text-secondary-700 dark:text-secondary-300">Developing practical skills in Big Data Analytics and IoT systems</span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-900/30 flex-shrink-0 flex items-center justify-center mt-1 mr-3">
                    <div className="w-2 h-2 rounded-full bg-primary-600 dark:bg-primary-400"></div>
                  </div>
                  <span className="text-secondary-700 dark:text-secondary-300">Building innovative technology solutions for real-world business problems</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;