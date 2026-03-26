// ============================================
// Saved Trip Routes (all protected)
// ============================================
const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const {
  saveTrip,
  getSavedTrips,
  deleteSavedTrip,
  toggleFavorite
} = require('../controllers/savedTripController');

// All saved-trip routes require authentication
router.use(protect);

router.post('/', saveTrip);
router.get('/', getSavedTrips);
router.delete('/:id', deleteSavedTrip);
router.patch('/:id/favorite', toggleFavorite);

module.exports = router;
