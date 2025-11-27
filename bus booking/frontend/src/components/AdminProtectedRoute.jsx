import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminProtectedRoute = ({ children }) => {
  const { admin, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        Loading...
      </div>
    );
  }
  
  if (!admin) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
};

export default AdminProtectedRoute;