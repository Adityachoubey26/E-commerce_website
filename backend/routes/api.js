import express from 'express';
import { signupUser, loginUser, getProfile, addAddress, deleteAddress, forgotPassword } from '../controllers/authController.js';
import { getProducts, getProductBySlug, getCategories, createProductReview } from '../controllers/productController.js';
import { getCart, updateCart, getWishlist, toggleWishlist } from '../controllers/cartWishlistController.js';
import { createOrder, verifyOrderPayment, getMyOrders, getOrderById, validateCoupon } from '../controllers/orderController.js';
import { handleAIChat, handleAICompare, handleAISummarizeReviews, handleAIFAQ } from '../controllers/aiController.js';
import { getAdminStats, createProduct, updateProduct, deleteProduct, createCategory, updateOrderStatus, getAllOrdersAdmin, getAllUsersAdmin, getAdminAIInsights } from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// --- Auth Routes ---
router.post('/auth/signup', signupUser);
router.post('/auth/login', loginUser);
router.get('/auth/profile', protect, getProfile);
router.post('/auth/addresses', protect, addAddress);
router.delete('/auth/addresses/:id', protect, deleteAddress);
router.post('/auth/forgot-password', forgotPassword);

// --- Product & Category Routes ---
router.get('/products', getProducts);
router.get('/products/:slug', getProductBySlug);
router.get('/categories', getCategories);
router.post('/products/:id/reviews', protect, createProductReview);

// --- Cart & Wishlist Routes ---
router.get('/cart', protect, getCart);
router.post('/cart', protect, updateCart);
router.get('/wishlist', protect, getWishlist);
router.post('/wishlist/toggle', protect, toggleWishlist);

// --- Order & Coupon Routes ---
router.post('/orders', protect, createOrder);
router.post('/orders/verify', protect, verifyOrderPayment);
router.get('/orders', protect, getMyOrders);
router.get('/orders/:id', protect, getOrderById);
router.post('/coupons/validate', protect, validateCoupon);

// --- AI Gemini Routes ---
router.post('/ai/chat', handleAIChat);
router.post('/ai/compare', handleAICompare);
router.get('/ai/summarize-reviews/:productId', handleAISummarizeReviews);
router.post('/ai/faq', handleAIFAQ);

// --- Admin Control Routes ---
router.get('/admin/stats', protect, adminOnly, getAdminStats);
router.get('/admin/ai-insights', protect, adminOnly, getAdminAIInsights);
router.post('/admin/products', protect, adminOnly, createProduct);
router.put('/admin/products/:id', protect, adminOnly, updateProduct);
router.delete('/admin/products/:id', protect, adminOnly, deleteProduct);
router.post('/admin/categories', protect, adminOnly, createCategory);
router.put('/admin/orders/:id/status', protect, adminOnly, updateOrderStatus);
router.get('/admin/orders', protect, adminOnly, getAllOrdersAdmin);
router.get('/admin/users', protect, adminOnly, getAllUsersAdmin);

export default router;
