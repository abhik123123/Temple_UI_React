import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { poojaBooksAPI } from '../services/postgresAPI';

export default function PoojaBooks() {
  const { t } = useLanguage();
  const [books, setBooks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');

  useEffect(() => {
    poojaBooksAPI.getAll()
      .then(data => setBooks(data))
      .catch(err => console.error('Failed to load pooja books:', err));
  }, []);

  const categories = ['all', 'shiva', 'vishnu', 'ganesha', 'devi', 'krishna', 'rama', 'hanuman', 'general'];
  const levels = ['all', 'beginner', 'intermediate', 'advanced'];
  
  const filteredBooks = books.filter(book => {
    const categoryMatch = selectedCategory === 'all' || book.category === selectedCategory;
    const levelMatch = selectedLevel === 'all' || book.level === selectedLevel;
    return categoryMatch && levelMatch;
  });

  return (
    <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #0B1C3F 0%, #1a3a6b 50%, #0B1C3F 100%)',
        padding: '80px 20px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(230, 179, 37, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(230, 179, 37, 0.1) 0%, transparent 50%)',
          pointerEvents: 'none'
        }}></div>
        
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{
            fontSize: '3.5rem',
            color: 'white',
            marginBottom: '15px',
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            letterSpacing: '1px'
          }}>
            📚 Pooja Books
          </h1>
          <div style={{
            height: '4px',
            width: '100px',
            backgroundColor: '#E6B325',
            margin: '0 auto 20px',
            borderRadius: '2px'
          }}></div>
          <p style={{
            fontSize: '1.2rem',
            color: '#b0c4de',
            maxWidth: '700px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Learn Vedic Knowledge and Traditions
          </p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ 
        padding: '30px 20px',
        backgroundColor: 'white',
        borderBottom: '1px solid #e0e0e0'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Category Filter */}
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1rem', color: '#666', marginBottom: '10px', fontWeight: '600' }}>
              Filter by Deity:
            </h3>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  style={{
                    padding: '8px 20px',
                    borderRadius: '20px',
                    border: selectedCategory === category ? '2px solid #E6B325' : '2px solid #ddd',
                    background: selectedCategory === category ? 'linear-gradient(135deg, #E6B325 0%, #d4a017 100%)' : 'white',
                    color: selectedCategory === category ? 'white' : '#666',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '600',
                    textTransform: 'capitalize',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Level Filter */}
          <div>
            <h3 style={{ fontSize: '1rem', color: '#666', marginBottom: '10px', fontWeight: '600' }}>
              Filter by Level:
            </h3>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
              {levels.map(level => (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  style={{
                    padding: '8px 20px',
                    borderRadius: '20px',
                    border: selectedLevel === level ? '2px solid #0B1C3F' : '2px solid #ddd',
                    background: selectedLevel === level ? '#0B1C3F' : 'white',
                    color: selectedLevel === level ? 'white' : '#666',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '600',
                    textTransform: 'capitalize',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: '60px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {filteredBooks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#666' }}>
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📚</div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>No Books Found</h3>
              <p>Try adjusting your filters to see more books</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '30px'
            }}>
              {filteredBooks.map(book => (
                <div
                  key={book.id}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    border: '1px solid #e0e0e0'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.07)';
                  }}
                >
                  {/* Header */}
                  <div style={{
                    padding: '40px 25px',
                    background: 'linear-gradient(135deg, #0B1C3F 0%, #1a3a6b 100%)',
                    color: 'white',
                    textAlign: 'center',
                    position: 'relative'
                  }}>
                    <div style={{
                      fontSize: '4rem',
                      marginBottom: '15px',
                      filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.2))'
                    }}>
                      {book.icon}
                    </div>
                    <h3 style={{ 
                      margin: '0', 
                      fontSize: '1.4rem',
                      fontWeight: '600',
                      lineHeight: '1.3',
                      marginBottom: '8px'
                    }}>
                      {book.title}
                    </h3>
                  </div>

                  {/* Details */}
                  <div style={{ padding: '25px' }}>
                    {/* Badges */}
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '12px',
                        backgroundColor: '#E6B325',
                        color: 'white',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        textTransform: 'capitalize'
                      }}>
                        {book.category}
                      </span>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '12px',
                        backgroundColor: book.level === 'beginner' ? '#4CAF50' : book.level === 'intermediate' ? '#FF9800' : '#F44336',
                        color: 'white',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        textTransform: 'capitalize'
                      }}>
                        {book.level}
                      </span>
                    </div>

                    {/* Meta Info */}
                    <div style={{ display: 'flex', gap: '15px', marginBottom: '15px', fontSize: '0.85rem', color: '#666' }}>
                      <span>📄 {book.pages} pages</span>
                      <span>🌐 {book.language}</span>
                    </div>

                    {/* Description */}
                    <p style={{
                      color: '#666',
                      fontSize: '14px',
                      lineHeight: '1.6',
                      marginBottom: '20px',
                      minHeight: '42px'
                    }}>
                      {book.description}
                    </p>

                    {/* Details List */}
                    {book.details && book.details.length > 0 && (
                      <div style={{
                        backgroundColor: '#f8f9fa',
                        padding: '15px',
                        borderRadius: '8px',
                        marginBottom: '20px'
                      }}>
                        <h4 style={{ 
                          margin: '0 0 10px 0', 
                          fontSize: '0.9rem',
                          color: '#0B1C3F',
                          fontWeight: '600'
                        }}>
                          What's Inside:
                        </h4>
                        <ul style={{ 
                          margin: 0, 
                          paddingLeft: '20px',
                          listStyle: 'none'
                        }}>
                          {book.details.map((detail, idx) => (
                            <li key={idx} style={{ 
                              marginBottom: '6px',
                              color: '#555',
                              fontSize: '13px',
                              position: 'relative',
                              paddingLeft: '8px'
                            }}>
                              <span style={{ 
                                color: '#E6B325', 
                                marginRight: '8px',
                                fontWeight: 'bold'
                              }}>✓</span>
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        style={{
                          flex: 1,
                          padding: '12px',
                          background: 'linear-gradient(135deg, #0B1C3F 0%, #1a3a6b 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '600',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={e => e.target.style.opacity = '0.9'}
                        onMouseLeave={e => e.target.style.opacity = '1'}
                      >
                        📖 Read Online
                      </button>
                      {book.downloadable && (
                        <button
                          style={{
                            flex: 1,
                            padding: '12px',
                            background: 'linear-gradient(135deg, #E6B325 0%, #d4a017 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '600',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={e => e.target.style.opacity = '0.9'}
                          onMouseLeave={e => e.target.style.opacity = '1'}
                        >
                          ⬇️ Download
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
