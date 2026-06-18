import { Order, Product, Coupon, Cart } from '../models/Schemas.js';
import { createRazorpayOrder, verifyPaymentSignature } from '../services/paymentService.js';
import { generateInvoicePDF } from '../services/invoiceService.js';
import path from 'path';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
  const { items, shippingAddress, paymentMethod, couponCode } = req.body;
  try {
    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No order items' });
    }

    // 1. Calculate subtotal & Verify Stock
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product ${item.product} not found` });
      }

      if (product.inventory < item.quantity) {
        return res.status(400).json({ success: false, message: `Insufficient inventory for ${product.name}` });
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        quantity: item.quantity,
        price: product.price,
        image: product.images[0]
      });
    }

    // 2. Validate Coupon if applied
    let discountAmount = 0;
    let couponApplied = null;

    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode, isActive: true });
      if (coupon && new Date() >= coupon.startDate && new Date() <= coupon.endDate) {
        if (subtotal >= coupon.minPurchaseAmount) {
          couponApplied = coupon._id;
          if (coupon.discountType === 'percentage') {
            discountAmount = (subtotal * coupon.discountValue) / 100;
            if (coupon.maxDiscountAmount) {
              discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);
            }
          } else {
            discountAmount = coupon.discountValue;
          }
        }
      }
    }

    const total = Math.max(0, subtotal - discountAmount);

    // 3. Create initial order structure
    const order = new Order({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      paymentStatus: 'pending',
      orderStatus: 'pending',
      subtotal,
      couponApplied,
      discountAmount,
      total,
      trackingHistory: [{ status: 'pending', notes: 'Order placed, awaiting processing' }]
    });

    if (paymentMethod === 'Razorpay') {
      // Create Razorpay order details
      const razorpayOrder = await createRazorpayOrder(total, order._id.toString());
      order.paymentId = razorpayOrder.id; // temp store order id
      await order.save();

      return res.status(201).json({
        success: true,
        paymentRequired: true,
        razorpayOrder,
        orderId: order._id
      });
    } else {
      // COD Order
      order.paymentStatus = 'pending';
      await order.save();

      // Deduct inventory
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { inventory: -item.quantity }
        });
      }

      // Generate invoice
      const invoiceUrl = await generateInvoicePDF(order, order._id.toString());
      order.invoicePath = invoiceUrl;
      await order.save();

      // Clear Cart
      await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

      return res.status(201).json({
        success: true,
        paymentRequired: false,
        order
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify Razorpay Payment signature
// @route   POST /api/orders/verify
// @access  Private
export const verifyOrderPayment = async (req, res) => {
  const { razorpayPaymentId, razorpayOrderId, razorpaySignature, orderId } = req.body;
  try {
    const isVerified = verifyPaymentSignature(razorpayPaymentId, razorpayOrderId, razorpaySignature);
    if (!isVerified) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    const order = await Order.findById(orderId).populate('user', 'name email');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.paymentStatus = 'paid';
    order.paymentId = razorpayPaymentId;
    order.orderStatus = 'processing';
    order.trackingHistory.push({ status: 'processing', notes: 'Payment verified successfully' });

    // Deduct stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { inventory: -item.quantity }
      });
    }

    // Generate Invoice PDF
    const invoiceUrl = await generateInvoicePDF(order, order._id.toString());
    order.invoicePath = invoiceUrl;
    await order.save();

    // Clear user's cart
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

    res.json({ success: true, order, message: 'Payment verified and order finalized' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user orders list
// @route   GET /api/orders
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get order details by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Secure checking: either admin or order owner
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Validate Coupon
// @route   POST /api/coupons/validate
// @access  Private
export const validateCoupon = async (req, res) => {
  const { code, cartSubtotal } = req.body;
  try {
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid or inactive coupon code' });
    }

    const today = new Date();
    if (today < coupon.startDate || today > coupon.endDate) {
      return res.status(400).json({ success: false, message: 'Coupon code has expired' });
    }

    if (cartSubtotal < coupon.minPurchaseAmount) {
      return res.status(400).json({ success: false, message: `Minimum purchase of INR ${coupon.minPurchaseAmount} required` });
    }

    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = (cartSubtotal * coupon.discountValue) / 100;
      if (coupon.maxDiscountAmount) {
        discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);
      }
    } else {
      discountAmount = coupon.discountValue;
    }

    res.json({
      success: true,
      coupon,
      discountAmount,
      total: Math.max(0, cartSubtotal - discountAmount)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
