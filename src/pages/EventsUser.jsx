import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { eventsAPI } from '../services/templeAPI';
import EventRegistrationModal from '../components/EventRegistrationModal';

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
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [eventToRegister, setEventToRegister] = useState(null);

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

  const handleRegister = (event) => {
    setEventToRegister(event);
    setShowRegistrationModal(true);
  };

  const handleRegistrationSuccess = () => {
    // Mark event as registered
    if (eventToRegister) {
      setRegisteredEvents(prev => {
        const newSet = new Set(prev);
        newSet.add(eventToRegister.id);
        return newSet;
      });
    }
    setShowRegistrationModal(false);
    setEventToRegister(null);
  };

  const handleCloseRegistrationModal = () => {
    setShowRegistrationModal(false);
    setEventToRegister(null);
  };

  const handleViewDetails = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center', minHeight: '60vh' }}>
        <div style={{
          display: 'inline-block',
          width: '50px',
          height: '50px',
          border: '5px solid #f3f3f3',
          borderTop: '5px solid #0B1C3F',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ fontSize: '18px', color: '#666', marginTop: '20px' }}>{t.loading}</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #0B1C3F 0%, #1a3a6b 50%, #0B1C3F 100%)',
        padding: '80px 20px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative background pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(230, 179, 37, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(230, 179, 37, 0.1) 0%, transparent 50%)',
          pointerEvents: 'none'
        }}></div>
        
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{
            fontSize: '3.5rem',
            color: 'white',
            marginBottom: '15px',
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            letterSpacing: '1px'
          }}>
            🎉 {t.upcomingEvents}
          </h1>
          <div style={{
            height: '4px',
            width: '100px',
            backgroundColor: '#E6B325',
            margin: '0 auto 20px',
            borderRadius: '2px'
          }}></div>
          <p style={{
            fontSize: '1.2rem',
            color: '#b0c4de',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Discover and join our upcoming spiritual and cultural celebrations
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: '60px 20px', minHeight: '60vh' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {error && (
            <div style={{
              padding: '15px 20px',
              backgroundColor: '#fee',
              color: '#c62828',
              borderRadius: '8px',
              marginBottom: '30px',
              textAlign: 'center',
              border: '1px solid #fcc'
            }}>
              ⚠️ {error}
            </div>
          )}

          {events.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.07)'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📅</div>
              <p style={{ fontSize: '1.3rem', color: '#999', marginBottom: '10px' }}>{t.noEvents}</p>
              <p style={{ fontSize: '1rem', color: '#bbb' }}>Check back soon for exciting upcoming events!</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '30px'
            }}>
              {events.map(event => (
                <div
                  key={event.id}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    border: '1px solid #e0e0e0'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.07)';
                  }}
                >
                  {/* Event Header with Gradient */}
                  <div style={{
                    padding: '25px',
                    background: 'linear-gradient(135deg, #0B1C3F 0%, #1a3a6b 100%)',
                    color: 'white',
                    position: 'relative'
                  }}>
                    {event.category && (
                      <span style={{
                        position: 'absolute',
                        top: '15px',
                        right: '15px',
                        padding: '5px 12px',
                        backgroundColor: '#E6B325',
                        color: '#0B1C3F',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        {event.category}
                      </span>
                    )}
                    <h3 style={{ 
                      margin: '0', 
                      fontSize: '1.4rem',
                      fontWeight: '600',
                      paddingRight: '80px',
                      lineHeight: '1.3'
                    }}>
                      {event.title || event.eventName}
                    </h3>
                  </div>

                  {/* Event Details */}
                  <div style={{ padding: '25px' }}>
                    {/* Date */}
                    <div style={{ 
                      marginBottom: '15px', 
                      display: 'flex', 
                      alignItems: 'center',
                      padding: '12px',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '8px'
                    }}>
                      <span style={{ 
                        fontSize: '24px', 
                        marginRight: '12px',
                        background: 'linear-gradient(135deg, #E6B325 0%, #d4a017 100%)',
                        padding: '8px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>📅</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '11px', color: '#999', textTransform: 'uppercase', fontWeight: '600' }}>
                          {t.date}
                        </div>
                        <div style={{ fontSize: '15px', color: '#333', fontWeight: '600', marginTop: '2px' }}>
                          {formatDate(event.date || event.eventDate)}
                        </div>
                      </div>
                    </div>

                    {/* Time */}
                    <div style={{ 
                      marginBottom: '15px', 
                      display: 'flex', 
                      alignItems: 'center',
                      padding: '12px',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '8px'
                    }}>
                      <span style={{ 
                        fontSize: '24px', 
                        marginRight: '12px',
                        background: 'linear-gradient(135deg, #E6B325 0%, #d4a017 100%)',
                        padding: '8px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>⏰</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '11px', color: '#999', textTransform: 'uppercase', fontWeight: '600' }}>
                          {t.time}
                        </div>
                        <div style={{ fontSize: '15px', color: '#333', fontWeight: '600', marginTop: '2px' }}>
                          {formatTime(event.time || event.startTime)}
                          {event.endTime && ` - ${formatTime(event.endTime)}`}
                        </div>
                      </div>
                    </div>

                    {/* Location */}
                    <div style={{ 
                      marginBottom: '20px', 
                      display: 'flex', 
                      alignItems: 'center',
                      padding: '12px',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '8px'
                    }}>
                      <span style={{ 
                        fontSize: '24px', 
                        marginRight: '12px',
                        background: 'linear-gradient(135deg, #E6B325 0%, #d4a017 100%)',
                        padding: '8px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>📍</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '11px', color: '#999', textTransform: 'uppercase', fontWeight: '600' }}>
                          {t.location}
                        </div>
                        <div style={{ fontSize: '15px', color: '#333', fontWeight: '600', marginTop: '2px' }}>
                          {event.location || 'Temple'}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '12px',
                      marginTop: '25px'
                    }}>
                      <button
                        onClick={() => handleViewDetails(event)}
                        style={{
                          padding: '12px',
                          backgroundColor: 'white',
                          color: '#0B1C3F',
                          border: '2px solid #0B1C3F',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '600',
                          transition: 'all 0.3s ease',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}
                        onMouseEnter={e => {
                          e.target.style.backgroundColor = '#0B1C3F';
                          e.target.style.color = 'white';
                        }}
                        onMouseLeave={e => {
                          e.target.style.backgroundColor = 'white';
                          e.target.style.color = '#0B1C3F';
                        }}
                      >
                        📋 Details
                      </button>
                      <button
                        onClick={() => handleRegister(event)}
                        disabled={registeredEvents.has(event.id)}
                        style={{
                          padding: '12px',
                          background: registeredEvents.has(event.id) 
                            ? 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)'
                            : 'linear-gradient(135deg, #E6B325 0%, #d4a017 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: registeredEvents.has(event.id) ? 'not-allowed' : 'pointer',
                          fontSize: '14px',
                          fontWeight: '600',
                          transition: 'all 0.3s ease',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          opacity: registeredEvents.has(event.id) ? 0.8 : 1
                        }}
                        onMouseEnter={e => {
                          if (!registeredEvents.has(event.id)) {
                            e.target.style.opacity = '0.9';
                            e.target.style.transform = 'scale(1.02)';
                          }
                        }}
                        onMouseLeave={e => {
                          if (!registeredEvents.has(event.id)) {
                            e.target.style.opacity = '1';
                            e.target.style.transform = 'scale(1)';
                          }
                        }}
                      >
                        {registeredEvents.has(event.id) ? '✅ Registered' : '🎫 Register'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Details Modal - Enhanced */}
          {showModal && selectedEvent && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.6)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000,
              padding: '20px',
              backdropFilter: 'blur(5px)'
            }} onClick={() => setShowModal(false)}>
              <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                maxWidth: '600px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
              }} onClick={e => e.stopPropagation()}>
                {/* Modal Header */}
                <div style={{
                  padding: '30px',
                  background: 'linear-gradient(135deg, #0B1C3F 0%, #1a3a6b 100%)',
                  color: 'white',
                  borderRadius: '16px 16px 0 0'
                }}>
                  <h2 style={{ margin: '0', fontSize: '1.8rem', fontWeight: '600' }}>
                    {selectedEvent.title || selectedEvent.eventName}
                  </h2>
                  {selectedEvent.category && (
                    <span style={{
                      display: 'inline-block',
                      marginTop: '10px',
                      padding: '6px 14px',
                      backgroundColor: '#E6B325',
                      color: '#0B1C3F',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      textTransform: 'uppercase'
                    }}>
                      {selectedEvent.category}
                    </span>
                  )}
                </div>

                {/* Modal Content */}
                <div style={{ padding: '30px' }}>
                  <div style={{ marginBottom: '25px' }}>
                    <h4 style={{ color: '#0B1C3F', marginBottom: '12px', fontSize: '1.1rem' }}>
                      📖 {t.description}
                    </h4>
                    <p style={{ lineHeight: '1.8', color: '#555', fontSize: '15px' }}>
                      {selectedEvent.description || 'No description available'}
                    </p>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '15px',
                    padding: '20px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '12px',
                    border: '1px solid #e0e0e0'
                  }}>
                    <div>
                      <div style={{ fontSize: '11px', color: '#999', textTransform: 'uppercase', fontWeight: '600', marginBottom: '5px' }}>
                        📅 {t.date}
                      </div>
                      <div style={{ fontSize: '15px', fontWeight: '600', color: '#333' }}>
                        {formatDate(selectedEvent.date || selectedEvent.eventDate)}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: '#999', textTransform: 'uppercase', fontWeight: '600', marginBottom: '5px' }}>
                        ⏰ {t.time}
                      </div>
                      <div style={{ fontSize: '15px', fontWeight: '600', color: '#333' }}>
                        {formatTime(selectedEvent.time || selectedEvent.startTime)}
                      </div>
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <div style={{ fontSize: '11px', color: '#999', textTransform: 'uppercase', fontWeight: '600', marginBottom: '5px' }}>
                        📍 {t.location}
                      </div>
                      <div style={{ fontSize: '15px', fontWeight: '600', color: '#333' }}>
                        {selectedEvent.location || 'Temple'}
                      </div>
                    </div>
                  </div>

                  {/* Modal Actions */}
                  <div style={{
                    display: 'flex',
                    gap: '12px',
                    marginTop: '30px'
                  }}>
                    <button
                      onClick={() => {
                        handleRegister(selectedEvent);
                        setShowModal(false);
                      }}
                      disabled={registeredEvents.has(selectedEvent.id)}
                      style={{
                        flex: 1,
                        padding: '14px',
                        background: registeredEvents.has(selectedEvent.id)
                          ? 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)'
                          : 'linear-gradient(135deg, #E6B325 0%, #d4a017 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: registeredEvents.has(selectedEvent.id) ? 'not-allowed' : 'pointer',
                        fontSize: '15px',
                        fontWeight: '600',
                        transition: 'all 0.3s ease',
                        textTransform: 'uppercase',
                        opacity: registeredEvents.has(selectedEvent.id) ? 0.8 : 1
                      }}
                      onMouseEnter={e => !registeredEvents.has(selectedEvent.id) && (e.target.style.opacity = '0.9')}
                      onMouseLeave={e => !registeredEvents.has(selectedEvent.id) && (e.target.style.opacity = '1')}
                    >
                      {registeredEvents.has(selectedEvent.id) ? '✅ Registered' : '🎫 Register Now'}
                    </button>
                    <button
                      onClick={() => setShowModal(false)}
                      style={{
                        flex: 1,
                        padding: '14px',
                        backgroundColor: 'white',
                        color: '#666',
                        border: '2px solid #ddd',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '15px',
                        fontWeight: '600',
                        transition: 'all 0.3s ease',
                        textTransform: 'uppercase'
                      }}
                      onMouseEnter={e => {
                        e.target.style.backgroundColor = '#f5f5f5';
                        e.target.style.borderColor = '#999';
                      }}
                      onMouseLeave={e => {
                        e.target.style.backgroundColor = 'white';
                        e.target.style.borderColor = '#ddd';
                      }}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Registration Modal */}
          {showRegistrationModal && eventToRegister && (
            <EventRegistrationModal
              event={eventToRegister}
              onClose={handleCloseRegistrationModal}
              onSuccess={handleRegistrationSuccess}
            />
          )}
        </div>
      </div>
    </div>
  );
}
