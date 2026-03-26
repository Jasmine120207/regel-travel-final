// ============================================
// Auth Controller — signup, login, getMe
// ============================================
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');

/**
 * Generate a JWT token for a given user ID
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

/**
 * POST /api/auth/signup
 * Register a new user and return JWT
 */
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (mongoose.connection.readyState !== 1) {
      console.log('Mock signup generated due to no DB');
      const mockId = 'mock_user_' + Date.now();
      return res.status(201).json({
        success: true,
        token: generateToken(mockId),
        user: { id: mockId, name, email }
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists'
      });
    }

    // Create user (password hashed via pre-save hook)
    const user = await User.create({ name, email, password });

    // Generate token and respond
    const token = generateToken(user._id);
    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || 'Server error during signup'
    });
  }
};

/**
 * POST /api/auth/login
 * Authenticate user and return JWT
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (mongoose.connection.readyState !== 1) {
      console.log('Mock login generated due to no DB');
      const mockId = 'mock_user_123';
      return res.json({
        success: true,
        token: generateToken(mockId),
        user: { id: mockId, name: 'Mock User', email }
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate token and respond
    const token = generateToken(user._id);
    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || 'Server error during login'
    });
  }
};

/**
 * GET /api/auth/me
 * Get current user info from JWT
 */
exports.getMe = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({
        success: true,
        user: { _id: req.userId, name: 'Mock User', email: 'mock@example.com' }
      });
    }
    
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || 'Server error'
    });
  }
};
