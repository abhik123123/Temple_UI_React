import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { dailyPoojasAPI } from '../services/postgresAPI';

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const translations = {
  en: {
    dailyPrayers: 'Daily Prayers',
    addPooja: 'Add Prayer/Pooja',
    editPooja: 'Edit Prayer/Pooja',
    deletePooja: 'Delete Prayer/Pooja',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    poojaName: 'Prayer Name',
    time: 'Time',
    duration: 'Duration',
    day: 'Day',
    description: 'Description',
    deity: 'Deity',
    icon: 'Icon/Image',
    iconHelp: 'Upload an image or enter emoji',
    uploadImage: 'Upload Image',
    removeImage: 'Remove Image',
    orUseEmoji: 'Or use emoji',
    details: 'Details (one per line)',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    noPoojas: 'No prayers scheduled',
    confirmDelete: 'Are you sure you want to delete this prayer?',
    accessDenied: 'Access Denied',
    adminOnly: 'Only admins can access this page',
    backToPrayers: 'Back to Daily Prayers',
    detailsPlaceholder: 'Enter each detail on a new line',
    totalPrayers: 'Total Prayers',
    prayersCount: 'prayers',
    viewByDay: 'View by Day',
    viewAll: 'View All',
    quickAdd: 'Quick Add for',
    summary: 'Summary',
    manage: 'Manage'
  },
  te: {
    dailyPrayers: 'దైనిక ప్రార్థనలు',
    addPooja: 'పూజ జోడించండి',
    editPooja: 'పూజను సవరించండి',
    deletePooja: 'పూజను తొలగించండి',
    save: 'సేవ్',
    cancel: 'రద్దు',
    delete: 'తొలగించండి',
    edit: 'సవరించండి'
  },
  hi: {
    dailyPrayers: 'दैनिक प्रार्थना',
    addPooja: 'पूजा जोड़ें',
    editPooja: 'पूजा संपादित करें',
    deletePooja: 'पूजा हटाएं',
    save: 'सहेजें',
    cancel: 'रद्द करें',
    delete: 'हटाएं',
    edit: 'संपादित करें'
  }
};

export default function DailyPrayersAdmin() {
  const { language } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const t = translations[language] || translations.en;

  const [poojas, setPoojas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    time: '09:00',
    duration: '30 minutes',
    day: 'Daily',
    selectedDays: [], // Array to hold multiple selected days
    description: '',
    deity: '',
    icon: '🙏',
    details: '',
    repeatEveryWeek: false
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [filterDay, setFilterDay] = useState('All');
  const [viewMode, setViewMode] = useState('all'); // 'all' or 'grouped'

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      fetchPoojas();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user?.role]);

  const fetchPoojas = () => {
    setLoading(true);
    dailyPoojasAPI.getAll()
      .then(data => setPoojas(data))
      .catch(err => console.error('Error loading poojas:', err))
      .finally(() => setLoading(false));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  // Handle day checkbox selection
  const handleDayCheckboxChange = (day) => {
    setFormData(prev => {
      const selectedDays = prev.selectedDays.includes(day)
        ? prev.selectedDays.filter(d => d !== day)
        : [...prev.selectedDays, day];
      return { ...prev, selectedDays };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const detailsArray = formData.details
        .split('\n')
        .map(d => d.trim())
        .filter(d => d);

      const poojaData = {
        name: formData.name,
        time: formData.time,
        duration: formData.duration,
        description: formData.description,
        deity: formData.deity,
        icon: formData.icon || '🙏',
        details: detailsArray
      };

      if (editingId) {
        if (formData.selectedDays.length > 1) {
          await dailyPoojasAPI.update(editingId, { ...poojaData, day: formData.selectedDays[0] });
          for (let i = 1; i < formData.selectedDays.length; i++) {
            await dailyPoojasAPI.create({ ...poojaData, day: formData.selectedDays[i] });
          }
          alert(`Success! Prayer updated and duplicated to ${formData.selectedDays.length} day(s): ${formData.selectedDays.join(', ')}`);
        } else if (formData.selectedDays.length === 1) {
          await dailyPoojasAPI.update(editingId, { ...poojaData, day: formData.selectedDays[0] });
          alert(t.success);
        } else {
          alert('Please select at least one day');
          return;
        }
      } else {
        if (formData.selectedDays.length > 0) {
          for (const day of formData.selectedDays) {
            await dailyPoojasAPI.create({ ...poojaData, day });
          }
          alert(`Success! Prayer added to ${formData.selectedDays.length} selected day(s): ${formData.selectedDays.join(', ')}`);
        } else {
          alert('Please select at least one day from the checkboxes above');
          return;
        }
      }

      await fetchPoojas();
      resetForm();
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      alert(t.error + ': ' + err.message);
    }
  };

  const handleEdit = (pooja) => {
    if (!pooja.id) {
      console.error('Pooja has no ID!', pooja);
      alert('Error: Pooja has no ID. Cannot edit.');
      return;
    }
    
    const detailsString = Array.isArray(pooja.details) ? pooja.details.join('\n') : '';
    setEditingId(pooja.id);
    setFormData({
      name: pooja.name || '',
      time: pooja.time || '09:00',
      duration: pooja.duration || '30 minutes',
      day: pooja.day || 'Daily',
      selectedDays: [pooja.day], // Initialize with current day selected
      description: pooja.description || '',
      deity: pooja.deity || '',
      icon: pooja.icon || '🙏',
      details: detailsString,
      repeatEveryWeek: false
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await dailyPoojasAPI.delete(id);
      fetchPoojas();
      setShowDeleteConfirm(null);
      alert(t.success);
    } catch (err) {
      alert(t.error + ': ' + err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      time: '09:00',
      duration: '30 minutes',
      day: 'Daily',
      selectedDays: [],
      description: '',
      deity: '',
      icon: '🙏',
      details: '',
      repeatEveryWeek: false
    });
    setEditingId(null);
    setShowForm(false);
  };

  // Get prayers count by day
  const getPrayersCountByDay = (day) => {
    if (day === 'Daily') {
      return poojas.filter(p => p.day === 'Daily').length;
    }
    return poojas.filter(p => p.day === day || p.day === 'Daily').length;
  };

  // Group prayers by day
  const groupedPoojas = () => {
    const grouped = {
      Daily: poojas.filter(p => p.day === 'Daily').sort((a, b) => (a.time || '00:00').localeCompare(b.time || '00:00'))
    };
    
    DAYS_OF_WEEK.forEach(day => {
      grouped[day] = poojas.filter(p => p.day === day).sort((a, b) => (a.time || '00:00').localeCompare(b.time || '00:00'));
    });
    
    return grouped;
  };

  const handleQuickAdd = (day) => {
    setFormData({
      name: '',
      time: '09:00',
      duration: '30 minutes',
      day: day,
      selectedDays: [],
      description: '',
      deity: '',
      icon: '🙏',
      details: '',
      repeatEveryWeek: false
    });
    setEditingId(null);
    setShowForm(true);
  };

  // Filter poojas by day
  const filteredPoojas = filterDay === 'All' 
    ? poojas 
    : poojas.filter(p => p.day === filterDay || p.day === 'Daily');

  // Sort by time
  const sortedPoojas = [...filteredPoojas].sort((a, b) => {
    const timeA = a.time || '00:00';
    const timeB = b.time || '00:00';
    return timeA.localeCompare(timeB);
  });

  if (loading) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center', minHeight: '60vh' }}>
        <p>{t.loading}</p>
      </div>
    );
  }

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
        <h2 style={{ color: '#d32f2f', marginBottom: '20px' }}>{t.accessDenied}</h2>
        <p style={{ color: '#666', marginBottom: '30px' }}>{t.adminOnly}</p>
        <a href="/daily-prayers" style={{
          display: 'inline-block',
          padding: '10px 20px',
          backgroundColor: '#0B1C3F',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '4px',
          fontWeight: '500'
        }}>
          {t.backToPrayers}
        </a>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 20px', minHeight: '70vh', backgroundColor: '#f9f9f9' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px',
          flexWrap: 'wrap',
          gap: '15px'
        }}>
          <div>
            <h1 style={{ fontSize: '2rem', color: '#0B1C3F', margin: '0 0 10px 0' }}>
              🙏 {t.dailyPrayers} {t.manage}
            </h1>
            <p style={{ color: '#666', margin: 0, fontSize: '14px' }}>
              {t.totalPrayers}: <strong>{poojas.length}</strong> {t.prayersCount}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setViewMode(viewMode === 'all' ? 'grouped' : 'all')}
              style={{
                padding: '12px 24px',
                backgroundColor: '#E6B325',
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
              {viewMode === 'all' ? '📅 ' + t.viewByDay : '📋 ' + t.viewAll}
            </button>
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
              + {t.addPooja}
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '15px',
          marginBottom: '30px'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            textAlign: 'center',
            border: '2px solid #E6B325'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🔄</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0B1C3F', marginBottom: '5px' }}>
              {getPrayersCountByDay('Daily')}
            </div>
            <div style={{ fontSize: '12px', color: '#666', fontWeight: '600' }}>Daily Prayers</div>
            <button
              onClick={() => handleQuickAdd('Daily')}
              style={{
                marginTop: '10px',
                padding: '6px 12px',
                backgroundColor: '#E6B325',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '11px',
                fontWeight: '500'
              }}
            >
              + Add
            </button>
          </div>
          
          {DAYS_OF_WEEK.map(day => (
            <div key={day} style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.2rem', fontWeight: '600', color: '#0B1C3F', marginBottom: '8px' }}>
                {day.slice(0, 3)}
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#E6B325', marginBottom: '5px' }}>
                {getPrayersCountByDay(day)}
              </div>
              <div style={{ fontSize: '11px', color: '#666' }}>prayers</div>
              <button
                onClick={() => handleQuickAdd(day)}
                style={{
                  marginTop: '10px',
                  padding: '6px 12px',
                  backgroundColor: '#0B1C3F',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontWeight: '500'
                }}
              >
                + Add
              </button>
            </div>
          ))}
        </div>

        {/* Day Filter - Only show in 'all' view mode */}
        {viewMode === 'all' && (
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontWeight: '600', color: '#0B1C3F', marginRight: '10px' }}>Filter:</span>
              <button
                onClick={() => setFilterDay('All')}
                style={{
                  padding: '8px 16px',
                  backgroundColor: filterDay === 'All' ? '#0B1C3F' : '#f5f5f5',
                  color: filterDay === 'All' ? 'white' : '#333',
                  border: filterDay === 'All' ? 'none' : '1px solid #ddd',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '500'
                }}
              >
                All Days
              </button>
              <button
                onClick={() => setFilterDay('Daily')}
                style={{
                  padding: '8px 16px',
                  backgroundColor: filterDay === 'Daily' ? '#E6B325' : '#f5f5f5',
                  color: filterDay === 'Daily' ? 'white' : '#333',
                  border: filterDay === 'Daily' ? 'none' : '1px solid #ddd',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '500'
                }}
              >
                Daily
              </button>
              {DAYS_OF_WEEK.map(day => (
                <button
                  key={day}
                  onClick={() => setFilterDay(day)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: filterDay === day ? '#E6B325' : '#f5f5f5',
                    color: filterDay === day ? 'white' : '#333',
                    border: filterDay === day ? 'none' : '1px solid #ddd',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '500'
                  }}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Form Modal */}
        {showForm && (
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '8px',
            marginBottom: '30px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            border: '2px solid #E6B325'
          }}>
            <h2 style={{ color: '#0B1C3F', marginBottom: '20px', marginTop: 0 }}>
              {editingId ? '✏️ ' + t.editPooja : '➕ ' + t.addPooja}
            </h2>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                    {t.poojaName} *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Morning Suprabhatam"
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
                    {t.time} *
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
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
                    {t.duration} *
                  </label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    required
                    placeholder="30 minutes"
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

              {/* Day Selection - Show checkboxes for both add and edit modes */}
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500', fontSize: '15px' }}>
                  {t.day} * <span style={{ fontSize: '13px', color: '#666', fontWeight: 'normal' }}>
                    {editingId ? '(Change day or select multiple days to duplicate)' : '(Select one or more specific days)'}
                  </span>
                </label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                  gap: '10px',
                  padding: '15px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  border: '1px solid #ddd'
                }}>
                  {DAYS_OF_WEEK.map(day => (
                    <label
                      key={day}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        padding: '8px 12px',
                        backgroundColor: formData.selectedDays.includes(day) ? '#E6B325' : 'white',
                        color: formData.selectedDays.includes(day) ? 'white' : '#333',
                        borderRadius: '6px',
                        fontWeight: formData.selectedDays.includes(day) ? '600' : '500',
                        fontSize: '14px',
                        transition: 'all 0.2s ease',
                        border: '2px solid ' + (formData.selectedDays.includes(day) ? '#E6B325' : '#ddd')
                      }}
                      onMouseEnter={e => {
                        if (!formData.selectedDays.includes(day)) {
                          e.currentTarget.style.backgroundColor = '#f0f0f0';
                        }
                      }}
                      onMouseLeave={e => {
                        if (!formData.selectedDays.includes(day)) {
                          e.currentTarget.style.backgroundColor = 'white';
                        }
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={formData.selectedDays.includes(day)}
                        onChange={() => handleDayCheckboxChange(day)}
                        style={{
                          width: '18px',
                          height: '18px',
                          cursor: 'pointer',
                          accentColor: '#E6B325'
                        }}
                      />
                      <span>📅 {day}</span>
                    </label>
                  ))}
                </div>
                {formData.selectedDays.length > 0 && (
                  <p style={{
                    margin: '10px 0 0 0',
                    fontSize: '13px',
                    color: '#0B1C3F',
                    fontWeight: '600'
                  }}>
                    ✅ Selected: {formData.selectedDays.join(', ')} ({formData.selectedDays.length} day{formData.selectedDays.length > 1 ? 's' : ''})
                  </p>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                    {t.deity}
                  </label>
                  <input
                    type="text"
                    name="deity"
                    value={formData.deity}
                    onChange={handleInputChange}
                    placeholder="Lord Venkateswara"
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
                    {t.icon}
                  </label>
                  <input
                    type="text"
                    name="icon"
                    value={formData.icon}
                    onChange={handleInputChange}
                    placeholder="🙏"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                  <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>{t.iconHelp}</p>
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                  {t.description} *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  placeholder="Describe the prayer/pooja..."
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

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                  {t.details}
                </label>
                <textarea
                  name="details"
                  value={formData.details}
                  onChange={handleInputChange}
                  rows="5"
                  placeholder={t.detailsPlaceholder}
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

              {/* Repeat Every Week Option - Show for both add and edit modes */}
              <div style={{
                marginBottom: '20px',
                padding: '15px',
                backgroundColor: '#f0f8ff',
                border: '2px solid #E6B325',
                borderRadius: '8px'
              }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '15px',
                  color: '#0B1C3F'
                }}>
                  <input
                    type="checkbox"
                    name="repeatEveryWeek"
                    checked={formData.repeatEveryWeek}
                    onChange={handleInputChange}
                    style={{
                      width: '20px',
                      height: '20px',
                      cursor: 'pointer',
                      accentColor: '#E6B325'
                    }}
                  />
                  <span>
                    🔄 {editingId ? 'Duplicate to Selected Days' : 'Repeat Every Week'}
                  </span>
                </label>
                <p style={{
                  margin: '10px 0 0 32px',
                  fontSize: '13px',
                  color: '#666',
                  lineHeight: '1.5'
                }}>
                  {editingId 
                    ? (formData.selectedDays.length > 1 
                      ? `✅ Will update current prayer and create duplicates for: ${formData.selectedDays.join(', ')}`
                      : '⚠️ Select multiple days above to duplicate this prayer')
                    : (formData.repeatEveryWeek && formData.selectedDays.length > 0
                      ? `✅ This prayer will repeat every week on: ${formData.selectedDays.join(', ')}`
                      : formData.repeatEveryWeek 
                      ? '⚠️ Please select specific days above first'
                      : 'Check this to make the prayer repeat every week on the selected days above')
                  }
                </p>
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

        {/* Grouped View by Day */}
        {viewMode === 'grouped' ? (
          <div>
            {/* Daily Prayers Section */}
            <div style={{ marginBottom: '40px' }}>
              <div style={{
                backgroundColor: '#E6B325',
                color: 'white',
                padding: '15px 20px',
                borderRadius: '8px 8px 0 0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <h2 style={{ margin: 0, fontSize: '1.3rem' }}>🔄 Daily Prayers ({getPrayersCountByDay('Daily')} total)</h2>
                <button
                  onClick={() => handleQuickAdd('Daily')}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: 'white',
                    color: '#E6B325',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '600'
                  }}
                >
                  + Add Daily Prayer
                </button>
              </div>
              <div style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '0 0 8px 8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                {groupedPoojas().Daily.length === 0 ? (
                  <p style={{ textAlign: 'center', color: '#999', padding: '20px' }}>No daily prayers scheduled</p>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '15px' }}>
                    {groupedPoojas().Daily.map(pooja => (
                      <PrayerCard key={pooja.id} pooja={pooja} onEdit={handleEdit} onDelete={setShowDeleteConfirm} t={t} />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Weekly Prayers Sections */}
            {DAYS_OF_WEEK.map(day => (
              <div key={day} style={{ marginBottom: '40px' }}>
                <div style={{
                  backgroundColor: '#0B1C3F',
                  color: 'white',
                  padding: '15px 20px',
                  borderRadius: '8px 8px 0 0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <h2 style={{ margin: 0, fontSize: '1.3rem' }}>📅 {day} ({getPrayersCountByDay(day)} total including daily)</h2>
                  <button
                    onClick={() => handleQuickAdd(day)}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: 'white',
                      color: '#0B1C3F',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '600'
                    }}
                  >
                    + Add for {day}
                  </button>
                </div>
                <div style={{
                  backgroundColor: 'white',
                  padding: '20px',
                  borderRadius: '0 0 8px 8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                  {groupedPoojas()[day].length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
                      No special prayers for {day}. Daily prayers will be shown on this day.
                    </p>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '15px' }}>
                      {groupedPoojas()[day].map(pooja => (
                        <PrayerCard key={pooja.id} pooja={pooja} onEdit={handleEdit} onDelete={setShowDeleteConfirm} t={t} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* All Prayers View */
          sortedPoojas.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              backgroundColor: 'white',
              borderRadius: '8px'
            }}>
              <p style={{ fontSize: '16px', color: '#999' }}>{t.noPoojas}</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
              gap: '20px'
            }}>
              {sortedPoojas.map(pooja => (
                <PrayerCard key={pooja.id} pooja={pooja} onEdit={handleEdit} onDelete={setShowDeleteConfirm} t={t} />
              ))}
            </div>
          )
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
                {t.deletePooja}
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

// Prayer Card Component
function PrayerCard({ pooja, onEdit, onDelete, t }) {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      border: '1px solid #e0e0e0'
    }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
    }}>
      <div style={{
        padding: '20px',
        background: 'linear-gradient(135deg, #0B1C3F 0%, #1a3a6b 100%)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: '15px'
      }}>
        <div style={{ fontSize: '3rem' }}>
          {pooja.icon || '🙏'}
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: '0 0 5px 0', fontSize: '1.2rem' }}>{pooja.name}</h3>
          <div style={{ fontSize: '1.3rem', fontWeight: 'bold', fontFamily: 'monospace' }}>
            ⏰ {pooja.time}
          </div>
        </div>
      </div>

      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '15px', flexWrap: 'wrap' }}>
          <span style={{
            padding: '5px 12px',
            backgroundColor: pooja.day === 'Daily' ? '#E6B325' : '#0B1C3F',
            color: 'white',
            borderRadius: '15px',
            fontSize: '11px',
            fontWeight: '600'
          }}>
            {pooja.day === 'Daily' ? '🔄 ' : '📅 '}{pooja.day}
          </span>
          <span style={{
            padding: '5px 12px',
            backgroundColor: '#f0f0f0',
            color: '#333',
            borderRadius: '15px',
            fontSize: '11px',
            fontWeight: '600'
          }}>
            ⏱️ {pooja.duration}
          </span>
          {pooja.deity && (
            <span style={{
              padding: '5px 12px',
              backgroundColor: '#fff3e0',
              color: '#e65100',
              borderRadius: '15px',
              fontSize: '11px',
              fontWeight: '600'
            }}>
              🕉️ {pooja.deity}
            </span>
          )}
        </div>

        <p style={{ margin: '0 0 15px 0', color: '#666', fontSize: '13px', lineHeight: '1.5' }}>
          {pooja.description}
        </p>
        
        {pooja.details && pooja.details.length > 0 && (
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '12px',
            borderRadius: '4px',
            marginBottom: '15px',
            maxHeight: '100px',
            overflowY: 'auto'
          }}>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '12px' }}>
              {pooja.details.map((detail, idx) => (
                <li key={idx} style={{ marginBottom: '5px', color: '#555' }}>
                  {detail}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => onEdit(pooja)}
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
            ✏️ {t.edit}
          </button>
          <button
            onClick={() => onDelete(pooja.id)}
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
            🗑️ {t.delete}
          </button>
        </div>
      </div>
    </div>
  );
}
