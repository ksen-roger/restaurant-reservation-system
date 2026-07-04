import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Wraps any page that needs auth (and optionally a specific role).
// Usage: <ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>
const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;

  return children;
};

export default ProtectedRoute;