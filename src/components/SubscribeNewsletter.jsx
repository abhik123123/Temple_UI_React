/**
 * SubscribeNewsletter.jsx - Newsletter subscription component
 * Allows users to subscribe to weekly temple newsletter
 * Features: Email validation, subscription status, unsubscribe option
 */

import React, { useState, useEffect } from 'react';
import subscriptionAPI from '../services/subscriptionAPI';

const SubscribeNewsletter = ({ isDarkMode = false }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const [loading, setLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [storedEmail, setStoredEmail] = useState('');

  // Check if user has already subscribed (using localStorage)
  useEffect(() => {
    const savedEmail = localStorage.getItem('templeNewsEmail');
    if (savedEmail) {
      setStoredEmail(savedEmail);
      setIsSubscribed(true);
    }
  }, []);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setMessageType('error');
      setMessage('❌ Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      setMessageType('error');
      setMessage('❌ Please enter a valid email address');
      return;
    }

    setLoading(true);
    
    try {
      const response = await subscriptionAPI.subscribe(email);
      
      if (response.success || response.email) {
        setMessageType('success');
        setMessage('✅ Successfully subscribed! You will receive temple news every Sunday at 2:00 AM');
        setEmail('');
        setIsSubscribed(true);
        setStoredEmail(email);
        localStorage.setItem('templeNewsEmail', email);
      } else {
        setMessageType('error');
        setMessage('❌ ' + (response.message || 'Subscription failed'));
      }
    } catch (error) {
      setMessageType('error');
      const errorMsg = error.message || 'Subscription failed. Please try again.';
      setMessage('❌ ' + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    if (!window.confirm('Are you sure you want to unsubscribe from temple news?')) {
      return;
    }

    setLoading(true);
    
    try {
      await subscriptionAPI.unsubscribe(storedEmail);
      
      setMessageType('success');
      setMessage('✅ You have been unsubscribed from temple news');
      setIsSubscribed(false);
      setStoredEmail('');
      localStorage.removeItem('templeNewsEmail');
    } catch (error) {
      setMessageType('error');
      setMessage('❌ Failed to unsubscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      padding: '2rem',
      borderRadius: '12px',
      backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa',
      border: isDarkMode ? '2px solid #333' : '2px solid #e9ecef',
      maxWidth: '600px',
      margin: '2rem auto',
      boxShadow: isDarkMode ? '0 4px 8px rgba(255,255,255,0.1)' : '0 4px 8px rgba(0,0,0,0.1)',
      transition: 'all 0.3s ease'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{
          fontSize: '1.8rem',
          fontWeight: 'bold',
          color: isDarkMode ? '#fff' : '#0B1C3F',
          margin: '0 0 0.5rem 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem'
        }}>
          📧 Subscribe to Temple News
        </h2>
        <p style={{
          color: isDarkMode ? '#aaa' : '#666',
          margin: '0',
          fontSize: '0.95rem'
        }}>
          Receive weekly temple events every Sunday at 2:00 AM
        </p>
      </div>

      {/* Content based on subscription status */}
      {isSubscribed ? (
        <div style={{
          backgroundColor: isDarkMode ? '#0d3d0d' : '#e8f5e9',
          border: isDarkMode ? '1px solid #1b5e1b' : '1px solid #c8e6c9',
          borderRadius: '8px',
          padding: '1.5rem',
          marginBottom: '1rem'
        }}>
          <div style={{
            color: isDarkMode ? '#90ee90' : '#2e7d32',
            marginBottom: '0.5rem',
            fontWeight: 'bold',
            fontSize: '1.1rem'
          }}>
            ✅ Subscription Active
          </div>
          <p style={{
            color: isDarkMode ? '#aaa' : '#555',
            margin: '0.5rem 0 0 0',
            fontSize: '0.95rem'
          }}>
            Email: <strong>{storedEmail}</strong>
          </p>
          <p style={{
            color: isDarkMode ? '#aaa' : '#666',
            margin: '0.5rem 0 0 0',
            fontSize: '0.9rem'
          }}>
            You will receive temple events notifications every Sunday morning.
          </p>
          <button
            onClick={handleUnsubscribe}
            disabled={loading}
            style={{
              marginTop: '1rem',
              padding: '0.6rem 1.5rem',
              backgroundColor: '#d32f2f',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              fontSize: '0.9rem',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#b71c1c')}
            onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#d32f2f')}
          >
            {loading ? 'Processing...' : 'Unsubscribe'}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubscribe} style={{ marginBottom: '1rem' }}>
          {/* Email Input */}
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.8rem 1rem',
                fontSize: '1rem',
                border: isDarkMode ? '1px solid #444' : '1px solid #ddd',
                borderRadius: '6px',
                backgroundColor: isDarkMode ? '#2a2a2a' : '#fff',
                color: isDarkMode ? '#fff' : '#000',
                boxSizing: 'border-box',
                transition: 'border-color 0.3s ease',
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'text'
              }}
              onFocus={(e) => {
                if (!loading) {
                  e.target.style.borderColor = '#E6B325';
                  e.target.style.boxShadow = '0 0 0 3px rgba(230, 179, 37, 0.1)';
                }
              }}
              onBlur={(e) => {
                e.target.style.borderColor = isDarkMode ? '#444' : '#ddd';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Subscribe Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.8rem 1.5rem',
              fontSize: '1rem',
              fontWeight: 'bold',
              backgroundColor: '#E6B325',
              color: '#0B1C3F',
              border: 'none',
              borderRadius: '6px',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              opacity: loading ? 0.7 : 1,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
            onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#d4a820')}
            onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#E6B325')}
          >
            {loading ? '⏳ Subscribing...' : '✉️ Subscribe Now'}
          </button>
        </form>
      )}

      {/* Message Display */}
      {message && (
        <div style={{
          padding: '0.8rem 1rem',
          borderRadius: '6px',
          marginTop: '1rem',
          fontSize: '0.95rem',
          fontWeight: '500',
          backgroundColor: messageType === 'success'
            ? (isDarkMode ? '#0d3d0d' : '#e8f5e9')
            : (isDarkMode ? '#3d0d0d' : '#ffebee'),
          color: messageType === 'success'
            ? (isDarkMode ? '#90ee90' : '#2e7d32')
            : (isDarkMode ? '#ff6b6b' : '#c62828'),
          border: messageType === 'success'
            ? (isDarkMode ? '1px solid #1b5e1b' : '1px solid #c8e6c9')
            : (isDarkMode ? '1px solid #5d0d0d' : '1px solid #ffcdd2'),
          animation: 'slideIn 0.3s ease'
        }}>
          {message}
        </div>
      )}

      {/* Features List */}
      <div style={{
        marginTop: '1.5rem',
        paddingTop: '1.5rem',
        borderTop: isDarkMode ? '1px solid #333' : '1px solid #e9ecef'
      }}>
        <h4 style={{
          color: isDarkMode ? '#e0e0e0' : '#0B1C3F',
          fontSize: '0.9rem',
          fontWeight: 'bold',
          margin: '0 0 0.8rem 0',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          📋 What You'll Get:
        </h4>
        <ul style={{
          listStyle: 'none',
          padding: '0',
          margin: '0',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          {[
            '📅 Weekly temple events & schedules',
            '🎉 Festival announcements & celebrations',
            '🙏 Special rituals & prayers',
            '📢 Important temple announcements'
          ].map((feature, idx) => (
            <li key={idx} style={{
              color: isDarkMode ? '#bbb' : '#666',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* Style for animation */}
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default SubscribeNewsletter;
