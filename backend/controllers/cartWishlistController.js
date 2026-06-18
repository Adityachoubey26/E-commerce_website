import { Cart, Wishlist } from '../models/Schemas.js';

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }
    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user cart
// @route   POST /api/cart
// @access  Private
export const updateCart = async (req, res) => {
  const { items } = req.body; // Array of { product: id, quantity, price }
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    cart.items = items;
    await cart.save();

    const populatedCart = await cart.populate('items.product');
    res.json({ success: true, cart: populatedCart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
export const getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products');
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }
    res.json({ success: true, wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle product in wishlist
// @route   POST /api/wishlist/toggle
// @access  Private
export const toggleWishlist = async (req, res) => {
  const { productId } = req.body;
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }

    const index = wishlist.products.indexOf(productId);
    if (index === -1) {
      wishlist.products.push(productId);
      await wishlist.save();
      return res.json({ success: true, message: 'Added to wishlist', added: true });
    } else {
      wishlist.products.splice(index, 1);
      await wishlist.save();
      return res.json({ success: true, message: 'Removed from wishlist', added: false });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
