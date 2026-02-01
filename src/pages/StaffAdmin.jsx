import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { staffAPI } from '../services/templeAPI';

const translations = {
  en: {
    staff: 'Staff',
    addStaff: 'Add Staff Member',
    editStaff: 'Edit Staff Member',
    deleteStaff: 'Delete Staff Member',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    create: 'Create',
    name: 'Name',
    position: 'Position',
    email: 'Email',
    phone: 'Phone',
    experience: 'Experience (years)',
    description: 'Description',
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
    staff: 'సిబ్బంది',
    addStaff: 'సిబ్బంది సభ్యుడిని జోడించండి',
    editStaff: 'సిబ్బంది సభ్యుడిని సవరించండి',
    deleteStaff: 'సిబ్బంది సభ్యుడిని తొలగించండి',
    save: 'సేవ్',
    cancel: 'రద్దు',
    delete: 'తొలగించండి',
    edit: 'సవరించండి',
    create: 'సృష్టించండి',
    name: 'పేరు',
    position: 'స్థానం',
    email: 'ఇమెయిల్',
    phone: 'ఫోన్',
    experience: 'అనుభవం (సంవత్సరాలు)',
    description: 'వివరణ',
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
    staff: 'कर्मचारी',
    addStaff: 'कर्मचारी सदस्य जोड़ें',
    editStaff: 'कर्मचारी सदस्य संपादित करें',
    deleteStaff: 'कर्मचारी सदस्य हटाएं',
    save: 'सहेजें',
    cancel: 'रद्द करें',
    delete: 'हटाएं',
    edit: 'संपादित करें',
    create: 'बनाएं',
    name: 'नाम',
    position: 'पद',
    email: 'ईमेल',
    phone: 'फोन',
    experience: 'अनुभव (वर्ष)',
    description: 'विवरण',
    loading: 'लोड हो रहा है...',
    error: 'त्रुटि',
    success: 'सफलता',
    noStaff: 'कोई कर्मचारी नहीं',
    confirmDelete: 'क्या आप इस कर्मचारी को हटाना चाहते हैं?',
    accessDenied: 'एक्सेस नकारा गया',
    adminOnly: 'केवल व्यवस्थापक इस पृष्ठ तक पहुंच सकते हैं',
    backToStaff: 'कर्मचारी पर वापस जाएं'
  }
};

// Mock data
const MOCK_STAFF = [
  {
    id: 1,
    fullName: 'Pandit Rajesh Kumar',
    name: 'Pandit Rajesh Kumar',
    position: 'Head Priest',
    email: 'rajesh@temple.com',
    phoneNumber: '+91-9876543210',
    phone: '+91-9876543210',
    experience: 15,
    description: 'Senior priest with 15 years of experience in conducting Hindu rituals and ceremonies',
    profileImageUrl: null
  },
  {
    id: 2,
    fullName: 'Priya Singh',
    name: 'Priya Singh',
    position: 'Temple Manager',
    email: 'priya@temple.com',
    phoneNumber: '+91-9876543211',
    phone: '+91-9876543211',
    experience: 8,
    description: 'Experienced temple manager overseeing daily operations and administrative tasks',
    profileImageUrl: null
  },
  {
    id: 3,
    fullName: 'Suresh Patel',
    name: 'Suresh Patel',
    position: 'Accountant',
    email: 'suresh@temple.com',
    phoneNumber: '+91-9876543212',
    phone: '+91-9876543212',
    experience: 10,
    description: 'Certified accountant managing temple finances and donation records',
    profileImageUrl: null
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
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    name: '',
    position: '',
    email: '',
    phoneNumber: '',
    phone: '',
    experience: '',
    description: '',
    profileImageUrl: ''
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

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
      const staffData = Array.isArray(data) ? data : data?.data || [];
      setStaff(staffData.length > 0 ? staffData : MOCK_STAFF);
      setError(null);
    } catch (err) {
      console.warn('Backend not available, using mock data:', err.message);
      setStaff(MOCK_STAFF);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: value,
      // Keep both name formats in sync
      ...(name === 'fullName' && { name: value }),
      ...(name === 'name' && { fullName: value }),
      ...(name === 'phoneNumber' && { phone: value }),
      ...(name === 'phone' && { phoneNumber: value })
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({ ...prev, profileImageUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        fullName: formData.fullName || formData.name,
        name: formData.fullName || formData.name,
        position: formData.position,
        email: formData.email,
        phoneNumber: formData.phoneNumber || formData.phone,
        phone: formData.phoneNumber || formData.phone,
        experience: formData.experience,
        description: formData.description,
        profileImageUrl: formData.profileImageUrl
      };

      if (editingId) {
        await staffAPI.update(editingId, submitData);
      } else {
        await staffAPI.create(submitData);
      }
      fetchStaff();
      resetForm();
    } catch (err) {
      alert(err.response?.data?.message || t.error || 'Error saving staff member');
    }
  };

  const handleEdit = (staffMember) => {
    setFormData({
      fullName: staffMember.fullName || staffMember.name || '',
      name: staffMember.fullName || staffMember.name || '',
      position: staffMember.position || '',
      email: staffMember.email || '',
      phoneNumber: staffMember.phoneNumber || staffMember.phone || '',
      phone: staffMember.phoneNumber || staffMember.phone || '',
      experience: staffMember.experience || '',
      description: staffMember.description || '',
      profileImageUrl: staffMember.profileImageUrl || ''
    });
    setImagePreview(staffMember.profileImageUrl || null);
    setEditingId(staffMember.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await staffAPI.delete(id);
      fetchStaff();
      setShowDeleteConfirm(null);
    } catch (err) {
      alert(err.response?.data?.message || t.error || 'Error deleting staff member');
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      name: '',
      position: '',
      email: '',
      phoneNumber: '',
      phone: '',
      experience: '',
      description: '',
      profileImageUrl: ''
    });
    setImagePreview(null);
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center', minHeight: '60vh' }}>
        <div style={{
          display: 'inline-block',
          width: '50px',
          height: '50px',
          border: '5px solid #f3f3f3',
          borderTop: '5px solid #0B1C3F',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ fontSize: '18px', color: '#666', marginTop: '20px' }}>{t.loading}</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Check admin access
  if (!isAuthenticated || user?.role !== 'admin') {
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
        <h2 style={{ color: '#d32f2f', marginBottom: '20px' }}>{t.accessDenied || 'Access Denied'}</h2>
        <p style={{ color: '#666', marginBottom: '30px' }}>{t.adminOnly || 'Only admins can access this page'}</p>
        <a href="/staff" style={{
          display: 'inline-block',
          padding: '10px 20px',
          backgroundColor: '#0B1C3F',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '4px',
          fontWeight: '500'
        }}>
          {t.backToStaff || 'Back to Staff'}
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
            {t.staff || 'Staff'} Management
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
            + {t.addStaff || 'Add Staff Member'}
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
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '8px',
            marginBottom: '30px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ color: '#0B1C3F', marginBottom: '20px', marginTop: 0 }}>
              {editingId ? (t.editStaff || 'Edit Staff Member') : (t.addStaff || 'Add Staff Member')}
            </h2>

            <form onSubmit={handleSubmit}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '15px',
                marginBottom: '15px'
              }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                    {t.name || 'Full Name'} <span style={{ color: 'red' }}>*</span>
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
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                    {t.position || 'Position'} <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
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
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '15px',
                marginBottom: '15px'
              }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                    {t.email || 'Email'}
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
                    {t.phone || 'Phone'} <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
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
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                  {t.experience || 'Experience (years)'}
                </label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
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

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                  Profile Photo (Optional, max 5MB)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    boxSizing: 'border-box'
                  }}
                />
                {imagePreview && (
                  <div style={{ marginTop: '10px', textAlign: 'center' }}>
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      style={{ 
                        maxWidth: '150px', 
                        maxHeight: '150px', 
                        borderRadius: '8px',
                        objectFit: 'cover',
                        border: '2px solid #ddd' 
                      }}
                    />
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                  {t.description || 'Description'}
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
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
                  {t.save || 'Save'}
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
                  {t.cancel || 'Cancel'}
                </button>
              </div>
            </form>
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
            <p style={{ fontSize: '16px', color: '#999' }}>{t.noStaff || 'No staff members'}</p>
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
                {/* Profile Image */}
                <div style={{
                  height: '200px',
                  background: 'linear-gradient(135deg, #0B1C3F 0%, #1a3a6b 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}>
                  {member.profileImageUrl ? (
                    <img 
                      src={member.profileImageUrl} 
                      alt={member.fullName || member.name}
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover' 
                      }}
                      onError={(e) => { 
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement.innerHTML = '<span style="font-size: 4rem; color: white">👤</span>';
                      }}
                    />
                  ) : (
                    <span style={{ fontSize: '4rem', color: 'white' }}>👤</span>
                  )}
                </div>

                <div style={{ padding: '20px' }}>
                  <h3 style={{ margin: '0 0 5px 0', color: '#0B1C3F' }}>
                    {member.fullName || member.name}
                  </h3>
                  <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#E6B325', fontWeight: 'bold' }}>
                    {member.position}
                  </p>
                  <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px' }}>
                    📧 {member.email}
                  </p>
                  <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px' }}>
                    📞 {member.phoneNumber || member.phone}
                  </p>
                  {member.experience && (
                    <p style={{ margin: '0 0 15px 0', color: '#666', fontSize: '14px' }}>
                      ⭐ {member.experience} years experience
                    </p>
                  )}
                  {member.description && (
                    <p style={{ margin: '0 0 20px 0', color: '#666', fontSize: '13px', lineHeight: '1.4' }}>
                      {member.description.substring(0, 100)}{member.description.length > 100 ? '...' : ''}
                    </p>
                  )}

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
                      {t.edit || 'Edit'}
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
                      {t.delete || 'Delete'}
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
                {t.deleteStaff || 'Delete Staff Member'}
              </h3>
              <p style={{ color: '#666', marginBottom: '25px' }}>
                {t.confirmDelete || 'Are you sure you want to delete this staff member?'}
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
                  {t.delete || 'Delete'}
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
                  {t.cancel || 'Cancel'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
