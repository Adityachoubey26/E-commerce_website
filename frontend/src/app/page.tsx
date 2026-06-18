'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { AuroraBackground } from '../components/animations/AuroraBackground';
import { BlurText } from '../components/animations/BlurText';
import { ShinyText } from '../components/animations/ShinyText';
import { InfiniteMarquee } from '../components/animations/InfiniteMarquee';
import { 
  Sparkles, ArrowRight, ShieldCheck, Truck, RefreshCw, Star, 
  Wallet, Coins, ChevronDown, CheckCircle, Info, Zap, Smartphone, Cpu
} from 'lucide-react';
import API from '../utils/api';
import { Product } from '../../../shared/types';
import { ProductCard } from '../components/ProductCard';

export default function LandingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [trending, setTrending] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Accordion state for FAQ
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);

  useEffect(() => {
    // If user is already logged in, redirect them to dashboard
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/dashboard');
    }
  }, [router]);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const { data } = await API.get('/products?limit=3');
        if (data.success && data.products.length > 0) {
          setTrending(data.products.slice(0, 3));
        } else {
          setTrending(mockFeaturedProducts);
        }
      } catch (err) {
        console.error('Failed to load landing products:', err);
        setTrending(mockFeaturedProducts);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  const brands = [
    // 1. Apple
    <div key="apple" className="flex items-center justify-center min-w-[180px] h-[90px] px-6 py-4 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-white/5 rounded-2xl shadow-sm hover:scale-105 hover:border-black/25 dark:hover:border-white/20 transition-all duration-300 mx-3 cursor-pointer group">
      <svg className="max-h-[50px] max-w-[140px] w-auto h-auto fill-current text-[#000000] dark:text-white object-contain" viewBox="0 0 170 170">
        <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.36.13-9.13-1.9-14.34-6.07-3.23-2.61-7.23-7.38-12-14.28-5.46-7.85-9.8-16.71-13.01-26.58-3.21-9.87-4.82-19.16-4.82-27.87 0-12.63 3.19-22.9 9.58-30.82 6.39-7.91 14.39-11.95 24-12.12 5.58-.08 11.36 1.72 17.34 5.39 5.98 3.67 10.15 5.39 12.51 5.39 1.83 0 5.76-1.57 11.77-4.72 6.02-3.15 11.66-4.63 16.92-4.43 14.47.62 25.13 6.07 31.97 16.36-12 7.28-17.89 16.89-17.67 28.82.22 9.68 3.86 17.65 10.92 23.9 7.06 6.26 15.25 9.77 24.58 10.53-1.99 5.86-4.49 11.77-7.5 17.74zM119.22 28.16c0-7.72 2.76-14.88 8.28-21.49 5.53-6.61 12.39-10.32 20.61-11.14.11 8.04-2.69 15.35-8.4 21.94-5.71 6.59-12.75 10.19-21.13 10.79-.56-8.31-3.64-15.38-8.28-21.49z"/>
      </svg>
    </div>,
    // 2. Samsung
    <div key="samsung" className="flex items-center justify-center min-w-[180px] h-[90px] px-6 py-4 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-white/5 rounded-2xl shadow-sm hover:scale-105 hover:border-[#034EA2]/30 transition-all duration-300 mx-3 cursor-pointer group">
      <svg className="max-h-[50px] max-w-[140px] w-auto h-auto fill-[#034EA2] object-contain" viewBox="0 0 200 40">
        <path d="M12.4 12.8c-2-1.3-4.5-1.9-7-1.9-3.4 0-5.8 1.1-5.8 2.9 0 4.8 16.5 2.8 16.5 11.8 0 4.9-5.1 7.6-11.7 7.6-3.8 0-7.8-1-10.4-3.1l2.4-4.5c2.3 1.7 5.7 2.6 8.3 2.6 3.7 0 6.1-1.1 6.1-3.2 0-5.2-16.5-2.9-16.5-11.8 0-4.8 5.1-7.5 11.4-7.5 3.5 0 6.9.9 9.3 2.5l-2.6 4.6zm23.9 19.3h-10.2l-1.9-5.2h-12.7l-1.9 5.2H0L12.5 1h9.3l12.5 31.1zm-13.8-9.6L20 12.3l-2.5 6.9h5zm32.8 9.6v-18l-7.7 13.9H63L55.3 14.1v18h-8.8V1h8.7l8.2 14.9L71.6 1h8.7v31.1h-8.8zm21.4-19.3c-2-1.3-4.5-1.9-7-1.9-3.4 0-5.8 1.1-5.8 2.9 0 4.8 16.5 2.8 16.5 11.8 0 4.9-5.1 7.6-11.7 7.6-3.8 0-7.8-1-10.4-3.1l2.4-4.5c2.3 1.7 5.7 2.6 8.3 2.6 3.7 0 6.1-1.1 6.1-3.2 0-5.2-16.5-2.9-16.5-11.8 0-4.8 5.1-7.5 11.4-7.5 3.5 0 6.9.9 9.3 2.5l-2.6 4.6zm31.7 5.9v-17.7h8.8v17.4c0 4.9-2.5 7.1-7.5 7.1s-7.5-2.2-7.5-7.1V12.8h8.8v17.4c0 1.5.6 2.1 1.7 2.1s1.7-.6 1.7-2.1zm21.4-5.9v-18l-7.7 13.9H163l-7.7-13.9v18h-8.8V1h8.7l8.2 14.9L171.6 1h8.7v31.1h-8.8zm21.4-5.2c-2.3 0-4.4.4-6 1.1v8.8c1.6.5 3.6.7 5.5.7 3.3 0 5-1.1 5-2.8v-5c0-1.7-1.7-2.8-4.5-2.8zm8.7-2.4c.5 1.5.8 3.5.8 5.4v5c0 6.3-4.8 8.4-11.2 8.4-3.5 0-7-.6-9.1-1.6V12.8c2.1-1 5.3-1.6 8.8-1.6 6.3 0 10.7 2 10.7 7.6z"/>
      </svg>
    </div>,
    // 3. Sony
    <div key="sony" className="flex items-center justify-center min-w-[180px] h-[90px] px-6 py-4 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-white/5 rounded-2xl shadow-sm hover:scale-105 hover:border-black/25 dark:hover:border-white/20 transition-all duration-300 mx-3 cursor-pointer group">
      <svg className="max-h-[50px] max-w-[140px] w-auto h-auto fill-black dark:fill-white object-contain" viewBox="0 0 40 7">
        <path d="M0 0.23h5.45c1.47 0 2.37 0.32 2.37 1.25 0 0.81-0.8 1.13-1.68 1.24l2.12 3.82c0.12 0.22 0.3 0.23 0.65 0.23v0.23H6.26l-1.92-3.51H1.54v3.28c0 0.2 0.08 0.23 0.38 0.23h1.03v0.23H0zm1.54 2.81h3.36c0.88 0 1.28-0.28 1.28-0.78s-0.42-0.78-1.28-0.78H1.93c-0.3 0-0.39 0.03-0.39 0.23zm12.35 1.9c0 1.48-1.42 2.29-3.9 2.29s-3.9-0.81-3.9-2.29V2.28c0-1.48 1.42-2.28 3.9-2.28s3.9 0.8 3.9 2.28zm-1.53-2.61c0-0.79-0.56-1.12-2.37-1.12S7.62 1.58 7.62 2.37v2.66c0 0.79 0.56 1.12 2.37 1.12s2.37-0.33 2.37-1.12zm13.1-4.1v6.54h-0.23L20.25 0.5v5.33c0 0.2 0.08 0.23 0.38 0.23h1.03v0.23H17.4v-0.23h1.03c0.3 0 0.38-0.03 0.38-0.23V1.69L13.79 6.77h-0.23V0.23h0.23L18.8 5.48V0.73c0-0.2-0.08-0.23-0.38-0.23h-1.03V0.27zm13.1 0v1.73l-2.48 2.29v2.01c0 0.2 0.08 0.23 0.38 0.23h1.03v0.23h-4.24v-0.23h1.03c0.3 0 0.38-0.03 0.38-0.23V4.25L32.4 1.96V0.73c0-0.2-0.08-0.23-0.38-0.23h-1.03V0.27z"/>
      </svg>
    </div>,
    // 4. Dell
    <div key="dell" className="flex items-center justify-center min-w-[180px] h-[90px] px-6 py-4 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-white/5 rounded-2xl shadow-sm hover:scale-105 hover:border-[#0076B6]/30 transition-all duration-300 mx-3 cursor-pointer group">
      <svg className="max-h-[50px] max-w-[140px] w-auto h-auto fill-[#0076b6] object-contain" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-3.72-4.14v-2.07c0-.28-.15-.47-.46-.47h-1.1c-.28 0-.46.19-.46.47v2.07c0 .28.18.47.46.47h1.1c.31 0 .46-.19.46-.47zm0-2.85V8.58c0-.28-.15-.47-.46-.47h-1.1c-.28 0-.46.19-.46.47V11c0 .28.18.47.46.47h1.1c.31 0 .46-.19.46-.47zm6.75 2.85v-7.27h-1.24v3.52c0 .2-.12.31-.31.31h-1.18c-.2 0-.31-.11-.31-.31V8.58h-1.24v7.27c0 .28.18.47.46.47h1.1c.31 0 .46-.19.46-.47v-3.52c0-.2.12-.31.31-.31h1.18c.2 0 .31.11.31.31v3.52c0 .28.18.47.46.47h1.1c.31 0 .46-.19.46-.47zm3.17 0v-7.27h-1.24v7.27c0 .28.18.47.46.47h1.1c.31 0 .46-.19.46-.47zm.7-7.27v7.27c0 .28.18.47.46.47h1.1c.31 0 .46-.19.46-.47V8.58h-2.02z"/>
      </svg>
    </div>,
    // 5. HP
    <div key="hp" className="flex items-center justify-center min-w-[180px] h-[90px] px-6 py-4 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-white/5 rounded-2xl shadow-sm hover:scale-105 hover:border-[#0096D6]/30 transition-all duration-300 mx-3 cursor-pointer group">
      <svg className="max-h-[50px] max-w-[140px] w-auto h-auto fill-[#0096D6] object-contain" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="48" fill="#0096D6"/>
        <path fill="white" d="M30.4 75.8V21.1c0-.4.3-.7.7-.7h5.1c.4 0 .7.3.7.7v24.6h12.5V21.1c0-.4.3-.7.7-.7h5.1c.4 0 .7.3.7.7v54.7c0 .4-.3.7-.7.7H50c-.4 0-.7-.3-.7-.7V51.7H36.9v24.1c0 .4-.3.7-.7.7h-5.1c-.4.1-.7-.2-.7-.7zm30.3 0V21.1c0-.4.3-.7.7-.7h5.1c.4 0 .7.3.7.7v54.7c0 .4-.3.7-.7.7h-5.1c-.4.1-.7-.2-.7-.7z"/>
      </svg>
    </div>,
    // 6. Lenovo
    <div key="lenovo" className="flex items-center justify-center min-w-[180px] h-[90px] px-6 py-4 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-white/5 rounded-2xl shadow-sm hover:scale-105 hover:border-[#E21223]/30 transition-all duration-300 mx-3 cursor-pointer group">
      <svg className="max-h-[50px] max-w-[140px] w-auto h-auto fill-red-600 dark:fill-white object-contain" viewBox="0 0 120 30">
        <rect width="120" height="30" fill="#E21223" rx="4"/>
        <text x="12" y="21" fill="white" fontSize="15" fontWeight="bold" fontFamily="sans-serif">Lenovo</text>
      </svg>
    </div>,
    // 7. Asus
    <div key="asus" className="flex items-center justify-center min-w-[180px] h-[90px] px-6 py-4 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-white/5 rounded-2xl shadow-sm hover:scale-105 hover:border-[#00539B]/30 transition-all duration-300 mx-3 cursor-pointer group">
      <svg className="max-h-[50px] max-w-[140px] w-auto h-auto fill-[#00539B] dark:fill-white object-contain" viewBox="0 0 120 25">
        <text x="10" y="18" fill="currentColor" fontSize="16" fontWeight="900" fontFamily="'Outfit', sans-serif" letterSpacing="2">ASUS</text>
      </svg>
    </div>,
    // 8. JBL
    <div key="jbl" className="flex items-center justify-center min-w-[180px] h-[90px] px-6 py-4 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-white/5 rounded-2xl shadow-sm hover:scale-105 hover:border-[#FF6600]/30 transition-all duration-300 mx-3 cursor-pointer group">
      <svg className="max-h-[50px] max-w-[140px] w-auto h-auto fill-[#FF6600] object-contain" viewBox="0 0 50 50">
        <rect width="50" height="50" fill="#FF6600" rx="8"/>
        <text x="7" y="32" fill="white" fontSize="18" fontWeight="900" fontFamily="sans-serif">JBL</text>
      </svg>
    </div>,
    // 9. Bose
    <div key="bose" className="flex items-center justify-center min-w-[180px] h-[90px] px-6 py-4 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-white/5 rounded-2xl shadow-sm hover:scale-105 hover:border-black/25 dark:hover:border-white/20 transition-all duration-300 mx-3 cursor-pointer group">
      <svg className="max-h-[50px] max-w-[140px] w-auto h-auto fill-black dark:fill-white object-contain" viewBox="0 0 80 20">
        <text x="5" y="16" fill="currentColor" fontSize="16" fontWeight="bold" fontStyle="italic" fontFamily="sans-serif" letterSpacing="1">BOSE</text>
      </svg>
    </div>,
    // 10. Intel
    <div key="intel" className="flex items-center justify-center min-w-[180px] h-[90px] px-6 py-4 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-white/5 rounded-2xl shadow-sm hover:scale-105 hover:border-[#0071C5]/30 transition-all duration-300 mx-3 cursor-pointer group">
      <svg className="max-h-[50px] max-w-[140px] w-auto h-auto fill-[#0071C5] object-contain" viewBox="0 0 60 40">
        <text x="5" y="26" fill="#0071C5" fontSize="16" fontWeight="bold" fontFamily="sans-serif">intel.</text>
      </svg>
    </div>,
    // 11. AMD
    <div key="amd" className="flex items-center justify-center min-w-[180px] h-[90px] px-6 py-4 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-white/5 rounded-2xl shadow-sm hover:scale-105 hover:border-[#000000]/30 dark:hover:border-white/20 transition-all duration-300 mx-3 cursor-pointer group">
      <svg className="max-h-[50px] max-w-[140px] w-auto h-auto fill-[#000000] dark:fill-white object-contain" viewBox="0 0 60 25">
        <text x="5" y="18" fill="currentColor" fontSize="16" fontWeight="900" fontFamily="sans-serif">AMD</text>
      </svg>
    </div>,
    // 12. Nvidia
    <div key="nvidia" className="flex items-center justify-center min-w-[180px] h-[90px] px-6 py-4 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-white/5 rounded-2xl shadow-sm hover:scale-105 hover:border-[#76B900]/30 transition-all duration-300 mx-3 cursor-pointer group">
      <svg className="max-h-[50px] max-w-[140px] w-auto h-auto fill-[#76B900] object-contain" viewBox="0 0 80 25">
        <text x="5" y="18" fill="#76B900" fontSize="15" fontWeight="bold" fontFamily="sans-serif">NVIDIA.</text>
      </svg>
    </div>
  ];

  const faqs = [
    {
      q: "What is ShopEra Wallet?",
      a: "ShopEra Wallet is a secure digital balance preloaded or recharged in your profile. It permits 1-click lightning-fast checkouts with absolute zero failure rates and instant automated refunds."
    },
    {
      q: "How do ShopEra Loyalty Tokens work?",
      a: "For every ₹100 you spend on ShopEra, you automatically earn 1 ShopEra Token (SET). Each token is worth exactly ₹1 in cash value and can be applied during checkout to reduce order prices."
    },
    {
      q: "Is there a limit on token redemption?",
      a: "No! You can redeem any amount of available tokens up to the total price of your cart. Combined with your wallet balance, you can checkout without entering debit/credit cards."
    },
    {
      q: "What AI models power the ShopEra Assistant?",
      a: "Our system is integrated with the Gemini 1.5 Pro and Flash API arrays, facilitating deep product specification comparison, user reviews summarization, and smart voice commands."
    }
  ];

  return (
    <div className="space-y-24 pb-20">
      
      {/* 1. HERO SECTION */}
      <AuroraBackground className="py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-12">
          
          <div className="flex-1 space-y-8 text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              Smart Shopping Starts Here
            </span>
            
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none text-text-primary dark:text-white">
                <BlurText text="The Next Generation" duration={0.6} />
                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-pink-500">
                  E-Commerce Store
                </span>
              </h1>
              <p className="max-w-xl text-base sm:text-lg text-text-secondary dark:text-slate-300 mx-auto lg:mx-0 leading-relaxed font-medium">
                Experience high-fidelity hardware catalogs curated by Gemini AI, instant checkouts with ShopEra Wallet, and integrated loyalty rewards.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
              <Link
                href="/login"
                className="px-8 py-4 bg-primary hover:bg-blue-600 text-white rounded-full font-bold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Enter Application</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/signup"
                className="px-8 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 hover:border-primary text-text-primary dark:text-white rounded-full font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Join ShopEra</span>
              </Link>
            </div>
          </div>

          {/* Right Floating Mockups Visual */}
          <div className="flex-1 relative w-full max-w-md h-[400px] hidden md:block">
            <div className="absolute top-0 right-10 w-72 h-96 rounded-3xl overflow-hidden shadow-2xl border border-white/10 rotate-6 hover:rotate-0 transition-transform duration-500">
              <img
                src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=500"
                className="w-full h-full object-cover"
                alt="AeroPro ANC"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-6 left-6 text-white space-y-1">
                <span className="text-[10px] uppercase font-bold text-amber-400">Featured Drop</span>
                <h3 className="font-bold text-lg">AeroPro Max ANC</h3>
                <p className="text-xs text-slate-300">₹12,999</p>
              </div>
            </div>
            
            <div className="absolute bottom-4 left-6 w-60 h-80 rounded-3xl overflow-hidden shadow-2xl border border-white/10 -rotate-12 hover:rotate-0 transition-transform duration-500 z-10">
              <img
                src="https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=400"
                className="w-full h-full object-cover"
                alt="Chronos Active"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-6 left-6 text-white space-y-1">
                <span className="text-[10px] uppercase font-bold text-emerald-400">Popular Choice</span>
                <h3 className="font-bold text-md">Chronos Active Smartwatch</h3>
                <p className="text-xs text-slate-300">₹12,999</p>
              </div>
            </div>
          </div>
        </div>
      </AuroraBackground>

      {/* 2. BRANDS SCROLL */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-4xl font-black text-text-primary dark:text-white">Available Products From Top Brands</h2>
          <p className="text-xs sm:text-sm text-text-secondary dark:text-slate-400 font-medium">
            Discover premium products from Apple, Samsung, Sony, Dell, HP, Lenovo, Asus, JBL and other leading technology brands.
          </p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-900/30 py-8 border-y border-slate-200/50 dark:border-white/5 rounded-3xl overflow-hidden">
          <InfiniteMarquee items={brands} speed={30} />
        </div>
      </section>

      {/* 3. ABOUT SHOPERA SECTION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-extrabold uppercase tracking-wider text-secondary">Who We Are</span>
            <h2 className="text-3xl sm:text-4xl font-black text-text-primary dark:text-white leading-tight">
              A Unified Ecosystem Built for Modern Commerce.
            </h2>
            <p className="text-sm text-text-secondary dark:text-slate-300 leading-relaxed font-medium">
              ShopEra was founded to bridge the gap between AI recommendations, convenient loyalty rewards, and high-performance electronic hardware. We build gadgets that empower productivity, combined with an application designed to delight at every click.
            </p>
            <div className="flex flex-col gap-3.5">
              <div className="flex items-center gap-3 text-xs font-bold text-text-primary dark:text-slate-200">
                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <span>Zero-friction payments using integrated digital wallets</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-text-primary dark:text-slate-200">
                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <span>Loyalty system offering up to 10% direct savings on orders</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-text-primary dark:text-slate-200">
                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <span>24/7 Gemini-driven 3D Conversational Assistant</span>
              </div>
            </div>
          </div>
          
          <div className="rounded-3xl overflow-hidden h-[400px] border border-slate-200/50 dark:border-white/5 shadow-lg relative">
            <img
              src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=800"
              className="w-full h-full object-cover"
              alt="About ShopEra mockup"
            />
          </div>
        </div>
      </section>

      {/* 4. STATISTICS COUNTER */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-slate-900 text-white p-8 md:p-12 rounded-3xl border border-white/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(139,92,246,0.15),transparent_50%)]" />
          <div className="text-center space-y-1 relative z-10">
            <h3 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">105+</h3>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Premium Products</p>
          </div>
          <div className="text-center space-y-1 relative z-10">
            <h3 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">99.9%</h3>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Checkout Success</p>
          </div>
          <div className="text-center space-y-1 relative z-10">
            <h3 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">5M+</h3>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Happy Shipments</p>
          </div>
          <div className="text-center space-y-1 relative z-10">
            <h3 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">24/7</h3>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Gemini AI Active</p>
          </div>
        </div>
      </section>

      {/* 5. APP FEATURES GRID */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-wider text-primary">Key Pillars</span>
          <h2 className="text-3xl sm:text-4xl font-black text-text-primary dark:text-white">Built for the Digital Creator</h2>
          <p className="text-xs sm:text-sm text-text-secondary dark:text-slate-400 font-medium">
            Explore advanced components designed to simplify, reward, and protect your digital shopping journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-white/5 shadow-sm space-y-4 hover:border-primary/45 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg text-text-primary dark:text-white">Free Express Shipping</h3>
            <p className="text-xs text-text-secondary dark:text-slate-400 leading-relaxed font-medium">
              We coordinate next-day shipping in all major metros across India for orders above ₹4,000. Real-time updates pushed directly to your timeline.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-white/5 shadow-sm space-y-4 hover:border-primary/45 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg text-text-primary dark:text-white">Secure Encrypted Gateways</h3>
            <p className="text-xs text-text-secondary dark:text-slate-400 leading-relaxed font-medium">
              Razorpay, UPI, cards, and our native digital wallet are protected with full SSL handshake verification and end-to-end security layers.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-white/5 shadow-sm space-y-4 hover:border-primary/45 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg text-text-primary dark:text-white">Hassle-free 30d Returns</h3>
            <p className="text-xs text-text-secondary dark:text-slate-400 leading-relaxed font-medium">
              Not completely satisfied? Process a full returns return window directly from your order tracking timeline. Returns credited instantly.
            </p>
          </div>
        </div>
      </section>

      {/* 6. AI SHOPPING SYSTEM */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center bg-gradient-to-tr from-slate-950 to-slate-900 text-white p-8 md:p-16 rounded-3xl border border-white/5 relative overflow-hidden">
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-secondary/20 rounded-full blur-[90px] pointer-events-none" />
          
          <div className="space-y-6 relative z-10">
            <span className="inline-flex items-center gap-1 bg-white/10 text-white text-[10px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-secondary animate-pulse" />
              Powered by Gemini
            </span>
            <h2 className="text-3xl sm:text-4xl font-black leading-tight">
              An AI Companion That Understands Hardware
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              No more browsing countless reviews. Our floating AI assistant reviews specifications, analyzes customer ratings, answers technical FAQs, and compares distinct items instantly inside your interface.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <h4 className="font-black text-sm text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Voice Commands</h4>
                <p className="text-[10px] text-slate-400">Speak naturally to request smart comparison cards.</p>
              </div>
              <div className="space-y-1">
                <h4 className="font-black text-sm text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Smart Compare</h4>
                <p className="text-[10px] text-slate-400">Select any two products for structured specification specs.</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4 relative z-10 backdrop-blur-md">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center font-bold text-xs">AI</div>
              <div>
                <p className="font-bold text-xs">ShopEra Bot</p>
                <p className="text-[8px] text-slate-400">Active recommendations</p>
              </div>
            </div>
            <div className="p-3 bg-white/5 rounded-xl text-[10px] leading-relaxed text-slate-200">
              &ldquo;I compared the **AeroPro ANC** and the **Chronos active watch**. The AeroPro delivers hi-res audio and premium 45dB cancellation, whereas the watch tracks 120+ fitness profiles. Let me know if you would like me to add both to your shopping list!&rdquo;
            </div>
            <div className="h-2 w-2/3 bg-white/10 rounded-full" />
            <div className="h-2 w-1/2 bg-white/10 rounded-full" />
          </div>
        </div>
      </section>

      {/* 7. WALLET & TOKENS EXPLANATION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Wallet explaining block */}
        <div className="p-8 md:p-12 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200/40 dark:border-white/5 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="w-12 h-12 rounded-2xl bg-primary/15 text-primary flex items-center justify-center">
            <Wallet className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-black text-text-primary dark:text-white">ShopEra Digital Wallet</h3>
            <p className="text-xs text-text-secondary dark:text-slate-400 leading-relaxed font-medium">
              Skip credit cards and verification delays. Keep a secure balance stored inside your ShopEra Wallet for instantaneous checkout. Reload balances up to ₹50,000 securely.
            </p>
          </div>
          <div className="flex gap-4 border-t border-slate-200/40 dark:border-white/5 pt-4 text-xs font-bold text-text-primary dark:text-slate-200">
            <div>
              <p className="text-sm font-black text-primary">₹5,000</p>
              <p className="text-[10px] text-text-secondary dark:text-slate-400">Default Demo Balance</p>
            </div>
            <div className="border-l border-slate-200 dark:border-white/10 pl-4">
              <p className="text-sm font-black text-primary">1-Click</p>
              <p className="text-[10px] text-text-secondary dark:text-slate-400">Checkout Speed</p>
            </div>
          </div>
        </div>

        {/* Tokens loyalty explaining block */}
        <div className="p-8 md:p-12 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200/40 dark:border-white/5 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="w-12 h-12 rounded-2xl bg-secondary/15 text-secondary flex items-center justify-center">
            <Coins className="w-6 h-6 animate-spin-slow" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-black text-text-primary dark:text-white">Loyalty Tokens System</h3>
            <p className="text-xs text-text-secondary dark:text-slate-400 leading-relaxed font-medium">
              Every purchase on ShopEra rewards you. For every ₹100 spent, you earn 1 loyalty token. Redeem tokens immediately at checkout to obtain flat cash discounts on your next orders.
            </p>
          </div>
          <div className="flex gap-4 border-t border-slate-200/40 dark:border-white/5 pt-4 text-xs font-bold text-text-primary dark:text-slate-200">
            <div>
              <p className="text-sm font-black text-secondary">₹1 Value</p>
              <p className="text-[10px] text-text-secondary dark:text-slate-400">Per Loyalty Token</p>
            </div>
            <div className="border-l border-slate-200 dark:border-white/10 pl-4">
              <p className="text-sm font-black text-secondary">100 SET</p>
              <p className="text-[10px] text-text-secondary dark:text-slate-400">Preloaded Loyalty Bonus</p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. CATEGORIES SHOWCASE */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-primary">Discover More</span>
          <h2 className="text-2xl sm:text-4xl font-black text-text-primary dark:text-white">Shop by Category</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { name: 'Premium Audio', slug: 'headphones', img: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=500', count: '15+ Items' },
            { name: 'Smart Watches', slug: 'smart-watches', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=500', count: '15+ Items' },
            { name: 'Minimalist Accessories', slug: 'accessories', img: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&q=80&w=500', count: '15+ Items' }
          ].map((cat, idx) => (
            <Link
              key={idx}
              href="/login"
              className="relative group rounded-3xl overflow-hidden h-72 border border-slate-200/50 dark:border-white/5 shadow-md flex flex-col justify-end p-6 cursor-pointer"
            >
              <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/40 transition-colors z-10" />
              <img
                src={cat.img}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="relative z-20 space-y-1">
                <span className="text-[10px] text-white/80 font-bold tracking-widest uppercase">{cat.count}</span>
                <h3 className="text-xl font-extrabold text-white">{cat.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 9. TRENDING PREVIEW */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-secondary">Our Top Picks</span>
            <h2 className="text-2xl sm:text-4xl font-black text-text-primary dark:text-white">Trending Hardware</h2>
          </div>
          <Link href="/login" className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-96 rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
            ))
          ) : (
            trending.map(prod => (
              <div key={prod._id} className="relative">
                <ProductCard product={prod} />
                <div className="absolute inset-0 bg-slate-950/5 rounded-3xl flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity backdrop-blur-xs">
                  <Link href="/login" className="px-6 py-3 bg-primary text-white rounded-full font-bold text-xs shadow-md">Login to view details</Link>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* 10. CUSTOMER TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-secondary">Reviews</span>
          <h2 className="text-2xl sm:text-4xl font-black text-text-primary dark:text-white">What Creators Say</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: 'Aditya C.', rating: 5, text: 'Absolutely stellar sound quality on the AeroPro headphones. The active noise cancelling blocks out everything. AI Chatbot recommended this to me.', title: 'Amazing Recommendations' },
            { name: 'Sameer K.', rating: 5, text: 'The Chronos Watch is both premium and super functional. Seamless checkout with my preloaded wallet balance. Delivered within 2 days.', title: 'Express Delivery' },
            { name: 'Nancy J.', rating: 4, text: 'Clean glassmorphic checkout UI, premium packaging. The hyper-charging GaN adapter works incredibly fast with my MacBook Air.', title: 'Highly Recommend!' }
          ].map((review, idx) => (
            <div key={idx} className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-white/5 shadow-sm space-y-4">
              <div className="flex text-amber-500 gap-0.5">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-sm text-text-primary dark:text-white">{review.title}</h4>
                <p className="text-xs text-text-secondary dark:text-slate-400 leading-relaxed font-medium">&ldquo;{review.text}&rdquo;</p>
              </div>
              <div className="font-bold text-xs text-text-primary dark:text-slate-200 pt-2">{review.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 11. FREQUENTLY ASKED QUESTIONS (FAQ) */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-primary">FAQ</span>
          <h2 className="text-2xl sm:text-3xl font-black text-text-primary dark:text-white">Got Questions?</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIdx === idx;
            return (
              <div 
                key={idx} 
                className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-white/5 rounded-2xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-extrabold text-xs text-text-primary dark:text-white cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4.5 h-4.5 text-text-secondary transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-text-secondary dark:text-slate-400 leading-relaxed font-medium">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

const mockFeaturedProducts: Product[] = [
  {
    _id: 'mock_1',
    name: 'AeroPro Max ANC Headphones',
    slug: 'aeropro-max-anc-headphones',
    description: 'Experience pure acoustic brilliance with advanced active noise cancellation, custom audio profiles, and cloud-soft memory cushions for long listening sessions.',
    price: 12999,
    compareAtPrice: 19999,
    images: ['https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=600'],
    category: 'Premium Audio',
    inventory: 24,
    ratings: { average: 4.8, count: 18 },
    features: ['Hybrid Active Noise Cancellation', 'Ambient transparency feedback'],
    tags: ['audio', 'headphones'],
    specifications: {}
  },
  {
    _id: 'mock_2',
    name: 'Chronos Lux Smart Chronograph',
    slug: 'chronos-lux-smart-chronograph',
    description: 'A masterpiece blending luxury styling with cutting-edge vitals monitoring. Features a sleek metallic chassis, customizable dial arrays, and long battery life.',
    price: 18499,
    compareAtPrice: 24999,
    images: ['https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=600'],
    category: 'Smart Watches',
    inventory: 12,
    ratings: { average: 4.6, count: 9 },
    features: ['Always-On AMOLED Console', 'Real-time heart rate sensors'],
    tags: ['watch', 'wearables'],
    specifications: {}
  },
  {
    _id: 'mock_3',
    name: 'HyperDrive 140W Charging Dock',
    slug: 'hyperdrive-140w-charging-dock',
    description: 'Power up to four accessories simultaneously using our crystal-cased hyper-charging hub. Delivers smart power allocation and premium heat management.',
    price: 4999,
    compareAtPrice: 7999,
    images: ['https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&q=80&w=600'],
    category: 'Minimalist Accessories',
    inventory: 2,
    ratings: { average: 4.3, count: 5 },
    features: ['Dual GaN Fast charging circuits', 'Intelligent thermal controls'],
    tags: ['charger', 'desk'],
    specifications: {}
  }
];
