import { useLanguage } from '../context/LanguageContext';

export default function Timings() {
  const { t } = useLanguage();
  const lang = localStorage.getItem('language') || 'en';

  const timings = [
    { day: { en: 'Monday', te: 'సోమవారం', hi: 'सोमवार' }, opening: '5:00 AM', closing: '10:00 PM', specialTime: { en: 'Aarti: 6:00 AM & 7:00 PM', te: 'ఆరతి: 6:00 AM & 7:00 PM', hi: 'आरती: 6:00 AM और 7:00 PM' } },
    { day: { en: 'Tuesday', te: 'మంగళవారం', hi: 'मंगलवार' }, opening: '5:00 AM', closing: '10:00 PM', specialTime: { en: 'Aarti: 6:00 AM & 7:00 PM', te: 'ఆరతి: 6:00 AM & 7:00 PM', hi: 'आरती: 6:00 AM और 7:00 PM' } },
    { day: { en: 'Wednesday', te: 'బుధవారం', hi: 'बुधवार' }, opening: '5:00 AM', closing: '10:00 PM', specialTime: { en: 'Aarti: 6:00 AM & 7:00 PM', te: 'ఆరతి: 6:00 AM & 7:00 PM', hi: 'आरती: 6:00 AM और 7:00 PM' } },
    { day: { en: 'Thursday', te: 'గురువారం', hi: 'गुरुवार' }, opening: '5:00 AM', closing: '10:00 PM', specialTime: { en: 'Aarti: 6:00 AM & 7:00 PM', te: 'ఆరతి: 6:00 AM & 7:00 PM', hi: 'आरती: 6:00 AM और 7:00 PM' } },
    { day: { en: 'Friday', te: 'శుక్రవారం', hi: 'शुक्रवार' }, opening: '5:00 AM', closing: '11:00 PM', specialTime: { en: 'Extended Aarti: 6:00 AM, 7:00 PM & 9:00 PM', te: 'విస్తరించిన ఆరతి: 6:00 AM, 7:00 PM & 9:00 PM', hi: 'विस्तारित आरती: 6:00 AM, 7:00 PM और 9:00 PM' } },
    { day: { en: 'Saturday', te: 'శనివారం', hi: 'शनिवार' }, opening: '5:00 AM', closing: '11:00 PM', specialTime: { en: 'Special Prayers: 6:00 AM, 7:00 PM & 9:00 PM', te: 'ప్రత్యేక ప్రార్థనలు: 6:00 AM, 7:00 PM & 9:00 PM', hi: 'विशेष प्रार्थना: 6:00 AM, 7:00 PM और 9:00 PM' } },
    { day: { en: 'Sunday', te: 'ఆదివారం', hi: 'रविवार' }, opening: '5:00 AM', closing: '11:00 PM', specialTime: { en: 'Community Gathering: 10:00 AM - 12:00 PM', te: 'కమ్యూనిటీ సమావేశం: 10:00 AM - 12:00 PM', hi: 'सामुदायिक सभा: 10:00 AM - 12:00 PM' } }
  ];

  const specialDays = [
    { occasion: { en: 'New Year Day', te: 'నూతన సంవత్సర దినం', hi: 'नए साल का दिन' }, date: 'January 1', timing: '12:00 AM - 4:00 AM' },
    { occasion: { en: 'Diwali Festival', te: 'దీపావళి పండుగ', hi: 'दिवाली महोत्सव' }, date: 'November 1', timing: '6:00 AM - 10:00 PM' },
    { occasion: { en: 'Holi Festival', te: 'హోలీ ఉత్సవం', hi: 'होली का त्योहार' }, date: 'March 15', timing: '10:00 AM - 6:00 PM' },
    { occasion: { en: 'Temple Founding Day', te: 'దేవాలయ స్థాపన దిනం', hi: 'मंदिर की स्थापना दिवस' }, date: 'June 15', timing: '5:00 AM - 10:00 PM' },
    { occasion: { en: 'Harvest Festival', te: 'పంట కోతి ఉత్సవం', hi: 'फसल का त्योहार' }, date: 'October 20', timing: '8:00 AM - 8:00 PM' }
  ];

  const getDay = (timing) => timing.day[lang] || timing.day['en'];
  const getSpecialTime = (timing) => timing.specialTime[lang] || timing.specialTime['en'];
  const getOccasion = (special) => special.occasion[lang] || special.occasion['en'];

  return (
    <div className="page">
      <div className="hero">
        <h1>⏰ {t('timings_title')}</h1>
        <p>{t('timings_daily')}</p>
      </div>

      <div className="container">
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#8b4513' }}>{t('timings_daily')}</h2>
        
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
              {timings.map((timing, idx) => (
                <tr key={idx}>
                  <td><strong>{getDay(timing)}</strong></td>
                  <td>{timing.opening}</td>
                  <td>{timing.closing}</td>
                  <td>{getSpecialTime(timing)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 style={{ textAlign: 'center', margin: '3rem 0 2rem 0', color: '#8b4513' }}>{t('timings_special')}</h2>
        
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Occasion</th>
                <th>Date</th>
                <th>Special Timings</th>
              </tr>
            </thead>
            <tbody>
              {specialDays.map((special, idx) => (
                <tr key={idx}>
                  <td><strong>{getOccasion(special)}</strong></td>
                  <td>{special.date}</td>
                  <td>{special.timing}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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