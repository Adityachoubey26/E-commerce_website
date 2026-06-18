'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import logoImg from '../assets/ShopEra_Logo.png';

const MotionLink = motion(Link);

export const Footer: React.FC = () => {
  const pathname = usePathname();

  // Hide the footer on login/signup routes
  if (pathname === '/login' || pathname === '/signup') {
    return null;
  }

  const containerVariants: any = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.6, 
        staggerChildren: 0.1 
      } 
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  const linkHover: any = {
    hover: { 
      x: 6, 
      color: '#2563EB',
      transition: { type: 'spring', stiffness: 300, damping: 20 } 
    }
  };

  const socialHover: any = {
    hover: { 
      scale: 1.2, 
      rotate: 8, 
      color: '#2563EB',
      transition: { duration: 0.2 } 
    }
  };

  return (
    <motion.footer 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={containerVariants}
      className="w-full border-t border-slate-200/50 dark:border-white/5 bg-[#111827] text-slate-300 py-12 px-4 transition-colors duration-200 relative z-10"
    >
      <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-8 px-4 sm:px-6 lg:px-8">
        
        {/* Brand */}
        <motion.div variants={itemVariants} className="space-y-4">
          <Link href="/" className="flex items-center gap-2">
            <Image 
              src={logoImg} 
              alt="ShopEra Logo" 
              className="h-8 w-auto object-contain brightness-0 invert dark:brightness-100 dark:invert-0" 
            />
          </Link>
          <p className="text-xs leading-relaxed text-slate-400">
            A premium portfolio showcase delivering a next-generation shopping experience. Implemented with glassmorphism, responsive grid layouts, and advanced Gemini-driven intelligence.
          </p>
          <div className="flex gap-4.5 text-slate-400 font-bold text-[11px] pt-1">
            <motion.a whileHover="hover" variants={socialHover} href="#" className="transition-colors">Twitter</motion.a>
            <motion.a whileHover="hover" variants={socialHover} href="#" className="transition-colors">GitHub</motion.a>
            <motion.a whileHover="hover" variants={socialHover} href="#" className="transition-colors">LinkedIn</motion.a>
          </div>
        </motion.div>

        {/* Links */}
        <motion.div variants={itemVariants}>
          <h4 className="text-sm font-bold text-white mb-4">Quick Links</h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <MotionLink href="/products" whileHover="hover" variants={linkHover} className="hover:text-primary transition-colors inline-block cursor-pointer">
                Catalog
              </MotionLink>
            </li>
            <li>
              <MotionLink href="/profile" whileHover="hover" variants={linkHover} className="hover:text-primary transition-colors inline-block cursor-pointer">
                My Profile
              </MotionLink>
            </li>
            <li>
              <MotionLink href="/orders" whileHover="hover" variants={linkHover} className="hover:text-primary transition-colors inline-block cursor-pointer">
                My Orders
              </MotionLink>
            </li>
            <li>
              <MotionLink href="/admin" whileHover="hover" variants={linkHover} className="hover:text-primary transition-colors inline-block cursor-pointer">
                Admin Portal
              </MotionLink>
            </li>
          </ul>
        </motion.div>

        {/* Customer Support */}
        <motion.div variants={itemVariants}>
          <h4 className="text-sm font-bold text-white mb-4">Customer Support</h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <motion.span whileHover="hover" variants={linkHover} className="hover:text-primary transition-colors inline-block cursor-pointer">
                30-Day Policy
              </motion.span>
            </li>
            <li>
              <motion.span whileHover="hover" variants={linkHover} className="hover:text-primary transition-colors inline-block cursor-pointer">
                COD / Payments FAQ
              </motion.span>
            </li>
            <li>
              <motion.span whileHover="hover" variants={linkHover} className="hover:text-primary transition-colors inline-block cursor-pointer">
                Terms of Service
              </motion.span>
            </li>
            <li>
              <motion.span whileHover="hover" variants={linkHover} className="hover:text-primary transition-colors inline-block cursor-pointer">
                Privacy Policy
              </motion.span>
            </li>
          </ul>
        </motion.div>

        {/* Contact info */}
        <motion.div variants={itemVariants} className="space-y-4">
          <h4 className="text-sm font-bold text-white mb-4">Contact Founder</h4>
          <ul className="space-y-3.5 text-xs">
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-slate-300">Founder: Aditya Choubey</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-slate-300">adityachoubey26@gmail.com</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-slate-300">+91 9310526618</span>
            </li>
          </ul>
        </motion.div>

      </div>

      <motion.div 
        variants={itemVariants} 
        className="mx-auto max-w-7xl border-t border-slate-800 mt-10 pt-6 text-center text-xs text-slate-500 px-4 sm:px-6 lg:px-8"
      >
        &copy; {new Date().getFullYear()} ShopEra Pro. Built for portfolio showcase. All rights reserved.
      </motion.div>
    </motion.footer>
  );
};
