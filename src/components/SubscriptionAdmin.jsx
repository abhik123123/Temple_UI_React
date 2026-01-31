/**
 * SubscriptionAdmin.jsx - Admin subscription management
 * Features: View subscribers, send test emails, view statistics
 */

import React, { useState, useEffect } from 'react';
import subscriptionAPI from '../services/subscriptionAPI';

const SubscriptionAdmin = () => {
  const [stats, setStats] = useState({
    totalSubscribers: 0,
    activeSubscribers: 0,
    unsubscribed: 0
  });
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [testEmail, setTestEmail] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);

  // Load statistics and subscribers
  useEffect(() => {
    loadData();
  }, [currentPage]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load statistics
      const statsData = await subscriptionAPI.getStatistics();
      setStats(statsData);

      // Load subscribers
      const subscribersData = await subscriptionAPI.getAllSubscribers(currentPage, pageSize);
      setSubscribers(Array.isArray(subscribersData) ? subscribersData : []);
    } catch (error) {
      setMessageType('error');
      setMessage('❌ Failed to load data: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleSendTestEmail = async (e) => {
    e.preventDefault();

    if (!testEmail.trim()) {
      setMessageType('error');
      setMessage('❌ Please enter an email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(testEmail)) {
      setMessageType('error');
      setMessage('❌ Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      await subscriptionAPI.sendTestEmail(testEmail);
      setMessageType('success');
      setMessage('✅ Test email sent successfully to ' + testEmail);
      setTestEmail('');
    } catch (error) {
      setMessageType('error');
      setMessage('❌ Failed to send test email: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setCurrentPage(0);
    loadData();
  };

  return (
    <div style={{ padding: '2rem', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ color: '#0B1C3F', fontSize: '2rem', margin: '0 0 0.5rem 0' }}>
          📧 Subscription Management
        </h2>
        <p style={{ color: '#666', margin: '0' }}>Manage temple newsletter subscriptions</p>
      </div>

      {/* Statistics Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* Total Subscribers Card */}
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          borderLeft: '4px solid #E6B325'
        }}>
          <div style={{ color: '#999', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
            Total Subscribers
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#E6B325' }}>
            {stats.totalSubscribers || 0}
          </div>
        </div>

        {/* Active Subscribers Card */}
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          borderLeft: '4px solid #4caf50'
        }}>
          <div style={{ color: '#999', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
            Active Subscribers
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#4caf50' }}>
            {stats.activeSubscribers || 0}
          </div>
        </div>

        {/* Unsubscribed Card */}
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          borderLeft: '4px solid #ff9800'
        }}>
          <div style={{ color: '#999', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
            Unsubscribed
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#ff9800' }}>
            {stats.unsubscribed || 0}
          </div>
        </div>
      </div>

      {/* Test Email Section */}
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '2rem'
      }}>
        <h3 style={{ color: '#0B1C3F', margin: '0 0 1rem 0', fontSize: '1.3rem' }}>
          ✉️ Send Test Email
        </h3>
        <form onSubmit={handleSendTestEmail} style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="email"
            placeholder="Enter email address"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            disabled={loading}
            style={{
              flex: 1,
              padding: '0.8rem 1rem',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '1rem',
              boxSizing: 'border-box'
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '0.8rem 1.5rem',
              backgroundColor: '#E6B325',
              color: '#0B1C3F',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
            onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#d4a820')}
            onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#E6B325')}
          >
            {loading ? 'Sending...' : 'Send Test'}
          </button>
        </form>
      </div>

      {/* Message Display */}
      {message && (
        <div style={{
          padding: '1rem',
          borderRadius: '6px',
          marginBottom: '2rem',
          backgroundColor: messageType === 'success' ? '#e8f5e9' : '#ffebee',
          color: messageType === 'success' ? '#2e7d32' : '#c62828',
          border: messageType === 'success' ? '1px solid #c8e6c9' : '1px solid #ffcdd2'
        }}>
          {message}
        </div>
      )}

      {/* Subscribers Table */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        {/* Header with Refresh Button */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid #eee',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{ color: '#0B1C3F', margin: '0', fontSize: '1.3rem' }}>
            📋 Subscribers ({subscribers.length})
          </h3>
          <button
            onClick={handleRefresh}
            disabled={loading}
            style={{
              padding: '0.6rem 1.2rem',
              backgroundColor: '#f0f0f0',
              border: '1px solid #ddd',
              borderRadius: '6px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: '500',
              fontSize: '0.9rem'
            }}
            onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#e0e0e0')}
            onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#f0f0f0')}
          >
            🔄 Refresh
          </button>
        </div>

        {/* Table */}
        {subscribers.length > 0 ? (
          <table style={{
            width: '100%',
            borderCollapse: 'collapse'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 'bold', color: '#666' }}>
                  Email
                </th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 'bold', color: '#666' }}>
                  Status
                </th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 'bold', color: '#666' }}>
                  Subscribed Date
                </th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 'bold', color: '#666' }}>
                  Last Email Sent
                </th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((subscriber, index) => (
                <tr
                  key={subscriber.id || index}
                  style={{
                    borderBottom: '1px solid #eee',
                    backgroundColor: index % 2 === 0 ? '#fff' : '#f9f9f9'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#fff' : '#f9f9f9'}
                >
                  <td style={{ padding: '1rem', color: '#333' }}>
                    {subscriber.email}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '0.3rem 0.8rem',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      fontWeight: 'bold',
                      backgroundColor: subscriber.status === 'ACTIVE' ? '#e8f5e9' : '#ffebee',
                      color: subscriber.status === 'ACTIVE' ? '#2e7d32' : '#c62828'
                    }}>
                      {subscriber.status || 'UNKNOWN'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', color: '#666', fontSize: '0.9rem' }}>
                    {subscriber.subscribedAt
                      ? new Date(subscriber.subscribedAt).toLocaleDateString()
                      : 'N/A'}
                  </td>
                  <td style={{ padding: '1rem', color: '#666', fontSize: '0.9rem' }}>
                    {subscriber.lastSentDate
                      ? new Date(subscriber.lastSentDate).toLocaleDateString()
                      : 'Never'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{
            padding: '3rem',
            textAlign: 'center',
            color: '#999'
          }}>
            {loading ? '⏳ Loading subscribers...' : '📭 No subscribers yet'}
          </div>
        )}

        {/* Pagination */}
        {subscribers.length > 0 && (
          <div style={{
            padding: '1.5rem',
            borderTop: '1px solid #eee',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 0 || loading}
              style={{
                padding: '0.6rem 1.2rem',
                backgroundColor: currentPage === 0 ? '#f0f0f0' : '#E6B325',
                color: currentPage === 0 ? '#ccc' : '#0B1C3F',
                border: 'none',
                borderRadius: '6px',
                cursor: currentPage === 0 || loading ? 'not-allowed' : 'pointer',
                fontWeight: 'bold'
              }}
            >
              ← Previous
            </button>
            <span style={{ color: '#666', fontWeight: '500' }}>
              Page {currentPage + 1}
            </span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={subscribers.length < pageSize || loading}
              style={{
                padding: '0.6rem 1.2rem',
                backgroundColor: subscribers.length < pageSize ? '#f0f0f0' : '#E6B325',
                color: subscribers.length < pageSize ? '#ccc' : '#0B1C3F',
                border: 'none',
                borderRadius: '6px',
                cursor: subscribers.length < pageSize || loading ? 'not-allowed' : 'pointer',
                fontWeight: 'bold'
              }}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionAdmin;
