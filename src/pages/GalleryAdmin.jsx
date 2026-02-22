import React, { useState, useEffect } from 'react';

export default function GalleryAdmin() {
  const [activeTab, setActiveTab] = useState('images');
  const [galleryData, setGalleryData] = useState({
    images: [],
    videos: [],
    youtubeLinks: []
  });
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
      const response = await fetch('/api/gallery');
      const data = await response.json();
      setGalleryData(data);
    } catch (error) {
      console.error('Error fetching gallery data:', error);
      // Use mock data for local development
      setGalleryData({
        images: [],
        videos: [],
        youtubeLinks: []
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFormData({ ...formData, files: selectedFiles });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (activeTab === 'youtube') {
      // Add YouTube link
      const newLink = {
        id: Date.now(),
        title: formData.title,
        description: formData.description,
        url: formData.url,
        createdAt: new Date().toISOString()
      };

      try {
        // In production, send to API
        // const response = await fetch('/api/gallery/youtube', { method: 'POST', body: JSON.stringify(newLink) });
        
        // For now, add locally
        setGalleryData({
          ...galleryData,
          youtubeLinks: [...galleryData.youtubeLinks, newLink]
        });
        
        alert('YouTube link added successfully!');
        resetForm();
      } catch (error) {
        console.error('Error adding YouTube link:', error);
        alert('Failed to add YouTube link');
      }
    } else {
      // Handle file uploads (images or videos)
      if (formData.files.length === 0) {
        alert('Please select at least one file');
        return;
      }

      const formDataToSend = new FormData();
      formData.files.forEach((file) => {
        formDataToSend.append('files', file);
      });
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('type', activeTab);

      try {
        // In production, send to API
        // const response = await fetch('/api/gallery/upload', { method: 'POST', body: formDataToSend });
        
        // For now, create mock entries
        const newItems = formData.files.map((file, index) => ({
          id: Date.now() + index,
          title: formData.title || file.name,
          description: formData.description,
          url: URL.createObjectURL(file),
          createdAt: new Date().toISOString()
        }));

        if (activeTab === 'images') {
          setGalleryData({
            ...galleryData,
            images: [...galleryData.images, ...newItems]
          });
        } else {
          setGalleryData({
            ...galleryData,
            videos: [...galleryData.videos, ...newItems]
          });
        }

        alert(`${formData.files.length} ${activeTab} added successfully!`);
        resetForm();
      } catch (error) {
        console.error('Error uploading files:', error);
        alert('Failed to upload files');
      }
    }
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      // In production, call API
      // await fetch(`/api/gallery/${type}/${id}`, { method: 'DELETE' });

      // For now, remove locally
      if (type === 'images') {
        setGalleryData({
          ...galleryData,
          images: galleryData.images.filter(item => item.id !== id)
        });
      } else if (type === 'videos') {
        setGalleryData({
          ...galleryData,
          videos: galleryData.videos.filter(item => item.id !== id)
        });
      } else if (type === 'youtube') {
        setGalleryData({
          ...galleryData,
          youtubeLinks: galleryData.youtubeLinks.filter(item => item.id !== id)
        });
      }

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
    const videoId = url.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/);
    return videoId ? `https://www.youtube.com/embed/${videoId[1]}` : null;
  };

  const renderAddForm = () => (
    <div style={{
      backgroundColor: 'white',
      padding: '2rem',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      marginBottom: '2rem'
    }}>
      <h3 style={{ marginBottom: '1.5rem', color: '#0B1C3F' }}>
        Add New {activeTab === 'images' ? 'Image(s)' : activeTab === 'videos' ? 'Video(s)' : 'YouTube Link'}
      </h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem'
            }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows="3"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem',
              fontFamily: 'inherit'
            }}
          />
        </div>

        {activeTab === 'youtube' ? (
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              YouTube URL *
            </label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://www.youtube.com/watch?v=..."
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            />
          </div>
        ) : (
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Select {activeTab === 'images' ? 'Image' : 'Video'} File(s) *
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              accept={activeTab === 'images' ? 'image/*' : 'video/*'}
              multiple
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            />
            <small style={{ color: '#666', display: 'block', marginTop: '0.5rem' }}>
              You can select multiple files at once
            </small>
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            type="submit"
            style={{
              padding: '0.75rem 2rem',
              backgroundColor: '#E6B325',
              color: '#0B1C3F',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Add {activeTab === 'images' || activeTab === 'videos' ? `${activeTab}` : 'Link'}
          </button>
          <button
            type="button"
            onClick={resetForm}
            style={{
              padding: '0.75rem 2rem',
              backgroundColor: '#ccc',
              color: '#333',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );

  const renderImagesGrid = () => (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
      gap: '1.5rem'
    }}>
      {galleryData.images.map((image) => (
        <div
          key={image.id}
          style={{
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            backgroundColor: 'white',
            position: 'relative'
          }}
        >
          <img
            src={image.url}
            alt={image.title}
            style={{
              width: '100%',
              height: '200px',
              objectFit: 'cover'
            }}
          />
          <div style={{ padding: '1rem' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', color: '#0B1C3F' }}>{image.title}</h3>
            {image.description && (
              <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: '#666' }}>{image.description}</p>
            )}
            <button
              onClick={() => handleDelete(image.id, 'images')}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '0.85rem',
                cursor: 'pointer',
                marginTop: '0.5rem'
              }}
            >
              🗑️ Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderVideosGrid = () => (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
      gap: '2rem'
    }}>
      {galleryData.videos.map((video) => (
        <div
          key={video.id}
          style={{
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            backgroundColor: 'white'
          }}
        >
          <video
            controls
            style={{
              width: '100%',
              height: '250px',
              backgroundColor: '#000'
            }}
          >
            <source src={video.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div style={{ padding: '1rem' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', color: '#0B1C3F' }}>{video.title}</h3>
            {video.description && (
              <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: '#666' }}>{video.description}</p>
            )}
            <button
              onClick={() => handleDelete(video.id, 'videos')}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '0.85rem',
                cursor: 'pointer',
                marginTop: '0.5rem'
              }}
            >
              🗑️ Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderYouTubeGrid = () => (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
      gap: '2rem'
    }}>
      {galleryData.youtubeLinks.map((link) => {
        const embedUrl = getYouTubeEmbedUrl(link.url);
        return (
          <div
            key={link.id}
            style={{
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              backgroundColor: 'white'
            }}
          >
            {embedUrl && (
              <iframe
                width="100%"
                height="250"
                src={embedUrl}
                title={link.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ display: 'block' }}
              />
            )}
            <div style={{ padding: '1rem' }}>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', color: '#0B1C3F' }}>{link.title}</h3>
              {link.description && (
                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: '#666' }}>{link.description}</p>
              )}
              <button
                onClick={() => handleDelete(link.id, 'youtube')}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  marginTop: '0.5rem'
                }}
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="page" style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', color: '#0B1C3F', marginBottom: '2rem', fontSize: '2.5rem' }}>
        🖼️ Gallery Management
      </h1>

      {/* Tab Navigation */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '1rem',
        marginBottom: '2rem',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => setActiveTab('images')}
          style={{
            padding: '12px 30px',
            fontSize: '1rem',
            backgroundColor: activeTab === 'images' ? '#E6B325' : 'white',
            color: activeTab === 'images' ? '#0B1C3F' : '#666',
            border: activeTab === 'images' ? '2px solid #E6B325' : '2px solid #ddd',
            borderRadius: '25px',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'all 0.3s ease'
          }}
        >
          📷 Images ({galleryData.images.length})
        </button>
        <button
          onClick={() => setActiveTab('videos')}
          style={{
            padding: '12px 30px',
            fontSize: '1rem',
            backgroundColor: activeTab === 'videos' ? '#E6B325' : 'white',
            color: activeTab === 'videos' ? '#0B1C3F' : '#666',
            border: activeTab === 'videos' ? '2px solid #E6B325' : '2px solid #ddd',
            borderRadius: '25px',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'all 0.3s ease'
          }}
        >
          🎥 Videos ({galleryData.videos.length})
        </button>
        <button
          onClick={() => setActiveTab('youtube')}
          style={{
            padding: '12px 30px',
            fontSize: '1rem',
            backgroundColor: activeTab === 'youtube' ? '#E6B325' : 'white',
            color: activeTab === 'youtube' ? '#0B1C3F' : '#666',
            border: activeTab === 'youtube' ? '2px solid #E6B325' : '2px solid #ddd',
            borderRadius: '25px',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'all 0.3s ease'
          }}
        >
          ▶️ YouTube ({galleryData.youtubeLinks.length})
        </button>
      </div>

      {/* Add Button */}
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          style={{
            padding: '12px 30px',
            fontSize: '1rem',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          ➕ Add {activeTab === 'images' ? 'Image(s)' : activeTab === 'videos' ? 'Video(s)' : 'YouTube Link'}
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && renderAddForm()}

      {/* Content Area */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#666' }}>
          <p>Loading gallery...</p>
        </div>
      ) : (
        <>
          {activeTab === 'images' && (galleryData.images.length > 0 ? renderImagesGrid() : (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#666' }}>
              <p>No images yet. Add your first image!</p>
            </div>
          ))}
          {activeTab === 'videos' && (galleryData.videos.length > 0 ? renderVideosGrid() : (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#666' }}>
              <p>No videos yet. Add your first video!</p>
            </div>
          ))}
          {activeTab === 'youtube' && (galleryData.youtubeLinks.length > 0 ? renderYouTubeGrid() : (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#666' }}>
              <p>No YouTube links yet. Add your first link!</p>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
