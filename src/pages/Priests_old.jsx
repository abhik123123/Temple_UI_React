import { useLanguage } from '../context/LanguageContext';

export default function Priests() {
  const { t } = useLanguage();
  const lang = localStorage.getItem('language') || 'en';

  const priests = [
    {
      id: 1,
      name: { en: 'Swami Ananda', te: 'స్వామి ఆనందం', hi: 'स्वामी आनंद' },
      role: { en: 'Head Priest', te: 'ప్రధాన పూజారి', hi: 'मुख्य पुजारी' },
      experience: { en: '45 years', te: '45 సంవత్సరాలు', hi: '45 साल' },
      specialization: { en: 'Vedic Rituals', te: 'వేద చేష్టలు', hi: 'वैदिक अनुष्ठान' },
      bio: { en: 'Highly respected spiritual leader with extensive knowledge of ancient traditions.', te: 'పురాతన సంప్రదాయాల గురించి విస్తృత జ్ఞానం ఉన్న చాలా గుర్తించిన ఆధ్యాత్మిక నేత.', hi: 'प्राचीन परंपराओं का व्यापक ज्ञान रखने वाले अत्यधिक सम्मानित आध्यात्मिक नेता।' },
      icon: '👨‍🙏',
      image: '/images/placeholder.svg'
    },
    {
      id: 2,
      name: { en: 'Priest Ramesh Kumar', te: 'పూజారి రమేశ్ కుమార్', hi: 'पुजारी रमेश कुमार' },
      role: { en: 'Senior Priest', te: 'సిబ్బంది పూజారి', hi: 'वरिष्ठ पुजारी' },
      experience: { en: '30 years', te: '30 సంవత్సరాలు', hi: '30 साल' },
      specialization: { en: 'Wedding Ceremonies', te: 'వివాహ చేష్టలు', hi: 'विवाह समारोह' },
      bio: { en: 'Expert in conducting marriage ceremonies and family blessing rituals.', te: 'వివాహ చేష్టలు మరియు కుటుంబ ఆశీర్వాద చేష్టలు నిర్వహణలో నిపుణుడు.', hi: 'विवाह समारोह और पारिवारिक आशीर्वाद अनुष्ठान संचालन में विशेषज्ञ।' },
      icon: '👨‍🙏',
      image: '/images/placeholder.svg'
    },
    {
      id: 3,
      name: { en: 'Priest Vishnu Sharma', te: 'పూజారి విష్ణు శర్మ', hi: 'पुजारी विष्णु शर्मा' },
      role: { en: 'Spiritual Guide', te: 'ఆధ్యాత్మిక గైడ్', hi: 'आध्यात्मिक मार्गदर्शक' },
      experience: { en: '20 years', te: '20 సంవత్సరాలు', hi: '20 साल' },
      specialization: { en: 'Meditation & Yoga', te: 'ధ్యానం & యోగా', hi: 'ध्यान और योग' },
      bio: { en: 'Dedicated to teaching meditation and spiritual wellness practices.', te: 'ధ్యానం మరియు ఆధ్యాత్మిక సుస్థతా పద్ధతులు నేర్పడానికి కట్టుబడి.', hi: 'ध्यान और आध्यात्मिक कल्याण प्रथाओं को सिखाने के लिए समर्पित।' },
      icon: '👨‍🙏',
      image: '/images/placeholder.svg'
    },
    {
      id: 4,
      name: { en: 'Priest Arjun Das', te: 'పూజారి అర్జున్ దాస్', hi: 'पुजारी अर्जुन दास' },
      role: { en: 'Ritual Specialist', te: 'చేష్ట విశేషజ్ఞుడు', hi: 'अनुष्ठान विशेषज्ञ' },
      experience: { en: '25 years', te: '25 సంవత్సరాలు', hi: '25 साल' },
      specialization: { en: 'Daily Pujas', te: 'రోజువారీ పూజలు', hi: 'दैनिक पूजा' },
      bio: { en: 'Performs daily prayers with utmost devotion and spiritual precision.', te: 'రోజువారీ ప్రార్థనలను పరమ భక్తి మరియు ఆధ్యాత్మిక ఖచ్చితత్వంతో నిర్వహిస్తుంది.', hi: 'अत्यधिक भक्ति और आध्यात्मिक सटीकता के साथ दैनिक प्रार्थना करते हैं।' },
      icon: '👨‍🙏',
      image: '/images/placeholder.svg'
    },
    {
      id: 5,
      name: { en: 'Priest Suresh', te: 'పూజారి సురేశ్', hi: 'पुजारी सुरेश' },
      role: { en: 'Music Maestro', te: 'సంగీత పండితుడు', hi: 'संगीत पंडित' },
      experience: { en: '15 years', te: '15 సంవత్సరాలు', hi: '15 साल' },
      specialization: { en: 'Sacred Music', te: 'పవిత్ర సంగీతం', hi: 'पवित्र संगीत' },
      bio: { en: 'Leads devotional singing and manages temple music programs.', te: 'భక్తి గానం నెతృత్వం ఇస్తుంది మరియు దేవాలయ సంగీత కార్యక్రమాలను నిర్వహిస్తుంది.', hi: 'भक्ति गायन का नेतृत्व करते हैं और मंदिर संगीत कार्यक्रमों का प्रबंधन करते हैं।' },
      icon: '👨‍🙏',
      image: '/images/placeholder.svg'
    },
    {
      id: 6,
      name: { en: 'Priest Mohan', te: 'పూజారి మోహన్', hi: 'पुजारी मोहन' },
      role: { en: 'Youth Coordinator', te: 'యువ సమన్వయకర్త', hi: 'युवा समन्वयक' },
      experience: { en: '10 years', te: '10 సంవత్సరాలు', hi: '10 साल' },
      specialization: { en: 'Youth Programs', te: 'యువ కార్యక్రమాలు', hi: 'युवा कार्यक्रम' },
      bio: { en: 'Organizes spiritual activities and education for young devotees.', te: 'యువ భక్తుల కోసం ఆధ్యాత్మిక కార్యకలాపాలు మరియు విద్యను నిర్వహిస్తుంది.', hi: 'युवा भक्तों के लिए आध्यात्मिक गतिविधियों और शिक्षा का आयोजन करते हैं।' },
      icon: '👨‍🙏',
      image: '/images/placeholder.svg'
    }
  ];

  const getPriestName = (priest) => priest.name[lang] || priest.name['en'];
  const getPriestRole = (priest) => priest.role[lang] || priest.role['en'];
  const getPriestExperience = (priest) => priest.experience[lang] || priest.experience['en'];
  const getPriestSpecialization = (priest) => priest.specialization[lang] || priest.specialization['en'];
  const getPriestBio = (priest) => priest.bio[lang] || priest.bio['en'];

  return (
    <div className="page">
      <div className="hero">
        <h1>👨‍🙏 {t('priests_title')}</h1>
        <p>{t('priests_description')}</p>
      </div>

      <div className="container">
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#8b4513' }}>{t('priests_title')}</h2>
        <div className="cards-grid">
          {priests.map(priest => (
            <div key={priest.id} className="card">
              <div className="card-image" style={{ fontSize: '4rem', backgroundImage: `url(${priest.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>{priest.icon}</div>
              <div className="card-content">
                <h3>{getPriestName(priest)}</h3>
                <p style={{ color: '#a0522d', fontWeight: 'bold', marginBottom: '0.5rem' }}>{getPriestRole(priest)}</p>
                <p><strong>{t('priest_experience')}:</strong> {getPriestExperience(priest)}</p>
                <p><strong>{t('priest_specialty')}:</strong> {getPriestSpecialization(priest)}</p>
                <p style={{ marginBottom: '1rem' }}>{getPriestBio(priest)}</p>
                <button className="btn">Contact</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}