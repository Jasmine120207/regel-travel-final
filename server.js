// ============================================
// Smart Travel Recommendation App — Server
// ============================================
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// --------------- Middleware ---------------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files from /public
app.use(express.static(path.join(__dirname, 'public')));

// --------------- API Routes ---------------
const authRoutes = require('./routes/auth');
const tripRoutes = require('./routes/trips');
const savedTripRoutes = require('./routes/savedTrips');
const bookingRoutes = require('./routes/bookingRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/saved-trips', savedTripRoutes);
app.use('/api/bookings', bookingRoutes);

// --------------- Catch-all: serve index.html for SPA-like navigation ---------------
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// --------------- Server Start ---------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// --------------- MongoDB Connection ---------------
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-travel';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => console.error('❌ MongoDB connection error (API will fail, but UI will load):', err.message));
