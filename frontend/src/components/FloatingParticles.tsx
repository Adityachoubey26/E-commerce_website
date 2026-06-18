'use client';

import React, { useEffect, useState } from 'react';

interface Particle {
  id: number;
  size: number;
  left: number;
  delay: number;
  duration: number;
}

export const FloatingParticles: React.FC = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generate particles
    const generated = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      size: Math.random() * 8 + 4, // 4px to 12px
      left: Math.random() * 100, // 0% to 100%
      delay: Math.random() * 10, // 0s to 10s
      duration: Math.random() * 20 + 15 // 15s to 35s
    }));
    setParticles(generated);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute bottom-[-20px] rounded-full bg-primary/10 dark:bg-white/5 blur-[1px]"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: `${p.left}%`,
            animationName: 'floatUp',
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            animationIterationCount: 'infinite',
            animationTimingFunction: 'linear'
          }}
        />
      ))}
      <style jsx global>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-110vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
