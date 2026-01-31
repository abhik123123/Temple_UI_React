import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import SubscribeNewsletter from '../components/SubscribeNewsletter';

/**
 * UserHome.jsx - Read-only home page for regular users
 * Displays: Auto-rotating images, About Us, Services
 * No admin/edit buttons - pure content viewing
 */
export default function UserHome() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [aboutTab, setAboutTab] = useState('history');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Array of Shiva images
  const shivaImages = [
    '/images/shiva/shiva%20img1.webp',
    '/images/shiva/shiva%20img%202.jpg',
    '/images/shiva/shiva%20img3.jpg',
    '/images/shiva/shiva%20img4.jpg',
    '/images/shiva/shiva%20img5.webp',
    '/images/shiva/shiva%20img%206.jpg',
    '/images/shiva/shiva%20img%207.png'
  ];

  // Auto-rotate images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % shivaImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [shivaImages.length]);

  const aboutTabs = {
    history: 'Our temple has a rich history spanning centuries. We are dedicated to preserving traditions and serving the community with devotion and excellence.',
    community: 'We foster a vibrant community that celebrates cultural values, organizes spiritual programs, and supports the needs of our devotees.',
    synagogue: 'Our sacred synagogue is an architectural marvel, built with intricate designs and spiritual significance. It remains a place of peace and meditation.',
    awards: 'Over the decades, our temple has received numerous accolades for its contributions to society and spiritual guidance.'
  };

  return (
    <div className="page">
      {/* HERO SECTION */}
      <div className="hero" style={{
        backgroundImage: `url(${shivaImages[currentImageIndex]})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        position: 'relative',
        minHeight: '500px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingLeft: '3rem'
      }}>
        {/* Dark overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          zIndex: 1
        }} />
        
        {/* Hero content */}
        <div style={{ position: 'relative', zIndex: 2, color: 'white', maxWidth: '600px' }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 'bold', marginBottom: '1rem', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
            🏛️ Raja Rajeshwara Temple
          </h1>
          <p style={{ fontSize: '1.3rem', marginBottom: '2rem', fontStyle: 'italic', textShadow: '1px 1px 3px rgba(0,0,0,0.8)' }}>
            "ॐ नमः शिवाय"
          </p>
          <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem', textShadow: '1px 1px 3px rgba(0,0,0,0.8)' }}>
            Home of Peace • Temple of Devotion
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={() => navigate('/events')}
              style={{
                padding: '12px 30px',
                fontSize: '1rem',
                backgroundColor: '#E6B325',
                color: '#0B1C3F',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#d4a820';
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#E6B325';
                e.target.style.transform = 'scale(1)';
              }}
            >
              VIEW EVENTS
            </button>
            <button
              onClick={() => navigate('/donors')}
              style={{
                padding: '12px 30px',
                fontSize: '1rem',
                backgroundColor: '#E6B325',
                color: '#0B1C3F',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#d4a820';
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#E6B325';
                e.target.style.transform = 'scale(1)';
              }}
            >
              DONATE NOW
            </button>
          </div>
        </div>

        {/* Image rotation indicators - Golden dots */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '8px',
          zIndex: 3
        }}>
          {shivaImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: index === currentImageIndex ? '#E6B325' : 'rgba(230, 179, 37, 0.5)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              title={`Image ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* ABOUT US SECTION */}
      <section style={{ padding: '3rem 2rem', backgroundColor: '#f9f9f9' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '2rem', color: '#0B1C3F' }}>
          ✨ About Us
        </h2>
        
        {/* Tab buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          {['history', 'community', 'synagogue', 'awards'].map((tab) => (
            <button
              key={tab}
              onClick={() => setAboutTab(tab)}
              style={{
                padding: '10px 20px',
                border: aboutTab === tab ? '2px solid #E6B325' : '2px solid #ddd',
                backgroundColor: aboutTab === tab ? '#E6B325' : 'white',
                color: aboutTab === tab ? '#0B1C3F' : '#666',
                borderRadius: '25px',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.3s ease'
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '2rem',
          backgroundColor: 'white',
          borderRadius: '10px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          minHeight: '200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <p style={{
            fontSize: '1.1rem',
            lineHeight: '1.8',
            color: '#333',
            textAlign: 'center'
          }}>
            {aboutTabs[aboutTab]}
          </p>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section style={{ padding: '3rem 2rem' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '3rem', color: '#0B1C3F' }}>
          🙏 Our Services
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {[
            { icon: '🕉️', title: 'Daily Prayers', desc: 'Morning and evening spiritual guidance' },
            { icon: '🎉', title: 'Festivals', desc: 'Celebrate sacred occasions together' },
            { icon: '📚', title: 'Spiritual Classes', desc: 'Learn vedic knowledge and traditions' },
            { icon: '💒', title: 'Ceremonies', desc: 'Weddings, birth rituals, and blessings' },
            { icon: '🙏', title: 'Consultations', desc: 'Spiritual guidance from priests' },
            { icon: '💝', title: 'Community Service', desc: 'Feeding and helping the needy' }
          ].map((service, index) => (
            <div
              key={index}
              style={{
                padding: '2rem',
                backgroundColor: 'white',
                borderRadius: '10px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(230, 179, 37, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{service.icon}</div>
              <h3 style={{ color: '#E6B325', marginBottom: '0.5rem' }}>{service.title}</h3>
              <p style={{ color: '#666', fontSize: '0.95rem' }}>{service.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section style={{
        padding: '3rem 2rem',
        backgroundColor: 'linear-gradient(135deg, #0B1C3F 0%, #112A57 100%)',
        color: 'white',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Join Our Temple Community</h2>
        <p style={{ fontSize: '1.1rem', marginBottom: '2rem', opacity: '0.9' }}>
          Be part of our spiritual journey and contribute to our sacred mission
        </p>
        <button
          onClick={() => navigate('/donors')}
          style={{
            padding: '15px 40px',
            fontSize: '1.1rem',
            backgroundColor: '#E6B325',
            color: '#0B1C3F',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#d4a820';
            e.target.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#E6B325';
            e.target.style.transform = 'scale(1)';
          }}
        >
          DONATE TODAY
        </button>
      </section>

      {/* NEWSLETTER SUBSCRIPTION SECTION */}
      <section style={{ padding: '2rem', backgroundColor: '#f9f9f9' }}>
        <SubscribeNewsletter isDarkMode={false} />
      </section>
    </div>
  );
}
