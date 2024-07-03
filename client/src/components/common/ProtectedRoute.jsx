// src/components/common/ProtectedRoute.jsx
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedUserTypes }) => {
  const { isAuthenticated, userType } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    if (allowedUserTypes.includes('candidate')) {
      return <Navigate to="/candidate-login" replace />;
    } else if (allowedUserTypes.includes('restaurant')) {
      return <Navigate to="/restaurant-login" replace />;
    } else if (allowedUserTypes.includes('admin')) {
      return <Navigate to="/admin-login" replace />;
    }
    return <Navigate to="/" replace />;
  }

  if (!allowedUserTypes.includes(userType)) {
    switch (userType) {
      case 'candidate':
        return <Navigate to="/candidate" replace />;
      case 'restaurant':
        return <Navigate to="/restaurant" replace />;
      case 'admin':
        return <Navigate to="/admin" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;