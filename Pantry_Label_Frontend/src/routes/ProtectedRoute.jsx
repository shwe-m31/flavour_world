import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export const ProtectedRoute = ({ children, requiresProfileCompleted = true }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // If AuthContext is resolving/loading user details, return nothing or empty wrapper
  // To avoid flicker, we can check loading, but the instructions say:
  // "Do not introduce unnecessary loading logic."
  // So we proceed to check authentication directly.
  
  if (!isAuthenticated) {
    if (sessionStorage.getItem('flavour_world_logged_out') === 'true') {
      sessionStorage.removeItem('flavour_world_logged_out');
      return <Navigate to="/" replace />;
    }
    // Redirect to login, saving the original location they tried to reach
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user has not completed profile, redirect them to profile setup
  if (requiresProfileCompleted && user && !user.profileCompleted) {
    return <Navigate to="/profile-setup" replace />;
  }

  // If profile is already completed and they try to go back to profile setup,
  // redirect them to dashboard
  if (!requiresProfileCompleted && user && user.profileCompleted && location.pathname === '/profile-setup') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
