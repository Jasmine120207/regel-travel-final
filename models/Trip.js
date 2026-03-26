// ============================================
// Trip Model — MongoDB Schema for Destinations
// ============================================
const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: true
  },
  estimatedCost: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  // Budget tier: 'budget' (₹0-5000), 'mid' (₹5001-15000), 'premium' (₹15000+)
  budgetTier: {
    type: String,
    enum: ['budget', 'mid', 'premium'],
    required: true
  },
  category: {
    type: String,
    enum: ['hill-station', 'beach', 'heritage', 'adventure', 'pilgrimage', 'wildlife', 'city'],
    default: 'city'
  },
  state: {
    type: String,
    required: true
  },
  numberOfDays: {
    type: Number,
    required: true
  },
  // Array of must-visit places
  placesToVisit: [{
    name: String,
    description: String
  }],
  // Day-by-day itinerary
  itinerary: [{
    day: Number,
    title: String,
    activities: [String]
  }],
  // Budget breakdown in INR
  budgetBreakdown: {
    food: Number,
    travel: Number,
    stay: Number,
    activities: Number,
    miscellaneous: Number
  },
  // For weather API
  latitude: Number,
  longitude: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient budget-based queries
tripSchema.index({ estimatedCost: 1, budgetTier: 1 });

module.exports = mongoose.model('Trip', tripSchema);
