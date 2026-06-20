'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IntroLoader } from './IntroLoader';

interface IntroWrapperProps {
  children: React.ReactNode;
}

export const IntroWrapper: React.FC<IntroWrapperProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return empty shell during SSR to prevent hydration mismatch
    return <div className="opacity-0">{children}</div>;
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && (
          <IntroLoader key="intro-loader" onComplete={() => setLoading(false)} />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ 
          opacity: loading ? 0 : 1, 
          scale: loading ? 0.98 : 1 
        }}
        transition={{ 
          duration: 0.8, 
          ease: [0.16, 1, 0.3, 1], // Cubic Bezier custom ease-out
          delay: 0.1
        }}
        className="flex-1 flex flex-col min-h-full"
      >
        {children}
      </motion.div>
    </>
  );
};
