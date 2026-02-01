import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { 
  getAllDailyPoojas, 
  addPooja, 
  updatePooja, 
  deletePooja,
  DAYS_OF_WEEK 
} from '../services/dailyPoojasData';

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
    icon: 'Icon (Emoji)',
    details: 'Details (one per line)',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    noPoojas: 'No prayers scheduled',
    confirmDelete: 'Are you sure you want to delete this prayer?',
    accessDenied: 'Access Denied',
    adminOnly: 'Only admins can access this page',
    backToPrayers: 'Back to Daily Prayers',
    detailsPlaceholder: 'Enter each detail on a new line'
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
    description: '',
    deity: '',
    icon: '🙏',
    details: ''
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [filterDay, setFilterDay] = useState('All');

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      fetchPoojas();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user?.role]);

  const fetchPoojas = () => {
    try {
      setLoading(true);
      const data = getAllDailyPoojas();
      setPoojas(data);
    } catch (err) {
      console.error('Error loading poojas:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
        day: formData.day,
        description: formData.description,
        deity: formData.deity,
        icon: formData.icon || '🙏',
        details: detailsArray
      };

      let result;
      if (editingId) {
        result = updatePooja(editingId, poojaData);
      } else {
        result = addPooja(poojaData);
      }
      
      const updatedPoojas = getAllDailyPoojas();
      setPoojas(updatedPoojas);
      
      resetForm();
      alert(t.success);
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
      description: pooja.description || '',
      deity: pooja.deity || '',
      icon: pooja.icon || '🙏',
      details: detailsString
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      deletePooja(id);
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
      description: '',
      deity: '',
      icon: '🙏',
      details: ''
    });
    setEditingId(null);
    setShowForm(false);
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
          <h1 style={{ fontSize: '2rem', color: '#0B1C3F', margin: 0 }}>
            🙏 {t.dailyPrayers} Management
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
            + {t.addPooja}
          </button>
        </div>

        {/* Day Filter */}
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontWeight: '600', color: '#0B1C3F', marginRight: '10px' }}>Filter by Day:</span>
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
              {editingId ? t.editPooja : t.addPooja}
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

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                    {t.day} *
                  </label>
                  <select
                    name="day"
                    value={formData.day}
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
                  >
                    <option value="Daily">Daily</option>
                    {DAYS_OF_WEEK.map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>
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

        {/* Poojas List */}
        {sortedPoojas.length === 0 ? (
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
            gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
            gap: '20px'
          }}>
            {sortedPoojas.map(pooja => (
              <div
                key={pooja.id}
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
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px'
                }}>
                  <div style={{ fontSize: '3rem' }}>
                    {pooja.icon || '🙏'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 5px 0', fontSize: '1.3rem' }}>{pooja.name}</h3>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', fontFamily: 'monospace' }}>
                      ⏰ {pooja.time}
                    </div>
                  </div>
                </div>

                <div style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap' }}>
                    <span style={{
                      padding: '5px 12px',
                      backgroundColor: '#E6B325',
                      color: 'white',
                      borderRadius: '15px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {pooja.day}
                    </span>
                    <span style={{
                      padding: '5px 12px',
                      backgroundColor: '#f0f0f0',
                      color: '#333',
                      borderRadius: '15px',
                      fontSize: '12px',
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
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        🕉️ {pooja.deity}
                      </span>
                    )}
                  </div>

                  <p style={{ margin: '0 0 15px 0', color: '#666', fontSize: '14px', lineHeight: '1.5' }}>
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
                      onClick={() => handleEdit(pooja)}
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
                      onClick={() => setShowDeleteConfirm(pooja.id)}
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
