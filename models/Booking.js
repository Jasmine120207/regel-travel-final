const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
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
  name: {
    type: String,
    required: true
  },
  travelDate: {
    type: Date,
    required: true
  },
  numberOfPeople: {
    type: Number,
    required: true,
    min: 1
  },
  totalCost: {
    type: Number,
    required: true
  },
  bookedAt: {
    type: Date,
    default: Date.now
  }
});

// Index to quickly find a user's bookings
bookingSchema.index({ userId: 1, bookedAt: -1 });

module.exports = mongoose.model('Booking', bookingSchema);
