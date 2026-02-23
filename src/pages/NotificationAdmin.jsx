import React, { useState, useEffect } from 'react';
import '../styles/Admin.css';

const NotificationAdmin = () => {
  const [alert, setAlert] = useState({
    subject: '',
    message: ''
  });
  const [testEmail, setTestEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [subscriberCount, setSubscriberCount] = useState(0);

  useEffect(() => {
    fetchSubscriberCount();
  }, []);

  const fetchSubscriberCount = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/newsletter');
      const data = await response.json();
      setSubscriberCount(data.length);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
    }
  };

  const handleSendAlert = async (e) => {
    e.preventDefault();
    
    if (!alert.subject || !alert.message) {
      setStatusMessage({ type: 'error', text: 'Subject and message are required' });
      return;
    }

    setLoading(true);
    setStatusMessage(null);

    try {
      const response = await fetch('http://localhost:8080/api/notifications/send-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alert)
      });

      const data = await response.json();

      if (response.ok) {
        setStatusMessage({
          type: 'success',
          text: `Alert sent to ${data.successCount} subscribers! ${data.failedCount > 0 ? `(${data.failedCount} failed)` : ''}`
        });
        setAlert({ subject: '', message: '' });
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Failed to send alert' });
      }
    } catch (error) {
      setStatusMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleTestEmail = async (e) => {
    e.preventDefault();
    
    if (!testEmail) {
      setStatusMessage({ type: 'error', text: 'Email address is required' });
      return;
    }

    setLoading(true);
    setStatusMessage(null);

    try {
      const response = await fetch('http://localhost:8080/api/notifications/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: testEmail })
      });

      const data = await response.json();

      if (response.ok) {
        setStatusMessage({
          type: 'success',
          text: (
            <div>
              Test email sent successfully!
              {data.previewUrl && (
                <div style={{ marginTop: '10px' }}>
                  <a href={data.previewUrl} target="_blank" rel="noopener noreferrer" 
                     style={{ color: '#E6B325', textDecoration: 'underline' }}>
                    📧 Click here to preview the email
                  </a>
                </div>
              )}
            </div>
          )
        });
        setTestEmail('');
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Failed to send test email' });
      }
    } catch (error) {
      setStatusMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-container">
      <h2>📧 Email Notifications</h2>
      
      <div className="stats-card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', marginBottom: '30px' }}>
        <h3>📊 Newsletter Subscribers</h3>
        <div style={{ fontSize: '48px', fontWeight: 'bold' }}>{subscriberCount}</div>
        <p>Active subscribers will receive alerts</p>
      </div>

      {statusMessage && (
        <div 
          className={`alert ${statusMessage.type === 'success' ? 'alert-success' : 'alert-error'}`}
          style={{
            padding: '15px',
            marginBottom: '20px',
            borderRadius: '8px',
            backgroundColor: statusMessage.type === 'success' ? '#d4edda' : '#f8d7da',
            color: statusMessage.type === 'success' ? '#155724' : '#721c24',
            border: `1px solid ${statusMessage.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`
          }}
        >
          {statusMessage.text}
        </div>
      )}

      {/* Send Alert Section */}
      <div className="admin-section">
        <h3>📢 Send Alert to All Subscribers</h3>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          Send important notifications to all {subscriberCount} newsletter subscribers
        </p>
        
        <form onSubmit={handleSendAlert}>
          <div className="form-group">
            <label>Subject *</label>
            <input
              type="text"
              value={alert.subject}
              onChange={(e) => setAlert({ ...alert, subject: e.target.value })}
              placeholder="e.g., Temple Closure Notice"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Message *</label>
            <textarea
              value={alert.message}
              onChange={(e) => setAlert({ ...alert, message: e.target.value })}
              placeholder="Enter your message here..."
              rows="6"
              required
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading || subscriberCount === 0}
          >
            {loading ? '📤 Sending...' : `📢 Send Alert to ${subscriberCount} Subscribers`}
          </button>
        </form>
      </div>

      {/* Test Email Section */}
      <div className="admin-section" style={{ marginTop: '40px' }}>
        <h3>🧪 Test Email Configuration</h3>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          Send a test email to verify your email service is working correctly
        </p>
        
        <form onSubmit={handleTestEmail}>
          <div className="form-group">
            <label>Test Email Address *</label>
            <input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="your-email@example.com"
              required
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="btn-secondary"
            disabled={loading}
          >
            {loading ? '📤 Sending...' : '🧪 Send Test Email'}
          </button>
        </form>

        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '8px',
          border: '1px solid #dee2e6'
        }}>
          <h4 style={{ marginTop: 0, color: '#495057' }}>💡 Email Service Info</h4>
          <ul style={{ color: '#6c757d', lineHeight: '1.8' }}>
            <li><strong>Default:</strong> Ethereal (test mode) - Check console for preview URL</li>
            <li><strong>Production:</strong> Switch to Gmail, SendGrid, or AWS SES in backend/.env</li>
            <li><strong>Setup Guide:</strong> See EMAIL_SETUP_GUIDE.md in project root</li>
          </ul>
        </div>
      </div>

      {/* Email Templates Preview */}
      <div className="admin-section" style={{ marginTop: '40px' }}>
        <h3>📧 Automatic Email Notifications</h3>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          These emails are sent automatically when users interact with the website
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          <div style={{ 
            padding: '20px', 
            border: '2px solid #e3f2fd', 
            borderRadius: '8px',
            backgroundColor: '#f5f5f5'
          }}>
            <h4 style={{ color: '#1976d2', marginTop: 0 }}>🎉 Event Registration</h4>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: 0 }}>
              Sent when users register for events. Includes event details and confirmation.
            </p>
          </div>

          <div style={{ 
            padding: '20px', 
            border: '2px solid #e8f5e9', 
            borderRadius: '8px',
            backgroundColor: '#f5f5f5'
          }}>
            <h4 style={{ color: '#388e3c', marginTop: 0 }}>🙏 Newsletter Welcome</h4>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: 0 }}>
              Sent to new newsletter subscribers. Welcomes them to the temple community.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationAdmin;
