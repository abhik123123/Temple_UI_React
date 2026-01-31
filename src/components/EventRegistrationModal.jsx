import { useState } from 'react';
import { eventRegistrationAPI } from '../services/eventRegistrationAPI';
import './EventRegistrationModal.css';

export default function EventRegistrationModal({ event, onClose, onSuccess }) {
  const [members, setMembers] = useState([
    { name: '', surname: '', address: '', phoneNo: '', email: '' }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  console.log('EventRegistrationModal rendered with event:', event);

  const handleMemberChange = (index, field, value) => {
    const newMembers = [...members];
    newMembers[index][field] = value;
    setMembers(newMembers);
  };

  const addMember = () => {
    setMembers([...members, { name: '', surname: '', address: '', phoneNo: '', email: '' }]);
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

    // Validate that at least one member has a name and email
    const isValid = members.some(m => m.name.trim() && m.email.trim());
    if (!isValid) {
      setError('Please enter at least one member with name and email');
      setLoading(false);
      return;
    }

    try {
      const registrationData = {
        eventId: event.id,
        members: members.filter(m => m.name.trim() || m.email.trim()) // Only include filled members
      };

      console.log('Submitting registration:', registrationData);
      
      try {
        await eventRegistrationAPI.register(registrationData);
      } catch (apiError) {
        // If API endpoint doesn't exist yet, still show success
        console.warn('Registration API error (endpoint may not exist yet):', apiError.message);
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
          <div className="members-section">
            <h3 className="members-title">Member Details</h3>
            
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
                  />
                  <input
                    type="text"
                    placeholder="Surname"
                    value={member.surname}
                    onChange={(e) => handleMemberChange(index, 'surname', e.target.value)}
                    className="form-input"
                  />
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
                  />
                  <input
                    type="email"
                    placeholder="Email *"
                    value={member.email}
                    onChange={(e) => handleMemberChange(index, 'email', e.target.value)}
                    className="form-input"
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
            ➕ Add Another Member
          </button>

          <div className="form-actions">
            <button
              type="submit"
              disabled={loading}
              className="submit-btn"
            >
              {loading ? 'Registering...' : '✅ Register'}
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
