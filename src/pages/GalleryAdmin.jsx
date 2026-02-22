import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { galleryAPI } from '../services/postgresAPI';

export default function GalleryAdmin() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('images');
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
    files: []
  });

  useEffect(() => {
    fetchGalleryData();
  }, []);

  const fetchGalleryData = async () => {
    try {
      setLoading(true);
      const data = await galleryAPI.getAll();
      setAllItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching gallery data:', error);
      setAllItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Split by type
  const images = allItems.filter(i => i.type === 'image');
  const videos = allItems.filter(i => i.type === 'video');
  const youtubeLinks = allItems.filter(i => i.type === 'youtube');

  const handleFileChange = (e) => {
    setFormData({ ...formData, files: Array.from(e.target.files) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (activeTab === 'youtube') {
        await galleryAPI.create({
          title: formData.title,
          description: formData.description,
          url: formData.url,
          type: 'youtube',
        });
      } else {
        if (formData.files.length === 0) {
          alert('Please select at least one file');
          return;
        }
        // Convert each file to base64 and save as gallery item
        for (const file of formData.files) {
          const base64 = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
          await galleryAPI.create({
            title: formData.title || file.name,
            description: formData.description,
            url: base64,
            type: activeTab === 'images' ? 'image' : 'video',
          });
        }
      }
      await fetchGalleryData();
      alert('Added successfully!');
      resetForm();
    } catch (error) {
      console.error('Error adding gallery item:', error);
      alert('Failed to add item: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await galleryAPI.delete(id);
      await fetchGalleryData();
      alert('Item deleted successfully!');
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item');
    }
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', url: '', files: [] });
    setShowAddForm(false);
  };

  const getYouTubeEmbedUrl = (url) => {
    const videoId = url?.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return videoId ? `https://www.youtube.com/embed/${videoId[1]}` : null;
  };

  const currentItems = activeTab === 'images' ? images : activeTab === 'videos' ? videos : youtubeLinks;

  return (
    <div className="page" style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', color: '#0B1C3F', marginBottom: '2rem', fontSize: '2.5rem' }}>
        🖼️ Gallery Management
      </h1>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {[
          { key: 'images', label: '📷 Images', count: images.length },
          { key: 'videos', label: '🎥 Videos', count: videos.length },
          { key: 'youtube', label: '▶️ YouTube', count: youtubeLinks.length },
        ].map(({ key, label, count }) => (
          <button key={key} onClick={() => setActiveTab(key)} style={{
            padding: '12px 30px', fontSize: '1rem',
            backgroundColor: activeTab === key ? '#E6B325' : 'white',
            color: activeTab === key ? '#0B1C3F' : '#666',
            border: activeTab === key ? '2px solid #E6B325' : '2px solid #ddd',
            borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.3s ease'
          }}>
            {label} ({count})
          </button>
        ))}
      </div>

      {/* Add Button */}
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <button onClick={() => setShowAddForm(!showAddForm)} style={{
          padding: '12px 30px', fontSize: '1rem', backgroundColor: '#28a745',
          color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold'
        }}>
          ➕ Add {activeTab === 'images' ? 'Image(s)' : activeTab === 'videos' ? 'Video(s)' : 'YouTube Link'}
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', color: '#0B1C3F' }}>
            Add New {activeTab === 'images' ? 'Image(s)' : activeTab === 'videos' ? 'Video(s)' : 'YouTube Link'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Title *</label>
              <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem' }} />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Description</label>
              <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows="3"
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem', fontFamily: 'inherit' }} />
            </div>
            {activeTab === 'youtube' ? (
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>YouTube URL *</label>
                <input type="url" value={formData.url} onChange={e => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..." required
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem' }} />
              </div>
            ) : (
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Select {activeTab === 'images' ? 'Image' : 'Video'} File(s) *
                </label>
                <input type="file" onChange={handleFileChange} accept={activeTab === 'images' ? 'image/*' : 'video/*'} multiple required
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem' }} />
              </div>
            )}
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" style={{ padding: '0.75rem 2rem', backgroundColor: '#E6B325', color: '#0B1C3F', border: 'none', borderRadius: '4px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' }}>
                Add
              </button>
              <button type="button" onClick={resetForm} style={{ padding: '0.75rem 2rem', backgroundColor: '#ccc', color: '#333', border: 'none', borderRadius: '4px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Content Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#666' }}>Loading gallery...</div>
      ) : currentItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#666' }}>
          No {activeTab} yet. Add your first one!
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: activeTab === 'images' ? 'repeat(auto-fill, minmax(250px, 1fr))' : 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
          {currentItems.map((item) => (
            <div key={item.id} style={{ borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', backgroundColor: 'white' }}>
              {activeTab === 'images' && <img src={item.url} alt={item.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />}
              {activeTab === 'videos' && (
                <video controls style={{ width: '100%', height: '250px', backgroundColor: '#000' }}>
                  <source src={item.url} type="video/mp4" />
                </video>
              )}
              {activeTab === 'youtube' && (() => {
                const embedUrl = getYouTubeEmbedUrl(item.url);
                return embedUrl ? <iframe width="100%" height="250" src={embedUrl} title={item.title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{ display: 'block' }} /> : null;
              })()}
              <div style={{ padding: '1rem' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', color: '#0B1C3F' }}>{item.title}</h3>
                {item.description && <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: '#666' }}>{item.description}</p>}
                <button onClick={() => handleDelete(item.id)} style={{ padding: '0.5rem 1rem', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', fontSize: '0.85rem', cursor: 'pointer', marginTop: '0.5rem' }}>
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
