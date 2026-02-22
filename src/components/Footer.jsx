import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-around', 
          flexWrap: 'wrap', 
          gap: '2rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ flex: '1', minWidth: '250px' }}>
            <h3 style={{ color: '#FFD700', marginBottom: '1rem', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <img src="/images/temple-images/shiva-linga-logo.png" alt="Temple Logo" style={{ height: '30px', width: '30px', objectFit: 'cover', borderRadius: '4px' }} />
              Raja Rajeshwara Devastanam
            </h3>
            <p style={{ color: '#FFE4B5', lineHeight: '1.8' }}>
              A sacred temple dedicated to Lord Shiva, serving the community with devotion and tradition.
            </p>
          </div>
          
          <div style={{ flex: '1', minWidth: '250px' }}>
            <h3 style={{ color: '#FFD700', marginBottom: '1rem', fontSize: '1.2rem' }}>📍 Visit Us</h3>
            <p style={{ color: '#FFE4B5', lineHeight: '1.8' }}>
              3GCG+R32, Hasanparthy<br />
              Telangana 506371, India<br />
              📞 {t('footer_phone')}: (555) 123-4567<br />
              📧 {t('footer_email')}: info@rajarajeshwara.com
            </p>
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=18.0720125,79.5251507&destination_place_id=ChIJZwkAwOfISDoRoaGUu0A08Eg"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                marginTop: '1rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#FFD700',
                color: '#8B4513',
                textDecoration: 'none',
                borderRadius: '4px',
                fontWeight: 'bold',
                fontSize: '0.9rem',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#FFC700';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#FFD700';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
              }}
            >
              🗺️ Get Directions
            </a>
          </div>
          
          <div style={{ flex: '1', minWidth: '250px' }}>
            <h3 style={{ color: '#FFD700', marginBottom: '1rem', fontSize: '1.2rem' }}>🕉️ Temple Hours</h3>
            <p style={{ color: '#FFE4B5', lineHeight: '1.8' }}>
              Morning: 6:00 AM - 12:00 PM<br />
              Evening: 4:00 PM - 9:00 PM<br />
              Special Poojas: By Appointment
            </p>
          </div>
        </div>
        
        <div style={{ 
          borderTop: '2px solid rgba(255, 215, 0, 0.3)', 
          paddingTop: '1.5rem',
          textAlign: 'center'
        }}>
          <p style={{ color: '#FFE4B5', marginBottom: '0.5rem' }}>
            &copy; 2025 Raja Rajeshwara Devastanam. {t('footer_rights')}.
          </p>
          <p style={{ color: '#FFD700', fontSize: '0.9rem' }}>
            🙏 Om Namah Shivaya 🙏
          </p>
        </div>
      </div>
    </footer>
  );
}
