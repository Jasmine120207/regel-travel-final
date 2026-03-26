// ============================================
// Booking Controller
// ============================================
const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const mockTrips = require('../mockData');

// In-memory store for mock bookings when DB is offline
let mockBookings = [];

/**
 * POST /api/bookings
 * Create a new booking
 */
exports.createBooking = async (req, res) => {
  try {
    const { tripId, name, travelDate, numberOfPeople, totalCost } = req.body;

    if (!tripId || !name || !travelDate || !numberOfPeople || !totalCost) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    if (mongoose.connection.readyState !== 1) {
      // Offline fallback
      const tripDetail = mockTrips.find(t => t._id === tripId) || mockTrips[0];
      const newBooking = {
        _id: 'booking_' + Date.now(),
        userId: req.userId,
        tripId: tripDetail,
        name,
        travelDate: new Date(travelDate),
        numberOfPeople,
        totalCost,
        bookedAt: new Date()
      };
      mockBookings.push(newBooking);
      return res.status(201).json({ success: true, booking: newBooking });
    }

    // Create DB Document
    const booking = await Booking.create({
      userId: req.userId,
      tripId,
      name,
      travelDate,
      numberOfPeople,
      totalCost
    });

    res.status(201).json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Error creating booking' });
  }
};

/**
 * GET /api/bookings
 * Get all past bookings for the logged-in user
 */
exports.getUserBookings = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      // Offline fallback
      const userBookings = mockBookings
        .filter(b => b.userId === req.userId)
        .sort((a, b) => b.bookedAt - a.bookedAt);
      return res.json({ success: true, count: userBookings.length, bookings: userBookings });
    }

    const bookings = await Booking.find({ userId: req.userId })
      .populate('tripId')
      .sort({ bookedAt: -1 });

    res.json({ success: true, count: bookings.length, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Error fetching bookings' });
  }
};
