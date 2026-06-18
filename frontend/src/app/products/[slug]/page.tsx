'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../context/AuthContext';
import { useCart } from '../../../context/CartContext';
import API from '../../../utils/api';
import { Star, ShoppingCart, Heart, Sparkles, Check, ChevronRight, MessageSquare, ShieldCheck, RefreshCw, Layers, Plus } from 'lucide-react';
import { Product, Review } from '../../../../../shared/types';

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const resolvedParams = use(params);
  const { slug } = resolvedParams;

  const { user, token } = useAuth();
  const { addToCart, toggleWishlist, isWishlisted } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Gallery image
  const [selectedImg, setSelectedImg] = useState('');
  const [zoomStyle, setZoomStyle] = useState({ display: 'none', backgroundPosition: '0% 0%' });

  // AI Summary state
  const [aiSummary, setAiSummary] = useState<{ summary: string; pros: string[]; cons: string[]; verdict: string } | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  // Review submission state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewMsg, setReviewMsg] = useState('');

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'highlights' | 'reviews'>('specs');

  // Frequently Bought Together Bundle state
  const [bundleItems, setBundleItems] = useState([
    { id: 'main', name: '', price: 0, checked: true, isMain: true },
    { id: 'accessory_1', name: 'Premium Leather Carry Pouch', price: 1499, checked: true, isMain: false },
    { id: 'accessory_2', name: '2 Year Extended Warranty Shield', price: 999, checked: true, isMain: false }
  ]);

  // Fetch Product details
  const fetchProductData = async () => {
    try {
      const { data } = await API.get(`/products/${slug}`);
      if (data.success) {
        setProduct(data.product);
        setReviews(data.reviews || []);
        if (data.product.images.length > 0) {
          setSelectedImg(data.product.images[0]);
        }
        // Update bundle main product name & price
        setBundleItems(prev => prev.map(item => item.isMain ? { ...item, name: data.product.name, price: data.product.price } : item));
      }
    } catch (error) {
      console.error('Failed to load product details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [slug]);

  // Zoom effect handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      display: 'block',
      backgroundPosition: `${x}% ${y}%`
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: 'none', backgroundPosition: '0% 0%' });
  };

  const handleSummarizeReviews = async () => {
    if (!product) return;
    setAiLoading(true);
    try {
      const { data } = await API.get(`/ai/summarize-reviews/${product._id}`);
      if (data.success) {
        setAiSummary(data);
      }
    } catch (error) {
      console.error('AI summary failed:', error);
    } finally {
      setAiLoading(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    
    setReviewSubmitting(true);
    setReviewMsg('');

    try {
      const { data } = await API.post(`/products/${product._id}/reviews`, {
        rating: reviewRating,
        title: reviewTitle,
        comment: reviewComment
      });

      if (data.success) {
        setReviewMsg('Review posted successfully!');
        setReviewTitle('');
        setReviewComment('');
        fetchProductData();
      }
    } catch (error: any) {
      setReviewMsg(error.response?.data?.message || 'Failed to submit review.');
    } finally {
      setReviewSubmitting(false);
    }
  };

  // Bundle pricing calculator
  const bundleTotalPrice = bundleItems.reduce((acc, item) => item.checked ? acc + item.price : acc, 0);

  const handleAddBundleToCart = () => {
    if (!product) return;
    // Add main item
    if (bundleItems[0].checked) {
      addToCart(product, 1);
    }
    // Add checked accessories
    if (bundleItems[1].checked) {
      addToCart({
        _id: 'bundle_pouch',
        name: 'Premium Leather Carry Pouch',
        slug: 'pouch',
        description: 'Premium Pouch Accessory',
        price: 1499,
        category: 'Minimalist Accessories',
        images: ['https://images.unsplash.com/photo-1527814050087-379526332c8e?auto=format&fit=crop&q=80&w=200'],
        inventory: 10
      } as any, 1);
    }
    if (bundleItems[2].checked) {
      addToCart({
        _id: 'bundle_warranty',
        name: '2 Year Extended Warranty Shield',
        slug: 'warranty',
        description: 'Warranty Accessory',
        price: 999,
        category: 'Minimalist Accessories',
        images: ['https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=200'],
        inventory: 10
      } as any, 1);
    }
    alert('Selected items from bundle added to cart!');
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center text-text-secondary dark:text-slate-400 font-bold">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-primary mb-2" />
        <p className="text-xs">Fetching Product Blueprint...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center text-text-secondary dark:text-slate-400 font-bold">
        <p className="text-sm">Product blueprint not found in catalog database.</p>
      </div>
    );
  }

  const wishlisted = isWishlisted(product._id);
  const specs = product.specifications ? Object.entries(product.specifications) : [];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-text-secondary dark:text-slate-400 font-bold">
        <Link href="/" className="hover:text-primary">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/products" className="hover:text-primary">Catalog</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-text-primary dark:text-white truncate max-w-[150px]">{product.name}</span>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Left Side: Images & Zoom Magnifier */}
        <div className="space-y-6">
          <div
            className="h-96 sm:h-[500px] rounded-3xl border border-slate-200/60 dark:border-white/5 bg-white dark:bg-slate-900/40 overflow-hidden relative cursor-zoom-in"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <img src={selectedImg || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600'} alt={product.name} className="w-full h-full object-cover" />
            
            {/* Magnifier glass overlay */}
            <div
              className="absolute pointer-events-none rounded-full border-2 border-primary/20 shadow-2xl w-44 h-44 z-20 bg-no-repeat bg-white dark:bg-slate-950"
              style={{
                ...zoomStyle,
                backgroundImage: `url(${selectedImg || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600'})`,
                backgroundSize: '250%',
                top: zoomStyle.display === 'block' ? 'auto' : 0,
                transform: 'translate(-50%, -50%)',
                left: zoomStyle.display === 'block' ? 'auto' : 0
              }}
            />

            {product.inventory === 0 && (
              <div className="absolute inset-0 bg-slate-950/75 flex items-center justify-center text-sm font-bold uppercase tracking-wider text-rose-500">
                Currently Sold Out
              </div>
            )}
          </div>

          {/* Gallery Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImg(img)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 bg-white dark:bg-slate-900 cursor-pointer transition-all ${
                    selectedImg === img ? 'border-primary shadow-md scale-95' : 'border-slate-200 dark:border-white/5 hover:border-slate-350 dark:hover:border-white/20'
                  }`}
                >
                  <img src={img} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: details and configure */}
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-1.5">
              <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-bold">Featured Hardware</span>
              <div className="flex items-center text-amber-500 gap-0.5 ml-2">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-xs font-bold text-text-primary dark:text-slate-200">
                  {product.ratings.average} ({product.ratings.count} reviews)
                </span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-text-primary dark:text-white leading-tight">
              {product.name}
            </h1>
            
            <p className="text-sm text-text-secondary dark:text-slate-350 leading-relaxed font-medium">
              {product.description}
            </p>
          </div>

          {/* Pricing & Stock status */}
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-white/5 rounded-3xl flex items-center justify-between shadow-sm">
            <div>
              <span className="text-xs text-text-secondary dark:text-slate-400 font-bold uppercase tracking-wider">Special price</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-text-primary dark:text-white">₹{product.price.toLocaleString()}</span>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <span className="text-sm text-text-secondary dark:text-slate-400 line-through">₹{product.compareAtPrice.toLocaleString()}</span>
                )}
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-text-secondary dark:text-slate-400 font-bold uppercase tracking-wider block">Inventory</span>
              <div className="mt-1">
                {product.inventory === 0 ? (
                  <span className="text-xs font-bold text-rose-500">Out of Stock</span>
                ) : product.inventory < 5 ? (
                  <span className="text-xs font-bold text-amber-500 animate-pulse">Low stock ({product.inventory} left!)</span>
                ) : (
                  <span className="text-xs font-bold text-emerald-600">Available / In Stock</span>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-4 items-end pt-3 border-t border-slate-200/60 dark:border-white/5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-secondary dark:text-slate-400 uppercase tracking-widest block">Quantity</label>
              <select
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl px-4 py-2.5 text-xs text-text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-primary font-bold shadow-sm"
                disabled={product.inventory === 0}
              >
                {Array.from({ length: Math.min(5, product.inventory || 1) }).map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
            </div>

            {/* Add to Cart */}
            <button
              onClick={() => addToCart(product, quantity)}
              disabled={product.inventory === 0}
              className="flex-1 py-3 bg-primary hover:bg-blue-600 disabled:bg-slate-100 disabled:text-slate-400 text-white font-bold text-xs rounded-2xl shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer disabled:cursor-not-allowed uppercase tracking-wider"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add to Shopping Cart</span>
            </button>

            {/* Wishlist */}
            <button
              onClick={() => toggleWishlist(product)}
              className={`w-12 h-12 rounded-2xl border flex items-center justify-center cursor-pointer transition-colors ${
                wishlisted
                  ? 'bg-rose-500 border-rose-500 text-white shadow-md'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 text-text-secondary dark:text-slate-400 hover:text-rose-500'
              }`}
            >
              <Heart className={`w-5 h-5 ${wishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>

        </div>
      </div>

      {/* Frequently Bought Together Bundle */}
      <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/60 dark:border-white/5 shadow-md space-y-6">
        <h3 className="font-bold text-lg text-text-primary dark:text-white flex items-center gap-1.5">
          <Layers className="w-5 h-5 text-primary" />
          Frequently Bought Together
        </h3>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex flex-wrap items-center gap-4 justify-center">
            {/* Current Item */}
            <div className="flex flex-col items-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-white/5 w-44 text-center">
              <img src={product.images[0]} className="w-16 h-16 object-cover rounded-xl" />
              <span className="text-[10px] font-bold text-text-primary dark:text-white line-clamp-1 mt-2">{product.name}</span>
              <span className="text-xs font-bold text-text-secondary dark:text-slate-400 mt-1">₹{product.price.toLocaleString()}</span>
            </div>

            <Plus className="w-5 h-5 text-slate-400" />

            {/* Accessory Item 1 */}
            <div className="flex flex-col items-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-white/5 w-44 text-center">
              <img src="https://images.unsplash.com/photo-1527814050087-379526332c8e?auto=format&fit=crop&q=80&w=200" className="w-16 h-16 object-cover rounded-xl" />
              <span className="text-[10px] font-bold text-text-primary dark:text-white line-clamp-1 mt-2">Leather Carry Pouch</span>
              <span className="text-xs font-bold text-text-secondary dark:text-slate-400 mt-1">₹1,499</span>
            </div>

            <Plus className="w-5 h-5 text-slate-400" />

            {/* Accessory Item 2 */}
            <div className="flex flex-col items-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-white/5 w-44 text-center">
              <img src="https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=200" className="w-16 h-16 object-cover rounded-xl" />
              <span className="text-[10px] font-bold text-text-primary dark:text-white line-clamp-1 mt-2">Extended Warranty</span>
              <span className="text-xs font-bold text-text-secondary dark:text-slate-400 mt-1">₹999</span>
            </div>
          </div>

          <div className="flex flex-col items-center lg:items-end justify-center space-y-4">
            <div className="space-y-2">
              {bundleItems.map((item, idx) => (
                <label key={item.id} className="flex items-center gap-2 text-xs font-semibold text-text-secondary dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={(e) => setBundleItems(prev => prev.map((it, i) => i === idx ? { ...it, checked: e.target.checked } : it))}
                    className="rounded accent-primary"
                    disabled={item.isMain}
                  />
                  <span>{item.isMain ? 'This Item' : item.name} (+₹{item.price.toLocaleString()})</span>
                </label>
              ))}
            </div>

            <div className="text-center lg:text-right">
              <span className="text-xs text-text-secondary dark:text-slate-400 block font-bold">Total Bundle Price</span>
              <span className="text-2xl font-black text-text-primary dark:text-white">₹{bundleTotalPrice.toLocaleString()}</span>
            </div>

            <button
              onClick={handleAddBundleToCart}
              className="px-6 py-3 bg-secondary hover:bg-purple-600 text-white rounded-full font-bold text-xs shadow-md hover:shadow-lg transition-all"
            >
              Add Selected Bundle Items to Cart
            </button>
          </div>
        </div>
      </section>

      {/* Tabs Layout */}
      <section className="space-y-6">
        <div className="flex border-b border-slate-200 dark:border-white/5 gap-6 text-sm font-bold">
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-3 border-b-2 transition-all ${activeTab === 'specs' ? 'border-primary text-primary' : 'border-transparent text-text-secondary dark:text-slate-400 hover:text-text-primary'}`}
          >
            Technical Specifications
          </button>
          <button
            onClick={() => setActiveTab('highlights')}
            className={`pb-3 border-b-2 transition-all ${activeTab === 'highlights' ? 'border-primary text-primary' : 'border-transparent text-text-secondary dark:text-slate-400 hover:text-text-primary'}`}
          >
            Product Highlights
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 border-b-2 transition-all ${activeTab === 'reviews' ? 'border-primary text-primary' : 'border-transparent text-text-secondary dark:text-slate-400 hover:text-text-primary'}`}
          >
            Reviews Feed ({reviews.length})
          </button>
        </div>

        <div>
          {activeTab === 'specs' && specs.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/60 dark:border-white/5 shadow-sm">
              <table className="w-full text-xs text-left border-collapse">
                <tbody>
                  {specs.map(([key, val], idx) => (
                    <tr key={idx} className="border-b border-slate-100 dark:border-white/5 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="p-4 font-bold text-text-secondary dark:text-slate-400 w-1/3 bg-slate-50/50 dark:bg-slate-900/50">{key}</td>
                      <td className="p-4 text-text-primary dark:text-white font-medium">{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'highlights' && product.features && (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-white/5 shadow-sm">
              <ul className="space-y-3">
                {product.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-text-secondary dark:text-slate-300 font-semibold">
                    <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form */}
              <div className="space-y-4">
                <h4 className="font-bold text-sm text-text-primary dark:text-white">Write a customer review</h4>
                {token ? (
                  <form onSubmit={handleReviewSubmit} className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/60 dark:border-white/5 space-y-4 text-xs shadow-sm">
                    {reviewMsg && (
                      <p className="p-2.5 bg-primary/10 border border-primary/20 text-primary rounded-xl font-bold">
                        {reviewMsg}
                      </p>
                    )}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-text-secondary dark:text-slate-400 uppercase tracking-widest block">Overall Rating</label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewRating(star)}
                            className={`p-1 cursor-pointer transition-colors ${star <= reviewRating ? 'text-amber-500' : 'text-slate-300 dark:text-slate-600'}`}
                          >
                            <Star className="w-5 h-5 fill-current" />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-text-secondary dark:text-slate-400 uppercase tracking-widest block">Title</label>
                      <input
                        type="text"
                        required
                        value={reviewTitle}
                        onChange={(e) => setReviewTitle(e.target.value)}
                        placeholder="e.g. Premium build quality, recommended!"
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-white/10 rounded-xl px-3 py-2.5 text-xs text-text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-text-secondary dark:text-slate-400 uppercase tracking-widest block">Comment Details</label>
                      <textarea
                        required
                        rows={4}
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="What do you like or dislike?"
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-white/10 rounded-xl px-3 py-2.5 text-xs text-text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={reviewSubmitting}
                      className="w-full py-2.5 bg-primary hover:bg-blue-600 text-white font-bold text-xs rounded-full shadow flex items-center justify-center gap-1.5 uppercase"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{reviewSubmitting ? 'Posting...' : 'Post Review'}</span>
                    </button>
                  </form>
                ) : (
                  <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-3xl text-center border border-slate-200/50 dark:border-white/5 text-text-secondary text-xs font-semibold">
                    Please <Link href="/login" className="text-primary hover:underline font-bold">login</Link> to write a customer review.
                  </div>
                )}
              </div>

              {/* Feed */}
              <div className="lg:col-span-2 space-y-4">
                <h4 className="font-bold text-sm text-text-primary dark:text-white">Customer Reviews</h4>
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  {reviews.length === 0 ? (
                    <div className="text-text-secondary dark:text-slate-500 text-xs py-10 text-center font-medium">
                      No verified reviews cataloged yet. Be the first to express opinion!
                    </div>
                  ) : (
                    reviews.map((rev) => (
                      <div key={rev._id} className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-white/5 rounded-3xl p-5 space-y-2 text-xs shadow-sm">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex gap-0.5 text-amber-500">
                              {Array.from({ length: rev.rating }).map((_, i) => (
                                <Star key={i} className="w-3.5 h-3.5 fill-current" />
                              ))}
                            </div>
                            <h4 className="font-bold text-text-primary dark:text-white mt-1.5">{rev.title}</h4>
                          </div>
                          <span className="text-[10px] text-text-secondary dark:text-slate-400 font-bold">
                            {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : 'Recent'}
                          </span>
                        </div>
                        <p className="text-text-secondary dark:text-slate-350 leading-relaxed font-medium">
                          {rev.comment}
                        </p>
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-white/5 text-[10px] text-text-secondary dark:text-slate-400 font-bold">
                          <span>Reviewed by: {rev.user?.name || 'Anonymous User'}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* AI Review Analysis */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 pb-3">
          <h2 className="text-lg font-bold text-text-primary dark:text-white flex items-center gap-1.5">
            <Sparkles className="w-5 h-5 text-secondary animate-pulse" />
            AI Opinion Summarizer
          </h2>
          {reviews.length > 0 && !aiSummary && (
            <button
              onClick={handleSummarizeReviews}
              disabled={aiLoading}
              className="text-xs bg-secondary/15 hover:bg-secondary/25 border border-secondary/35 px-4 py-2 rounded-full text-secondary font-bold cursor-pointer transition-all flex items-center gap-1.5"
            >
              {aiLoading ? 'Analyzing Reviews...' : 'Generate Gemini Summary'}
            </button>
          )}
        </div>

        {reviews.length === 0 ? (
          <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-3xl text-text-secondary text-xs text-center border border-slate-200/50 dark:border-white/5 font-semibold">
            Summarizer unavailable: No customer reviews are currently cataloged for this item.
          </div>
        ) : aiSummary ? (
          <div className="relative rounded-3xl border border-secondary/20 bg-secondary/5 p-6 space-y-4 overflow-hidden">
            <div className="relative z-10 space-y-2">
              <span className="text-[10px] font-black text-secondary uppercase tracking-widest flex items-center gap-1">
                <Sparkles className="w-4 h-4" />
                Gemini AI Consolidated Report
              </span>
              <p className="text-xs text-text-secondary dark:text-slate-350 leading-relaxed font-semibold">
                {aiSummary.summary}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
              <div className="space-y-2 p-4 bg-white/70 dark:bg-slate-950/40 rounded-2xl border border-emerald-500/10">
                <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest block border-b border-slate-100 dark:border-white/5 pb-1">Pros</span>
                <ul className="space-y-1 text-xs text-text-secondary dark:text-slate-300 font-semibold">
                  {aiSummary.pros.map((pro, i) => (
                    <li key={i} className="flex items-start gap-1">
                      <span className="text-emerald-500 font-bold">•</span>
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2 p-4 bg-white/70 dark:bg-slate-950/40 rounded-2xl border border-rose-500/10">
                <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest block border-b border-slate-100 dark:border-white/5 pb-1">Cons</span>
                <ul className="space-y-1 text-xs text-text-secondary dark:text-slate-300 font-semibold">
                  {aiSummary.cons.map((con, i) => (
                    <li key={i} className="flex items-start gap-1">
                      <span className="text-rose-500 font-bold">•</span>
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-4 bg-white/80 dark:bg-slate-950/60 rounded-2xl border border-secondary/15 text-xs text-text-secondary dark:text-slate-300 relative z-10 flex items-start gap-2 font-semibold">
              <ShieldCheck className="w-4.5 h-4.5 text-secondary flex-shrink-0 mt-0.5" />
              <span>
                <strong>Bottom Line Recommendation:</strong> {aiSummary.verdict}
              </span>
            </div>
          </div>
        ) : aiLoading ? (
          <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-3xl text-center border border-secondary/15">
            <RefreshCw className="w-6 h-6 text-secondary animate-spin mx-auto mb-2" />
            <p className="text-xs text-text-secondary font-bold">Gemini is processing customer feedback datasets...</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl text-text-secondary text-xs border border-slate-200/60 dark:border-white/5 flex justify-between items-center shadow-sm font-semibold">
            <span>Get an instantaneous consensus on pros, cons, and recommendations from customer review summaries.</span>
            <button onClick={handleSummarizeReviews} className="text-xs text-primary font-bold hover:underline cursor-pointer">
              Analyze Now &rarr;
            </button>
          </div>
        )}
      </section>

    </div>
  );
}

