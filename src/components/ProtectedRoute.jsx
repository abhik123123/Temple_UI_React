import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { isAuthenticated, user, requireAuth } = useAuth();
  const location = useLocation();

  // Debug logging
  console.log('ProtectedRoute Debug:', {
    pathname: location.pathname,
    requireAdmin,
    requireAuth,
    isAuthenticated,
    user: user?.name || 'No user'
  });

  // If authentication is not required (NO-AUTH mode), allow access to everything
  if (!requireAuth) {
    console.log('NO-AUTH mode - allowing access');
    return children;
  }

  // If this is an admin route (requireAdmin = true), enforce authentication and admin role
  if (requireAdmin) {
    // Admin routes always require authentication in AUTH mode
    if (!isAuthenticated) {
      console.log('Admin route - user not authenticated, redirecting to login');
      return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }
    // Check if user has admin role
    if (user?.role !== 'admin') {
      console.log('Admin route - user is not admin, redirecting to home');
      return <Navigate to="/" replace />;
    }
    // User is authenticated and is admin
    console.log('Admin route - user is authenticated and is admin, allowing access');
    return children;
  }

  // For non-admin routes in AUTH mode:
  // If authentication is required and user is authenticated, allow access
  if (isAuthenticated) {
    console.log('Non-admin route - user is authenticated, allowing access');
    return children;
  }

  // Otherwise, redirect to login
  console.log('Non-admin route - user not authenticated, redirecting to login');
  return <Navigate to="/login" state={{ from: location.pathname }} replace />;
}
