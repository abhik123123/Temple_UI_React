import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function Home() {
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
        transition: 'background-image 1s ease-in-out'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.4)'
        }}></div>
        
        <div style={{ 
          position: 'relative', 
          zIndex: 1, 
          paddingLeft: '4rem',
          maxWidth: '600px'
        }}>
          <h1 style={{ 
            color: 'white', 
            fontSize: '3.5rem',
            fontWeight: 'bold',
            lineHeight: '1.2',
            marginBottom: '1.5rem'
          }}>
            God invites to the Home<br/>Of Peace
          </h1>
          <p style={{ 
            color: '#e0e0e0', 
            fontSize: '1rem',
            lineHeight: '1.8',
            marginBottom: '2rem',
            fontFamily: 'Georgia, serif'
          }}>
            ఓం నమః శివాయ<br/>
            ఓం త్ర్యంబకం యజామహే సుగంధిం పుష్టివర్ధనం<br/>
            ఉర్వారుకమివ బంధనాన్ మృత్యోర్ముక్షీయ మామృతాత్ ॥
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              className="btn" 
              onClick={() => navigate('/events')}
              style={{
                background: '#f39c12',
                color: '#fff',
                padding: '0.8rem 2rem',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '0.95rem'
              }}
            >
              JOIN NOW
            </button>
            <button 
              className="btn"
              onClick={() => navigate('/donors')}
              style={{
                background: '#f39c12',
                color: '#fff',
                padding: '0.8rem 2rem',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '0.95rem'
              }}
            >
              DONATE NOW
            </button>
          </div>

          {/* Image Counter Indicator */}
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            marginTop: '2rem',
            justifyContent: 'center'
          }}>
            {shivaImages.map((_, index) => (
              <div
                key={index}
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: currentImageIndex === index ? '#E6B325' : 'rgba(230, 179, 37, 0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => setCurrentImageIndex(index)}
                title={`Image ${index + 1} of ${shivaImages.length}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ABOUT US SECTION */}
      <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }}>
          
          {/* LEFT SIDE - IMAGES */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{
              backgroundImage: 'url(/images/temple-images/saibaba.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              height: '250px',
              borderRadius: '8px',
              boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
              filter: 'brightness(1.05) contrast(1.15) saturate(1.1)',
              imageRendering: 'crisp-edges'
            }}></div>
            <div style={{
              backgroundImage: 'url(/images/temple-images/sitarama.webp)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              height: '250px',
              borderRadius: '8px',
              boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
              filter: 'brightness(1.05) contrast(1.15) saturate(1.1)',
              imageRendering: 'crisp-edges'
            }}></div>
          </div>

          {/* RIGHT SIDE - ABOUT CONTENT */}
          <div>
            <h2 style={{
              fontSize: '2rem',
              color: '#333',
              marginBottom: '1.5rem',
              fontWeight: 'bold'
            }}>
              About Us
            </h2>

            {/* TABS */}
            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              marginBottom: '2rem',
              borderBottom: '2px solid #e0e0e0',
              paddingBottom: '1rem'
            }}>
              {Object.keys(aboutTabs).map(tab => (
                <button
                  key={tab}
                  onClick={() => setAboutTab(tab)}
                  style={{
                    padding: '0.5rem 1rem',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    fontWeight: aboutTab === tab ? 'bold' : 'normal',
                    color: aboutTab === tab ? '#8b4513' : '#666',
                    borderBottom: aboutTab === tab ? '3px solid #8b4513' : 'none',
                    marginBottom: '-1rem',
                    paddingBottom: '1.5rem',
                    textTransform: 'capitalize'
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* TAB CONTENT */}
            <p style={{
              fontSize: '0.95rem',
              lineHeight: '1.8',
              color: '#555',
              textAlign: 'justify'
            }}>
              {aboutTabs[aboutTab]}
            </p>
          </div>
        </div>
      </div>

      {/* QUICK LINKS SECTION */}
      <div style={{
        background: '#f5f5f5',
        padding: '3rem 0',
        marginTop: '2rem'
      }}>
        <div className="container">
          <h2 style={{ 
            textAlign: 'center', 
            marginBottom: '3rem', 
            color: '#333',
            fontSize: '2rem'
          }}>
            Our Services
          </h2>
          <div className="cards-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
            <div className="card" onClick={() => navigate('/events')} style={{ cursor: 'pointer' }}>
              <div style={{ fontSize: '2.5rem', padding: '1rem', textAlign: 'center' }}>📅</div>
              <div className="card-content">
                <h3>{t('card_events')}</h3>
                <p>Check our upcoming temple events and festivals</p>
                <button className="btn">View Events →</button>
              </div>
            </div>

            <div className="card" onClick={() => navigate('/services')} style={{ cursor: 'pointer' }}>
              <div style={{ fontSize: '2.5rem', padding: '1rem', textAlign: 'center' }}>🙏</div>
              <div className="card-content">
                <h3>{t('card_services')}</h3>
                <p>Daily prayers and spiritual programs</p>
                <button className="btn">View Services →</button>
              </div>
            </div>

            <div className="card" onClick={() => navigate('/timings')} style={{ cursor: 'pointer' }}>
              <div style={{ fontSize: '2.5rem', padding: '1rem', textAlign: 'center' }}>⏰</div>
              <div className="card-content">
                <h3>{t('card_timings')}</h3>
                <p>Temple opening and closing times</p>
                <button className="btn">View Timings →</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}