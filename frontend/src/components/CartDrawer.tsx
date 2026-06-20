'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useRouter } from 'next/navigation';
import { X, ShoppingBag, Plus, Minus, Trash, Tag, Check, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { ProductImage } from './ProductImage';

export const CartDrawer: React.FC = () => {
  const router = useRouter();
  const {
    cartItems,
    cartDrawerOpen,
    setCartDrawerOpen,
    updateQuantity,
    removeFromCart,
    applyCoupon,
    removeCoupon,
    coupon,
    discount,
    getCartSubtotal,
    getCartTotal
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ text: string; error: boolean } | null>(null);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setCouponMsg(null);
    const res = await applyCoupon(couponCode);
    if (res.success) {
      setCouponMsg({ text: res.message, error: false });
      setCouponCode('');
    } else {
      setCouponMsg({ text: res.message, error: true });
    }
  };

  const handleCheckoutClick = () => {
    setCartDrawerOpen(false);
    router.push('/checkout');
  };

  return (
    <AnimatePresence>
      {cartDrawerOpen && (
        <>
          {/* Overlay background */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartDrawerOpen(false)}
            className="fixed inset-0 z-50 bg-black backdrop-blur-xs"
          />

          {/* Slider Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 z-50 h-full w-full sm:max-w-md bg-white dark:bg-[#090D16] border-l border-slate-200 dark:border-white/5 shadow-2xl flex flex-col text-text-primary dark:text-white"
          >
            {/* Header */}
            <div className="p-5 border-b border-slate-200 dark:border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                <h2 className="font-black text-base">Your Cart ({cartItems.length})</h2>
              </div>
              <button
                onClick={() => setCartDrawerOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-text-secondary dark:text-slate-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items list */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-text-secondary space-y-4">
                  <ShoppingBag className="w-12 h-12 stroke-[1.5] text-slate-300 dark:text-slate-700" />
                  <p className="text-sm font-semibold">Your cart is currently empty.</p>
                  <Link
                    href="/products"
                    onClick={() => setCartDrawerOpen(false)}
                    className="text-xs bg-primary hover:bg-blue-600 text-white font-bold px-5 py-2.5 rounded-full shadow-md"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.product._id}
                    className="flex gap-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200/60 dark:border-white/5 relative overflow-hidden"
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-950 flex-shrink-0">
                      <ProductImage
                        src={item.product.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=120'}
                        alt={item.product.name}
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <h4 className="text-xs font-bold truncate text-text-primary dark:text-slate-200">
                          {item.product.name}
                        </h4>
                        <span className="text-[10px] text-text-secondary dark:text-slate-400 font-bold block mt-0.5">
                          ₹{(item.product?.price || item.price).toLocaleString()}
                        </span>
                      </div>

                      {/* Quantity Selector */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                          className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 hover:bg-slate-350 dark:hover:bg-slate-700 flex items-center justify-center text-xs cursor-pointer text-text-primary dark:text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                          className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 hover:bg-slate-350 dark:hover:bg-slate-700 flex items-center justify-center text-xs cursor-pointer text-text-primary dark:text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col justify-between items-end">
                      <button
                        onClick={() => removeFromCart(item.product._id)}
                        className="text-text-secondary hover:text-sale transition-colors p-1 cursor-pointer"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                      <span className="text-xs font-black text-text-primary dark:text-white">
                        ₹{((item.product?.price || item.price) * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Checkout / Summary Panel */}
            {cartItems.length > 0 && (
              <div className="p-5 border-t border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-900/60 space-y-4">
                {/* Coupon Form */}
                {coupon ? (
                  <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-xl p-3 text-xs font-bold">
                    <div className="flex items-center gap-1.5">
                      <Check className="w-4 h-4" />
                      <span>
                        Applied Code: <strong>{coupon.code}</strong> (-₹{discount.toLocaleString()})
                      </span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-[10px] underline cursor-pointer hover:text-text-primary"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Coupon Code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-full px-4 py-2 text-xs text-text-primary dark:text-white placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary font-semibold"
                    />
                    <button
                      type="submit"
                      className="bg-primary hover:bg-blue-600 font-bold text-xs px-4 py-2 rounded-full flex items-center gap-1 cursor-pointer text-white"
                    >
                      <Tag className="w-3.5 h-3.5" />
                      <span>Apply</span>
                    </button>
                  </form>
                )}

                {couponMsg && (
                  <p className={`text-[10px] px-1 font-bold ${couponMsg.error ? 'text-sale' : 'text-emerald-600'}`}>
                    {couponMsg.text}
                  </p>
                )}

                {/* Subtotal, discount and totals */}
                <div className="space-y-2 text-xs font-bold">
                  <div className="flex justify-between text-text-secondary dark:text-slate-400">
                    <span>Subtotal</span>
                    <span>₹{getCartSubtotal().toLocaleString()}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Discount</span>
                      <span>- ₹{discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-black text-text-primary dark:text-white pt-2 border-t border-slate-200 dark:border-white/5">
                    <span>Total Amount</span>
                    <span>₹{getCartTotal().toLocaleString()}</span>
                  </div>
                </div>

                {/* Checkout Trigger */}
                <button
                  onClick={handleCheckoutClick}
                  className="w-full py-3 bg-primary hover:bg-blue-600 text-white font-bold text-xs rounded-full shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all uppercase tracking-wider"
                >
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  <span>Proceed to Checkout</span>
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
