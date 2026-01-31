import { useLanguage } from '../context/LanguageContext';
import { useAPI } from '../hooks/useAPI';
import { priestsAPI } from '../services/api';

export default function Priests() {
  const { t } = useLanguage();
  const { data: backendPriests, loading, error } = useAPI(priestsAPI.getAll);

  // Fallback mock data
  const mockPriests = [
    {
      id: 1,
      name: 'Swami Ananda',
      role: 'Head Priest',
      experience: '45 years',
      specialization: 'Vedic Rituals',
      bio: 'Highly respected spiritual leader with extensive knowledge of ancient traditions.',
      icon: '👨‍🙏'
    },
    {
      id: 2,
      name: 'Priest Ramesh Kumar',
      role: 'Senior Priest',
      experience: '30 years',
      specialization: 'Wedding Ceremonies',
      bio: 'Expert in conducting marriage ceremonies and family blessing rituals.',
      icon: '👨‍🙏'
    },
    {
      id: 3,
      name: 'Priest Vishnu Sharma',
      role: 'Spiritual Guide',
      experience: '20 years',
      specialization: 'Meditation & Yoga',
      bio: 'Dedicated to teaching meditation and spiritual wellness practices.',
      icon: '👨‍🙏'
    },
    {
      id: 4,
      name: 'Priest Arjun Das',
      role: 'Ritual Specialist',
      experience: '25 years',
      specialization: 'Daily Pujas',
      bio: 'Performs daily prayers with utmost devotion and spiritual precision.',
      icon: '👨‍🙏'
    },
    {
      id: 5,
      name: 'Priest Suresh',
      role: 'Music Maestro',
      experience: '15 years',
      specialization: 'Sacred Music',
      bio: 'Leads devotional singing and manages temple music programs.',
      icon: '👨‍🙏'
    },
    {
      id: 6,
      name: 'Priest Mohan',
      role: 'Youth Coordinator',
      experience: '10 years',
      specialization: 'Youth Programs',
      bio: 'Organizes spiritual activities and education for young devotees.',
      icon: '👨‍🙏'
    }
  ];

  const displayPriests = loading ? mockPriests : (backendPriests?.length > 0 ? backendPriests : mockPriests);

  return (
    <div className="page">
      <div className="hero" style={{
        backgroundImage: 'url(/images/temple-images/temple-main.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)'
        }}></div>
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <h1 style={{ color: 'white' }}>👨‍🙏 {t('priests_title')}</h1>
          <p style={{ color: '#f0f0f0' }}>{t('priests_description')}</p>
        </div>
      </div>

      <div className="container">
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#8b4513' }}>{t('priests_title')}</h2>

        {loading && (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
            Loading priests...
          </div>
        )}

        {error && (
          <div style={{ background: '#ffe5e5', padding: '1rem', borderRadius: '4px', color: '#d32f2f', marginBottom: '2rem' }}>
            ⚠️ {error} - Showing default priests
          </div>
        )}

        <div className="cards-grid">
          {displayPriests.map(priest => (
            <div key={priest.id} className="card">
              <div className="card-image" style={{ fontSize: '3rem', padding: '1.5rem', textAlign: 'center', background: 'linear-gradient(135deg, #d4a574 0%, #a0522d 100%)' }}>
                {priest.icon || '👨‍🙏'}
              </div>
              <div className="card-content">
                <h3>{priest.name}</h3>
                <p><strong>Role:</strong> {priest.role}</p>
                <p><strong>Experience:</strong> {priest.experience}</p>
                <p><strong>Specialization:</strong> {priest.specialization}</p>
                <p style={{ margin: '1rem 0', color: '#555', fontStyle: 'italic' }}>
                  {priest.bio}
                </p>
                <button className="btn" style={{ width: '100%' }}>Contact</button>
              </div>
            </div>
          ))}
        </div>

        {displayPriests.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#999' }}>
            No priests available at the moment.
          </div>
        )}
      </div>
    </div>
  );
}
