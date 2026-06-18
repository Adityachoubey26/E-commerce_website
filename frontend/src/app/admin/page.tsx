'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../utils/api';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { 
  LayoutDashboard, ShoppingCart, Users, Package, AlertTriangle, 
  Plus, ListFilter, RefreshCw, Sparkles, DollarSign, FileSpreadsheet, 
  PlusCircle, BrainCircuit, Loader2, Coins, Wallet, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface StatData {
  totalRevenue: number;
  totalOrdersCount: number;
  totalProductsCount: number;
  totalUsersCount: number;
  lowStockProducts: any[];
  categorySales: any[];
  dailyChartStats: any[];
}

export default function AdminDashboardPage() {
  const { user, token } = useAuth();
  const [stats, setStats] = useState<StatData | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Active sub-tab state
  const [activeTab, setActiveTab] = useState<'metrics' | 'orders' | 'catalog' | 'users' | 'insights'>('metrics');

  // AI Insights states
  const [aiInsights, setAiInsights] = useState<string>('');
  const [loadingAI, setLoadingAI] = useState(false);

  // Form states to create Category
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatImg, setNewCatImg] = useState('');
  const [catMsg, setCatMsg] = useState('');

  // Form states to create Product
  const [newProdName, setNewProdName] = useState('');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdPrice, setNewProdPrice] = useState(0);
  const [newProdStock, setNewProdStock] = useState(0);
  const [newProdCat, setNewProdCat] = useState('');
  const [newProdImg, setNewProdImg] = useState('');
  const [prodMsg, setProdMsg] = useState('');

  // Wallet and Token adjustments states
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [selectedAdjustUser, setSelectedAdjustUser] = useState<any | null>(null);
  const [adjustField, setAdjustField] = useState<'wallet' | 'tokens'>('wallet');
  const [adjustType, setAdjustType] = useState<'credit' | 'debit'>('credit');
  const [adjustAmount, setAdjustAmount] = useState('');
  const [adjustDesc, setAdjustDesc] = useState('');
  const [adjustLoading, setAdjustLoading] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const statsRes = await API.get('/admin/stats');
      if (statsRes.data.success) setStats(statsRes.data.stats);

      const ordersRes = await API.get('/admin/orders');
      if (ordersRes.data.success) setOrders(ordersRes.data.orders);

      const catRes = await API.get('/categories');
      if (catRes.data.success) {
        setCategories(catRes.data.categories);
        if (catRes.data.categories.length > 0) {
          setNewProdCat(catRes.data.categories[0]._id);
        }
      }

      const usersRes = await API.get('/admin/users');
      if (usersRes.data.success) {
        setUsersList(usersRes.data.users);
      }
    } catch (error) {
      console.error('Failed to load admin dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateAIInsights = async () => {
    setLoadingAI(true);
    setAiInsights('');
    try {
      const { data } = await API.get('/admin/ai-insights');
      if (data.success) {
        setAiInsights(data.insights.insights || 'No insights retrieved.');
      }
    } catch (error) {
      console.error('Failed to generate insights:', error);
      setAiInsights('Could not establish secure AI connection to generate insights. Check API configuration.');
    } finally {
      setLoadingAI(false);
    }
  };

  useEffect(() => {
    if (token && user?.role === 'admin') {
      fetchDashboardData();
    }
  }, [token, user]);

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { data } = await API.put(`/admin/orders/${orderId}/status`, {
        status: newStatus,
        notes: `Order status shifted to ${newStatus} by admin portal.`
      });
      if (data.success) {
        fetchDashboardData();
        alert('Order status successfully updated!');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to update status.');
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName) return;
    setCatMsg('');
    try {
      const { data } = await API.post('/admin/categories', {
        name: newCatName,
        description: newCatDesc,
        image: newCatImg || undefined
      });
      if (data.success) {
        setCatMsg('Category added successfully!');
        setNewCatName('');
        setNewCatDesc('');
        setNewCatImg('');
        fetchDashboardData();
      }
    } catch (error: any) {
      setCatMsg(error.response?.data?.message || 'Error creating category.');
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice || !newProdCat) return;
    setProdMsg('');
    try {
      const { data } = await API.post('/admin/products', {
        name: newProdName,
        description: newProdDesc,
        price: newProdPrice,
        inventory: newProdStock,
        category: newProdCat,
        images: newProdImg ? [newProdImg] : undefined
      });
      if (data.success) {
        setProdMsg('Product created successfully!');
        setNewProdName('');
        setNewProdDesc('');
        setNewProdPrice(0);
        setNewProdStock(0);
        setNewProdImg('');
        fetchDashboardData();
      }
    } catch (error: any) {
      setProdMsg(error.response?.data?.message || 'Error creating product.');
    }
  };

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAdjustUser || !adjustAmount || Number(adjustAmount) <= 0) return;
    setAdjustLoading(true);
    try {
      const { data } = await API.post('/admin/wallet-tokens', {
        userId: selectedAdjustUser._id,
        field: adjustField,
        type: adjustType,
        amount: Number(adjustAmount),
        description: adjustDesc || `Admin manual adjustment (${adjustType} ${adjustField})`
      });
      if (data.success) {
        alert(data.message || 'Adjusted successfully!');
        setShowAdjustModal(false);
        setAdjustAmount('');
        setAdjustDesc('');
        fetchDashboardData();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Adjustment failed.');
    } finally {
      setAdjustLoading(false);
    }
  };

  if (!token || user?.role !== 'admin') {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center space-y-4">
        <div className="inline-flex p-4 rounded-full bg-rose-500/10 border border-rose-500/25 text-rose-500 mb-2">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-text-primary dark:text-white uppercase tracking-wider">Access Restricted</h2>
        <p className="text-xs text-text-secondary dark:text-slate-400 max-w-md mx-auto">
          This portal is reserved strictly for administrative personnel. Please log in with matching root privileges.
        </p>
        <Link href="/" className="px-6 py-2.5 bg-primary text-white rounded-full text-xs font-bold shadow-md hover:bg-blue-600 transition-colors inline-block">
          Go to Homepage
        </Link>
      </div>
    );
  }

  if (loading || !stats) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-xs text-text-secondary dark:text-slate-400 font-semibold tracking-wider uppercase">Accessing Administrative Archives...</p>
      </div>
    );
  }

  const categorySalesData = {
    labels: stats.categorySales.map(item => item.categoryName),
    datasets: [
      {
        label: 'Gross Revenues (INR)',
        data: stats.categorySales.map(item => item.revenue),
        backgroundColor: [
          'rgba(37, 99, 235, 0.7)',
          'rgba(124, 58, 237, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(239, 68, 68, 0.7)'
        ],
        borderColor: ['#2563EB', '#7C3AED', '#10B981', '#EF4444'],
        borderWidth: 1.5
      }
    ]
  };

  const dailyChartData = {
    labels: stats.dailyChartStats.map(item => item._id),
    datasets: [
      {
        label: 'Daily Sales Revenues (INR)',
        data: stats.dailyChartStats.map(item => item.revenue),
        backgroundColor: 'rgba(37, 99, 235, 0.25)',
        borderColor: '#2563EB',
        borderWidth: 2.5,
        fill: true,
        tension: 0.3
      }
    ]
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8 min-h-[85vh]">
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-200 dark:border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-black text-text-primary dark:text-white tracking-tight font-poppins">
            Admin Control Console
          </h1>
          <p className="text-xs text-text-secondary dark:text-slate-400 mt-1 font-medium">
            Monitor transaction records, manage catalogs, adjust wallets/tokens, and get AI business advice.
          </p>
        </div>

        {/* Dynamic Tab Switcher */}
        <div className="flex border border-slate-200 dark:border-white/10 bg-slate-100/50 dark:bg-slate-900 rounded-2xl p-1 text-xs w-full md:w-auto overflow-x-auto">
          {[
            { id: 'metrics', label: 'Metrics Board', icon: LayoutDashboard },
            { id: 'orders', label: 'Orders List', icon: ShoppingCart },
            { id: 'catalog', label: 'Catalog CRUD', icon: Package },
            { id: 'users', label: 'User Balances', icon: Users },
            { id: 'insights', label: 'Gemini Insights', icon: BrainCircuit }
          ].map((tab) => {
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-4.5 py-2 rounded-xl cursor-pointer transition-all whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'bg-primary text-white font-bold shadow-sm' 
                    : 'text-text-secondary dark:text-slate-400 hover:text-text-primary dark:hover:text-white font-semibold'
                }`}
              >
                <TabIcon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.2 }}
        >
          {/* TAB 1: METRICS BOARD */}
          {activeTab === 'metrics' && (
            <div className="space-y-8">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { icon: DollarSign, title: 'Gross Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, color: 'text-emerald-500' },
                  { icon: ShoppingCart, title: 'Total Orders', value: stats.totalOrdersCount, color: 'text-primary' },
                  { icon: Users, title: 'Regular Users', value: stats.totalUsersCount, color: 'text-secondary' },
                  { icon: Package, title: 'Active Products', value: stats.totalProductsCount, color: 'text-rose-500' }
                ].map((box, idx) => (
                  <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/60 dark:border-white/5 flex items-center gap-4.5 shadow-sm">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-950 flex items-center justify-center flex-shrink-0 border border-slate-200/50 dark:border-white/5">
                      <box.icon className={`w-6 h-6 ${box.color}`} />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-widest block font-black">{box.title}</span>
                      <span className="text-base font-black text-text-primary dark:text-white block mt-0.5">{box.value}</span>
                    </div>
                  </div>
                ))}
              </div>

              {stats.lowStockProducts.length > 0 && (
                <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-3xl p-6 space-y-4 shadow-sm">
                  <span className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5 font-poppins">
                    <AlertTriangle className="w-5 h-5 fill-current animate-pulse text-rose-500" />
                    Stock Depletion Warnings (Critical Lows)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {stats.lowStockProducts.slice(0, 3).map((prod, idx) => (
                      <div 
                        key={idx} 
                        className="bg-white dark:bg-slate-950/40 border border-rose-200/50 dark:border-rose-500/10 p-4 rounded-2xl flex justify-between items-center text-xs"
                      >
                        <span className="truncate max-w-[150px] font-bold text-text-primary dark:text-slate-200">{prod.name}</span>
                        <span className="bg-rose-500 text-white font-black px-2.5 py-1 rounded-lg text-[9px] uppercase tracking-wider">
                          {prod.inventory} Available
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-xs">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-white/5 space-y-4 shadow-sm">
                  <h3 className="font-black text-text-primary dark:text-white text-sm uppercase tracking-widest font-poppins">
                    Category Revenue Share
                  </h3>
                  <div className="h-64 flex justify-center items-center">
                    {stats.categorySales.length > 0 ? (
                      <Pie data={categorySalesData} options={{ responsive: true, maintainAspectRatio: false }} />
                    ) : (
                      <p className="text-slate-500 font-semibold italic">No data recorded.</p>
                    )}
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-white/5 space-y-4 shadow-sm">
                  <h3 className="font-black text-text-primary dark:text-white text-sm uppercase tracking-widest font-poppins">
                    Daily Sales Growth Chart
                  </h3>
                  <div className="h-64 flex justify-center items-center">
                    {stats.dailyChartStats.length > 0 ? (
                      <Bar data={dailyChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                    ) : (
                      <p className="text-slate-500 font-semibold italic">No recent sales data recorded.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ORDERS MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-white/5 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-black text-text-primary dark:text-white uppercase tracking-widest font-poppins">
                  Order Management Table
                </h3>
              </div>
              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left border-collapse min-w-[750px]">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200/60 dark:border-white/5 text-slate-500 uppercase tracking-widest text-[9px] font-black">
                      <th className="p-4.5">Invoice ID</th>
                      <th className="p-4.5">Customer details</th>
                      <th className="p-4.5">Grand Total</th>
                      <th className="p-4.5">Payment Status</th>
                      <th className="p-4.5">Dispatch Status</th>
                      <th className="p-4.5 text-center">Logistics Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((ord) => (
                      <tr key={ord._id} className="border-b border-slate-100 dark:border-white/5 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-950/20 text-text-secondary dark:text-slate-300 font-semibold transition-colors">
                        <td className="p-4.5 font-bold text-text-primary dark:text-white font-mono">INV-{ord._id.slice(-8).toUpperCase()}</td>
                        <td className="p-4.5">
                          <span className="block text-text-primary dark:text-white font-bold">{ord.user?.name || 'Unknown User'}</span>
                          <span className="text-[10px] text-slate-500">{ord.user?.email || 'N/A'}</span>
                        </td>
                        <td className="p-4.5 font-black text-text-primary dark:text-white">₹{ord.total.toLocaleString()}</td>
                        <td className="p-4.5">
                          <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                            ord.paymentStatus === 'paid'
                              ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20'
                              : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20'
                          }`}>
                            {ord.paymentStatus}
                          </span>
                        </td>
                        <td className="p-4.5">
                          <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                            ord.orderStatus === 'delivered'
                              ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20'
                              : ord.orderStatus === 'cancelled'
                              ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/20'
                              : 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20'
                          }`}>
                            {ord.orderStatus}
                          </span>
                        </td>
                        <td className="p-4.5 text-center">
                          <select
                            value={ord.orderStatus}
                            onChange={(e) => handleUpdateOrderStatus(ord._id, e.target.value)}
                            className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-2.5 py-1.5 text-[10px] text-text-primary dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer shadow-sm"
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: CATALOG CRUD */}
          {activeTab === 'catalog' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-white/5 shadow-sm space-y-4">
                <h3 className="font-black text-text-primary dark:text-white text-sm border-b border-slate-100 dark:border-white/5 pb-3 flex items-center gap-1.5 uppercase tracking-widest font-poppins">
                  <PlusCircle className="w-5 h-5 text-primary" />
                  Add New Category
                </h3>

                {catMsg && (
                  <p className={`p-3 border rounded-xl font-bold text-[11px] ${
                    catMsg.includes('successfully') 
                      ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
                      : 'bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400'
                  }`}>
                    {catMsg}
                  </p>
                )}

                <form onSubmit={handleCreateCategory} className="space-y-4 font-semibold">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 uppercase tracking-widest block font-black">Category Title</label>
                    <input
                      type="text"
                      required
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      placeholder="e.g. Ergonomic Office Wear"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-text-primary dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 uppercase tracking-widest block font-black">Description</label>
                    <textarea
                      rows={3}
                      value={newCatDesc}
                      onChange={(e) => setNewCatDesc(e.target.value)}
                      placeholder="e.g. Premium support products..."
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-text-primary dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 uppercase tracking-widest block font-black">Banner Image Link</label>
                    <input
                      type="text"
                      value={newCatImg}
                      onChange={(e) => setNewCatImg(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-text-primary dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-primary hover:bg-blue-600 text-white font-black rounded-xl shadow-md transition-colors uppercase tracking-wider text-[10px] cursor-pointer"
                  >
                    Save Category Node
                  </button>
                </form>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-white/5 shadow-sm space-y-4">
                <h3 className="font-black text-text-primary dark:text-white text-sm border-b border-slate-100 dark:border-white/5 pb-3 flex items-center gap-1.5 uppercase tracking-widest font-poppins">
                  <PlusCircle className="w-5 h-5 text-primary" />
                  Add New Product
                </h3>

                {prodMsg && (
                  <p className={`p-3 border rounded-xl font-bold text-[11px] ${
                    prodMsg.includes('successfully') 
                      ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
                      : 'bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400'
                  }`}>
                    {prodMsg}
                  </p>
                )}

                <form onSubmit={handleCreateProduct} className="space-y-3.5 font-semibold">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 uppercase tracking-widest block font-black">Product Title</label>
                    <input
                      type="text"
                      required
                      value={newProdName}
                      onChange={(e) => setNewProdName(e.target.value)}
                      placeholder="e.g. Chronos Master Watch"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-text-primary dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 uppercase tracking-widest block font-black">Description</label>
                    <textarea
                      rows={2}
                      value={newProdDesc}
                      onChange={(e) => setNewProdDesc(e.target.value)}
                      placeholder="e.g. Full automatic chronograph..."
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-text-primary dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 uppercase tracking-widest block font-black">Price (INR)</label>
                      <input
                        type="number"
                        required
                        value={newProdPrice || ''}
                        onChange={(e) => setNewProdPrice(Number(e.target.value))}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 uppercase tracking-widest block font-black">Stock Count</label>
                      <input
                        type="number"
                        required
                        value={newProdStock || ''}
                        onChange={(e) => setNewProdStock(Number(e.target.value))}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 uppercase tracking-widest block font-black">Category Link</label>
                    <select
                      value={newProdCat}
                      onChange={(e) => setNewProdCat(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer font-bold shadow-sm"
                    >
                      {categories.map((c) => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 uppercase tracking-widest block font-black">Product Image Link</label>
                    <input
                      type="text"
                      value={newProdImg}
                      onChange={(e) => setNewProdImg(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-text-primary dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-primary hover:bg-blue-600 text-white font-black rounded-xl shadow-md transition-colors uppercase tracking-wider text-[10px] cursor-pointer mt-2"
                  >
                    Save Product Node
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 4: USER WALLETS & TOKENS MANAGEMENT */}
          {activeTab === 'users' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-white/5 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-black text-text-primary dark:text-white uppercase tracking-widest font-poppins">
                  User Accounts, Wallets & Loyalty Tokens
                </h3>
              </div>
              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200/60 dark:border-white/5 text-slate-500 uppercase tracking-widest text-[9px] font-black">
                      <th className="p-4.5">User Details</th>
                      <th className="p-4.5">Role</th>
                      <th className="p-4.5">Wallet Balance</th>
                      <th className="p-4.5">Available Tokens</th>
                      <th className="p-4.5">Lifetime Tokens</th>
                      <th className="p-4.5 text-center">Management Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.map((usr) => (
                      <tr key={usr._id} className="border-b border-slate-100 dark:border-white/5 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-950/20 text-text-secondary dark:text-slate-300 font-semibold transition-colors">
                        <td className="p-4.5">
                          <span className="block text-text-primary dark:text-white font-bold">{usr.name}</span>
                          <span className="text-[10px] text-slate-500">{usr.email}</span>
                        </td>
                        <td className="p-4.5 capitalize">{usr.role}</td>
                        <td className="p-4.5 font-bold text-text-primary dark:text-white">₹{(usr.walletBalance || 0).toLocaleString()}</td>
                        <td className="p-4.5 font-bold text-text-primary dark:text-white">{usr.tokensAvailable || 0} SET</td>
                        <td className="p-4.5 font-bold text-text-primary dark:text-white">{usr.tokensLifetime || 0} SET</td>
                        <td className="p-4.5 text-center">
                          <button
                            onClick={() => {
                              setSelectedAdjustUser(usr);
                              setShowAdjustModal(true);
                            }}
                            className="px-3 py-1.5 bg-primary/10 text-primary dark:text-white rounded-lg hover:bg-primary/20 transition-all font-bold text-[10px]"
                          >
                            Adjust Balances
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: GEMINI AI INSIGHTS */}
          {activeTab === 'insights' && (
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/60 dark:border-white/5 shadow-sm space-y-6">
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-white/5 pb-4">
                <div className="space-y-1">
                  <h3 className="text-base font-black text-text-primary dark:text-white uppercase tracking-widest flex items-center gap-2 font-poppins">
                    <BrainCircuit className="w-5.5 h-5.5 text-secondary animate-pulse" />
                    Gemini Business Suggestions
                  </h3>
                  <p className="text-[11px] text-text-secondary dark:text-slate-450 font-semibold">
                    Let Gemini analyze sales volumes, inventories, and categories to offer store optimizations.
                  </p>
                </div>

                <button
                  onClick={generateAIInsights}
                  disabled={loadingAI}
                  className="px-5 py-2.5 bg-gradient-to-r from-primary to-secondary hover:opacity-90 disabled:opacity-50 text-white rounded-xl font-black text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {loadingAI ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Analyzing Metrics...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Generate AI Insights</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-6 bg-slate-50 dark:bg-slate-950/40 border border-slate-250/20 dark:border-white/5 rounded-2xl min-h-[250px] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(124,58,237,0.03),transparent_60%)]" />

                {loadingAI ? (
                  <div className="text-center space-y-3 z-10">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto text-primary" />
                    <p className="text-xs text-text-secondary dark:text-slate-400 font-bold uppercase tracking-widest">
                      Processing Sales Vectors & Inventory States...
                    </p>
                  </div>
                ) : aiInsights ? (
                  <div className="w-full text-xs text-text-secondary dark:text-slate-300 leading-relaxed font-semibold space-y-4 z-10 markdown-renderer select-text">
                    <div className="whitespace-pre-wrap">{aiInsights}</div>
                  </div>
                ) : (
                  <div className="text-center space-y-3 z-10 max-w-sm">
                    <BrainCircuit className="w-10 h-10 text-slate-400 mx-auto stroke-[1.2]" />
                    <h4 className="font-bold text-text-primary dark:text-white">AI Suggestion System Ready</h4>
                    <p className="text-xs text-text-secondary dark:text-slate-400">
                      Click the generate button above to extract business logs and run live optimization recommendations.
                    </p>
                  </div>
                )}
              </div>

            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Wallet / Token Adjustment Modal */}
      {showAdjustModal && selectedAdjustUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/50 dark:border-white/5 max-w-sm w-full space-y-5 mx-4">
            <div>
              <h3 className="font-black text-lg text-text-primary dark:text-white">Adjust Account Balances</h3>
              <p className="text-[11px] text-text-secondary dark:text-slate-400 mt-1">Adjust balance logs for user: <strong>{selectedAdjustUser.name}</strong></p>
            </div>

            <form onSubmit={handleAdjustSubmit} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Target Field</label>
                  <select
                    value={adjustField}
                    onChange={(e) => setAdjustField(e.target.value as any)}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-transparent dark:border-white/5 rounded-xl px-3 py-2 text-xs text-text-primary dark:text-white"
                  >
                    <option value="wallet">Wallet Balance</option>
                    <option value="tokens">Loyalty Tokens</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Action Type</label>
                  <select
                    value={adjustType}
                    onChange={(e) => setAdjustType(e.target.value as any)}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-transparent dark:border-white/5 rounded-xl px-3 py-2 text-xs text-text-primary dark:text-white"
                  >
                    <option value="credit">Credit (Add)</option>
                    <option value="debit">Debit (Deduct)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Amount</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 500"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-transparent dark:border-white/5 rounded-xl px-3.5 py-2.5 text-text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Reason / Description</label>
                <input
                  type="text"
                  placeholder="Manual credit adjustment"
                  value={adjustDesc}
                  onChange={(e) => setAdjustDesc(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-transparent dark:border-white/5 rounded-xl px-3.5 py-2.5 text-text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAdjustModal(false)}
                  className="flex-1 py-3 border border-slate-200 dark:border-white/10 rounded-xl font-bold text-text-secondary dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adjustLoading}
                  className="flex-1 py-3 bg-primary hover:bg-blue-600 text-white rounded-xl font-bold shadow-md flex items-center justify-center gap-1.5"
                >
                  {adjustLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Apply Adjustments'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
