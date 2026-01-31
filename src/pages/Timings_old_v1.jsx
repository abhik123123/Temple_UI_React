import { useLanguage } from '../context/LanguageContext';
import { useTempleTimings } from '../hooks/useAPI';
import TeluguCalendarWidget from '../components/TeluguCalendarWidget';

export default function Timings() {
  const { t } = useLanguage();
  const lang = localStorage.getItem('language') || 'en';
  const { timings: backendTimings, loading, error } = useTempleTimings();

  // Fallback mock data in case backend is unavailable
  const mockTimings = [
    { day: { en: 'Monday', te: 'సోమవారం', hi: 'सोमवार' }, openingTime: '05:00', closingTime: '22:00', specialNotes: { en: 'Aarti: 6:00 AM & 7:00 PM', te: 'ఆరతి: 6:00 AM & 7:00 PM', hi: 'आरती: 6:00 AM और 7:00 PM' } },
    { day: { en: 'Tuesday', te: 'మంగళవారం', hi: 'मंगलवार' }, openingTime: '05:00', closingTime: '22:00', specialNotes: { en: 'Aarti: 6:00 AM & 7:00 PM', te: 'ఆరతి: 6:00 AM & 7:00 PM', hi: 'आరતी: 6:00 AM और 7:00 PM' } },
    { day: { en: 'Wednesday', te: 'బుధవారం', hi: 'बुधवार' }, openingTime: '05:00', closingTime: '22:00', specialNotes: { en: 'Aarti: 6:00 AM & 7:00 PM', te: 'ఆరతి: 6:00 AM & 7:00 PM', hi: 'आरती: 6:00 AM और 7:00 PM' } },
    { day: { en: 'Thursday', te: 'గురువారం', hi: 'गुरुवार' }, openingTime: '05:00', closingTime: '22:00', specialNotes: { en: 'Aarti: 6:00 AM & 7:00 PM', te: 'ఆరతి: 6:00 AM & 7:00 PM', hi: 'आरती: 6:00 AM और 7:00 PM' } },
    { day: { en: 'Friday', te: 'శుక్రవారం', hi: 'शुक्रवार' }, openingTime: '05:00', closingTime: '23:00', specialNotes: { en: 'Extended Aarti: 6:00 AM, 7:00 PM & 9:00 PM', te: 'విస్తరించిన ఆరతి: 6:00 AM, 7:00 PM & 9:00 PM', hi: 'विस्तारित आरती: 6:00 AM, 7:00 PM और 9:00 PM' } },
    { day: { en: 'Saturday', te: 'శనివారం', hi: 'शनिवार' }, openingTime: '05:00', closingTime: '23:00', specialNotes: { en: 'Special Prayers: 6:00 AM, 7:00 PM & 9:00 PM', te: 'ప్రత్యేక ప్రార్థనలు: 6:00 AM, 7:00 PM & 9:00 PM', hi: 'विशेष प्रार्थना: 6:00 AM, 7:00 PM और 9:00 PM' } },
    { day: { en: 'Sunday', te: 'ఆదివారం', hi: 'रविवार' }, openingTime: '05:00', closingTime: '23:00', specialNotes: { en: 'Community Gathering: 10:00 AM - 12:00 PM', te: 'కమ్యూనిటీ సమావేశం: 10:00 AM - 12:00 PM', hi: 'सामुदायिक सभा: 10:00 AM - 12:00 PM' } }
  ];

  const displayTimings = loading ? mockTimings : (backendTimings?.length > 0 ? backendTimings : mockTimings);

  const formatTime = (timeString) => {
    if (!timeString) return '';
    // Handle both HH:mm:ss and HH:mm formats
    const parts = timeString.split(':');
    const hours = parseInt(parts[0]);
    const minutes = parts[1] || '00';
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHour = hours % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getDay = (timing) => {
    if (typeof timing.day === 'object') {
      return timing.day[lang] || timing.day['en'];
    }
    return timing.day;
  };

  const getSpecialNotes = (timing) => {
    if (typeof timing.specialNotes === 'object') {
      return timing.specialNotes[lang] || timing.specialNotes['en'];
    }
    return timing.specialNotes || '';
  };

  return (
    <div className="page">
      <div className="hero">
        <h1>⏰ {t('timings_title')}</h1>
        <p>{t('timings_daily')}</p>
      </div>

      <div className="container">
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#8b4513' }}>{t('timings_daily')}</h2>
        
        {loading && (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
            Loading temple timings...
          </div>
        )}

        {error && (
          <div style={{ background: '#ffe5e5', padding: '1rem', borderRadius: '4px', color: '#d32f2f', marginBottom: '2rem' }}>
            ⚠️ {error} - Showing default timings
          </div>
        )}
        
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>{t('timings_day')}</th>
                <th>Opening Time</th>
                <th>Closing Time</th>
                <th>Special Timings</th>
              </tr>
            </thead>
            <tbody>
              {displayTimings.map((timing, idx) => (
                <tr key={idx}>
                  <td><strong>{getDay(timing)}</strong></td>
                  <td>{formatTime(timing.openingTime)}</td>
                  <td>{formatTime(timing.closingTime)}</td>
                  <td>{getSpecialNotes(timing)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Telugu Calendar Widget */}
        <TeluguCalendarWidget />

        <div style={{ 
          background: '#f0f0f0', 
          padding: '2rem', 
          borderRadius: '8px', 
          marginTop: '3rem',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#8b4513', marginBottom: '1rem' }}>📍 Location & Contact</h3>
          <p><strong>Address:</strong> Near Old Market, Hasaparthy, Warangal</p>
          <p><strong>Phone:</strong> (555) 123-4567</p>
          <p><strong>Email:</strong> info@rajarajeshwara.com</p>
          <p><strong>Website:</strong> www.rajarajeshwara.com</p>
          <button className="btn" style={{ marginTop: '1rem' }}>Get Directions</button>
        </div>
      </div>
    </div>
  );
}
