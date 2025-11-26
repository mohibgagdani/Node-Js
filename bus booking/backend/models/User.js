const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  ticketHistory: [{
    bookingId: String,
    routeId: String,
    busName: String,
    from: String,
    to: String,
    seatNumber: String,
    price: Number,
    date: Date,
    pdfUrl: String
  }],
  transactionHistory: [{
    bookingId: String,
    amount: Number,
    date: Date,
    status: String
  }],
  accountCreatedDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);