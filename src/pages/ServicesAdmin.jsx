import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { getAllServices, addService, updateService, deleteService } from '../services/servicesData';

const translations = {
  en: {
    services: 'Services',
    addService: 'Add Service',
    editService: 'Edit Service',
    deleteService: 'Delete Service',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    serviceName: 'Service Name',
    description: 'Description',
    price: 'Price',
    icon: 'Icon/Image',
    iconHelp: 'Upload an image or enter emoji',
    uploadImage: 'Upload Image',
    currentImage: 'Current Image',
    removeImage: 'Remove Image',
    orUseEmoji: 'Or use emoji',
    details: 'Details (one per line)',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    noServices: 'No services',
    confirmDelete: 'Are you sure you want to delete this service?',
    accessDenied: 'Access Denied',
    adminOnly: 'Only admins can access this page',
    backToServices: 'Back to Services',
    detailsPlaceholder: 'Enter each detail on a new line'
  },
  te: {
    services: 'సేవలు',
    addService: 'సేవను జోడించండి',
    editService: 'సేవను సవరించండి',
    deleteService: 'సేవను తొలగించండి',
    save: 'సేవ్',
    cancel: 'రద్దు',
    delete: 'తొలగించండి',
    edit: 'సవరించండి',
    serviceName: 'సేవ పేరు',
    description: 'వివరణ',
    price: 'ధర',
    icon: 'చిహ్నం (ఎమోజీ)',
    details: 'వివరాలు (ప్రతి లైన్‌కు ఒకటి)',
    loading: 'లోడ్ చేస్తోంది...',
    error: 'లోపం',
    success: 'విజయం',
    noServices: 'సేవలు లేవు',
    confirmDelete: 'మీరు ఈ సేవను తొలగించాలనుకుంటున్నారా?',
    accessDenied: 'యాక్సెస్ నిరాకరించబడ్డారు',
    adminOnly: 'ఈ పేజీకి ప్రవేశించడానికి పరిపాలకులు మాత్రమే',
    backToServices: 'సేవలకు తిరిగి వెళ్లండి',
    detailsPlaceholder: 'ప్రతి వివరాన్ని కొత్త లైన్‌లో నమోదు చేయండి'
  },
  hi: {
    services: 'सेवाएं',
    addService: 'सेवा जोड़ें',
    editService: 'सेवा संपादित करें',
    deleteService: 'सेवा हटाएं',
    save: 'सहेजें',
    cancel: 'रद्द करें',
    delete: 'हटाएं',
    edit: 'संपादित करें',
    serviceName: 'सेवा का नाम',
    description: 'विवरण',
    price: 'कीमत',
    icon: 'आइकन (इमोजी)',
    details: 'विवरण (प्रति पंक्ति एक)',
    loading: 'लोड हो रहा है...',
    error: 'त्रुटि',
    success: 'सफलता',
    noServices: 'कोई सेवा नहीं',
    confirmDelete: 'क्या आप इस सेवा को हटाना चाहते हैं?',
    accessDenied: 'एक्सेस नकारा गया',
    adminOnly: 'केवल व्यवस्थापक इस पृष्ठ तक पहुंच सकते हैं',
    backToServices: 'सेवाओं पर वापस जाएं',
    detailsPlaceholder: 'प्रत्येक विवरण को नई पंक्ति में दर्ज करें'
  }
};

export default function ServicesAdmin() {
  const { language } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const t = translations[language] || translations.en;

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    icon: '🙏',
    details: ''
  });
  const [originalData, setOriginalData] = useState(null); // Store original data for comparison
  const [imagePreview, setImagePreview] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      fetchServices();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user?.role]);

  const fetchServices = () => {
    try {
      setLoading(true);
      const data = getAllServices();
      setServices(data);
    } catch (err) {
      console.error('Error loading services:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setFormData(prev => ({ ...prev, icon: base64String }));
        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, icon: '🙏' }));
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert details textarea to array
      const detailsArray = formData.details
        .split('\n')
        .map(d => d.trim())
        .filter(d => d);

      const serviceData = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        icon: formData.icon || '🙏',
        details: detailsArray
      };

      // Check if editing and nothing has changed
      if (editingId && originalData) {
        const originalDetailsArray = originalData.details
          .split('\n')
          .map(d => d.trim())
          .filter(d => d);
        
        const hasChanges = 
          formData.name !== originalData.name ||
          formData.description !== originalData.description ||
          formData.price !== originalData.price ||
          formData.icon !== originalData.icon ||
          JSON.stringify(detailsArray) !== JSON.stringify(originalDetailsArray);

        if (!hasChanges) {
          alert('⚠️ No changes detected. Please modify the service details before saving.');
          return;
        }
      }

      console.log('editingId:', editingId);
      console.log('serviceData:', serviceData);

      let result;
      if (editingId) {
        console.log('Updating service with ID:', editingId);
        result = updateService(editingId, serviceData);
        console.log('Update result:', result);
      } else {
        console.log('Adding new service');
        result = addService(serviceData);
        console.log('Add result:', result);
      }
      
      // Force immediate refresh with the returned result
      const updatedServices = getAllServices();
      console.log('Updated services after save:', updatedServices);
      setServices(updatedServices);
      
      resetForm();
      alert(t.success);
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      alert(t.error + ': ' + err.message);
    }
  };

  const handleEdit = (service) => {
    console.log('Editing service:', service); // Debug log
    console.log('Service ID:', service.id, 'Type:', typeof service.id); // Check ID type
    
    if (!service.id) {
      console.error('Service has no ID!', service);
      alert('Error: Service has no ID. Cannot edit.');
      return;
    }
    
    const detailsString = Array.isArray(service.details) ? service.details.join('\n') : '';
    setEditingId(service.id); // Set editingId FIRST
    setFormData({
      name: service.name || '',
      description: service.description || '',
      price: service.price || '',
      icon: service.icon || '🙏',
      details: detailsString
    });
    // Store original data for comparison
    setOriginalData({
      name: service.name || '',
      description: service.description || '',
      price: service.price || '',
      icon: service.icon || '🙏',
      details: detailsString
    });
    // Set image preview if icon is a data URL or image path
    if (service.icon && (service.icon.startsWith('data:') || service.icon.startsWith('http') || service.icon.startsWith('/images'))) {
      setImagePreview(service.icon);
    } else {
      setImagePreview(null);
    }
    setShowForm(true);
    console.log('editingId set to:', service.id); // Debug log
  };

  const handleDelete = async (id) => {
    try {
      deleteService(id);
      fetchServices();
      setShowDeleteConfirm(null);
      alert(t.success);
    } catch (err) {
      alert(t.error + ': ' + err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      icon: '🙏',
      details: ''
    });
    setImagePreview(null);
    setEditingId(null);
    setOriginalData(null); // Clear original data
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
        <a href="/services" style={{
          display: 'inline-block',
          padding: '10px 20px',
          backgroundColor: '#0B1C3F',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '4px',
          fontWeight: '500'
        }}>
          {t.backToServices}
        </a>
      </div>
    );
  }

  const isImageIcon = (icon) => {
    return icon && (icon.startsWith('data:') || icon.startsWith('http') || icon.startsWith('/images'));
  };

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
            {t.services} Management
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
            + {t.addService}
          </button>
        </div>

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
                {editingId ? t.editService : t.addService}
              </h2>

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                    {t.serviceName}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
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
                      {t.price}
                    </label>
                    <input
                      type="text"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      placeholder="₹500 or Free"
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

                {/* Image/Icon Upload Section */}
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                    {t.icon}
                    <span style={{ fontSize: '12px', color: '#666', fontWeight: 'normal', marginLeft: '8px' }}>
                      ({t.iconHelp})
                    </span>
                  </label>
                  
                  {/* Image Preview */}
                  {imagePreview && (
                    <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '80px',
                        height: '80px',
                        border: '2px solid #ddd',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#f5f5f5'
                      }}>
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#d32f2f',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: '500'
                        }}
                      >
                        {t.removeImage}
                      </button>
                    </div>
                  )}

                  {/* File Upload */}
                  <div>
                    <label style={{
                      display: 'inline-block',
                      padding: '10px 20px',
                      backgroundColor: '#0B1C3F',
                      color: 'white',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}>
                      📤 {t.uploadImage}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                    {t.description}
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows="3"
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
          </div>
        )}

        {/* Services List */}
        {services.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            backgroundColor: 'white',
            borderRadius: '8px'
          }}>
            <p style={{ fontSize: '16px', color: '#999' }}>{t.noServices}</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '25px'
          }}>
            {services.map(service => (
              <div
                key={service.id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                }}
              >
                {/* Service Image/Icon */}
                {isImageIcon(service.icon) ? (
                  <div style={{ 
                    width: '100%', 
                    height: '220px', 
                    overflow: 'hidden',
                    backgroundColor: '#f5e6d3'
                  }}>
                    <img 
                      src={service.icon} 
                      alt={service.name}
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
                    backgroundColor: '#f5e6d3',
                    color: '#0B1C3F'
                  }}>
                    {service.icon || '🙏'}
                  </div>
                )}

                <div style={{ padding: '20px' }}>
                  <h3 style={{ 
                    margin: '0 0 10px 0',
                    color: '#0B1C3F',
                    fontSize: '1.3rem',
                    fontWeight: '600'
                  }}>
                    {service.name}
                  </h3>

                  <p style={{ margin: '0 0 10px 0', color: '#E6B325', fontSize: '18px', fontWeight: 'bold' }}>
                    💰 {service.price}
                  </p>
                  <p style={{ margin: '0 0 15px 0', color: '#666', fontSize: '14px', lineHeight: '1.4' }}>
                    {service.description}
                  </p>
                  
                  {service.details && service.details.length > 0 && (
                    <div style={{
                      backgroundColor: '#f8f9fa',
                      padding: '10px',
                      borderRadius: '4px',
                      marginBottom: '15px'
                    }}>
                      <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px' }}>
                        {service.details.map((detail, idx) => (
                          <li key={idx} style={{ marginBottom: '5px', color: '#555' }}>
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => handleEdit(service)}
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
                      onClick={() => setShowDeleteConfirm(service.id)}
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
                {t.deleteService}
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
