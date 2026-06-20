'use client';

import React, { useEffect, useState, Suspense, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import API from '../../utils/api';
import { ProductCard } from '../../components/ProductCard';
import { ProductImage } from '../../components/ProductImage';
import { GitCompare, Sparkles, X, SlidersHorizontal, ArrowLeftRight, Grid, List, RefreshCw } from 'lucide-react';
import { Product, Category } from '../../../../shared/types';
import { motion, AnimatePresence } from 'framer-motion';

function ProductCatalogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Search/Filter queries state
  const keywordQuery = searchParams.get('keyword') || '';
  const categoryQuery = searchParams.get('category') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGridView, setIsGridView] = useState(true);
  
  // Active state filters
  const [selectedCategory, setSelectedCategory] = useState(categoryQuery);
  const [priceRange, setPriceRange] = useState(30000);
  const [minRating, setMinRating] = useState(0);
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedStock, setSelectedStock] = useState('All');
  const [sortOption, setSortOption] = useState('newest');
  
  // Infinite scroll simulation
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [scrollLoading, setScrollLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  // AI Comparison states
  const [compareList, setCompareList] = useState<Product[]>([]);
  const [compareResult, setCompareResult] = useState<string | null>(null);
  const [compareLoading, setCompareLoading] = useState(false);

  // Sync category state with search query URL
  useEffect(() => {
    setSelectedCategory(categoryQuery);
    setProducts([]);
    setPage(1);
    setHasMore(true);
  }, [categoryQuery]);

  // Fetch categories
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const { data } = await API.get('/categories');
        if (data.success) setCategories(data.categories);
      } catch (_) {}
    };
    fetchCats();
  }, []);

  // Fetch products
  const fetchFilteredProducts = async (pageToFetch: number, isAppend: boolean) => {
    if (pageToFetch === 1) setLoading(true);
    else setScrollLoading(true);

    try {
      const queryParams = new URLSearchParams({
        page: pageToFetch.toString(),
        limit: '9',
        sort: sortOption,
        maxPrice: priceRange.toString()
      });

      if (keywordQuery) queryParams.append('keyword', keywordQuery);
      if (selectedCategory) queryParams.append('category', selectedCategory);
      if (minRating > 0) queryParams.append('rating', minRating.toString());

      const { data } = await API.get(`/products?${queryParams.toString()}`);
      if (data.success) {
        let fetchedProducts: Product[] = data.products;
        
        // Brand & Stock client filters simulation
        if (selectedBrand !== 'All') {
          fetchedProducts = fetchedProducts.filter(p => p.tags?.some(t => t.toLowerCase() === selectedBrand.toLowerCase()) || p.name.toLowerCase().includes(selectedBrand.toLowerCase()));
        }
        if (selectedStock === 'InStock') {
          fetchedProducts = fetchedProducts.filter(p => p.inventory > 0);
        } else if (selectedStock === 'LowStock') {
          fetchedProducts = fetchedProducts.filter(p => p.inventory > 0 && p.inventory < 5);
        }

        if (isAppend) {
          setProducts(prev => [...prev, ...fetchedProducts]);
        } else {
          setProducts(fetchedProducts);
        }

        if (fetchedProducts.length === 0 || data.products.length < 9) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
      }
    } catch (error) {
      console.error('Failed to fetch filtered products:', error);
    } finally {
      setLoading(false);
      setScrollLoading(false);
    }
  };

  // Trigger fetch when query filters update
  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
    fetchFilteredProducts(1, false);
  }, [keywordQuery, selectedCategory, priceRange, minRating, selectedBrand, selectedStock, sortOption]);

  // Load more function for simulated infinite scroll
  const handleLoadMore = () => {
    if (!scrollLoading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchFilteredProducts(nextPage, true);
    }
  };

  // Compare selections
  const handleCompareSelect = (product: Product) => {
    const exists = compareList.find(p => p._id === product._id);
    if (exists) {
      setCompareList(prev => prev.filter(p => p._id !== product._id));
      setCompareResult(null);
    } else {
      if (compareList.length >= 2) {
        alert('You can only compare up to two products at a time!');
        return;
      }
      setCompareList(prev => [...prev, product]);
      setCompareResult(null);
    }
  };

  const handleLaunchCompare = async () => {
    if (compareList.length < 2) return;
    setCompareLoading(true);
    setCompareResult(null);
    try {
      const { data } = await API.post('/ai/compare', {
        productIdA: compareList[0]._id,
        productIdB: compareList[1]._id
      });
      if (data.success) {
        setCompareResult(data.comparisonText);
      } else {
        setCompareResult('Could not generate AI comparison at this moment.');
      }
    } catch (error) {
      console.error('AI comparison error:', error);
      setCompareResult('Error connecting to Gemini Comparison Service.');
    } finally {
      setCompareLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8 relative">
      
      {/* Title & Sorting */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/60 dark:border-white/5 pb-5">
        <div>
          <h1 className="text-3xl font-black text-text-primary dark:text-white">Explore Catalog</h1>
          {keywordQuery && (
            <p className="text-xs text-text-secondary dark:text-slate-400 mt-1">
              Search results for &ldquo;<strong className="text-primary">{keywordQuery}</strong>&rdquo;
            </p>
          )}
        </div>
        
        {/* Controls */}
        <div className="flex items-center gap-4">
          {/* Grid/List toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-full border border-slate-200/50 dark:border-white/5">
            <button
              onClick={() => setIsGridView(true)}
              className={`p-1.5 rounded-full transition-all ${isGridView ? 'bg-primary text-white' : 'text-text-secondary dark:text-slate-400 hover:text-text-primary'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsGridView(false)}
              className={`p-1.5 rounded-full transition-all ${!isGridView ? 'bg-primary text-white' : 'text-text-secondary dark:text-slate-400 hover:text-text-primary'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-text-secondary dark:text-slate-400 font-bold">Sort By:</span>
            <select
              value={sortOption}
              onChange={(e) => { setSortOption(e.target.value); }}
              className="bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-white/10 rounded-full px-4.5 py-2 text-xs text-text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-primary font-bold shadow-sm"
            >
              <option value="newest">Newest Drops</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
              <option value="ratingDesc">Ratings</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid Container */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Filters */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/60 dark:border-white/5 shadow-md h-fit space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-3">
            <span className="text-sm font-black text-text-primary dark:text-white flex items-center gap-1.5">
              <SlidersHorizontal className="w-4 h-4 text-primary" />
              Advanced Filters
            </span>
            <button
              onClick={() => {
                setSelectedCategory('');
                setPriceRange(30000);
                setMinRating(0);
                setSelectedBrand('All');
                setSelectedStock('All');
                router.push('/products');
              }}
              className="text-xs text-primary hover:underline font-bold cursor-pointer"
            >
              Reset All
            </button>
          </div>

          {/* Categories select */}
          <div className="space-y-2.5">
            <label className="text-[10px] font-black text-text-secondary dark:text-slate-400 uppercase tracking-widest block">Categories</label>
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => setSelectedCategory('')}
                className={`text-left text-xs px-3.5 py-2.5 rounded-full transition-all ${
                  !selectedCategory
                    ? 'bg-primary text-white font-bold shadow-md'
                    : 'text-text-secondary dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold'
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => setSelectedCategory(cat._id)}
                  className={`text-left text-xs px-3.5 py-2.5 rounded-full transition-all ${
                    selectedCategory === cat._id
                      ? 'bg-primary text-white font-bold shadow-md'
                      : 'text-text-secondary dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Brands */}
          <div className="space-y-2.5">
            <label className="text-[10px] font-black text-text-secondary dark:text-slate-400 uppercase tracking-widest block">Brands</label>
            <div className="flex flex-col gap-1.5">
              {['All', 'AeroPro', 'Chronos', 'HyperDrive'].map((b) => (
                <button
                  key={b}
                  onClick={() => setSelectedBrand(b)}
                  className={`text-left text-xs px-3.5 py-2.5 rounded-full transition-all ${
                    selectedBrand === b
                      ? 'bg-secondary text-white font-bold shadow-md'
                      : 'text-text-secondary dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="space-y-2.5">
            <label className="text-[10px] font-black text-text-secondary dark:text-slate-400 uppercase tracking-widest block">Availability</label>
            <div className="flex flex-col gap-1.5">
              {[
                { label: 'All Items', value: 'All' },
                { label: 'In Stock Only', value: 'InStock' },
                { label: 'Low Stock Warnings', value: 'LowStock' }
              ].map((s) => (
                <button
                  key={s.value}
                  onClick={() => setSelectedStock(s.value)}
                  className={`text-left text-xs px-3.5 py-2.5 rounded-full transition-all ${
                    selectedStock === s.value
                      ? 'bg-emerald-600 text-white font-bold shadow-md'
                      : 'text-text-secondary dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-2.5">
            <div className="flex justify-between text-[10px] font-black text-text-secondary dark:text-slate-400 uppercase tracking-widest">
              <span>Price Range</span>
              <span className="text-text-primary dark:text-white normal-case font-bold">₹{priceRange.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="1000"
              max="30000"
              step="500"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-primary h-1 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Ratings selector */}
          <div className="space-y-2.5">
            <label className="text-[10px] font-black text-text-secondary dark:text-slate-400 uppercase tracking-widest block">Minimum Rating</label>
            <div className="flex flex-col gap-1.5">
              {[0, 4, 3].map((r) => (
                <button
                  key={r}
                  onClick={() => setMinRating(r)}
                  className={`text-left text-xs px-3.5 py-2.5 rounded-full transition-all flex items-center gap-1 ${
                    minRating === r
                      ? 'bg-primary text-white font-bold shadow-md'
                      : 'text-text-secondary dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold'
                  }`}
                >
                  {r === 0 ? 'Any Rating' : `${r}.0 ★ & Above`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid / List */}
        <div className="lg:col-span-3 space-y-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="h-[400px] rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 text-center py-20 rounded-3xl text-text-secondary dark:text-slate-400 border border-slate-200/60 dark:border-white/5 shadow-md space-y-3">
              <SlidersHorizontal className="w-12 h-12 stroke-[1.5] text-slate-400 mx-auto animate-bounce" />
              <h3 className="font-bold text-lg text-text-primary dark:text-white">No products found</h3>
              <p className="text-xs">Try resetting filters or adjusting search keyword terms.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {isGridView ? (
                <motion.div 
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  <AnimatePresence>
                    {products.map((prod, idx) => (
                      <motion.div
                        key={prod._id}
                        initial={{ opacity: 0, y: 20, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.5, delay: (idx % 9) * 0.05, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <ProductCard
                          product={prod}
                          onCompareSelect={handleCompareSelect}
                          isComparing={compareList.some(p => p._id === prod._id)}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  {products.map((prod) => (
                    <div key={prod._id} className="flex flex-col sm:flex-row bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-white/5 p-4 rounded-3xl gap-6 items-center shadow-md hover:shadow-xl transition-all w-full">
                      <div className="w-40 h-40 overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-950 flex-shrink-0">
                        <ProductImage src={prod.images[0]} alt={prod.name} />
                      </div>
                      <div className="flex-1 space-y-2 text-center sm:text-left">
                        <h3 className="text-lg font-bold text-text-primary dark:text-white">{prod.name}</h3>
                        <p className="text-xs text-text-secondary dark:text-slate-400 line-clamp-2 leading-relaxed">{prod.description}</p>
                        <div className="flex items-center justify-center sm:justify-start gap-1">
                          <span className="text-base font-black text-text-primary dark:text-white">₹{prod.price.toLocaleString()}</span>
                          {prod.compareAtPrice && (
                            <span className="text-xs text-text-secondary dark:text-slate-400 line-through">₹{prod.compareAtPrice.toLocaleString()}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-row sm:flex-col gap-2 flex-shrink-0 w-full sm:w-auto">
                        <button
                          onClick={() => handleCompareSelect(prod)}
                          className="flex-1 sm:flex-initial px-4 py-2 border border-slate-200 dark:border-white/10 rounded-full text-xs font-bold text-text-primary dark:text-white hover:border-primary transition-all"
                        >
                          Compare
                        </button>
                        <Link
                          href={`/products/${prod.slug}`}
                          className="flex-1 sm:flex-initial text-center px-4 py-2 bg-primary hover:bg-blue-600 text-white rounded-full text-xs font-bold transition-all shadow"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Load More for Infinite Scroll */}
              {hasMore && (
                <div className="flex justify-center pt-4" ref={loaderRef}>
                  <button
                    onClick={handleLoadMore}
                    disabled={scrollLoading}
                    className="px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-text-primary dark:text-white text-xs font-bold rounded-full transition-all shadow-md flex items-center gap-2 hover:border-primary disabled:opacity-50"
                  >
                    {scrollLoading ? (
                      <>
                        <RefreshCw className="w-4.5 h-4.5 animate-spin text-primary" />
                        <span>Loading next products...</span>
                      </>
                    ) : (
                      <span>Load More Products</span>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

      </div>

      {/* AI Comparison Sticky Widget */}
      {compareList.length > 0 && (
        <div className="fixed bottom-6 left-6 z-40 w-[350px] sm:w-[480px]">
          <div className="glassmorphism shadow-2xl rounded-3xl overflow-hidden border border-primary/20 flex flex-col max-h-[400px]">
            {/* Header */}
            <div className="p-4 bg-primary text-white flex items-center justify-between text-xs font-bold uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <GitCompare className="w-4 h-4" />
                AI Product Comparison ({compareList.length}/2)
              </span>
              <button
                onClick={() => { setCompareList([]); setCompareResult(null); }}
                className="hover:opacity-75 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content list */}
            <div className="p-4 space-y-3 overflow-y-auto flex-1 bg-white/95 dark:bg-slate-950/95 text-text-primary dark:text-white">
              <div className="flex gap-2">
                {compareList.map((p) => (
                  <div key={p._id} className="flex-1 bg-slate-50 dark:bg-slate-900 p-2.5 rounded-2xl border border-slate-200/50 dark:border-white/5 relative flex items-center gap-2">
                    <div className="w-8 h-8 rounded overflow-hidden bg-slate-900 flex-shrink-0">
                      <ProductImage src={p.images[0]} alt={p.name} />
                    </div>
                    <span className="text-[10px] font-bold truncate flex-1">{p.name}</span>
                    <button
                      onClick={() => handleCompareSelect(p)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-white/10 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {compareList.length === 1 && (
                  <div className="flex-1 border border-dashed border-slate-350 dark:border-white/10 rounded-2xl p-2.5 flex items-center justify-center text-[10px] text-text-secondary">
                    Add another product to compare...
                  </div>
                )}
              </div>

              {/* Action */}
              {compareList.length === 2 && !compareResult && (
                <button
                  onClick={handleLaunchCompare}
                  disabled={compareLoading}
                  className="w-full py-2.5 bg-secondary hover:bg-purple-600 disabled:opacity-50 text-xs font-bold uppercase tracking-wider rounded-full cursor-pointer flex items-center justify-center gap-1.5 text-white shadow-md"
                >
                  <Sparkles className="w-4 h-4 text-white animate-pulse" />
                  {compareLoading ? 'Generating AI Analysis...' : 'Start AI Analysis'}
                </button>
              )}

              {/* Results */}
              {compareResult && (
                <div className="border-t border-slate-200/60 dark:border-white/5 pt-3 text-xs leading-relaxed text-text-secondary dark:text-slate-300 select-text p-2.5 bg-slate-50 dark:bg-slate-900/60 rounded-2xl">
                  <span className="text-secondary font-black block mb-1 flex items-center gap-1 uppercase text-[10px] tracking-wider">
                    <ArrowLeftRight className="w-3.5 h-3.5" />
                    Gemini AI Report
                  </span>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    {compareResult.split('\n').map((line, idx) => {
                      if (line.startsWith('###')) return <h4 key={idx} className="font-bold text-text-primary dark:text-white mt-2 mb-1">{line.replace('###', '')}</h4>;
                      return <p key={idx}>{line}</p>;
                    })}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default function ProductCatalog() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-text-secondary text-xs font-bold">Loading Search Context...</div>}>
      <ProductCatalogContent />
    </Suspense>
  );
}

