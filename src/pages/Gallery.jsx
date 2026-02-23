import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { usePageTracking } from '../hooks/usePageTracking';

export default function Gallery() {
  // Track page view
  usePageTracking('Gallery');
  
  // const { t } = useLanguage(); // Not currently used
  const [activeTab, setActiveTab] = useState('images');
  const [galleryData, setGalleryData] = useState({
    images: [],
    videos: [],
    youtubeLinks: []
  });
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState(null);

  useEffect(() => {
    fetchGalleryData();
  }, []);

  const fetchGalleryData = async () => {
    try {
      setLoading(true);
      // Load from localStorage
      const savedImages = JSON.parse(localStorage.getItem('temple_gallery_images') || '[]');
      const savedVideos = JSON.parse(localStorage.getItem('temple_gallery_videos') || '[]');
      const savedYoutubeLinks = JSON.parse(localStorage.getItem('temple_gallery_youtube') || '[]');
      
      console.log('Gallery data loaded from localStorage:');
      console.log('✓ Images:', savedImages.length);
      console.log('✓ Videos:', savedVideos.length);
      console.log('✓ YouTube Links:', savedYoutubeLinks.length);
      
      setGalleryData({
        images: savedImages,
        videos: savedVideos,
        youtubeLinks: savedYoutubeLinks
      });
    } catch (error) {
      console.error('Error fetching gallery data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getYouTubeEmbedUrl = (url) => {
    const videoId = url.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/);
    return videoId ? `https://www.youtube.com/embed/${videoId[1]}` : null;
  };

  const openLightbox = (media) => {
    setSelectedMedia(media);
  };

  const closeLightbox = () => {
    setSelectedMedia(null);
  };

  const renderImages = () => (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
      gap: '1.5rem',
      padding: '2rem'
    }}>
      {galleryData.images.map((image, index) => (
        <div
          key={index}
          onClick={() => openLightbox({ type: 'image', src: image.url, title: image.title })}
          style={{
            cursor: 'pointer',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            backgroundColor: 'white'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
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
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#666' }}>{image.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderVideos = () => (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
      gap: '2rem',
      padding: '2rem'
    }}>
      {galleryData.videos.map((video, index) => (
        <div
          key={index}
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
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#666' }}>{video.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderYouTubeLinks = () => (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
      gap: '2rem',
      padding: '2rem'
    }}>
      {galleryData.youtubeLinks.map((link, index) => {
        const embedUrl = getYouTubeEmbedUrl(link.url);
        return (
          <div
            key={index}
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
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#666' }}>{link.description}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="page" style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', color: '#0B1C3F', marginBottom: '2rem', fontSize: '2.5rem' }}>
        🖼️ Temple Gallery
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

      {/* Content Area */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#666' }}>
          <p>Loading gallery...</p>
        </div>
      ) : (
        <>
          {activeTab === 'images' && (galleryData.images.length > 0 ? renderImages() : (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#666' }}>
              <p>No images available yet.</p>
            </div>
          ))}
          {activeTab === 'videos' && (galleryData.videos.length > 0 ? renderVideos() : (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#666' }}>
              <p>No videos available yet.</p>
            </div>
          ))}
          {activeTab === 'youtube' && (galleryData.youtubeLinks.length > 0 ? renderYouTubeLinks() : (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#666' }}>
              <p>No YouTube links available yet.</p>
            </div>
          ))}
        </>
      )}

      {/* Lightbox Modal */}
      {selectedMedia && (
        <div
          onClick={closeLightbox}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '2rem'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: '90%',
              maxHeight: '90%'
            }}
          >
            <button
              onClick={closeLightbox}
              style={{
                position: 'absolute',
                top: '-40px',
                right: '0',
                background: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                fontSize: '1.5rem',
                cursor: 'pointer',
                color: '#333'
              }}
            >
              ×
            </button>
            <img
              src={selectedMedia.src}
              alt={selectedMedia.title}
              style={{
                maxWidth: '100%',
                maxHeight: '80vh',
                objectFit: 'contain',
                borderRadius: '8px'
              }}
            />
            {selectedMedia.title && (
              <p style={{
                color: 'white',
                textAlign: 'center',
                marginTop: '1rem',
                fontSize: '1.2rem'
              }}>
                {selectedMedia.title}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
