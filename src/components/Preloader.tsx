import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/img/logo_nobg.webp';

export default function Preloader() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 2800);
    // Prevent scrolling during preloader
    document.body.style.overflow = 'hidden';
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-emerald-950"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          {/* Logo */}
          <motion.img
            src={logo}
            alt="De Emeralds Logo"
            className="w-24 h-24 md:w-32 md:h-32 mb-6"
            initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />

          {/* Title */}
          <motion.h1
            className="font-display text-3xl md:text-5xl text-white font-light tracking-wider text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            De Emeralds
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="font-body text-gold-500 text-sm tracking-[0.4em] uppercase mt-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            Perfect Expression
          </motion.p>

          {/* Gold line */}
          <motion.div
            className="mt-8 h-[2px] bg-gradient-to-r from-transparent via-gold-500 to-transparent"
            initial={{ width: 0 }}
            animate={{ width: 200 }}
            transition={{ delay: 1.2, duration: 1.2, ease: 'easeInOut' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
