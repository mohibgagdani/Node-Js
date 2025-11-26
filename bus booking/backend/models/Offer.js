const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  offerTitle: { type: String, required: true },
  offerDescription: { type: String, required: true },
  discountValue: { type: Number, required: true },
  validTill: { type: Date, required: true }
});

module.exports = mongoose.model('Offer', offerSchema);