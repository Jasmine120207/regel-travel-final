// ============================================
// SavedTrip Controller — save, get, delete, favorite
// ============================================
const mongoose = require('mongoose');
const SavedTrip = require('../models/SavedTrip');
const mockTrips = require('../mockData');

// In-memory store for mock saved trips
let mockSavedTrips = [];

/**
 * POST /api/saved-trips
 * Save a trip for the logged-in user
 */
exports.saveTrip = async (req, res) => {
  try {
    const { tripId } = req.body;

    if (mongoose.connection.readyState !== 1) {
      // Mock save
      const exists = mockSavedTrips.find(s => s.tripId._id === tripId);
      if (exists) {
        return res.status(400).json({ success: false, message: 'Trip already saved' });
      }
      const tripDetail = mockTrips.find(t => t._id === tripId) || mockTrips[0];
      const newSaved = { _id: 'saved_' + Date.now(), userId: req.userId, tripId: tripDetail, isFavorite: false, savedAt: new Date() };
      mockSavedTrips.push(newSaved);
      return res.status(201).json({ success: true, savedTrip: newSaved });
    }

    // Check if already saved
    const existing = await SavedTrip.findOne({
      userId: req.userId,
      tripId: tripId
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Trip already saved'
      });
    }

    const savedTrip = await SavedTrip.create({
      userId: req.userId,
      tripId: tripId
    });

    // Populate trip details before responding
    await savedTrip.populate('tripId');

    res.status(201).json({
      success: true,
      savedTrip
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || 'Error saving trip'
    });
  }
};

/**
 * GET /api/saved-trips
 * Get all saved trips for the logged-in user
 */
exports.getSavedTrips = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const userSaved = mockSavedTrips.filter(s => s.userId === req.userId);
      return res.json({ success: true, count: userSaved.length, savedTrips: userSaved });
    }

    const savedTrips = await SavedTrip.find({ userId: req.userId })
      .populate('tripId')
      .sort({ savedAt: -1 });

    res.json({
      success: true,
      count: savedTrips.length,
      savedTrips
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || 'Error fetching saved trips'
    });
  }
};

/**
 * DELETE /api/saved-trips/:id
 * Remove a saved trip
 */
exports.deleteSavedTrip = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      mockSavedTrips = mockSavedTrips.filter(s => s._id !== req.params.id);
      return res.json({ success: true, message: 'Trip removed from saved list' });
    }

    const savedTrip = await SavedTrip.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!savedTrip) {
      return res.status(404).json({
        success: false,
        message: 'Saved trip not found'
      });
    }

    res.json({
      success: true,
      message: 'Trip removed from saved list'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || 'Error deleting saved trip'
    });
  }
};

/**
 * PATCH /api/saved-trips/:id/favorite
 * Toggle favorite status for a saved trip
 */
exports.toggleFavorite = async (req, res) => {
  try {
    const savedTrip = await SavedTrip.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!savedTrip) {
      return res.status(404).json({
        success: false,
        message: 'Saved trip not found'
      });
    }

    // Toggle the favorite flag
    savedTrip.isFavorite = !savedTrip.isFavorite;
    await savedTrip.save();
    await savedTrip.populate('tripId');

    res.json({
      success: true,
      savedTrip
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || 'Error toggling favorite'
    });
  }
};
