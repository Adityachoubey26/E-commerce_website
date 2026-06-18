'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';
import { Lock, Mail, User, Eye, EyeOff, AlertCircle, Sparkles } from 'lucide-react';
import { AuroraBackground } from '../../components/animations/AuroraBackground';
import { motion } from 'framer-motion';

export default function SignupPage() {
  const router = useRouter();
  const { signup, user } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect
  React.useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      return setErrorMsg('All fields are required.');
    }
    if (password.length < 6) {
      return setErrorMsg('Password must be at least 6 characters.');
    }

    setErrorMsg('');
    setLoading(true);

    const res = await signup(name, email, password);
    if (res.success) {
      router.push('/');
    } else {
      setErrorMsg(res.message || 'Signup failed.');
      setLoading(false);
    }
  };

  return (
    <AuroraBackground className="w-full relative">
      
      {/* Floating Background Products with Interactive Hover Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden hidden lg:block select-none z-0">
        {/* Floating Item 1: Headphones */}
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          whileHover={{ scale: 1.15, rotate: 8 }}
          className="absolute left-[12%] top-[18%] pointer-events-auto cursor-pointer p-3.5 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-200/50 dark:border-white/5 shadow-xl max-w-[120px] text-center transition-all duration-300 hover:shadow-primary/10 hover:border-primary/20"
        >
          <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80" alt="Headphones" className="w-16 h-16 object-cover rounded-xl mx-auto mb-1.5" />
          <span className="text-[9px] font-black text-text-primary dark:text-white block uppercase tracking-wider">ShopEra Sound</span>
        </motion.div>

        {/* Floating Item 2: Watch */}
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          whileHover={{ scale: 1.15, rotate: -8 }}
          className="absolute right-[12%] top-[22%] pointer-events-auto cursor-pointer p-3.5 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-200/50 dark:border-white/5 shadow-xl max-w-[120px] text-center transition-all duration-300 hover:shadow-primary/10 hover:border-primary/20"
        >
          <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80" alt="Watch" className="w-16 h-16 object-cover rounded-xl mx-auto mb-1.5" />
          <span className="text-[9px] font-black text-text-primary dark:text-white block uppercase tracking-wider">Chronos II</span>
        </motion.div>

        {/* Floating Item 3: Shoes */}
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [0, -8, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          whileHover={{ scale: 1.15, rotate: -4 }}
          className="absolute left-[14%] bottom-[18%] pointer-events-auto cursor-pointer p-3.5 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-200/50 dark:border-white/5 shadow-xl max-w-[120px] text-center transition-all duration-300 hover:shadow-primary/10 hover:border-primary/20"
        >
          <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=80" alt="Shoes" className="w-16 h-16 object-cover rounded-xl mx-auto mb-1.5" />
          <span className="text-[9px] font-black text-text-primary dark:text-white block uppercase tracking-wider">Hyper Sneakers</span>
        </motion.div>

        {/* Floating Item 4: Camera */}
        <motion.div
          animate={{ y: [0, 15, 0], rotate: [0, 8, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          whileHover={{ scale: 1.15, rotate: 10 }}
          className="absolute right-[14%] bottom-[16%] pointer-events-auto cursor-pointer p-3.5 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-200/50 dark:border-white/5 shadow-xl max-w-[120px] text-center transition-all duration-300 hover:shadow-primary/10 hover:border-primary/20"
        >
          <img src="https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=200&q=80" alt="Camera" className="w-16 h-16 object-cover rounded-xl mx-auto mb-1.5" />
          <span className="text-[9px] font-black text-text-primary dark:text-white block uppercase tracking-wider">Lumix Pro</span>
        </motion.div>
      </div>

      {/* Centering Flex Container wrapper */}
      <div className="min-h-[80vh] w-full flex items-center justify-center px-4 py-12 bg-slate-50/5 dark:bg-slate-950/5 transition-colors duration-250 relative z-10">
        <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md w-full max-w-md p-8 rounded-3xl border border-slate-200/80 dark:border-white/10 relative z-10 space-y-6 shadow-xl dark:shadow-black/50">
          
          {/* Title */}
          <div className="text-center space-y-2">
            <div className="inline-flex w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 text-primary items-center justify-center mx-auto mb-1">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <h2 className="text-2xl font-black text-text-primary dark:text-white font-poppins">Create Account</h2>
            <p className="text-xs text-text-secondary dark:text-slate-400 font-semibold">Join us to experience AI guided shopping</p>
          </div>

          {/* Error alert */}
          {errorMsg && (
            <div className="flex items-center gap-2 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 p-3.5 rounded-2xl text-xs font-semibold">
              <AlertCircle className="w-4.5 h-4.5 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 font-semibold text-xs">
            
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-text-secondary dark:text-slate-400 uppercase tracking-widest block">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Aditya Choubey"
                  className="w-full bg-slate-50/50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/10 rounded-2xl py-3 pl-10 pr-4 text-text-primary dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
                <User className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-3.5" />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-text-secondary dark:text-slate-400 uppercase tracking-widest block">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="aditya@example.com"
                  className="w-full bg-slate-50/50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/10 rounded-2xl py-3 pl-10 pr-4 text-text-primary dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
                <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-3.5" />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-text-secondary dark:text-slate-400 uppercase tracking-widest block">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full bg-slate-50/50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/10 rounded-2xl py-3 pl-10 pr-10 text-text-primary dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
                <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-3.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 dark:text-slate-500 hover:text-slate-350 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary hover:bg-blue-600 disabled:opacity-50 text-white font-black rounded-2xl transition-all shadow-md hover:shadow-primary/20 cursor-pointer uppercase tracking-wider text-[10px]"
            >
              {loading ? 'Registering Account...' : 'Sign Up'}
            </button>

          </form>

          {/* Footer link */}
          <p className="text-xs text-center text-text-secondary dark:text-slate-400 pt-4 border-t border-slate-150 dark:border-white/5 font-semibold">
            Already have an account?{' '}
            <Link href="/login" className="text-primary dark:text-indigo-400 font-bold hover:underline">
              Login here
            </Link>
          </p>

        </div>
      </div>
    </AuroraBackground>
  );
}
