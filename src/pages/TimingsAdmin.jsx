import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { timingsAPI } from '../services/templeAPI';
import IndiaTime from '../components/IndiaTime';

const translations = {
  en: {
    timings: 'Temple Timings',
    weeklySchedule: 'Weekly Schedule',
    save: 'Save',
    cancel: 'Cancel',
    opening: 'Opening Time',
    closing: 'Closing Time',
    addSlot: 'Add Time Slot',
    removeSlot: 'Remove',
    loading: 'Loading...',
    error: 'Error',
    success: 'Timings saved successfully!',
    unsavedChanges: 'You have unsaved changes',
    accessDenied: 'Access Denied',
    adminOnly: 'Only admins can access this page',
    backToHome: 'Back to Home'
  },
  te: {
    timings: 'మందిర సమయాలు',
    weeklySchedule: 'వారపు షెడ్యూల్',
    save: 'సేవ్',
    cancel: 'రద్దు',
    opening: 'తెరిచే సమయం',
    closing: 'ఆగిపోయే సమయం',
    addSlot: 'సమయ స్లాట్ జోడించండి',
    removeSlot: 'తొలగించు',
    loading: 'లోడ్ చేస్తోంది...',
    error: 'లోపం',
    success: 'సమయాలు విజయవంతంగా సేవ్ చేయబడ్డాయి!',
    unsavedChanges: 'మీకు సేవ చేయని మార్పులు ఉన్నాయి',
    accessDenied: 'యాక్సెస్ నిరాకరించబడ్డారు',
    adminOnly: 'ఈ పేజీకి ప్రవేశించడానికి పరిపాలకులు మాత్రమే',
    backToHome: 'హోమ్‌కు తిరిగి వెళ్లండి'
  },
  hi: {
    timings: 'मंदिर के समय',
    weeklySchedule: 'साप्ताहिक अनुसूची',
    save: 'सहेजें',
    cancel: 'रद्द करें',
    opening: 'खुलने का समय',
    closing: 'बंद होने का समय',
    addSlot: 'समय स्लॉट जोड़ें',
    removeSlot: 'हटाएं',
    loading: 'लोड हो रहा है...',
    error: 'त्रुटि',
    success: 'समय सफलतापूर्वक सहेजे गए!',
    unsavedChanges: 'आपके पास अनसेव किए गए परिवर्तन हैं',
    accessDenied: 'एक्सेस नकारा गया',
    adminOnly: 'केवल व्यवस्थापक इस पृष्ठ तक पहुंच सकते हैं',
    backToHome: 'होम पर वापस जाएं'
  }
};

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Helper to generate unique IDs
const generateId = () => Date.now() + Math.random().toString(36).substr(2, 9);

export default function TimingsAdmin() {
  const { language } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const t = translations[language] || translations.en;

  const [timings, setTimings] = useState({});
  const [originalTimings, setOriginalTimings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      fetchTimings();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user?.role]);

  const fetchTimings = async () => {
    try {
      setLoading(true);
      const response = await timingsAPI.getAll();
      const timingsData = response?.data || [];
      
      // Convert array format to object format for admin form
      const timingsObject = {};
      timingsData.forEach(dayTiming => {
        timingsObject[dayTiming.day] = {
          slots: dayTiming.slots || [],
          notes: dayTiming.notes || ''
        };
      });
      
      setTimings(timingsObject);
      setOriginalTimings(JSON.parse(JSON.stringify(timingsObject)));
      setError(null);
    } catch (err) {
      console.warn('Error loading timings:', err.message);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const handleTimeChange = (day, slotId, field, value) => {
    setTimings(prev => {
      const dayData = prev[day] || { slots: [], notes: '' };
      const daySlots = [...dayData.slots];
      const slotIndex = daySlots.findIndex(s => s.id === slotId);
      if (slotIndex !== -1) {
        daySlots[slotIndex] = { ...daySlots[slotIndex], [field]: value };
      }
      return { 
        ...prev, 
        [day]: { ...dayData, slots: daySlots }
      };
    });
    setHasChanges(true);
  };

  const handleNotesChange = (day, value) => {
    setTimings(prev => {
      const dayData = prev[day] || { slots: [], notes: '' };
      return {
        ...prev,
        [day]: { ...dayData, notes: value }
      };
    });
    setHasChanges(true);
  };

  const addTimeSlot = (day) => {
    setTimings(prev => {
      const dayData = prev[day] || { slots: [], notes: '' };
      return {
        ...prev,
        [day]: {
          ...dayData,
          slots: [
            ...dayData.slots,
            { id: generateId(), openTime: '09:00', closeTime: '17:00' }
          ]
        }
      };
    });
    setHasChanges(true);
  };

  const removeTimeSlot = (day, slotId) => {
    setTimings(prev => {
      const dayData = prev[day] || { slots: [], notes: '' };
      return {
        ...prev,
        [day]: {
          ...dayData,
          slots: dayData.slots.filter(slot => slot.id !== slotId)
        }
      };
    });
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Convert to array format for storage
      for (const day of DAYS) {
        const dayData = timings[day] || { slots: [], notes: '' };
        const slots = dayData.slots.map(slot => ({
          id: slot.id,
          openTime: slot.openTime ? (slot.openTime.split(':').length === 2 ? slot.openTime + ':00' : slot.openTime) : '09:00:00',
          closeTime: slot.closeTime ? (slot.closeTime.split(':').length === 2 ? slot.closeTime + ':00' : slot.closeTime) : '17:00:00'
        }));
        
        await timingsAPI.update(day, { 
          slots,
          notes: dayData.notes || ''
        });
      }
      
      setOriginalTimings(JSON.parse(JSON.stringify(timings)));
      setHasChanges(false);
      alert(t.success);
    } catch (err) {
      setError(err.response?.data?.message || t.error);
      alert(t.error + ': ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setTimings(JSON.parse(JSON.stringify(originalTimings)));
    setHasChanges(false);
  };

  const formatTime = (value) => {
    if (!value) return '';
    const parts = value.split(':');
    const hours = parseInt(parts[0]);
    const minutes = parts[1] || '00';
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHour = hours % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
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
        <a href="/" style={{
          display: 'inline-block',
          padding: '10px 20px',
          backgroundColor: '#0B1C3F',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '4px',
          fontWeight: '500'
        }}>
          {t.backToHome}
        </a>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 20px', minHeight: '70vh', backgroundColor: '#f9f9f9' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '15px', marginBottom: '15px' }}>
            <div>
              <h1 style={{ fontSize: '2rem', color: '#0B1C3F', margin: '0 0 10px 0' }}>
                ⏰ {t.timings}
              </h1>
              {hasChanges && (
                <p style={{ color: '#E6B325', margin: 0, fontWeight: '500' }}>
                  ⚠️ {t.unsavedChanges}
                </p>
              )}
            </div>
            {/* Current Temple Time */}
            <div style={{
              backgroundColor: '#0B1C3F',
              color: 'white',
              padding: '15px 25px',
              borderRadius: '8px',
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
            }}>
              <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '5px' }}>Current Temple Time</div>
              <IndiaTime style={{ fontSize: '1.5rem', fontWeight: 'bold', fontFamily: 'monospace' }} />
            </div>
          </div>
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

        {/* Timings Form */}
        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginBottom: '30px'
        }}>
          <h2 style={{ color: '#0B1C3F', marginBottom: '25px', marginTop: 0 }}>
            {t.weeklySchedule}
          </h2>

          {DAYS.map(day => {
            const dayData = timings[day] || { slots: [], notes: '' };
            return (
              <div
                key={day}
                style={{
                  marginBottom: '30px',
                  padding: '20px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '8px',
                  borderLeft: '4px solid #E6B325'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <h4 style={{
                    color: '#0B1C3F',
                    margin: 0,
                    fontSize: '18px',
                    fontWeight: '600'
                  }}>
                    {day}
                  </h4>
                  <button
                    onClick={() => addTimeSlot(day)}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#4CAF50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={e => e.target.style.opacity = '0.9'}
                    onMouseLeave={e => e.target.style.opacity = '1'}
                  >
                    ➕ {t.addSlot || 'Add Time Slot'}
                  </button>
                </div>

                {/* Notes Field */}
                <div style={{ marginBottom: '15px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '13px',
                    fontWeight: '500',
                    color: '#333'
                  }}>
                    📝 Notes (will be displayed on user page)
                  </label>
                  <input
                    type="text"
                    value={dayData.notes}
                    onChange={(e) => handleNotesChange(day, e.target.value)}
                    placeholder="e.g., Multiple Sessions, Regular Schedule, Extended Hours"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      backgroundColor: 'white'
                    }}
                  />
                </div>

                {dayData.slots.map((slot, index) => (
                  <div
                    key={slot.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr auto',
                      gap: '15px',
                      marginBottom: '15px',
                      padding: '15px',
                      backgroundColor: 'white',
                      borderRadius: '6px',
                      alignItems: 'end'
                    }}
                  >
                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontSize: '13px',
                        fontWeight: '500',
                        color: '#333'
                      }}>
                        {t.opening || 'Opening Time'}
                      </label>
                      <input
                        type="time"
                        value={slot.openTime?.substring(0, 5) || '09:00'}
                        onChange={(e) => handleTimeChange(day, slot.id, 'openTime', e.target.value)}
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
                      <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontSize: '13px',
                        fontWeight: '500',
                        color: '#333'
                      }}>
                        {t.closing || 'Closing Time'}
                      </label>
                      <input
                        type="time"
                        value={slot.closeTime?.substring(0, 5) || '17:00'}
                        onChange={(e) => handleTimeChange(day, slot.id, 'closeTime', e.target.value)}
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

                    <button
                      onClick={() => removeTimeSlot(day, slot.id)}
                      disabled={dayData.slots.length === 1}
                      style={{
                        padding: '10px 16px',
                        backgroundColor: dayData.slots.length === 1 ? '#ccc' : '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: dayData.slots.length === 1 ? 'not-allowed' : 'pointer',
                        fontSize: '14px',
                        fontWeight: '500',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={e => dayData.slots.length > 1 && (e.target.style.opacity = '0.9')}
                      onMouseLeave={e => dayData.slots.length > 1 && (e.target.style.opacity = '1')}
                    >
                      🗑️
                    </button>
                  </div>
                ))}

                {dayData.slots.length === 0 && (
                  <p style={{ color: '#999', textAlign: 'center', margin: '20px 0' }}>
                    No time slots. Click "Add Time Slot" to add one.
                  </p>
                )}
              </div>
            );
          })}

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '15px',
            justifyContent: 'flex-end',
            borderTop: '1px solid #eee',
            paddingTop: '20px',
            marginTop: '30px'
          }}>
            {hasChanges && (
              <button
                onClick={handleCancel}
                disabled={saving}
                style={{
                  padding: '12px 30px',
                  backgroundColor: '#f5f5f5',
                  color: '#333',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  fontWeight: '500',
                  transition: 'all 0.3s ease',
                  opacity: saving ? 0.6 : 1
                }}
                onMouseEnter={e => !saving && (e.target.style.backgroundColor = '#e8e8e8')}
                onMouseLeave={e => !saving && (e.target.style.backgroundColor = '#f5f5f5')}
              >
                {t.cancel}
              </button>
            )}
            <button
              onClick={handleSave}
              disabled={!hasChanges || saving}
              style={{
                padding: '12px 30px',
                backgroundColor: hasChanges ? '#0B1C3F' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: hasChanges && !saving ? 'pointer' : 'not-allowed',
                fontWeight: '500',
                transition: 'all 0.3s ease',
                opacity: !hasChanges || saving ? 0.6 : 1
              }}
              onMouseEnter={e => hasChanges && !saving && (e.target.style.opacity = '0.9')}
              onMouseLeave={e => hasChanges && !saving && (e.target.style.opacity = '1')}
            >
              {saving ? '💾 Saving...' : `💾 ${t.save}`}
            </button>
          </div>
        </div>

        {/* Info Box */}
        <div style={{
          backgroundColor: '#e3f2fd',
          border: '1px solid #90caf9',
          borderRadius: '8px',
          padding: '20px',
          color: '#1565c0'
        }}>
          <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6' }}>
            💡 <strong>Tip:</strong> You can add multiple time slots for each day (e.g., morning and evening shifts). Click "Add Time Slot" to create additional slots for any day.
          </p>
        </div>
      </div>
    </div>
  );
}
