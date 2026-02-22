import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function Navigation() {
  const { user, logout, requireAuth } = useAuth();
  const { language, changeLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [time, setTime] = useState(new Date());

  const isAdminPage = location.pathname.includes('/admin') || location.pathname.includes('/home/admin');

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getIndiaTime = () => {
    const istTime = new Date(time.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    
    const hours = String(istTime.getHours()).padStart(2, '0');
    const minutes = String(istTime.getMinutes()).padStart(2, '0');
    const seconds = String(istTime.getSeconds()).padStart(2, '0');
    
    const day = istTime.toLocaleDateString('en-US', { 
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: 'Asia/Kolkata'
    });

    return { time: `${hours}:${minutes}:${seconds}`, date: day };
  };

  const { time: currentTime, date: currentDate } = getIndiaTime();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav>
      <div className="nav-container">
        <Link to={isAdminPage ? "/home/admin" : "/home"} className="logo" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <img src="/images/temple-images/shiva-linga-logo.png" alt="Temple Logo" style={{ height: '35px', width: '35px', objectFit: 'contain', borderRadius: '4px' }} />
          <span style={{ fontSize: '1.1rem' }}>Raja Rajeshwara</span>
        </Link>
        <ul>
          <li><Link to={isAdminPage ? "/home/admin" : "/home"}>{t('nav_home')}</Link></li>
          <li><Link to={isAdminPage ? "/events/admin" : "/events"}>{t('nav_events')}</Link></li>
          <li><Link to={isAdminPage ? "/services/admin" : "/services"}>{t('nav_services')}</Link></li>
          {/* Temporarily hidden features */}
          {/* <li><Link to={isAdminPage ? "/pooja-books/admin" : "/pooja-books"}>📚 Pooja Books</Link></li> */}
          {/* <li><Link to={isAdminPage ? "/bajanas/admin" : "/bajanas"}>🎵 Bajanas</Link></li> */}
          <li><Link to={isAdminPage ? "/gallery/admin" : "/gallery"}>Gallery</Link></li>
          <li><Link to={isAdminPage ? "/staff/admin" : "/staff"}>Staff</Link></li>
          <li><Link to={isAdminPage ? "/timings/admin" : "/timings"}>{t('nav_timings')}</Link></li>
          <li><Link to={isAdminPage ? "/board-members/admin" : "/board-members"}>Board</Link></li>
          {user?.role === 'admin' && !isAdminPage && <li><Link to="/subscriptions/admin">📧 Newsletter</Link></li>}
        </ul>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Time Display */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'flex-end',
            color: '#FFD700',
            fontSize: '0.85rem',
            borderRight: '2px solid rgba(255, 215, 0, 0.3)',
            paddingRight: '1rem'
          }}>
            <span style={{ fontWeight: 'bold', letterSpacing: '0.5px' }}>{currentTime}</span>
            <span style={{ opacity: 0.9, fontSize: '0.75rem' }}>{currentDate}</span>
          </div>

          {/* Language Selector */}
          <select 
            value={language} 
            onChange={(e) => changeLanguage(e.target.value)}
            style={{
              background: 'rgba(255, 215, 0, 0.2)',
              color: '#FFD700',
              border: '1px solid #FFD700',
              padding: '0.5rem',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}
          >
            <option value="en" style={{ color: '#333', background: '#fff' }}>English</option>
            <option value="te" style={{ color: '#333', background: '#fff' }}>తెలుగు</option>
            <option value="hi" style={{ color: '#333', background: '#fff' }}>हिंदी</option>
          </select>

          {/* Only show user info and logout on admin pages */}
          {isAdminPage && user && (
            <>
              <span style={{ color: '#FFD700', fontSize: '0.9rem', fontWeight: '500' }}>
                👤 {user.name || user.email}
              </span>
              <button
                onClick={handleLogout}
                style={{
                  background: 'rgba(255, 215, 0, 0.2)',
                  color: '#FFD700',
                  border: '1px solid #FFD700',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#FFD700';
                  e.target.style.color = '#8B4513';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 215, 0, 0.2)';
                  e.target.style.color = '#FFD700';
                }}
              >
                {t('nav_logout')}
              </button>
            </>
          )}
          {/* Show login link only on admin pages when not authenticated */}
          {isAdminPage && requireAuth && !user && (
            <Link to="/login" style={{ color: '#FFD700', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.95rem' }}>
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
