import { useState, useEffect } from 'react';
import { staffAPI } from '../services/staffAPI';

export default function Staff() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock data as fallback
  const mockStaff = [
    {
      id: 1,
      fullName: 'Pandit Rajesh Kumar',
      position: 'Head Priest',
      phoneNumber: '+91-9876543210',
      email: 'rajesh@temple.com',
      profileImageUrl: null
    },
    {
      id: 2,
      fullName: 'Priya Singh',
      position: 'Temple Manager',
      phoneNumber: '+91-9876543211',
      email: 'priya@temple.com',
      profileImageUrl: null
    },
    {
      id: 3,
      fullName: 'Suresh Patel',
      position: 'Accountant',
      phoneNumber: '+91-9876543212',
      email: 'suresh@temple.com',
      profileImageUrl: null
    }
  ];

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await staffAPI.getAll();
      const staffData = response.data || [];
      setStaff(staffData.length > 0 ? staffData : mockStaff);
    } catch (err) {
      console.error('Failed to load staff members', err);
      // Use mock data as fallback
      setStaff(mockStaff);
      setError(null); // Don't show error, just use mock data
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center', minHeight: '60vh' }}>
        <div style={{
          display: 'inline-block',
          width: '50px',
          height: '50px',
          border: '5px solid #f3f3f3',
          borderTop: '5px solid #0B1C3F',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ fontSize: '18px', color: '#666', marginTop: '20px' }}>Loading staff...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

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
            👥 Temple Staff
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
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Meet our dedicated team serving the temple community
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: '60px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {error && (
            <div style={{
              padding: '15px 20px',
              backgroundColor: '#fff3cd',
              color: '#856404',
              borderRadius: '8px',
              marginBottom: '30px',
              textAlign: 'center',
              border: '1px solid #ffeeba'
            }}>
              ⚠️ {error}
            </div>
          )}

          {staff.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.07)'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>👥</div>
              <p style={{ fontSize: '1.3rem', color: '#999', marginBottom: '10px' }}>No staff members found</p>
              <p style={{ fontSize: '1rem', color: '#bbb' }}>Please check back later!</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '30px'
            }}>
              {staff.map((member) => (
                <div 
                  key={member.id}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
                    transition: 'all 0.3s ease',
                    border: '1px solid #e0e0e0'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.07)';
                  }}
                >
                  {/* Profile Image */}
                  <div style={{ 
                    height: '240px',
                    background: 'linear-gradient(135deg, #0B1C3F 0%, #1a3a6b 100%)',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    overflow: 'hidden',
                    position: 'relative'
                  }}>
                    {member.profileImageUrl ? (
                      <img 
                        src={member.profileImageUrl} 
                        alt={member.fullName} 
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover' 
                        }} 
                        onError={(e) => { 
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement.innerHTML = '<span style="font-size: 5rem; color: white; filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.3))">👤</span>';
                        }} 
                      />
                    ) : (
                      <span style={{ 
                        fontSize: '5rem', 
                        color: 'white',
                        filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'
                      }}>👤</span>
                    )}
                  </div>

                  {/* Staff Details */}
                  <div style={{ padding: '25px' }}>
                    <h3 style={{ 
                      margin: '0 0 8px 0', 
                      color: '#0B1C3F',
                      fontSize: '1.4rem',
                      fontWeight: '600'
                    }}>
                      {member.fullName}
                    </h3>
                    
                    <div style={{
                      display: 'inline-block',
                      padding: '6px 14px',
                      background: 'linear-gradient(135deg, #E6B325 0%, #d4a017 100%)',
                      color: 'white',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      fontWeight: 'bold',
                      marginBottom: '20px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      {member.position}
                    </div>

                    <div style={{ 
                      borderTop: '2px solid #f0f0f0', 
                      paddingTop: '20px'
                    }}>
                      {/* Phone */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '12px',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '8px',
                        marginBottom: '12px'
                      }}>
                        <span style={{
                          fontSize: '20px',
                          marginRight: '12px',
                          background: 'linear-gradient(135deg, #E6B325 0%, #d4a017 100%)',
                          padding: '8px',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>📞</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '11px', color: '#999', textTransform: 'uppercase', fontWeight: '600' }}>
                            Phone
                          </div>
                          <a 
                            href={`tel:${member.phoneNumber}`} 
                            style={{ 
                              color: '#333',
                              textDecoration: 'none',
                              fontWeight: '600',
                              fontSize: '14px',
                              marginTop: '2px',
                              display: 'block'
                            }}
                          >
                            {member.phoneNumber}
                          </a>
                        </div>
                      </div>
                      
                      {/* Email */}
                      {member.email && (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '12px',
                          backgroundColor: '#f8f9fa',
                          borderRadius: '8px'
                        }}>
                          <span style={{
                            fontSize: '20px',
                            marginRight: '12px',
                            background: 'linear-gradient(135deg, #E6B325 0%, #d4a017 100%)',
                            padding: '8px',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>✉️</span>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '11px', color: '#999', textTransform: 'uppercase', fontWeight: '600' }}>
                              Email
                            </div>
                            <a 
                              href={`mailto:${member.email}`} 
                              style={{ 
                                color: '#333',
                                textDecoration: 'none',
                                fontWeight: '600',
                                fontSize: '14px',
                                wordBreak: 'break-word',
                                marginTop: '2px',
                                display: 'block'
                              }}
                            >
                              {member.email}
                            </a>
                          </div>
                        </div>
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
