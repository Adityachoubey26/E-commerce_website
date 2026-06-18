'use client';

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User as UserIcon, 
  MapPin, 
  Heart, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  Mail, 
  Loader2, 
  ShoppingCart, 
  ExternalLink,
  PackageCheck,
  Calendar,
  Grid
} from 'lucide-react';

export default function ProfilePage() {
  const { user, token, addAddress, deleteAddress, loading } = useAuth();
  const { wishlistItems, toggleWishlist, addToCart } = useCart();

  // Address form states
  const [showForm, setShowForm] = useState(false);
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [country, setCountry] = useState('India');
  const [formLoading, setFormLoading] = useState(false);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-xs text-text-secondary dark:text-slate-400 font-semibold tracking-wider uppercase">Loading Account Console...</p>
      </div>
    );
  }

  if (!token || !user) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center space-y-4">
        <div className="inline-flex p-4 rounded-full bg-rose-500/10 border border-rose-500/25 text-rose-500 mb-2">
          <UserIcon className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-text-primary dark:text-white">Sign In Required</h2>
        <p className="text-xs text-text-secondary dark:text-slate-400 max-w-md mx-auto">
          Please log in to view saved shipping vectors, personalize your wishlist, and track orders.
        </p>
        <Link href="/login" className="px-6 py-2.5 bg-primary text-white rounded-full text-xs font-bold shadow-md hover:bg-blue-600 transition-colors inline-block">
          Sign In Here
        </Link>
      </div>
    );
  }

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!street || !city || !state || !zip) return;
    setFormLoading(true);
    const success = await addAddress({ street, city, state, zip, country, isDefault: false });
    if (success) {
      setShowForm(false);
      setStreet('');
      setCity('');
      setState('');
      setZip('');
    } else {
      alert('Failed to save shipping address.');
    }
    setFormLoading(false);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 space-y-10 min-h-[85vh]">
      
      {/* Greeting Banner */}
      <div className="bg-gradient-to-r from-primary/10 via-secondary/5 to-transparent border border-slate-200/60 dark:border-white/5 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shadow-inner">
            <UserIcon className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-text-primary dark:text-white font-poppins">
              Welcome, {user.name}
            </h1>
            <p className="text-xs text-text-secondary dark:text-slate-400 font-semibold mt-1 uppercase tracking-widest flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Verified Account Dashboard</span>
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link 
            href="/orders" 
            className="px-5 py-2.5 bg-primary hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
          >
            <PackageCheck className="w-4 h-4" />
            <span>Track Orders</span>
          </Link>
          {user.role === 'admin' && (
            <Link 
              href="/admin" 
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-850 dark:hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 border border-white/10"
            >
              <Grid className="w-4 h-4" />
              <span>Admin Console</span>
            </Link>
          )}
        </div>
      </div>

      {/* Stats Counters */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {[
          { label: 'Saved Addresses', value: user.addresses?.length || 0, icon: MapPin },
          { label: 'Wishlist Items', value: wishlistItems.length, icon: Heart },
          { label: 'Account Rank', value: user.role.toUpperCase(), icon: UserIcon }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 p-5 border border-slate-200/60 dark:border-white/5 rounded-2xl flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black block">{stat.label}</span>
              <span className="text-lg font-black text-text-primary dark:text-white block">{stat.value}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-950 flex items-center justify-center border border-slate-200/50 dark:border-white/5 text-primary">
              <stat.icon className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Account details & Addresses */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* User Vitals Card */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-white/5 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-text-primary dark:text-white uppercase tracking-widest border-b border-slate-100 dark:border-white/5 pb-3">
              Personal Information
            </h3>
            <div className="space-y-3.5 text-xs text-text-secondary dark:text-slate-350 font-semibold">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Full Name</span>
                <p className="text-text-primary dark:text-white">{user.name}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">Email Address</span>
                <div className="flex items-center gap-1.5 text-text-primary dark:text-white">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span>{user.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Address Management Card */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-white/5 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-text-primary dark:text-white uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 dark:border-white/5 pb-3">
              <MapPin className="w-4.5 h-4.5 text-primary" />
              Shipping Addresses
            </h3>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {user.addresses && user.addresses.length > 0 ? (
                user.addresses.map((addr) => (
                  <div key={addr._id} className="flex justify-between items-start bg-slate-50 dark:bg-slate-950/40 p-3.5 border border-slate-200/60 dark:border-white/5 rounded-2xl text-xs text-text-secondary dark:text-slate-300 relative group">
                    <div className="font-semibold space-y-0.5">
                      <p className="font-bold text-text-primary dark:text-slate-100">{addr.street}</p>
                      <p>{addr.city}, {addr.state} - {addr.zip}</p>
                      <p>{addr.country}</p>
                    </div>
                    <button
                      onClick={() => addr._id && deleteAddress(addr._id)}
                      className="text-slate-400 hover:text-rose-500 transition-colors p-1 cursor-pointer"
                      title="Remove Address"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-[11px] text-slate-500 italic font-semibold">No addresses saved to your account yet.</p>
              )}
            </div>

            {/* Expandable Form to Add Address */}
            {!showForm ? (
              <button
                onClick={() => setShowForm(true)}
                className="w-full py-2.5 bg-primary/5 hover:bg-primary/10 text-primary font-black rounded-xl text-xs flex items-center justify-center gap-1 border border-primary/20 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add New Address
              </button>
            ) : (
              <form onSubmit={handleAddressSubmit} className="border-t border-slate-150 dark:border-white/5 pt-4 grid grid-cols-2 gap-3.5 text-xs font-semibold">
                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold">Street Address</label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="e.g. 42 Glassmorphic Drive"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold">City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Mumbai"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold">State</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="e.g. Maharashtra"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold">Pin Code</label>
                  <input
                    type="text"
                    required
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    placeholder="e.g. 400001"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold">Country</label>
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="col-span-2 flex gap-2 pt-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 border border-slate-200 dark:border-white/10 rounded-full text-text-secondary hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="px-5 py-2 bg-primary hover:bg-blue-600 text-white rounded-full font-bold shadow-md transition-all flex items-center gap-1"
                  >
                    {formLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>Save Address</span>
                  </button>
                </div>
              </form>
            )}

          </div>

        </div>

        {/* Right Column: Wishlist manager */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-white/5 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-text-primary dark:text-white uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 dark:border-white/5 pb-3">
              <Heart className="w-4.5 h-4.5 text-rose-500 fill-current" />
              My Wishlist Products ({wishlistItems.length})
            </h3>

            {wishlistItems.length === 0 ? (
              <div className="text-text-secondary dark:text-slate-400 text-xs py-24 text-center space-y-3">
                <p className="font-semibold">Your wishlist is looking empty.</p>
                <Link href="/products" className="text-primary hover:underline font-bold inline-block">
                  Go explore products catalog
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AnimatePresence>
                  {wishlistItems.map((prod) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      key={prod._id}
                      className="bg-slate-50 dark:bg-slate-950/40 border border-slate-200/60 dark:border-white/5 rounded-2xl p-4 flex gap-4 relative overflow-hidden group text-xs justify-between"
                    >
                      <img 
                        src={prod.images[0] || '/images/placeholder.jpg'} 
                        alt={prod.name}
                        className="w-16 h-16 object-cover rounded-xl bg-slate-950 flex-shrink-0 border border-slate-200/60 dark:border-white/5" 
                      />
                      
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-bold text-text-primary dark:text-slate-200 line-clamp-1 group-hover:text-primary transition-colors">
                            {prod.name}
                          </h4>
                          <span className="text-[10px] text-text-secondary dark:text-slate-400 block mt-0.5 font-bold">
                            ₹{prod.price.toLocaleString()}
                          </span>
                        </div>

                        <div className="flex gap-3 items-center mt-3">
                          <button
                            onClick={() => addToCart(prod, 1)}
                            className="bg-primary hover:bg-blue-600 text-white text-[9px] font-black uppercase tracking-wider px-3.5 py-2 rounded-xl flex items-center gap-1 cursor-pointer transition-colors shadow-sm"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            <span>Add To Cart</span>
                          </button>
                          <button
                            onClick={() => toggleWishlist(prod)}
                            className="text-[10px] text-text-secondary dark:text-slate-400 hover:text-rose-500 font-bold hover:underline cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                      {/* Go to Details Link */}
                      <Link 
                        href={`/products/${prod.slug}`}
                        className="absolute top-2 right-2 text-slate-400 hover:text-text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                        title="View Details"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
