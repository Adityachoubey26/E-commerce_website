'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { Heart, ShoppingCart, Star, GitCompare, Eye } from 'lucide-react';
import { Product } from '../../../shared/types';
import { Spotlight } from './animations/Spotlight';
import { ProductImage } from './ProductImage';

interface ProductCardProps {
  product: Product;
  onCompareSelect?: (product: Product) => void;
  isComparing?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onCompareSelect,
  isComparing = false
}) => {
  const { addToCart, toggleWishlist, isWishlisted } = useCart();
  
  const wishlisted = isWishlisted(product._id);
  const discountPercent = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <div className="group relative bg-white/70 dark:bg-slate-900/65 backdrop-blur-md rounded-3xl overflow-hidden border border-slate-200/50 dark:border-white/10 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 ease-out flex flex-col justify-between h-[420px] w-full">
      
      {/* Sleek reflective hover shine sweep */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none z-20" />

      <Spotlight radius={200} color="rgba(99, 102, 241, 0.12)" className="h-full flex flex-col justify-between">
        
        {/* Badges */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-1">
          {discountPercent > 0 && (
            <span className="bg-gradient-to-r from-rose-500 to-red-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-md uppercase tracking-wider">
              {discountPercent}% OFF
            </span>
          )}
          {product.inventory === 0 ? (
            <span className="bg-slate-800 dark:bg-slate-950 text-slate-100 text-[10px] font-black px-2.5 py-1 rounded-full shadow-md uppercase tracking-wider">
              Sold Out
            </span>
          ) : product.inventory < 5 ? (
            <span className="bg-amber-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-md uppercase tracking-wider">
              Low Stock
            </span>
          ) : null}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {/* Wishlist */}
          <button
            onClick={() => toggleWishlist(product)}
            className={`w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 shadow-md hover:scale-110 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xs border border-slate-200/50 dark:border-white/10 ${
              wishlisted
                ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/30'
                : 'text-slate-500 dark:text-slate-350 hover:text-rose-500'
            }`}
          >
            <Heart className={`w-4.5 h-4.5 ${wishlisted ? 'fill-current' : ''}`} />
          </button>

          {/* Compare */}
          {onCompareSelect && (
            <button
              onClick={() => onCompareSelect(product)}
              className={`w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 shadow-md hover:scale-110 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xs border border-slate-200/50 dark:border-white/10 ${
                isComparing
                  ? 'text-primary'
                  : 'text-slate-500 dark:text-slate-350 hover:text-primary'
              }`}
              title="Compare Product"
            >
              <GitCompare className="w-4.5 h-4.5" />
            </button>
          )}

          {/* Quick View Details Link Icon */}
          <Link
            href={`/products/${product.slug}`}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-md hover:scale-110 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xs border border-slate-200/50 dark:border-white/10 text-slate-500 dark:text-slate-350 hover:text-primary"
            title="Quick View"
          >
            <Eye className="w-4.5 h-4.5" />
          </Link>
        </div>

        {/* Image Frame with hover zoom */}
        <Link href={`/products/${product.slug}`} className="block relative h-52 overflow-hidden bg-slate-50 dark:bg-slate-950/20 border-b border-slate-100 dark:border-white/5">
          <ProductImage
            src={product.images?.[0]}
            alt={product.name}
            zoomOnHover={true}
          />
        </Link>

        {/* Info Content */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            {/* Title */}
            <Link href={`/products/${product.slug}`} className="block">
              <h3 className="text-xs sm:text-sm font-black text-slate-800 dark:text-white hover:text-primary transition-colors line-clamp-2 leading-snug">
                {product.name}
              </h3>
            </Link>

            {/* Ratings */}
            <div className="flex items-center gap-1 mt-2">
              <div className="flex items-center text-amber-500">
                <Star className="w-3.5 h-3.5 fill-current" />
              </div>
              <span className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-350 font-black">
                {product.ratings?.average ? Number(product.ratings.average).toFixed(1) : 0}
              </span>
              <span className="text-[9px] text-slate-400 dark:text-slate-400 font-semibold">
                ({product.ratings?.count || 0} reviews)
              </span>
            </div>

            {/* Price section */}
            <div className="flex items-baseline gap-2 mt-3">
              <span className="text-sm sm:text-base font-black text-slate-800 dark:text-white">
                ₹{product.price.toLocaleString()}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-[10px] sm:text-xs text-slate-400 line-through font-medium">
                  ₹{product.compareAtPrice.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          {/* CTA Add to Cart */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5">
            <button
              onClick={() => addToCart(product, 1)}
              disabled={product.inventory === 0}
              className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-100 disabled:to-slate-100 disabled:text-slate-400 disabled:dark:from-slate-800 disabled:dark:to-slate-800 disabled:dark:text-slate-600 text-white text-[11px] font-bold rounded-full transition-all duration-300 cursor-pointer disabled:cursor-not-allowed shadow-md hover:shadow-lg flex items-center justify-center gap-1.5"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>

      </Spotlight>
    </div>
  );
};
