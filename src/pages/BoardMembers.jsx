import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { 
  getAllBoardMembers, 
  addBoardMember, 
  updateBoardMember, 
  deleteBoardMember 
} from '../services/boardMembersData';

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
    name: 'Name',
    fullName: 'Full Name',
    position: 'Position',
    department: 'Department',
    email: 'Email',
    phone: 'Phone Number',
    biography: 'Biography',
    profileImageUrl: 'Profile Image URL',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    noMembers: 'No board members',
    confirmDelete: 'Are you sure you want to delete this board member?',
    adminMode: 'Admin Mode',
    allDepartments: 'All',
    meetOurTeam: 'Meet our temple leadership team',
    management: 'Management',
    contactInfo: 'Contact Information',
    close: 'Close',
    positionAndDept: 'Position & Department'
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
    name: 'పేరు',
    fullName: 'పూర్తి పేరు',
    position: 'స్థానం',
    department: 'విభాగం',
    email: 'ఇమెయిల్',
    phone: 'ఫోన్ నంబర్',
    biography: 'జీవిత చరిత్ర',
    profileImageUrl: 'ప్రొఫైల్ చిత్రం URL',
    loading: 'లోడ్ చేస్తోంది...',
    error: 'లోపం',
    success: 'విజయం',
    noMembers: 'బోర్డ్ సభ్యులు లేరు',
    confirmDelete: 'మీరు ఈ బోర్డ్ సభ్యుడిని తొలగించాలనుకుంటున్నారా?',
    adminMode: 'నిర్వాహక మోడ్',
    allDepartments: 'అన్ని',
    meetOurTeam: 'మా దేవాలయ నాయకత్వ బృందాన్ని కలవండి',
    management: 'నిర్వహణ',
    contactInfo: 'సంప్రదింపు సమాచారం',
    close: 'మూసివేయండి',
    positionAndDept: 'స్థానం & విభాగం'
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
    name: 'नाम',
    fullName: 'पूरा नाम',
    position: 'पद',
    department: 'विभाग',
    email: 'ईमेल',
    phone: 'फ़ोन नंबर',
    biography: 'जीवनी',
    profileImageUrl: 'प्रोफ़ाइल छवि URL',
    loading: 'लोड हो रहा है...',
    error: 'त्रुटि',
    success: 'सफलता',
    noMembers: 'कोई बोर्ड सदस्य नहीं',
    confirmDelete: 'क्या आप इस बोर्ड सदस्य को हटाना चाहते हैं?',
    adminMode: 'व्यवस्थापक मोड',
    allDepartments: 'सभी',
    meetOurTeam: 'हमारी मंदिर नेतृत्व टीम से मिलें',
    management: 'प्रबंधन',
    contactInfo: 'संपर्क जानकारी',
    close: 'बंद करें',
    positionAndDept: 'पद और विभाग'
  }
};

export default function BoardMembers() {
  const { language } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const t = translations[language] || translations.en;
  const isAdmin = isAuthenticated && user?.role === 'admin';

  const [boardMembers, setBoardMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [filterDept, setFilterDept] = useState('All');
  
  // Admin state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    position: '',
    department: '',
    phoneNumber: '',
    email: '',
    biography: '',
    profileImageUrl: ''
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  // Fetch board members on mount
  useEffect(() => {
    fetchBoardMembers();
  }, []);

  const fetchBoardMembers = () => {
    try {
      setLoading(true);
      const data = getAllBoardMembers();
      setBoardMembers(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching board members:', err);
      setBoardMembers([]);
      setError('Unable to load board members.');
    } finally {
      setLoading(false);
    }
  };

  // Handle image file upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      setUploadingImage(true);

      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({ ...prev, profileImageUrl: reader.result }));
        setUploadingImage(false);
      };
      reader.onerror = () => {
        alert('Error reading file');
        setUploadingImage(false);
      };
      reader.readAsDataURL(file);
    }
  };

  // Clear image
  const clearImage = () => {
    setImagePreview('');
    setFormData(prev => ({ ...prev, profileImageUrl: '' }));
  };

  // Get unique departments
  const departments = boardMembers.length > 0
    ? ['All', ...new Set(boardMembers.map(m => m.department))]
    : ['All'];

  // Filter members by department
  const filteredMembers = filterDept === 'All' 
    ? boardMembers 
    : boardMembers.filter(m => m.department === filterDept);

  // Admin functions
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        updateBoardMember(editingId, formData);
        alert(t.success + ': Member updated');
      } else {
        addBoardMember(formData);
        alert(t.success + ': Member added');
      }
      fetchBoardMembers();
      resetForm();
    } catch (err) {
      console.error('Error saving member:', err);
      alert(t.error + ': ' + err.message);
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
    setEditingId(member.id);
    setShowForm(true);
    // Scroll to top to show form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    try {
      deleteBoardMember(id);
      fetchBoardMembers();
      setShowDeleteConfirm(null);
      alert(t.success + ': Member deleted');
    } catch (err) {
      console.error('Error deleting member:', err);
      alert(t.error + ': ' + err.message);
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
            👥 {t.boardMembers}
            {isAdmin && <span style={{ fontSize: '1rem', marginLeft: '15px', background: '#E6B325', padding: '5px 15px', borderRadius: '20px' }}>{t.adminMode}</span>}
          </h1>
          <p style={{ color: '#f0f0f0', fontSize: '1.1rem' }}>{t.meetOurTeam}</p>
        </div>
      </div>

      <div className="container">
        {/* Admin Form Section */}
        {isAdmin && (
          <div style={{ marginBottom: '2rem' }}>
            {/* Add Member Button */}
            {!showForm && (
              <div style={{ textAlign: 'right', marginBottom: '20px' }}>
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
                  {editingId ? t.editMember : t.addMember}
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

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '15px',
                    marginBottom: '15px'
                  }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                        {t.position} *
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
                        {t.department} *
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
                        {t.email} *
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
                        {t.phone} *
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
                      {t.profileImageUrl}
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
                      {t.biography} *
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
            )}
          </div>
        )}

        {/* Main Content Section */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: '#8b4513', textAlign: 'center', marginBottom: '1.5rem' }}>
            Temple {t.management} Board
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
                disabled={loading || !boardMembers.length}
                style={{
                  padding: '0.5rem 1rem',
                  border: 'none',
                  background: filterDept === dept ? '#8b4513' : '#f0f0f0',
                  color: filterDept === dept ? 'white' : '#333',
                  borderRadius: '20px',
                  cursor: loading || !boardMembers.length ? 'not-allowed' : 'pointer',
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

          {/* Board Members Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '2rem',
            marginBottom: '2rem'
          }}>
            {filteredMembers.map(member => (
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
                  onClick={() => setSelectedMember(member)}
                  style={{
                    height: '220px',
                    background: 'linear-gradient(135deg, #8b4513 0%, #a0522d 100%)',
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
                  <div onClick={() => setSelectedMember(member)}>
                    <h3 style={{ color: '#8b4513', margin: '0 0 0.5rem 0', fontSize: '1.2rem' }}>
                      {member.fullName}
                    </h3>
                    
                    <p style={{
                      color: '#d4a574',
                      fontWeight: 'bold',
                      margin: '0.25rem 0',
                      fontSize: '0.95rem'
                    }}>
                      {member.position}
                    </p>

                    <p style={{
                      color: '#999',
                      margin: '0.25rem 0 1rem 0',
                      fontSize: '0.85rem'
                    }}>
                      {member.department}
                    </p>

                    <div style={{ borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                      <p style={{ margin: '0.25rem 0', fontSize: '0.85rem', color: '#666' }}>
                        📞 <a href={`tel:${member.phoneNumber}`} style={{ color: '#8b4513', textDecoration: 'none' }} onClick={(e) => e.stopPropagation()}>
                          {member.phoneNumber}
                        </a>
                      </p>
                      <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: '#666' }}>
                        ✉️ <a href={`mailto:${member.email}`} style={{ color: '#8b4513', textDecoration: 'none' }} onClick={(e) => e.stopPropagation()}>
                          {member.email}
                        </a>
                      </p>
                    </div>
                  </div>

                  {/* Admin Controls */}
                  {isAdmin && (
                    <div style={{ display: 'flex', gap: '10px', marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #eee' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(member);
                        }}
                        style={{
                          flex: 1,
                          padding: '8px',
                          backgroundColor: '#E6B325',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '500',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={e => e.target.style.opacity = '0.9'}
                        onMouseLeave={e => e.target.style.opacity = '1'}
                      >
                        {t.edit}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDeleteConfirm(member.id);
                        }}
                        style={{
                          flex: 1,
                          padding: '8px',
                          backgroundColor: '#d32f2f',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '500',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={e => e.target.style.opacity = '0.9'}
                        onMouseLeave={e => e.target.style.opacity = '1'}
                      >
                        {t.delete}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {(!loading && filteredMembers.length === 0) && (
            <div style={{
              textAlign: 'center',
              padding: '3rem 1rem',
              color: '#999'
            }}>
              {t.noMembers}
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedMember && (
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
          onClick={() => setSelectedMember(null)}
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
              background: 'linear-gradient(135deg, #8b4513 0%, #a0522d 100%)',
              padding: '2rem',
              color: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h2 style={{ margin: 0 }}>{selectedMember.fullName}</h2>
              <button
                onClick={() => setSelectedMember(null)}
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
              {selectedMember.profileImageUrl && (
                <img
                  src={selectedMember.profileImageUrl}
                  alt={selectedMember.fullName}
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
                <h3 style={{ color: '#8b4513', marginTop: 0 }}>{t.positionAndDept}</h3>
                <p style={{ margin: '0.25rem 0', color: '#333' }}>
                  <strong>{t.position}:</strong> {selectedMember.position}
                </p>
                <p style={{ margin: '0.25rem 0', color: '#333' }}>
                  <strong>{t.department}:</strong> {selectedMember.department}
                </p>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ color: '#8b4513', marginTop: 0 }}>{t.contactInfo}</h3>
                <p style={{ margin: '0.25rem 0', color: '#333' }}>
                  📞 <a href={`tel:${selectedMember.phoneNumber}`} style={{ color: '#8b4513', textDecoration: 'none' }}>
                    {selectedMember.phoneNumber}
                  </a>
                </p>
                <p style={{ margin: '0.25rem 0', color: '#333' }}>
                  ✉️ <a href={`mailto:${selectedMember.email}`} style={{ color: '#8b4513', textDecoration: 'none' }}>
                    {selectedMember.email}
                  </a>
                </p>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ color: '#8b4513', marginTop: 0 }}>{t.biography}</h3>
                <p style={{ color: '#666', lineHeight: '1.6' }}>
                  {selectedMember.biography}
                </p>
              </div>

              <button
                onClick={() => setSelectedMember(null)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: '#8b4513',
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
          zIndex: 1001
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
  );
}
