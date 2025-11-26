const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  generatedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
  usedOrNot: { type: Boolean, default: false }
});

module.exports = mongoose.model('OTP', otpSchema);