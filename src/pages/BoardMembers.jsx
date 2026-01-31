import { useState, useEffect } from 'react';
import { boardMembersAPI } from '../services/boardMembersAPI';

export default function BoardMembers() {
  const [boardMembers, setBoardMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [filterDept, setFilterDept] = useState('All');

  // Fetch board members on mount
  useEffect(() => {
    const fetchBoardMembers = async () => {
      try {
        setLoading(true);
        const response = await boardMembersAPI.getAll();
        setBoardMembers(Array.isArray(response.data) ? response.data : response.data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching board members:', err);
        setBoardMembers([]);
        setError('Unable to load board members. Please ensure the backend is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchBoardMembers();
  }, []);

  // Get unique departments
  const departments = boardMembers.length > 0
    ? ['All', ...new Set(boardMembers.map(m => m.department))]
    : ['All'];

  // Filter members by department
  const filteredMembers = filterDept === 'All' 
    ? boardMembers 
    : boardMembers.filter(m => m.department === filterDept);

  return (
    <div className="page">
      {/* Hero Section */}
      <div className="hero" style={{
        backgroundImage: 'url(/images/temple-images/temple-main.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)'
        }}></div>
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <h1 style={{ color: 'white', fontSize: '2.5rem' }}>👥 Board Members</h1>
          <p style={{ color: '#f0f0f0', fontSize: '1.1rem' }}>Meet our temple leadership team</p>
        </div>
      </div>

      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: '#8b4513', textAlign: 'center', marginBottom: '1.5rem' }}>Temple Management Board</h2>
          
          {/* Department Filter */}
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '2rem'
          }}>
            {departments.map(dept => (
              <button
                key={dept}
                onClick={() => setFilterDept(dept)}
                disabled={loading || !boardMembers.length}
                style={{
                  padding: '0.5rem 1rem',
                  border: 'none',
                  background: filterDept === dept ? '#8b4513' : '#f0f0f0',
                  color: filterDept === dept ? 'white' : '#333',
                  borderRadius: '20px',
                  cursor: loading || !boardMembers.length ? 'not-allowed' : 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  transition: 'all 0.3s'
                }}
              >
                {dept}
              </button>
            ))}
          </div>

          {loading && (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
              Loading board members...
            </div>
          )}

          {error && (
            <div style={{ background: '#ffe5e5', padding: '1rem', borderRadius: '4px', color: '#d32f2f', marginBottom: '1rem' }}>
              ⚠️ {error}
            </div>
          )}

          {/* Board Members Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '2rem',
            marginBottom: '2rem'
          }}>
            {filteredMembers.map(member => (
              <div
                key={member.id}
                onClick={() => setSelectedMember(member)}
                style={{
                  background: 'white',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  transition: 'transform 0.3s, boxShadow 0.3s',
                  transform: 'translateY(0)',
                  ':hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.15)'
                  }
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                }}
              >
                {/* Member Image */}
                <div style={{
                  height: '220px',
                  background: 'linear-gradient(135deg, #8b4513 0%, #a0522d 100%)',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <img
                    src={member.profileImageUrl}
                    alt={member.fullName}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.style.background = 'linear-gradient(135deg, #8b4513 0%, #a0522d 100%)';
                      e.target.parentElement.innerHTML = '👤';
                      e.target.parentElement.style.fontSize = '3rem';
                      e.target.parentElement.style.color = 'white';
                    }}
                  />
                </div>

                {/* Member Info */}
                <div style={{ padding: '1.5rem' }}>
                  <h3 style={{ color: '#8b4513', margin: '0 0 0.5rem 0', fontSize: '1.2rem' }}>
                    {member.fullName}
                  </h3>
                  
                  <p style={{
                    color: '#d4a574',
                    fontWeight: 'bold',
                    margin: '0.25rem 0',
                    fontSize: '0.95rem'
                  }}>
                    {member.position}
                  </p>

                  <p style={{
                    color: '#999',
                    margin: '0.25rem 0 1rem 0',
                    fontSize: '0.85rem'
                  }}>
                    {member.department}
                  </p>

                  <div style={{ borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                    <p style={{ margin: '0.25rem 0', fontSize: '0.85rem', color: '#666' }}>
                      📞 <a href={`tel:${member.phoneNumber}`} style={{ color: '#8b4513', textDecoration: 'none' }}>
                        {member.phoneNumber}
                      </a>
                    </p>
                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: '#666' }}>
                      ✉️ <a href={`mailto:${member.email}`} style={{ color: '#8b4513', textDecoration: 'none' }}>
                        {member.email}
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {(!loading && filteredMembers.length === 0) && (
            <div style={{
              textAlign: 'center',
              padding: '3rem 1rem',
              color: '#999'
            }}>
              No board members found in this department.
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedMember && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={() => setSelectedMember(null)}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '8px',
              maxWidth: '600px',
              width: '90%',
              maxHeight: '80vh',
              overflow: 'auto',
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              background: 'linear-gradient(135deg, #8b4513 0%, #a0522d 100%)',
              padding: '2rem',
              color: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h2 style={{ margin: 0 }}>{selectedMember.fullName}</h2>
              <button
                onClick={() => setSelectedMember(null)}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  color: 'white',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  padding: '0 0.5rem',
                  borderRadius: '4px'
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ padding: '2rem' }}>
              <img
                src={selectedMember.profileImageUrl}
                alt={selectedMember.fullName}
                style={{
                  width: '100%',
                  height: '300px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  marginBottom: '1.5rem'
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />

              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ color: '#8b4513', marginTop: 0 }}>Position & Department</h3>
                <p style={{ margin: '0.25rem 0', color: '#333' }}>
                  <strong>Position:</strong> {selectedMember.position}
                </p>
                <p style={{ margin: '0.25rem 0', color: '#333' }}>
                  <strong>Department:</strong> {selectedMember.department}
                </p>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ color: '#8b4513', marginTop: 0 }}>Contact Information</h3>
                <p style={{ margin: '0.25rem 0', color: '#333' }}>
                  📞 <a href={`tel:${selectedMember.phoneNumber}`} style={{ color: '#8b4513', textDecoration: 'none' }}>
                    {selectedMember.phoneNumber}
                  </a>
                </p>
                <p style={{ margin: '0.25rem 0', color: '#333' }}>
                  ✉️ <a href={`mailto:${selectedMember.email}`} style={{ color: '#8b4513', textDecoration: 'none' }}>
                    {selectedMember.email}
                  </a>
                </p>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ color: '#8b4513', marginTop: 0 }}>Biography</h3>
                <p style={{ color: '#666', lineHeight: '1.6' }}>
                  {selectedMember.biography}
                </p>
              </div>

              <button
                onClick={() => setSelectedMember(null)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: '#8b4513',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 'bold'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
