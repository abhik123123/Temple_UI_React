import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { timingsAPI } from '../services/templeAPI';

const translations = {
  en: {
    timings: 'Temple Timings',
    weeklySchedule: 'Weekly Schedule',
    save: 'Save',
    cancel: 'Cancel',
    opening: 'Opening Time',
    closing: 'Closing Time',
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday',
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
    monday: 'సోమవారం',
    tuesday: 'మంగళవారం',
    wednesday: 'బుధవారం',
    thursday: 'గురువారం',
    friday: 'శుక్రవారం',
    saturday: 'శనివారం',
    sunday: 'ఆదివారం',
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
    monday: 'सोमवार',
    tuesday: 'मंगलवार',
    wednesday: 'बुधवार',
    thursday: 'गुरुवार',
    friday: 'शुक्रवार',
    saturday: 'शनिवार',
    sunday: 'रविवार',
    loading: 'लोड हो रहा है...',
    error: 'त्रुटि',
    success: 'समय सफलतापूर्वक सहेजे गए!',
    unsavedChanges: 'आपके पास अनसेव किए गए परिवर्तन हैं',
    accessDenied: 'एक्सेस नकारा गया',
    adminOnly: 'केवल व्यवस्थापक इस पृष्ठ तक पहुंच सकते हैं',
    backToHome: 'होम पर वापस जाएं'
  }
};

// Mock data
const MOCK_TIMINGS = {
  monday: { open: '06:00', close: '21:00' },
  tuesday: { open: '06:00', close: '21:00' },
  wednesday: { open: '06:00', close: '21:00' },
  thursday: { open: '06:00', close: '21:00' },
  friday: { open: '06:00', close: '21:00' },
  saturday: { open: '06:00', close: '21:00' },
  sunday: { open: '06:00', close: '21:00' }
};

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export default function TimingsAdmin() {
  const { language } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const t = translations[language] || translations.en;

  const [timings, setTimings] = useState(MOCK_TIMINGS);
  const [originalTimings, setOriginalTimings] = useState(MOCK_TIMINGS);
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
      const data = await timingsAPI.getAll();
      if (data) {
        const timingsData = Array.isArray(data) ? data : data?.data || MOCK_TIMINGS;
        setTimings(timingsData);
        setOriginalTimings(timingsData);
      }
      setError(null);
    } catch (err) {
      console.warn('Backend not available, using mock data:', err.message);
      setTimings(MOCK_TIMINGS);
      setOriginalTimings(MOCK_TIMINGS);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const handleTimeChange = (day, field, value) => {
    setTimings(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
    setHasChanges(JSON.stringify(timings) !== JSON.stringify(originalTimings));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      for (const [day, timing] of Object.entries(timings)) {
        // Ensure time values have seconds component (HH:mm:ss format)
        const formattedTiming = {
          open: timing.open ? (timing.open.split(':').length === 2 ? timing.open + ':00' : timing.open) : null,
          close: timing.close ? (timing.close.split(':').length === 2 ? timing.close + ':00' : timing.close) : null
        };
        await timingsAPI.update(day, formattedTiming);
      }
      setOriginalTimings(timings);
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
    setTimings(originalTimings);
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
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ fontSize: '2rem', color: '#0B1C3F', margin: '0 0 10px 0' }}>
            ⏰ {t.timings}
          </h1>
          {hasChanges && (
            <p style={{ color: '#E6B325', margin: 0, fontWeight: '500' }}>
              ⚠️ {t.unsavedChanges}
            </p>
          )}
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

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '25px',
            marginBottom: '30px'
          }}>
            {DAYS.map(day => (
              <div
                key={day}
                style={{
                  padding: '20px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '8px',
                  borderLeft: '4px solid #E6B325'
                }}
              >
                <h4 style={{
                  color: '#0B1C3F',
                  margin: '0 0 15px 0',
                  textTransform: 'capitalize',
                  fontSize: '16px',
                  fontWeight: '600'
                }}>
                  {t[day]}
                </h4>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '13px',
                    fontWeight: '500',
                    color: '#333'
                  }}>
                    {t.opening}
                  </label>
                  <input
                    type="time"
                    value={timings[day]?.open || '06:00'}
                    onChange={(e) => handleTimeChange(day, 'open', e.target.value)}
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

                <div style={{ marginBottom: '10px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '13px',
                    fontWeight: '500',
                    color: '#333'
                  }}>
                    {t.closing}
                  </label>
                  <input
                    type="time"
                    value={timings[day]?.close || '21:00'}
                    onChange={(e) => handleTimeChange(day, 'close', e.target.value)}
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

                <p style={{
                  color: '#666',
                  fontSize: '12px',
                  margin: '10px 0 0 0',
                  padding: '10px',
                  backgroundColor: 'white',
                  borderRadius: '4px',
                  textAlign: 'center'
                }}>
                  {timings[day]?.open && timings[day]?.close ? 
                    `${formatTime(timings[day].open)} - ${formatTime(timings[day].close)}` 
                    : 'No timing set'
                  }
                </p>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '15px',
            justifyContent: 'flex-end',
            borderTop: '1px solid #eee',
            paddingTop: '20px'
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
            💡 <strong>Tip:</strong> Set the opening and closing times for each day of the week. These timings will be displayed to visitors on the temple website.
          </p>
        </div>
      </div>
    </div>
  );
}
