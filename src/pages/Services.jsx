import { useLanguage } from '../context/LanguageContext';
import { useAPI } from '../hooks/useAPI';
import { servicesAPI } from '../services/api';

export default function Services() {
  const { t } = useLanguage();
  const { data: backendServices, loading, error } = useAPI(servicesAPI.getAll);

  // Fallback mock data
  const mockServices = [
    {
      id: 1,
      name: 'Daily Pujas',
      price: 'Free',
      description: 'Participate in our daily morning and evening prayer services.',
      details: ['Morning Prayers at 5:00 AM', 'Evening Prayers at 7:00 PM', 'Guided meditation'],
      icon: '🙏'
    },
    {
      id: 2,
      name: 'Special Prayers',
      price: '₹500 - ₹2000',
      description: 'Customized prayer ceremonies for special occasions and personal intentions.',
      details: ['Family blessings', 'Health & wellness prayers', 'Success rituals'],
      icon: '✨'
    },
    {
      id: 3,
      name: 'Spiritual Counseling',
      price: '₹1000/session',
      description: 'One-on-one guidance from our experienced spiritual advisors.',
      details: ['Personal consultation', 'Life guidance', 'Spiritual development'],
      icon: '📖'
    },
    {
      id: 4,
      name: 'Wedding Ceremonies',
      price: '₹5000 - ₹15000',
      description: 'Complete wedding planning and sacred ceremony arrangements.',
      details: ['Venue decoration', 'Priest coordination', 'Ritual planning'],
      icon: '💒'
    },
    {
      id: 5,
      name: 'Yoga & Meditation',
      price: '₹2000/month',
      description: 'Regular classes for physical and mental wellness.',
      details: ['Morning yoga classes', 'Evening meditation', 'Breathing techniques'],
      icon: '🧘'
    },
    {
      id: 6,
      name: 'Temple Tours',
      price: '₹200/person',
      description: 'Guided tours explaining the temple history and architecture.',
      details: ['Heritage tour', 'Historical insights', 'Photography allowed'],
      icon: '🏛️'
    }
  ];

  const displayServices = loading
    ? []
    : backendServices?.length > 0
      ? backendServices
      : [];

  const getServiceDetails = (service) => {
    // Backend returns details as pipe-separated string: "Includes | Aarti | Blessing | Prasad"
    // Split by pipe and trim whitespace
    if (typeof service.details === 'string') {
      return service.details.split('|').map(item => item.trim()).filter(item => item);
    }
    // Fallback for array format (mock data)
    return service.details || service.features || [];
  };

  return (
    <div className="page">
      <div className="hero" style={{
        backgroundImage: 'url(/images/temple-images/saibaba.jpg)',
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
          <h1 style={{ color: 'white' }}>🙏 {t('services_title')}</h1>
          <p style={{ color: '#f0f0f0' }}>{t('services_description')}</p>
        </div>
      </div>

      <div className="container">
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#8b4513' }}>{t('services_title')}</h2>

        {loading && (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
            Loading services...
          </div>
        )}

        {error && (
          <div style={{ background: '#ffe5e5', padding: '1rem', borderRadius: '4px', color: '#d32f2f', marginBottom: '2rem' }}>
            ⚠️ {error} - Showing default services
          </div>
        )}

        <div className="cards-grid">
          {displayServices.map(service => (
            <div key={service.id} className="card">
              <div className="card-image" style={{ fontSize: '2.5rem', padding: '1rem', textAlign: 'center', background: 'linear-gradient(135deg, #d4a574 0%, #a0522d 100%)' }}>
                {service.icon || '🙏'}
              </div>
              <div className="card-content">
                <h3>{service.name}</h3>
                <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#8b4513', marginBottom: '0.5rem' }}>{service.price}</p>
                <p>{service.description}</p>
                <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>
                  {getServiceDetails(service).map((feature, idx) => (
                    <li key={idx} style={{ marginBottom: '0.5rem' }}>✓ {feature}</li>
                  ))}
                </ul>
                <button className="btn" style={{ width: '100%' }}>Book Service</button>
              </div>
            </div>
          ))}
        </div>

        {displayServices.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#999' }}>
            No services available at the moment.
          </div>
        )}
      </div>
    </div>
  );
}
