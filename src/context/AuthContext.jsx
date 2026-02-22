import React, { createContext, useState, useCallback, useEffect } from 'react';
import { authAPI, STORAGE_KEYS } from '../services/templeAPI';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);

  // Determine if auth is required based on environment
  const environment = process.env.REACT_APP_ENV || 'no-auth';
  const requireAuth = environment !== 'no-auth'; // Only no-auth disables authentication

  // Restore auth state from localStorage on mount
  useEffect(() => {
    // If auth is required, don't auto-restore from localStorage for security
    // Force a fresh login instead
    if (requireAuth) {
      console.log('Auth required - clearing any cached auth state for security');
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      setUser(null);
      setIsAuthenticated(false);
      return;
    }

    // Only restore auth state if auth is NOT required (no-auth mode)
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    const savedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    
    if (token && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        // Clear invalid data
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      }
    }
  }, [requireAuth]);

  const login = useCallback(async (username, password) => {
    setLoading(true);
    try {
      const response = await authAPI.login({ username, password });
      const { user: userData, token } = response.data;
      
      setUser(userData);
      setIsAuthenticated(true);
      
      return { success: true, message: 'Login successful' };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.message || 'Login failed. Use: admin/admin123' 
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    // Dynamic auth configuration based on environment
    requireAuth,
    useJWT: requireAuth,
    authType: requireAuth ? 'jwt' : 'local',
    environment,
    backendUrl: requireAuth ? process.env.REACT_APP_API_URL : 'localStorage',
    description: requireAuth 
      ? 'Backend Authentication Required' 
      : 'Local Storage Only - No Backend Required'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
