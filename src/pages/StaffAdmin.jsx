import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { staffAPI } from '../services/postgresAPI';

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
    create: 'Create',
    name: 'Name',
    fullName: 'Full Name',
    role: 'Role',
    department: 'Department',
    email: 'Email',
    phone: 'Phone',
    joiningDate: 'Joining Date',
    responsibilities: 'Responsibilities',
    yearsOfService: 'Years of Service',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    noStaff: 'No staff members',
    confirmDelete: 'Are you sure you want to delete this staff member?',
    accessDenied: 'Access Denied',
    adminOnly: 'Only admins can access this page',
    backToStaff: 'Back to Staff'
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
    create: 'సృష్టించండి',
    name: 'పేరు',
    fullName: 'పూర్తి పేరు',
    role: 'పాత్ర',
    department: 'విభాగం',
    email: 'ఇమెయిల్',
    phone: 'ఫోన్',
    joiningDate: 'చేరిన తేదీ',
    responsibilities: 'బాధ్యతలు',
    yearsOfService: 'సేవా సంవత్సరాలు',
    loading: 'లోడ్ చేస్తోంది...',
    error: 'లోపం',
    success: 'విజయం',
    noStaff: 'సిబ్బంది సభ్యులు లేరు',
    confirmDelete: 'మీరు ఈ సిబ్బంది సభ్యుడిని తొలగించాలనుకుంటున్నారా?',
    accessDenied: 'యాక్సెస్ నిరాకరించబడ్డారు',
    adminOnly: 'ఈ పేజీకి ప్రవేశించడానికి పరిపాలకులు మాత్రమే',
    backToStaff: 'సిబ్బందికి తిరిగి వెళ్లండి'
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
    create: 'बनाएं',
    name: 'नाम',
    fullName: 'पूरा नाम',
    role: 'भूमिका',
    department: 'विभाग',
    email: 'ईमेल',
    phone: 'फोन',
    joiningDate: 'शामिल होने की तारीख',
    responsibilities: 'जिम्मेदारियां',
    yearsOfService: 'सेवा के वर्ष',
    loading: 'लोड हो रहा है...',
    error: 'त्रुटि',
    success: 'सफलता',
    noStaff: 'कोई कर्मचारी सदस्य नहीं',
    confirmDelete: 'क्या आप इस कर्मचारी सदस्य को हटाना चाहते हैं?',
    accessDenied: 'एक्सेस नकारा गया',
    adminOnly: 'केवल व्यवस्थापक इस पृष्ठ तक पहुंच सकते हैं',
    backToStaff: 'कर्मचारियों पर वापस जाएं'
  }
};

// Mock data
const MOCK_STAFF = [
  {
    id: 1,
    fullName: 'Ramesh Kumar',
    role: 'Temple Manager',
    department: 'Administration',
    email: 'ramesh@temple.com',
    phone: '9876543210',
    joiningDate: '2015-06-15',
    responsibilities: 'Overall temple operations and daily management'
  },
  {
    id: 2,
    fullName: 'Lakshmi Devi',
    role: 'Head Cook',
    department: 'Kitchen',
    email: 'lakshmi@temple.com',
    phone: '9876543211',
    joiningDate: '2018-03-20',
    responsibilities: 'Manages prasadam preparation and kitchen operations'
  },
  {
    id: 3,
    fullName: 'Suresh Reddy',
    role: 'Maintenance Supervisor',
    department: 'Maintenance',
    email: 'suresh@temple.com',
    phone: '9876543212',
    joiningDate: '2017-09-10',
    responsibilities: 'Oversees temple maintenance and repairs'
  }
];

export default function StaffAdmin() {
  const { language } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const t = translations[language] || translations.en;

  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    role: '',
    email: '',
    phone: '',
    joiningDate: '',
    responsibilities: '',
    profileImageUrl: ''
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      fetchStaff();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user?.role]);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const data = await staffAPI.getAll();
      setStaff(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error('Error loading staff:', err);
      setError('Unable to load staff. Is the backend running?');
      setStaff([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateYearsOfService = (joiningDate) => {
    if (!joiningDate) return 0;
    const years = Math.floor((new Date() - new Date(joiningDate)) / (365.25 * 24 * 60 * 60 * 1000));
    return years;
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setFormData(prev => ({ ...prev, profileImageUrl: base64String }));
        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImagePreview('');
    setFormData(prev => ({ ...prev, profileImageUrl: '' }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        fullName: formData.fullName,
        role: formData.role,
        department: formData.department || '',
        phoneNumber: formData.phone,
        email: formData.email,
        joiningDate: formData.joiningDate || null,
        responsibilities: formData.responsibilities,
        profileImageUrl: formData.profileImageUrl || null,
      };
      if (editingId) {
        await staffAPI.update(editingId, payload);
      } else {
        await staffAPI.create(payload);
      }
      await fetchStaff();
      resetForm();
      alert(t.success + '!');
    } catch (err) {
      console.error('Error saving staff:', err);
      alert(t.error + ': ' + (err.response?.data?.error || err.message));
    }
  };

  const handleEdit = (member) => {
    setFormData({
      fullName: member.fullName || '',
      role: member.role || '',
      email: member.email || '',
      phone: member.phone || member.phoneNumber || '',
      joiningDate: member.joiningDate || '',
      responsibilities: member.responsibilities || '',
      profileImageUrl: member.profileImageUrl || ''
    });
    setImagePreview(member.profileImageUrl || '');
    setEditingId(member.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await staffAPI.delete(id);
      await fetchStaff();
      setShowDeleteConfirm(null);
      alert(t.success + '!');
    } catch (err) {
      console.error('Error deleting staff:', err);
      alert(t.error + ': ' + (err.response?.data?.error || err.message));
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      role: '',
      email: '',
      phone: '',
      joiningDate: '',
      responsibilities: '',
      profileImageUrl: ''
    });
    setImagePreview('');
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center', minHeight: '60vh' }}>
        <p>{t.loading}</p>
      </div>
    );
  }

  // Check admin access
  if (isAuthenticated && user?.role !== 'admin') {
    return (
      <div style={{
        padding: '40px 20px',
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#d32f2f', marginBottom: '20px' }}>{t.accessDenied}</h2>
        <p style={{ color: '#666', marginBottom: '30px' }}>{t.adminOnly}</p>
        <a href="/staff" style={{
          display: 'inline-block',
          padding: '10px 20px',
          backgroundColor: '#0B1C3F',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '4px',
          fontWeight: '500'
        }}>
          {t.backToStaff}
        </a>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 20px', minHeight: '70vh', backgroundColor: '#f9f9f9' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px'
        }}>
          <h1 style={{ fontSize: '2rem', color: '#0B1C3F', margin: 0 }}>
            {t.staff} Management
          </h1>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            style={{
              padding: '12px 24px',
              backgroundColor: '#0B1C3F',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={e => e.target.style.opacity = '0.9'}
            onMouseLeave={e => e.target.style.opacity = '1'}
          >
            + {t.addStaff}
          </button>
        </div>

        {error && (
          <div style={{
            padding: '15px',
            backgroundColor: '#ffebee',
            color: '#c62828',
            borderRadius: '4px',
            marginBottom: '20px'
          }}>
            {error}
          </div>
        )}

        {/* Form Modal */}
        {showForm && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            padding: '20px',
            overflow: 'auto'
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '12px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
              position: 'relative'
            }}>
              {/* Close button */}
              <button
                onClick={resetForm}
                style={{
                  position: 'absolute',
                  top: '15px',
                  right: '15px',
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#666',
                  padding: '5px 10px',
                  lineHeight: '1'
                }}
                onMouseEnter={e => e.target.style.color = '#000'}
                onMouseLeave={e => e.target.style.color = '#666'}
              >
                ×
              </button>

              <h2 style={{ color: '#0B1C3F', marginBottom: '20px', marginTop: 0 }}>
                {editingId ? t.editStaff : t.addStaff}
              </h2>

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                    {t.fullName} *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                    {t.role} *
                  </label>
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Manager, Coordinator"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '15px',
                  marginBottom: '15px'
                }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                      {t.email}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                      {t.phone} *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="9876543210"
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                    Profile Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                  {imagePreview && (
                    <div style={{ marginTop: '10px', textAlign: 'center' }}>
                      <img
                        src={imagePreview}
                        alt="Profile Preview"
                        style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '4px' }}
                      />
                      <button
                        type="button"
                        onClick={clearImage}
                        style={{
                          display: 'block',
                          margin: '10px auto 0',
                          padding: '8px 16px',
                          backgroundColor: '#d32f2f',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontWeight: '500',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={e => e.target.style.opacity = '0.9'}
                        onMouseLeave={e => e.target.style.opacity = '1'}
                      >
                        Remove Image
                      </button>
                    </div>
                  )}
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                    {t.responsibilities}
                  </label>
                  <textarea
                    name="responsibilities"
                    value={formData.responsibilities}
                    onChange={handleInputChange}
                    rows="4"
                    placeholder="Key responsibilities and duties (optional)..."
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="submit"
                    style={{
                      padding: '12px 24px',
                      backgroundColor: '#0B1C3F',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: '500',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={e => e.target.style.opacity = '0.9'}
                    onMouseLeave={e => e.target.style.opacity = '1'}
                  >
                    {t.save}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    style={{
                      padding: '12px 24px',
                      backgroundColor: '#f5f5f5',
                      color: '#333',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: '500',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={e => e.target.style.backgroundColor = '#e8e8e8'}
                    onMouseLeave={e => e.target.style.backgroundColor = '#f5f5f5'}
                  >
                    {t.cancel}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Staff List */}
        {staff.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            backgroundColor: 'white',
            borderRadius: '8px'
          }}>
            <p style={{ fontSize: '16px', color: '#999' }}>{t.noStaff}</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '25px'
          }}>
            {staff.map(member => (
              <div
                key={member.id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  transition: 'transform 0.3s ease'
                }}
              >
                <div style={{
                  padding: '20px',
                  background: 'linear-gradient(135deg, #0B1C3F 0%, #1a3a6b 100%)',
                  color: 'white'
                }}>
                  <h3 style={{ margin: '0 0 5px 0' }}>{member.fullName}</h3>
                  <p style={{ margin: 0, fontSize: '12px', opacity: 0.9 }}>
                    {member.role}
                  </p>
                </div>

                <div style={{ padding: '20px' }}>
                  {member.profileImageUrl && (
                    <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                      <img
                        src={member.profileImageUrl}
                        alt="Profile"
                        style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '4px' }}
                      />
                    </div>
                  )}
                  <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px' }}>
                    🏢 {member.department}
                  </p>
                  <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px' }}>
                    📧 {member.email}
                  </p>
                  <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px' }}>
                    📞 {member.phone || member.phoneNumber}
                  </p>
                  {member.joiningDate && (
                    <p style={{ margin: '0 0 15px 0', color: '#666', fontSize: '14px' }}>
                      ⭐ {calculateYearsOfService(member.joiningDate)} {t.yearsOfService}
                    </p>
                  )}
                  <p style={{ margin: '0 0 20px 0', color: '#666', fontSize: '13px', lineHeight: '1.4' }}>
                    {member.responsibilities?.substring(0, 100)}{member.responsibilities?.length > 100 ? '...' : ''}
                  </p>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => handleEdit(member)}
                      style={{
                        flex: 1,
                        padding: '10px',
                        backgroundColor: '#E6B325',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: '500',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={e => e.target.style.opacity = '0.9'}
                      onMouseLeave={e => e.target.style.opacity = '1'}
                    >
                      {t.edit}
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(member.id)}
                      style={{
                        flex: 1,
                        padding: '10px',
                        backgroundColor: '#d32f2f',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: '500',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={e => e.target.style.opacity = '0.9'}
                      onMouseLeave={e => e.target.style.opacity = '1'}
                    >
                      {t.delete}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '30px',
              maxWidth: '400px',
              width: '90%',
              textAlign: 'center'
            }}>
              <h3 style={{ color: '#0B1C3F', marginBottom: '15px', marginTop: 0 }}>
                {t.deleteStaff}
              </h3>
              <p style={{ color: '#666', marginBottom: '25px' }}>
                {t.confirmDelete}
              </p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button
                  onClick={() => handleDelete(showDeleteConfirm)}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#d32f2f',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: '500',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={e => e.target.style.opacity = '0.9'}
                  onMouseLeave={e => e.target.style.opacity = '1'}
                >
                  {t.delete}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#f5f5f5',
                    color: '#333',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: '500',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={e => e.target.style.backgroundColor = '#e8e8e8'}
                  onMouseLeave={e => e.target.style.backgroundColor = '#f5f5f5'}
                >
                  {t.cancel}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
