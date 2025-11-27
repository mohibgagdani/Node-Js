import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Mail, Lock, ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('http://localhost:3033/api/auth/forgot-password', {
        email: formData.email
      });
      toast.success('OTP sent to your email 📧');
      setStep(2);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await axios.post('http://localhost:3033/api/auth/reset-password', {
        email: formData.email,
        otp: formData.otp,
        newPassword: formData.newPassword
      });
      toast.success('Password reset successfully! You can now login. ✅');
      setStep(1);
      setFormData({ email: '', otp: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      <div className="form-container fade-in-up">
        <div className="text-center mb-4">
          <h2 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem', color: '#333' }}>
            {step === 1 ? 'Forgot Password? 🔐' : 'Reset Password 🔄'}
          </h2>
          <p style={{ color: '#666', fontSize: '1.1rem' }}>
            {step === 1 
              ? 'Enter your email to receive an OTP'
              : 'Enter OTP and your new password'
            }
          </p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleEmailSubmit}>
            <div className="form-group">
              <div style={{ position: 'relative' }}>
                <Mail size={20} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#4ade80' }} />
                <input
                  name="email"
                  type="email"
                  required
                  className="form-input"
                  style={{ paddingLeft: '50px' }}
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full"
              style={{ padding: '1rem', fontSize: '1.1rem', fontWeight: '600' }}
            >
              {loading ? '📤 Sending OTP...' : '📧 Send OTP'}
            </button>

            <div className="text-center mt-4">
              <Link
                to="/login"
                style={{ color: '#4ade80', textDecoration: 'none', fontWeight: '500', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                <ArrowLeft size={16} />
                Back to Login
              </Link>
            </div>
          </form>
        ) : (
          <form onSubmit={handlePasswordReset}>
            <div className="form-group">
              <input
                name="otp"
                type="text"
                required
                className="form-input"
                style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.2rem' }}
                placeholder="Enter OTP"
                value={formData.otp}
                onChange={handleChange}
                maxLength={6}
              />
            </div>

            <div className="form-group">
              <div style={{ position: 'relative' }}>
                <Lock size={20} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#4ade80' }} />
                <input
                  name="newPassword"
                  type="password"
                  required
                  className="form-input"
                  style={{ paddingLeft: '50px' }}
                  placeholder="New password"
                  value={formData.newPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <div style={{ position: 'relative' }}>
                <Lock size={20} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#4ade80' }} />
                <input
                  name="confirmPassword"
                  type="password"
                  required
                  className="form-input"
                  style={{ paddingLeft: '50px' }}
                  placeholder="Confirm new password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full"
              style={{ padding: '1rem', fontSize: '1.1rem', fontWeight: '600' }}
            >
              {loading ? '🔄 Resetting Password...' : '✅ Reset Password'}
            </button>

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                style={{ background: 'none', border: 'none', color: '#4ade80', textDecoration: 'none', fontWeight: '500', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer' }}
              >
                <ArrowLeft size={16} />
                Back to Email
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;