import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Ticket, CreditCard, Download, MapPin, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const [bookingsRes, transactionsRes] = await Promise.all([
        axios.get('http://localhost:8080/api/booking/my-bookings'),
        axios.get('http://localhost:8080/api/user/transactions')
      ]);
      setBookings(bookingsRes.data);
      setTransactions(transactionsRes.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const downloadTicket = (pdfUrl, ticketNumber) => {
    const link = document.createElement('a');
    link.href = `http://localhost:8080${pdfUrl}`;
    link.download = `ticket-${ticketNumber}.pdf`;
    link.click();
  };

  const cancelBooking = async (bookingId) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    try {
      const response = await axios.post(`http://localhost:8080/api/booking/cancel/${bookingId}`);
      toast.success(`Booking cancelled! Refund: ₹${response.data.refundAmount}`);
      fetchUserData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Cancellation failed');
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        Loading your dashboard...
      </div>
    );
  }

  return (
    <div className="section">
      <div className="container">
        {/* Welcome Section */}
        <div className="card fade-in-up" style={{ marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem', color: '#333' }}>
            Welcome back, {user?.name}! 👋
          </h1>
          <p style={{ color: '#666', fontSize: '1.1rem' }}>
            Manage your bookings and view your travel history
          </p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card fade-in-up">
            <div className="stat-icon blue">
              <Ticket size={24} />
            </div>
            <div className="stat-info">
              <h3>Total Bookings</h3>
              <p>{bookings.length}</p>
            </div>
          </div>
          
          <div className="stat-card fade-in-up">
            <div className="stat-icon green">
              <CreditCard size={24} />
            </div>
            <div className="stat-info">
              <h3>Total Spent</h3>
              <p>₹{transactions.reduce((sum, t) => sum + t.amount, 0)}</p>
            </div>
          </div>
          
          <div className="stat-card fade-in-up">
            <div className="stat-icon purple">
              <MapPin size={24} />
            </div>
            <div className="stat-info">
              <h3>Cities Visited</h3>
              <p>{new Set(bookings.map(b => b.routeId?.to)).size}</p>
            </div>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="card fade-in-up">
          <h2 style={{ fontSize: '1.8rem', fontWeight: '600', marginBottom: '2rem', color: '#333' }}>
            Recent Bookings 🎫
          </h2>
          
          {bookings.length === 0 ? (
            <div className="text-center" style={{ padding: '3rem' }}>
              <Ticket size={48} style={{ color: '#ccc', margin: '0 auto 1rem' }} />
              <p style={{ color: '#666', marginBottom: '2rem', fontSize: '1.1rem' }}>
                No bookings yet
              </p>
              <Link to="/" className="btn btn-primary">
                Book Your First Trip
              </Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {bookings.slice(0, 5).map((booking) => (
                <div
                  key={booking._id}
                  className="card"
                  style={{ padding: '1.5rem', border: '1px solid rgba(0,0,0,0.1)' }}
                >
                  <div className="flex justify-between items-start">
                    <div style={{ flex: 1 }}>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#333' }}>
                          {booking.routeId?.busName}
                        </h3>
                        <span className="btn btn-success" style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}>
                          {booking.paymentStatus}
                        </span>
                      </div>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', color: '#666' }}>
                        <div className="flex items-center gap-2">
                          <MapPin size={16} style={{ color: '#4ade80' }} />
                          {booking.routeId?.from} → {booking.routeId?.to}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={16} style={{ color: '#4ade80' }} />
                          {new Date(booking.date).toLocaleDateString()}
                        </div>
                        <div>
                          Seat: {booking.seatNumber}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: '1.2rem', fontWeight: '600', color: '#333' }}>
                        ₹{booking.routeId?.price}
                      </span>
                      {booking.status === 'cancelled' && (
                        <span style={{ 
                          padding: '0.25rem 0.5rem', 
                          borderRadius: '10px', 
                          fontSize: '0.8rem',
                          background: 'rgba(239, 68, 68, 0.2)',
                          color: '#dc2626'
                        }}>
                          Cancelled
                        </span>
                      )}
                      {booking.status !== 'cancelled' && (
                        <>
                          {booking.pdfTicketURL && (
                            <button
                              onClick={() => downloadTicket(booking.pdfTicketURL, booking.ticketNumber)}
                              className="btn btn-primary"
                              style={{ padding: '0.5rem' }}
                              title="Download Ticket"
                            >
                              <Download size={16} />
                            </button>
                          )}
                          {new Date(booking.journeyDate || booking.date) > new Date() && (
                            <button
                              onClick={() => cancelBooking(booking._id)}
                              className="btn btn-danger"
                              style={{ padding: '0.5rem' }}
                              title="Cancel Booking"
                            >
                              Cancel
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="card-grid" style={{ marginTop: '3rem' }}>
          <Link to="/" className="card text-center fade-in-up" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Ticket size={48} style={{ color: '#4ade80', margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '0.5rem', color: '#333' }}>
              Book New Ticket
            </h3>
            <p style={{ color: '#666' }}>Find and book your next journey</p>
          </Link>
          
          <Link to="/profile" className="card text-center fade-in-up" style={{ textDecoration: 'none', color: 'inherit' }}>
            <CreditCard size={48} style={{ color: '#3b82f6', margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '0.5rem', color: '#333' }}>
              View Profile
            </h3>
            <p style={{ color: '#666' }}>Manage your account settings</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;