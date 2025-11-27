import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { MapPin, Clock, Users, Star } from 'lucide-react';
import toast from 'react-hot-toast';

const Home = () => {
  const { user } = useAuth();
  const [routes, setRoutes] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [routesRes, offersRes] = await Promise.all([
        axios.get('http://localhost:3033/api/bus/routes'),
        axios.get('http://localhost:3033/api/bus/offers')
      ]);
      setRoutes(routesRes.data);
      setOffers(offersRes.data);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        Loading amazing deals...
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <div className="hero">
        <div className="container">
          <div className="hero-content fade-in-up">
            <h1>Book Your Dream Journey</h1>
            <p>Experience luxury travel with comfort, safety, and style</p>
            {!user && (
              <div className="flex justify-center gap-2" style={{ marginTop: '2rem' }}>
                <Link to="/login" className="btn btn-primary">Get Started</Link>
                <Link to="/register" className="btn btn-secondary">Join Now</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Offers Section */}
      {offers.length > 0 && (
        <div className="section">
          <div className="container">
            <h2 className="section-title">🎉 Special Offers</h2>
            <div className="card-grid">
              {offers.map((offer) => (
                <div key={offer._id} className="offer-card fade-in-up">
                  <div className="flex items-center mb-2">
                    <Star size={24} style={{ marginRight: '0.5rem' }} />
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '600' }}>{offer.offerTitle}</h3>
                  </div>
                  <p className="mb-4" style={{ opacity: 0.9 }}>{offer.offerDescription}</p>
                  <div className="flex justify-between items-center">
                    <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>{offer.discountValue}% OFF</span>
                    <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                      Valid till {new Date(offer.validTill).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Routes Section */}
      <div className="section section-white">
        <div className="container">
          <h2 className="section-title section-title-dark">🚌 Available Routes</h2>
          <div className="card-grid">
            {routes.map((route) => (
              <div key={route._id} className="route-card fade-in-up">
                <div className="flex justify-between items-center mb-4">
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#333' }}>{route.busName}</h3>
                  <span className="route-price">₹{route.price}</span>
                </div>
                
                <div style={{ marginBottom: '2rem' }}>
                  <div className="flex items-center mb-2" style={{ color: '#666' }}>
                    <MapPin size={20} style={{ marginRight: '0.5rem', color: '#4ade80' }} />
                    <span style={{ fontWeight: '500' }}>{route.from} → {route.to}</span>
                  </div>
                  <div className="flex items-center mb-2" style={{ color: '#666' }}>
                    <Clock size={20} style={{ marginRight: '0.5rem', color: '#4ade80' }} />
                    <span>{route.departureTime} - {route.arrivalTime}</span>
                  </div>
                  <div className="flex items-center" style={{ color: '#666' }}>
                    <Users size={20} style={{ marginRight: '0.5rem', color: '#4ade80' }} />
                    <span>{route.availableSeats} seats available</span>
                  </div>
                </div>

                {user ? (
                  <Link to={`/book/${route._id}`} className="btn btn-primary w-full">
                    Book Now
                  </Link>
                ) : (
                  <Link to="/login" className="btn btn-primary w-full">
                    Book Ticket
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="section">
        <div className="container">
          <h2 className="section-title">✨ Why Choose Us?</h2>
          <div className="card-grid">
            <div className="card text-center fade-in-up">
              <div className="stat-icon blue" style={{ margin: '0 auto 1.5rem' }}>
                <Users size={32} />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#333' }}>
                Premium Comfort
              </h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                Experience luxury seating with extra legroom and premium amenities for the ultimate comfort.
              </p>
            </div>
            <div className="card text-center fade-in-up">
              <div className="stat-icon green" style={{ margin: '0 auto 1.5rem' }}>
                <Clock size={32} />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#333' }}>
                Always On Time
              </h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                99% on-time performance with real-time tracking and professional drivers.
              </p>
            </div>
            <div className="card text-center fade-in-up">
              <div className="stat-icon purple" style={{ margin: '0 auto 1.5rem' }}>
                <Star size={32} />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#333' }}>
                Best Value
              </h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                Competitive pricing with transparent costs and exclusive member discounts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;