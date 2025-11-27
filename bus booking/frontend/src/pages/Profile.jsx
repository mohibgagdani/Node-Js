import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { User, Mail, Phone, Lock, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: '',
    phone: ''
  });
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [otp, setOtp] = useState('');
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otpAction, setOtpAction] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        phone: user.phone || ''
      });
    }
    
    // Redirect to dashboard on back button
    const handlePopState = () => {
      window.location.href = '/dashboard';
    };
    window.addEventListener('popstate', handlePopState);
    
    return () => window.removeEventListener('popstate', handlePopState);
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.put('http://localhost:3033/api/user/profile', profileData);
      toast.success('Profile updated successfully! ✅');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const requestPasswordChangeOTP = async () => {
    try {
      await axios.post('http://localhost:3033/api/auth/request-change-password-otp');
      setOtpAction('changePassword');
      setShowOTPModal(true);
      toast.success('OTP sent to your email 📧');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await axios.post('http://localhost:3033/api/auth/change-password', {
        otp,
        newPassword: passwordData.newPassword
      });
      toast.success('Password changed successfully! 🔐');
      setShowOTPModal(false);
      setOtp('');
      setPasswordData({ newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const requestDeleteAccountOTP = async () => {
    try {
      await axios.post('http://localhost:3033/api/auth/request-delete-account-otp');
      setOtpAction('deleteAccount');
      setShowOTPModal(true);
      toast.success('OTP sent to your email 📧');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      await axios.post('http://localhost:3033/api/auth/delete-account', { otp });
      toast.success('Account deleted successfully');
      logout();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete account');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = (e) => {
    e.preventDefault();
    if (otpAction === 'changePassword') {
      handlePasswordChange(e);
    } else if (otpAction === 'deleteAccount') {
      handleDeleteAccount();
    }
  };

  return (
    <div className="section">
      <div className="container">
        <div className="card fade-in-up">
          {/* Header */}
          <div style={{ borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#333' }}>
              Profile Settings ⚙️
            </h1>
          </div>

          {/* Tabs */}
          <div style={{ borderBottom: '1px solid rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', gap: '2rem' }}>
              <button
                onClick={() => setActiveTab('profile')}
                style={{
                  padding: '1rem 0',
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === 'profile' ? '3px solid #4ade80' : '3px solid transparent',
                  color: activeTab === 'profile' ? '#4ade80' : '#666',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                Profile Info
              </button>
              <button
                onClick={() => setActiveTab('security')}
                style={{
                  padding: '1rem 0',
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === 'security' ? '3px solid #4ade80' : '3px solid transparent',
                  color: activeTab === 'security' ? '#4ade80' : '#666',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                Security
              </button>
            </div>
          </div>

          {/* Content */}
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileUpdate}>
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                  Full Name
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={20} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#4ade80' }} />
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="form-input"
                    style={{ paddingLeft: '50px' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={20} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#ccc' }} />
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="form-input"
                    style={{ paddingLeft: '50px', background: '#f5f5f5', color: '#999' }}
                  />
                </div>
                <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
                  Email cannot be changed
                </p>
              </div>

              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                  Phone Number
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone size={20} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#4ade80' }} />
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    className="form-input"
                    style={{ paddingLeft: '50px' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full"
                style={{ padding: '1rem', fontSize: '1.1rem', fontWeight: '600' }}
              >
                {loading ? '🔄 Updating...' : '✅ Update Profile'}
              </button>
            </form>
          )}

          {activeTab === 'security' && (
            <div style={{ display: 'grid', gap: '2rem' }}>
              {/* Change Password */}
              <div className="card" style={{ border: '1px solid rgba(74, 222, 128, 0.2)', background: 'rgba(74, 222, 128, 0.05)' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '1rem', color: '#333' }}>
                  Change Password 🔐
                </h3>
                <form onSubmit={(e) => { e.preventDefault(); requestPasswordChangeOTP(); }}>
                  <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                      New Password
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Lock size={20} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#4ade80' }} />
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        className="form-input"
                        style={{ paddingLeft: '50px' }}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                      Confirm New Password
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Lock size={20} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#4ade80' }} />
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        className="form-input"
                        style={{ paddingLeft: '50px' }}
                        required
                      />
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    Send OTP to Change Password
                  </button>
                </form>
              </div>

              {/* Delete Account */}
              <div className="card" style={{ border: '1px solid rgba(239, 68, 68, 0.2)', background: 'rgba(239, 68, 68, 0.05)' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '1rem', color: '#ef4444' }}>
                  Delete Account ⚠️
                </h3>
                <p style={{ color: '#666', marginBottom: '1rem', lineHeight: '1.6' }}>
                  This action cannot be undone. All your data will be permanently deleted.
                </p>
                <button
                  onClick={requestDeleteAccountOTP}
                  className="btn btn-danger"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <Trash2 size={16} />
                  Delete Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* OTP Modal */}
      {showOTPModal && (
        <div className="modal-overlay">
          <div className={otpAction === 'deleteAccount' ? 'delete-account-modal' : 'modal fade-in-up'}>
            {otpAction === 'deleteAccount' && (
              <div className="delete-modal-header">
                <div className="delete-modal-icon">
                  <Trash2 size={40} />
                </div>
              </div>
            )}
            <div className="delete-modal-content">
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem', color: otpAction === 'deleteAccount' ? '#ef4444' : '#333' }}>
                {otpAction === 'deleteAccount' ? '⚠️ Delete Account' : 'Enter OTP 🔐'}
              </h3>
              <p style={{ color: '#666', marginBottom: '1.5rem' }}>
                {otpAction === 'deleteAccount' 
                  ? 'Enter OTP to permanently delete your account and cancel all tickets'
                  : 'Enter the OTP sent to your email address'
                }
              </p>
              <form onSubmit={handleOTPSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="form-input"
                    style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.2rem' }}
                    placeholder="Enter OTP"
                    maxLength={6}
                    required
                  />
                </div>
                {otpAction === 'deleteAccount' && (
                  <div className="warning-box">
                    <p>⚠️ This action cannot be undone. All your tickets will be cancelled.</p>
                  </div>
                )}
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowOTPModal(false);
                      setOtp('');
                    }}
                    className="btn btn-secondary"
                    style={{ flex: 1 }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`btn ${otpAction === 'deleteAccount' ? 'btn-danger' : 'btn-primary'}`}
                    style={{ flex: 1 }}
                  >
                    {loading ? '🔄 Processing...' : otpAction === 'deleteAccount' ? '🗑️ Delete' : '✅ Verify'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;