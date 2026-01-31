import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { eventsAPI, servicesAPI, staffAPI, timingsAPI, imagesAPI, donorsAPI } from '../services/templeAPI';

/**
 * AdminDashboard.jsx - Complete admin management interface
 * Tabs: Dashboard, Home Images, Events, Services, Staff, Timings, Donors
 * All CRUD operations with backend integration
 */
export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [donors, setDonors] = useState([]);
  const [donorsLoading, setDonorsLoading] = useState(true);
  const [donorsError, setDonorsError] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  // ====== HOME IMAGES STATES ======
  const [homeImages, setHomeImages] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imageTitle, setImageTitle] = useState('');
  const [imageUploading, setImageUploading] = useState(false);
  const [imageError, setImageError] = useState('');
  const [imagesLoading, setImagesLoading] = useState(true);

  // ====== EVENTS STATES ======
  const [events_local, setEventsLocal] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: ''
  });
  const [eventImageFile, setEventImageFile] = useState(null);
  const [editingEventId, setEditingEventId] = useState(null);

  // ====== SERVICES STATES ======
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    icon: '🙏',
    category: ''
  });
  const [serviceImageFile, setServiceImageFile] = useState(null);
  const [editingServiceId, setEditingServiceId] = useState(null);

  // ====== STAFF STATES ======
  const [staff, setStaff] = useState([]);
  const [staffLoading, setStaffLoading] = useState(true);
  const [newStaff, setNewStaff] = useState({
    name: '',
    position: '',
    designation: '',
    email: '',
    phone: '',
    bio: ''
  });
  const [staffImageFile, setStaffImageFile] = useState(null);
  const [editingStaffId, setEditingStaffId] = useState(null);

  // ====== TIMINGS STATES ======
  const [timings, setTimings] = useState({
    monday: { open: '06:00', close: '21:00' },
    tuesday: { open: '06:00', close: '21:00' },
    wednesday: { open: '06:00', close: '21:00' },
    thursday: { open: '06:00', close: '21:00' },
    friday: { open: '06:00', close: '21:00' },
    saturday: { open: '06:00', close: '21:00' },
    sunday: { open: '06:00', close: '21:00' }
  });
  const [timingsLoading, setTimingsLoading] = useState(true);

  // ====== FETCH DATA ON MOUNT ======
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      // Fetch donors
      const donorsRes = await donorsAPI.getAll();
      setDonors(Array.isArray(donorsRes.data) ? donorsRes.data : donorsRes.data?.data || []);
      
      // Fetch events
      const eventsRes = await eventsAPI.getAll();
      setEventsLocal(Array.isArray(eventsRes.data) ? eventsRes.data : eventsRes.data?.data || []);
      
      // Fetch services
      const servicesRes = await servicesAPI.getAll();
      setServices(Array.isArray(servicesRes.data) ? servicesRes.data : servicesRes.data?.data || []);
      
      // Fetch staff
      const staffRes = await staffAPI.getAll();
      setStaff(Array.isArray(staffRes.data) ? staffRes.data : staffRes.data?.data || []);
      
      // Fetch images
      const imagesRes = await imagesAPI.getAll();
      setHomeImages(Array.isArray(imagesRes.data) ? imagesRes.data : imagesRes.data?.data || []);
      
      // Fetch timings
      const timingsRes = await timingsAPI.getAll();
      setTimings(timingsRes.data || timings);
    } catch (error) {
      console.error('Error fetching data:', error);
      setDonorsError('Failed to load data');
    } finally {
      setDonorsLoading(false);
      setEventsLoading(false);
      setServicesLoading(false);
      setStaffLoading(false);
      setImagesLoading(false);
      setTimingsLoading(false);
    }
  };

  const stats = useMemo(() => {
    const totalDonations = donors.reduce((sum, donor) => sum + (parseFloat(donor.amount) || 0), 0);
    return {
      totalEvents: events_local?.length || 0,
      totalDonors: donors?.length || 0,
      totalDonations: totalDonations.toFixed(2),
      averageDonation: donors.length ? (totalDonations / donors.length).toFixed(2) : '0.00',
      totalServices: services.length,
      totalStaff: staff.length
    };
  }, [events_local, donors, services, staff]);

  // ====== DELETE HANDLERS ======
  const handleDeleteEvent = async (eventId) => {
    try {
      await eventsAPI.delete(eventId);
      setEventsLocal(events_local.filter(e => e.id !== eventId));
      setShowDeleteConfirm(null);
    } catch (err) {
      alert('Failed to delete event: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteDonor = async (donorId) => {
    try {
      await donorsAPI.delete(donorId);
      setDonors(donors.filter(d => d.id !== donorId));
      setShowDeleteConfirm(null);
    } catch (err) {
      alert('Failed to delete donor: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteImage = async (imageId) => {
    try {
      await imagesAPI.delete(imageId);
      setHomeImages(homeImages.filter(img => img.id !== imageId));
      setShowDeleteConfirm(null);
    } catch (err) {
      alert('Failed to delete image: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteService = async (serviceId) => {
    try {
      await servicesAPI.delete(serviceId);
      setServices(services.filter(s => s.id !== serviceId));
      setShowDeleteConfirm(null);
    } catch (err) {
      alert('Failed to delete service: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteStaff = async (staffId) => {
    try {
      await staffAPI.delete(staffId);
      setStaff(staff.filter(s => s.id !== staffId));
      setShowDeleteConfirm(null);
    } catch (err) {
      alert('Failed to delete staff: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleAddEvent = async () => {
    if (!newEvent.title || !newEvent.date) {
      alert('Please fill in title and date');
      return;
    }
    try {
      if (editingEventId) {
        await eventsAPI.update(editingEventId, newEvent);
        setEventsLocal(events_local.map(e => e.id === editingEventId ? { ...newEvent, id: editingEventId } : e));
        setEditingEventId(null);
      } else {
        const res = await eventsAPI.create(newEvent);
        setEventsLocal([...events_local, res.data]);
      }
      setNewEvent({ title: '', date: '', time: '', location: '', description: '' });
    } catch (err) {
      alert('Failed to save event: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleAddService = async () => {
    if (!newService.name) {
      alert('Please fill in service name');
      return;
    }
    try {
      if (editingServiceId) {
        await servicesAPI.update(editingServiceId, newService);
        setServices(services.map(s => s.id === editingServiceId ? { ...newService, id: editingServiceId } : s));
        setEditingServiceId(null);
      } else {
        const res = await servicesAPI.create(newService);
        setServices([...services, res.data]);
      }
      setNewService({ name: '', description: '', icon: '🙏', category: '' });
    } catch (err) {
      alert('Failed to save service: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleAddStaff = async () => {
    if (!newStaff.name) {
      alert('Please fill in staff name');
      return;
    }
    try {
      if (editingStaffId) {
        await staffAPI.update(editingStaffId, newStaff);
        setStaff(staff.map(s => s.id === editingStaffId ? { ...newStaff, id: editingStaffId } : s));
        setEditingStaffId(null);
      } else {
        const res = await staffAPI.create(newStaff);
        setStaff([...staff, res.data]);
      }
      setNewStaff({ name: '', position: '', designation: '', email: '', phone: '', bio: '' });
    } catch (err) {
      alert('Failed to save staff: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      setImageError('Please select an image');
      return;
    }
    
    try {
      setImageUploading(true);
      const formData = new FormData();
      formData.append('file', imageFile);
      formData.append('title', imageTitle || imageFile.name);
      
      const res = await imagesAPI.upload(formData);
      setHomeImages([...homeImages, res.data]);
      setImageFile(null);
      setImageTitle('');
      setImageError('');
    } catch (err) {
      setImageError('Failed to upload image: ' + (err.response?.data?.message || err.message));
    } finally {
      setImageUploading(false);
    }
  };

  const handleSaveTimings = async () => {
    try {
      for (const [day, timing] of Object.entries(timings)) {
        await timingsAPI.update(day, timing);
      }
      alert('Timings saved successfully!');
    } catch (err) {
      alert('Failed to save timings: ' + (err.response?.data?.message || err.message));
    }
  };

  const formatDate = (value) => {
    if (!value) return '';
    return new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (value) => {
    if (!value) return '';
    const [hours, minutes = '00'] = value.split(':');
    const hour = parseInt(hours, 10);
    const suffix = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${suffix}`;
  };

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="page" style={{ padding: '2rem', textAlign: 'center' }}>
        <h2 style={{ color: '#0B1C3F' }}>🔐 Access Denied</h2>
        <p style={{ color: '#666' }}>You must be logged in as an admin to access this page.</p>
      </div>
    );
  }

  const tabButtonStyle = (isActive) => ({
    padding: '10px 20px',
    backgroundColor: isActive ? '#E6B325' : '#f0f0f0',
    color: isActive ? '#0B1C3F' : '#666',
    border: isActive ? '2px solid #E6B325' : '1px solid #ddd',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: isActive ? 'bold' : 'normal',
    transition: 'all 0.3s ease'
  });

  return (
    <div className="page" style={{ padding: '2rem' }}>
      <h1 style={{ color: '#0B1C3F', marginBottom: '0.5rem' }}>📊 Admin Dashboard</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>Manage all temple operations and content</p>

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '10px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            maxWidth: '400px'
          }}>
            <h3 style={{ color: '#0B1C3F', marginBottom: '1rem' }}>Confirm Delete</h3>
            <p style={{ color: '#666', marginBottom: '2rem' }}>
              Are you sure you want to delete this item? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => {
                  if (showDeleteConfirm.type === 'event') {
                    handleDeleteEvent(showDeleteConfirm.id);
                  } else if (showDeleteConfirm.type === 'donor') {
                    handleDeleteDonor(showDeleteConfirm.id);
                  } else if (showDeleteConfirm.type === 'service') {
                    handleDeleteService(showDeleteConfirm.id);
                  } else if (showDeleteConfirm.type === 'staff') {
                    handleDeleteStaff(showDeleteConfirm.id);
                  }
                }}
                style={{
                  flex: 1,
                  padding: '10px',
                  backgroundColor: '#d32f2f',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(null)}
                style={{
                  flex: 1,
                  padding: '10px',
                  backgroundColor: '#999',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB BUTTONS */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '2rem',
        flexWrap: 'wrap'
      }}>
        {[
          { id: 'dashboard', label: '📈 Dashboard' },
          { id: 'images', label: '🖼️ Images' },
          { id: 'events', label: '📅 Events' },
          { id: 'services', label: '🙏 Services' },
          { id: 'staff', label: '👥 Staff' },
          { id: 'timings', label: '⏰ Timings' },
          { id: 'donors', label: '💝 Donors' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={tabButtonStyle(activeTab === tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ====== DASHBOARD TAB ====== */}
      {activeTab === 'dashboard' && (
        <div style={{ marginTop: '2rem' }}>
          <h2 style={{ color: '#0B1C3F', marginBottom: '2rem' }}>📈 Dashboard Overview</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem'
          }}>
            {[
              { label: 'Total Events', value: stats.totalEvents, color: '#FF6B6B' },
              { label: 'Total Services', value: stats.totalServices, color: '#4ECDC4' },
              { label: 'Staff Members', value: stats.totalStaff, color: '#45B7D1' },
              { label: 'Total Donors', value: stats.totalDonors, color: '#96CEB4' },
              { label: 'Total Donations', value: `₹${stats.totalDonations}`, color: '#FFEAA7' },
              { label: 'Avg Donation', value: `₹${stats.averageDonation}`, color: '#DDA15E' }
            ].map((stat, index) => (
              <div
                key={index}
                style={{
                  padding: '2rem',
                  backgroundColor: stat.color,
                  borderRadius: '10px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  color: 'white',
                  textAlign: 'center'
                }}
              >
                <p style={{ fontSize: '0.95rem', opacity: 0.9, marginBottom: '0.5rem' }}>{stat.label}</p>
                <p style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ====== HOME IMAGES TAB ====== */}
      {activeTab === 'images' && (
        <div style={{ marginTop: '2rem' }}>
          <h2 style={{ color: '#0B1C3F', marginBottom: '2rem' }}>🖼️ Home Screen Images</h2>
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '10px', marginBottom: '2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: '#0B1C3F', marginBottom: '1rem' }}>Upload New Image</h3>
            <form onSubmit={handleImageUpload}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Image Title (Optional)</label>
                <input
                  type="text"
                  value={imageTitle}
                  onChange={(e) => setImageTitle(e.target.value)}
                  placeholder="Enter image title"
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Select Image File</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  style={{ width: '100%', padding: '10px' }}
                />
              </div>
              {imageError && <div style={{ color: '#d32f2f', marginBottom: '1rem' }}>{imageError}</div>}
              <button
                type="submit"
                disabled={imageUploading}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#E6B325',
                  color: '#0B1C3F',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: imageUploading ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold'
                }}
              >
                {imageUploading ? 'Uploading...' : 'Upload Image'}
              </button>
            </form>
          </div>

          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: '#0B1C3F', marginBottom: '1rem' }}>Uploaded Images ({homeImages.length})</h3>
            {homeImages.length === 0 ? (
              <p style={{ color: '#999' }}>No images uploaded yet</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f9f9f9' }}>
                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #E6B325' }}>Title</th>
                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #E6B325' }}>Filename</th>
                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #E6B325' }}>Size</th>
                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #E6B325' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {homeImages.map((img, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '10px' }}>{img.title}</td>
                      <td style={{ padding: '10px', fontSize: '0.9rem', color: '#666' }}>{img.filename}</td>
                      <td style={{ padding: '10px', fontSize: '0.9rem', color: '#666' }}>{img.size}</td>
                      <td style={{ padding: '10px' }}>
                        <button
                          onClick={() => handleDeleteImage(index)}
                          style={{
                            padding: '5px 10px',
                            backgroundColor: '#d32f2f',
                            color: 'white',
                            border: 'none',
                            borderRadius: '3px',
                            cursor: 'pointer'
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* ====== EVENTS TAB ====== */}
      {activeTab === 'events' && (
        <div style={{ marginTop: '2rem' }}>
          <h2 style={{ color: '#0B1C3F', marginBottom: '2rem' }}>📅 Events Management</h2>
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '10px', marginBottom: '2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: '#0B1C3F', marginBottom: '1rem' }}>
              {editingEventId ? 'Edit Event' : 'Create New Event'}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <input
                type="text"
                placeholder="Event Title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px', boxSizing: 'border-box' }}
              />
              <input
                type="date"
                value={newEvent.date}
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px', boxSizing: 'border-box' }}
              />
              <input
                type="time"
                value={newEvent.time}
                onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px', boxSizing: 'border-box' }}
              />
              <input
                type="text"
                placeholder="Location"
                value={newEvent.location}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px', boxSizing: 'border-box' }}
              />
            </div>
            <textarea
              placeholder="Description"
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', marginBottom: '1rem', minHeight: '100px', boxSizing: 'border-box' }}
            />
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Event Image (Optional)</label>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEventImageFile(e.target.files[0])}
                  style={{ padding: '10px', flex: 1, border: '1px solid #ddd', borderRadius: '5px', boxSizing: 'border-box' }}
                />
                {eventImageFile && <span style={{ color: '#4CAF50', fontWeight: 'bold' }}>✓ {eventImageFile.name}</span>}
              </div>
            </div>
            <button
              onClick={handleAddEvent}
              style={{
                padding: '10px 20px',
                backgroundColor: '#E6B325',
                color: '#0B1C3F',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold',
                marginRight: '10px'
              }}
            >
              {editingEventId ? 'Update Event' : 'Create Event'}
            </button>
            {editingEventId && (
              <button
                onClick={() => {
                  setEditingEventId(null);
                  setNewEvent({ title: '', date: '', time: '', location: '', description: '' });
                  setEventImageFile(null);
                }}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#999',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            )}
          </div>

          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: '#0B1C3F', marginBottom: '1rem' }}>All Events ({events_local.length})</h3>
            {events_local.length === 0 ? (
              <p style={{ color: '#999' }}>No events created yet</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f9f9f9' }}>
                      <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #E6B325' }}>Title</th>
                      <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #E6B325' }}>Date</th>
                      <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #E6B325' }}>Time</th>
                      <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #E6B325' }}>Location</th>
                      <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #E6B325' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events_local.map((event) => (
                      <tr key={event.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '10px' }}>{event.title}</td>
                        <td style={{ padding: '10px' }}>{formatDate(event.date)}</td>
                        <td style={{ padding: '10px' }}>{formatTime(event.time)}</td>
                        <td style={{ padding: '10px' }}>{event.location}</td>
                        <td style={{ padding: '10px' }}>
                          <button
                            onClick={() => {
                              setEditingEventId(event.id);
                              setNewEvent(event);
                            }}
                            style={{
                              marginRight: '5px',
                              padding: '5px 10px',
                              backgroundColor: '#45B7D1',
                              color: 'white',
                              border: 'none',
                              borderRadius: '3px',
                              cursor: 'pointer',
                              fontSize: '0.9rem'
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm({ type: 'event', id: event.id })}
                            style={{
                              padding: '5px 10px',
                              backgroundColor: '#d32f2f',
                              color: 'white',
                              border: 'none',
                              borderRadius: '3px',
                              cursor: 'pointer',
                              fontSize: '0.9rem'
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ====== SERVICES TAB ====== */}
      {activeTab === 'services' && (
        <div style={{ marginTop: '2rem' }}>
          <h2 style={{ color: '#0B1C3F', marginBottom: '2rem' }}>🙏 Services Management</h2>
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '10px', marginBottom: '2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: '#0B1C3F', marginBottom: '1rem' }}>
              {editingServiceId ? 'Edit Service' : 'Add New Service'}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <input
                type="text"
                placeholder="Service Name"
                value={newService.name}
                onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px', boxSizing: 'border-box' }}
              />
              <input
                type="text"
                placeholder="Icon/Emoji"
                value={newService.icon}
                onChange={(e) => setNewService({ ...newService, icon: e.target.value })}
                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px', boxSizing: 'border-box' }}
              />
              <input
                type="text"
                placeholder="Category"
                value={newService.category}
                onChange={(e) => setNewService({ ...newService, category: e.target.value })}
                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px', boxSizing: 'border-box' }}
              />
            </div>
            <textarea
              placeholder="Description"
              value={newService.description}
              onChange={(e) => setNewService({ ...newService, description: e.target.value })}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', marginBottom: '1rem', minHeight: '80px', boxSizing: 'border-box' }}
            />
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Service Image (Optional)</label>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setServiceImageFile(e.target.files[0])}
                  style={{ padding: '10px', flex: 1, border: '1px solid #ddd', borderRadius: '5px', boxSizing: 'border-box' }}
                />
                {serviceImageFile && <span style={{ color: '#4CAF50', fontWeight: 'bold' }}>✓ {serviceImageFile.name}</span>}
              </div>
            </div>
            <button
              onClick={handleAddService}
              style={{
                padding: '10px 20px',
                backgroundColor: '#E6B325',
                color: '#0B1C3F',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold',
                marginRight: '10px'
              }}
            >
              {editingServiceId ? 'Update Service' : 'Add Service'}
            </button>
            {editingServiceId && (
              <button
                onClick={() => {
                  setEditingServiceId(null);
                  setNewService({ name: '', description: '', icon: '🙏', category: '' });
                  setServiceImageFile(null);
                }}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#999',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            )}
          </div>

          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: '#0B1C3F', marginBottom: '1rem' }}>All Services ({services.length})</h3>
            {services.length === 0 ? (
              <p style={{ color: '#999' }}>No services added yet</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {services.map((service) => (
                  <div key={service.id} style={{ padding: '1.5rem', border: '1px solid #ddd', borderRadius: '5px' }}>
                    <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{service.icon}</p>
                    <h4 style={{ color: '#0B1C3F', marginBottom: '0.5rem' }}>{service.name}</h4>
                    <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{service.description}</p>
                    <p style={{ color: '#999', fontSize: '0.85rem', marginBottom: '1rem' }}>Category: {service.category}</p>
                    <button
                      onClick={() => {
                        setEditingServiceId(service.id);
                        setNewService(service);
                      }}
                      style={{
                        marginRight: '5px',
                        padding: '5px 10px',
                        backgroundColor: '#45B7D1',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm({ type: 'service', id: service.id })}
                      style={{
                        padding: '5px 10px',
                        backgroundColor: '#d32f2f',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ====== STAFF TAB ====== */}
      {activeTab === 'staff' && (
        <div style={{ marginTop: '2rem' }}>
          <h2 style={{ color: '#0B1C3F', marginBottom: '2rem' }}>👥 Staff Management</h2>
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '10px', marginBottom: '2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: '#0B1C3F', marginBottom: '1rem' }}>
              {editingStaffId ? 'Edit Staff Member' : 'Add New Staff Member'}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <input
                type="text"
                placeholder="Full Name"
                value={newStaff.name}
                onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px', boxSizing: 'border-box' }}
              />
              <input
                type="text"
                placeholder="Position"
                value={newStaff.position}
                onChange={(e) => setNewStaff({ ...newStaff, position: e.target.value })}
                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px', boxSizing: 'border-box' }}
              />
              <input
                type="text"
                placeholder="Designation"
                value={newStaff.designation}
                onChange={(e) => setNewStaff({ ...newStaff, designation: e.target.value })}
                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px', boxSizing: 'border-box' }}
              />
              <input
                type="email"
                placeholder="Email"
                value={newStaff.email}
                onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px', boxSizing: 'border-box' }}
              />
              <input
                type="tel"
                placeholder="Phone"
                value={newStaff.phone}
                onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px', boxSizing: 'border-box' }}
              />
            </div>
            <textarea
              placeholder="Bio"
              value={newStaff.bio}
              onChange={(e) => setNewStaff({ ...newStaff, bio: e.target.value })}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', marginBottom: '1rem', minHeight: '80px', boxSizing: 'border-box' }}
            />
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Staff Photo (Optional)</label>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setStaffImageFile(e.target.files[0])}
                  style={{ padding: '10px', flex: 1, border: '1px solid #ddd', borderRadius: '5px', boxSizing: 'border-box' }}
                />
                {staffImageFile && <span style={{ color: '#4CAF50', fontWeight: 'bold' }}>✓ {staffImageFile.name}</span>}
              </div>
            </div>
            <button
              onClick={handleAddStaff}
              style={{
                padding: '10px 20px',
                backgroundColor: '#E6B325',
                color: '#0B1C3F',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold',
                marginRight: '10px'
              }}
            >
              {editingStaffId ? 'Update Staff' : 'Add Staff'}
            </button>
            {editingStaffId && (
              <button
                onClick={() => {
                  setEditingStaffId(null);
                  setNewStaff({ name: '', position: '', designation: '', email: '', phone: '', bio: '' });
                  setStaffImageFile(null);
                }}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#999',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            )}
          </div>

          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: '#0B1C3F', marginBottom: '1rem' }}>Staff Directory ({staff.length})</h3>
            {staff.length === 0 ? (
              <p style={{ color: '#999' }}>No staff members added yet</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {staff.map((member) => (
                  <div key={member.id} style={{ padding: '1.5rem', border: '1px solid #ddd', borderRadius: '5px' }}>
                    <h4 style={{ color: '#0B1C3F', marginBottom: '0.3rem' }}>{member.name}</h4>
                    <p style={{ color: '#E6B325', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{member.position}</p>
                    <p style={{ color: '#666', fontSize: '0.85rem', marginBottom: '0.3rem' }}>📧 {member.email}</p>
                    <p style={{ color: '#666', fontSize: '0.85rem', marginBottom: '0.5rem' }}>📱 {member.phone}</p>
                    <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem', minHeight: '40px' }}>{member.bio}</p>
                    <button
                      onClick={() => {
                        setEditingStaffId(member.id);
                        setNewStaff(member);
                      }}
                      style={{
                        marginRight: '5px',
                        padding: '5px 10px',
                        backgroundColor: '#45B7D1',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm({ type: 'staff', id: member.id })}
                      style={{
                        padding: '5px 10px',
                        backgroundColor: '#d32f2f',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ====== TIMINGS TAB ====== */}
      {activeTab === 'timings' && (
        <div style={{ marginTop: '2rem' }}>
          <h2 style={{ color: '#0B1C3F', marginBottom: '2rem' }}>⏰ Temple Timings</h2>
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: '#0B1C3F', marginBottom: '1.5rem' }}>Weekly Schedule</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {Object.entries(timings).map(([day, time]) => (
                <div key={day} style={{ padding: '1rem', backgroundColor: '#f9f9f9', borderRadius: '5px' }}>
                  <h4 style={{ color: '#0B1C3F', marginBottom: '1rem', textTransform: 'capitalize' }}>
                    {day.charAt(0).toUpperCase() + day.slice(1)}
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Opening Time</label>
                      <input
                        type="time"
                        value={time.open}
                        onChange={(e) => setTimings({ ...timings, [day]: { ...time, open: e.target.value } })}
                        style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '3px', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Closing Time</label>
                      <input
                        type="time"
                        value={time.close}
                        onChange={(e) => setTimings({ ...timings, [day]: { ...time, close: e.target.value } })}
                        style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '3px', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>
                  <p style={{ color: '#666', fontSize: '0.9rem' }}>
                    {formatTime(time.open)} - {formatTime(time.close)}
                  </p>
                </div>
              ))}
            </div>
            <button
              onClick={handleSaveTimings}
              style={{
                marginTop: '2rem',
                padding: '10px 30px',
                backgroundColor: '#E6B325',
                color: '#0B1C3F',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Save Timings
            </button>
          </div>
        </div>
      )}

      {/* ====== DONORS TAB ====== */}
      {activeTab === 'donors' && (
        <div style={{ marginTop: '2rem' }}>
          <h2 style={{ color: '#0B1C3F', marginBottom: '2rem' }}>💝 Donors Management</h2>
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: '#0B1C3F', marginBottom: '1rem' }}>All Donors ({donors.length})</h3>
            {donorsLoading ? (
              <p style={{ color: '#999' }}>Loading donors...</p>
            ) : donorsError ? (
              <p style={{ color: '#d32f2f' }}>Error: {donorsError}</p>
            ) : donors.length === 0 ? (
              <p style={{ color: '#999' }}>No donors found</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f9f9f9' }}>
                      <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #E6B325' }}>Name</th>
                      <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #E6B325' }}>Type</th>
                      <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #E6B325' }}>Amount</th>
                      <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #E6B325' }}>Date</th>
                      <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #E6B325' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donors.map((donor) => (
                      <tr key={donor.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '10px' }}>{donor.donorName}</td>
                        <td style={{ padding: '10px' }}>{donor.donationType}</td>
                        <td style={{ padding: '10px' }}>₹{parseFloat(donor.amount).toFixed(2)}</td>
                        <td style={{ padding: '10px' }}>{formatDate(donor.donationDate)}</td>
                        <td style={{ padding: '10px' }}>
                          <button
                            onClick={() => setShowDeleteConfirm({ type: 'donor', id: donor.id })}
                            style={{
                              padding: '5px 10px',
                              backgroundColor: '#d32f2f',
                              color: 'white',
                              border: 'none',
                              borderRadius: '3px',
                              cursor: 'pointer',
                              fontSize: '0.85rem'
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
