import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function AdminHome() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const shivaImages = [
    '/images/shiva/shiva%20img1.webp',
    '/images/shiva/shiva%20img%202.jpg',
    '/images/shiva/shiva%20img3.jpg',
    '/images/shiva/shiva%20img4.jpg',
    '/images/shiva/shiva%20img5.webp',
    '/images/shiva/shiva%20img%206.jpg',
    '/images/shiva/shiva%20img%207.png'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % shivaImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [shivaImages.length]);

  const handleLogout = () => {
    logout();
    navigate('/login');
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
        justifyContent: 'space-between',
        paddingRight: '4rem',
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
            Admin Portal
          </h1>
          <p style={{ 
            color: '#e0e0e0', 
            fontSize: '1rem',
            lineHeight: '1.8',
            marginBottom: '2rem'
          }}>
            Manage temple operations and content
          </p>
        </div>

        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          style={{
            position: 'relative',
            zIndex: 2,
            background: '#e74c3c',
            color: 'white',
            padding: '0.8rem 1.5rem',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '0.95rem'
          }}
          onMouseOver={(e) => e.target.style.background = '#c0392b'}
          onMouseOut={(e) => e.target.style.background = '#e74c3c'}
        >
          Logout ({user?.username})
        </button>
      </div>

      {/* ADMIN NAVIGATION CARDS */}
      <div style={{
        maxWidth: '1200px',
        margin: '3rem auto',
        padding: '0 1rem'
      }}>
        <h2 style={{
          textAlign: 'center',
          color: '#2c3e50',
          marginBottom: '2rem',
          fontSize: '2rem'
        }}>
          Admin Management
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          {/* Events Admin */}
          <div style={{
            background: 'white',
            border: '1px solid #ecf0f1',
            borderRadius: '8px',
            padding: '2rem',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            cursor: 'pointer',
            transition: 'transform 0.3s, boxShadow 0.3s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
          }}
          onClick={() => navigate('/events/admin')}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</div>
            <h3 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>Events</h3>
            <p style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>Manage temple events and schedules</p>
          </div>

          {/* Services Admin */}
          <div style={{
            background: 'white',
            border: '1px solid #ecf0f1',
            borderRadius: '8px',
            padding: '2rem',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            cursor: 'pointer',
            transition: 'transform 0.3s, boxShadow 0.3s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
          }}
          onClick={() => navigate('/services/admin')}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🙏</div>
            <h3 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>Services</h3>
            <p style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>Manage temple services and offerings</p>
          </div>

          {/* Staff Admin */}
          <div style={{
            background: 'white',
            border: '1px solid #ecf0f1',
            borderRadius: '8px',
            padding: '2rem',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            cursor: 'pointer',
            transition: 'transform 0.3s, boxShadow 0.3s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
          }}
          onClick={() => navigate('/staff/admin')}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👥</div>
            <h3 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>Staff</h3>
            <p style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>Manage staff members and roles</p>
          </div>

          {/* Timings Admin */}
          <div style={{
            background: 'white',
            border: '1px solid #ecf0f1',
            borderRadius: '8px',
            padding: '2rem',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            cursor: 'pointer',
            transition: 'transform 0.3s, boxShadow 0.3s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
          }}
          onClick={() => navigate('/timings/admin')}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏰</div>
            <h3 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>Timings</h3>
            <p style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>Manage temple opening hours</p>
          </div>

          {/* Board Members Admin */}
          <div style={{
            background: 'white',
            border: '1px solid #ecf0f1',
            borderRadius: '8px',
            padding: '2rem',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            cursor: 'pointer',
            transition: 'transform 0.3s, boxShadow 0.3s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
          }}
          onClick={() => navigate('/board-members/admin')}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎖️</div>
            <h3 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>Board Members</h3>
            <p style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>Manage board members</p>
          </div>

          {/* Dashboard Admin */}
          <div style={{
            background: 'white',
            border: '1px solid #ecf0f1',
            borderRadius: '8px',
            padding: '2rem',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            cursor: 'pointer',
            transition: 'transform 0.3s, boxShadow 0.3s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
          }}
          onClick={() => navigate('/admin/dashboard')}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
            <h3 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>Dashboard</h3>
            <p style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>View comprehensive admin statistics</p>
          </div>
        </div>
      </div>
    </div>
  );
}
