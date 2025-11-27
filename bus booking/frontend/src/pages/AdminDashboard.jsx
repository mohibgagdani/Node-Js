import { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Bus, Ticket, DollarSign, Download, Plus, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({});
  const [routes, setRoutes] = useState([]);
  const [offers, setOffers] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportDates, setExportDates] = useState({ startDate: '', endDate: '' });
  const [bookingDates, setBookingDates] = useState({ startDate: '', endDate: '' });
  const [editingBooking, setEditingBooking] = useState(null);
  const [bookingForm, setBookingForm] = useState({ seatNumber: '', status: '' });

  const [routeForm, setRouteForm] = useState({
    busName: '', from: '', to: '', departureTime: '', arrivalTime: '', price: '', totalSeats: ''
  });

  const [offerForm, setOfferForm] = useState({
    offerTitle: '', offerDescription: '', discountValue: '', validTill: ''
  });

  useEffect(() => {
    fetchDashboardData();
    
    // Prevent back navigation from admin dashboard
    window.history.pushState(null, '', window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, '', window.location.href);
    };
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, routesRes, offersRes, usersRes, bookingsRes] = await Promise.all([
        axios.get('http://localhost:3033/api/admin/dashboard'),
        axios.get('http://localhost:3033/api/admin/routes'),
        axios.get('http://localhost:3033/api/admin/offers'),
        axios.get('http://localhost:3033/api/admin/users'),
        axios.get('http://localhost:3033/api/admin/bookings')
      ]);

      setStats(statsRes.data);
      setRoutes(routesRes.data);
      setOffers(offersRes.data);
      setUsers(usersRes.data);
      setAllBookings(bookingsRes.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleRouteSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await axios.put(`http://localhost:3033/api/admin/routes/${editingItem._id}`, routeForm);
        toast.success('Route updated successfully ✅');
      } else {
        await axios.post('http://localhost:3033/api/admin/routes', routeForm);
        toast.success('Route added successfully ✅');
      }
      setShowModal(false);
      setEditingItem(null);
      setRouteForm({ busName: '', from: '', to: '', departureTime: '', arrivalTime: '', price: '', totalSeats: '' });
      fetchDashboardData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleOfferSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await axios.put(`http://localhost:3033/api/admin/offers/${editingItem._id}`, offerForm);
        toast.success('Offer updated successfully ✅');
      } else {
        await axios.post('http://localhost:3033/api/admin/offers', offerForm);
        toast.success('Offer added successfully ✅');
      }
      setShowModal(false);
      setEditingItem(null);
      setOfferForm({ offerTitle: '', offerDescription: '', discountValue: '', validTill: '' });
      fetchDashboardData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (type, id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      await axios.delete(`http://localhost:3033/api/admin/${type}/${id}`);
      toast.success('Item deleted successfully ✅');
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to delete item');
    }
  };

  const exportBookings = async () => {
    if (!exportDates.startDate || !exportDates.endDate) {
      toast.error('Please select both start and end dates');
      return;
    }

    try {
      const response = await axios.get('http://localhost:3033/api/admin/export/bookings', {
        params: {
          startDate: exportDates.startDate,
          endDate: exportDates.endDate
        },
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `bookings-${exportDates.startDate}-to-${exportDates.endDate}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('Bookings exported successfully 📊');
      setShowExportModal(false);
      setExportDates({ startDate: '', endDate: '' });
    } catch (error) {
      toast.error('Failed to export bookings');
    }
  };

  const openModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    
    if (type === 'route') {
      setRouteForm(item || { busName: '', from: '', to: '', departureTime: '', arrivalTime: '', price: '', totalSeats: '' });
    } else if (type === 'offer') {
      setOfferForm(item || { offerTitle: '', offerDescription: '', discountValue: '', validTill: '' });
    } else if (type === 'booking') {
      setBookingForm({ seatNumber: item?.seatNumber || '', status: item?.status || 'active' });
      setEditingBooking(item);
    }
    
    setShowModal(true);
  };

  const handleBookingUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3033/api/admin/bookings/${editingBooking._id}`, bookingForm);
      toast.success('Booking updated successfully ✅');
      setShowModal(false);
      setEditingBooking(null);
      setBookingForm({ seatNumber: '', status: '' });
      
      // Refresh data
      const bookingsRes = await axios.get('http://localhost:3033/api/admin/bookings');
      setAllBookings(bookingsRes.data);
      
      // Re-apply filter if dates are set
      if (bookingDates.startDate && bookingDates.endDate) {
        const start = new Date(bookingDates.startDate);
        const end = new Date(bookingDates.endDate);
        end.setHours(23, 59, 59, 999);
        const filtered = bookingsRes.data.filter(booking => {
          const bookingDate = new Date(booking.date);
          return bookingDate >= start && bookingDate <= end;
        });
        setBookings([...filtered]);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    }
  };



  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        Loading admin dashboard...
      </div>
    );
  }

  return (
    <div className="section">
      <div className="container">
        {/* Header */}
        <div className="card fade-in-up" style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem', color: '#333' }}>
            Admin Dashboard 👑
          </h1>
          <p style={{ color: '#666', fontSize: '1.1rem' }}>
            Manage your bus booking system
          </p>
        </div>

        {/* Tabs */}
        <div style={{ borderBottom: '1px solid rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            {['dashboard', 'routes', 'offers', 'users', 'bookings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '1rem 0',
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === tab ? '3px solid #4ade80' : '3px solid transparent',
                  color: activeTab === tab ? '#4ade80' : '#666',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textTransform: 'capitalize'
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div>
            {/* Stats Cards */}
            <div className="stats-grid">
              <div className="stat-card fade-in-up">
                <div className="stat-icon blue">
                  <Users size={24} />
                </div>
                <div className="stat-info">
                  <h3>Total Users</h3>
                  <p>{stats.totalUsers || 0}</p>
                </div>
              </div>

              <div className="stat-card fade-in-up">
                <div className="stat-icon green">
                  <Ticket size={24} />
                </div>
                <div className="stat-info">
                  <h3>Total Bookings</h3>
                  <p>{stats.totalBookings || 0}</p>
                </div>
              </div>

              <div className="stat-card fade-in-up">
                <div className="stat-icon purple">
                  <DollarSign size={24} />
                </div>
                <div className="stat-info">
                  <h3>Total Revenue</h3>
                  <p>₹{stats.totalRevenue || 0}</p>
                </div>
              </div>

              <div className="stat-card fade-in-up">
                <div className="stat-icon yellow">
                  <Bus size={24} />
                </div>
                <div className="stat-info">
                  <h3>Active Routes</h3>
                  <p>{routes.length}</p>
                </div>
              </div>
            </div>

            {/* Export Button */}
            <div className="card fade-in-up">
              <h3 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '1rem', color: '#333' }}>
                Export Data 📊
              </h3>
              <button
                onClick={() => setShowExportModal(true)}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Download size={16} />
                Export Bookings CSV
              </button>
            </div>
          </div>
        )}

        {/* Routes Tab */}
        {activeTab === 'routes' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 style={{ fontSize: '1.8rem', fontWeight: '600', color: '#333' }}>
                Bus Routes 🚌
              </h2>
              <button
                onClick={() => openModal('route')}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Plus size={16} />
                Add Route
              </button>
            </div>

            <div className="table-container fade-in-up">
              <table className="table">
                <thead>
                  <tr>
                    <th>Bus Name</th>
                    <th>Route</th>
                    <th>Time</th>
                    <th>Price</th>
                    <th>Seats</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {routes.map((route) => (
                    <tr key={route._id}>
                      <td style={{ fontWeight: '600' }}>{route.busName}</td>
                      <td>{route.from} → {route.to}</td>
                      <td>{route.departureTime} - {route.arrivalTime}</td>
                      <td>₹{route.price}</td>
                      <td>{route.availableSeats}/{route.totalSeats}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => openModal('route', route)}
                            style={{ background: 'none', border: 'none', color: '#4ade80', cursor: 'pointer' }}
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete('routes', route._id)}
                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Offers Tab */}
        {activeTab === 'offers' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 style={{ fontSize: '1.8rem', fontWeight: '600', color: '#333' }}>
                Offers 🎉
              </h2>
              <button
                onClick={() => openModal('offer')}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Plus size={16} />
                Add Offer
              </button>
            </div>

            <div className="card-grid">
              {offers.map((offer) => (
                <div key={offer._id} className="card fade-in-up">
                  <div className="flex justify-between items-start mb-2">
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#333' }}>{offer.offerTitle}</h3>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => openModal('offer', offer)}
                        style={{ background: 'none', border: 'none', color: '#4ade80', cursor: 'pointer' }}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete('offers', offer._id)}
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <p style={{ color: '#666', marginBottom: '1rem' }}>{offer.offerDescription}</p>
                  <div className="flex justify-between items-center">
                    <span style={{ fontSize: '1.5rem', fontWeight: '700', color: '#4ade80' }}>{offer.discountValue}% OFF</span>
                    <span style={{ fontSize: '0.9rem', color: '#666' }}>
                      Valid till {new Date(offer.validTill).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '600', color: '#333', marginBottom: '1rem' }}>
              Users 👥
            </h2>
            <div className="table-container fade-in-up">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Verified</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td style={{ fontWeight: '600' }}>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td>
                        <span style={{ 
                          padding: '0.25rem 0.5rem', 
                          borderRadius: '10px', 
                          fontSize: '0.8rem',
                          background: user.isVerified ? 'rgba(74, 222, 128, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                          color: user.isVerified ? '#16a34a' : '#dc2626'
                        }}>
                          {user.isVerified ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td>{new Date(user.accountCreatedDate).toLocaleDateString()}</td>
                      <td>
                        <button
                          onClick={() => handleDelete('users', user._id)}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '600', color: '#333', marginBottom: '1rem' }}>
              Bookings 🎫
            </h2>
            
            <div className="card fade-in-up" style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '1rem', color: '#333' }}>
                Select Date Range *
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333', fontSize: '0.9rem' }}>
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={bookingDates.startDate}
                    onChange={(e) => setBookingDates({ ...bookingDates, startDate: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333', fontSize: '0.9rem' }}>
                    End Date
                  </label>
                  <input
                    type="date"
                    value={bookingDates.endDate}
                    onChange={(e) => setBookingDates({ ...bookingDates, endDate: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
                <button
                  onClick={() => {
                    if (!bookingDates.startDate || !bookingDates.endDate) {
                      toast.error('Please select both dates');
                      return;
                    }
                    const start = new Date(bookingDates.startDate);
                    const end = new Date(bookingDates.endDate);
                    end.setHours(23, 59, 59, 999);
                    
                    const filtered = allBookings.filter(booking => {
                      const bookingDate = new Date(booking.date);
                      return bookingDate >= start && bookingDate <= end;
                    });
                    setBookings([...filtered]);
                    toast.success(`Found ${filtered.length} bookings`);
                  }}
                  type="button"
                  className="btn btn-primary"
                >
                  Filter
                </button>
              </div>
            </div>
            
            <div className="table-container fade-in-up">
              <table className="table">
                <thead>
                  <tr>
                    <th>Ticket #</th>
                    <th>User</th>
                    <th>Route</th>
                    <th>Seat</th>
                    <th>Price</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                        {bookingDates.startDate && bookingDates.endDate ? 'No bookings found in selected date range' : 'Please select date range to view bookings'}
                      </td>
                    </tr>
                  ) : bookings.map((booking) => (
                    <tr key={booking._id}>
                      <td style={{ fontWeight: '600' }}>{booking.ticketNumber}</td>
                      <td>{booking.userId?.name}</td>
                      <td>{booking.routeId?.from} → {booking.routeId?.to}</td>
                      <td>{booking.seatNumber}</td>
                      <td>₹{booking.routeId?.price}</td>
                      <td>{new Date(booking.date).toLocaleDateString()}</td>
                      <td>
                        <span style={{ 
                          padding: '0.25rem 0.5rem', 
                          borderRadius: '10px', 
                          fontSize: '0.8rem',
                          background: booking.status === 'cancelled' ? 'rgba(239, 68, 68, 0.2)' : booking.status === 'completed' ? 'rgba(156, 163, 175, 0.2)' : 'rgba(74, 222, 128, 0.2)',
                          color: booking.status === 'cancelled' ? '#dc2626' : booking.status === 'completed' ? '#6b7280' : '#16a34a'
                        }}>
                          {booking.status === 'completed' ? 'Journey Over' : booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="modal-overlay">
          <div className="modal fade-in-up">
            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#333' }}>
              Export Bookings 📊
            </h3>
            <p style={{ color: '#666', marginBottom: '1.5rem' }}>
              Select date range to export bookings
            </p>
            
            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                Start Date
              </label>
              <input
                type="date"
                value={exportDates.startDate}
                onChange={(e) => setExportDates({ ...exportDates, startDate: e.target.value })}
                className="form-input"
                required
              />
            </div>
            
            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                End Date
              </label>
              <input
                type="date"
                value={exportDates.endDate}
                onChange={(e) => setExportDates({ ...exportDates, endDate: e.target.value })}
                className="form-input"
                required
              />
            </div>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                type="button"
                onClick={() => {
                  setShowExportModal(false);
                  setExportDates({ startDate: '', endDate: '' });
                }}
                className="btn btn-secondary"
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button
                onClick={exportBookings}
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                Export CSV
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal fade-in-up">
            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#333' }}>
              {modalType === 'booking' ? 'Edit Booking' : `${editingItem ? 'Edit' : 'Add'} ${modalType === 'route' ? 'Route' : 'Offer'}`}
            </h3>
            
            {modalType === 'route' ? (
              <form onSubmit={handleRouteSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Bus Name"
                    value={routeForm.busName}
                    onChange={(e) => setRouteForm({ ...routeForm, busName: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <input
                    type="text"
                    placeholder="From"
                    value={routeForm.from}
                    onChange={(e) => setRouteForm({ ...routeForm, from: e.target.value })}
                    className="form-input"
                    required
                  />
                  <input
                    type="text"
                    placeholder="To"
                    value={routeForm.to}
                    onChange={(e) => setRouteForm({ ...routeForm, to: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <input
                    type="time"
                    placeholder="Departure Time"
                    value={routeForm.departureTime}
                    onChange={(e) => setRouteForm({ ...routeForm, departureTime: e.target.value })}
                    className="form-input"
                    required
                  />
                  <input
                    type="time"
                    placeholder="Arrival Time"
                    value={routeForm.arrivalTime}
                    onChange={(e) => setRouteForm({ ...routeForm, arrivalTime: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <input
                    type="number"
                    placeholder="Price"
                    value={routeForm.price}
                    onChange={(e) => setRouteForm({ ...routeForm, price: e.target.value })}
                    className="form-input"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Total Seats"
                    value={routeForm.totalSeats}
                    onChange={(e) => setRouteForm({ ...routeForm, totalSeats: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn btn-secondary"
                    style={{ flex: 1 }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                  >
                    {editingItem ? 'Update' : 'Add'}
                  </button>
                </div>
              </form>
            ) : modalType === 'booking' ? (
              <form onSubmit={handleBookingUpdate}>
                <div className="form-group">
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                    Seat Number
                  </label>
                  <input
                    type="text"
                    placeholder="Seat Number"
                    value={bookingForm.seatNumber}
                    onChange={(e) => setBookingForm({ ...bookingForm, seatNumber: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                    Status
                  </label>
                  <select
                    value={bookingForm.status}
                    onChange={(e) => setBookingForm({ ...bookingForm, status: e.target.value })}
                    className="form-input"
                    required
                  >
                    <option value="active">Active</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingBooking(null);
                      setBookingForm({ seatNumber: '', status: '' });
                    }}
                    className="btn btn-secondary"
                    style={{ flex: 1 }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                  >
                    Update
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleOfferSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Offer Title"
                    value={offerForm.offerTitle}
                    onChange={(e) => setOfferForm({ ...offerForm, offerTitle: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <textarea
                    placeholder="Offer Description"
                    value={offerForm.offerDescription}
                    onChange={(e) => setOfferForm({ ...offerForm, offerDescription: e.target.value })}
                    className="form-input"
                    rows={3}
                    required
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <input
                    type="number"
                    placeholder="Discount Value (%)"
                    value={offerForm.discountValue}
                    onChange={(e) => setOfferForm({ ...offerForm, discountValue: e.target.value })}
                    className="form-input"
                    required
                  />
                  <input
                    type="date"
                    placeholder="Valid Till"
                    value={offerForm.validTill}
                    onChange={(e) => setOfferForm({ ...offerForm, validTill: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn btn-secondary"
                    style={{ flex: 1 }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                  >
                    {editingItem ? 'Update' : 'Add'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}


    </div>
  );
};

export default AdminDashboard;