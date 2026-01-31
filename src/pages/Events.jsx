import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useUpcomingEvents } from '../hooks/useAPI';
import { eventsAPI } from '../services/api';
import EventRegistrationModal from '../components/EventRegistrationModal';

// Helper function to get the API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Helper function to construct full image URL
const getImageUrl = (imageData) => {
  if (!imageData) return null;
  
  // If it's already a full URL (http:// or https://)
  if (typeof imageData === 'string' && (imageData.startsWith('http://') || imageData.startsWith('https://'))) {
    return imageData;
  }
  
  // If it's a relative path, construct full URL
  if (typeof imageData === 'string') {
    // Remove leading slash if present to avoid double slashes
    const cleanPath = imageData.startsWith('/') ? imageData.substring(1) : imageData;
    return `${API_BASE_URL}/${cleanPath}`;
  }
  
  // If backend returns an object with photoUrl or similar
  if (typeof imageData === 'object') {
    if (imageData.photoUrl) return getImageUrl(imageData.photoUrl);
    if (imageData.imageUrl) return getImageUrl(imageData.imageUrl);
    if (imageData.url) return getImageUrl(imageData.url);
  }
  
  return null;
};

export default function Events() {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const { events: backendEvents, loading, error, refetch } = useUpcomingEvents();
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedEventForRegistration, setSelectedEventForRegistration] = useState(null);
  const [registeredEvents, setRegisteredEvents] = useState(new Set());
  const [formData, setFormData] = useState({
    eventName: '',
    description: '',
    eventDate: '',
    startTime: '',
    endTime: '',
    location: '',
    category: 'Festival'
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // No fallback mock data - only show backend data
  const displayEvents = backendEvents && backendEvents.length > 0 ? backendEvents : [];

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const parts = timeString.split(':');
    const hours = parseInt(parts[0]);
    const minutes = parts[1] || '00';
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHour = hours % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitError(null);

    try {
      await eventsAPI.create(formData);
      setFormData({
        eventName: '',
        description: '',
        eventDate: '',
        startTime: '',
        endTime: '',
        location: '',
        category: 'Festival'
      });
      setShowAddForm(false);
      refetch();
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to add event');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      await eventsAPI.delete(eventId);
      refetch();
    } catch (err) {
      alert('Failed to delete event: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleRegisterClick = (event) => {
    console.log('Register button clicked for:', event.eventName);
    console.log('Setting selectedEventForRegistration to:', event);
    setSelectedEventForRegistration(event);
    console.log('State should be set now');
  };

  const handleRegistrationSuccess = (response) => {
    console.log('Registration successful:', response);
    setRegisteredEvents(prev => new Set([...prev, selectedEvent.id]));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="page">
      <div className="hero" style={{
        backgroundImage: 'url(/images/temple-images/sitarama.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)'
        }}></div>
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <h1 style={{ color: 'white' }}>📅 {t('events_title')}</h1>
          <p style={{ color: '#f0f0f0' }}>{t('events_upcoming')}</p>
        </div>
      </div>

      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ textAlign: 'center', flex: 1, color: '#8b4513' }}>{t('events_upcoming')}</h2>
          {isAuthenticated && (
            <button 
              className="btn" 
              onClick={() => setShowAddForm(!showAddForm)}
              style={{ marginLeft: 'auto' }}
            >
              {showAddForm ? '❌ Cancel' : '➕ Add Event'}
            </button>
          )}
        </div>

        {showAddForm && isAuthenticated && (
          <div style={{
            background: '#f9f9f9',
            padding: '2rem',
            borderRadius: '8px',
            marginBottom: '2rem',
            border: '1px solid #ddd'
          }}>
            <h3 style={{ color: '#8b4513', marginBottom: '1.5rem' }}>Add New Event</h3>
            {submitError && (
              <div style={{ background: '#ffe5e5', padding: '1rem', borderRadius: '4px', color: '#d32f2f', marginBottom: '1rem' }}>
                ⚠️ {submitError}
              </div>
            )}
            <form onSubmit={handleAddEvent}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <input
                  type="text"
                  name="eventName"
                  placeholder="Event Name"
                  value={formData.eventName}
                  onChange={handleInputChange}
                  required
                  style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd' }}
                />
                <input
                  type="date"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleInputChange}
                  required
                  style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  required
                  style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd' }}
                />
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  required
                  style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <input
                  type="text"
                  name="location"
                  placeholder="Location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd' }}
                />
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd' }}
                >
                  <option value="Festival">Festival</option>
                  <option value="Prayer">Prayer</option>
                  <option value="Ceremony">Ceremony</option>
                  <option value="Class">Class</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <textarea
                name="description"
                placeholder="Event Description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows="4"
                style={{ 
                  width: '100%', 
                  padding: '0.75rem', 
                  borderRadius: '4px', 
                  border: '1px solid #ddd',
                  marginBottom: '1rem',
                  fontFamily: 'inherit'
                }}
              />
              <button 
                type="submit" 
                className="btn"
                disabled={submitLoading}
                style={{ opacity: submitLoading ? 0.6 : 1, cursor: submitLoading ? 'not-allowed' : 'pointer' }}
              >
                {submitLoading ? 'Adding...' : 'Add Event'}
              </button>
            </form>
          </div>
        )}

        {loading && (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
            Loading events...
          </div>
        )}

        {error && (
          <div style={{ background: '#ffe5e5', padding: '1rem', borderRadius: '4px', color: '#d32f2f', marginBottom: '2rem' }}>
            ⚠️ {error}
          </div>
        )}

        <div className="cards-grid">
          {displayEvents.map(event => (
            <div key={event.id} className="card">
              {/* Event Image */}
              {event.imageUrl && (
                <div style={{ 
                  width: '100%', 
                  height: '200px', 
                  overflow: 'hidden',
                  backgroundColor: '#f5e6d3'
                }}>
                  <img 
                    src={event.imageUrl} 
                    alt={event.eventName}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      // Hide image if it fails to load and show icon instead
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
              
              {/* Show icon only if no image */}
              {!event.imageUrl && (
                <div className="card-image" style={{ fontSize: '2.5rem', padding: '1rem', textAlign: 'center', background: '#f5e6d3' }}>
                  {event.icon || '📅'}
                </div>
              )}
              
              <div className="card-content">
                <h3>{event.eventName}</h3>
                <p><strong>📅 Date:</strong> {formatDate(event.eventDate)}</p>
                <p><strong>⏰ Time:</strong> {formatTime(event.startTime)} - {formatTime(event.endTime)}</p>
                {event.location && <p><strong>📍 Location:</strong> {event.location}</p>}
                {event.category && <p><strong>Category:</strong> {event.category}</p>}
                <p style={{ margin: '1rem 0', color: '#555' }}>{event.description}</p>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ 
                    display: 'inline-block', 
                    padding: '0.25rem 0.75rem', 
                    background: event.status === 'Upcoming' ? '#4caf50' : '#ff9800',
                    color: 'white',
                    borderRadius: '12px',
                    fontSize: '0.85rem'
                  }}>
                    {event.status || 'Upcoming'}
                  </span>
                  {isAuthenticated && (
                    <button 
                      onClick={() => handleDeleteEvent(event.id)}
                      style={{
                        background: '#d32f2f',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.85rem'
                      }}
                    >
                      🗑️ Delete
                    </button>
                  )}
                </div>
                <button 
                  onClick={() => {
                    console.log('Register button onClick triggered');
                    handleRegisterClick(event);
                  }}
                  className="btn" 
                  style={{ 
                    marginTop: '1rem', 
                    width: '100%',
                    background: registeredEvents.has(event.id) ? '#b0bec5' : undefined
                  }}
                  disabled={registeredEvents.has(event.id)}
                >
                  {registeredEvents.has(event.id) ? '✅ Registered' : 'Register'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {displayEvents.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#999' }}>
            No events scheduled at the moment.
          </div>
        )}

        {selectedEventForRegistration && (
          <EventRegistrationModal 
            event={selectedEventForRegistration}
            onClose={() => setSelectedEventForRegistration(null)}
            onSuccess={handleRegistrationSuccess}
          />
        )}
      </div>
    </div>
  );
}
