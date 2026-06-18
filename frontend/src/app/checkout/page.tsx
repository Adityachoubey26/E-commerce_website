'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import API from '../../utils/api';
import { ShieldCheck, MapPin, CreditCard, Tag, Plus, Check, Loader2, Sparkles, X, ChevronRight, Lock, Coins, Wallet } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const { user, addAddress } = useAuth();
  const { cartItems, coupon, discount, getCartSubtotal, getCartTotal, clearCart } = useCart();

  // Stepper state: 1 = Address, 2 = Payment, 3 = Confirmation Review
  const [step, setStep] = useState(1);

  // Active address select index
  const [selectedAddrIndex, setSelectedAddrIndex] = useState(0);
  const [showAddressForm, setShowAddressForm] = useState(false);

  // Address form states
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [country, setCountry] = useState('India');

  // Checkout flow states
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'Razorpay' | 'Wallet'>('COD');
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // Wallet & Tokens Balance States
  const [walletBalance, setWalletBalance] = useState(0);
  const [tokensAvailable, setTokensAvailable] = useState(0);
  const [useTokens, setUseTokens] = useState(false);
  const [tokensToRedeem, setTokensToRedeem] = useState(0);

  // Simulated Razorpay Modal states
  const [showRazorpayModal, setShowRazorpayModal] = useState(false);
  const [razorpayOrderId, setRazorpayOrderId] = useState('');
  const [pendingOrderId, setPendingOrderId] = useState('');

  // Fetch balances
  useEffect(() => {
    const fetchBalances = async () => {
      try {
        const wRes = await API.get('/wallet/details');
        if (wRes.data.success) setWalletBalance(wRes.data.balance);
        const tRes = await API.get('/tokens/details');
        if (tRes.data.success) {
          setTokensAvailable(tRes.data.tokensAvailable);
        }
      } catch (err) {
        console.error('Failed to load wallet/token balances for checkout:', err);
      }
    };
    if (user) {
      fetchBalances();
    }
  }, [user]);

  if (cartItems.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center text-text-secondary dark:text-slate-400 font-bold">
        <p className="text-sm">Your cart is currently empty. Add items to checkout.</p>
        <Link href="/dashboard" className="text-xs text-primary hover:underline mt-2 inline-block font-black">Go to Catalog</Link>
      </div>
    );
  }

  // Calculate total before tokens redemption
  const getSubtotalWithCoupon = () => {
    return Math.max(0, getCartTotal());
  };

  // Get final total after tokens are applied
  const getFinalOrderTotal = () => {
    const subTotal = getSubtotalWithCoupon();
    if (!useTokens) return subTotal;
    const maxRedeemable = Math.floor(Math.min(tokensAvailable, subTotal));
    return Math.max(0, subTotal - maxRedeemable);
  };

  const getRedeemedTokensCount = () => {
    if (!useTokens) return 0;
    const subTotal = getSubtotalWithCoupon();
    return Math.floor(Math.min(tokensAvailable, subTotal));
  };

  const handleAddAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!street || !city || !state || !zip) return;
    const success = await addAddress({ street, city, state, zip, country, isDefault: false });
    if (success) {
      setShowAddressForm(false);
      setStreet('');
      setCity('');
      setState('');
      setZip('');
      if (user?.addresses) {
        setSelectedAddrIndex(user.addresses.length); // select the newly added address
      }
    } else {
      alert('Failed to save address.');
    }
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      alert('Please sign in to place an order.');
      router.push('/login');
      return;
    }

    const addr = user.addresses[selectedAddrIndex];
    if (!addr) {
      alert('Please select or add a shipping address.');
      return;
    }

    const finalTotal = getFinalOrderTotal();
    if (paymentMethod === 'Wallet' && walletBalance < finalTotal) {
      alert('Insufficient wallet balance to pay for this order. Please add funds first.');
      return;
    }

    setCheckoutLoading(true);

    try {
      const orderPayload = {
        items: cartItems.map(item => ({ product: item.product._id, quantity: item.quantity })),
        shippingAddress: addr,
        paymentMethod,
        couponCode: coupon ? coupon.code : undefined,
        useTokens: useTokens,
        tokensRedeemed: getRedeemedTokensCount()
      };

      const { data } = await API.post('/orders', orderPayload);

      if (data.success) {
        if (data.paymentRequired) {
          setRazorpayOrderId(data.razorpayOrder.id);
          setPendingOrderId(data.orderId);
          setShowRazorpayModal(true);
        } else {
          clearCart();
          router.push(`/dashboard`);
        }
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Order creation failed.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleSimulatedRazorpaySuccess = async () => {
    try {
      const { data } = await API.post('/orders/verify', {
        razorpayPaymentId: `pay_mock_${Math.random().toString(36).slice(2, 11)}`,
        razorpayOrderId: razorpayOrderId,
        razorpaySignature: 'mock_signature_approved',
        orderId: pendingOrderId
      });

      if (data.success) {
        setShowRazorpayModal(false);
        clearCart();
        router.push(`/dashboard`);
      }
    } catch (error) {
      console.error(error);
      alert('Failed to verify payment.');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8 relative">
      
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 pb-5">
        <h1 className="text-3xl font-black text-text-primary dark:text-white">Secure Checkout</h1>
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-600">
          <Lock className="w-4 h-4" />
          <span>SSL Encrypted</span>
        </div>
      </div>

      {/* Steps indicator */}
      <div className="flex flex-wrap items-center justify-center max-w-xl mx-auto gap-2 sm:gap-4 py-4">
        {[
          { num: 1, label: 'Shipping' },
          { num: 2, label: 'Payment' },
          { num: 3, label: 'Review' }
        ].map((s) => (
          <React.Fragment key={s.num}>
            <div className="flex items-center gap-2">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${step === s.num ? 'bg-primary text-white shadow-md' : step > s.num ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-text-secondary'}`}>
                {step > s.num ? <Check className="w-4.5 h-4.5" /> : s.num}
              </span>
              <span className={`text-xs font-bold ${step === s.num ? 'text-text-primary dark:text-white' : 'text-text-secondary'}`}>{s.label}</span>
            </div>
            {s.num < 3 && <ChevronRight className="w-4 h-4 text-text-secondary" />}
          </React.Fragment>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Form Content */}
        <div className="lg:col-span-2 space-y-6">
          
          {step === 1 && (
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/60 dark:border-white/5 shadow-md space-y-6">
              <h2 className="text-lg font-black text-text-primary dark:text-white flex items-center gap-1.5 uppercase tracking-wider text-xs">
                <MapPin className="w-4.5 h-4.5 text-primary" />
                1. Select Shipping Address
              </h2>

              {user?.addresses && user.addresses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {user.addresses.map((addr, idx) => (
                    <button
                      key={addr._id}
                      onClick={() => setSelectedAddrIndex(idx)}
                      className={`text-left p-5 rounded-2xl border text-xs relative cursor-pointer transition-all ${
                        selectedAddrIndex === idx
                          ? 'border-primary bg-primary/5 text-text-primary dark:text-white'
                          : 'border-slate-200 dark:border-white/10 hover:border-slate-350 dark:hover:border-white/20 text-text-secondary'
                      }`}
                    >
                      {selectedAddrIndex === idx && (
                        <span className="absolute top-3 right-3 bg-primary rounded-full p-0.5 text-white">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                      )}
                      <span className="font-bold block text-text-primary dark:text-white mb-2">Address Option {idx + 1}</span>
                      <p className="font-semibold">{addr.street}</p>
                      <p className="font-semibold">{addr.city}, {addr.state} - {addr.zip}</p>
                      <p className="font-semibold">{addr.country}</p>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-text-secondary italic">No addresses saved. Please add one below.</p>
              )}

              {!showAddressForm ? (
                <div className="flex justify-between items-center pt-4">
                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="text-xs text-primary hover:underline font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Address</span>
                  </button>
                  {user?.addresses && user.addresses.length > 0 && (
                    <button
                      onClick={() => setStep(2)}
                      className="px-6 py-2.5 bg-primary hover:bg-blue-600 text-white rounded-full font-bold text-xs transition-all shadow-md"
                    >
                      Proceed to Payment
                    </button>
                  )}
                </div>
              ) : (
                <form onSubmit={handleAddAddressSubmit} className="border-t border-slate-200/50 dark:border-white/5 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                  <div className="col-span-1 sm:col-span-2 space-y-1">
                    <label className="text-[10px] font-black text-text-secondary dark:text-slate-400 uppercase tracking-widest block">Street Address</label>
                    <input
                      type="text"
                      required
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="123 Tech Boulevard"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-white/10 rounded-xl px-4 py-2.5 text-text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-text-secondary dark:text-slate-400 uppercase tracking-widest block">City</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Bangalore"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-white/10 rounded-xl px-4 py-2.5 text-text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-text-secondary dark:text-slate-400 uppercase tracking-widest block">State</label>
                    <input
                      type="text"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="Karnataka"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-white/10 rounded-xl px-4 py-2.5 text-text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-text-secondary dark:text-slate-400 uppercase tracking-widest block">Pin Code</label>
                    <input
                      type="text"
                      required
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      placeholder="560001"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-white/10 rounded-xl px-4 py-2.5 text-text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-text-secondary dark:text-slate-400 uppercase tracking-widest block">Country</label>
                    <input
                      type="text"
                      required
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-white/10 rounded-xl px-4 py-2.5 text-text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="col-span-1 sm:col-span-2 flex justify-end gap-3 pt-3 border-t border-slate-200/60 dark:border-white/5">
                    <button
                      type="button"
                      onClick={() => setShowAddressForm(false)}
                      className="px-5 py-2.5 border border-slate-200 dark:border-white/10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-text-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-primary hover:bg-blue-600 rounded-full text-white font-bold"
                    >
                      Save Address
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/60 dark:border-white/5 shadow-md space-y-6">
              <h2 className="text-lg font-black text-text-primary dark:text-white flex items-center gap-1.5 uppercase tracking-wider text-xs">
                <CreditCard className="w-4.5 h-4.5 text-primary" />
                2. Select Payment Method
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { type: 'Wallet', label: 'ShopEra Wallet', desc: `Pay instantly using wallet. Balance: ₹${walletBalance}` },
                  { type: 'COD', label: 'Cash on Delivery (COD)', desc: 'Pay with cash upon package receipt.' },
                  { type: 'Razorpay', label: 'Online Gateway', desc: 'Pay instantly via UPI, Cards, Netbanking.' }
                ].map((pm) => (
                  <button
                    key={pm.type}
                    onClick={() => setPaymentMethod(pm.type as 'COD' | 'Razorpay' | 'Wallet')}
                    className={`text-left p-5 rounded-2xl border text-xs relative cursor-pointer transition-all ${
                      paymentMethod === pm.type
                        ? 'border-primary bg-primary/5 text-text-primary dark:text-white font-bold'
                        : 'border-slate-200 dark:border-white/10 hover:border-slate-350 dark:hover:border-white/20 text-text-secondary'
                    }`}
                  >
                    {paymentMethod === pm.type && (
                      <span className="absolute top-3 right-3 bg-primary rounded-full p-0.5 text-white">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    )}
                    <span className="font-bold block text-text-primary dark:text-white mb-1">{pm.label}</span>
                    <p className="text-[10px] text-text-secondary dark:text-slate-400 leading-relaxed font-semibold">{pm.desc}</p>
                  </button>
                ))}
              </div>

              {/* Loyalty Tokens Redemption Section */}
              {tokensAvailable > 0 && (
                <div className="p-5 rounded-2xl bg-purple-500/10 border border-purple-500/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-purple-700 dark:text-purple-400 flex items-center gap-1.5">
                      <Coins className="w-4 h-4 text-purple-600 animate-bounce" /> Apply ShopEra Loyalty Tokens
                    </span>
                    <span className="text-[10px] font-bold text-purple-600 bg-purple-100 dark:bg-purple-900/50 px-3 py-1 rounded-full">
                      {tokensAvailable} SET Available (₹{tokensAvailable})
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="applyTokens"
                      checked={useTokens}
                      onChange={(e) => setUseTokens(e.target.checked)}
                      className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 border-slate-300 dark:border-white/10 cursor-pointer"
                    />
                    <label htmlFor="applyTokens" className="text-xs font-bold text-text-primary dark:text-white cursor-pointer select-none">
                      Redeem tokens for discount on this order (1 Token = ₹1)
                    </label>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t border-slate-200/50 dark:border-white/5">
                <button
                  onClick={() => setStep(1)}
                  className="text-xs text-text-secondary hover:text-text-primary font-bold"
                >
                  Back to Address
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="px-6 py-2.5 bg-primary hover:bg-blue-600 text-white rounded-full font-bold text-xs shadow-md"
                >
                  Proceed to Review
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/60 dark:border-white/5 shadow-md space-y-6">
              <h2 className="text-lg font-black text-text-primary dark:text-white flex items-center gap-1.5 uppercase tracking-wider text-xs border-b border-slate-100 dark:border-white/5 pb-3">
                <ShieldCheck className="w-4.5 h-4.5 text-primary" />
                3. Final Review & Confirmation
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-text-secondary dark:text-slate-300 font-semibold">
                <div className="p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200/60 dark:border-white/5">
                  <h4 className="font-bold text-text-primary dark:text-white mb-2">Shipping Details</h4>
                  <p>{user?.addresses[selectedAddrIndex]?.street}</p>
                  <p>{user?.addresses[selectedAddrIndex]?.city}, {user?.addresses[selectedAddrIndex]?.state} - {user?.addresses[selectedAddrIndex]?.zip}</p>
                </div>
                <div className="p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200/60 dark:border-white/5">
                  <h4 className="font-bold text-text-primary dark:text-white mb-2">Payment Method</h4>
                  <p className="font-bold text-primary">
                    {paymentMethod === 'Wallet' 
                      ? 'ShopEra Digital Wallet Balance' 
                      : paymentMethod === 'COD' 
                      ? 'Cash on Delivery (COD)' 
                      : 'Razorpay Online Gateway'}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-200/50 dark:border-white/5">
                <button
                  onClick={() => setStep(2)}
                  className="text-xs text-text-secondary hover:text-text-primary font-bold"
                >
                  Back to Payment
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={checkoutLoading}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-full font-bold text-xs shadow-md flex items-center gap-1.5"
                >
                  {checkoutLoading ? (
                    <>
                      <Loader2 className="w-4.5 h-4.5 animate-spin" />
                      <span>Completing Order...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4.5 h-4.5" />
                      <span>Confirm & Place Order</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Right Summary column */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-white/5 shadow-md space-y-4 text-xs font-semibold">
            <h3 className="font-bold text-sm text-text-primary dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-white/5 pb-3">
              Order Summary
            </h3>

            {/* Item list */}
            <div className="space-y-3.5 max-h-48 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item.product._id} className="flex justify-between items-center text-text-secondary dark:text-slate-300">
                  <div className="max-w-[70%]">
                    <span className="font-bold text-text-primary dark:text-slate-200 line-clamp-1">{item.product.name}</span>
                    <span className="text-[10px] text-text-secondary dark:text-slate-500">
                      Qty: {item.quantity} × ₹{item.product.price.toLocaleString()}
                    </span>
                  </div>
                  <span className="font-black text-text-primary dark:text-white">
                    ₹{(item.quantity * item.product.price).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-white/5">
              <div className="flex justify-between text-text-secondary dark:text-slate-400">
                <span>Subtotal</span>
                <span>₹{getCartSubtotal().toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Discount Coupon</span>
                  <span>- ₹{discount.toLocaleString()}</span>
                </div>
              )}
              {useTokens && tokensAvailable > 0 && (
                <div className="flex justify-between text-purple-600 font-bold">
                  <span>Loyalty Discount</span>
                  <span>- ₹{getRedeemedTokensCount().toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-text-secondary dark:text-slate-400">
                <span>Shipping Fees</span>
                <span className="text-emerald-600 font-bold">FREE</span>
              </div>
              <div className="flex justify-between text-sm font-black text-text-primary dark:text-white pt-2.5 border-t border-slate-200/50 dark:border-white/5">
                <span>Total Amount</span>
                <span>₹{getFinalOrderTotal().toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Razorpay Gateway Simulation Modal */}
      {showRazorpayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm px-4">
          <div className="w-full max-w-sm rounded-3xl border border-primary/20 bg-slate-900 text-white overflow-hidden shadow-2xl space-y-6">
            {/* Header */}
            <div className="p-4 bg-primary text-white flex items-center justify-between text-xs font-bold uppercase tracking-widest">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4.5 h-4.5 animate-pulse" />
                Razorpay Checkout (Simulated)
              </span>
              <button onClick={() => setShowRazorpayModal(false)} className="hover:opacity-75 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Details */}
            <div className="p-6 space-y-4 text-xs text-center">
              <p className="text-slate-350 leading-relaxed font-semibold">
                Please click the button below to authorize the secure transaction and register payment approval signatures.
              </p>
              
              <div className="p-4 bg-slate-950/70 border border-white/5 rounded-2xl text-left space-y-1 font-semibold">
                <div className="flex justify-between text-slate-500">
                  <span>Merchant:</span>
                  <span>ShopEra Store</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Reference ID:</span>
                  <span className="font-mono text-white">{razorpayOrderId}</span>
                </div>
                <div className="flex justify-between font-black border-t border-white/5 pt-2 text-white">
                  <span>Payable Total:</span>
                  <span>₹{getFinalOrderTotal().toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handleSimulatedRazorpaySuccess}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 font-bold uppercase tracking-wider rounded-full cursor-pointer text-xs shadow-md transition-all text-white"
              >
                Approve & Pay Instantly
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
