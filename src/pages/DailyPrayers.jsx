import { useState, useEffect } from 'react';
import { getAllDailyPoojas, getTodaysPoojas, getPoojasByDay, DAYS_OF_WEEK } from '../services/dailyPoojasData';
import { usePageTracking } from '../hooks/usePageTracking';

export default function DailyPrayers() {
  // Track page view
  usePageTracking('Daily Prayers');
  
  const [poojas, setPoojas] = useState([]);
  const [selectedDay, setSelectedDay] = useState('Today');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Update current time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

    useEffect(() => {
    loadPoojas();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDay]);

  const loadPoojas = () => {
    if (selectedDay === 'Today') {
      setPoojas(getTodaysPoojas());
    } else if (selectedDay === 'All') {
      setPoojas(getAllDailyPoojas());
    } else {
      setPoojas(getPoojasByDay(selectedDay));
    }
  };

  // Sort poojas by time
  const sortedPoojas = [...poojas].sort((a, b) => {
    const timeA = a.time || '00:00';
    const timeB = b.time || '00:00';
    return timeA.localeCompare(timeB);
  });

  // Check if pooja is currently happening
  const isPoojaActive = (pooja) => {
    if (!pooja.time) return false;
    const [hours, minutes] = pooja.time.split(':').map(Number);
    const poojaStart = new Date(currentTime);
    poojaStart.setHours(hours, minutes, 0, 0);
    
    // Parse duration (e.g., "30 minutes" -> 30)
    const durationMatch = pooja.duration?.match(/(\d+)/);
    const durationMinutes = durationMatch ? parseInt(durationMatch[1]) : 30;
    const poojaEnd = new Date(poojaStart.getTime() + durationMinutes * 60000);
    
    return currentTime >= poojaStart && currentTime <= poojaEnd;
  };

  // Check if pooja is upcoming soon (within next 30 minutes)
  const isPoojaUpcoming = (pooja) => {
    if (!pooja.time) return false;
    const [hours, minutes] = pooja.time.split(':').map(Number);
    const poojaStart = new Date(currentTime);
    poojaStart.setHours(hours, minutes, 0, 0);
    
    const timeDiff = poojaStart - currentTime;
    return timeDiff > 0 && timeDiff <= 30 * 60000; // Next 30 minutes
  };

  const todayName = DAYS_OF_WEEK[new Date().getDay()];

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
            🙏 Daily Prayers Schedule
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
            Morning and evening spiritual guidance - Join us for sacred rituals
          </p>
        </div>
      </div>

      {/* Day Filter Tabs */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ 
            display: 'flex', 
            gap: '10px', 
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <button
              onClick={() => setSelectedDay('Today')}
              style={{
                padding: '12px 24px',
                backgroundColor: selectedDay === 'Today' ? '#0B1C3F' : '#f5f5f5',
                color: selectedDay === 'Today' ? 'white' : '#333',
                border: selectedDay === 'Today' ? 'none' : '1px solid #ddd',
                borderRadius: '25px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: selectedDay === 'Today' ? '600' : '500',
                transition: 'all 0.3s ease',
                boxShadow: selectedDay === 'Today' ? '0 2px 8px rgba(11, 28, 63, 0.3)' : 'none'
              }}
            >
              ⭐ Today ({todayName})
            </button>
            <button
              onClick={() => setSelectedDay('All')}
              style={{
                padding: '12px 24px',
                backgroundColor: selectedDay === 'All' ? '#0B1C3F' : '#f5f5f5',
                color: selectedDay === 'All' ? 'white' : '#333',
                border: selectedDay === 'All' ? 'none' : '1px solid #ddd',
                borderRadius: '25px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: selectedDay === 'All' ? '600' : '500',
                transition: 'all 0.3s ease',
                boxShadow: selectedDay === 'All' ? '0 2px 8px rgba(11, 28, 63, 0.3)' : 'none'
              }}
            >
              📅 All Prayers
            </button>
            {DAYS_OF_WEEK.map(day => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                style={{
                  padding: '12px 20px',
                  backgroundColor: selectedDay === day ? '#E6B325' : '#f5f5f5',
                  color: selectedDay === day ? 'white' : '#333',
                  border: selectedDay === day ? 'none' : '1px solid #ddd',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: selectedDay === day ? '600' : '500',
                  transition: 'all 0.3s ease',
                  boxShadow: selectedDay === day ? '0 2px 8px rgba(230, 179, 37, 0.3)' : 'none'
                }}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: '60px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {sortedPoojas.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🙏</div>
              <h3 style={{ color: '#666', fontSize: '1.2rem', marginBottom: '10px' }}>
                No prayers scheduled
              </h3>
              <p style={{ color: '#999' }}>
                {selectedDay === 'Today' ? 'No prayers today' : `No prayers on ${selectedDay}`}
              </p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gap: '25px'
            }}>
              {sortedPoojas.map(pooja => {
                const isActive = isPoojaActive(pooja);
                const isUpcoming = isPoojaUpcoming(pooja);
                
                return (
                  <div
                    key={pooja.id}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      boxShadow: isActive 
                        ? '0 8px 24px rgba(230, 179, 37, 0.3)' 
                        : '0 4px 6px rgba(0,0,0,0.1)',
                      transition: 'all 0.3s ease',
                      border: isActive ? '3px solid #E6B325' : 'none',
                      position: 'relative'
                    }}
                  >
                    {/* Status Badge */}
                    {isActive && (
                      <div style={{
                        position: 'absolute',
                        top: '15px',
                        right: '15px',
                        backgroundColor: '#4caf50',
                        color: 'white',
                        padding: '6px 15px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        zIndex: 10,
                        animation: 'pulse 2s infinite'
                      }}>
                        <span style={{
                          width: '8px',
                          height: '8px',
                          backgroundColor: 'white',
                          borderRadius: '50%',
                          display: 'inline-block'
                        }}></span>
                        LIVE NOW
                      </div>
                    )}
                    {isUpcoming && !isActive && (
                      <div style={{
                        position: 'absolute',
                        top: '15px',
                        right: '15px',
                        backgroundColor: '#ff9800',
                        color: 'white',
                        padding: '6px 15px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        zIndex: 10
                      }}>
                        ⏰ UPCOMING
                      </div>
                    )}

                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                      {/* Left Side - Time & Icon */}
                      <div style={{
                        width: '250px',
                        minWidth: '250px',
                        background: isActive 
                          ? 'linear-gradient(135deg, #E6B325 0%, #d4a017 100%)'
                          : 'linear-gradient(135deg, #0B1C3F 0%, #1a3a6b 100%)',
                        color: 'white',
                        padding: '40px 30px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center'
                      }}>
                        <div style={{ 
                          fontSize: '5rem', 
                          marginBottom: '15px',
                          filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.2))'
                        }}>
                          {pooja.icon || '🙏'}
                        </div>
                        <div style={{
                          fontSize: '2.5rem',
                          fontWeight: 'bold',
                          marginBottom: '8px',
                          fontFamily: 'monospace'
                        }}>
                          {pooja.time || 'TBD'}
                        </div>
                        <div style={{
                          fontSize: '0.9rem',
                          opacity: 0.9,
                          marginBottom: '15px'
                        }}>
                          ⏱️ {pooja.duration || '30 minutes'}
                        </div>
                        <div style={{
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          padding: '6px 15px',
                          borderRadius: '20px',
                          fontSize: '0.85rem',
                          fontWeight: '600'
                        }}>
                          {pooja.day}
                        </div>
                      </div>

                      {/* Right Side - Details */}
                      <div style={{ flex: 1, padding: '40px 35px', minWidth: '300px' }}>
                        <h2 style={{
                          fontSize: '1.8rem',
                          color: '#0B1C3F',
                          marginBottom: '12px',
                          marginTop: 0,
                          fontWeight: '700'
                        }}>
                          {pooja.name}
                        </h2>

                        {/* Deity */}
                        <div style={{
                          display: 'inline-block',
                          backgroundColor: '#fff3e0',
                          color: '#e65100',
                          padding: '6px 14px',
                          borderRadius: '20px',
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          marginBottom: '15px'
                        }}>
                          🕉️ {pooja.deity || 'Main Deity'}
                        </div>

                        {/* Description */}
                        <p style={{
                          color: '#555',
                          fontSize: '1rem',
                          lineHeight: '1.7',
                          marginBottom: '25px'
                        }}>
                          {pooja.description}
                        </p>

                        {/* Details List */}
                        {pooja.details && pooja.details.length > 0 && (
                          <div style={{
                            backgroundColor: '#f8f9fa',
                            padding: '20px',
                            borderRadius: '10px',
                            marginBottom: '20px'
                          }}>
                            <h4 style={{
                              margin: '0 0 15px 0',
                              color: '#0B1C3F',
                              fontSize: '1rem',
                              fontWeight: '600'
                            }}>
                              ✨ Ritual Highlights:
                            </h4>
                            <ul style={{
                              margin: 0,
                              paddingLeft: '0',
                              listStyle: 'none',
                              display: 'grid',
                              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                              gap: '10px'
                            }}>
                              {pooja.details.map((detail, idx) => (
                                <li key={idx} style={{
                                  color: '#555',
                                  fontSize: '0.9rem',
                                  display: 'flex',
                                  alignItems: 'flex-start',
                                  gap: '8px'
                                }}>
                                  <span style={{ 
                                    color: '#E6B325',
                                    fontSize: '1.1rem',
                                    marginTop: '2px'
                                  }}>
                                    •
                                  </span>
                                  <span>{detail}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Action Button */}
                        <button
                          style={{
                            padding: '14px 30px',
                            backgroundColor: isActive ? '#4caf50' : '#0B1C3F',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '15px',
                            fontWeight: '600',
                            transition: 'all 0.3s ease',
                            width: '100%',
                            maxWidth: '300px'
                          }}
                          onMouseEnter={e => e.target.style.opacity = '0.9'}
                          onMouseLeave={e => e.target.style.opacity = '1'}
                        >
                          {isActive ? '🔴 Join Now - Live' : '📅 Set Reminder'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Add pulsing animation for live badge */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}
