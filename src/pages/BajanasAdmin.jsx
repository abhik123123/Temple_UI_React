import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getAllBajanas, addBajana, updateBajana, deleteBajana } from '../services/bajanasData';

export default function BajanasAdmin() {
  const { t } = useLanguage();
  const [bajanas, setBajanas] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBajana, setEditingBajana] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    category: 'devotional',
    deity: 'shiva',
    schedule: '',
    description: '',
    details: '',
    icon: '🎵',
    hasAudio: false,
    hasLyrics: false
  });

  useEffect(() => {
    loadBajanas();
  }, []);

  const loadBajanas = () => {
    setBajanas(getAllBajanas());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      if (editingBajana) {
        updateBajana(editingBajana.id, formData);
      } else {
        addBajana(formData);
      }
      loadBajanas();
      closeModal();
    } catch (error) {
      alert('Error saving bajana: ' + error.message);
    }
  };

  const handleEdit = (bajana) => {
    setEditingBajana(bajana);
    setFormData({
      title: bajana.title,
      artist: bajana.artist || '',
      category: bajana.category,
      deity: bajana.deity || 'shiva',
      schedule: bajana.schedule || '',
      description: bajana.description,
      details: Array.isArray(bajana.details) ? bajana.details.join(', ') : '',
      icon: bajana.icon || '🎵',
      hasAudio: bajana.hasAudio || false,
      hasLyrics: bajana.hasLyrics || false
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this bajana?')) {
      deleteBajana(id);
      loadBajanas();
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBajana(null);
    setFormData({
      title: '',
      artist: '',
      category: 'devotional',
      deity: 'shiva',
      schedule: '',
      description: '',
      details: '',
      icon: '🎵',
      hasAudio: false,
      hasLyrics: false
    });
  };

  return (
    <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '40px',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <h1 style={{ fontSize: '2.5rem', color: '#0B1C3F', margin: 0 }}>
            🎵 Bajanas Management
          </h1>
          <button
            onClick={() => setIsModalOpen(true)}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #E6B325 0%, #d4a017 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              boxShadow: '0 4px 12px rgba(230, 179, 37, 0.3)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={e => e.target.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.target.style.transform = 'translateY(0)'}
          >
            ➕ Add New Bajana
          </button>
        </div>

        {/* Bajanas Table */}
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          overflow: 'hidden',
          boxShadow: '0 4px 6px rgba(0,0,0,0.07)'
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#0B1C3F', color: 'white' }}>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Icon</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Title</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Artist</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Category</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Schedule</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Media</th>
                  <th style={{ padding: '15px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bajanas.map((bajana, index) => (
                  <tr key={bajana.id} style={{ 
                    borderBottom: '1px solid #e0e0e0',
                    backgroundColor: index % 2 === 0 ? '#f9fafb' : 'white'
                  }}>
                    <td style={{ padding: '15px', fontSize: '2rem' }}>{bajana.icon}</td>
                    <td style={{ padding: '15px', fontWeight: '600' }}>{bajana.title}</td>
                    <td style={{ padding: '15px' }}>{bajana.artist}</td>
                    <td style={{ padding: '15px' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '12px',
                        backgroundColor: '#E6B325',
                        color: 'white',
                        fontSize: '0.85rem',
                        textTransform: 'capitalize'
                      }}>
                        {bajana.category}
                      </span>
                    </td>
                    <td style={{ padding: '15px', fontSize: '0.9rem' }}>{bajana.schedule}</td>
                    <td style={{ padding: '15px' }}>
                      <div style={{ display: 'flex', gap: '8px', fontSize: '1.2rem' }}>
                        {bajana.hasAudio && <span title="Has Audio">🎧</span>}
                        {bajana.hasLyrics && <span title="Has Lyrics">📝</span>}
                      </div>
                    </td>
                    <td style={{ padding: '15px' }}>
                      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                        <button
                          onClick={() => handleEdit(bajana)}
                          style={{
                            padding: '8px 16px',
                            backgroundColor: '#0B1C3F',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '500'
                          }}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDelete(bajana.id)}
                          style={{
                            padding: '8px 16px',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '500'
                          }}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
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
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '30px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h2 style={{ marginTop: 0, color: '#0B1C3F' }}>
              {editingBajana ? '✏️ Edit Bajana' : '➕ Add New Bajana'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                  Artist
                </label>
                <input
                  type="text"
                  value={formData.artist}
                  onChange={e => setFormData({...formData, artist: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                    Category *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="daily">Daily</option>
                    <option value="festivals">Festivals</option>
                    <option value="special">Special</option>
                    <option value="devotional">Devotional</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                    Deity
                  </label>
                  <input
                    type="text"
                    value={formData.deity}
                    onChange={e => setFormData({...formData, deity: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                    placeholder="shiva"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                    Icon
                  </label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={e => setFormData({...formData, icon: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                    placeholder="🎵"
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                  Schedule
                </label>
                <input
                  type="text"
                  value={formData.schedule}
                  onChange={e => setFormData({...formData, schedule: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                  placeholder="e.g., Every Monday at 6:00 PM"
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                  Description *
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px',
                    minHeight: '80px',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                  Details (comma-separated)
                </label>
                <textarea
                  value={formData.details}
                  onChange={e => setFormData({...formData, details: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px',
                    minHeight: '60px',
                    resize: 'vertical'
                  }}
                  placeholder="e.g., Sanskrit lyrics, Duration: 30 minutes, Open to all"
                />
              </div>

              <div style={{ marginBottom: '20px', display: 'flex', gap: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.hasAudio}
                    onChange={e => setFormData({...formData, hasAudio: e.target.checked})}
                    style={{ marginRight: '8px', width: '18px', height: '18px' }}
                  />
                  <span style={{ fontWeight: '600', color: '#333' }}>🎧 Has Audio</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.hasLyrics}
                    onChange={e => setFormData({...formData, hasLyrics: e.target.checked})}
                    style={{ marginRight: '8px', width: '18px', height: '18px' }}
                  />
                  <span style={{ fontWeight: '600', color: '#333' }}>📝 Has Lyrics</span>
                </label>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={closeModal}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '10px 20px',
                    background: 'linear-gradient(135deg, #E6B325 0%, #d4a017 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  {editingBajana ? 'Update' : 'Add'} Bajana
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
