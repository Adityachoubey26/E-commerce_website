import { Order, Product, Category, User } from '../models/Schemas.js';
import { generateAdminInsights } from '../services/geminiService.js';

// @desc    Get dashboard metrics & charts
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getAdminStats = async (req, res) => {
  try {
    // 1. Total revenue (sum of paid orders)
    const paidOrders = await Order.find({ paymentStatus: 'paid' });
    const totalRevenue = paidOrders.reduce((acc, order) => acc + order.total, 0);

    // 2. Counts
    const totalOrdersCount = await Order.countDocuments({});
    const totalProductsCount = await Product.countDocuments({});
    const totalUsersCount = await User.countDocuments({ role: 'user' });

    // 3. Low stock inventory alerts (stock < 5)
    const lowStockProducts = await Product.find({ inventory: { $lt: 5 } }).select('name inventory price slug');

    // 4. Category revenue breakdown
    // Standard Mongoose aggregation to sum totals per category
    const categorySales = await Order.aggregate([
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'productDetails'
        }
      },
      { $unwind: '$productDetails' },
      {
        $group: {
          _id: '$productDetails.category',
          revenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } },
          quantity: { $sum: '$items.quantity' }
        }
      }
    ]);

    // Populate category names
    const categorySalesPopulated = await Category.populate(categorySales, { path: '_id', select: 'name' });

    // 5. Daily sales chart (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const dailyChartStats = await Order.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$total' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      stats: {
        totalRevenue,
        totalOrdersCount,
        totalProductsCount,
        totalUsersCount,
        lowStockProducts,
        categorySales: categorySalesPopulated.map(item => ({
          categoryName: item._id ? item._id.name : 'Unknown',
          revenue: item.revenue,
          quantity: item.quantity
        })),
        dailyChartStats
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new product
// @route   POST /api/admin/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  const { name, description, price, compareAtPrice, images, category, inventory, features, tags, specifications } = req.body;
  try {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    // Check if slug exists
    const slugExists = await Product.findOne({ slug });
    const finalSlug = slugExists ? `${slug}-${Date.now().toString().slice(-4)}` : slug;

    const product = await Product.create({
      name,
      slug: finalSlug,
      description,
      price,
      compareAtPrice,
      images: images || ['/images/placeholder.jpg'],
      category,
      inventory,
      features: features || [],
      tags: tags || [],
      specifications: specifications || {}
    });

    res.status(201).json({ success: true, product, message: 'Product created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update product
// @route   PUT /api/admin/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, product, message: 'Product updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete product
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create category
// @route   POST /api/admin/categories
// @access  Private/Admin
export const createCategory = async (req, res) => {
  const { name, description, image } = req.body;
  try {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const category = await Category.create({ name, slug, description, image });
    res.status(201).json({ success: true, category, message: 'Category created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  const { status, notes } = req.body;
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.orderStatus = status;
    order.trackingHistory.push({ status, notes: notes || `Order status updated to ${status}` });
    
    // Automatically flag payment status for delivered order
    if (status === 'delivered') {
      order.paymentStatus = 'paid';
    }

    await order.save();
    res.json({ success: true, order, message: `Order updated to ${status}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all orders list (Admin panel)
// @route   GET /api/admin/orders
// @access  Private/Admin
export const getAllOrdersAdmin = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all users list (Admin panel)
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsersAdmin = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Gemini AI suggestions/insights for admin
// @route   GET /api/admin/ai-insights
// @access  Private/Admin
export const getAdminAIInsights = async (req, res) => {
  try {
    const paidOrders = await Order.find({ paymentStatus: 'paid' });
    const totalRevenue = paidOrders.reduce((acc, order) => acc + order.total, 0);

    const totalOrdersCount = await Order.countDocuments({});
    const totalProductsCount = await Product.countDocuments({});
    const totalUsersCount = await User.countDocuments({ role: 'user' });

    const lowStockProducts = await Product.find({ inventory: { $lt: 5 } }).select('name inventory price slug');

    const categorySales = await Order.aggregate([
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'productDetails'
        }
      },
      { $unwind: '$productDetails' },
      {
        $group: {
          _id: '$productDetails.category',
          revenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } },
          quantity: { $sum: '$items.quantity' }
        }
      }
    ]);

    const categorySalesPopulated = await Category.populate(categorySales, { path: '_id', select: 'name' });

    const stats = {
      totalRevenue,
      totalOrdersCount,
      totalProductsCount,
      totalUsersCount,
      lowStockProducts,
      categorySales: categorySalesPopulated.map(item => ({
        categoryName: item._id ? item._id.name : 'Unknown',
        revenue: item.revenue,
        quantity: item.quantity
      }))
    };

    const insights = await generateAdminInsights(stats);
    res.json({
      success: true,
      insights
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

