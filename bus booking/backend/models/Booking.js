const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  routeId: { type: mongoose.Schema.Types.ObjectId, ref: 'BusRoute', required: true },
  seatNumber: { type: String, required: true },
  paymentStatus: { type: String, default: 'completed' },
  pdfTicketURL: { type: String },
  date: { type: Date, default: Date.now },
  ticketNumber: { type: String, required: true, unique: true },
  journeyDate: { type: Date, required: true },
  status: { type: String, enum: ['active', 'cancelled', 'completed'], default: 'active' },
  cancelledAt: { type: Date },
  refundAmount: { type: Number }
});

module.exports = mongoose.model('Booking', bookingSchema);