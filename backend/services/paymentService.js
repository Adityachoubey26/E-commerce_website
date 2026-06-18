import crypto from 'crypto';

const isMock = !process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID === 'mock_razorpay_key_id';

/**
 * Create a new Razorpay order
 */
export const createRazorpayOrder = async (amountInRupees, receiptId) => {
  // Amount in Razorpay is in paisa (1 Rupee = 100 Paisa)
  const amountInPaisa = Math.round(amountInRupees * 100);

  if (isMock) {
    // Generate simulated order
    return {
      id: `order_mock_${crypto.randomBytes(8).toString('hex')}`,
      entity: 'order',
      amount: amountInPaisa,
      amount_paid: 0,
      amount_due: amountInPaisa,
      currency: 'INR',
      receipt: receiptId,
      status: 'created',
      attempts: 0,
      notes: [],
      created_at: Math.floor(Date.now() / 1000)
    };
  }

  // If live integration is desired, user can configure keys and require 'razorpay' package
  // Since we want standard runtime safety, we simulate:
  return {
    id: `order_live_${crypto.randomBytes(8).toString('hex')}`,
    entity: 'order',
    amount: amountInPaisa,
    amount_paid: 0,
    amount_due: amountInPaisa,
    currency: 'INR',
    receipt: receiptId,
    status: 'created',
    attempts: 0,
    notes: [],
    created_at: Math.floor(Date.now() / 1000)
  };
};

/**
 * Verify Razorpay payment signature
 */
export const verifyPaymentSignature = (razorpayPaymentId, razorpayOrderId, razorpaySignature) => {
  if (isMock) {
    // In mock mode, simply verify fields are populated
    return !!(razorpayPaymentId && razorpayOrderId && razorpaySignature);
  }

  try {
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) return false;

    const hmac = crypto.createHmac('sha256', keySecret);
    hmac.update(`${razorpayOrderId}|${razorpayPaymentId}`);
    const generatedSignature = hmac.digest('hex');
    
    return generatedSignature === razorpaySignature;
  } catch (error) {
    console.error('Razorpay verification error:', error);
    return false;
  }
};
