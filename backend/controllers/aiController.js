import { Product, Review } from '../models/Schemas.js';
import { askAssistant, summarizeReviews, compareProducts, askFAQ } from '../services/geminiService.js';

// @desc    AI Shopping Assistant Chatbot
// @route   POST /api/ai/chat
// @access  Public (or Private)
export const handleAIChat = async (req, res) => {
  const { message, history } = req.body;
  try {
    // 1. Fetch available products to build context
    const products = await Product.find({}).populate('category').limit(15);
    const productsContext = products.map(p => 
      `- Product: ${p.name}, Price: INR ${p.price}, Category: ${typeof p.category === 'object' ? p.category.name : 'Uncategorized'}, Slug: ${p.slug}, Rating: ${p.ratings.average}/5, Inventory: ${p.inventory > 0 ? 'In Stock' : 'Out of Stock'}`
    ).join('\n');

    const reply = await askAssistant(message, history || [], productsContext);
    res.json({ success: true, reply });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    AI Product Comparison
// @route   POST /api/ai/compare
// @access  Public
export const handleAICompare = async (req, res) => {
  const { productIdA, productIdB } = req.body;
  try {
    const productA = await Product.findById(productIdA);
    const productB = await Product.findById(productIdB);

    if (!productA || !productB) {
      return res.status(404).json({ success: false, message: 'One or both products not found' });
    }

    const comparison = await compareProducts(productA, productB);
    res.json({ success: true, ...comparison });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    AI Review Summarizer
// @route   GET /api/ai/summarize-reviews/:productId
// @access  Public
export const handleAISummarizeReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId });
    const summaryData = await summarizeReviews(reviews);
    res.json({ success: true, ...summaryData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    AI FAQ Assistant
// @route   POST /api/ai/faq
// @access  Public
export const handleAIFAQ = async (req, res) => {
  const { question } = req.body;
  try {
    if (!question) {
      return res.status(400).json({ success: false, message: 'Question is required' });
    }
    const answer = await askFAQ(question);
    res.json({ success: true, answer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
