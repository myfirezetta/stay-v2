import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

export function HeroVideo() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // If we scroll past the hero section (approx 400px), switch to PiP
      if (window.scrollY > 400) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Use framer motion layout animations to smoothly transition between the two states
  return (
    <>
      <div className="absolute inset-0 z-0 overflow-hidden" style={{ opacity: isScrolled ? 0 : 1, transition: 'opacity 0.3s ease-in-out' }}>
        <video 
          src="/hero-video.mp4" 
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover opacity-20 dark:opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-50 dark:to-slate-950" />
      </div>

      <motion.div
        layout
        initial={false}
        animate={{
          right: isScrolled ? 24 : -400,
          bottom: isScrolled ? 88 : 88, // Above the scroll to top button
          scale: isScrolled ? 1 : 0.5,
          opacity: isScrolled ? 1 : 0,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="fixed z-40 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border-4 border-white dark:border-slate-800"
        style={{ width: 280, height: 160, pointerEvents: isScrolled ? 'auto' : 'none' }}
      >
        <video 
          src="/hero-video.mp4" 
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover"
        />
      </motion.div>
    </>
  );
}
