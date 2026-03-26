const express = require('express');
const router = express.Router();
const { createBooking, getUserBookings } = require('../controllers/bookingController');
const protect = require('../middleware/auth');

router.post('/', protect, createBooking);
router.get('/', protect, getUserBookings);

module.exports = router;
