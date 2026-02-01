import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { eventsAPI } from '../services/templeAPI';

// Helper function to display images (now using base64 from localStorage)
const getImageUrl = (imageData) => {
  if (!imageData) return null;
  
  // If it's already a data URL (base64)
  if (typeof imageData === 'string' && imageData.startsWith('data:')) {
    return imageData;
  }
  
  // If it's a URL string
  if (typeof imageData === 'string') {
    return imageData;
  }
  
  return null;
};

const translations = {
  en: {
    events: 'Events',
    addEvent: 'Add Event',
    editEvent: 'Edit Event',
    deleteEvent: 'Delete Event',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    create: 'Create',
    eventTitle: 'Event Title',
    date: 'Date',
    startTime: 'Start Time',
    endTime: 'End Time',
    location: 'Location',
    description: 'Description',
    category: 'Category',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    noEvents: 'No events',
    confirmDelete: 'Are you sure you want to delete this event?',
    accessDenied: 'Access Denied',
    adminOnly: 'Only admins can access this page',
    backToEvents: 'Back to Events',
    viewRegistrations: 'View Registrations',
    registrations: 'Registrations',
    noRegistrations: 'No registrations yet',
    familyGotram: 'Family Gotram',
    relation: 'Relation',
    rasi: 'Rasi',
    nakshatra: 'Nakshatra',
    phone: 'Phone',
    email: 'Email',
    address: 'Address',
    registeredOn: 'Registered On',
    totalRegistrations: 'Total Registrations',
    exportToCSV: 'Export to CSV',
    close: 'Close'
  },
  te: {
    events: 'ఈవెంట్‌లు',
    addEvent: 'ఈవెంట్‌ను జోడించండి',
    editEvent: 'ఈవెంట్‌ను సవరించండి',
    deleteEvent: 'ఈవెంట్‌ను తొలగించండి',
    save: 'సేవ్',
    cancel: 'రద్దు',
    delete: 'తొలగించండి',
    edit: 'సవరించండి',
    create: 'సృష్టించండి',
    eventTitle: 'ఈవెంట్‌ టైటిల్',
    date: 'తేదీ',
    startTime: 'ప్రారంభ సమయం',
    endTime: 'ముగింపు సమయం',
    location: 'ప్రదేశం',
    description: 'వివరణ',
    category: 'వర్గం',
    loading: 'లోడ్ చేస్తోంది...',
    error: 'లోపం',
    success: 'విజయం',
    noEvents: 'ఈవెంట్‌లు లేవు',
    confirmDelete: 'మీరు ఈ ఈవెంట్‌ను తొలగించాలనుకుంటున్నారా?',
    accessDenied: 'యాక్సెస్ నిరాకరించబడ్డారు',
    adminOnly: 'ఈ పేజీకి ప్రవేశించడానికి పరిపాలకులు మాత్రమే',
    backToEvents: 'ఈవెంట్‌లకు తిరిగి వెళ్లండి'
  },
  hi: {
    events: 'कार्यक्रम',
    addEvent: 'ईवेंट जोड़ें',
    editEvent: 'ईवेंट संपादित करें',
    deleteEvent: 'ईवेंट हटाएं',
    save: 'सहेजें',
    cancel: 'रद्द करें',
    delete: 'हटाएं',
    edit: 'संपादित करें',
    create: 'बनाएं',
    eventTitle: 'ईवेंट शीर्षक',
    date: 'तारीख',
    startTime: 'शुरुआत का समय',
    endTime: 'समाप्ति का समय',
    location: 'स्थान',
    description: 'विवरण',
    category: 'श्रेणी',
    loading: 'लोड हो रहा है...',
    error: 'त्रुटि',
    success: 'सफलता',
    noEvents: 'कोई ईवेंट नहीं',
    confirmDelete: 'क्या आप इस ईवेंट को हटाना चाहते हैं?',
    accessDenied: 'एक्सेस नकारा गया',
    adminOnly: 'केवल व्यवस्थापक इस पृष्ठ तक पहुंच सकते हैं',
    backToEvents: 'ईवेंट्स पर वापस जाएं'
  }
};

export default function EventsAdmin() {
  const { language } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const t = translations[language] || translations.en;

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    description: '',
    category: 'Festival',
    imageUrl: '',
    imageFile: null
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showRegistrationsModal, setShowRegistrationsModal] = useState(false);
  const [selectedEventRegistrations, setSelectedEventRegistrations] = useState(null);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      fetchEvents();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user?.role]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await eventsAPI.getAll();
      const eventsArray = Array.isArray(data) ? data : data?.data || [];
      
      // Process events to ensure all fields are properly mapped
      const processedEvents = eventsArray.map(event => ({
        ...event,
        title: event.eventName || event.title,
        date: event.eventDate || event.date,
        imageUrl: getImageUrl(event.photoUrl || event.imageUrl || event.image)
      }));
      
      console.log('Loaded events from localStorage:', processedEvents);
      setEvents(processedEvents);
      setError(null);
    } catch (err) {
      console.error('Error loading events:', err);
      setError('Failed to load events: ' + err.message);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const getEventRegistrations = (eventId) => {
    try {
      const registrations = JSON.parse(localStorage.getItem('temple_registrations') || '[]');
      return registrations.filter(reg => reg.eventId === eventId);
    } catch (error) {
      console.error('Error loading registrations:', error);
      return [];
    }
  };

  const handleViewRegistrations = (event) => {
    const registrations = getEventRegistrations(event.id);
    setSelectedEventRegistrations({
      event: event,
      registrations: registrations
    });
    setShowRegistrationsModal(true);
  };

  const exportToCSV = () => {
    if (!selectedEventRegistrations || selectedEventRegistrations.registrations.length === 0) {
      alert('No registrations to export');
      return;
    }

    const { event, registrations } = selectedEventRegistrations;
    
    // Create CSV header
    let csv = 'Event Name,Registration Date,Family Gotram,Name,Surname,Relation,Rasi,Nakshatra,Phone,Email,Address\n';
    
    // Add data rows
    registrations.forEach(reg => {
      const regDate = new Date(reg.createdAt).toLocaleDateString();
      reg.members.forEach(member => {
        csv += '"' + event.title + '","' + regDate + '","' + (reg.familyGotram || '') + '","' + member.name + '","' + member.surname + '","' + member.relation + '","' + (member.rasi || '') + '","' + (member.nakshatra || '') + '","' + member.phoneNo + '","' + member.email + '","' + (member.address || '') + '"\n';
      });
    });

    // Create download link
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const filename = event.title.replace(/\s+/g, '_') + '_registrations.csv';
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate it's an image file
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }
      
      // Convert all images to JPEG for backend compatibility
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          // Create canvas and draw image
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          
          // Convert to JPEG blob (backend supports JPEG)
          canvas.toBlob(
            (blob) => {
              if (blob) {
                // Create a new File object from the blob
                const fileName = 'image-' + Date.now() + '.jpg';
                const jpegFile = new File([blob], fileName, { type: 'image/jpeg' });
                
                // Also create preview
                const previewReader = new FileReader();
                previewReader.onloadend = () => {
                  setFormData(prev => ({
                    ...prev,
                    imageFile: jpegFile,
                    imageUrl: previewReader.result // Store base64 for preview
                  }));
                };
                previewReader.readAsDataURL(blob);
              } else {
                console.error('Failed to convert image to blob');
                alert('Failed to process image. Please try another image.');
              }
            },
            'image/jpeg',
            0.85 // Quality 85%
          );
        };
        img.onerror = () => {
          console.error('Failed to load image');
          alert('Failed to load image. Please try another image.');
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Prepare FormData for multipart submission when image is present
      let submitData;
      
      if (formData.imageFile) {
        // Use FormData for multipart/form-data with proper structure
        // Backend expects: event (JSON) and photo (file)
        submitData = new FormData();
        
        // Create the event JSON object matching backend field names
        const eventData = {
          eventName: formData.title,
          description: formData.description,
          eventDate: formData.date,
          startTime: formData.startTime ? (formData.startTime.split(':').length === 2 ? formData.startTime + ':00' : formData.startTime) : null,
          endTime: formData.endTime ? (formData.endTime.split(':').length === 2 ? formData.endTime + ':00' : formData.endTime) : null,
          location: formData.location,
          category: formData.category,
          status: 'Upcoming'
        };
        
        // Append event data as JSON blob with proper content type
        const eventBlob = new Blob([JSON.stringify(eventData)], {
          type: 'application/json'
        });
        submitData.append('event', eventBlob);
        
        // Append photo file with correct part name and ensure JPEG mime type
        submitData.append('photo', formData.imageFile, formData.imageFile.name);
        
        console.log('Submitting with image:', {
          operation: editingId ? 'update' : 'create',
          imageFile: formData.imageFile.name,
          imageType: formData.imageFile.type,
          imageSize: formData.imageFile.size,
          eventData: eventData
        });
      } else {
        // Send as JSON when no new file (for updates without image change)
        submitData = {
          eventName: formData.title,
          description: formData.description,
          eventDate: formData.date,
          startTime: formData.startTime ? (formData.startTime.split(':').length === 2 ? formData.startTime + ':00' : formData.startTime) : null,
          endTime: formData.endTime ? (formData.endTime.split(':').length === 2 ? formData.endTime + ':00' : formData.endTime) : null,
          location: formData.location,
          category: formData.category,
          status: 'Upcoming'
        };
        
        console.log('Submitting without image:', {
          operation: editingId ? 'update' : 'create',
          data: submitData
        });
      }
      
      if (editingId) {
        const result = await eventsAPI.update(editingId, submitData);
        console.log('Update response:', result);
      } else {
        const result = await eventsAPI.create(submitData);
        console.log('Create response:', result);
      }
      fetchEvents();
      resetForm();
    } catch (err) {
      console.error('Submit error:', err);
      console.error('Error details:', {
        response: err.response?.data,
        status: err.response?.status,
        headers: err.response?.headers
      });
      alert(err.response?.data?.message || err.message || t.error);
    }
  };

  const handleEdit = (event) => {
    setFormData({
      title: event.title || '',
      date: event.date || '',
      startTime: event.startTime || '',
      endTime: event.endTime || '',
      location: event.location || '',
      description: event.description || '',
      category: event.category || 'Festival',
      imageUrl: event.imageUrl || '',
      imageFile: null
    });
    setEditingId(event.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await eventsAPI.delete(id);
      fetchEvents();
      setShowDeleteConfirm(null);
    } catch (err) {
      alert(err.response?.data?.message || t.error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      date: '',
      startTime: '',
      endTime: '',
      location: '',
      description: '',
      category: 'Festival',
      imageUrl: '',
      imageFile: null
    });
    setEditingId(null);
    setShowForm(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const parts = timeString.split(':');
    const hours = parseInt(parts[0]);
    const minutes = parts[1] || '00';
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHour = hours % 12 || 12;
    return displayHour + ':' + minutes + ' ' + ampm;
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
        <a href="/events" style={{
          display: 'inline-block',
          padding: '10px 20px',
          backgroundColor: '#0B1C3F',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '4px',
          fontWeight: '500'
        }}>
          {t.backToEvents}
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
            {t.events} {t.events === 'Management'}
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
            + {t.addEvent}
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
              {editingId ? t.editEvent : t.addEvent}
            </h2>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                  {t.eventTitle}
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
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
                    {t.date}
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
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
                    {t.category}
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option>Festival</option>
                    <option>Religious</option>
                    <option>Cultural</option>
                    <option>Community</option>
                    <option>Celebration</option>
                  </select>
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
                    {t.startTime}
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
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
                    {t.endTime}
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
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
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                  {t.location}
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
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

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                  {t.description}
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

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                  📸 Event Photo / Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  title="Upload any image format: JPG, PNG, WebP, GIF, BMP, TIFF, SVG, etc."
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px dashed #E6B325',
                    borderRadius: '4px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    cursor: 'pointer'
                  }}
                />
                <p style={{ fontSize: '11px', color: '#999', marginTop: '5px', marginBottom: '10px' }}>
                  ✓ Supports all image formats: JPG, JPEG, PNG, WebP, GIF, BMP, TIFF, SVG, ICO, etc.
                </p>
                {formData.imageUrl && (
                  <div style={{ marginTop: '10px' }}>
                    <p style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>Preview:</p>
                    <img 
                      src={formData.imageUrl} 
                      alt="Event preview" 
                      style={{
                        maxWidth: '100%',
                        maxHeight: '200px',
                        borderRadius: '4px',
                        border: '1px solid #ddd'
                      }}
                    />
                  </div>
                )}
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

        {/* Events List */}
        {events.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            backgroundColor: 'white',
            borderRadius: '8px'
          }}>
            <p style={{ fontSize: '16px', color: '#999' }}>{t.noEvents}</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '25px'
          }}>
            {events.map(event => (
              <div
                key={event.id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  transition: 'transform 0.3s ease'
                }}
              >
                {/* Event Image */}
                {event.imageUrl && (
                  <div style={{ 
                    width: '100%', 
                    height: '200px', 
                    overflow: 'hidden',
                    backgroundColor: '#f5f5f5'
                  }}>
                    <img 
                      src={event.imageUrl} 
                      alt={event.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                
                <div style={{
                  padding: '20px',
                  backgroundColor: 'linear-gradient(135deg, #0B1C3F 0%, #112A57 100%)',
                  color: 'white'
                }}>
                  <h3 style={{ margin: '0 0 5px 0' }}>{event.title}</h3>
                  <p style={{ margin: 0, fontSize: '12px', opacity: 0.9 }}>
                    {event.category || 'Event'}
                  </p>
                </div>

                <div style={{ padding: '20px' }}>
                  <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px' }}>
                    📅 {formatDate(event.date)}
                  </p>
                  <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px' }}>
                    🕐 {formatTime(event.startTime)}
                    {event.endTime && ' - ' + formatTime(event.endTime)}
                  </p>
                  <p style={{ margin: '0 0 15px 0', color: '#666', fontSize: '14px' }}>
                    📍 {event.location}
                  </p>
                  <p style={{ margin: '0 0 20px 0', color: '#666', fontSize: '13px', lineHeight: '1.4' }}>
                    {event.description?.substring(0, 100)}...
                  </p>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => handleEdit(event)}
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
                      onClick={() => setShowDeleteConfirm(event.id)}
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
                    <button
                      onClick={() => handleViewRegistrations(event)}
                      style={{
                        flex: 1,
                        padding: '10px',
                        backgroundColor: '#0B1C3F',
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
                      {t.viewRegistrations}
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
                {t.deleteEvent}
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

        {/* Registrations Modal */}
        {showRegistrationsModal && selectedEventRegistrations && (
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
            zIndex: 1000,
            padding: '20px'
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '30px',
              maxWidth: '900px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}>
              <h3 style={{ color: '#0B1C3F', marginBottom: '10px', marginTop: 0 }}>
                {t.registrations} - {selectedEventRegistrations.event.title}
              </h3>
              <p style={{ color: '#666', marginBottom: '20px', fontSize: '14px' }}>
                {t.totalRegistrations}: {selectedEventRegistrations.registrations.reduce((acc, reg) => acc + (reg.members?.length || 0), 0)} people
              </p>
              
              {selectedEventRegistrations.registrations.length === 0 ? (
                <p style={{ color: '#666', marginBottom: '25px', textAlign: 'center', padding: '40px' }}>
                  {t.noRegistrations}
                </p>
              ) : (
                <div style={{ maxHeight: '500px', overflowY: 'auto', marginBottom: '20px' }}>
                  {selectedEventRegistrations.registrations.map((reg, regIndex) => (
                    <div key={regIndex} style={{
                      backgroundColor: '#f9f9f9',
                      padding: '20px',
                      borderRadius: '8px',
                      marginBottom: '15px',
                      border: '1px solid #e0e0e0'
                    }}>
                      <div style={{ 
                        marginBottom: '15px', 
                        paddingBottom: '10px', 
                        borderBottom: '2px solid #E6B325',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <div>
                          <span style={{ fontWeight: 'bold', color: '#0B1C3F' }}>
                            {t.familyGotram}: 
                          </span>
                          <span style={{ marginLeft: '10px', color: '#666' }}>
                            {reg.familyGotram || 'Not specified'}
                          </span>
                        </div>
                        <div style={{ fontSize: '12px', color: '#999' }}>
                          {t.registeredOn}: {new Date(reg.createdAt).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                      
                      {reg.members && reg.members.map((member, memberIndex) => (
                        <div key={memberIndex} style={{
                          backgroundColor: 'white',
                          padding: '15px',
                          borderRadius: '6px',
                          marginBottom: '10px',
                          border: '1px solid #ddd'
                        }}>
                          <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '10px',
                            fontSize: '13px'
                          }}>
                            <div>
                              <strong>Name:</strong> {member.name} {member.surname}
                            </div>
                            <div>
                              <strong>{t.relation}:</strong> {member.relation}
                            </div>
                            <div>
                              <strong>{t.rasi}:</strong> {member.rasi || 'N/A'}
                            </div>
                            <div>
                              <strong>{t.nakshatra}:</strong> {member.nakshatra || 'N/A'}
                            </div>
                            <div>
                              <strong>{t.phone}:</strong> {member.phoneNo}
                            </div>
                            <div>
                              <strong>{t.email}:</strong> {member.email}
                            </div>
                            {member.address && (
                              <div style={{ gridColumn: '1 / -1' }}>
                                <strong>{t.address}:</strong> {member.address}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
              
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                {selectedEventRegistrations.registrations.length > 0 && (
                  <button
                    onClick={exportToCSV}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#4caf50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: '500',
                      transition: 'all 0.3s ease',
                      fontSize: '14px'
                    }}
                    onMouseEnter={e => e.target.style.opacity = '0.9'}
                    onMouseLeave={e => e.target.style.opacity = '1'}
                  >
                    📥 {t.exportToCSV}
                  </button>
                )}
                <button
                  onClick={() => setShowRegistrationsModal(false)}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#f5f5f5',
                    color: '#333',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: '500',
                    transition: 'all 0.3s ease',
                    fontSize: '14px'
                  }}
                  onMouseEnter={e => e.target.style.backgroundColor = '#e8e8e8'}
                  onMouseLeave={e => e.target.style.backgroundColor = '#f5f5f5'}
                >
                  {t.close}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
