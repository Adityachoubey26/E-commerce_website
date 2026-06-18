import { GoogleGenerativeAI } from '@google/generative-ai';
import { Product } from '../models/Schemas.js';

// Setup Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
const isMock = !apiKey || apiKey === 'mock_key';

let genAI = null;
if (!isMock) {
  try {
    genAI = new GoogleGenerativeAI(apiKey);
  } catch (error) {
    console.error('Failed to initialize GoogleGenerativeAI client:', error);
  }
}

/**
 * AI Shopping Assistant Chatbot
 */
export const askAssistant = async (message, chatHistory = [], productsContext = '') => {
  if (isMock || !genAI) {
    // Return high-fidelity mock response
    return `Hello! I am your AI Shopping Assistant. (Offline Mock Mode)
Based on our catalog of products, I would recommend checking out our high-performance gear. Are you looking for something specific, like an elegant timepiece or next-gen noise-cancelling headphones? Let me know, and I can help you compare options or apply discount coupons!`;
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const systemPrompt = `You are an expert AI Shopping Assistant for a premium glassmorphic e-commerce store. 
Here is a list of our available products for reference:
${productsContext}

Help the user find the best products, answer their details, compare specifications, and provide professional shopping recommendations. Keep answers concise, user-friendly, and formatted in clean markdown.`;

    const chat = model.startChat({
      history: chatHistory.map(h => ({
        role: h.role === 'model' ? 'model' : 'user',
        parts: [{ text: h.content }]
      })),
      systemInstruction: systemPrompt
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini Assistant Error:', error);
    return 'I encountered an issue processing that query. How else can I assist you with shopping today?';
  }
};

/**
 * AI Review Summarizer
 */
export const summarizeReviews = async (reviews) => {
  if (reviews.length === 0) {
    return {
      summary: 'No reviews available to summarize yet.',
      pros: [],
      cons: [],
      verdict: 'No reviews.'
    };
  }

  const reviewText = reviews.map(r => `[Rating: ${r.rating}/5] ${r.title} - ${r.comment}`).join('\n');

  if (isMock || !genAI) {
    // Generate a high-fidelity mock review summary
    const avgRating = (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1);
    return {
      summary: `Customers generally enjoy this product, highlighting its premium design and reliability. Rating stands at a solid ${avgRating}/5 stars based on ${reviews.length} reviews.`,
      pros: ['Premium design and construction', 'Great value for money', 'Reliable performance'],
      cons: ['Shipping took longer for a few customers', 'Limited color variations available'],
      verdict: 'Highly recommended for users looking for premium features at an accessible price point.'
    };
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `Summarize these reviews for a product in JSON format. 
Format must strictly be a JSON object with: 
"summary": a brief paragraph,
"pros": string array of main positive points,
"cons": string array of main negative points,
"verdict": a final recommendations sentence.

Reviews:
${reviewText}`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json' }
    });
    
    const response = await result.response;
    return JSON.parse(response.text());
  } catch (error) {
    console.error('Gemini Review Summarizer Error:', error);
    return {
      summary: 'Unable to analyze reviews at this moment.',
      pros: ['Good quality'],
      cons: ['None reported'],
      verdict: 'Standard purchase recommendation.'
    };
  }
};

/**
 * AI Product Comparison Assistant
 */
export const compareProducts = async (productA, productB) => {
  if (isMock || !genAI) {
    return {
      comparisonText: `### Product Comparison Table
| Feature | ${productA.name} | ${productB.name} |
| :--- | :--- | :--- |
| **Price** | $${productA.price} | $${productB.price} |
| **Inventory** | ${productA.inventory > 0 ? 'In Stock' : 'Out of Stock'} | ${productB.inventory > 0 ? 'In Stock' : 'Out of Stock'} |
| **Rating** | ${productA.ratings.average}/5 | ${productB.ratings.average}/5 |
| **Highlights** | ${productA.features.slice(0,2).join(', ')} | ${productB.features.slice(0,2).join(', ')} |

**AI Recommendation:**
If you prioritize budget, **${productA.price < productB.price ? productA.name : productB.name}** is the smarter buy. However, for maximum feature sets and rating satisfaction, **${productA.ratings.average > productB.ratings.average ? productA.name : productB.name}** stands out.`,
      winner: productA.ratings.average > productB.ratings.average ? productA.name : productB.name
    };
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `Compare these two products in detail. Return a markdown table comparing their features, specifications, prices, and reviews, followed by an AI verdict recommending which one to buy under different constraints.
Product A:
${JSON.stringify(productA)}

Product B:
${JSON.stringify(productB)}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return {
      comparisonText: response.text(),
      winner: productA.ratings.average > productB.ratings.average ? productA.name : productB.name
    };
  } catch (error) {
    console.error('Gemini Comparison Assistant Error:', error);
    return {
      comparisonText: 'Failed to generate comparison. Please check back later.',
      winner: productA.name
    };
  }
};

/**
 * Frequently Asked Questions Assistant
 */
export const askFAQ = async (question) => {
  const storeFAQs = `
Q: What is the delivery time?
A: Standard shipping takes 3-5 business days. Express shipping delivers in 1-2 business days.
Q: What is the return policy?
A: We offer a 30-day money-back guarantee with free return shipping on all unused items in original packaging.
Q: Do you offer Cash on Delivery (COD)?
A: Yes, we offer COD in addition to secure online payments via Razorpay.
Q: How do I track my order?
A: You can track your order status in real-time under the "My Orders" tab of your user profile.
`;

  if (isMock || !genAI) {
    return `This is a mock answer based on the store's policy:
For your question: "${question}", our policy states that we process all transactions securely. If it relates to shipping, standard delivery is 3-5 business days. We also offer 30-day returns. Let me know if you need more specifics!`;
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `Use the FAQ reference below to answer the user's question. If the question isn't answered in the FAQ, provide a friendly customer support response stating you'll direct them to support.
FAQ Reference:
${storeFAQs}

User Question: ${question}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini FAQ Error:', error);
    return 'Please contact customer support at support@ecommerce.com for immediate help.';
  }
};

/**
 * AI Admin Insights & Business Suggestions
 */
export const generateAdminInsights = async (stats) => {
  const statsSummary = `
Total Revenue: INR ${stats.totalRevenue}
Total Orders: ${stats.totalOrdersCount}
Total Users: ${stats.totalUsersCount}
Total Products: ${stats.totalProductsCount}
Low Stock Products Count: ${stats.lowStockProducts?.length || 0}
Category Sales Breakdown: ${JSON.stringify(stats.categorySales)}
`;

  if (isMock || !genAI) {
    return {
      insights: `### 🚀 AI Business Insights (Offline Mode)

1. **Revenue Performance**: Total revenue stands at **INR ${stats.totalRevenue.toLocaleString()}**. Standard categories are driving stable revenues, but introducing flash sales on low-stock items could boost impulse buying.
2. **Inventory Stock Alarms**: You have **${stats.lowStockProducts?.length || 0}** low stock product warnings. We recommend reordering immediately to avoid losing out on demand.
3. **Engagement Suggestions**: User base is growing. Introduce tailored loyalty discount coupons to increase repeat-purchase rates.`,
      recommendationSummary: "Reorder low stock items, launch loyalty coupons."
    };
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `Analyze these e-commerce store metrics and generate high-level business suggestions, pricing optimizations, and restocking recommendations for the administrator. Format the output in beautiful Markdown with icons.
Metrics Summary:
${statsSummary}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return {
      insights: response.text(),
      recommendationSummary: "Optimize stock and coupon distribution"
    };
  } catch (error) {
    console.error('Gemini Admin Insights Error:', error);
    return {
      insights: 'Failed to generate real-time AI Insights. Please check API key status.',
      recommendationSummary: 'Error generating recommendations.'
    };
  }
};

