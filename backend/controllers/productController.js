import { Product, Category, Review } from '../models/Schemas.js';

// @desc    Get all products with filters, search, and pagination
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const { keyword, category, minPrice, maxPrice, rating, sort, page = 1, limit = 12 } = req.query;

    const query = {};

    // Search keyword
    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { tags: { $regex: keyword, $options: 'i' } }
      ];
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Rating filter
    if (rating) {
      query['ratings.average'] = { $gte: Number(rating) };
    }

    // Determine Sort options
    let sortOptions = { createdAt: -1 };
    if (sort) {
      if (sort === 'priceAsc') sortOptions = { price: 1 };
      else if (sort === 'priceDesc') sortOptions = { price: -1 };
      else if (sort === 'ratingDesc') sortOptions = { 'ratings.average': -1 };
      else if (sort === 'newest') sortOptions = { createdAt: -1 };
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category')
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      products,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      totalProducts: total
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get product by slug
// @route   GET /api/products/:slug
// @access  Public
export const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).populate('category');
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Fetch reviews for this product
    const reviews = await Review.find({ product: product._id })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    res.json({ success: true, product, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create product review
// @route   POST /api/products/:id/reviews
// @access  Private
export const createProductReview = async (req, res) => {
  const { rating, title, comment } = req.body;
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Check if user already reviewed
    const alreadyReviewed = await Review.findOne({
      user: req.user._id,
      product: product._id
    });

    if (alreadyReviewed) {
      return res.status(400).json({ success: false, message: 'Product already reviewed by this user' });
    }

    const review = await Review.create({
      user: req.user._id,
      product: product._id,
      rating: Number(rating),
      title,
      comment
    });

    // Recalculate average rating for product
    const productReviews = await Review.find({ product: product._id });
    product.ratings.count = productReviews.length;
    product.ratings.average = Number(
      (productReviews.reduce((acc, r) => r.rating + acc, 0) / productReviews.length).toFixed(1)
    );

    await product.save();

    res.status(201).json({ success: true, review, message: 'Review added successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
