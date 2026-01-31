import { useLanguage } from '../context/LanguageContext';

export default function Events() {
  const { t } = useLanguage();

  const events = [
    {
      id: 1,
      name_en: 'Diwali Festival',
      name_te: 'దీపావళి పండుగ',
      name_hi: 'दिवाली महोत्सव',
      date: 'November 1, 2025',
      time: '6:00 PM - 10:00 PM',
      description_en: 'Celebrate the festival of lights with special prayers and gatherings.',
      description_te: 'ప్రకాశ పండుగను ప్రత్యేక ప్రార్థనలు మరియు సమాచారాలతో జరుపుకోండి.',
      description_hi: 'विशेष प्रार्थनाओं और सभाओं के साथ दीपों का त्योहार मनाएं।',
      icon: '💡',
      image: '/images/special-events/diwali.jpg'
    },
    {
      id: 2,
      name_en: 'Monthly Prayer Meeting',
      name_te: 'నెలవారీ ప్రార్థన సమావేశం',
      name_hi: 'मासिक प्रार्थना बैठक',
      date: 'Every First Sunday',
      time: '9:00 AM - 11:00 AM',
      description_en: 'Community prayer session with spiritual discourse.',
      description_te: 'ఆధ్యాత్మిక ఉపన్యాసంతో కమ్యూనిటీ ప్రార్థన సెషన్.',
      description_hi: 'आध्यात्मिक प्रवचन के साथ सामुदायिक प्रार्थना सत्र।',
      icon: '🙏',
      image: '/images/daily-prayers/prayer.jpg'
    },
    {
      id: 3,
      name_en: 'New Year Blessing',
      name_te: 'నూతన సంవత్సర ఆశీర్వాదం',
      name_hi: 'नए साल का आशीर्वाद',
      date: 'January 1, 2026',
      time: '12:00 AM - 4:00 AM',
      description_en: 'Begin your year with divine blessings and rituals.',
      description_te: 'దివ్య ఆశీర్వాదాలు మరియు చేష్టలతో మీ సంవత్సరాన్ని ప్రారంభించండి.',
      description_hi: 'दिव्य आशीर्वाद और अनुष्ठानों के साथ अपना वर्ष शुरू करें।',
      icon: '🎊',
      image: '/images/special-events/new-year.jpg'
    },
    {
      id: 4,
      name_en: 'Holi Celebration',
      name_te: 'హోలీ జరుపుకోవడం',
      name_hi: 'होली का उत्सव',
      date: 'March 15, 2026',
      time: '10:00 AM - 6:00 PM',
      description_en: 'Festival of colors with community feast and celebrations.',
      description_te: 'కమ్యూనిటీ విందు మరియు జరుపుకోవడాలతో రంగుల పండుగ.',
      description_hi: 'सामुदायिक दावत और उत्सव के साथ रंगों का त्योहार।',
      icon: '🌈',
      image: '/images/special-events/holi.jpg'
    },
    {
      id: 5,
      name_en: 'Summer Spiritual Retreat',
      name_te: 'వేసవి ఆధ్యాత్మిక సేవనిలయం',
      name_hi: 'ग्रीष्मकालीन आध्यात्मिक पीठासन',
      date: 'June 15-21, 2026',
      time: '7:00 AM - 7:00 PM',
      description_en: 'Week-long intensive spiritual training and meditation.',
      description_te: 'వారం పొడవైన గভీర ఆధ్యాత్మిక శిక్షణ మరియు ధ్యానం.',
      description_hi: 'सप्ताह भर गहन आध्यात्मिक प्रशिक्षण और ध्यान।',
      icon: '🧘',
      image: '/images/special-events/retreat.jpg'
    },
    {
      id: 6,
      name_en: 'Harvest Festival',
      name_te: 'పంట కోతి ఉత్సవం',
      name_hi: 'फसल का त्योहार',
      date: 'October 20, 2025',
      time: '8:00 AM - 5:00 PM',
      description_en: 'Gratitude ceremony and community celebration.',
      description_te: 'కృతజ్ఞత చేష్ట మరియు కమ్యూనిటీ జరుపుకోవడం.',
      description_hi: 'कृतज्ञता समारोह और सामुदायिक उत्सव।',
      icon: '🌾',
      image: '/images/special-events/harvest.jpg'
    }
  ];

  const getEventName = (event) => {
    const lang = localStorage.getItem('language') || 'en';
    if (lang === 'te') return event.name_te;
    if (lang === 'hi') return event.name_hi;
    return event.name_en;
  };

  const getEventDescription = (event) => {
    const lang = localStorage.getItem('language') || 'en';
    if (lang === 'te') return event.description_te;
    if (lang === 'hi') return event.description_hi;
    return event.description_en;
  };

  return (
    <div className="page">
      <div className="hero">
        <h1>📅 {t('events_title')}</h1>
        <p>{t('events_upcoming')}</p>
      </div>

      <div className="container">
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#8b4513' }}>{t('events_upcoming')}</h2>
        <div className="cards-grid">
          {events.map(event => (
            <div key={event.id} className="card">
              <div className="card-image" style={{ fontSize: '2.5rem', backgroundImage: `url(${event.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>{event.icon}</div>
              <div className="card-content">
                <h3>{getEventName(event)}</h3>
                <p><strong>📅 {t('event_date')}:</strong> {event.date}</p>
                <p><strong>⏰ {t('event_time')}:</strong> {event.time}</p>
                <p>{getEventDescription(event)}</p>
                <button className="btn">Register</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}