'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import API from '../../../utils/api';
import confetti from 'canvas-confetti';
import { CheckCircle2, Download, FileText, ArrowRight, Home, RefreshCw } from 'lucide-react';
import { Order } from '../../../../../shared/types';

interface OrderSuccessPageProps {
  params: Promise<{ id: string }>;
}

export default function OrderSuccessPage({ params }: OrderSuccessPageProps) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. Trigger confetti on mount
  useEffect(() => {
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 }
    });
  }, []);

  // 2. Fetch order confirmation details
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const { data } = await API.get(`/orders/${id}`);
        if (data.success) {
          setOrder(data.order);
        }
      } catch (error) {
        console.error('Failed to fetch order success details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center text-slate-400">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-indigo-500 mb-2" />
        <p className="text-xs">Assembling invoice records...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center text-slate-400">
        <p className="text-sm">Order reference code not found in records database.</p>
        <Link href="/" className="text-xs text-indigo-400 hover:underline mt-2 inline-block">Go Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background highlight */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(99,102,241,0.06),transparent_50%)]" />

      <div className="glass-card w-full max-w-lg p-8 rounded-3xl border border-white/10 relative z-10 space-y-6 text-center">
        
        {/* Success Icon */}
        <div className="inline-flex w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 items-center justify-center mx-auto mb-2 animate-bounce">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        {/* Title */}
        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Order Confirmed!</h1>
          <p className="text-xs text-slate-400">
            Thank you for shopping. Your invoice code is <strong>INV-{order._id.slice(-8).toUpperCase()}</strong>
          </p>
        </div>

        {/* Invoice details summary box */}
        <div className="p-5 bg-slate-900/50 border border-white/5 rounded-2xl text-left space-y-3.5 text-xs">
          
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <span className="text-slate-400">Delivery Status</span>
            <span className="bg-indigo-500/20 text-indigo-400 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
              {order.orderStatus}
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Shipping Address</span>
            <p className="text-slate-300">
              {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zip}
            </p>
          </div>

          <div className="flex justify-between items-baseline border-t border-white/5 pt-3">
            <span className="text-slate-400 font-medium">Grand Total Paid</span>
            <span className="text-base font-bold text-white">INR {order.total.toLocaleString()}</span>
          </div>

        </div>

        {/* Download Invoice PDF */}
        {order.invoicePath && (
          <a
            href={`http://localhost:5000${order.invoicePath}`}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-4 py-2.5 rounded-xl border border-white/10 transition-all cursor-pointer font-medium"
          >
            <Download className="w-4 h-4" />
            Download PDF Invoice
          </a>
        )}

        {/* Navigation Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-3">
          <Link
            href="/"
            className="flex-1 py-3 border border-white/10 bg-slate-950 hover:bg-slate-900 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
          <Link
            href="/orders"
            className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md hover:shadow-indigo-500/20 cursor-pointer"
          >
            Track My Orders
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
