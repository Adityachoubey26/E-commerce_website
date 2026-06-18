'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import API from '../utils/api';
import { useAuth } from './AuthContext';
import { Product, CartItem, Coupon } from '../../../shared/types';

interface CartContextType {
  cartItems: CartItem[];
  wishlistItems: Product[];
  coupon: Coupon | null;
  discount: number;
  cartDrawerOpen: boolean;
  setCartDrawerOpen: (open: boolean) => void;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  toggleWishlist: (product: Product) => Promise<void>;
  isWishlisted: (productId: string) => boolean;
  getCartSubtotal: () => number;
  getCartTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, token } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [discount, setDiscount] = useState(0);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  // 1. Fetch Cart & Wishlist from Backend on Auth/Token update
  useEffect(() => {
    const fetchCartAndWishlist = async () => {
      if (token && user) {
        try {
          const cartRes = await API.get('/cart');
          if (cartRes.data.success && cartRes.data.cart) {
            setCartItems(cartRes.data.cart.items || []);
          }

          const wishRes = await API.get('/wishlist');
          if (wishRes.data.success && wishRes.data.wishlist) {
            setWishlistItems(wishRes.data.wishlist.products || []);
          }
        } catch (error) {
          console.error('Failed to sync Cart/Wishlist with server:', error);
        }
      } else {
        // Load local storage if guest
        const localCart = localStorage.getItem('guest_cart');
        if (localCart) {
          try { setCartItems(JSON.parse(localCart)); } catch (_) {}
        }
        setWishlistItems([]);
        setCoupon(null);
        setDiscount(0);
      }
    };
    fetchCartAndWishlist();
  }, [token, user]);

  // Sync guest cart to localstorage
  useEffect(() => {
    if (!token) {
      localStorage.setItem('guest_cart', JSON.stringify(cartItems));
    }
  }, [cartItems, token]);

  const getCartSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.product?.price || item.price) * item.quantity, 0);
  };

  const getCartTotal = () => {
    const subtotal = getCartSubtotal();
    return Math.max(0, subtotal - discount);
  };

  // Re-calculate discounts when items or subtotal changes
  useEffect(() => {
    if (coupon) {
      const subtotal = getCartSubtotal();
      if (subtotal < coupon.minPurchaseAmount) {
        setCoupon(null);
        setDiscount(0);
      } else {
        let amt = 0;
        if (coupon.discountType === 'percentage') {
          amt = (subtotal * coupon.discountValue) / 100;
          if (coupon.maxDiscountAmount) {
            amt = Math.min(amt, coupon.maxDiscountAmount);
          }
        } else {
          amt = coupon.discountValue;
        }
        setDiscount(amt);
      }
    } else {
      setDiscount(0);
    }
  }, [cartItems, coupon]);

  const addToCart = async (product: Product, quantity = 1) => {
    let newItems = [...cartItems];
    const exists = newItems.find(item => item.product._id === product._id);
    if (exists) {
      exists.quantity += quantity;
    } else {
      newItems.push({ product, quantity, price: product.price });
    }

    setCartItems(newItems);
    setCartDrawerOpen(true);

    if (token) {
      try {
        await API.post('/cart', {
          items: newItems.map(item => ({ product: item.product._id, quantity: item.quantity, price: item.product.price }))
        });
      } catch (error) {
        console.error('Error syncing cart:', error);
      }
    }
  };

  const removeFromCart = async (productId: string) => {
    const newItems = cartItems.filter(item => item.product._id !== productId);
    setCartItems(newItems);

    if (token) {
      try {
        await API.post('/cart', {
          items: newItems.map(item => ({ product: item.product._id, quantity: item.quantity, price: item.product.price }))
        });
      } catch (error) {
        console.error('Error syncing cart removal:', error);
      }
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      return removeFromCart(productId);
    }

    const newItems = cartItems.map(item => 
      item.product._id === productId ? { ...item, quantity } : item
    );
    setCartItems(newItems);

    if (token) {
      try {
        await API.post('/cart', {
          items: newItems.map(item => ({ product: item.product._id, quantity: item.quantity, price: item.product.price }))
        });
      } catch (error) {
        console.error('Error syncing cart quantity:', error);
      }
    }
  };

  const clearCart = async () => {
    setCartItems([]);
    setCoupon(null);
    setDiscount(0);
    if (token) {
      try {
        await API.post('/cart', { items: [] });
      } catch (error) {
        console.error('Error clearing cart:', error);
      }
    }
  };

  const applyCoupon = async (code: string) => {
    if (!token) {
      return { success: false, message: 'Please login to apply coupons' };
    }
    try {
      const subtotal = getCartSubtotal();
      const { data } = await API.post('/coupons/validate', { code, cartSubtotal: subtotal });
      if (data.success) {
        setCoupon(data.coupon);
        setDiscount(data.discountAmount);
        return { success: true, message: 'Coupon applied successfully!' };
      }
      return { success: false, message: data.message || 'Invalid coupon code' };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || 'Failed to validate coupon' };
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    setDiscount(0);
  };

  const toggleWishlist = async (product: Product) => {
    if (!token) {
      alert('Please log in to manage your wishlist!');
      return;
    }

    // Pessimistic state update
    try {
      const { data } = await API.post('/wishlist/toggle', { productId: product._id });
      if (data.success) {
        if (data.added) {
          setWishlistItems([...wishlistItems, product]);
        } else {
          setWishlistItems(wishlistItems.filter(item => item._id !== product._id));
        }
      }
    } catch (error) {
      console.error('Failed to toggle wishlist:', error);
    }
  };

  const isWishlisted = (productId: string) => {
    return wishlistItems.some(item => item._id === productId);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      wishlistItems,
      coupon,
      discount,
      cartDrawerOpen,
      setCartDrawerOpen,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      applyCoupon,
      removeCoupon,
      toggleWishlist,
      isWishlisted,
      getCartSubtotal,
      getCartTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
