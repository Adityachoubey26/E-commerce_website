'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import API from '../utils/api';
import { Product } from '../../../shared/types';
import { AuroraBackground } from '../components/animations/AuroraBackground';
import { BlurText } from '../components/animations/BlurText';
import { ShinyText } from '../components/animations/ShinyText';
import { InfiniteMarquee } from '../components/animations/InfiniteMarquee';
import { ProductCard } from '../components/ProductCard';
import { Sparkles, ArrowRight, Flame, ShieldCheck, Truck, RefreshCw, Star } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 34, seconds: 12 });

  // Countdown timer simulation for Flash Sale
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 24, minutes: 0, seconds: 0 }; // reset
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await API.get('/products');
        if (data.success && data.products.length > 0) {
          setProducts(data.products);
        } else {
          setProducts(mockFeaturedProducts);
        }
      } catch (error) {
        console.error('Failed to load home products:', error);
        setProducts(mockFeaturedProducts);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const brands = [
    <span key="1" className="text-lg font-black tracking-widest text-slate-400 dark:text-slate-600 mx-8">APPLE</span>,
    <span key="2" className="text-lg font-black tracking-widest text-slate-400 dark:text-slate-600 mx-8">BOSE</span>,
    <span key="3" className="text-lg font-black tracking-widest text-slate-400 dark:text-slate-600 mx-8">SONY</span>,
    <span key="4" className="text-lg font-black tracking-widest text-slate-400 dark:text-slate-600 mx-8">SAMSUNG</span>,
    <span key="5" className="text-lg font-black tracking-widest text-slate-400 dark:text-slate-600 mx-8">GARMIN</span>,
    <span key="6" className="text-lg font-black tracking-widest text-slate-400 dark:text-slate-600 mx-8">DELL</span>
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <AuroraBackground className="py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Column: Heading & CTAs */}
          <div className="flex-1 space-y-8 text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              Intelligence Meets E-Commerce
            </span>
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none text-text-primary dark:text-white">
                <BlurText text="The Next Generation" duration={0.6} />
                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-pink-500">
                  Shopping Experience
                </span>
              </h1>
              <p className="max-w-xl text-base sm:text-lg text-text-secondary dark:text-slate-300 mx-auto lg:mx-0 leading-relaxed font-medium">
                Explore curate collections powered by Gemini 3.5 AI. Compare specifications, view smart summaries, and buy with confidence.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
              <Link
                href="/products"
                className="px-8 py-4 bg-primary hover:bg-blue-600 text-white rounded-full font-bold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
              >
                <span>Browse Products</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button
                onClick={() => {
                  const aiBtn = document.querySelector('button[class*="bg-gradient-to-tr"]');
                  if (aiBtn) (aiBtn as HTMLButtonElement).click();
                }}
                className="px-8 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 hover:border-primary text-text-primary dark:text-white rounded-full font-bold transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-secondary animate-pulse" />
                <span>AI Shopping Assistant</span>
              </button>
            </div>
          </div>

          {/* Right Column: Floating Product Cards Visual Showcase */}
          <div className="flex-1 relative w-full max-w-md h-[400px] hidden md:block">
            <div className="absolute top-0 right-10 w-72 h-96 rounded-3xl overflow-hidden shadow-2xl border border-white/10 rotate-6 hover:rotate-0 transition-transform duration-500">
              <img
                src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=500"
                className="w-full h-full object-cover"
                alt="AeroPro max"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-6 left-6 text-white space-y-1">
                <span className="text-[10px] uppercase font-bold text-amber-400">Featured Product</span>
                <h3 className="font-bold text-lg">AeroPro Max ANC</h3>
                <p className="text-xs text-slate-300">₹12,999</p>
              </div>
            </div>
            <div className="absolute bottom-4 left-6 w-60 h-80 rounded-3xl overflow-hidden shadow-2xl border border-white/10 -rotate-12 hover:rotate-0 transition-transform duration-500 z-10">
              <img
                src="https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=400"
                className="w-full h-full object-cover"
                alt="Chronos Watch"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-6 left-6 text-white space-y-1">
                <span className="text-[10px] uppercase font-bold text-emerald-400">Best Seller</span>
                <h3 className="font-bold text-md">Chronos Lux Smartwatch</h3>
                <p className="text-xs text-slate-300">₹18,499</p>
              </div>
            </div>
          </div>
        </div>
      </AuroraBackground>

      {/* Trust Badges Shelf */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-white/5 p-8 rounded-3xl shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-text-primary dark:text-white">Free Express Delivery</h4>
              <p className="text-xs text-text-secondary dark:text-slate-400 mt-1">Orders above ₹4,000</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-text-primary dark:text-white">Secure Payments</h4>
              <p className="text-xs text-text-secondary dark:text-slate-400 mt-1">Razorpay & COD supported</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-text-primary dark:text-white">Easy 30-Day Policy</h4>
              <p className="text-xs text-text-secondary dark:text-slate-400 mt-1">Hassle-free global returns</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-text-primary dark:text-white">Gemini Recommendations</h4>
              <p className="text-xs text-text-secondary dark:text-slate-400 mt-1">Tailored for your profile</p>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Showcase Marquee */}
      <section className="bg-slate-50 dark:bg-slate-900/30 py-8 border-y border-slate-200/50 dark:border-white/5">
        <InfiniteMarquee items={brands} speed={25} />
      </section>

      {/* Flash Sale Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-red-600 to-rose-700 text-white rounded-3xl p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.1),transparent_50%)]" />
          <div className="relative z-10 space-y-4 text-center md:text-left">
            <span className="inline-flex items-center gap-1 bg-white/20 text-white text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full">
              <Flame className="w-3.5 h-3.5 animate-pulse" />
              Limited Hours Deal
            </span>
            <h2 className="text-3xl md:text-4xl font-black">Summer Flash Cyber Sale!</h2>
            <p className="text-slate-200 text-xs md:text-sm font-medium">Use coupon FLAT500 to grab instant cash discounts on all orders above ₹4,000.</p>
          </div>

          <div className="relative z-10 flex gap-4 bg-black/20 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
            <div className="flex flex-col items-center">
              <span className="text-2xl md:text-3xl font-black">{timeLeft.hours.toString().padStart(2, '0')}</span>
              <span className="text-[10px] text-slate-300 font-bold uppercase mt-1">Hrs</span>
            </div>
            <span className="text-2xl md:text-3xl font-black">:</span>
            <div className="flex flex-col items-center">
              <span className="text-2xl md:text-3xl font-black">{timeLeft.minutes.toString().padStart(2, '0')}</span>
              <span className="text-[10px] text-slate-300 font-bold uppercase mt-1">Mins</span>
            </div>
            <span className="text-2xl md:text-3xl font-black">:</span>
            <div className="flex flex-col items-center">
              <span className="text-2xl md:text-3xl font-black">{timeLeft.seconds.toString().padStart(2, '0')}</span>
              <span className="text-[10px] text-slate-300 font-bold uppercase mt-1">Secs</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured & Trending Products */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-secondary">Our Top Picks</span>
            <h2 className="text-2xl sm:text-4xl font-black text-text-primary dark:text-white">Trending Hardware</h2>
          </div>
          <Link href="/products" className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
            <span>View Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-96 rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
            ))
          ) : (
            products.map(prod => (
              <ProductCard key={prod._id} product={prod} />
            ))
          )}
        </div>
      </section>

      {/* Categories Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-primary">Discover More</span>
          <h2 className="text-2xl sm:text-4xl font-black text-text-primary dark:text-white">Shop by Category</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: 'Premium Audio', slug: 'premium-audio', img: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=500', count: '12 Items' },
            { name: 'Smart Watches', slug: 'smart-watches', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=500', count: '8 Items' },
            { name: 'Minimalist Accessories', slug: 'minimalist-accessories', img: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&q=80&w=500', count: '6 Items' }
          ].map((cat, idx) => (
            <Link
              key={idx}
              href={`/products?category=${cat.slug}`}
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

      {/* Customer Testimonials */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-secondary">Reviews</span>
          <h2 className="text-2xl sm:text-4xl font-black text-text-primary dark:text-white">Customer Testimonials</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: 'Aditya C.', rating: 5, text: 'Absolutely stellar sound quality on the AeroPro headphones. The active noise cancelling blocks out everything. AI Chatbot recommended this to me.', title: 'Amazing Recommendations' },
            { name: 'Sameer K.', rating: 5, text: 'The Chronos Watch is both premium and super functional. Seamless Razorpay checkout. Delivered within 2 days to Neo-Delhi.', title: 'Express Delivery' },
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

      {/* Newsletter */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="rounded-3xl bg-slate-950 text-white p-8 md:p-16 border border-white/5 text-center space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/20 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[250px] h-[250px] bg-secondary/20 rounded-full blur-[80px] pointer-events-none" />

          <div className="relative z-10 max-w-xl mx-auto space-y-4">
            <h2 className="text-3xl font-black">Subscribe to Premium Drops</h2>
            <p className="text-slate-400 text-xs md:text-sm font-medium">Join our community newsletter and receive early updates on hardware releases, discount coupons, and tech recommendations.</p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed successfully!'); }} className="relative z-10 max-w-md mx-auto flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              required
              className="flex-1 px-5 py-3.5 rounded-full bg-white/10 text-white text-xs border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <button
              type="submit"
              className="px-6 py-3.5 bg-primary hover:bg-blue-600 text-white text-xs font-bold rounded-full transition-all shadow-md"
            >
              Subscribe
            </button>
          </form>
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
