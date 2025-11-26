const express = require('express');
const BusRoute = require('../models/BusRoute');
const Offer = require('../models/Offer');
const User = require('../models/User');
const Booking = require('../models/Booking');
const { adminMiddleware } = require('../middleware/auth');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Dashboard analytics
router.get('/dashboard', adminMiddleware, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalRevenue = await Booking.aggregate([
      { $lookup: { from: 'busroutes', localField: 'routeId', foreignField: '_id', as: 'route' } },
      { $unwind: '$route' },
      { $group: { _id: null, total: { $sum: '$route.price' } } }
    ]);

    const revenueAmount = totalRevenue.length > 0 ? totalRevenue[0].total : 0;

    res.json({
      totalUsers,
      totalBookings,
      totalRevenue: revenueAmount,
      totalTicketsSold: totalBookings
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get date-wise booking history
router.get('/bookings', adminMiddleware, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let query = {};
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const bookings = await Booking.find(query)
      .populate('userId', 'name email')
      .populate('routeId')
      .sort({ date: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Export bookings to CSV
router.get('/export/bookings', adminMiddleware, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let query = {};
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const bookings = await Booking.find(query)
      .populate('userId', 'name email')
      .populate('routeId');

    const csvData = bookings.map(booking => ({
      ticketNumber: booking.ticketNumber,
      userName: booking.userId.name,
      userEmail: booking.userId.email,
      busName: booking.routeId.busName,
      from: booking.routeId.from,
      to: booking.routeId.to,
      seatNumber: booking.seatNumber,
      price: booking.routeId.price,
      date: booking.date.toISOString().split('T')[0],
      paymentStatus: booking.paymentStatus
    }));

    const uploadsDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const csvPath = path.join(uploadsDir, `bookings-${Date.now()}.csv`);
    
    const csvWriter = createCsvWriter({
      path: csvPath,
      header: [
        { id: 'ticketNumber', title: 'Ticket Number' },
        { id: 'userName', title: 'User Name' },
        { id: 'userEmail', title: 'User Email' },
        { id: 'busName', title: 'Bus Name' },
        { id: 'from', title: 'From' },
        { id: 'to', title: 'To' },
        { id: 'seatNumber', title: 'Seat Number' },
        { id: 'price', title: 'Price' },
        { id: 'date', title: 'Date' },
        { id: 'paymentStatus', title: 'Payment Status' }
      ]
    });

    await csvWriter.writeRecords(csvData);
    res.download(csvPath);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Bus Routes Management
router.get('/routes', adminMiddleware, async (req, res) => {
  try {
    const routes = await BusRoute.find();
    res.json(routes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/routes', adminMiddleware, async (req, res) => {
  try {
    const route = new BusRoute(req.body);
    route.availableSeats = route.totalSeats;
    await route.save();
    res.json({ message: 'Route added successfully', route });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/routes/:id', adminMiddleware, async (req, res) => {
  try {
    const route = await BusRoute.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: 'Route updated successfully', route });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/routes/:id', adminMiddleware, async (req, res) => {
  try {
    await BusRoute.findByIdAndDelete(req.params.id);
    res.json({ message: 'Route deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Offers Management
router.get('/offers', adminMiddleware, async (req, res) => {
  try {
    const offers = await Offer.find();
    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/offers', adminMiddleware, async (req, res) => {
  try {
    const offer = new Offer(req.body);
    await offer.save();
    res.json({ message: 'Offer added successfully', offer });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/offers/:id', adminMiddleware, async (req, res) => {
  try {
    const offer = await Offer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: 'Offer updated successfully', offer });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/offers/:id', adminMiddleware, async (req, res) => {
  try {
    await Offer.findByIdAndDelete(req.params.id);
    res.json({ message: 'Offer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Users Management
router.get('/users', adminMiddleware, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/users/:id', adminMiddleware, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;