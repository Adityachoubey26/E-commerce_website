'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { Heart, ShoppingCart, Star, GitCompare, Eye } from 'lucide-react';
import { Product } from '../../../shared/types';
import { Spotlight } from './animations/Spotlight';

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
    <div className="group relative bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/60 dark:border-white/5 shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between h-[400px]">
      <Spotlight radius={180} color="rgba(124, 58, 237, 0.08)" className="h-full flex flex-col justify-between">
        
        {/* Badges */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-1">
          {discountPercent > 0 && (
            <span className="bg-sale text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-md uppercase tracking-wider">
              {discountPercent}% OFF
            </span>
          )}
          {product.inventory === 0 ? (
            <span className="bg-slate-800 text-slate-100 text-[10px] font-black px-2.5 py-1 rounded-full shadow-md uppercase tracking-wider">
              Sold Out
            </span>
          ) : product.inventory < 5 ? (
            <span className="bg-amber-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-md uppercase tracking-wider">
              Low Stock
            </span>
          ) : null}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {/* Wishlist */}
          <button
            onClick={() => toggleWishlist(product)}
            className={`w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-colors shadow-md bg-white dark:bg-slate-800 border border-slate-200/50 dark:border-white/10 ${
              wishlisted
                ? 'text-rose-500'
                : 'text-text-secondary dark:text-slate-300 hover:text-rose-500'
            }`}
          >
            <Heart className={`w-4.5 h-4.5 ${wishlisted ? 'fill-current' : ''}`} />
          </button>

          {/* Compare */}
          {onCompareSelect && (
            <button
              onClick={() => onCompareSelect(product)}
              className={`w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-colors shadow-md bg-white dark:bg-slate-800 border border-slate-200/50 dark:border-white/10 ${
                isComparing
                  ? 'text-primary'
                  : 'text-text-secondary dark:text-slate-300 hover:text-primary'
              }`}
              title="Compare Product"
            >
              <GitCompare className="w-4.5 h-4.5" />
            </button>
          )}

          {/* Quick View Details Link Icon */}
          <Link
            href={`/products/${product.slug}`}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-colors shadow-md bg-white dark:bg-slate-800 border border-slate-200/50 dark:border-white/10 text-text-secondary dark:text-slate-300 hover:text-secondary"
            title="Quick View"
          >
            <Eye className="w-4.5 h-4.5" />
          </Link>
        </div>

        {/* Image */}
        <Link href={`/products/${product.slug}`} className="block relative h-48 overflow-hidden bg-slate-50 dark:bg-slate-950/20">
          <img
            src={product.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Info Content */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            {/* Title */}
            <Link href={`/products/${product.slug}`} className="block">
              <h3 className="text-sm font-bold text-text-primary dark:text-white hover:text-primary transition-colors line-clamp-2 leading-snug">
                {product.name}
              </h3>
            </Link>

            {/* Ratings */}
            <div className="flex items-center gap-1 mt-2">
              <div className="flex items-center text-amber-500">
                <Star className="w-3.5 h-3.5 fill-current" />
              </div>
              <span className="text-xs text-text-secondary dark:text-slate-300 font-bold">
                {product.ratings?.average || 0}
              </span>
              <span className="text-[10px] text-text-secondary dark:text-slate-400">
                ({product.ratings?.count || 0} reviews)
              </span>
            </div>

            {/* Price section */}
            <div className="flex items-baseline gap-2 mt-3">
              <span className="text-base font-black text-text-primary dark:text-white">
                ₹{product.price.toLocaleString()}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-xs text-text-secondary dark:text-slate-400 line-through">
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
              className="w-full py-2 bg-primary hover:bg-blue-600 disabled:bg-slate-100 disabled:text-slate-400 disabled:dark:bg-slate-800 disabled:dark:text-slate-600 text-white text-xs font-bold rounded-full transition-all cursor-pointer disabled:cursor-not-allowed shadow-md hover:shadow-lg flex items-center justify-center gap-1.5"
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
