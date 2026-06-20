'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ShoppingBag } from 'lucide-react';

interface IntroLoaderProps {
  onComplete: () => void;
}

export const IntroLoader: React.FC<IntroLoaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Simulate loading progress
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setShow(false);
            setTimeout(onComplete, 800); // Allow fadeout animation to complete
          }, 600);
          return 100;
        }
        const increment = Math.random() * 12 + 6;
        return Math.min(prev + increment, 100);
      });
    }, 150);

    return () => clearInterval(timer);
  }, [onComplete]);

  // Generate particles for loader background
  const loaderParticles = Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    size: Math.random() * 6 + 2,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 2,
    duration: Math.random() * 3 + 2,
  }));

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#090D16] text-[#F8FAFC] overflow-hidden select-none"
        >
          {/* Ambient Glowing backgrounds */}
          <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[350px] h-[350px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />

          {/* Floating background particles */}
          <div className="absolute inset-0 pointer-events-none opacity-40">
            {loaderParticles.map((p) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 0.4, 0],
                  y: [0, -30, -60],
                  scale: [0.8, 1.2, 0.8]
                }}
                transition={{
                  duration: p.duration,
                  delay: p.delay,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                className="absolute rounded-full bg-primary"
                style={{
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  left: `${p.left}%`,
                  top: `${p.top}%`,
                  filter: 'blur(0.5px)'
                }}
              />
            ))}
          </div>

          <div className="relative flex flex-col items-center max-w-sm px-6 text-center space-y-8 z-10">
            {/* Logo/Icon reveal */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex items-center justify-center"
            >
              <div className="absolute inset-0 w-24 h-24 bg-gradient-to-tr from-primary to-secondary rounded-3xl blur-[20px] opacity-25 animate-pulse" />
              <div className="relative w-20 h-20 bg-gradient-to-tr from-primary to-secondary rounded-3xl flex items-center justify-center border border-white/10 shadow-2xl">
                <ShoppingBag className="w-10 h-10 text-white stroke-[1.5]" />
                <Sparkles className="absolute -top-1.5 -right-1.5 w-5 h-5 text-amber-300 animate-bounce" />
              </div>
            </motion.div>

            {/* Brand Title reveal */}
            <div className="space-y-2">
              <motion.h1
                initial={{ letterSpacing: '0.2em', opacity: 0 }}
                animate={{ letterSpacing: '0.4em', opacity: 1 }}
                transition={{ duration: 1.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="text-2xl font-black uppercase tracking-[0.4em] bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400 pl-[0.4em]"
              >
                ShopEra
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.6 }}
                className="text-[9px] font-black uppercase tracking-widest text-slate-500"
              >
                Smart Shopping Starts Here
              </motion.p>
            </div>

            {/* Glowing progress bar */}
            <div className="w-48 space-y-2">
              <div className="h-1 w-full bg-slate-800/80 rounded-full overflow-hidden relative border border-white/5 shadow-inner">
                <motion.div 
                  className="h-full bg-gradient-to-r from-primary via-secondary to-pink-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.6)]"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: 'easeInOut' }}
                />
              </div>
              <div className="flex justify-between text-[8px] font-black uppercase text-slate-500 tracking-wider">
                <span>Loading Ecosystem</span>
                <span>{Math.round(progress)}%</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
