// ============================================
// Trip Controller — recommendation engine
// ============================================
const axios = require('axios');
const mongoose = require('mongoose');
const Trip = require('../models/Trip');
const mockTrips = require('../mockData');

/**
 * Determine budget tier from amount in INR
 * ₹0–5000     → 'budget' (local / low-cost trips)
 * ₹5001–15000 → 'mid'    (nearby city trips)
 * ₹15001+     → 'premium' (tourist destinations)
 */
const getBudgetTier = (budget) => {
  if (budget <= 5000) return 'budget';
  if (budget <= 15000) return 'mid';
  return 'premium';
};

/**
 * GET /api/trips?budget=X&search=Y&category=Z
 * Returns recommended trips based on budget with optional search/filter
 */
exports.getTrips = async (req, res) => {
  try {
    const { budget, search, category } = req.query;

    if (mongoose.connection.readyState !== 1) {
      console.log('Sending mock trips due to no DB connection');
      let filtered = mockTrips;
      if (budget) {
        const amt = parseInt(budget);
        filtered = filtered.filter(t => t.estimatedCost <= amt + 2000);
      }
      return res.json({
        success: true,
        count: filtered.length,
        tier: budget ? getBudgetTier(parseInt(budget)) : 'all',
        trips: filtered
      });
    }

    // Build query filter
    let filter = {};

    // Budget-based filtering — core recommendation logic
    if (budget) {
      const budgetAmount = parseInt(budget);
      const tier = getBudgetTier(budgetAmount);
      filter.budgetTier = tier;
      // Also filter by actual cost within budget
      filter.estimatedCost = { $lte: budgetAmount + 2000 }; // small buffer
    }

    // Search by destination name or description
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { state: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by category
    if (category && category !== 'all') {
      filter.category = category;
    }

    const trips = await Trip.find(filter).sort({ estimatedCost: 1 });

    res.json({
      success: true,
      count: trips.length,
      tier: budget ? getBudgetTier(parseInt(budget)) : 'all',
      trips
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || 'Error fetching trips'
    });
  }
};

/**
 * GET /api/trips/all
 * Returns all trips (no filtering)
 */
exports.getAllTrips = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({ success: true, count: mockTrips.length, trips: mockTrips });
    }
    const trips = await Trip.find().sort({ estimatedCost: 1 });
    res.json({ success: true, count: trips.length, trips });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || 'Error fetching trips'
    });
  }
};

/**
 * GET /api/trips/:id
 * Returns a single trip with full details
 */
exports.getTripById = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const t = mockTrips.find(t => t._id === req.params.id) || mockTrips[0];
      return res.json({ success: true, trip: t });
    }
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }
    res.json({ success: true, trip });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || 'Error fetching trip details'
    });
  }
};

/**
 * GET /api/trips/:id/weather
 * Returns current weather for the trip's destination
 * Uses OpenWeatherMap API (free tier)
 */
exports.getTripWeather = async (req, res) => {
  try {
    let trip;
    if (mongoose.connection.readyState !== 1) {
      trip = mockTrips.find(t => t._id === req.params.id) || mockTrips[0];
    } else {
      trip = await Trip.findById(req.params.id);
    }
    
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    const apiKey = process.env.WEATHER_API_KEY;

    // If no valid API key, return sample weather data
    if (!apiKey || apiKey === 'demo') {
      return res.json({
        success: true,
        weather: {
          temp: Math.floor(Math.random() * 15) + 20, // 20-35°C
          description: ['Clear sky', 'Partly cloudy', 'Sunny', 'Light breeze'][Math.floor(Math.random() * 4)],
          humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
          icon: '01d',
          city: trip.name,
          feelsLike: Math.floor(Math.random() * 15) + 22,
          windSpeed: (Math.random() * 10 + 2).toFixed(1)
        }
      });
    }

    // Real weather API call
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${trip.latitude}&lon=${trip.longitude}&appid=${apiKey}&units=metric`
    );

    const data = response.data;
    res.json({
      success: true,
      weather: {
        temp: Math.round(data.main.temp),
        description: data.weather[0].description,
        humidity: data.main.humidity,
        icon: data.weather[0].icon,
        city: data.name,
        feelsLike: Math.round(data.main.feels_like),
        windSpeed: data.wind.speed
      }
    });
  } catch (err) {
    // Fallback to sample data on error
    res.json({
      success: true,
      weather: {
        temp: 28,
        description: 'Pleasant weather',
        humidity: 55,
        icon: '02d',
        city: 'Unknown',
        feelsLike: 30,
        windSpeed: '5.2'
      }
    });
  }
};
