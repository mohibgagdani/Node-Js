import axios from 'axios';

const API_URL = 'http://localhost:3001/api/auth';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const authService = {
  register: (name, email, password) => {
    return api.post('/register', { name, email, password });
  },

  login: (email, password) => {
    return api.post('/login', { email, password });
  },

  forgotPassword: (email) => {
    return api.post('/forgot-password', { email });
  },

  resetPassword: (email, otp, password) => {
    return api.post('/reset-password', { email, otp, password });
  },

  getProfile: () => {
    return api.get('/profile');
  }
};

export default authService;