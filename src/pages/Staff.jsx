import { useState, useEffect } from 'react';
import { staffAPI } from '../services/staffAPI';

const departments = ['All', 'Religious', 'Operations', 'Community', 'Finance', 'Administration'];

export default function Staff() {
  const [staff, setStaff] = useState([]);
  const [selected, setSelected] = useState(null);
  const [department, setDepartment] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    const fetchStaff = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = department === 'All'
          ? await staffAPI.getAll()
          : await staffAPI.getByDepartment(department);
        if (!active) return;
        const data = Array.isArray(response.data) ? response.data : response.data || [];
        setStaff(data);
      } catch (err) {
        console.error('Failed to load staff members', err);
        if (active) {
          setStaff([]);
          setError('Unable to connect to the backend. Please ensure it is running at http://localhost:8080.');
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchStaff();
    return () => {
      active = false;
    };
  }, [department]);

  return (
    <div className="page">
      <div className="hero" style={{
        backgroundImage: 'url(/images/temple-images/temple-main.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        position: 'relative'
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)' }} />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <h1 style={{ color: 'white', fontSize: '2.2rem' }}>🧑‍💼 Staff Members</h1>
          <p style={{ color: '#f0f0f0' }}>All temple personnel, grouped by department</p>
        </div>
      </div>

      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setDepartment(dept)}
              disabled={loading}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                border: 'none',
                background: department === dept ? '#8b4513' : '#f0f0f0',
                color: department === dept ? '#fff' : '#333',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: 'bold'
              }}
            >
              {dept}
            </button>
          ))}
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>Loading staff members...</div>
        )}

        {error && (
          <div style={{ background: '#ffe5e5', padding: '1rem', borderRadius: '4px', color: '#d32f2f', marginBottom: '1rem' }}>
            ⚠️ {error}
          </div>
        )}

        {!loading && !staff.length && (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#999' }}>
            No staff data available. Please start the backend at http://localhost:8080.
          </div>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {staff.map((member) => (
            <div key={member.id}
                 onClick={() => setSelected(member)}
                 style={{
                   background: 'white',
                   borderRadius: 8,
                   overflow: 'hidden',
                   boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
                   cursor: 'pointer'
                 }}>
              <div style={{ height: 200, background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {member.profileImageUrl
                  ? <img src={member.profileImageUrl} alt={member.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                  : <span style={{ fontSize: '2rem' }}>👤</span>
                }
              </div>
              <div style={{ padding: '1rem' }}>
                <h3 style={{ margin: 0, color: '#8b4513' }}>{member.fullName}</h3>
                <p style={{ margin: '0.25rem 0', color: '#d4a574', fontWeight: 'bold' }}>{member.position}</p>
                <p style={{ margin: 0, color: '#777' }}>{member.department}</p>
                <div style={{ borderTop: '1px solid #eee', marginTop: '0.75rem', paddingTop: '0.75rem' }}>
                  <p style={{ margin: '0.25rem 0', fontSize: 14 }}>📞 <a href={`tel:${member.phoneNumber}`} style={{ color: '#8b4513', textDecoration: 'none' }}>{member.phoneNumber}</a></p>
                  <p style={{ margin: 0, fontSize: 14 }}>✉️ <a href={`mailto:${member.email}`} style={{ color: '#8b4513', textDecoration: 'none' }}>{member.email}</a></p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selected && (
        <div onClick={() => setSelected(null)}
             style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: 'white', borderRadius: 8, width: '90%', maxWidth: 600, overflow: 'hidden' }}>
            <div style={{ background: 'linear-gradient(135deg, #8b4513, #a0522d)', padding: '1rem 1.25rem', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ margin: 0 }}>{selected.fullName}</h2>
              <button onClick={() => setSelected(null)} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: 22, cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ padding: '1.25rem' }}>
              {selected.profileImageUrl && (
                <img src={selected.profileImageUrl} alt={selected.fullName} style={{ width: '100%', height: 260, objectFit: 'cover', borderRadius: 6 }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              )}
              <p style={{ margin: '0.5rem 0', color: '#333' }}><strong>Position:</strong> {selected.position}</p>
              <p style={{ margin: '0.5rem 0', color: '#333' }}><strong>Department:</strong> {selected.department}</p>
              <p style={{ color: '#666', lineHeight: 1.6 }}>{selected.biography || 'Biography not provided.'}</p>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <a href={`tel:${selected.phoneNumber}`} className="btn" style={{ textDecoration: 'none' }}>Call</a>
                <a href={`mailto:${selected.email}`} className="btn" style={{ textDecoration: 'none' }}>Email</a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
