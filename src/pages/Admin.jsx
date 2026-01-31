import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useUpcomingEvents } from '../hooks/useAPI';
import { eventsAPI, donorsAPI } from '../services/api';

export default function Admin() {
  const { isAuthenticated, login: authLogin, requireAuth } = useAuth();
  const { events, loading: eventsLoading, error: eventsError, refetch: refetchEvents } = useUpcomingEvents();
  const [donors, setDonors] = useState([]);
  const [donorsLoading, setDonorsLoading] = useState(true);
  const [donorsError, setDonorsError] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');
  const [adminLoading, setAdminLoading] = useState(false);
  const [homeImages, setHomeImages] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imageTitle, setImageTitle] = useState('');
  const [imageUploading, setImageUploading] = useState(false);
  const [imageError, setImageError] = useState('');

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        setDonorsLoading(true);
        const response = await donorsAPI.getAll();
        setDonors(Array.isArray(response.data) ? response.data : response.data || []);
        setDonorsError(null);
      } catch (err) {
        setDonorsError(err.response?.data?.message || 'Failed to load donors');
      } finally {
        setDonorsLoading(false);
      }
    };

    fetchDonors();
  }, []);

  const stats = useMemo(() => {
    const totalDonations = donors.reduce((sum, donor) => sum + (parseFloat(donor.amount) || 0), 0);
    return {
      totalEvents: events?.length || 0,
      totalDonors: donors?.length || 0,
      totalDonations,
      averageDonation: donors.length ? (totalDonations / donors.length).toFixed(2) : '0.00'
    };
  }, [events, donors]);

  const handleDeleteEvent = async (eventId) => {
    try {
      await eventsAPI.delete(eventId);
      refetchEvents();
      setShowDeleteConfirm(null);
    } catch (err) {
      alert('Failed to delete event: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteDonor = async (donorId) => {
    try {
      await donorsAPI.delete(donorId);
      const response = await donorsAPI.getAll();
      setDonors(Array.isArray(response.data) ? response.data : response.data || []);
      setShowDeleteConfirm(null);
    } catch (err) {
      alert('Failed to delete donor: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setAdminError('');
    setAdminLoading(true);
    const result = await authLogin(adminUsername, adminPassword);
    setAdminLoading(false);
    if (!result.success) {
      setAdminError(result.message);
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

  if (requireAuth && !isAuthenticated) {
    return (
      <div className="page">
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 420,
              padding: '2rem',
              borderRadius: 12,
              border: '1px solid #f1dfc4',
              background: '#fff9f2',
              boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
            }}
          >
            <h2 style={{ textAlign: 'center', color: '#8b4513' }}>Admin Login</h2>
            <p style={{ textAlign: 'center', color: '#5d4630', marginBottom: '1.5rem' }}>Please login with your admin credentials.</p>
            <form onSubmit={handleAdminLogin}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.4rem' }}>Username</label>
              <input
                type="text"
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                disabled={adminLoading}
                placeholder="test@temple.com"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: 6,
                  border: '1px solid #dfc9aa',
                  marginBottom: '1rem'
                }}
              />
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.4rem' }}>Password</label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                disabled={adminLoading}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: 6,
                  border: '1px solid #dfc9aa',
                  marginBottom: '1rem'
                }}
              />
              {adminError && (
                <div
                  style={{
                    marginBottom: '1rem',
                    padding: '0.75rem',
                    borderRadius: 6,
                    background: '#ffecec',
                    color: '#b71c1c'
                  }}
                >
                  {adminError}
                </div>
              )}
              <button
                type="submit"
                disabled={adminLoading || !adminUsername || !adminPassword}
                style={{
                  width: '100%',
                  padding: '0.9rem',
                  borderRadius: 8,
                  border: 'none',
                  background: '#8b4513',
                  color: 'white',
                  fontWeight: 'bold',
                  cursor: adminLoading ? 'not-allowed' : 'pointer'
                }}
              >
                {adminLoading ? 'Logging in...' : 'Login'}
              </button>
            </form>
            <p style={{ marginTop: '1rem', textAlign: 'center', color: '#6e4a2b' }}>Or use <strong>test@temple.com</strong> / <strong>test123</strong></p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div
        className="hero"
        style={{
          backgroundImage: 'url(/images/temple-images/temple-main.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          position: 'relative'
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.6)'
          }}
        />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <h1 style={{ color: 'white', fontSize: '2.5rem' }}>⚙️ Admin Dashboard</h1>
          <p style={{ color: '#f0f0f0', fontSize: '1.1rem' }}>Manage Temple Events & Donors</p>
        </div>
      </div>

      <div className="container">
        <div
          style={{
            marginTop: '2rem',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}
        >
          {['dashboard', 'images', 'events', 'donors'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '0.75rem 1.25rem',
                borderRadius: '8px 8px 0 0',
                border: 'none',
                background: activeTab === tab ? '#8b4513' : '#f3f3f3',
                color: activeTab === tab ? 'white' : '#333',
                cursor: 'pointer',
                fontWeight: 'bold',
                textTransform: 'capitalize'
              }}
            >
              {tab === 'dashboard' && '📊 Dashboard'}
              {tab === 'images' && '🖼️ Home Images'}
              {tab === 'events' && '📅 Events'}
              {tab === 'donors' && '💝 Donors'}
            </button>
          ))}
        </div>

        {activeTab === 'dashboard' && (
          <div style={{ marginTop: '1.5rem' }}>
            <h2 style={{ color: '#8b4513', marginBottom: '1rem' }}>Quick Stats</h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1rem'
              }}
            >
              {[
                { label: 'Total Events', value: stats.totalEvents, icon: '📅' },
                { label: 'Total Donors', value: stats.totalDonors, icon: '💝' },
                { label: 'Total Donations', value: `₹${stats.totalDonations.toLocaleString()}`, icon: '₹' },
                { label: 'Avg Donation', value: `₹${stats.averageDonation}`, icon: '📊' }
              ].map((card) => (
                <div
                  key={card.label}
                  style={{
                    padding: '1.5rem',
                    borderRadius: 12,
                    background: 'white',
                    border: '1px solid #eee',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                  }}
                >
                  <p style={{ margin: 0, fontSize: '1.5rem' }}>{card.icon}</p>
                  <p style={{ margin: '0.25rem 0', fontSize: '2rem', fontWeight: 'bold' }}>{card.value}</p>
                  <p style={{ margin: 0, color: '#777' }}>{card.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'images' && (
          <div style={{ marginTop: '1.5rem' }}>
            <h2 style={{ color: '#8b4513', marginBottom: '1rem' }}>🖼️ Home Screen Images</h2>
            
            {/* Upload Form */}
            <div style={{
              background: '#f9f9f9',
              padding: '1.5rem',
              borderRadius: '8px',
              marginBottom: '2rem',
              border: '1px solid #ddd'
            }}>
              <h3 style={{ color: '#8b4513', marginBottom: '1rem' }}>Upload New Image</h3>
              {imageError && (
                <div style={{ padding: '0.75rem', background: '#ffecec', borderRadius: 6, color: '#b71c1c', marginBottom: '1rem' }}>
                  {imageError}
                </div>
              )}
              <form onSubmit={(e) => {
                e.preventDefault();
                if (!imageFile) {
                  setImageError('Please select an image');
                  return;
                }
                setImageUploading(true);
                setImageError('');
                // Simulate upload - in production, send to backend
                setTimeout(() => {
                  const newImage = {
                    id: Date.now(),
                    filename: imageFile.name,
                    title: imageTitle || imageFile.name,
                    uploadedAt: new Date().toLocaleString(),
                    size: (imageFile.size / 1024 / 1024).toFixed(2) + ' MB'
                  };
                  setHomeImages([...homeImages, newImage]);
                  setImageFile(null);
                  setImageTitle('');
                  setImageUploading(false);
                }, 1000);
              }}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Image Title (Optional)</label>
                  <input
                    type="text"
                    value={imageTitle}
                    onChange={(e) => setImageTitle(e.target.value)}
                    placeholder="e.g., Shiva Mahakal"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '4px',
                      border: '1px solid #ddd',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Select Image File</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    disabled={imageUploading}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '4px',
                      border: '2px dashed #8b4513',
                      boxSizing: 'border-box',
                      cursor: imageUploading ? 'not-allowed' : 'pointer'
                    }}
                  />
                  {imageFile && (
                    <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>
                      Selected: {imageFile.name} ({(imageFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={imageUploading || !imageFile}
                  style={{
                    background: '#8b4513',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '4px',
                    cursor: imageUploading ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold',
                    opacity: imageUploading || !imageFile ? 0.6 : 1
                  }}
                >
                  {imageUploading ? 'Uploading...' : 'Upload Image'}
                </button>
              </form>
            </div>

            {/* Images List */}
            <h3 style={{ color: '#8b4513', marginBottom: '1rem' }}>Uploaded Images ({homeImages.length})</h3>
            {homeImages.length === 0 ? (
              <p style={{ color: '#999', padding: '1.5rem', textAlign: 'center', background: '#f5f5f5', borderRadius: '4px' }}>
                No images uploaded yet
              </p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  background: 'white',
                  borderRadius: 8,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                }}>
                  <thead>
                    <tr style={{ background: '#8b4513', color: 'white' }}>
                      <th style={{ padding: '1rem', textAlign: 'left' }}>Title</th>
                      <th style={{ padding: '1rem', textAlign: 'left' }}>Filename</th>
                      <th style={{ padding: '1rem', textAlign: 'left' }}>Size</th>
                      <th style={{ padding: '1rem', textAlign: 'left' }}>Uploaded</th>
                      <th style={{ padding: '1rem', textAlign: 'center' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {homeImages.map((img, index) => (
                      <tr key={img.id} style={{ background: index % 2 === 0 ? '#fafafa' : 'white' }}>
                        <td style={{ padding: '1rem' }}>{img.title}</td>
                        <td style={{ padding: '1rem' }}>{img.filename}</td>
                        <td style={{ padding: '1rem' }}>{img.size}</td>
                        <td style={{ padding: '1rem' }}>{img.uploadedAt}</td>
                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                          <button
                            onClick={() => setHomeImages(homeImages.filter(i => i.id !== img.id))}
                            style={{
                              background: '#d32f2f',
                              color: 'white',
                              border: 'none',
                              borderRadius: 6,
                              padding: '0.5rem 1rem',
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
              </div>
            )}
          </div>
        )}

        {activeTab === 'events' && (
          <div style={{ marginTop: '1.5rem' }}>
            <h2 style={{ color: '#8b4513', marginBottom: '1rem' }}>Upcoming Events</h2>
            {eventsLoading && <p>Loading events...</p>}
            {eventsError && (
              <div style={{ padding: '0.75rem', background: '#ffecec', borderRadius: 6, marginBottom: '1rem', color: '#b71c1c' }}>
                {eventsError}
              </div>
            )}
            <div style={{ overflowX: 'auto' }}>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  background: 'white',
                  borderRadius: 8,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                }}
              >
                <thead>
                  <tr style={{ background: '#8b4513', color: 'white' }}>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>Event</th>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>Date</th>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>Time</th>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>Location</th>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>Category</th>
                    <th style={{ padding: '1rem', textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {events && events.length > 0 ? (
                    events.map((event, index) => (
                      <tr key={event.id} style={{ background: index % 2 === 0 ? '#fafafa' : 'white' }}>
                        <td style={{ padding: '1rem' }}>
                          <strong>{event.eventName}</strong>
                          <p style={{ margin: '0.25rem 0', color: '#666' }}>{event.description}</p>
                        </td>
                        <td style={{ padding: '1rem' }}>{formatDate(event.eventDate)}</td>
                        <td style={{ padding: '1rem' }}>{`${formatTime(event.startTime)} - ${formatTime(event.endTime)}`}</td>
                        <td style={{ padding: '1rem' }}>{event.location}</td>
                        <td style={{ padding: '1rem' }}>
                          <span
                            style={{
                              padding: '0.25rem 0.75rem',
                              borderRadius: 999,
                              background: '#f1f1f1',
                              fontSize: '0.85rem'
                            }}
                          >
                            {event.category}
                          </span>
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                          <button
                            onClick={() => setShowDeleteConfirm({ type: 'event', id: event.id, name: event.eventName })}
                            style={{
                              background: '#d32f2f',
                              color: 'white',
                              border: 'none',
                              borderRadius: 6,
                              padding: '0.5rem 1rem',
                              cursor: 'pointer'
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>
                        No events found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'donors' && (
          <div style={{ marginTop: '1.5rem' }}>
            <h2 style={{ color: '#8b4513', marginBottom: '1rem' }}>Donor Management</h2>
            {donorsLoading && <p>Loading donors...</p>}
            {donorsError && (
              <div style={{ padding: '0.75rem', background: '#ffecec', borderRadius: 6, marginBottom: '1rem', color: '#b71c1c' }}>
                {donorsError}
              </div>
            )}
            <div style={{ overflowX: 'auto' }}>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  background: 'white',
                  borderRadius: 8,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                }}
              >
                <thead>
                  <tr style={{ background: '#8b4513', color: 'white' }}>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>Donor</th>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>Amount</th>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>Date</th>
                    <th style={{ padding: '1rem', textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {donors && donors.length > 0 ? (
                    donors.map((donor, index) => (
                      <tr key={donor.id} style={{ background: index % 2 === 0 ? '#fafafa' : 'white' }}>
                        <td style={{ padding: '1rem' }}>{donor.fullName || donor.name || 'Anonymous'}</td>
                        <td style={{ padding: '1rem' }}>₹{parseFloat(donor.amount || 0).toLocaleString()}</td>
                        <td style={{ padding: '1rem' }}>{formatDate(donor.createdAt || donor.date)}</td>
                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                          <button
                            onClick={() => setShowDeleteConfirm({ type: 'donor', id: donor.id, name: donor.fullName || donor.name })}
                            style={{
                              background: '#d32f2f',
                              color: 'white',
                              border: 'none',
                              borderRadius: 6,
                              padding: '0.5rem 1rem',
                              cursor: 'pointer'
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>
                        No donors yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {showDeleteConfirm && (
        <div
          onClick={() => setShowDeleteConfirm(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'white',
              padding: '1.5rem',
              borderRadius: 10,
              width: '90%',
              maxWidth: 420,
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
            }}
          >
            <p style={{ margin: '0 0 1rem' }}>
              Are you sure you want to delete <strong>{showDeleteConfirm.name}</strong>?
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button
                onClick={() => setShowDeleteConfirm(null)}
                style={{
                  border: 'none',
                  background: '#f3f3f3',
                  padding: '0.65rem 1rem',
                  borderRadius: 6,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (showDeleteConfirm.type === 'event') {
                    handleDeleteEvent(showDeleteConfirm.id);
                  } else {
                    handleDeleteDonor(showDeleteConfirm.id);
                  }
                }}
                style={{
                  border: 'none',
                  background: '#d32f2f',
                  color: 'white',
                  padding: '0.65rem 1rem',
                  borderRadius: 6,
                  cursor: 'pointer'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
