import { useState, useEffect } from 'react';
import { timingsAPI } from '../services/templeAPI';

export default function Timings() {
  const [timings, setTimings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTimings();
  }, []);

  const fetchTimings = async () => {
    try {
      setLoading(true);
      const response = await timingsAPI.getAll();
      const timingsData = response.data || [];
      setTimings(timingsData);
    } catch (error) {
      console.error('Error fetching timings:', error);
      // Fallback to default timings if fetch fails
      setTimings([
        { 
          day: 'Monday', 
          slots: [
            { id: 1, openTime: '06:00:00', closeTime: '13:00:00' },
            { id: 2, openTime: '16:00:00', closeTime: '21:00:00' }
          ]
        },
        { 
          day: 'Tuesday', 
          slots: [
            { id: 3, openTime: '06:00:00', closeTime: '13:00:00' },
            { id: 4, openTime: '16:00:00', closeTime: '21:00:00' }
          ]
        },
        { 
          day: 'Wednesday', 
          slots: [
            { id: 5, openTime: '06:00:00', closeTime: '13:00:00' },
            { id: 6, openTime: '16:00:00', closeTime: '21:00:00' }
          ]
        },
        { 
          day: 'Thursday', 
          slots: [
            { id: 7, openTime: '06:00:00', closeTime: '13:00:00' },
            { id: 8, openTime: '16:00:00', closeTime: '21:00:00' }
          ]
        },
        { 
          day: 'Friday', 
          slots: [
            { id: 9, openTime: '06:00:00', closeTime: '13:00:00' },
            { id: 10, openTime: '16:00:00', closeTime: '21:00:00' }
          ]
        },
        { 
          day: 'Saturday', 
          slots: [
            { id: 11, openTime: '06:00:00', closeTime: '21:00:00' }
          ]
        },
        { 
          day: 'Sunday', 
          slots: [
            { id: 12, openTime: '07:00:00', closeTime: '21:00:00' }
          ]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Format time from 24-hour to 12-hour format
  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Get special notes based on day
  const getSpecialNotes = (day) => {
    if (day === 'Saturday') return 'Extended Hours';
    if (day === 'Sunday') return 'Weekend Schedule';
    return 'Regular Schedule';
  };

  if (loading) {
    return (
      <div className="page">
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
            <h1 style={{ color: 'white' }}>⏰ Temple Timings</h1>
            <p style={{ color: '#f0f0f0' }}>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
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
          <h1 style={{ color: 'white' }}>⏰ Temple Timings</h1>
          <p style={{ color: '#f0f0f0' }}>Visit us during our darshan hours</p>
        </div>
      </div>

      <div className="container">
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#8b4513' }}>Daily Darshan Timings</h2>
        
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Day</th>
                <th>Timings</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {timings.map((timing, idx) => {
                const slots = timing.slots || [];
                return (
                  <tr key={idx}>
                    <td><strong>{timing.day}</strong></td>
                    <td style={{ fontSize: '1.1rem', color: '#2c5f2d' }}>
                      {slots.length > 0 ? (
                        <div>
                          {slots.map((slot, slotIdx) => (
                            <div key={slot.id || slotIdx} style={{ marginBottom: slotIdx < slots.length - 1 ? '8px' : 0 }}>
                              <strong>
                                {formatTime(slot.openTime)} - {formatTime(slot.closeTime)}
                              </strong>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span style={{ color: '#999' }}>Closed</span>
                      )}
                    </td>
                    <td>
                      {timing.notes || (slots.length > 1 ? 'Multiple Sessions' : slots.length === 1 ? getSpecialNotes(timing.day) : 'Closed')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div style={{ 
          background: '#fff8e1', 
          padding: '1.5rem', 
          borderRadius: '8px', 
          marginTop: '2rem',
          borderLeft: '4px solid #ffa726'
        }}>
          <h4 style={{ color: '#e65100', marginTop: 0 }}>ℹ️ Important Information</h4>
          <ul style={{ marginBottom: 0, lineHeight: '1.8' }}>
            <li>Temple remains closed between 1:00 PM - 5:00 PM on weekdays</li>
            <li>Special poojas may extend closing time</li>
            <li>Festival days may have different timings</li>
            <li>Please arrive 30 minutes before closing for darshan</li>
          </ul>
        </div>

        <div style={{ 
          background: '#f0f0f0', 
          padding: '2rem', 
          borderRadius: '8px', 
          marginTop: '3rem',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#8b4513', marginBottom: '1rem' }}>📍 Location & Contact</h3>
          <p><strong>Address:</strong> Near Old Market, Hasaparthy, Warangal</p>
          <p><strong>Phone:</strong> (555) 123-4567</p>
          <p><strong>Email:</strong> info@rajarajeshwara.com</p>
          <p><strong>Website:</strong> www.rajarajeshwara.com</p>
          <button className="btn" style={{ marginTop: '1rem' }}>Get Directions</button>
        </div>
      </div>
    </div>
  );
}
