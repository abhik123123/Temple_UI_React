import { useState } from 'react';
import { eventRegistrationAPI } from '../services/eventRegistrationAPI';
import './EventRegistrationModal.css';

export default function EventRegistrationModal({ event, onClose, onSuccess }) {
  const [familyGotram, setFamilyGotram] = useState('');
  const [members, setMembers] = useState([
    { 
      name: '', 
      surname: '', 
      relation: 'Self',
      rasi: '', 
      nakshatra: '',
      address: '', 
      phoneNo: '', 
      email: '' 
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Relation options
  const relationOptions = [
    'Self', 'Spouse', 'Father', 'Mother', 'Son', 'Daughter', 
    'Brother', 'Sister', 'Grandfather', 'Grandmother', 'Uncle', 
    'Aunt', 'Nephew', 'Niece', 'Cousin', 'Other'
  ];

  // Rasi (Zodiac Signs) options
  const rasiOptions = [
    'Mesha (Aries)', 'Vrishabha (Taurus)', 'Mithuna (Gemini)', 
    'Karka (Cancer)', 'Simha (Leo)', 'Kanya (Virgo)', 
    'Tula (Libra)', 'Vrishchika (Scorpio)', 'Dhanus (Sagittarius)', 
    'Makara (Capricorn)', 'Kumbha (Aquarius)', 'Meena (Pisces)'
  ];

  // Nakshatra options (27 nakshatras)
  const nakshatraOptions = [
    'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
    'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
    'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
    'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
    'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
  ];

  console.log('EventRegistrationModal rendered with event:', event);

  const handleMemberChange = (index, field, value) => {
    const newMembers = [...members];
    newMembers[index][field] = value;
    setMembers(newMembers);
  };

  const addMember = () => {
    setMembers([...members, { 
      name: '', 
      surname: '', 
      relation: 'Spouse',
      rasi: '', 
      nakshatra: '',
      address: '', 
      phoneNo: '', 
      email: '' 
    }]);
  };

  const removeMember = (index) => {
    if (members.length > 1) {
      setMembers(members.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate that at least one member has a name and contact info
    const isValid = members.some(m => m.name.trim() && (m.email.trim() || m.phoneNo.trim()));
    if (!isValid) {
      setError('Please enter at least one member with name and contact information (email or phone)');
      setLoading(false);
      return;
    }

    try {
      const registrationData = {
        eventId: event.id,
        familyGotram: familyGotram,
        members: members.filter(m => m.name.trim()), // Only include members with names
        createdAt: new Date().toISOString()
      };

      console.log('Submitting registration:', registrationData);
      
      // Save to localStorage first (as fallback and for immediate display)
      try {
        const existingRegistrations = JSON.parse(localStorage.getItem('temple_registrations') || '[]');
        const newRegistration = {
          id: Date.now().toString(),
          ...registrationData
        };
        existingRegistrations.push(newRegistration);
        localStorage.setItem('temple_registrations', JSON.stringify(existingRegistrations));
        console.log('Registration saved to localStorage:', newRegistration);
      } catch (storageError) {
        console.error('Failed to save to localStorage:', storageError);
      }
      
      // Try to send to backend API
      try {
        await eventRegistrationAPI.register(registrationData);
        console.log('Registration sent to backend API successfully');
      } catch (apiError) {
        // If API endpoint doesn't exist yet, that's okay - we saved to localStorage
        console.warn('Registration API error (data saved to localStorage):', apiError.message);
      }
      
      setSuccess(true);
      
      setTimeout(() => {
        console.log('Calling onSuccess callback');
        onSuccess?.();
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Failed to register for event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="event-registration-overlay">
      <div className="event-registration-modal">
        <div className="modal-header">
          <h2 className="modal-title">Register for Event</h2>
          <button 
            onClick={onClose}
            className="modal-close-btn"
          >
            ✕
          </button>
        </div>

        <div className="event-info-box">
          <h3 className="event-info-title">{event.eventName}</h3>
          <p className="event-info-detail">
            📅 {new Date(event.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        {success && (
          <div className="success-message">
            ✅ Registration successful!
          </div>
        )}

        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        {!success && (
          <>
          <p style={{ color: 'red', fontWeight: 'bold' }}>⬇️ FILL IN YOUR DETAILS BELOW ⬇️</p>
          <form onSubmit={handleSubmit}>
          
          {/* Family Gotram Section */}
          <div className="gotram-section">
            <label className="gotram-label">
              🕉️ Family Gotram (Optional)
            </label>
            <input
              type="text"
              placeholder="Enter your family gotram (e.g., Kashyapa, Bharadwaja, Vishwamitra)"
              value={familyGotram}
              onChange={(e) => setFamilyGotram(e.target.value)}
              className="form-input gotram-input"
            />
          </div>

          <div className="members-section">
            <h3 className="members-title">Family Member Details</h3>
            
            {members.map((member, index) => (
              <div key={index} className="member-card">
                <div className="member-header">
                  <h4 className="member-number">Member {index + 1}</h4>
                  {members.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMember(index)}
                      className="remove-member-btn"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="form-row">
                  <input
                    type="text"
                    placeholder="Name *"
                    value={member.name}
                    onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                    className="form-input"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Surname *"
                    value={member.surname}
                    onChange={(e) => handleMemberChange(index, 'surname', e.target.value)}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-row">
                  <select
                    value={member.relation}
                    onChange={(e) => handleMemberChange(index, 'relation', e.target.value)}
                    className="form-input"
                    required
                  >
                    <option value="">Select Relation *</option>
                    {relationOptions.map(rel => (
                      <option key={rel} value={rel}>{rel}</option>
                    ))}
                  </select>
                </div>

                <div className="form-row">
                  <select
                    value={member.rasi}
                    onChange={(e) => handleMemberChange(index, 'rasi', e.target.value)}
                    className="form-input"
                  >
                    <option value="">Select Rasi (Zodiac Sign)</option>
                    {rasiOptions.map(rasi => (
                      <option key={rasi} value={rasi}>{rasi}</option>
                    ))}
                  </select>
                  <select
                    value={member.nakshatra}
                    onChange={(e) => handleMemberChange(index, 'nakshatra', e.target.value)}
                    className="form-input"
                  >
                    <option value="">Select Nakshatra</option>
                    {nakshatraOptions.map(nakshatra => (
                      <option key={nakshatra} value={nakshatra}>{nakshatra}</option>
                    ))}
                  </select>
                </div>

                <div className="form-row-full">
                  <input
                    type="text"
                    placeholder="Address"
                    value={member.address}
                    onChange={(e) => handleMemberChange(index, 'address', e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-row">
                  <input
                    type="tel"
                    placeholder="Phone No. *"
                    value={member.phoneNo}
                    onChange={(e) => handleMemberChange(index, 'phoneNo', e.target.value)}
                    className="form-input"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email *"
                    value={member.email}
                    onChange={(e) => handleMemberChange(index, 'email', e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addMember}
            className="add-member-btn"
          >
            ➕ Add Family Member
          </button>

          <div className="form-actions">
            <button
              type="submit"
              disabled={loading}
              className="submit-btn"
            >
              {loading ? 'Registering...' : '✅ Register for Event'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="cancel-btn"
            >
              Cancel
            </button>
          </div>
        </form>
          </>
        )}
      </div>
    </div>
  );
}
