'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { Search, ShoppingCart, Heart, User, LogOut, Sun, Moon, LayoutDashboard, Menu, X, Bell, Sparkles } from 'lucide-react';
import logoImg from '../assets/ShopEra_Logo.png';

export const Navbar: React.FC = () => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { cartItems, setCartDrawerOpen } = useCart();
  const { theme, toggleTheme } = useTheme();
  const [searchVal, setSearchVal] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      router.push(`/products?keyword=${encodeURIComponent(searchVal.trim())}`);
    } else {
      router.push('/products');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300 glassmorphism premium-shadow">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          {/* Logo & Burger */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-text-secondary dark:text-slate-300 transition-all cursor-pointer"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2">
              <Image 
                src={logoImg} 
                alt="ShopEra Logo" 
                className="h-10 w-auto object-contain dark:brightness-110" 
                priority
              />
            </Link>

            {/* Mega Menu Links */}
            <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-text-secondary dark:text-slate-300">
              <Link href={user ? "/dashboard" : "/login"} className="hover:text-primary transition-colors">Shop All</Link>
              <div className="relative group">
                <button className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer">
                  Categories
                </button>
                <div className="absolute top-full left-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-white/5 p-2 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link href={user ? "/dashboard" : "/login"} className="block px-4 py-2.5 rounded-xl text-xs hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary font-bold">Premium Audio</Link>
                  <Link href={user ? "/dashboard" : "/login"} className="block px-4 py-2.5 rounded-xl text-xs hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary font-bold">Smart Watches</Link>
                  <Link href={user ? "/dashboard" : "/login"} className="block px-4 py-2.5 rounded-xl text-xs hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary font-bold">Accessories</Link>
                </div>
              </div>
              <Link href={user ? "/dashboard" : "/login"} className="hover:text-primary transition-colors">New Arrivals</Link>
              <Link href={user ? "/dashboard" : "/login"} className="hover:text-primary transition-colors">Offers</Link>
            </nav>
          </div>

          {/* AI Search Bar */}
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md relative hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Ask Gemini AI search..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary border border-transparent dark:border-white/5 transition-all text-text-primary dark:text-white placeholder-text-secondary dark:placeholder-slate-400"
              />
              <Search className="absolute left-3.5 top-3 w-4.5 h-4.5 text-text-secondary dark:text-slate-400" />
              <div className="absolute right-3.5 top-2.5 flex items-center gap-1 pointer-events-none">
                <Sparkles className="w-4 h-4 text-secondary animate-pulse" />
                <span className="text-[10px] font-black uppercase text-secondary">AI</span>
              </div>
            </div>
          </form>

          {/* User Controls & Icons */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-text-secondary dark:text-slate-300 transition-all cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Notification Center */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-text-secondary dark:text-slate-300 transition-all cursor-pointer relative"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-sale rounded-full" />
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-white/5 p-4 shadow-2xl z-50">
                  <h4 className="font-bold text-xs mb-2 text-text-primary dark:text-white">Notifications</h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs">
                      <p className="font-bold text-text-primary dark:text-white">🚀 Prime Sale Launch!</p>
                      <p className="text-[10px] text-text-secondary dark:text-slate-400 mt-1">Get flat 10% off with coupon first10.</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs">
                      <p className="font-bold text-text-primary dark:text-white">📦 Order Shipped</p>
                      <p className="text-[10px] text-text-secondary dark:text-slate-400 mt-1">Your AeroPro Headphones order is shipped.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Wishlist */}
            <Link
              href="/profile"
              className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-text-secondary dark:text-slate-300 transition-all cursor-pointer"
            >
              <Heart className="w-5 h-5" />
            </Link>

            {/* Account Profile / Admin */}
            {user ? (
              <div className="flex items-center gap-1.5">
                <Link
                  href="/profile"
                  className="flex items-center gap-1.5 p-1 px-3.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full border border-slate-200 dark:border-white/5 text-xs text-text-primary dark:text-white font-bold transition-all"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">{user.name.split(' ')[0]}</span>
                </Link>
                {user.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="p-2.5 bg-primary/10 text-primary dark:text-white hover:bg-primary/20 rounded-full transition-all"
                    title="Admin Dashboard"
                  >
                    <LayoutDashboard className="w-4.5 h-4.5" />
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="p-2.5 text-sale hover:bg-sale/10 rounded-full transition-all cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4.5 h-4.5" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 p-2 px-4 bg-primary hover:bg-blue-600 text-white rounded-full text-xs font-bold transition-all shadow-md"
              >
                <User className="w-4 h-4" />
                <span>Login</span>
              </Link>
            )}

            {/* Cart Button */}
            <button
              onClick={() => setCartDrawerOpen(true)}
              className="flex items-center gap-2 p-2 px-4 bg-secondary hover:bg-purple-600 text-white rounded-full text-xs font-bold transition-all shadow-md cursor-pointer ml-1"
            >
              <div className="relative">
                <ShoppingCart className="w-4.5 h-4.5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-sale text-white text-[9px] font-black rounded-full h-4.5 w-4.5 flex items-center justify-center border border-white dark:border-slate-900 animate-bounce">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">Cart</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200/50 dark:border-white/5 bg-white/95 dark:bg-slate-950/95 backdrop-blur-lg px-4 py-4 space-y-4 shadow-xl">
          {/* Mobile Search Bar */}
          <form onSubmit={(e) => { handleSearchSubmit(e); setMobileMenuOpen(false); }} className="relative w-full">
            <input
              type="text"
              placeholder="Ask Gemini AI search..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary border border-transparent dark:border-white/5 transition-all text-text-primary dark:text-white placeholder-text-secondary"
            />
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-text-secondary dark:text-slate-400" />
            <div className="absolute right-3.5 top-2 flex items-center gap-1 pointer-events-none">
              <Sparkles className="w-3.5 h-3.5 text-secondary animate-pulse" />
              <span className="text-[9px] font-black uppercase text-secondary">AI</span>
            </div>
          </form>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-3.5 text-sm font-semibold text-text-secondary dark:text-slate-300">
            <Link href={user ? "/dashboard" : "/login"} onClick={() => setMobileMenuOpen(false)} className="hover:text-primary transition-colors py-1.5 border-b border-slate-100 dark:border-slate-800">
              Shop All
            </Link>
            <div className="flex flex-col gap-2 py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-text-primary dark:text-white text-xs font-black uppercase tracking-wider">Categories</span>
              <div className="pl-3 flex flex-col gap-2.5 mt-1">
                <Link href={user ? "/dashboard" : "/login"} onClick={() => setMobileMenuOpen(false)} className="hover:text-primary text-xs">Premium Audio</Link>
                <Link href={user ? "/dashboard" : "/login"} onClick={() => setMobileMenuOpen(false)} className="hover:text-primary text-xs">Smart Watches</Link>
                <Link href={user ? "/dashboard" : "/login"} onClick={() => setMobileMenuOpen(false)} className="hover:text-primary text-xs">Accessories</Link>
              </div>
            </div>
            <Link href={user ? "/dashboard" : "/login"} onClick={() => setMobileMenuOpen(false)} className="hover:text-primary transition-colors py-1.5 border-b border-slate-100 dark:border-slate-800">
              New Arrivals
            </Link>
            <Link href={user ? "/dashboard" : "/login"} onClick={() => setMobileMenuOpen(false)} className="hover:text-primary transition-colors py-1.5">
              Offers
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};
