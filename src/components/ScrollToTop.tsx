import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PawPrint } from 'lucide-react';

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button when user scrolls down 400px
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 p-3 bg-orange-500 text-white rounded-full shadow-lg shadow-orange-500/30 hover:bg-orange-600 transition-colors focus:outline-none focus:ring-4 focus:ring-orange-500/20"
          aria-label="Scroll to top"
        >
          <PawPrint className="w-6 h-6" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
