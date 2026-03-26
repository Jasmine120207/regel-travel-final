// ============================================
// Trip Routes
// ============================================
const express = require('express');
const router = express.Router();
const { getTrips, getAllTrips, getTripById, getTripWeather } = require('../controllers/tripController');

// GET /api/trips?budget=X&search=Y&category=Z — budget-based recommendation
router.get('/', getTrips);

// GET /api/trips/all — all trips without filtering
router.get('/all', getAllTrips);

// GET /api/trips/:id — single trip details
router.get('/:id', getTripById);

// GET /api/trips/:id/weather — weather info for destination
router.get('/:id/weather', getTripWeather);

module.exports = router;
