import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getAllServices } from '../services/servicesData';
import { useNavigate } from 'react-router-dom';

export default function Services() {
  const { t } = useLanguage();
  const [services, setServices] = useState([]);
  const [imageErrors, setImageErrors] = useState(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    // Load services from localStorage
    setServices(getAllServices());
  }, []);

  const handleImageError = (serviceId) => {
    setImageErrors(prev => new Set([...prev, serviceId]));
  };

  const isImageIcon = (icon) => {
    return icon && (icon.startsWith('data:') || icon.startsWith('http') || icon.startsWith('/images'));
  };

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
            🙏 {t('services_title') || 'Our Services'}
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
            {t('services_description') || 'Discover our spiritual services and offerings'}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: '60px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Featured: Daily Prayers Card */}
          <div 
            onClick={() => navigate('/daily-prayers')}
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 8px 24px rgba(230, 179, 37, 0.2)',
              marginBottom: '50px',
              cursor: 'pointer',
              border: '3px solid #E6B325',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(230, 179, 37, 0.3)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(230, 179, 37, 0.2)';
            }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{
                flex: '0 0 300px',
                background: 'linear-gradient(135deg, #E6B325 0%, #d4a017 100%)',
                padding: '50px 30px',
                textAlign: 'center',
                color: 'white'
              }}>
                <div style={{ fontSize: '6rem', marginBottom: '15px' }}>🙏</div>
                <h2 style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>Daily Prayers</h2>
              </div>
              <div style={{ flex: 1, padding: '40px', minWidth: '300px' }}>
                <div style={{
                  display: 'inline-block',
                  padding: '6px 16px',
                  backgroundColor: '#4caf50',
                  color: 'white',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontWeight: 'bold',
                  marginBottom: '15px'
                }}>
                  ⭐ FEATURED SERVICE
                </div>
                <h3 style={{ 
                  fontSize: '1.8rem', 
                  color: '#0B1C3F', 
                  margin: '0 0 15px 0',
                  fontWeight: '700'
                }}>
                  Morning and Evening Spiritual Guidance
                </h3>
                <p style={{ 
                  color: '#666', 
                  fontSize: '1.1rem', 
                  lineHeight: '1.7',
                  marginBottom: '20px'
                }}>
                  Join us for sacred daily poojas throughout the day. View complete schedule with timings 
                  for morning abhishekam, sahasranama archana, evening deeparadhana, and special weekly prayers.
                </p>
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.5rem' }}>🌅</span>
                    <span style={{ color: '#555' }}>Morning Prayers</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.5rem' }}>🌆</span>
                    <span style={{ color: '#555' }}>Evening Prayers</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.5rem' }}>📅</span>
                    <span style={{ color: '#555' }}>Weekly Specials</span>
                  </div>
                </div>
                <button
                  style={{
                    marginTop: '25px',
                    padding: '14px 32px',
                    backgroundColor: '#0B1C3F',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={e => e.target.style.opacity = '0.9'}
                  onMouseLeave={e => e.target.style.opacity = '1'}
                >
                  View Prayer Schedule →
                </button>
              </div>
            </div>
          </div>

          {/* Temporarily hidden: Pooja Books Card */}
          {/* <div 
            onClick={() => navigate('/pooja-books')}
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 8px 24px rgba(11, 28, 63, 0.2)',
              marginBottom: '50px',
              cursor: 'pointer',
              border: '3px solid #0B1C3F',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(11, 28, 63, 0.3)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(11, 28, 63, 0.2)';
            }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{
                flex: '0 0 300px',
                background: 'linear-gradient(135deg, #0B1C3F 0%, #1a3a6b 100%)',
                padding: '50px 30px',
                textAlign: 'center',
                color: 'white'
              }}>
                <div style={{ fontSize: '6rem', marginBottom: '15px' }}>📚</div>
                <h2 style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>Pooja Books</h2>
              </div>
              <div style={{ flex: 1, padding: '40px', minWidth: '300px' }}>
                <div style={{
                  display: 'inline-block',
                  padding: '6px 16px',
                  backgroundColor: '#9c27b0',
                  color: 'white',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontWeight: 'bold',
                  marginBottom: '15px'
                }}>
                  📖 VEDIC KNOWLEDGE
                </div>
                <h3 style={{ 
                  fontSize: '1.8rem', 
                  color: '#0B1C3F', 
                  margin: '0 0 15px 0',
                  fontWeight: '700'
                }}>
                  Learn Vedic Knowledge and Traditions
                </h3>
                <p style={{ 
                  color: '#666', 
                  fontSize: '1.1rem', 
                  lineHeight: '1.7',
                  marginBottom: '20px'
                }}>
                  Explore our comprehensive collection of sacred texts, puja guides, and spiritual literature. 
                  From beginner-friendly guides to advanced Vedic scriptures, discover the wisdom of ancient traditions.
                </p>
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.5rem' }}>🕉️</span>
                    <span style={{ color: '#555' }}>Sacred Texts</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.5rem' }}>📖</span>
                    <span style={{ color: '#555' }}>Puja Guides</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.5rem' }}>⬇️</span>
                    <span style={{ color: '#555' }}>Downloadable</span>
                  </div>
                </div>
                <button
                  style={{
                    marginTop: '25px',
                    padding: '14px 32px',
                    backgroundColor: '#E6B325',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={e => e.target.style.opacity = '0.9'}
                  onMouseLeave={e => e.target.style.opacity = '1'}
                >
                  Browse Pooja Books →
                </button>
              </div>
            </div>
          </div> */}

          {/* Other Services Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '30px'
          }}>
            {services.map(service => (
              <div
                key={service.id}
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
                {/* Service Image/Icon Header */}
                {isImageIcon(service.icon) && !imageErrors.has(service.id) ? (
                  <div style={{ 
                    width: '100%', 
                    height: '220px', 
                    overflow: 'hidden',
                    backgroundColor: '#f5e6d3'
                  }}>
                    <img 
                      src={service.icon} 
                      alt={service.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                      onError={() => handleImageError(service.id)}
                    />
                  </div>
                ) : (
                  <div style={{
                    padding: '40px 25px',
                    background: 'linear-gradient(135deg, #0B1C3F 0%, #1a3a6b 100%)',
                    color: 'white',
                    textAlign: 'center',
                    position: 'relative',
                    height: '220px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <div style={{
                      fontSize: '4rem',
                      marginBottom: '15px',
                      filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.2))'
                    }}>
                      {service.icon || '🙏'}
                    </div>
                    <h3 style={{ 
                      margin: '0', 
                      fontSize: '1.5rem',
                      fontWeight: '600',
                      lineHeight: '1.3'
                    }}>
                      {service.name}
                    </h3>
                  </div>
                )}

                {/* Service Details */}
                <div style={{ padding: '25px' }}>
                  {/* Service Name (shown if image is displayed) */}
                  {isImageIcon(service.icon) && !imageErrors.has(service.id) && (
                    <h3 style={{ 
                      margin: '0 0 15px 0', 
                      fontSize: '1.5rem',
                      fontWeight: '600',
                      lineHeight: '1.3',
                      color: '#0B1C3F'
                    }}>
                      {service.name}
                    </h3>
                  )}

                  {/* Price Badge */}
                  <div style={{
                    display: 'inline-block',
                    padding: '8px 16px',
                    background: 'linear-gradient(135deg, #E6B325 0%, #d4a017 100%)',
                    color: 'white',
                    borderRadius: '20px',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    marginBottom: '15px',
                    boxShadow: '0 2px 8px rgba(230, 179, 37, 0.3)'
                  }}>
                    💰 {service.price}
                  </div>

                  {/* Description */}
                  <p style={{
                    color: '#666',
                    fontSize: '15px',
                    lineHeight: '1.6',
                    marginBottom: '20px',
                    minHeight: '45px'
                  }}>
                    {service.description}
                  </p>

                  {/* Features List */}
                  {service.details && service.details.length > 0 && (
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
                        {service.details.map((feature, idx) => (
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
                            }}>✓</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Book Button */}
                  <button
                    style={{
                      width: '100%',
                      padding: '14px',
                      background: 'linear-gradient(135deg, #0B1C3F 0%, #1a3a6b 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '15px',
                      fontWeight: '600',
                      transition: 'all 0.3s ease',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}
                    onMouseEnter={e => {
                      e.target.style.opacity = '0.9';
                      e.target.style.transform = 'scale(1.02)';
                    }}
                    onMouseLeave={e => {
                      e.target.style.opacity = '1';
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    📅 Book Service
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
