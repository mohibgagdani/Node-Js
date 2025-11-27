import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { MapPin, Clock, Users, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';

const BookTicket = () => {
  const { routeId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [route, setRoute] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState('');
  const [journeyDate, setJourneyDate] = useState('');
  const [availableSeats, setAvailableSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    fetchRoute();
    
    // Redirect to dashboard on back button
    const handlePopState = () => {
      window.location.href = '/dashboard';
    };
    window.addEventListener('popstate', handlePopState);
    
    return () => window.removeEventListener('popstate', handlePopState);
  }, [routeId]);

  useEffect(() => {
    if (journeyDate && route) {
      fetchAvailableSeats();
    }
  }, [journeyDate, route]);

  const fetchRoute = async () => {
    try {
      const response = await axios.get(`http://localhost:3033/api/bus/routes/${routeId}`);
      setRoute(response.data);
    } catch (error) {
      toast.error('Failed to load route details');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSeats = async () => {
    try {
      const response = await axios.get(`http://localhost:3033/api/bus/routes/${routeId}/seats`, {
        params: { journeyDate }
      });
      setAvailableSeats(response.data.availableSeats);
      setBookedSeats(response.data.bookedSeats);
      setSelectedSeat('');
    } catch (error) {
      toast.error('Failed to load seat availability');
    }
  };



  const handleBooking = async () => {
    if (!selectedSeat) {
      toast.error('Please select a seat');
      return;
    }
    if (!journeyDate) {
      toast.error('Please select journey date');
      return;
    }

    setBooking(true);
    try {
      const response = await axios.post('http://localhost:3033/api/booking/book', {
        routeId,
        seatNumber: selectedSeat,
        journeyDate
      });
      
      toast.success('Booking successful! Check your email for the ticket. 🎉');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        Loading route details...
      </div>
    );
  }

  if (!route) {
    return (
      <div className="section">
        <div className="container">
          <div className="card text-center">
            <h2 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '1rem', color: '#333' }}>
              Route not found 😕
            </h2>
            <button
              onClick={() => navigate('/')}
              className="btn btn-primary"
            >
              Go Back Home
            </button>
          </div>
        </div>
      </div>
    );
  }



  return (
    <div className="section">
      <div className="container">
        <div className="card fade-in-up">
          <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '2rem', color: '#333' }}>
            Book Your Ticket 🎫
          </h1>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#333' }}>
                {route.busName}
              </h2>
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div className="flex items-center" style={{ color: '#666' }}>
                  <MapPin size={20} style={{ marginRight: '0.5rem', color: '#4ade80' }} />
                  <span style={{ fontWeight: '500' }}>{route.from} → {route.to}</span>
                </div>
                <div className="flex items-center" style={{ color: '#666' }}>
                  <Clock size={20} style={{ marginRight: '0.5rem', color: '#4ade80' }} />
                  <span>{route.departureTime} - {route.arrivalTime}</span>
                </div>
                <div className="flex items-center" style={{ color: '#666' }}>
                  <Users size={20} style={{ marginRight: '0.5rem', color: '#4ade80' }} />
                  <span>{route.availableSeats} seats available</span>
                </div>
              </div>
            </div>
            
            <div className="card" style={{ background: 'rgba(74, 222, 128, 0.1)', border: '1px solid rgba(74, 222, 128, 0.2)' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '1rem', color: '#333' }}>
                Passenger Details 👤
              </h3>
              <div style={{ display: 'grid', gap: '0.5rem', color: '#666' }}>
                <p><strong>Name:</strong> {user?.name}</p>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Phone:</strong> {user?.phone}</p>
              </div>
            </div>
          </div>

          {/* Journey Date */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '1rem', color: '#333' }}>
              Select Journey Date 📅
            </h3>
            <input
              type="date"
              value={journeyDate}
              onChange={(e) => setJourneyDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="form-input"
              style={{ maxWidth: '200px' }}
              required
            />
          </div>

          {/* Seat Selection */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '1rem', color: '#333' }}>
              Select Your Seat 💺
            </h3>
            {!journeyDate ? (
              <p style={{ color: '#666' }}>Please select journey date first</p>
            ) : availableSeats.length === 0 ? (
              <p style={{ color: '#ef4444' }}>No seats available for this date</p>
            ) : (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))', gap: '0.5rem', maxWidth: '600px' }}>
                  {[...availableSeats, ...bookedSeats].sort((a, b) => {
                    const numA = parseInt(a.substring(1));
                    const numB = parseInt(b.substring(1));
                    return numA - numB;
                  }).map((seat) => {
                    const isBooked = bookedSeats.includes(seat);
                    return (
                      <button
                        key={seat}
                        onClick={() => !isBooked && setSelectedSeat(seat)}
                        disabled={isBooked}
                        className="btn"
                        style={{
                          padding: '0.75rem',
                          background: isBooked 
                            ? '#ef4444' 
                            : selectedSeat === seat 
                              ? 'linear-gradient(90deg, #4ade80, #3b82f6)' 
                              : 'rgba(255, 255, 255, 0.8)',
                          color: isBooked || selectedSeat === seat ? 'white' : '#333',
                          border: isBooked 
                            ? '2px solid #dc2626' 
                            : selectedSeat === seat 
                              ? '2px solid #4ade80' 
                              : '2px solid #e1e5e9',
                          cursor: isBooked ? 'not-allowed' : 'pointer',
                          opacity: isBooked ? 0.6 : 1,
                          transform: selectedSeat === seat ? 'scale(1.05)' : 'scale(1)'
                        }}
                      >
                        {seat}
                      </button>
                    );
                  })}
                </div>
                <div style={{ marginTop: '1rem', display: 'flex', gap: '2rem', fontSize: '0.9rem', color: '#666' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '20px', height: '20px', background: 'rgba(255, 255, 255, 0.8)', border: '2px solid #e1e5e9', borderRadius: '4px' }}></div>
                    <span>Available</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '20px', height: '20px', background: '#ef4444', borderRadius: '4px' }}></div>
                    <span>Booked</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '20px', height: '20px', background: 'linear-gradient(90deg, #4ade80, #3b82f6)', borderRadius: '4px' }}></div>
                    <span>Selected</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Price Summary */}
          <div className="card" style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '1rem', color: '#333' }}>
              Price Summary 💰
            </h3>
            <div className="flex justify-between items-center">
              <span style={{ color: '#666', fontSize: '1.1rem' }}>Ticket Price:</span>
              <span style={{ fontSize: '2rem', fontWeight: '700', color: '#333' }}>
                ₹{route.price}
              </span>
            </div>
          </div>

          {/* Book Button */}
          <button
            onClick={handleBooking}
            disabled={!selectedSeat || !journeyDate || booking}
            className="btn btn-primary w-full"
            style={{ 
              padding: '1rem', 
              fontSize: '1.2rem', 
              fontWeight: '600',
              opacity: !selectedSeat || !journeyDate || booking ? 0.6 : 1
            }}
          >
            <CreditCard size={20} style={{ marginRight: '0.5rem' }} />
            {booking ? '🔄 Processing...' : `💳 Pay ₹${route.price} & Book Now`}
          </button>
          
          <p style={{ textAlign: 'center', color: '#666', marginTop: '1rem', fontSize: '0.9rem' }}>
            Payment will be processed instantly. You'll receive your ticket via email. 📧
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookTicket;