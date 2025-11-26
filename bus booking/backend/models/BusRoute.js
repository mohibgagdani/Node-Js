const mongoose = require('mongoose');

const busRouteSchema = new mongoose.Schema({
  busName: { type: String, required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  departureTime: { type: String, required: true },
  arrivalTime: { type: String, required: true },
  price: { type: Number, required: true },
  totalSeats: { type: Number, required: true },
  availableSeats: { type: Number, required: true }
});

module.exports = mongoose.model('BusRoute', busRouteSchema);