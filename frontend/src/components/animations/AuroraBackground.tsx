'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface AuroraBackgroundProps {
  children?: React.ReactNode;
  className?: string;
}

export function AuroraBackground({ children, className = '' }: AuroraBackgroundProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Background aurora blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30 dark:opacity-40">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-blue-500 blur-[120px] mix-blend-screen"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.1],
            x: [0, -40, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-[30%] -right-[10%] w-[50%] h-[50%] rounded-full bg-purple-500 blur-[130px] mix-blend-screen"
        />
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            x: [0, 30, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -bottom-[10%] left-[20%] w-[55%] h-[55%] rounded-full bg-emerald-500 blur-[120px] mix-blend-screen"
        />
      </div>
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}
