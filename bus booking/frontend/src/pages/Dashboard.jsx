import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Ticket, CreditCard, Download, MapPin, Clock, X, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    fetchUserData();
    
    // Prevent back navigation from dashboard
    window.history.pushState(null, '', window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, '', window.location.href);
    };
    window.addEventListener('popstate', handlePopState);
    
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const fetchUserData = async () => {
    try {
      const [bookingsRes, transactionsRes] = await Promise.all([
        axios.get('http://localhost:3033/api/booking/my-bookings'),
        axios.get('http://localhost:3033/api/user/transactions')
      ]);
      setBookings(bookingsRes.data);
      setTransactions(transactionsRes.data);
    } catch (error) {
      console.error('Dashboard error:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
      } else {
        toast.error('Failed to load dashboard data');
      }
    } finally {
      setLoading(false);
    }
  };

  const downloadTicket = (pdfUrl, ticketNumber) => {
    const link = document.createElement('a');
    link.href = `http://localhost:3033${pdfUrl}`;
    link.download = `ticket-${ticketNumber}.pdf`;
    link.click();
  };

  const openCancelModal = (booking) => {
    setSelectedBooking(booking);
    setShowCancelModal(true);
  };

  const closeCancelModal = () => {
    setShowCancelModal(false);
    setSelectedBooking(null);
  };

  const confirmCancelBooking = async () => {
    if (!selectedBooking) return;
    
    setCancelLoading(true);
    try {
      const response = await axios.post(`http://localhost:3033/api/booking/cancel/${selectedBooking._id}`);
      toast.success(`Booking cancelled! Refund: ₹${response.data.refundAmount}`);
      fetchUserData();
      closeCancelModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Cancellation failed');
    } finally {
      setCancelLoading(false);
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
                      {booking.status === 'completed' && (
                        <span style={{ 
                          padding: '0.25rem 0.5rem', 
                          borderRadius: '10px', 
                          fontSize: '0.8rem',
                          background: 'rgba(156, 163, 175, 0.2)',
                          color: '#6b7280'
                        }}>
                          Journey Over
                        </span>
                      )}
                      {booking.status === 'active' && (
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
                              onClick={() => openCancelModal(booking)}
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

      {/* Cancel Booking Confirmation Modal */}
      {showCancelModal && (
        <div className="modal-overlay" onClick={closeCancelModal}>
          <div className="cancel-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cancel-modal-header">
              <div className="cancel-modal-icon">
                <AlertTriangle size={32} />
              </div>
              <button 
                className="cancel-modal-close"
                onClick={closeCancelModal}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="cancel-modal-content">
              <h3>Cancel Booking Confirmation</h3>
              <p>Are you sure you want to cancel this booking?</p>
              
              {selectedBooking && (
                <div className="booking-details">
                  <div className="detail-item">
                    <span className="label">Bus:</span>
                    <span className="value">{selectedBooking.routeId?.busName}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Route:</span>
                    <span className="value">{selectedBooking.routeId?.from} → {selectedBooking.routeId?.to}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Seat:</span>
                    <span className="value">{selectedBooking.seatNumber}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Amount:</span>
                    <span className="value">₹{selectedBooking.routeId?.price}</span>
                  </div>
                </div>
              )}
              
              <div className="warning-text">
                ⚠️ This action cannot be undone. Refund will be processed according to our cancellation policy.
              </div>
            </div>
            
            <div className="cancel-modal-actions">
              <button 
                className="btn btn-secondary"
                onClick={closeCancelModal}
                disabled={cancelLoading}
              >
                Keep Booking
              </button>
              <button 
                className="btn btn-danger"
                onClick={confirmCancelBooking}
                disabled={cancelLoading}
              >
                {cancelLoading ? '🔄 Cancelling...' : '✅ Yes, Cancel Booking'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;