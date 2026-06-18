import { User } from '../models/Schemas.js';

// @desc    Get user's wallet details
// @route   GET /api/wallet/details
// @access  Private
export const getWalletDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('walletBalance walletTransactions');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({
      success: true,
      balance: user.walletBalance,
      transactions: user.walletTransactions || []
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add money to wallet (Simulation)
// @route   POST /api/wallet/add-funds
// @access  Private
export const addWalletFunds = async (req, res) => {
  const { amount } = req.body;
  try {
    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid amount' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.walletBalance += Number(amount);
    user.walletTransactions.push({
      amount: Number(amount),
      type: 'credit',
      description: 'Added funds via Payment Gateway (Simulated)'
    });

    await user.save();

    res.json({
      success: true,
      balance: user.walletBalance,
      transactions: user.walletTransactions,
      message: `Successfully added ₹${amount} to your wallet!`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's tokens details
// @route   GET /api/tokens/details
// @access  Private
export const getTokenDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('tokensAvailable tokensLifetime tokenTransactions');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({
      success: true,
      tokensAvailable: user.tokensAvailable,
      tokensLifetime: user.tokensLifetime,
      transactions: user.tokenTransactions || []
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin adjusts wallet/tokens for a user
// @route   POST /api/admin/wallet-tokens
// @access  Private/Admin
export const adjustWalletTokensAdmin = async (req, res) => {
  const { userId, type, field, amount, description } = req.body;
  try {
    if (!userId || !field || !amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Missing required parameters' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const numAmount = Number(amount);
    if (field === 'wallet') {
      if (type === 'credit') {
        user.walletBalance += numAmount;
        user.walletTransactions.push({
          amount: numAmount,
          type: 'credit',
          description: description || 'Admin adjustment credit'
        });
      } else {
        user.walletBalance = Math.max(0, user.walletBalance - numAmount);
        user.walletTransactions.push({
          amount: numAmount,
          type: 'debit',
          description: description || 'Admin adjustment debit'
        });
      }
    } else if (field === 'tokens') {
      if (type === 'credit') {
        user.tokensAvailable += numAmount;
        user.tokensLifetime += numAmount;
        user.tokenTransactions.push({
          amount: numAmount,
          type: 'earn',
          description: description || 'Admin adjustment credit'
        });
      } else {
        user.tokensAvailable = Math.max(0, user.tokensAvailable - numAmount);
        user.tokenTransactions.push({
          amount: numAmount,
          type: 'redeem',
          description: description || 'Admin adjustment debit'
        });
      }
    } else {
      return res.status(400).json({ success: false, message: 'Invalid target field' });
    }

    await user.save();

    res.json({
      success: true,
      message: 'User account adjusted successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        walletBalance: user.walletBalance,
        tokensAvailable: user.tokensAvailable,
        tokensLifetime: user.tokensLifetime
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
