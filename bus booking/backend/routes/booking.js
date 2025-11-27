const express = require('express');
const Booking = require('../models/Booking');
const BusRoute = require('../models/BusRoute');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');
const { generateTicketPDF } = require('../utils/pdfGenerator');
const { sendTicketEmail } = require('../utils/emailService');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Create booking
router.post('/book', authMiddleware, async (req, res) => {
  try {
    const { routeId, seatNumber, journeyDate } = req.body;

    const route = await BusRoute.findById(routeId);
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }

    if (route.availableSeats <= 0) {
      return res.status(400).json({ message: 'No seats available' });
    }

    // Generate unique ticket number
    const ticketNumber = `TKT${Date.now()}${Math.floor(Math.random() * 1000)}`;

    const booking = new Booking({
      userId: req.user._id,
      routeId,
      seatNumber,
      ticketNumber,
      paymentStatus: 'completed',
      journeyDate: new Date(journeyDate)
    });

    await booking.save();

    // Update available seats
    await BusRoute.findByIdAndUpdate(routeId, { 
      $inc: { availableSeats: -1 } 
    });

    // Generate PDF ticket
    const ticketData = {
      ticketNumber,
      userName: req.user.name,
      from: route.from,
      to: route.to,
      busName: route.busName,
      seatNumber,
      price: route.price,
      date: booking.date,
      departureTime: route.departureTime,
      arrivalTime: route.arrivalTime
    };

    const pdfBuffer = await generateTicketPDF(ticketData);
    
    // Save PDF to uploads folder
    const uploadsDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    const pdfPath = path.join(uploadsDir, `ticket-${ticketNumber}.pdf`);
    fs.writeFileSync(pdfPath, pdfBuffer);

    // Update booking with PDF URL
    const pdfUrl = `/uploads/ticket-${ticketNumber}.pdf`;
    await Booking.findByIdAndUpdate(booking._id, { pdfTicketURL: pdfUrl });

    // Update user history
    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        ticketHistory: {
          bookingId: booking._id,
          routeId,
          busName: route.busName,
          from: route.from,
          to: route.to,
          seatNumber,
          price: route.price,
          date: booking.date,
          pdfUrl
        },
        transactionHistory: {
          bookingId: booking._id,
          amount: route.price,
          date: booking.date,
          status: 'completed'
        }
      }
    });

    // Send ticket email
    await sendTicketEmail(req.user.email, ticketData, pdfBuffer);

    res.json({ 
      message: 'Booking successful', 
      booking: { ...booking.toObject(), pdfUrl },
      ticketNumber 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user bookings
router.get('/my-bookings', authMiddleware, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    await Booking.updateMany(
      { status: 'active', journeyDate: { $lt: today } },
      { $set: { status: 'completed' } }
    );
    
    const bookings = await Booking.find({ userId: req.user._id })
      .populate('routeId')
      .sort({ date: -1 });
    
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Cancel booking
router.post('/cancel/:bookingId', authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findOne({ 
      _id: req.params.bookingId, 
      userId: req.user._id,
      status: 'active'
    }).populate('routeId');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found or already cancelled' });
    }

    if (new Date(booking.journeyDate) <= new Date()) {
      return res.status(400).json({ message: 'Cannot cancel past journey' });
    }

    booking.status = 'cancelled';
    booking.cancelledAt = new Date();
    booking.refundAmount = booking.routeId.price;
    await booking.save();

    await BusRoute.findByIdAndUpdate(booking.routeId._id, { 
      $inc: { availableSeats: 1 } 
    });

    const { sendCancellationEmail } = require('../utils/emailService');
    await sendCancellationEmail(req.user.email, {
      userName: req.user.name,
      ticketNumber: booking.ticketNumber,
      busName: booking.routeId.busName,
      from: booking.routeId.from,
      to: booking.routeId.to,
      refundAmount: booking.refundAmount,
      journeyDate: booking.journeyDate
    });

    res.json({ message: 'Booking cancelled successfully', refundAmount: booking.refundAmount });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;