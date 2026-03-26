// ============================================
// SavedTrip Model — tracks user's saved trips
// ============================================
const mongoose = require('mongoose');

const savedTripSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: true
  },
  isFavorite: {
    type: Boolean,
    default: false
  },
  savedAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure a user can't save the same trip twice
savedTripSchema.index({ userId: 1, tripId: 1 }, { unique: true });

module.exports = mongoose.model('SavedTrip', savedTripSchema);
