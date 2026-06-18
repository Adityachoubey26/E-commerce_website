'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import API from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  ChevronDown, 
  ChevronUp, 
  Download, 
  Clock, 
  CheckCircle, 
  Truck, 
  Package, 
  Calendar, 
  ArrowLeft,
  MapPin,
  Loader2,
  ReceiptText,
  AlertCircle
} from 'lucide-react';
import { Order } from '../../../../shared/types';

export default function MyOrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) return;
      try {
        const { data } = await API.get('/orders');
        if (data.success) {
          setOrders(data.orders);
          // Auto expand the most recent order if there are any
          if (data.orders.length > 0) {
            setExpandedOrderId(data.orders[0]._id);
          }
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [token]);

  const toggleExpand = (orderId: string) => {
    setExpandedOrderId(prev => prev === orderId ? null : orderId);
  };

  const getStatusStep = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 1;
      case 'processing': return 2;
      case 'shipped': return 3;
      case 'delivered': return 4;
      case 'cancelled': return -1;
      default: return 1;
    }
  };

  if (!token) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center space-y-4">
        <div className="inline-flex p-4 rounded-full bg-rose-500/10 border border-rose-500/25 text-rose-500 mb-2">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-text-primary dark:text-white">Authentication Required</h2>
        <p className="text-xs text-text-secondary dark:text-slate-400 max-w-md mx-auto">
          Please sign in to view your secure purchases, orders, and real-time shipment tracking details.
        </p>
        <Link href="/login" className="px-6 py-2.5 bg-primary text-white rounded-full text-xs font-bold shadow-md hover:bg-blue-600 transition-colors inline-block">
          Login to Account
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-xs text-text-secondary dark:text-slate-400 font-semibold tracking-wider uppercase">Loading Purchase Console...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 space-y-8 min-h-[80vh]">
      
      {/* Back to Catalog Breadcrumb */}
      <div className="flex justify-between items-center">
        <Link href="/products" className="inline-flex items-center gap-1 text-xs text-text-secondary hover:text-text-primary dark:hover:text-white transition-colors font-bold">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Continue Shopping</span>
        </Link>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-black text-text-primary dark:text-white tracking-tight font-poppins">
          Order History & Tracking
        </h1>
        <p className="text-xs text-text-secondary dark:text-slate-400 font-medium">
          Track packages, view digital invoices, and manage past purchases.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-white/5 text-center py-20 rounded-3xl text-text-secondary dark:text-slate-400 space-y-4 shadow-sm">
          <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto border border-slate-200/50 dark:border-white/5">
            <ShoppingBag className="w-6 h-6 text-text-secondary" />
          </div>
          <h3 className="font-bold text-text-primary dark:text-white">No Orders Placed Yet</h3>
          <p className="text-xs text-text-secondary dark:text-slate-400 max-w-sm mx-auto">
            You haven't completed any orders. Add items to your cart and experience our secure lightning-fast checkout.
          </p>
          <Link href="/products" className="px-6 py-2.5 bg-primary hover:bg-blue-600 text-white rounded-full inline-block shadow-md text-xs font-bold transition-all">
            Browse Catalog
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((ord) => {
            const currentStep = getStatusStep(ord.orderStatus);
            const isExpanded = expandedOrderId === ord._id;

            return (
              <div
                key={ord._id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-white/5 overflow-hidden transition-all shadow-sm hover:shadow-md"
              >
                
                {/* Order Summary Header Panel */}
                <div 
                  onClick={() => toggleExpand(ord._id)}
                  className="p-6 cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/50 dark:bg-slate-950/20 border-b border-slate-200/50 dark:border-white/5"
                >
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs text-text-secondary dark:text-slate-400 font-semibold w-full md:w-auto">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold mb-0.5">Order ID</span>
                      <span className="font-black text-text-primary dark:text-white font-mono">
                        INV-{ord._id.slice(-8).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold mb-0.5">Date Placed</span>
                      <span className="text-text-primary dark:text-slate-200">
                        {ord.createdAt ? new Date(ord.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                      </span>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <span className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold mb-0.5">Total Paid</span>
                      <span className="font-bold text-text-primary dark:text-white">
                        ₹{ord.total.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-200/60 dark:border-white/5">
                    {/* Order Status Badge */}
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                        ord.paymentStatus === 'paid'
                          ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20'
                          : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20'
                      }`}>
                        {ord.paymentStatus}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                        ord.orderStatus === 'delivered'
                          ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20'
                          : ord.orderStatus === 'cancelled'
                          ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/20'
                          : 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20'
                      }`}>
                        {ord.orderStatus}
                      </span>
                    </div>

                    <div className="text-text-secondary">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 space-y-8">
                        
                        {/* Real-time Timeline Stepper */}
                        {currentStep !== -1 ? (
                          <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 block">
                              Real-Time Shipping Progress
                            </h4>
                            <div className="grid grid-cols-4 gap-2 relative py-4">
                              {/* Horizontal progress bar */}
                              <div className="absolute top-[34px] left-[12%] right-[12%] h-[2px] bg-slate-200 dark:bg-slate-800 -z-0">
                                <div 
                                  className="h-full bg-primary transition-all duration-500" 
                                  style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                                />
                              </div>

                              {[
                                { stepNum: 1, label: 'Order Placed', icon: Clock },
                                { stepNum: 2, label: 'Processing', icon: Package },
                                { stepNum: 3, label: 'Shipped', icon: Truck },
                                { stepNum: 4, label: 'Delivered', icon: CheckCircle }
                              ].map((stepObj) => {
                                const isDone = currentStep >= stepObj.stepNum;
                                const isCurrent = currentStep === stepObj.stepNum;
                                const StepIcon = stepObj.icon;

                                return (
                                  <div key={stepObj.stepNum} className="flex flex-col items-center text-center space-y-2 z-10">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${
                                      isDone 
                                        ? 'bg-primary border-primary text-white shadow-md shadow-primary/20' 
                                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 text-text-secondary'
                                    } ${isCurrent ? 'ring-4 ring-primary/25' : ''}`}>
                                      <StepIcon className="w-4.5 h-4.5" />
                                    </div>
                                    <span className={`text-[10px] font-black tracking-wide ${
                                      isDone ? 'text-text-primary dark:text-white' : 'text-text-secondary'
                                    }`}>
                                      {stepObj.label}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ) : (
                          <div className="p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/25 rounded-2xl flex items-center gap-3 text-xs text-rose-600 dark:text-rose-400 font-semibold">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <span>This order has been Cancelled. If you have already been charged, a refund is being initiated.</span>
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-xs font-semibold">
                          
                          {/* Item List Column */}
                          <div className="md:col-span-2 space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-100 dark:border-white/5 pb-2">
                              Package Contents ({ord.items.reduce((total, item) => total + item.quantity, 0)} items)
                            </h4>
                            <div className="space-y-3">
                              {ord.items.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-4 bg-slate-50/50 dark:bg-slate-950/20 p-3 rounded-2xl border border-slate-200/50 dark:border-white/5">
                                  <img 
                                    src={item.image || '/images/placeholder.jpg'} 
                                    alt={item.name}
                                    className="w-12 h-12 object-cover rounded-xl bg-slate-950 flex-shrink-0 border border-slate-200/60 dark:border-white/5" 
                                  />
                                  <div className="flex-1 min-w-0">
                                    <span className="font-bold text-text-primary dark:text-slate-100 line-clamp-1 block">{item.name}</span>
                                    <span className="text-[10px] text-text-secondary dark:text-slate-500 font-medium">
                                      Qty: {item.quantity} × ₹{item.price.toLocaleString()}
                                    </span>
                                  </div>
                                  <span className="font-black text-text-primary dark:text-white">
                                    ₹{(item.quantity * item.price).toLocaleString()}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Address & Tracking log Column */}
                          <div className="space-y-6">
                            <div className="space-y-3">
                              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-100 dark:border-white/5 pb-2">
                                Delivery Address
                              </h4>
                              <div className="flex items-start gap-2 text-text-secondary dark:text-slate-350 leading-relaxed font-semibold">
                                <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                                <div>
                                  <p className="text-text-primary dark:text-slate-200">{ord.shippingAddress.street}</p>
                                  <p>{ord.shippingAddress.city}, {ord.shippingAddress.state} - {ord.shippingAddress.zip}</p>
                                  <p>{ord.shippingAddress.country}</p>
                                </div>
                              </div>
                            </div>

                            {/* Tracking History details logs */}
                            {ord.trackingHistory && ord.trackingHistory.length > 0 && (
                              <div className="space-y-3">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-100 dark:border-white/5 pb-2">
                                  Tracking History Log
                                </h4>
                                <div className="space-y-3 pl-2 border-l border-slate-200 dark:border-white/5 ml-2.5">
                                  {ord.trackingHistory.map((hist, idx) => (
                                    <div key={idx} className="relative pl-4">
                                      <span className="absolute -left-[13px] top-1.5 w-2.5 h-2.5 rounded-full bg-primary border-2 border-white dark:border-slate-900" />
                                      <div className="space-y-0.5">
                                        <div className="flex justify-between items-center">
                                          <span className="font-bold text-text-primary dark:text-white uppercase text-[9px]">{hist.status}</span>
                                          <span className="text-[9px] text-slate-500 font-medium">
                                            {hist.timestamp ? new Date(hist.timestamp).toLocaleDateString() : ''}
                                          </span>
                                        </div>
                                        {hist.notes && (
                                          <p className="text-[10px] text-text-secondary dark:text-slate-400 font-medium">
                                            {hist.notes}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Actions (Download Invoice) */}
                            {ord.invoicePath && (
                              <div className="pt-2">
                                <a
                                  href={`http://localhost:5000${ord.invoicePath}`}
                                  download
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-full py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-text-primary dark:text-slate-200 rounded-2xl font-bold flex items-center justify-center gap-1.5 border border-slate-200 dark:border-white/10 transition-all text-xs cursor-pointer shadow-sm"
                                >
                                  <ReceiptText className="w-4 h-4 text-primary" />
                                  <span>Download Invoice PDF</span>
                                </a>
                              </div>
                            )}

                          </div>

                        </div>

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
