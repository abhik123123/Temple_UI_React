import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  getAllStaff
} from '../services/staffData';

const translations = {
  en: {
    staff: 'Temple Staff',
    addStaff: 'Add Staff Member',
    editStaff: 'Edit Staff Member',
    deleteStaff: 'Delete Staff Member',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    name: 'Name',
    fullName: 'Full Name',
    role: 'Role',
    department: 'Department',
    email: 'Email',
    phone: 'Phone Number',
    joiningDate: 'Joining Date',
    responsibilities: 'Responsibilities',
    profileImageUrl: 'Profile Image URL',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    noStaff: 'No staff members',
    confirmDelete: 'Are you sure you want to delete this staff member?',
    adminMode: 'Admin Mode',
    allDepartments: 'All',
    meetOurTeam: 'Meet our dedicated temple staff',
    teamMembers: 'Team Members',
    contactInfo: 'Contact Information',
    close: 'Close',
    roleAndDept: 'Role & Department',
    yearsOfService: 'Years of Service'
  },
  te: {
    staff: 'దేవాలయ సిబ్బంది',
    addStaff: 'సిబ్బంది సభ్యుడిని జోడించండి',
    editStaff: 'సిబ్బంది సభ్యుడిని సవరించండి',
    deleteStaff: 'సిబ్బంది సభ్యుడిని తొలగించండి',
    save: 'సేవ్',
    cancel: 'రద్దు',
    delete: 'తొలగించండి',
    edit: 'సవరించండి',
    name: 'పేరు',
    fullName: 'పూర్తి పేరు',
    role: 'పాత్ర',
    department: 'విభాగం',
    email: 'ఇమెయిల్',
    phone: 'ఫోన్ నంబర్',
    joiningDate: 'చేరిన తేదీ',
    responsibilities: 'బాధ్యతలు',
    profileImageUrl: 'ప్రొఫైల్ చిత్రం URL',
    loading: 'లోడ్ చేస్తోంది...',
    error: 'లోపం',
    success: 'విజయం',
    noStaff: 'సిబ్బంది సభ్యులు లేరు',
    confirmDelete: 'మీరు ఈ సిబ్బంది సభ్యుడిని తొలగించాలనుకుంటున్నారా?',
    adminMode: 'నిర్వాహక మోడ్',
    allDepartments: 'అన్ని',
    meetOurTeam: 'మా అంకితమైన దేవాలయ సిబ్బందిని కలవండి',
    teamMembers: 'బృంద సభ్యులు',
    contactInfo: 'సంప్రదింపు సమాచారం',
    close: 'మూసివేయండి',
    roleAndDept: 'పాత్ర & విభాగం',
    yearsOfService: 'సేవా సంవత్సరాలు'
  },
  hi: {
    staff: 'मंदिर कर्मचारी',
    addStaff: 'कर्मचारी सदस्य जोड़ें',
    editStaff: 'कर्मचारी सदस्य संपादित करें',
    deleteStaff: 'कर्मचारी सदस्य हटाएं',
    save: 'सहेजें',
    cancel: 'रद्द करें',
    delete: 'हटाएं',
    edit: 'संपादित करें',
    name: 'नाम',
    fullName: 'पूरा नाम',
    role: 'भूमिका',
    department: 'विभाग',
    email: 'ईमेल',
    phone: 'फ़ोन नंबर',
    joiningDate: 'शामिल होने की तारीख',
    responsibilities: 'जिम्मेदारियां',
    profileImageUrl: 'प्रोफ़ाइल छवि URL',
    loading: 'लोड हो रहा है...',
    error: 'त्रुटि',
    success: 'सफलता',
    noStaff: 'कोई कर्मचारी सदस्य नहीं',
    confirmDelete: 'क्या आप इस कर्मचारी सदस्य को हटाना चाहते हैं?',
    adminMode: 'व्यवस्थापक मोड',
    allDepartments: 'सभी',
    meetOurTeam: 'हमारे समर्पित मंदिर कर्मचारियों से मिलें',
    teamMembers: 'टीम के सदस्य',
    contactInfo: 'संपर्क जानकारी',
    close: 'बंद करें',
    roleAndDept: 'भूमिका और विभाग',
    yearsOfService: 'सेवा के वर्ष'
  }
};

export default function Staff() {
  const { language } = useLanguage();
  const t = translations[language] || translations.en;

  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [filterDept, setFilterDept] = useState('All');

  // Fetch staff on mount
  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = () => {
    try {
      setLoading(true);
      const data = getAllStaff();
      setStaff(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching staff:', err);
      setStaff([]);
      setError('Unable to load staff members.');
    } finally {
      setLoading(false);
    }
  };

  // Calculate years of service
  const calculateYearsOfService = (joiningDate) => {
    if (!joiningDate) return 0;
    const years = Math.floor((new Date() - new Date(joiningDate)) / (365.25 * 24 * 60 * 60 * 1000));
    return years;
  };

  // Get unique departments
  const departments = staff.length > 0
    ? ['All', ...new Set(staff.map(s => s.department))]
    : ['All'];

  // Filter staff by department
  const filteredStaff = filterDept === 'All' 
    ? staff 
    : staff.filter(s => s.department === filterDept);

  return (
    <div className="page">
      {/* Hero Section */}
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
          <h1 style={{ color: 'white', fontSize: '2.5rem' }}>
            👥 {t.staff}
          </h1>
          <p style={{ color: '#f0f0f0', fontSize: '1.1rem' }}>{t.meetOurTeam}</p>
        </div>
      </div>

      <div className="container">
        {/* Main Content Section */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: '#8b4513', textAlign: 'center', marginBottom: '1.5rem' }}>
            {t.teamMembers}
          </h2>
          
          {/* Department Filter */}
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '2rem'
          }}>
            {departments.map(dept => (
              <button
                key={dept}
                onClick={() => setFilterDept(dept)}
                disabled={loading || !staff.length}
                style={{
                  padding: '0.5rem 1rem',
                  border: 'none',
                  background: filterDept === dept ? '#8b4513' : '#f0f0f0',
                  color: filterDept === dept ? 'white' : '#333',
                  borderRadius: '20px',
                  cursor: loading || !staff.length ? 'not-allowed' : 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  transition: 'all 0.3s'
                }}
              >
                {dept}
              </button>
            ))}
          </div>

          {loading && (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
              {t.loading}
            </div>
          )}

          {error && (
            <div style={{ background: '#ffe5e5', padding: '1rem', borderRadius: '4px', color: '#d32f2f', marginBottom: '1rem' }}>
              ⚠️ {error}
            </div>
          )}

          {/* Staff Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '2rem',
            marginBottom: '2rem'
          }}>
            {filteredStaff.map(member => (
              <div
                key={member.id}
                style={{
                  background: 'white',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  transition: 'transform 0.3s, boxShadow 0.3s',
                  transform: 'translateY(0)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                }}
              >
                {/* Member Image */}
                <div 
                  onClick={() => setSelectedStaff(member)}
                  style={{
                    height: '220px',
                    background: 'linear-gradient(135deg, #0B1C3F 0%, #1a3a6b 100%)',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {member.profileImageUrl ? (
                    <img
                      src={member.profileImageUrl}
                      alt={member.fullName}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<div style="font-size: 3rem; color: white;">👤</div>';
                      }}
                    />
                  ) : (
                    <div style={{ fontSize: '3rem', color: 'white' }}>👤</div>
                  )}
                </div>

                {/* Member Info */}
                <div style={{ padding: '1.5rem' }}>
                  <div onClick={() => setSelectedStaff(member)}>
                    <h3 style={{ color: '#0B1C3F', margin: '0 0 0.5rem 0', fontSize: '1.2rem' }}>
                      {member.fullName}
                    </h3>
                    
                    <p style={{
                      color: '#E6B325',
                      fontWeight: 'bold',
                      margin: '0.25rem 0',
                      fontSize: '0.95rem'
                    }}>
                      {member.role}
                    </p>

                    <p style={{
                      color: '#999',
                      margin: '0.25rem 0 1rem 0',
                      fontSize: '0.85rem'
                    }}>
                      {member.department}
                    </p>

                    {member.joiningDate && (
                      <p style={{
                        color: '#666',
                        margin: '0 0 1rem 0',
                        fontSize: '0.85rem',
                        fontStyle: 'italic'
                      }}>
                        ⭐ {calculateYearsOfService(member.joiningDate)} {t.yearsOfService}
                      </p>
                    )}

                    <div style={{ borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                      <p style={{ margin: '0.25rem 0', fontSize: '0.85rem', color: '#666' }}>
                        📞 <a href={`tel:${member.phoneNumber}`} style={{ color: '#0B1C3F', textDecoration: 'none' }} onClick={(e) => e.stopPropagation()}>
                          {member.phoneNumber}
                        </a>
                      </p>
                      <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: '#666' }}>
                        ✉️ <a href={`mailto:${member.email}`} style={{ color: '#0B1C3F', textDecoration: 'none' }} onClick={(e) => e.stopPropagation()}>
                          {member.email}
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {(!loading && filteredStaff.length === 0) && (
            <div style={{
              textAlign: 'center',
              padding: '3rem 1rem',
              color: '#999'
            }}>
              {t.noStaff}
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedStaff && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={() => setSelectedStaff(null)}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '8px',
              maxWidth: '600px',
              width: '90%',
              maxHeight: '80vh',
              overflow: 'auto',
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              background: 'linear-gradient(135deg, #0B1C3F 0%, #1a3a6b 100%)',
              padding: '2rem',
              color: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h2 style={{ margin: 0 }}>{selectedStaff.fullName}</h2>
              <button
                onClick={() => setSelectedStaff(null)}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  color: 'white',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  padding: '0 0.5rem',
                  borderRadius: '4px'
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ padding: '2rem' }}>
              {selectedStaff.profileImageUrl && (
                <img
                  src={selectedStaff.profileImageUrl}
                  alt={selectedStaff.fullName}
                  style={{
                    width: '100%',
                    height: '300px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    marginBottom: '1.5rem'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              )}

              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ color: '#0B1C3F', marginTop: 0 }}>{t.roleAndDept}</h3>
                <p style={{ margin: '0.25rem 0', color: '#333' }}>
                  <strong>{t.role}:</strong> {selectedStaff.role}
                </p>
                <p style={{ margin: '0.25rem 0', color: '#333' }}>
                  <strong>{t.department}:</strong> {selectedStaff.department}
                </p>
                {selectedStaff.joiningDate && (
                  <p style={{ margin: '0.25rem 0', color: '#333' }}>
                    <strong>{t.yearsOfService}:</strong> {calculateYearsOfService(selectedStaff.joiningDate)}
                  </p>
                )}
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ color: '#0B1C3F', marginTop: 0 }}>{t.contactInfo}</h3>
                <p style={{ margin: '0.25rem 0', color: '#333' }}>
                  📞 <a href={`tel:${selectedStaff.phoneNumber}`} style={{ color: '#0B1C3F', textDecoration: 'none' }}>
                    {selectedStaff.phoneNumber}
                  </a>
                </p>
                <p style={{ margin: '0.25rem 0', color: '#333' }}>
                  ✉️ <a href={`mailto:${selectedStaff.email}`} style={{ color: '#0B1C3F', textDecoration: 'none' }}>
                    {selectedStaff.email}
                  </a>
                </p>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ color: '#0B1C3F', marginTop: 0 }}>{t.responsibilities}</h3>
                <p style={{ color: '#666', lineHeight: '1.6' }}>
                  {selectedStaff.responsibilities}
                </p>
              </div>

              <button
                onClick={() => setSelectedStaff(null)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: '#0B1C3F',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 'bold'
                }}
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
