'use client';

import React from 'react';

interface ShinyTextProps {
  text: string;
  className?: string;
  speed?: string;
}

export function ShinyText({ text, className = '', speed = '3s' }: ShinyTextProps) {
  return (
    <span
      className={`inline-block bg-[linear-gradient(120deg,rgba(255,255,255,0)_20%,rgba(255,255,255,0.7)_40%,rgba(255,255,255,0.7)_60%,rgba(255,255,255,0)_80%)] dark:bg-[linear-gradient(120deg,rgba(255,255,255,0)_20%,rgba(37,99,235,0.8)_40%,rgba(124,58,237,0.8)_60%,rgba(255,255,255,0)_80%)] bg-[length:200%_auto] bg-clip-text text-transparent animate-shimmer ${className}`}
      style={{
        animationDuration: speed,
      }}
    >
      {text}
    </span>
  );
}
