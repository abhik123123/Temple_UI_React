import { useState, useMemo, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { eventsAPI } from '../services/templeAPI';
import EventRegistrationModal from '../components/EventRegistrationModal';

export default function Events() {
  const { t } = useLanguage();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEventForRegistration, setSelectedEventForRegistration] = useState(null);
  const [registeredEvents, setRegisteredEvents] = useState(new Set());
  const [filterCategory, setFilterCategory] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [imageErrors, setImageErrors] = useState(new Set());

  // Fetch events from localStorage
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await eventsAPI.getAll();
        const eventsArray = Array.isArray(response.data) ? response.data : [];
        console.log('[Events] Loaded events:', eventsArray);
        setEvents(eventsArray);
        setError(null);
      } catch (err) {
        console.error('[Events] Error loading events:', err);
        setError('Failed to load events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Filter events based on selected filters
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const eventDate = new Date(event.eventDate || event.date);
      
      // Filter by category
      if (filterCategory && event.category !== filterCategory) {
        return false;
      }
      
      // Filter by month
      if (filterMonth) {
        if (eventDate.getMonth() + 1 !== parseInt(filterMonth)) {
          return false;
        }
      }
      
      // Filter by year
      if (filterYear) {
        if (eventDate.getFullYear() !== parseInt(filterYear)) {
          return false;
        }
      }
      
      return true;
    });
  }, [events, filterCategory, filterMonth, filterYear]);

  // Get unique years and categories for filters
  const availableYears = useMemo(() => {
    const years = events.map(event => {
      const date = new Date(event.eventDate || event.date);
      return date.getFullYear();
    });
    return [...new Set(years)].sort((a, b) => b - a);
  }, [events]);

  const availableCategories = useMemo(() => {
    const categories = events.map(event => event.category).filter(Boolean);
    return [...new Set(categories)];
  }, [events]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Date TBD';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (err) {
      console.error('[Events] Error formatting date:', err);
      return 'Date TBD';
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'Time TBD';
    try {
      const parts = timeString.split(':');
      const hours = parseInt(parts[0]);
      const minutes = parts[1] || '00';
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHour = hours % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    } catch (err) {
      console.error('[Events] Error formatting time:', err);
      return 'Time TBD';
    }
  };

  const handleRegisterClick = (event) => {
    setSelectedEventForRegistration(event);
  };

  const handleRegistrationSuccess = (response) => {
    console.log('[Events] Registration successful:', response);
    setRegisteredEvents(prev => new Set([...prev, selectedEventForRegistration.id]));
    setSelectedEventForRegistration(null);
  };

  const handleImageError = (eventId) => {
    setImageErrors(prev => new Set([...prev, eventId]));
  };

  const clearFilters = () => {
    setFilterCategory('');
    setFilterMonth('');
    setFilterYear('');
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
          <h1 style={{ color: 'white' }}>📅 {t('events_title') || 'Temple Events'}</h1>
          <p style={{ color: '#f0f0f0' }}>{t('events_subtitle') || 'Join us in celebrating our spiritual journey'}</p>
        </div>
      </div>

      <div className="container">
        <h2 style={{ color: '#8b4513', marginBottom: '1.5rem', textAlign: 'center' }}>
          🌟 Upcoming Events
        </h2>

        {/* Filters Section */}
        <div style={{
          background: '#f9f9f9',
          padding: '1.5rem',
          borderRadius: '8px',
          marginBottom: '2rem',
          border: '1px solid #ddd'
        }}>
          <h3 style={{ color: '#8b4513', marginBottom: '1rem', fontSize: '1.1rem' }}>
            🔍 Filter Events
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            {/* Category Filter */}
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555', fontSize: '0.9rem' }}>
                🏷️ Category
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '0.9rem'
                }}
              >
                <option value="">All Categories</option>
                {availableCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Month Filter */}
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555', fontSize: '0.9rem' }}>
                📆 Month
              </label>
              <select
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '0.9rem'
                }}
              >
                <option value="">All Months</option>
                <option value="1">January</option>
                <option value="2">February</option>
                <option value="3">March</option>
                <option value="4">April</option>
                <option value="5">May</option>
                <option value="6">June</option>
                <option value="7">July</option>
                <option value="8">August</option>
                <option value="9">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </select>
            </div>

            {/* Year Filter */}
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555', fontSize: '0.9rem' }}>
                📅 Year
              </label>
              <select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '0.9rem'
                }}
              >
                <option value="">All Years</option>
                {availableYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Clear Filters Button */}
          {(filterCategory || filterMonth || filterYear) && (
            <button
              onClick={clearFilters}
              style={{
                padding: '0.5rem 1rem',
                background: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              ✖ Clear Filters
            </button>
          )}

          {/* Results count */}
          <div style={{ marginTop: '1rem', color: '#666', fontSize: '0.9rem' }}>
            Showing {filteredEvents.length} of {events.length} events
          </div>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
            Loading events...
          </div>
        )}

        {error && (
          <div style={{ 
            background: '#ffe5e5', 
            padding: '1rem', 
            borderRadius: '4px', 
            color: '#d32f2f', 
            marginBottom: '2rem' 
          }}>
            ⚠️ {error}
          </div>
        )}

        {!loading && !error && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '2rem'
          }}>
            {filteredEvents.map(event => (
              <div key={event.id} style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
              }}>
                {/* Event Image */}
                {event.imageUrl && !imageErrors.has(event.id) ? (
                  <div style={{ 
                    width: '100%', 
                    height: '200px', 
                    overflow: 'hidden',
                    backgroundColor: '#f5e6d3'
                  }}>
                    <img 
                      src={event.imageUrl} 
                      alt={event.eventName || event.title || 'Event'}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                      onError={(e) => {
                        console.error('[Events] Image failed to load for event:', event.eventName || event.title);
                        handleImageError(event.id);
                      }}
                    />
                  </div>
                ) : (
                  <div style={{ 
                    width: '100%', 
                    height: '200px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '3rem',
                    backgroundColor: '#f5e6d3',
                    color: '#8b4513'
                  }}>
                    📅
                  </div>
                )}
                
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'start',
                    marginBottom: '1rem'
                  }}>
                    <h3 style={{ 
                      margin: 0, 
                      color: '#8b4513',
                      fontSize: '1.3rem',
                      flex: 1
                    }}>
                      {event.eventName || event.title || 'Untitled Event'}
                    </h3>
                    {event.category && (
                      <span style={{ 
                        display: 'inline-block', 
                        padding: '0.25rem 0.75rem', 
                        background: '#e8f5e9',
                        color: '#2e7d32',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        marginLeft: '0.5rem'
                      }}>
                        {event.category}
                      </span>
                    )}
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <p style={{ margin: '0 0 0.5rem 0', color: '#666', fontSize: '0.95rem' }}>
                      <strong>📅 Date:</strong> {formatDate(event.eventDate || event.date)}
                    </p>
                    <p style={{ margin: '0 0 0.5rem 0', color: '#666', fontSize: '0.95rem' }}>
                      <strong>⏰ Time:</strong> {formatTime(event.startTime)}
                      {event.endTime && ` - ${formatTime(event.endTime)}`}
                    </p>
                    {event.location && (
                      <p style={{ margin: '0', color: '#666', fontSize: '0.95rem' }}>
                        <strong>📍 Location:</strong> {event.location}
                      </p>
                    )}
                  </div>

                  <p style={{ 
                    margin: '0 0 1.5rem 0', 
                    color: '#555',
                    fontSize: '0.9rem',
                    lineHeight: '1.5'
                  }}>
                    {event.description || 'No description available'}
                  </p>

                  <button 
                    onClick={() => handleRegisterClick(event)}
                    style={{ 
                      width: '100%',
                      padding: '0.75rem 1rem',
                      background: registeredEvents.has(event.id) ? '#b0bec5' : '#8b4513',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: registeredEvents.has(event.id) ? 'not-allowed' : 'pointer',
                      fontSize: '1rem',
                      fontWeight: '500',
                      transition: 'all 0.3s ease'
                    }}
                    disabled={registeredEvents.has(event.id)}
                    onMouseEnter={(e) => {
                      if (!registeredEvents.has(event.id)) {
                        e.target.style.background = '#6d3410';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!registeredEvents.has(event.id)) {
                        e.target.style.background = '#8b4513';
                      }
                    }}
                  >
                    {registeredEvents.has(event.id) ? '✅ Registered' : '📝 Register for Event'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && filteredEvents.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#999' }}>
            {events.length === 0 
              ? 'No events scheduled at the moment. Please check back later!' 
              : 'No events match the selected filters.'}
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
