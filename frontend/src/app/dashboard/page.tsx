'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import API from '../../utils/api';
import { Product, Category, Order, WalletTransaction, TokenTransaction } from '../../../../shared/types';
import { ProductCard } from '../../components/ProductCard';
import { ProductImage } from '../../components/ProductImage';
import { 
  Sparkles, SlidersHorizontal, Grid, List, RefreshCw, Wallet, 
  Coins, ShoppingBag, Heart, User, Settings, ArrowRight, Star, Plus,
  CreditCard, Award, ArrowUpRight, ArrowDownRight, MapPin, Eye, FileText, CheckCircle,
  X, Menu, LogOut, Bell, ShieldCheck, Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardPage() {
  const router = useRouter();
  const { user, token, logout, addAddress, deleteAddress } = useAuth();
  const { 
    addToCart, 
    setCartDrawerOpen, 
    cartItems, 
    updateQuantity, 
    getCartTotal 
  } = useCart();

  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'shop' | 'wallet' | 'tokens' | 'orders' | 'wishlist' | 'profile' | 'settings'>('shop');
  const [dashboardSidebarOpen, setDashboardSidebarOpen] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Products and Category State
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [isGridView, setIsGridView] = useState(true);

  // Filters State
  const [searchVal, setSearchVal] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState(120000);
  const [selectedStock, setSelectedStock] = useState('All');
  const [sortOption, setSortOption] = useState('newest');

  // Wallet & Tokens State
  const [walletBalance, setWalletBalance] = useState(5000);
  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>([]);
  const [tokensAvailable, setTokensAvailable] = useState(100);
  const [tokensLifetime, setTokensLifetime] = useState(100);
  const [tokenTransactions, setTokenTransactions] = useState<TokenTransaction[]>([]);
  const [addFundsAmount, setAddFundsAmount] = useState('');
  const [showAddFundsModal, setShowAddFundsModal] = useState(false);
  const [walletLoading, setWalletLoading] = useState(false);

  // Orders State
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [activeOrderDetails, setActiveOrderDetails] = useState<Order | null>(null);

  // Wishlist State
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [loadingWishlist, setLoadingWishlist] = useState(true);

  // Address form state
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'India',
    isDefault: false
  });

  // Redirect if not logged in
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken && !token) {
      router.push('/login');
    }
  }, [token, router]);

  // Fetch initial data
  useEffect(() => {
    if (token || localStorage.getItem('token')) {
      fetchCategories();
      fetchWalletAndTokens();
      fetchOrders();
      fetchWishlist();
    }
  }, [token]);

  // Fetch products when filters change
  useEffect(() => {
    if (token || localStorage.getItem('token')) {
      fetchFilteredProducts();
    }
  }, [selectedCategory, priceRange, selectedStock, sortOption, searchVal, token]);

  const fetchCategories = async () => {
    try {
      const { data } = await API.get('/categories');
      if (data.success) setCategories(data.categories);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const fetchFilteredProducts = async () => {
    setLoadingProducts(true);
    try {
      const queryParams = new URLSearchParams({
        sort: sortOption,
        maxPrice: priceRange.toString()
      });
      if (searchVal) queryParams.append('keyword', searchVal);
      if (selectedCategory) queryParams.append('category', selectedCategory);

      const { data } = await API.get(`/products?${queryParams.toString()}`);
      if (data.success) {
        let fetched: Product[] = data.products;

        // Apply client filters for stock
        if (selectedStock === 'InStock') {
          fetched = fetched.filter(p => p.inventory > 0);
        } else if (selectedStock === 'LowStock') {
          fetched = fetched.filter(p => p.inventory > 0 && p.inventory < 5);
        }
        setProducts(fetched);
      }
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchWalletAndTokens = async () => {
    try {
      const walletRes = await API.get('/wallet/details');
      if (walletRes.data.success) {
        setWalletBalance(walletRes.data.balance);
        setWalletTransactions(walletRes.data.transactions || []);
      }
      const tokenRes = await API.get('/tokens/details');
      if (tokenRes.data.success) {
        setTokensAvailable(tokenRes.data.tokensAvailable);
        setTokensLifetime(tokenRes.data.tokensLifetime);
        setTokenTransactions(tokenRes.data.transactions || []);
      }
    } catch (err) {
      console.error('Failed to fetch wallet/tokens:', err);
    }
  };

  const handleAddFunds = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addFundsAmount || Number(addFundsAmount) <= 0) return;
    setWalletLoading(true);
    try {
      const { data } = await API.post('/wallet/add-funds', { amount: Number(addFundsAmount) });
      if (data.success) {
        setWalletBalance(data.balance);
        setWalletTransactions(data.transactions || []);
        setShowAddFundsModal(false);
        setAddFundsAmount('');
      }
    } catch (err) {
      console.error('Failed to add funds:', err);
    } finally {
      setWalletLoading(false);
    }
  };

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const { data } = await API.get('/orders');
      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchWishlist = async () => {
    setLoadingWishlist(true);
    try {
      const { data } = await API.get('/wishlist');
      if (data.success) {
        setWishlist(data.wishlist.products || []);
      }
    } catch (err) {
      console.error('Failed to load wishlist:', err);
    } finally {
      setLoadingWishlist(false);
    }
  };

  const handleToggleWishlist = async (productId: string) => {
    try {
      const { data } = await API.post('/wishlist/toggle', { productId });
      if (data.success) {
        fetchWishlist();
      }
    } catch (err) {
      console.error('Failed to toggle wishlist:', err);
    }
  };

  const handleAddAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await addAddress(newAddress);
    if (success) {
      setShowAddressForm(false);
      setNewAddress({
        street: '',
        city: '',
        state: '',
        zip: '',
        country: 'India',
        isDefault: false
      });
    }
  };

  const handleDeleteAddressWithConfirm = async (id: string) => {
    if (confirm('Are you sure you want to delete this address?')) {
      await deleteAddress(id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-16 pt-2">
      {/* Background visual glow */}
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-primary/5 via-secondary/5 to-transparent pointer-events-none" />

      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 pt-4">
        
        {/* Mobile menu trigger bar */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-white/5 rounded-3xl premium-shadow mb-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDashboardSidebarOpen(true)}
              className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <Menu className="w-5 h-5 text-text-primary dark:text-white" />
            </button>
            <span className="text-xs font-black uppercase text-text-primary dark:text-white tracking-wider">
              {activeTab === 'shop' ? 'Shop Catalog' : activeTab === 'wallet' ? 'Wallet' : activeTab === 'tokens' ? 'Loyalty Tokens' : activeTab === 'orders' ? 'My Orders' : activeTab === 'wishlist' ? 'Wishlist' : activeTab === 'profile' ? 'Addresses' : 'Settings'}
            </span>
          </div>
          <div className="flex gap-2">
            <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-bold text-primary dark:text-blue-400 flex items-center gap-1">
              <Wallet className="w-3 h-3" /> ₹{walletBalance.toLocaleString()}
            </div>
            <div className="px-3 py-1 bg-secondary/10 border border-secondary/20 rounded-full text-[10px] font-bold text-secondary dark:text-purple-400 flex items-center gap-1">
              <Coins className="w-3 h-3" /> {tokensAvailable}
            </div>
          </div>
        </div>

        {/* Mobile Left Drawer Backdrop */}
        <AnimatePresence>
          {dashboardSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDashboardSidebarOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
            />
          )}
        </AnimatePresence>

        {/* 12-Column Responsive Dashboard Layout */}
        <div className="grid grid-cols-12 gap-6 items-start">
          
          {/* COLUMN 1: LEFT SIDEBAR (Profile + Wallet + Sidebar Navigation) */}
          <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 lg:bg-transparent lg:dark:bg-transparent p-6 lg:p-0 transform transition-transform duration-300 ease-in-out lg:relative lg:transform-none lg:translate-x-0 lg:z-auto lg:p-0 lg:w-auto lg:col-span-3 xl:col-span-2 border-r lg:border-r-0 border-slate-200/40 dark:border-white/5 ${
            dashboardSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:block'
          }`}>
            <div className="space-y-5 lg:sticky lg:top-24 h-full lg:h-auto overflow-y-auto lg:overflow-visible pb-16 lg:pb-0">
              
              {/* Close Button for mobile drawer */}
              <div className="flex lg:hidden justify-end border-b border-slate-100 dark:border-white/5 pb-2">
                <button
                  onClick={() => setDashboardSidebarOpen(false)}
                  className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-text-secondary dark:text-slate-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Compact User Profile Widget */}
              <div className="glassmorphism premium-shadow rounded-3xl p-4 border border-slate-200/40 dark:border-white/5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary text-white flex items-center justify-center font-bold text-sm shadow-sm flex-shrink-0">
                  {user?.name ? user.name[0] : 'U'}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-extrabold text-xs text-text-primary dark:text-white truncate">{user?.name || 'ShopEra User'}</h3>
                  <p className="text-[10px] text-text-secondary dark:text-slate-400 font-medium truncate mt-0.5">{user?.email}</p>
                </div>
              </div>

              {/* Wallet & Tokens Balances Widget */}
              <div className="glassmorphism premium-shadow rounded-3xl p-4 border border-slate-200/40 dark:border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-text-secondary dark:text-slate-400 tracking-wider">Balances</span>
                  <button
                    onClick={() => setShowAddFundsModal(true)}
                    className="text-[10px] text-primary hover:underline font-bold"
                  >
                    + Add
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-100/80 dark:border-white/5 rounded-2xl">
                    <span className="text-[9px] font-bold text-text-secondary dark:text-slate-400 flex items-center gap-1 mb-1">
                      <Wallet className="w-3.5 h-3.5 text-primary" /> Wallet
                    </span>
                    <p className="font-black text-xs text-text-primary dark:text-white">₹{walletBalance.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-100/80 dark:border-white/5 rounded-2xl">
                    <span className="text-[9px] font-bold text-text-secondary dark:text-slate-400 flex items-center gap-1 mb-1">
                      <Coins className="w-3.5 h-3.5 text-secondary animate-pulse" /> Tokens
                    </span>
                    <p className="font-black text-xs text-text-primary dark:text-white">{tokensAvailable}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[9px] text-text-secondary dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-white/5">
                  <span>Cashback Earned:</span>
                  <span className="font-extrabold text-emerald-600">₹{(tokensLifetime * 1).toLocaleString()}</span>
                </div>
              </div>

              {/* Compact Icon-Based Sidebar Menu */}
              <div className="glassmorphism premium-shadow rounded-3xl p-3 border border-slate-200/40 dark:border-white/5">
                <nav className="flex flex-col gap-1">
                  {[
                    { id: 'shop', label: 'Shop Catalog', icon: ShoppingBag },
                    { id: 'wallet', label: 'Wallet Console', icon: Wallet },
                    { id: 'tokens', label: 'SET Tokens', icon: Coins },
                    { id: 'orders', label: 'My Orders', icon: FileText, badge: orders.length },
                    { id: 'wishlist', label: 'Wishlist', icon: Heart, badge: wishlist.length },
                    { id: 'profile', label: 'Addresses', icon: MapPin },
                    { id: 'settings', label: 'Settings', icon: Settings },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => { setActiveTab(item.id as any); setDashboardSidebarOpen(false); }}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                          isActive
                            ? 'bg-primary text-white shadow-sm'
                            : 'text-text-secondary dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-950/60 hover:text-text-primary'
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{item.label}</span>
                        </span>
                        {item.badge ? (
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-text-secondary'}`}>
                            {item.badge}
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </nav>
              </div>

            </div>
          </div>

          {/* COLUMN 2: CENTER HUB (Product catalog, active tab panel switch) */}
          <div className={`col-span-12 ${activeTab === 'shop' ? 'lg:col-span-6 xl:col-span-7' : 'lg:col-span-9 xl:col-span-10'} space-y-6`}>
            <AnimatePresence mode="wait">
              
              {/* 1. SHOP CATALOG VIEW */}
              {activeTab === 'shop' && (
                <motion.div
                  key="shop"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6"
                >
                  {/* AI Recommendation Spotlight Banner */}
                  <div className="relative glassmorphism rounded-3xl p-5 border border-indigo-500/20 bg-gradient-to-r from-indigo-500/10 via-violet-500/5 to-transparent overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
                    <div className="flex items-start gap-3 relative z-10">
                      <div className="w-8 h-8 rounded-xl bg-indigo-600/10 text-indigo-500 flex items-center justify-center flex-shrink-0 border border-indigo-500/20">
                        <Sparkles className="w-4 h-4 animate-pulse" />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-wider">AI Intelligent Pick</span>
                        <h4 className="font-extrabold text-xs text-text-primary dark:text-white">Smart Hardware Suggestions</h4>
                        <p className="text-[10px] text-text-secondary dark:text-slate-400 leading-relaxed font-medium">
                          Hello {user?.name ? user.name.split(' ')[0] : 'Guest'}! Based on high-performance criteria, we recommend checking out the latest **Premium ANC Headphones** or **Chronos Smartwatches** featuring direct SET token loyalty discount opportunities.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Shop Header & Filters Header */}
                  <div className="glassmorphism premium-shadow rounded-3xl p-5 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h2 className="text-lg font-black text-text-primary dark:text-white">Shop Catalog</h2>
                        <p className="text-[10px] text-text-secondary dark:text-slate-400 mt-0.5">Explore premium electronics curated by Gemini intelligence</p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {/* Filter Toggle */}
                        <button
                          onClick={() => setFilterDrawerOpen(true)}
                          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-200/40 dark:border-white/5 rounded-full text-[10px] font-bold text-text-primary dark:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                        >
                          <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
                          <span>Filter & Search</span>
                        </button>

                        {/* Grid/List Toggle */}
                        <div className="flex bg-slate-100 dark:bg-slate-900 p-0.5 rounded-full border border-slate-200/40 dark:border-white/5">
                          <button 
                            onClick={() => setIsGridView(true)}
                            className={`p-1 rounded-full transition-all ${isGridView ? 'bg-primary text-white shadow-sm' : 'text-text-secondary dark:text-slate-400'}`}
                          >
                            <Grid className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => setIsGridView(false)}
                            className={`p-1 rounded-full transition-all ${!isGridView ? 'bg-primary text-white shadow-sm' : 'text-text-secondary dark:text-slate-400'}`}
                          >
                            <List className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Sort Dropdown */}
                        <select
                          value={sortOption}
                          onChange={(e) => setSortOption(e.target.value)}
                          className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-white/10 rounded-full px-3 py-1.5 text-[10px] text-text-primary dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                        >
                          <option value="newest">Newest Drops</option>
                          <option value="priceAsc">Price: Low to High</option>
                          <option value="priceDesc">Price: High to Low</option>
                          <option value="ratingDesc">Ratings</option>
                        </select>
                      </div>
                    </div>

                    {/* Horizontal Categories Badges Bar */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
                      <button
                        onClick={() => setSelectedCategory('')}
                        className={`text-[10px] px-3.5 py-1.5 rounded-full font-bold transition-all border flex-shrink-0 ${
                          !selectedCategory
                            ? 'bg-primary border-primary text-white shadow-sm'
                            : 'border-slate-200 dark:border-white/10 text-text-secondary dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        All Categories
                      </button>
                      {categories.map((cat) => (
                        <button
                          key={cat._id}
                          onClick={() => setSelectedCategory(cat.slug)}
                          className={`text-[10px] px-3.5 py-1.5 rounded-full font-bold transition-all border flex-shrink-0 ${
                            selectedCategory === cat.slug
                              ? 'bg-primary border-primary text-white shadow-sm'
                              : 'border-slate-200 dark:border-white/10 text-text-secondary dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Products Grid column: 4 per row on laptop (lg), 5 per row on desktop (xl/2xl) */}
                  <div>
                    {loadingProducts ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div key={i} className="h-80 rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse border border-slate-200/50 dark:border-white/5" />
                        ))}
                      </div>
                    ) : products.length === 0 ? (
                      <div className="glassmorphism p-12 text-center rounded-3xl space-y-4">
                        <p className="text-sm font-bold text-text-secondary dark:text-slate-400">No hardware matches your filter combinations.</p>
                        <button
                          onClick={() => {
                            setSelectedCategory('');
                            setPriceRange(120000);
                            setSelectedStock('All');
                            setSearchVal('');
                          }}
                          className="px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-full shadow-md hover:bg-blue-600 transition-all"
                        >
                          Reset Filters
                        </button>
                      </div>
                    ) : (
                      <div className={isGridView ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 items-stretch" : "flex flex-col gap-4"}>
                        {products.map(prod => (
                          <div key={prod._id} className="relative group h-full flex flex-col">
                            <div className="flex-1 h-full">
                              <ProductCard product={prod} />
                            </div>
                            <button 
                              onClick={() => handleToggleWishlist(prod._id)}
                              className="absolute top-4 right-4 z-25 p-2 rounded-full bg-white/80 dark:bg-slate-950/80 hover:bg-white dark:hover:bg-slate-900 border border-slate-200/50 dark:border-white/5 shadow-md transition-all cursor-pointer"
                            >
                              <Heart className={`w-4 h-4 ${wishlist.some(w => w._id === prod._id) ? 'fill-rose-500 text-rose-500' : 'text-text-secondary dark:text-slate-400'}`} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* 2. WALLET DETAILS VIEW */}
              {activeTab === 'wallet' && (
                <motion.div
                  key="wallet"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Balance & Add Money Card */}
                    <div className="md:col-span-1 glassmorphism premium-shadow rounded-3xl p-6 border border-slate-200/40 dark:border-white/5 flex flex-col justify-between h-[220px] bg-gradient-to-tr from-primary/10 via-transparent to-transparent">
                      <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary dark:text-slate-400">Available Balance</span>
                        <h2 className="text-3xl font-black text-text-primary dark:text-white">₹{walletBalance.toLocaleString()}</h2>
                      </div>
                      
                      <button
                        onClick={() => setShowAddFundsModal(true)}
                        className="w-full py-3 bg-primary hover:bg-blue-600 text-white rounded-full font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
                      >
                        <Plus className="w-4 h-4" /> Add Money to Wallet
                      </button>
                    </div>

                    {/* Quick Cashback highlight cards */}
                    <div className="md:col-span-2 glassmorphism premium-shadow rounded-3xl p-6 border border-slate-200/40 dark:border-white/5 space-y-4">
                      <h3 className="font-extrabold text-sm text-text-primary dark:text-white flex items-center gap-2">
                        <Award className="w-5 h-5 text-emerald-500" /> Wallet Privilege Program
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/10 text-emerald-700 dark:text-emerald-400 space-y-1">
                          <h4 className="font-black text-xs">Insta-Pay Gateway</h4>
                          <p className="text-[10px] leading-relaxed">Pay directly with 1 click using your ShopEra Wallet. Zero failure rates, instant refunds.</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/10 text-amber-700 dark:text-amber-400 space-y-1">
                          <h4 className="font-black text-xs">Cashback Loyalty</h4>
                          <p className="text-[10px] leading-relaxed">Top up at least ₹3,000 to instantly trigger automatic credit tokens inside your profile.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Transaction history list */}
                  <div className="glassmorphism premium-shadow rounded-3xl p-6 border border-slate-200/40 dark:border-white/5 space-y-4">
                    <h3 className="font-extrabold text-sm text-text-primary dark:text-white">Transaction Logs</h3>
                    
                    {walletTransactions.length === 0 ? (
                      <p className="text-xs text-text-secondary dark:text-slate-400 text-center py-6">No wallet transactions logged yet.</p>
                    ) : (
                      <div className="divide-y divide-slate-100 dark:divide-white/5">
                        {walletTransactions.map((tx, idx) => (
                          <div key={tx._id || idx} className="py-3.5 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.type === 'credit' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'}`}>
                                {tx.type === 'credit' ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                              </div>
                              <div>
                                <p className="font-bold text-text-primary dark:text-white">{tx.description}</p>
                                <p className="text-[10px] text-text-secondary dark:text-slate-400 font-medium">{new Date(tx.timestamp).toLocaleString()}</p>
                              </div>
                            </div>
                            <span className={`font-black text-sm ${tx.type === 'credit' ? 'text-emerald-500' : 'text-rose-500'}`}>
                              {tx.type === 'credit' ? '+' : '-'} ₹{tx.amount}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* 3. LOYALTY TOKENS VIEW */}
              {activeTab === 'tokens' && (
                <motion.div
                  key="tokens"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Token Status Premium Hologram Card */}
                    <div className="md:col-span-1 glassmorphism premium-shadow rounded-3xl p-6 border border-indigo-500/20 flex flex-col justify-between h-[220px] bg-gradient-to-tr from-indigo-500/20 via-transparent to-transparent relative overflow-hidden">
                      <div className="absolute -top-10 -right-10 w-28 h-28 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
                      <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">ShopEra Tokens (SET)</span>
                        <div className="flex items-center gap-2 mt-1">
                          <Coins className="w-8 h-8 text-amber-500 animate-spin" style={{ animationDuration: '3s' }} />
                          <h2 className="text-3xl font-black text-text-primary dark:text-white">{tokensAvailable}</h2>
                        </div>
                      </div>
                      
                      <div className="pt-2 border-t border-indigo-500/10">
                        <p className="text-[10px] text-text-secondary dark:text-slate-400 font-medium">Redemption Value: 1 SET = ₹1.00</p>
                        <p className="text-[10px] text-text-secondary dark:text-slate-400 font-medium">Lifetime Earned: <span className="font-extrabold text-primary">{tokensLifetime} SET</span></p>
                      </div>
                    </div>

                    {/* How to use Tokens explanation */}
                    <div className="md:col-span-2 glassmorphism premium-shadow rounded-3xl p-6 border border-slate-200/40 dark:border-white/5 space-y-4">
                      <h3 className="font-extrabold text-sm text-text-primary dark:text-white flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-indigo-500" /> Token Loyalty Perks
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 space-y-1">
                          <h4 className="font-bold text-text-primary dark:text-indigo-300">Earn On Every Purchase</h4>
                          <p className="text-[10px] text-text-secondary dark:text-slate-400 leading-relaxed font-medium">Receive 1 ShopEra Token (SET) for every ₹100 spent on eligible items. Cashback is calculated instantly upon delivery.</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 space-y-1">
                          <h4 className="font-bold text-text-primary dark:text-indigo-300">Redeem at Checkout</h4>
                          <p className="text-[10px] text-text-secondary dark:text-slate-400 leading-relaxed font-medium">Apply your tokens directly at checkout for flat cash discounts. No min/max limitations, stackable with coupons.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Token Transactions list */}
                  <div className="glassmorphism premium-shadow rounded-3xl p-6 border border-slate-200/40 dark:border-white/5 space-y-4">
                    <h3 className="font-extrabold text-sm text-text-primary dark:text-white">Token ledger</h3>
                    
                    {tokenTransactions.length === 0 ? (
                      <p className="text-xs text-text-secondary dark:text-slate-400 text-center py-6">No loyalty token transactions logged yet.</p>
                    ) : (
                      <div className="divide-y divide-slate-100 dark:divide-white/5">
                        {tokenTransactions.map((tx, idx) => (
                          <div key={tx._id || idx} className="py-3.5 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.type === 'earn' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'}`}>
                                {tx.type === 'earn' ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                              </div>
                              <div>
                                <p className="font-bold text-text-primary dark:text-white">{tx.description}</p>
                                <p className="text-[10px] text-text-secondary dark:text-slate-400 font-medium">{new Date(tx.timestamp).toLocaleString()}</p>
                              </div>
                            </div>
                            <span className={`font-black text-sm ${tx.type === 'earn' ? 'text-emerald-500' : 'text-rose-500'}`}>
                              {tx.type === 'earn' ? '+' : '-'} {tx.amount} SET
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* 4. ORDERS HISTORY VIEW */}
              {activeTab === 'orders' && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6"
                >
                  <div className="glassmorphism premium-shadow rounded-3xl p-6 border border-slate-200/40 dark:border-white/5 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4">
                      <div>
                        <h2 className="text-base font-black text-text-primary dark:text-white">Order History</h2>
                        <p className="text-[10px] text-text-secondary dark:text-slate-400 mt-0.5">Track and manage your hardware purchases</p>
                      </div>
                      <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-text-secondary dark:text-slate-350 rounded-full text-xs font-bold">
                        {orders.length} Total Orders
                      </span>
                    </div>

                    {loadingOrders ? (
                      <div className="space-y-4 py-8">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <div key={i} className="h-24 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-2xl" />
                        ))}
                      </div>
                    ) : orders.length === 0 ? (
                      <div className="text-center py-12 space-y-3">
                        <div className="inline-flex p-4 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200/40 dark:border-white/5 text-text-secondary">
                          <ShoppingBag className="w-8 h-8" />
                        </div>
                        <p className="text-sm font-bold text-text-secondary dark:text-slate-400">You haven't placed any orders yet.</p>
                        <button
                          onClick={() => setActiveTab('shop')}
                          className="px-5 py-2 bg-primary text-white text-xs font-bold rounded-full shadow-md"
                        >
                          Explore Products
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {orders.map((order) => (
                          <div key={order._id} className="border border-slate-200/40 dark:border-white/5 rounded-2xl overflow-hidden bg-white dark:bg-slate-900/50">
                            {/* Header details */}
                            <div className="p-4 bg-slate-50 dark:bg-slate-950/40 border-b border-slate-200/40 dark:border-white/5 flex flex-wrap justify-between items-center gap-3 text-xs">
                              <div className="flex flex-wrap gap-4 font-semibold text-text-secondary dark:text-slate-400">
                                <div>
                                  <span className="text-[10px] block uppercase text-slate-400 font-bold">Order Placed</span>
                                  <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div>
                                  <span className="text-[10px] block uppercase text-slate-400 font-bold">Total Amount</span>
                                  <span className="font-extrabold text-text-primary dark:text-white">₹{order.total.toLocaleString()}</span>
                                </div>
                                <div>
                                  <span className="text-[10px] block uppercase text-slate-400 font-bold">Order Reference</span>
                                  <span className="font-mono text-[11px] truncate max-w-[120px] block">{order._id}</span>
                                </div>
                              </div>

                              <div>
                                <span className={`uppercase px-3 py-1 rounded-full text-[9px] font-black ${
                                  order.orderStatus === 'delivered' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'
                                }`}>
                                  {order.orderStatus}
                                </span>
                              </div>
                            </div>

                            {/* Order items */}
                            <div className="p-4 space-y-3">
                              {order.items?.map((item, idx) => {
                                const prod = item.product as Product;
                                return (
                                  <div key={idx} className="flex gap-3 items-center justify-between text-xs">
                                    <div className="flex items-center gap-3 min-w-0">
                                      <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex-shrink-0 overflow-hidden flex items-center justify-center border border-slate-200/50 dark:border-white/5">
                                        {prod && typeof prod === 'object' && prod.images?.[0] ? (
                                          <ProductImage src={prod.images[0]} alt={prod.name} />
                                        ) : (
                                          <ShoppingBag className="w-6 h-6 text-slate-400" />
                                        )}
                                      </div>
                                      <div className="min-w-0">
                                        <p className="font-bold text-text-primary dark:text-white truncate">{(prod && typeof prod === 'object' && prod.name) || 'Product'}</p>
                                        <p className="text-[10px] text-text-secondary dark:text-slate-400 font-medium">Quantity: {item.quantity} &times; ₹{item.price.toLocaleString()}</p>
                                      </div>
                                    </div>
                                    <span className="font-extrabold text-text-primary dark:text-white flex-shrink-0">
                                      ₹{(item.price * item.quantity).toLocaleString()}
                                    </span>
                                  </div>
                                );
                              })}

                              {/* Stepper tracking tracker */}
                              <div className="pt-4 border-t border-slate-100 dark:border-white/5">
                                <div className="flex items-center justify-between max-w-lg mx-auto text-[9px] font-black uppercase text-slate-400 dark:text-slate-500">
                                  {[
                                    { label: 'Pending', active: true },
                                    { label: 'Processing', active: order.orderStatus !== 'pending' },
                                    { label: 'Shipped', active: ['shipped', 'delivered'].includes(order.orderStatus) },
                                    { label: 'Delivered', active: order.orderStatus === 'delivered' }
                                  ].map((step, idx, arr) => (
                                    <React.Fragment key={idx}>
                                      <div className="flex flex-col items-center gap-1">
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                                          step.active 
                                            ? 'bg-primary border-primary text-white' 
                                            : 'border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-900 text-slate-400'
                                        }`}>
                                          {step.active ? <CheckCircle className="w-3 h-3" /> : idx + 1}
                                        </div>
                                        <span className={step.active ? 'text-primary font-bold' : ''}>{step.label}</span>
                                      </div>
                                      {idx < arr.length - 1 && (
                                        <div className={`h-[2px] flex-1 bg-slate-200 dark:bg-slate-800 ${step.active && arr[idx+1].active ? 'bg-primary' : ''}`} />
                                      )}
                                    </React.Fragment>
                                  ))}
                                </div>
                              </div>

                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* 5. WISHLIST GRID VIEW */}
              {activeTab === 'wishlist' && (
                <motion.div
                  key="wishlist"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6"
                >
                  <div className="glassmorphism premium-shadow rounded-3xl p-6 border border-slate-200/40 dark:border-white/5 space-y-4">
                    <div>
                      <h2 className="text-base font-black text-text-primary dark:text-white">Your Wishlist</h2>
                      <p className="text-[10px] text-text-secondary dark:text-slate-400 mt-0.5">Saved items for future shopping sessions</p>
                    </div>

                    {loadingWishlist ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 py-6">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <div key={i} className="h-80 rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
                        ))}
                      </div>
                    ) : wishlist.length === 0 ? (
                      <div className="text-center py-12 space-y-3">
                        <div className="inline-flex p-4 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200/40 dark:border-white/5 text-text-secondary">
                          <Heart className="w-8 h-8" />
                        </div>
                        <p className="text-sm font-bold text-text-secondary dark:text-slate-400">Your wishlist is currently empty.</p>
                        <button
                          onClick={() => setActiveTab('shop')}
                          className="px-5 py-2 bg-primary text-white text-xs font-bold rounded-full shadow-md hover:bg-blue-600 transition-colors"
                        >
                          Browse Products
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                        {wishlist.map((prod) => (
                          <div key={prod._id} className="relative group">
                            <ProductCard product={prod} />
                            <button 
                              onClick={() => handleToggleWishlist(prod._id)}
                              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 shadow-md transition-all cursor-pointer"
                              title="Remove item"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* 6. SHIPPING ADDRESS MANAGER VIEW */}
              {activeTab === 'profile' && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6"
                >
                  <div className="glassmorphism premium-shadow rounded-3xl p-6 border border-slate-200/40 dark:border-white/5 space-y-5">
                    <div>
                      <h2 className="text-base font-black text-text-primary dark:text-white">Shipping Addresses</h2>
                      <p className="text-[10px] text-text-secondary dark:text-slate-400 mt-0.5">Manage delivery endpoints for your purchases</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {user?.addresses && user.addresses.length > 0 ? (
                        user.addresses.map((addr) => (
                          <div key={addr._id} className="flex justify-between items-start bg-white dark:bg-slate-900 p-4 border border-slate-200/50 dark:border-white/5 rounded-2xl text-xs text-text-secondary dark:text-slate-350 relative group">
                            <div className="font-semibold space-y-1">
                              <p className="font-extrabold text-text-primary dark:text-slate-100">{addr.street}</p>
                              <p>{addr.city}, {addr.state} - {addr.zip}</p>
                              <p className="text-[10px] text-slate-400">{addr.country}</p>
                            </div>
                            <button
                              onClick={() => addr._id && handleDeleteAddressWithConfirm(addr._id)}
                              className="text-slate-400 hover:text-rose-500 transition-colors p-1 cursor-pointer"
                              title="Remove Address"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-2 text-center py-6 text-xs text-text-secondary dark:text-slate-400 italic">
                          No saved addresses found. Add one below to speed up your checkout process.
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-white/5">
                      {!showAddressForm ? (
                        <button
                          onClick={() => setShowAddressForm(true)}
                          className="px-5 py-2.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Plus className="w-4 h-4" /> Add New Address
                        </button>
                      ) : (
                        <form onSubmit={handleAddAddressSubmit} className="space-y-4 max-w-lg">
                          <h3 className="font-extrabold text-xs text-text-primary dark:text-white uppercase tracking-wider">New Shipping Details</h3>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2 space-y-1 text-xs">
                              <label className="font-bold text-text-secondary dark:text-slate-400">Street Address</label>
                              <input
                                type="text"
                                required
                                value={newAddress.street}
                                onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                                placeholder="House no, Street Name, Landmark"
                                className="w-full bg-slate-100 dark:bg-slate-900 border border-transparent dark:border-white/5 rounded-xl px-3 py-2.5 text-xs text-text-primary dark:text-white"
                              />
                            </div>
                            <div className="space-y-1 text-xs">
                              <label className="font-bold text-text-secondary dark:text-slate-400">City</label>
                              <input
                                type="text"
                                required
                                value={newAddress.city}
                                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                                placeholder="E.g. Mumbai"
                                className="w-full bg-slate-100 dark:bg-slate-900 border border-transparent dark:border-white/5 rounded-xl px-3 py-2.5 text-xs text-text-primary dark:text-white"
                              />
                            </div>
                            <div className="space-y-1 text-xs">
                              <label className="font-bold text-text-secondary dark:text-slate-400">State</label>
                              <input
                                type="text"
                                required
                                value={newAddress.state}
                                onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                                placeholder="E.g. Maharashtra"
                                className="w-full bg-slate-100 dark:bg-slate-900 border border-transparent dark:border-white/5 rounded-xl px-3 py-2.5 text-xs text-text-primary dark:text-white"
                              />
                            </div>
                            <div className="space-y-1 text-xs">
                              <label className="font-bold text-text-secondary dark:text-slate-400">ZIP / PIN Code</label>
                              <input
                                type="text"
                                required
                                value={newAddress.zip}
                                onChange={(e) => setNewAddress({ ...newAddress, zip: e.target.value })}
                                placeholder="E.g. 400001"
                                className="w-full bg-slate-100 dark:bg-slate-900 border border-transparent dark:border-white/5 rounded-xl px-3 py-2.5 text-xs text-text-primary dark:text-white"
                              />
                            </div>
                            <div className="space-y-1 text-xs">
                              <label className="font-bold text-text-secondary dark:text-slate-400">Country</label>
                              <input
                                type="text"
                                required
                                value={newAddress.country}
                                onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                                placeholder="India"
                                className="w-full bg-slate-100 dark:bg-slate-900 border border-transparent dark:border-white/5 rounded-xl px-3 py-2.5 text-xs text-text-primary dark:text-white"
                              />
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => setShowAddressForm(false)}
                              className="px-4 py-2 border border-slate-200 dark:border-white/10 rounded-full text-xs font-bold text-text-secondary dark:text-slate-350"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-5 py-2 bg-primary text-white rounded-full text-xs font-bold shadow-md hover:bg-blue-600 transition-colors"
                            >
                              Save Address
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* 7. SETTINGS CONSOLE VIEW */}
              {activeTab === 'settings' && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6"
                >
                  <div className="glassmorphism premium-shadow rounded-3xl p-6 border border-slate-200/40 dark:border-white/5 space-y-6">
                    <div>
                      <h2 className="text-base font-black text-text-primary dark:text-white">Account Settings</h2>
                      <p className="text-[10px] text-text-secondary dark:text-slate-400 mt-0.5">Control your profile metrics and session configurations</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-semibold text-text-secondary dark:text-slate-350">
                      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl space-y-3 border border-slate-200/50 dark:border-white/5">
                        <h3 className="font-extrabold text-xs text-text-primary dark:text-white border-b border-slate-100 dark:border-white/5 pb-2">Profile Vitals</h3>
                        <div className="space-y-2.5">
                          <div>
                            <span className="text-[9px] uppercase text-slate-400 block font-bold">Display Name</span>
                            <span className="text-text-primary dark:text-white">{user?.name}</span>
                          </div>
                          <div>
                            <span className="text-[9px] uppercase text-slate-400 block font-bold">Primary Email</span>
                            <span className="text-text-primary dark:text-white">{user?.email}</span>
                          </div>
                          <div>
                            <span className="text-[9px] uppercase text-slate-400 block font-bold">System Role</span>
                            <span className="text-text-primary dark:text-white uppercase font-bold">{user?.role}</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl space-y-3 border border-slate-200/50 dark:border-white/5 flex flex-col justify-between">
                        <div>
                          <h3 className="font-extrabold text-xs text-text-primary dark:text-white border-b border-slate-100 dark:border-white/5 pb-2">Session Control</h3>
                          <p className="text-[10px] text-slate-500 leading-relaxed font-medium mt-2">Log out of your active browser session on this device. Your synced cart contents and tokens will remain secure.</p>
                        </div>
                        <button
                          onClick={() => { logout(); router.push('/'); }}
                          className="w-full py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-full font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" /> Sign Out from ShopEra
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* COLUMN 3: RIGHT PANEL (Cart Preview, Recent Orders, Store Alerts) */}
          {activeTab === 'shop' && (
            <div className="col-span-12 lg:col-span-3 xl:col-span-3 space-y-6">
              
              {/* Cart Preview Widget */}
              <div className="glassmorphism premium-shadow rounded-3xl p-5 border border-slate-200/40 dark:border-white/5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-3">
                  <h3 className="font-extrabold text-xs uppercase tracking-wider text-text-primary dark:text-white flex items-center gap-1.5">
                    <ShoppingBag className="w-4 h-4 text-secondary" /> Cart Preview
                  </h3>
                  <span className="bg-secondary/15 text-secondary px-2.5 py-0.5 rounded-full text-[9px] font-black">
                    {cartItems.reduce((acc, item) => acc + item.quantity, 0)} Items
                  </span>
                </div>

                {cartItems.length === 0 ? (
                  <div className="text-center py-6 space-y-2">
                    <p className="text-[11px] text-text-secondary dark:text-slate-400 font-semibold">Your shopping cart is currently empty.</p>
                    <button
                      onClick={() => setActiveTab('shop')}
                      className="text-[10px] text-primary font-bold hover:underline"
                    >
                      Browse items
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                      {cartItems.map((item) => (
                        <div key={item.product._id} className="flex items-center justify-between text-[11px] gap-2">
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            {item.product.images && item.product.images[0] ? (
                              <img
                                src={item.product.images[0]}
                                className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                                alt={item.product.name}
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 flex-shrink-0" />
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="font-bold text-text-primary dark:text-slate-200 truncate">{item.product.name}</p>
                              <p className="text-[9px] text-text-secondary dark:text-slate-500 font-medium">₹{item.product.price.toLocaleString()} &times; {item.quantity}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <button
                              onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                              className="w-5 h-5 bg-slate-100 dark:bg-slate-800 rounded flex items-center justify-center font-bold text-xs"
                            >
                              -
                            </button>
                            <span className="w-4 text-center font-bold text-[10px]">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                              className="w-5 h-5 bg-slate-100 dark:bg-slate-800 rounded flex items-center justify-center font-bold text-xs"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-white/5 space-y-2.5">
                      <div className="flex justify-between text-xs font-black text-text-primary dark:text-white">
                        <span>Cart Total:</span>
                        <span>₹{getCartTotal().toLocaleString()}</span>
                      </div>
                      <Link
                        href="/checkout"
                        className="block w-full text-center py-2 bg-primary hover:bg-blue-600 text-white rounded-full font-bold text-xs transition-all shadow-md"
                      >
                        Proceed to Checkout
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Recent Orders Widget */}
              <div className="glassmorphism premium-shadow rounded-3xl p-5 border border-slate-200/40 dark:border-white/5 space-y-3">
                <h3 className="font-extrabold text-xs uppercase tracking-wider text-text-primary dark:text-white border-b border-slate-100 dark:border-white/5 pb-2">
                  Recent Orders
                </h3>
                {orders.length === 0 ? (
                  <p className="text-[10px] text-text-secondary dark:text-slate-400 italic text-center py-3">No orders placed yet.</p>
                ) : (
                  <div className="space-y-3">
                    {orders.slice(0, 2).map((order) => (
                      <div key={order._id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-white/5 text-[10px] space-y-1.5">
                        <div className="flex justify-between font-bold">
                          <span className="truncate text-slate-500 max-w-[120px]">Ref: {order._id}</span>
                          <span className={`uppercase px-1.5 py-0.5 rounded text-[8px] font-black ${
                            order.orderStatus === 'delivered' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'
                          }`}>{order.orderStatus}</span>
                        </div>
                        <div className="flex justify-between font-extrabold text-text-primary dark:text-white">
                          <span>₹{order.total.toLocaleString()}</span>
                          <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="w-full text-center text-[10px] text-primary font-bold hover:underline"
                    >
                      View All Orders
                    </button>
                  </div>
                )}
              </div>

              {/* Store Alerts Widget */}
              <div className="glassmorphism premium-shadow rounded-3xl p-5 border border-slate-200/40 dark:border-white/5 space-y-3">
                <h3 className="font-extrabold text-xs uppercase tracking-wider text-text-primary dark:text-white border-b border-slate-100 dark:border-white/5 pb-2">
                  Store Alerts
                </h3>
                <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                  <div className="p-2.5 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 text-[10px] space-y-1">
                    <p className="font-bold text-indigo-700 dark:text-indigo-400 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Welcome Loyalty Reward!
                    </p>
                    <p className="text-[9px] text-text-secondary dark:text-slate-400 font-medium">Get up to 10% cash savings using SET tokens on checkout.</p>
                  </div>
                  <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-white/5 text-[10px] space-y-1">
                    <p className="font-bold text-text-primary dark:text-white">📦 AeroPro Audio Dispatch</p>
                    <p className="text-[9px] text-text-secondary dark:text-slate-400 font-medium">Latest ANC headphones series has been verified and stocked.</p>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>

      {/* Wallet Recharge Overlay Modal */}
      {showAddFundsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/50 dark:border-white/5 max-w-sm w-full space-y-5 mx-4">
            <div>
              <h3 className="font-black text-lg text-text-primary dark:text-white">Add Funds</h3>
              <p className="text-[11px] text-text-secondary dark:text-slate-400 mt-1">Simulate adding money to your ShopEra digital wallet</p>
            </div>

            <form onSubmit={handleAddFunds} className="space-y-4">
              <div className="space-y-1.5 text-xs">
                <label className="text-[10px] font-bold text-text-secondary dark:text-slate-400 uppercase tracking-widest">Amount (INR)</label>
                <input
                  type="number"
                  required
                  min="100"
                  max="50000"
                  placeholder="Enter recharge amount (e.g. ₹5,000)"
                  value={addFundsAmount}
                  onChange={(e) => setAddFundsAmount(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-transparent dark:border-white/5 rounded-full px-4 py-3 text-xs text-text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-primary font-bold"
                />
              </div>

              <div className="flex gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setShowAddFundsModal(false)}
                  className="flex-1 py-3 border border-slate-200 dark:border-white/10 rounded-full font-bold text-text-secondary dark:text-slate-350"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={walletLoading}
                  className="flex-1 py-3 bg-primary hover:bg-blue-600 text-white rounded-full font-bold shadow-md flex items-center justify-center gap-1.5"
                >
                  {walletLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'Confirm Topup'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Catalog Filters Drawer for Mobile/Tablet/Laptop */}
      <AnimatePresence>
        {filterDrawerOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFilterDrawerOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            {/* Drawer Content */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-80 max-w-full h-full bg-white dark:bg-slate-950 p-6 shadow-2xl overflow-y-auto flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-white/5 pb-4">
                  <span className="text-sm font-black text-text-primary dark:text-white flex items-center gap-1.5">
                    <SlidersHorizontal className="w-4 h-4 text-primary" /> Filter Options
                  </span>
                  <button
                    onClick={() => setFilterDrawerOpen(false)}
                    className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-text-secondary dark:text-slate-400"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-5">
                  {/* Search Input */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-text-secondary dark:text-slate-400">Search</label>
                    <input
                      type="text"
                      placeholder="Type hardware name..."
                      value={searchVal}
                      onChange={(e) => setSearchVal(e.target.value)}
                      className="w-full bg-slate-100 dark:bg-slate-900 border border-transparent dark:border-white/5 rounded-full px-4 py-2.5 text-xs text-text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  {/* Categories List */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-text-secondary dark:text-slate-400">Categories</label>
                    <div className="flex flex-col gap-1 max-h-52 overflow-y-auto pr-1">
                      <button
                        onClick={() => setSelectedCategory('')}
                        className={`text-left text-[11px] px-3 py-1.5 rounded-full transition-all ${
                          !selectedCategory ? 'bg-primary text-white font-bold' : 'text-text-secondary dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
                        }`}
                      >
                        All Categories
                      </button>
                      {categories.map((cat) => (
                        <button
                          key={cat._id}
                          onClick={() => setSelectedCategory(cat.slug)}
                          className={`text-left text-[11px] px-3 py-1.5 rounded-full transition-all ${
                            selectedCategory === cat.slug ? 'bg-primary text-white font-bold' : 'text-text-secondary dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
                          }`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-[9px] font-bold uppercase tracking-wider text-text-secondary dark:text-slate-400">
                      <span>Max Price</span>
                      <span>₹{priceRange.toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min="1000"
                      max="120000"
                      step="1000"
                      value={priceRange}
                      onChange={(e) => setPriceRange(Number(e.target.value))}
                      className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </div>

                  {/* Stock status */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-text-secondary dark:text-slate-400">Stock Availability</label>
                    <div className="flex flex-wrap gap-1">
                      {['All', 'InStock', 'LowStock'].map((stock) => (
                        <button
                          key={stock}
                          onClick={() => setSelectedStock(stock)}
                          className={`text-[10px] px-2.5 py-1 rounded-full font-bold transition-all border ${
                            selectedStock === stock
                              ? 'bg-primary border-primary text-white'
                              : 'border-slate-200 dark:border-white/10 text-text-secondary dark:text-slate-400'
                          }`}
                        >
                          {stock === 'InStock' ? 'In Stock' : stock === 'LowStock' ? 'Low Stock' : 'All'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200/50 dark:border-white/5 flex gap-2">
                <button
                  onClick={() => {
                    setSelectedCategory('');
                    setPriceRange(120000);
                    setSelectedStock('All');
                    setSearchVal('');
                  }}
                  className="flex-1 py-2.5 border border-slate-200 dark:border-white/10 rounded-full text-xs font-bold text-text-secondary dark:text-slate-300"
                >
                  Reset All
                </button>
                <button
                  onClick={() => setFilterDrawerOpen(false)}
                  className="flex-1 py-2.5 bg-primary text-white rounded-full text-xs font-bold shadow-md"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
