'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface InfiniteMarqueeProps {
  items: React.ReactNode[];
  direction?: 'left' | 'right';
  speed?: number;
  className?: string;
}

export function InfiniteMarquee({ items, direction = 'left', speed = 30, className = '' }: InfiniteMarqueeProps) {
  const isLeft = direction === 'left';
  
  return (
    <div className={`w-full overflow-hidden flex whitespace-nowrap relative ${className}`}>
      {/* Overlay masks for smooth fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-transparent to-transparent pointer-events-none z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-transparent to-transparent pointer-events-none z-10" />

      <motion.div
        animate={{
          x: isLeft ? ['0%', '-50%'] : ['-50%', '0%']
        }}
        transition={{
          ease: "linear",
          duration: speed,
          repeat: Infinity,
        }}
        className="flex gap-8 px-4 w-max"
      >
        {/* Double items to create the loop wrap effect */}
        {items.map((item, idx) => (
          <div key={`item-1-${idx}`} className="flex-shrink-0">
            {item}
          </div>
        ))}
        {items.map((item, idx) => (
          <div key={`item-2-${idx}`} className="flex-shrink-0">
            {item}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
