import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getAllBajanas } from '../services/bajanasData';

export default function Bajanas() {
  const { t } = useLanguage();
  const [bajanas, setBajanas] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    // Load only devotional bajanas from localStorage
    const allBajanas = getAllBajanas();
    const devotionalOnly = allBajanas.filter(bajana => bajana.category === 'devotional');
    setBajanas(devotionalOnly);
  }, []);

  const categories = ['all', 'shiva', 'krishna', 'devi', 'ganesha', 'vishnu', 'rama', 'hanuman'];
  
  const filteredBajanas = selectedCategory === 'all' 
    ? bajanas 
    : bajanas.filter(bajana => bajana.deity === selectedCategory);

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
            🎵 Bhajans
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
            maxWidth: '700px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Devotional Songs & Sacred Hymns for Spiritual Connection
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <div style={{ 
        padding: '30px 20px',
        backgroundColor: 'white',
        borderBottom: '1px solid #e0e0e0'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                style={{
                  padding: '10px 25px',
                  borderRadius: '25px',
                  border: selectedCategory === category ? '2px solid #E6B325' : '2px solid #ddd',
                  background: selectedCategory === category ? 'linear-gradient(135deg, #E6B325 0%, #d4a017 100%)' : 'white',
                  color: selectedCategory === category ? 'white' : '#666',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  textTransform: 'capitalize',
                  transition: 'all 0.3s ease',
                  boxShadow: selectedCategory === category ? '0 4px 12px rgba(230, 179, 37, 0.3)' : 'none'
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: '60px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {filteredBajanas.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#666' }}>
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🎵</div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>No Bhajans Found</h3>
              <p>Check back later for upcoming devotional sessions</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '30px'
            }}>
              {filteredBajanas.map(bajana => (
                <div
                  key={bajana.id}
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
                  {/* Header */}
                  <div style={{
                    padding: '40px 25px',
                    background: 'linear-gradient(135deg, #0B1C3F 0%, #1a3a6b 100%)',
                    color: 'white',
                    textAlign: 'center',
                    position: 'relative'
                  }}>
                    <div style={{
                      fontSize: '4rem',
                      marginBottom: '15px',
                      filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.2))'
                    }}>
                      {bajana.icon || '🎵'}
                    </div>
                    <h3 style={{ 
                      margin: '0', 
                      fontSize: '1.5rem',
                      fontWeight: '600',
                      lineHeight: '1.3',
                      marginBottom: '8px'
                    }}>
                      {bajana.title}
                    </h3>
                    {bajana.artist && (
                      <p style={{ 
                        margin: '0',
                        fontSize: '0.9rem',
                        opacity: 0.9,
                        fontStyle: 'italic'
                      }}>
                        by {bajana.artist}
                      </p>
                    )}
                  </div>

                  {/* Details */}
                  <div style={{ padding: '25px' }}>
                    {/* Category Badge */}
                    <div style={{
                      display: 'inline-block',
                      padding: '6px 14px',
                      background: 'linear-gradient(135deg, #E6B325 0%, #d4a017 100%)',
                      color: 'white',
                      borderRadius: '15px',
                      fontSize: '0.85rem',
                      fontWeight: 'bold',
                      marginBottom: '15px',
                      textTransform: 'capitalize',
                      boxShadow: '0 2px 8px rgba(230, 179, 37, 0.3)'
                    }}>
                      {bajana.deity || bajana.category}
                    </div>

                    {/* Schedule */}
                    {bajana.schedule && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '15px',
                        color: '#555',
                        fontSize: '14px'
                      }}>
                        <span>⏰</span>
                        <span>{bajana.schedule}</span>
                      </div>
                    )}

                    {/* Description */}
                    <p style={{
                      color: '#666',
                      fontSize: '15px',
                      lineHeight: '1.6',
                      marginBottom: '20px',
                      minHeight: '45px'
                    }}>
                      {bajana.description}
                    </p>

                    {/* Details List */}
                    {bajana.details && bajana.details.length > 0 && (
                      <div style={{
                        backgroundColor: '#f8f9fa',
                        padding: '15px',
                        borderRadius: '8px',
                        marginBottom: '20px'
                      }}>
                        <ul style={{ 
                          margin: 0, 
                          paddingLeft: '20px',
                          listStyle: 'none'
                        }}>
                          {bajana.details.map((detail, idx) => (
                            <li key={idx} style={{ 
                              marginBottom: '8px',
                              color: '#555',
                              fontSize: '14px',
                              position: 'relative',
                              paddingLeft: '8px'
                            }}>
                              <span style={{ 
                                color: '#E6B325', 
                                marginRight: '8px',
                                fontWeight: 'bold'
                              }}>♪</span>
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '10px' }}>
                      {bajana.hasAudio && (
                        <button
                          style={{
                            flex: 1,
                            padding: '12px',
                            background: 'linear-gradient(135deg, #0B1C3F 0%, #1a3a6b 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '600',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={e => e.target.style.opacity = '0.9'}
                          onMouseLeave={e => e.target.style.opacity = '1'}
                        >
                          🎧 Listen
                        </button>
                      )}
                      {bajana.hasLyrics && (
                        <button
                          style={{
                            flex: 1,
                            padding: '12px',
                            background: 'white',
                            color: '#0B1C3F',
                            border: '2px solid #0B1C3F',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '600',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={e => {
                            e.target.style.background = '#0B1C3F';
                            e.target.style.color = 'white';
                          }}
                          onMouseLeave={e => {
                            e.target.style.background = 'white';
                            e.target.style.color = '#0B1C3F';
                          }}
                        >
                          📝 Lyrics
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
