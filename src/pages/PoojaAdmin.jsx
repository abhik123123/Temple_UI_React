import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { poojaBooksAPI } from '../services/postgresAPI';

export default function PoojaAdmin() {
  const { t } = useLanguage();
  const [books, setBooks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'general',
    description: '',
    details: '',
    icon: '📚',
    language: 'Sanskrit & English',
    pages: 0,
    downloadable: true,
    level: 'beginner'
  });

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = () => {
    poojaBooksAPI.getAll()
      .then(data => setBooks(data))
      .catch(err => console.error('Failed to load pooja books:', err));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      setFormData({ ...formData, image: file });

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, image: null, imageUrl: '' });
    setImagePreview(null);
    // Reset the file input
    const fileInput = document.getElementById('image-upload');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        details: typeof formData.details === 'string'
          ? formData.details.split(',').map(d => d.trim()).filter(Boolean)
          : formData.details,
      };
      if (editingBook) {
        await poojaBooksAPI.update(editingBook.id, payload);
      } else {
        await poojaBooksAPI.create(payload);
      }
      loadBooks();
      closeModal();
    } catch (error) {
      alert('Error saving book: ' + error.message);
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      category: book.category,
      description: book.description,
      details: Array.isArray(book.details) ? book.details.join(', ') : '',
      icon: book.icon || '📚',
      language: book.language,
      pages: book.pages,
      downloadable: book.downloadable !== false,
      level: book.level
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      await poojaBooksAPI.delete(id);
      loadBooks();
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBook(null);
    setImagePreview(null);
    setFormData({
      title: '',
      category: 'general',
      description: '',
      details: '',
      icon: '📚',
      language: 'Sanskrit & English',
      pages: 0,
      downloadable: true,
      level: 'beginner'
    });
  };

  return (
    <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '40px',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <h1 style={{ fontSize: '2.5rem', color: '#0B1C3F', margin: 0 }}>
            📚 Pooja Books Management
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
            ➕ Add New Book
          </button>
        </div>

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
                  <th style={{ padding: '15px', textAlign: 'left' }}>Image</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Title</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Category</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Level</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Pages</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Language</th>
                  <th style={{ padding: '15px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book, index) => (
                  <tr key={book.id} style={{ 
                    borderBottom: '1px solid #e0e0e0',
                    backgroundColor: index % 2 === 0 ? '#f9fafb' : 'white'
                  }}>
                    <td style={{ padding: '15px' }}>
                      {book.imageUrl ? (
                        <img 
                          src={book.imageUrl} 
                          alt={book.title}
                          style={{ 
                            width: '50px', 
                            height: '50px', 
                            objectFit: 'cover', 
                            borderRadius: '8px',
                            border: '2px solid #E6B325'
                          }} 
                        />
                      ) : (
                        <div style={{
                          width: '50px',
                          height: '50px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '2rem',
                          backgroundColor: '#f0f0f0',
                          borderRadius: '8px'
                        }}>
                          {book.icon || '📚'}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '15px', fontWeight: '600' }}>{book.title}</td>
                    <td style={{ padding: '15px' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '12px',
                        backgroundColor: '#E6B325',
                        color: 'white',
                        fontSize: '0.85rem',
                        textTransform: 'capitalize'
                      }}>
                        {book.category}
                      </span>
                    </td>
                    <td style={{ padding: '15px' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '12px',
                        backgroundColor: book.level === 'beginner' ? '#4CAF50' : book.level === 'intermediate' ? '#FF9800' : '#F44336',
                        color: 'white',
                        fontSize: '0.85rem',
                        textTransform: 'capitalize'
                      }}>
                        {book.level}
                      </span>
                    </td>
                    <td style={{ padding: '15px', fontSize: '0.9rem' }}>{book.pages}</td>
                    <td style={{ padding: '15px', fontSize: '0.9rem' }}>{book.language}</td>
                    <td style={{ padding: '15px' }}>
                      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                        <button
                          onClick={() => handleEdit(book)}
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
                          onClick={() => handleDelete(book.id)}
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
              {editingBook ? '✏️ Edit Book' : '➕ Add New Book'}
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
                    <option value="shiva">Shiva</option>
                    <option value="vishnu">Vishnu</option>
                    <option value="ganesha">Ganesha</option>
                    <option value="devi">Devi</option>
                    <option value="krishna">Krishna</option>
                    <option value="rama">Rama</option>
                    <option value="hanuman">Hanuman</option>
                    <option value="general">General</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                    Level *
                  </label>
                  <select
                    required
                    value={formData.level}
                    onChange={e => setFormData({...formData, level: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                  Image Upload
                </label>
                
                {imagePreview ? (
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      style={{ 
                        width: '150px', 
                        height: '150px', 
                        objectFit: 'cover', 
                        borderRadius: '8px',
                        border: '2px solid #E6B325'
                      }} 
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '30px',
                        height: '30px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      style={{
                        display: 'inline-block',
                        padding: '40px 60px',
                        border: '2px dashed #E6B325',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        textAlign: 'center',
                        backgroundColor: '#fffbf0',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={e => e.target.style.backgroundColor = '#fff8e1'}
                      onMouseLeave={e => e.target.style.backgroundColor = '#fffbf0'}
                    >
                      <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📤</div>
                      <div style={{ fontWeight: '600', color: '#0B1C3F', marginBottom: '5px' }}>
                        Click to upload image
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#666' }}>
                        PNG, JPG, GIF up to 5MB
                      </div>
                    </label>
                  </div>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                    Pages *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.pages}
                    onChange={e => setFormData({...formData, pages: parseInt(e.target.value)})}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                  Language *
                </label>
                <input
                  type="text"
                  required
                  value={formData.language}
                  onChange={e => setFormData({...formData, language: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                  placeholder="e.g., Sanskrit & English"
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
                  placeholder="e.g., Complete text, Meanings included, Pronunciation guide"
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.downloadable}
                    onChange={e => setFormData({...formData, downloadable: e.target.checked})}
                    style={{ marginRight: '8px', width: '18px', height: '18px' }}
                  />
                  <span style={{ fontWeight: '600', color: '#333' }}>⬇️ Downloadable</span>
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
                  {editingBook ? 'Update' : 'Add'} Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
