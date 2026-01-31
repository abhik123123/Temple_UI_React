import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { eventsAPI } from '../services/templeAPI';

const translations = {
  en: {
    events: 'Events',
    register: 'Register',
    registered: 'Registered',
    viewDetails: 'View Details',
    noEvents: 'No events available',
    date: 'Date',
    time: 'Time',
    location: 'Location',
    description: 'Description',
    loading: 'Loading events...',
    error: 'Error loading events',
    registerSuccess: 'Successfully registered for event!',
    registerError: 'Failed to register for event',
    upcomingEvents: 'Upcoming Events'
  },
  te: {
    events: 'ఈవెంట్‌లు',
    register: 'రిజిస్టర్',
    registered: 'నిబంధించబడినవి',
    viewDetails: 'వివరాలను చూడండి',
    noEvents: 'ఈవెంట్‌లు అందుబాటులో లేవు',
    date: 'తేదీ',
    time: 'సమయం',
    location: 'ప్రదేశం',
    description: 'వివరణ',
    loading: 'ఈవెంట్‌లు లోడ్ చేస్తోంది...',
    error: 'ఈవెంట్‌లను లోడ్ చేయడంలో లోపం',
    registerSuccess: 'ఈవెంట్‌కు విజయవంతంగా నిబంధించబడ్డారు!',
    registerError: 'ఈవెంట్‌కు నిబంధించడం విఫలమైంది',
    upcomingEvents: 'రాబోయే ఈవెంట్‌లు'
  },
  hi: {
    events: 'कार्यक्रम',
    register: 'पंजीकृत करें',
    registered: 'पंजीकृत',
    viewDetails: 'विवरण देखें',
    noEvents: 'कोई घटना उपलब्ध नहीं है',
    date: 'तारीख',
    time: 'समय',
    location: 'स्थान',
    description: 'विवरण',
    loading: 'ईवेंट लोड हो रहे हैं...',
    error: 'ईवेंट लोड करने में त्रुटि',
    registerSuccess: 'इवेंट के लिए सफलतापूर्वक पंजीकृत!',
    registerError: 'इवेंट के लिए पंजीकरण विफल',
    upcomingEvents: 'आने वाले कार्यक्रम'
  }
};

// Mock data for when backend is not available
const MOCK_EVENTS = [
  {
    id: 1,
    title: 'Diwali Celebration',
    date: '2025-11-15',
    time: '18:00',
    endTime: '22:00',
    location: 'Temple Main Hall',
    description: 'Join us for a spectacular Diwali celebration with traditional rituals, prayers, and community gathering. Light lamps, celebrate with family, and enjoy the festive atmosphere.',
    category: 'Festival'
  },
  {
    id: 2,
    title: 'Lord Shiva Puja',
    date: '2025-12-01',
    time: '06:00',
    endTime: '08:00',
    location: 'Inner Sanctum',
    description: 'Special prayer ceremony dedicated to Lord Shiva. Participate in the holy rituals and receive blessings from the priests.',
    category: 'Religious'
  },
  {
    id: 3,
    title: 'Bhajan Singing Session',
    date: '2025-12-10',
    time: '19:00',
    endTime: '21:00',
    location: 'Temple Auditorium',
    description: 'Experience the divine music of bhajans. Community singing session with traditional and modern devotional songs.',
    category: 'Cultural'
  },
  {
    id: 4,
    title: 'Temple Foundation Day',
    date: '2025-12-20',
    time: '10:00',
    endTime: '17:00',
    location: 'Temple Grounds',
    description: 'Celebrate our temple\'s foundation day with special ceremonies, cultural programs, and community feast.',
    category: 'Celebration'
  },
  {
    id: 5,
    title: 'Yoga and Meditation',
    date: '2025-12-25',
    time: '07:00',
    endTime: '09:00',
    location: 'Meditation Hall',
    description: 'Join our wellness program featuring yoga and meditation sessions to rejuvenate your body and mind.',
    category: 'Community'
  },
  {
    id: 6,
    title: 'New Year Blessings',
    date: '2026-01-01',
    time: '00:00',
    endTime: '05:00',
    location: 'Temple Main Hall',
    description: 'Welcome the new year with special prayers and blessings. Seek divine grace for prosperity and good health.',
    category: 'Festival'
  }
];


export default function EventsUser() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const t = translations[language] || translations.en;

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registeredEvents, setRegisteredEvents] = useState(new Set());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await eventsAPI.getAll();
      setEvents(Array.isArray(data) ? data : data?.data || []);
      setError(null);
    } catch (err) {
      // Use mock data if backend is not available
      console.warn('Backend not available, using mock data:', err.message);
      setEvents(MOCK_EVENTS);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

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

  const handleRegister = async (event) => {
    try {
      // Toggle registration status (mock)
      setRegisteredEvents(prev => {
        const newSet = new Set(prev);
        if (newSet.has(event.id)) {
          newSet.delete(event.id);
        } else {
          newSet.add(event.id);
        }
        return newSet;
      });
      alert(t.registerSuccess);
    } catch (err) {
      alert(t.registerError);
    }
  };

  const handleViewDetails = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center', minHeight: '60vh' }}>
        <p style={{ fontSize: '18px', color: '#666' }}>{t.loading}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 20px', minHeight: '70vh', backgroundColor: '#f9f9f9' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <h1 style={{
            fontSize: '2.5rem',
            color: '#0B1C3F',
            marginBottom: '10px',
            fontWeight: 'bold'
          }}>
            {t.upcomingEvents}
          </h1>
          <div style={{
            height: '4px',
            width: '60px',
            backgroundColor: '#E6B325',
            margin: '0 auto'
          }}></div>
        </div>

        {error && (
          <div style={{
            padding: '15px',
            backgroundColor: '#ffebee',
            color: '#c62828',
            borderRadius: '4px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {events.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            backgroundColor: 'white',
            borderRadius: '8px'
          }}>
            <p style={{ fontSize: '18px', color: '#999' }}>{t.noEvents}</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '25px'
          }}>
            {events.map(event => (
              <div
                key={event.id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                }}
              >
                {/* Event Header */}
                <div style={{
                  padding: '20px',
                  backgroundColor: 'linear-gradient(135deg, #0B1C3F 0%, #112A57 100%)',
                  color: 'white'
                }}>
                  <h3 style={{ margin: '0 0 10px 0', fontSize: '1.3rem' }}>
                    {event.title || event.eventName}
                  </h3>
                  <div style={{ fontSize: '12px', opacity: 0.9 }}>
                    {event.category || 'Event'}
                  </div>
                </div>

                {/* Event Details */}
                <div style={{ padding: '20px' }}>
                  {/* Date */}
                  <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
                    <span style={{ color: '#E6B325', marginRight: '10px', fontSize: '14px' }}>📅</span>
                    <div>
                      <div style={{ fontSize: '12px', color: '#999' }}>{t.date}</div>
                      <div style={{ fontSize: '14px', color: '#333', fontWeight: '500' }}>
                        {formatDate(event.date || event.eventDate)}
                      </div>
                    </div>
                  </div>

                  {/* Time */}
                  <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
                    <span style={{ color: '#E6B325', marginRight: '10px', fontSize: '14px' }}>🕐</span>
                    <div>
                      <div style={{ fontSize: '12px', color: '#999' }}>{t.time}</div>
                      <div style={{ fontSize: '14px', color: '#333', fontWeight: '500' }}>
                        {formatTime(event.time || event.startTime)}
                        {event.endTime && ` - ${formatTime(event.endTime)}`}
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
                    <span style={{ color: '#E6B325', marginRight: '10px', fontSize: '14px' }}>📍</span>
                    <div>
                      <div style={{ fontSize: '12px', color: '#999' }}>{t.location}</div>
                      <div style={{ fontSize: '14px', color: '#333', fontWeight: '500' }}>
                        {event.location || 'Temple'}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '10px',
                    marginTop: '20px'
                  }}>
                    <button
                      onClick={() => handleViewDetails(event)}
                      style={{
                        padding: '10px',
                        backgroundColor: '#f5f5f5',
                        color: '#0B1C3F',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: '500',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={e => {
                        e.target.style.backgroundColor = '#e8e8e8';
                      }}
                      onMouseLeave={e => {
                        e.target.style.backgroundColor = '#f5f5f5';
                      }}
                    >
                      {t.viewDetails}
                    </button>
                    <button
                      onClick={() => handleRegister(event)}
                      style={{
                        padding: '10px',
                        backgroundColor: registeredEvents.has(event.id) ? '#E6B325' : '#0B1C3F',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: '500',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={e => {
                        e.target.style.opacity = '0.9';
                      }}
                      onMouseLeave={e => {
                        e.target.style.opacity = '1';
                      }}
                    >
                      {registeredEvents.has(event.id) ? t.registered : t.register}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Details Modal */}
        {showModal && selectedEvent && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '30px',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}>
              <h2 style={{ color: '#0B1C3F', marginBottom: '20px' }}>
                {selectedEvent.title || selectedEvent.eventName}
              </h2>

              <div style={{ marginBottom: '20px', lineHeight: '1.6', color: '#666' }}>
                <h4 style={{ color: '#0B1C3F', marginBottom: '10px' }}>{t.description}</h4>
                <p>{selectedEvent.description || 'No description available'}</p>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '15px',
                marginBottom: '20px',
                padding: '15px',
                backgroundColor: '#f9f9f9',
                borderRadius: '4px'
              }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#999' }}>{t.date}</div>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>
                    {formatDate(selectedEvent.date || selectedEvent.eventDate)}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#999' }}>{t.time}</div>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>
                    {formatTime(selectedEvent.time || selectedEvent.startTime)}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#999' }}>{t.location}</div>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>
                    {selectedEvent.location || 'Temple'}
                  </div>
                </div>
              </div>

              <div style={{
                display: 'flex',
                gap: '10px',
                marginTop: '25px'
              }}>
                <button
                  onClick={() => {
                    handleRegister(selectedEvent);
                    setShowModal(false);
                  }}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: registeredEvents.has(selectedEvent.id) ? '#E6B325' : '#0B1C3F',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={e => e.target.style.opacity = '0.9'}
                  onMouseLeave={e => e.target.style.opacity = '1'}
                >
                  {registeredEvents.has(selectedEvent.id) ? t.registered : t.register}
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: '#f5f5f5',
                    color: '#333',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={e => e.target.style.backgroundColor = '#e8e8e8'}
                  onMouseLeave={e => e.target.style.backgroundColor = '#f5f5f5'}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
