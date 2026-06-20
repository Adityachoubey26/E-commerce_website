'use client';

import React, { useState, useEffect } from 'react';
import { ImageOff, Sparkles } from 'lucide-react';

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  wrapperClassName?: string;
  zoomOnHover?: boolean;
}

export const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  className = '',
  wrapperClassName = '',
  zoomOnHover = false,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);

  // Sync state if src changes
  useEffect(() => {
    setImageSrc(src);
    setLoading(true);
    setError(false);
  }, [src]);

  const handleLoad = () => {
    setLoading(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  // Fallback image using a beautiful gradient and a clean device outline icon
  if (error || !imageSrc) {
    return (
      <div className={`w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-slate-100 to-slate-200 dark:from-slate-900/50 dark:to-slate-800/50 border border-slate-200/50 dark:border-white/5 relative p-4 ${className}`}>
        <div className="absolute top-2 right-2 opacity-30">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
        </div>
        <ImageOff className="w-10 h-10 text-slate-400 dark:text-slate-600 mb-2 stroke-[1.5] animate-pulse" />
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 text-center line-clamp-1 px-2">
          {alt || 'Preview Unavailable'}
        </span>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full overflow-hidden select-none bg-slate-50 dark:bg-slate-950/20 ${wrapperClassName}`}>
      {/* Premium Shimmering Loading Skeleton */}
      {loading && (
        <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 animate-pulse flex items-center justify-center">
          <div className="relative w-full h-full overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>
        </div>
      )}

      {/* Actual Product Image */}
      <img
        src={imageSrc}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={`w-full h-full object-cover transition-all duration-700 ease-out ${
          loading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        } ${zoomOnHover ? 'group-hover:scale-110' : ''} ${className}`}
      />
    </div>
  );
};
