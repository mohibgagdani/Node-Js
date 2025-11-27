import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, adminLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the redirect path from location state
  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (formData.email === 'admin@gmail.com') {
        const response = await axios.post('http://localhost:3033/api/auth/admin/login', formData);
        adminLogin(response.data.admin, response.data.token);
        toast.success('Welcome Admin! 🎉');
        navigate('/admin/dashboard', { replace: true });
      } else {
        const response = await axios.post('http://localhost:3033/api/auth/login', formData);
        login(response.data.user, response.data.token);
        toast.success('Welcome back! 🎉');
        navigate(from, { replace: true });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      <div className="form-container fade-in-up">
        <div className="text-center mb-4">
          <h2 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem', color: '#333' }}>
            Welcome Back! 👋
          </h2>
          <p style={{ color: '#666', fontSize: '1.1rem' }}>
            Sign in to continue your journey with us
          </p>
          <p style={{ color: '#666', marginTop: '1rem' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#667eea', textDecoration: 'none', fontWeight: '600' }}>
              Create one here
            </Link>
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
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
          
          <div className="form-group">
            <div style={{ position: 'relative' }}>
              <Lock size={20} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#4ade80' }} />
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                className="form-input"
                style={{ paddingLeft: '50px', paddingRight: '50px' }}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                style={{ 
                  position: 'absolute', 
                  right: '15px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer',
                  color: '#4ade80'
                }}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <Link 
              to="/forgot-password" 
              style={{ 
                color: '#4ade80', 
                textDecoration: 'none', 
                fontSize: '0.9rem',
                fontWeight: '500'
              }}
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full"
            style={{ padding: '1rem', fontSize: '1.1rem', fontWeight: '600' }}
          >
            {loading ? '🔄 Signing in...' : '🚀 Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;