const express = require('express');
const BusRoute = require('../models/BusRoute');
const Offer = require('../models/Offer');
const Booking = require('../models/Booking');

const router = express.Router();

// Get all bus routes
router.get('/routes', async (req, res) => {
  try {
    const routes = await BusRoute.find();
    res.json(routes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get route by ID
router.get('/routes/:id', async (req, res) => {
  try {
    const route = await BusRoute.findById(req.params.id);
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }
    res.json(route);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get available seats for specific route and date
router.get('/routes/:id/seats', async (req, res) => {
  try {
    const { journeyDate } = req.query;
    const route = await BusRoute.findById(req.params.id);
    
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }

    // Get booked seats for this route and date
    const bookedSeats = await Booking.find({
      routeId: req.params.id,
      journeyDate: new Date(journeyDate),
      status: 'active'
    }).select('seatNumber');

    const bookedSeatNumbers = bookedSeats.map(b => b.seatNumber);
    
    // Generate all seats
    const allSeats = [];
    for (let i = 1; i <= route.totalSeats; i++) {
      allSeats.push(`A${i}`);
    }
    
    const availableSeats = allSeats.filter(seat => !bookedSeatNumbers.includes(seat));

    res.json({ 
      availableSeats, 
      bookedSeats: bookedSeatNumbers,
      totalSeats: route.totalSeats 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all offers
router.get('/offers', async (req, res) => {
  try {
    const offers = await Offer.find({ validTill: { $gte: new Date() } });
    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;