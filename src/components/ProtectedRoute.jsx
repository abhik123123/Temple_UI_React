import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { isAuthenticated, user, requireAuth } = useAuth();

  // If this is an admin route (requireAdmin = true), enforce authentication and admin role
  if (requireAdmin) {
    // Admin routes always require authentication
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    // Check if user has admin role
    if (user?.role !== 'admin') {
      return <Navigate to="/" replace />;
    }
    // User is authenticated and is admin
    return children;
  }

  // For non-admin routes:
  // If authentication is not required (local environment), allow access
  if (!requireAuth) {
    return children;
  }

  // If authentication is required and user is authenticated, allow access
  if (isAuthenticated) {
    return children;
  }

  // Otherwise, redirect to login
  return <Navigate to="/login" replace />;
}
