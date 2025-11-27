import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const GuestRoute = ({ children, adminRoute = false }) => {
  const { user, admin, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        Loading...
      </div>
    );
  }
  
  // If admin is logged in, redirect to admin dashboard
  if (admin) {
    return <Navigate to="/admin/dashboard" />;
  }
  
  // If it's a user route and user is logged in, redirect to dashboard
  if (!adminRoute && user) {
    return <Navigate to="/dashboard" />;
  }
  
  // If neither user nor admin is logged in, show the page
  return children;
};

export default GuestRoute;