import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { boardMembersAPI } from '../services/postgresAPI';

const translations = {
  en: {
    boardMembers: 'Board Members',
    addMember: 'Add Board Member',
    editMember: 'Edit Board Member',
    deleteMember: 'Delete Board Member',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    create: 'Create',
    name: 'Name',
    position: 'Position',
    department: 'Department',
    email: 'Email',
    phone: 'Phone',
    experience: 'Experience (years)',
    description: 'Description',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    noMembers: 'No board members',
    confirmDelete: 'Are you sure you want to delete this board member?',
    accessDenied: 'Access Denied',
    adminOnly: 'Only admins can access this page',
    backToMembers: 'Back to Board Members'
  },
  te: {
    boardMembers: 'బోర్డ్ సభ్యులు',
    addMember: 'బోర్డ్ సభ్యుడిని జోడించండి',
    editMember: 'బోర్డ్ సభ్యుడిని సవరించండి',
    deleteMember: 'బోర్డ్ సభ్యుడిని తొలగించండి',
    save: 'సేవ్',
    cancel: 'రద్దు',
    delete: 'తొలగించండి',
    edit: 'సవరించండి',
    create: 'సృష్టించండి',
    name: 'పేరు',
    position: 'స్థానం',
    department: 'విభాగం',
    email: 'ఇమెయిల్',
    phone: 'ఫోన్',
    experience: 'అనుభవం (సంవత్సరాలు)',
    description: 'వివరణ',
    loading: 'లోడ్ చేస్తోంది...',
    error: 'లోపం',
    success: 'విజయం',
    noMembers: 'బోర్డ్ సభ్యులు లేరు',
    confirmDelete: 'మీరు ఈ బోర్డ్ సభ్యుడిని తొలగించాలనుకుంటున్నారా?',
    accessDenied: 'యాక్సెస్ నిరాకరించబడ్డారు',
    adminOnly: 'ఈ పేజీకి ప్రవేశించడానికి పరిపాలకులు మాత్రమే',
    backToMembers: 'బోర్డ్ సభ్యులకు తిరిగి వెళ్లండి'
  },
  hi: {
    boardMembers: 'बोर्ड सदस्य',
    addMember: 'बोर्ड सदस्य जोड़ें',
    editMember: 'बोर्ड सदस्य संपादित करें',
    deleteMember: 'बोर्ड सदस्य हटाएं',
    save: 'सहेजें',
    cancel: 'रद्द करें',
    delete: 'हटाएं',
    edit: 'संपादित करें',
    create: 'बनाएं',
    name: 'नाम',
    position: 'पद',
    department: 'विभाग',
    email: 'ईमेल',
    phone: 'फोन',
    experience: 'अनुभव (वर्ष)',
    description: 'विवरण',
    loading: 'लोड हो रहा है...',
    error: 'त्रुटि',
    success: 'सफलता',
    noMembers: 'कोई बोर्ड सदस्य नहीं',
    confirmDelete: 'क्या आप इस बोर्ड सदस्य को हटाना चाहते हैं?',
    accessDenied: 'एक्सेस नकारा गया',
    adminOnly: 'केवल व्यवस्थापक इस पृष्ठ तक पहुंच सकते हैं',
    backToMembers: 'बोर्ड सदस्यों पर वापस जाएं'
  }
};

export default function BoardMembersAdmin() {
  const { language } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const t = translations[language] || translations.en;

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    position: '',
    department: '',
    email: '',
    phoneNumber: '',
    biography: '',
    profileImageUrl: ''
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      fetchMembers();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user?.role]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const data = await boardMembersAPI.getAll();
      setMembers(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error('Error fetching board members:', err);
      setMembers([]);
      setError('Unable to load board members. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
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
      if (editingId) {
        await boardMembersAPI.update(editingId, formData);
      } else {
        await boardMembersAPI.create(formData);
      }
      await fetchMembers();
      resetForm();
      alert(t.success);
    } catch (err) {
      console.error('Error saving member:', err);
      alert(t.error + ': ' + (err.response?.data?.error || err.message));
    }
  };

  const handleEdit = (member) => {
    setFormData({
      fullName: member.fullName || '',
      position: member.position || '',
      department: member.department || '',
      phoneNumber: member.phoneNumber || '',
      email: member.email || '',
      biography: member.biography || '',
      profileImageUrl: member.profileImageUrl || ''
    });
    setImagePreview(member.profileImageUrl || '');
    setEditingId(member.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await boardMembersAPI.delete(id);
      await fetchMembers();
      setShowDeleteConfirm(null);
      alert(t.success);
    } catch (err) {
      console.error('Error deleting member:', err);
      alert(t.error + ': ' + (err.response?.data?.error || err.message));
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      position: '',
      department: '',
      phoneNumber: '',
      email: '',
      biography: '',
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
        <a href="/board-members" style={{
          display: 'inline-block',
          padding: '10px 20px',
          backgroundColor: '#0B1C3F',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '4px',
          fontWeight: '500'
        }}>
          {t.backToMembers}
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
            {t.boardMembers} Management
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
            + {t.addMember}
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
                {editingId ? t.editMember : t.addMember}
              </h2>

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                    Full Name *
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

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '15px',
                  marginBottom: '15px'
                }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                      Position *
                    </label>
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., President, Vice President"
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
                      Department *
                    </label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., Leadership, Finance"
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
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
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
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
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
                        alt="Preview"
                        style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '4px' }}
                      />
                      <button
                        type="button"
                        onClick={clearImage}
                        style={{
                          display: 'block',
                          margin: '10px auto 0',
                          padding: '5px 10px',
                          backgroundColor: '#d32f2f',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}
                      >
                        Remove Image
                      </button>
                    </div>
                  )}
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                    Biography *
                  </label>
                  <textarea
                    name="biography"
                    value={formData.biography}
                    onChange={handleInputChange}
                    required
                    rows="4"
                    placeholder="Brief biography of the board member..."
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

        {/* Members List */}
        {members.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            backgroundColor: 'white',
            borderRadius: '8px'
          }}>
            <p style={{ fontSize: '16px', color: '#999' }}>{t.noMembers}</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '25px'
          }}>
            {members.map(member => (
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
                {/* Member Image */}
                {member.profileImageUrl ? (
                  <div style={{ 
                    width: '100%', 
                    height: '220px', 
                    overflow: 'hidden',
                    backgroundColor: '#f5e6d3'
                  }}>
                    <img 
                      src={member.profileImageUrl} 
                      alt={member.fullName}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                ) : (
                  <div style={{
                    width: '100%',
                    height: '220px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '4rem',
                    background: 'linear-gradient(135deg, #8b4513 0%, #a0522d 100%)',
                    color: 'white'
                  }}>
                    👤
                  </div>
                )}

                <div style={{ padding: '20px' }}>
                  <h3 style={{ margin: '0 0 5px 0', color: '#0B1C3F', fontSize: '1.3rem' }}>
                    {member.fullName}
                  </h3>
                  <p style={{ margin: '0 0 5px 0', color: '#d4a574', fontWeight: 'bold', fontSize: '0.95rem' }}>
                    {member.position}
                  </p>
                  <p style={{ margin: '0 0 10px 0', color: '#999', fontSize: '0.85rem' }}>
                    🏢 {member.department}
                  </p>
                  <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px' }}>
                    📧 {member.email}
                  </p>
                  <p style={{ margin: '0 0 15px 0', color: '#666', fontSize: '14px' }}>
                    📞 {member.phoneNumber}
                  </p>
                  <p style={{ margin: '0 0 20px 0', color: '#666', fontSize: '13px', lineHeight: '1.4' }}>
                    {member.biography?.substring(0, 100)}{member.biography?.length > 100 ? '...' : ''}
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
                {t.deleteMember}
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
