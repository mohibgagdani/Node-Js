const mongoose = require('mongoose');
const BusRoute = require('./models/BusRoute');
const Offer = require('./models/Offer');
require('dotenv').config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await BusRoute.deleteMany({});
    await Offer.deleteMany({});

    // Sample bus routes
    const routes = [
      {
        busName: 'Express Deluxe',
        from: 'Mumbai',
        to: 'Pune',
        departureTime: '08:00',
        arrivalTime: '11:30',
        price: 450,
        totalSeats: 40,
        availableSeats: 40
      },
      {
        busName: 'City Connect',
        from: 'Delhi',
        to: 'Agra',
        departureTime: '06:30',
        arrivalTime: '10:00',
        price: 350,
        totalSeats: 35,
        availableSeats: 35
      },
      {
        busName: 'Highway King',
        from: 'Bangalore',
        to: 'Chennai',
        departureTime: '22:00',
        arrivalTime: '06:00',
        price: 800,
        totalSeats: 45,
        availableSeats: 45
      },
      {
        busName: 'Royal Travels',
        from: 'Kolkata',
        to: 'Bhubaneswar',
        departureTime: '14:30',
        arrivalTime: '20:00',
        price: 600,
        totalSeats: 38,
        availableSeats: 38
      },
      {
        busName: 'Metro Express',
        from: 'Hyderabad',
        to: 'Vijayawada',
        departureTime: '09:15',
        arrivalTime: '13:45',
        price: 400,
        totalSeats: 42,
        availableSeats: 42
      }
    ];

    // Sample offers
    const offers = [
      {
        offerTitle: 'First Time User',
        offerDescription: 'Get 20% off on your first booking with us!',
        discountValue: 20,
        validTill: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      },
      {
        offerTitle: 'Weekend Special',
        offerDescription: 'Book weekend trips and save 15% on all routes',
        discountValue: 15,
        validTill: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) // 15 days from now
      },
      {
        offerTitle: 'Student Discount',
        offerDescription: 'Students get 25% off on all bookings',
        discountValue: 25,
        validTill: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) // 60 days from now
      }
    ];

    await BusRoute.insertMany(routes);
    await Offer.insertMany(offers);

    console.log('Sample data inserted successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();