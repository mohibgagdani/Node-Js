import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Mail, Lock, Shield } from 'lucide-react';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { adminLogin } = useAuth();
  const navigate = useNavigate();

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
      const response = await axios.post('http://localhost:8080/api/auth/admin/login', formData);
      adminLogin(response.data.admin, response.data.token);
      toast.success('Admin login successful! 👑');
      navigate('/admin/dashboard');
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
          <div className="stat-icon blue" style={{ margin: '0 auto 1rem' }}>
            <Shield size={32} />
          </div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem', color: '#333' }}>
            Admin Login 👑
          </h2>
          <p style={{ color: '#666', fontSize: '1.1rem' }}>
            Access the admin dashboard
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
                placeholder="Admin email"
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
                placeholder="Admin password"
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

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full"
            style={{ padding: '1rem', fontSize: '1.1rem', fontWeight: '600' }}
          >
            {loading ? '🔄 Signing in...' : '👑 Sign in as Admin'}
          </button>
        </form>


      </div>
    </div>
  );
};

export default AdminLogin;