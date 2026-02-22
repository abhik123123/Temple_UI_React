import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, requireAuth, environment, isAuthenticated, user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect logic to prevent users from accidentally landing on login page
  useEffect(() => {
    // If user is already authenticated and is an admin, redirect to admin home
    if (isAuthenticated && user?.role === 'admin') {
      navigate('/home/admin', { replace: true });
      return;
    }

    // If user is already authenticated but not an admin, redirect to user home
    if (isAuthenticated && user?.role !== 'admin') {
      navigate('/home', { replace: true });
      return;
    }

    // If authentication is not required (local environment) and user directly accessed /login
    // without coming from an admin route, redirect to home
    if (!requireAuth && !location.state?.from) {
      // Give a brief moment to show a message, then redirect
      const timer = setTimeout(() => {
        navigate('/home', { replace: true });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, user, requireAuth, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(username, password);
    setLoading(false);

    if (result.success) {
      // Redirect to the page they were trying to access, or admin home
      const from = location.state?.from || '/home/admin';
      navigate(from);
    } else {
      setError(result.message);
    }
  };

  // Show a redirect message for non-auth environments
  if (!requireAuth && !location.state?.from) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #8b4513 0%, #a0522d 100%)'
        }}
      >
        <div
          style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            maxWidth: '400px',
            width: '100%',
            textAlign: 'center'
          }}
        >
          <h1 style={{ color: '#8b4513', marginBottom: '1rem' }}>🏛️ {t('home_title')}</h1>
          <div
            style={{
              background: '#e3f2fd',
              padding: '1.5rem',
              borderRadius: '4px',
              marginBottom: '1rem',
              color: '#1565c0',
              fontSize: '1rem'
            }}
          >
            <p style={{ marginBottom: '0.5rem' }}>ℹ️ Redirecting to home page...</p>
            <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>
              Login is only required for admin access.
            </p>
          </div>
          <button
            onClick={() => navigate('/home')}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#8b4513',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold'
            }}
          >
            Go to Home Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #8b4513 0%, #a0522d 100%)'
      }}
    >
      <div
        style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          maxWidth: '400px',
          width: '100%'
        }}
      >
        <h1 style={{ textAlign: 'center', color: '#8b4513', marginBottom: '0.5rem' }}>🏛️ {t('home_title')}</h1>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '2rem' }}>
          Environment: <strong>{environment.toUpperCase()}</strong>
        </p>

        {!requireAuth && (
          <div
            style={{
              background: '#e8f5e9',
              padding: '1rem',
              borderRadius: '4px',
              marginBottom: '1.5rem',
              color: '#2e7d32',
              fontSize: '0.9rem'
            }}
          >
            ✓ {t('login_no_auth')}
          </div>
        )}

        {requireAuth && (
          <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#555', marginBottom: '1.5rem' }}>
            Admin login requires a username and password.
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
              {t('login_username')}
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              placeholder="Enter your username"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
              {t('login_password')}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              placeholder="Enter your password"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            />
          </div>

          {error && (
            <div
              style={{
                background: '#ffebee',
                color: '#c62828',
                padding: '0.75rem',
                borderRadius: '4px',
                marginBottom: '1rem',
                fontSize: '0.9rem'
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: '#8b4513',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {!requireAuth && (
          <div style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: '#666', textAlign: 'center' }}>
            <p>🔓 {t('login_no_auth')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
