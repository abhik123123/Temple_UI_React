import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useAPI } from '../hooks/useAPI';
import { donorsAPI } from '../services/api';

export default function Donors() {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const { data: backendDonors, loading, error, refetch } = useAPI(donorsAPI.getAll);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterMonth, setFilterMonth] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterType, setFilterType] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [formData, setFormData] = useState({
    donorName: '',
    donationType: 'Cash',
    amount: '',
    donationDate: new Date().toISOString().split('T')[0],
    inMemoryOf: '',
    donationReason: ''
  });

  const displayDonors = backendDonors && backendDonors.length > 0 ? backendDonors : [];

  // Filter donations
  const filteredDonors = displayDonors.filter(donor => {
    const donationDate = new Date(donor.donationDate);
    const month = String(donationDate.getMonth() + 1).padStart(2, '0');
    const year = donationDate.getFullYear().toString();

    const monthMatch = !filterMonth || month === filterMonth;
    const yearMatch = !filterYear || year === filterYear;
    const typeMatch = !filterType || donor.donationType === filterType;

    return monthMatch && yearMatch && typeMatch;
  });

  // Calculate statistics
  const totalDonations = filteredDonors.reduce((sum, donor) => sum + (parseFloat(donor.amount) || 0), 0);
  const averageDonation = filteredDonors.length > 0 ? (totalDonations / filteredDonors.length).toFixed(2) : 0;

  // Get unique years and months for filters
  const years = [...new Set(displayDonors.map(d => new Date(d.donationDate).getFullYear()))].sort((a, b) => b - a);
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1).padStart(2, '0'),
    label: new Date(2024, i).toLocaleString('en-US', { month: 'long' })
  }));

  const donationTypes = [...new Set(displayDonors.map(d => d.donationType))];

  const handleAddDonation = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitError(null);

    try {
      await donorsAPI.create(formData);
      setFormData({
        donorName: '',
        donationType: 'Cash',
        amount: '',
        donationDate: new Date().toISOString().split('T')[0],
        inMemoryOf: '',
        donationReason: ''
      });
      setShowAddForm(false);
      refetch();
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to add donation');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteDonation = async (donorId) => {
    if (!window.confirm('Are you sure you want to delete this donation record?')) return;

    try {
      await donorsAPI.delete(donorId);
      refetch();
    } catch (err) {
      alert('Failed to delete donation: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="page">
      <div className="hero" style={{
        backgroundImage: 'url(/images/temple-images/saibaba.jpg)',
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
          <h1 style={{ color: 'white' }}>💝 {t('donors_title') || 'Donors'}</h1>
          <p style={{ color: '#f0f0f0' }}>{t('donors_subtitle') || 'Support Our Temple'}</p>
        </div>
      </div>

      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ textAlign: 'center', flex: 1, color: '#8b4513' }}>💝 Donations</h2>
          {isAuthenticated && (
            <button 
              className="btn" 
              onClick={() => setShowAddForm(!showAddForm)}
              style={{ marginLeft: 'auto' }}
            >
              {showAddForm ? '❌ Cancel' : '➕ Add Donation'}
            </button>
          )}
        </div>

        {showAddForm && isAuthenticated && (
          <div style={{
            background: '#f9f9f9',
            padding: '2rem',
            borderRadius: '8px',
            marginBottom: '2rem',
            border: '1px solid #ddd'
          }}>
            <h3 style={{ color: '#8b4513', marginBottom: '1.5rem' }}>Record New Donation</h3>
            {submitError && (
              <div style={{ background: '#ffe5e5', padding: '1rem', borderRadius: '4px', color: '#d32f2f', marginBottom: '1rem' }}>
                ⚠️ {submitError}
              </div>
            )}
            <form onSubmit={handleAddDonation}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <input
                  type="text"
                  name="donorName"
                  placeholder="Donor Name"
                  value={formData.donorName}
                  onChange={handleInputChange}
                  required
                  style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd' }}
                />
                <select
                  name="donationType"
                  value={formData.donationType}
                  onChange={handleInputChange}
                  style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd' }}
                >
                  <option value="Cash">Cash</option>
                  <option value="Check">Check</option>
                  <option value="Online">Online</option>
                  <option value="Gold">Gold</option>
                  <option value="Silver">Silver</option>
                  <option value="Material">Material</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <input
                  type="number"
                  name="amount"
                  placeholder="Amount (₹)"
                  value={formData.amount}
                  onChange={handleInputChange}
                  required
                  step="0.01"
                  min="0"
                  style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd' }}
                />
                <input
                  type="date"
                  name="donationDate"
                  value={formData.donationDate}
                  onChange={handleInputChange}
                  required
                  style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', marginBottom: '1rem' }}>
                <input
                  type="text"
                  name="inMemoryOf"
                  placeholder="In Memory Of (Optional)"
                  value={formData.inMemoryOf}
                  onChange={handleInputChange}
                  style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd' }}
                />
                <textarea
                  name="donationReason"
                  placeholder="Donation Reason/Note (Optional)"
                  value={formData.donationReason}
                  onChange={handleInputChange}
                  rows="3"
                  style={{ 
                    padding: '0.75rem', 
                    borderRadius: '4px', 
                    border: '1px solid #ddd',
                    fontFamily: 'inherit'
                  }}
                />
              </div>
              <button 
                type="submit" 
                className="btn"
                disabled={submitLoading}
                style={{ opacity: submitLoading ? 0.6 : 1, cursor: submitLoading ? 'not-allowed' : 'pointer' }}
              >
                {submitLoading ? 'Adding...' : 'Record Donation'}
              </button>
            </form>
          </div>
        )}

        {/* Filters */}
        <div style={{
          background: '#f5f5f5',
          padding: '1.5rem',
          borderRadius: '8px',
          marginBottom: '2rem'
        }}>
          <h3 style={{ color: '#8b4513', marginBottom: '1rem' }}>🔍 Filter Donations</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd' }}
            >
              <option value="">All Years</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <select
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd' }}
            >
              <option value="">All Months</option>
              {months.map(month => (
                <option key={month.value} value={month.value}>{month.label}</option>
              ))}
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd' }}
            >
              <option value="">All Types</option>
              {donationTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <button 
              onClick={() => {
                setFilterYear('');
                setFilterMonth('');
                setFilterType('');
              }}
              style={{
                padding: '0.75rem',
                borderRadius: '4px',
                border: '1px solid #ddd',
                background: '#e0e0e0',
                cursor: 'pointer'
              }}
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            background: '#e8f5e9',
            padding: '1.5rem',
            borderRadius: '8px',
            textAlign: 'center',
            border: '1px solid #4caf50'
          }}>
            <h4 style={{ color: '#4caf50', margin: '0 0 0.5rem 0' }}>Total Donations</h4>
            <p style={{ fontSize: '1.5rem', color: '#2e7d32', margin: 0 }}>₹{totalDonations.toFixed(2)}</p>
          </div>
          <div style={{
            background: '#e3f2fd',
            padding: '1.5rem',
            borderRadius: '8px',
            textAlign: 'center',
            border: '1px solid #2196f3'
          }}>
            <h4 style={{ color: '#2196f3', margin: '0 0 0.5rem 0' }}>Average Donation</h4>
            <p style={{ fontSize: '1.5rem', color: '#1565c0', margin: 0 }}>₹{averageDonation}</p>
          </div>
          <div style={{
            background: '#fff3e0',
            padding: '1.5rem',
            borderRadius: '8px',
            textAlign: 'center',
            border: '1px solid #ff9800'
          }}>
            <h4 style={{ color: '#ff9800', margin: '0 0 0.5rem 0' }}>Total Donors</h4>
            <p style={{ fontSize: '1.5rem', color: '#e65100', margin: 0 }}>{filteredDonors.length}</p>
          </div>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
            Loading donation records...
          </div>
        )}

        {error && (
          <div style={{ background: '#ffe5e5', padding: '1rem', borderRadius: '4px', color: '#d32f2f', marginBottom: '2rem' }}>
            ⚠️ {error}
          </div>
        )}

        {/* Donations Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            backgroundColor: '#fff',
            borderRadius: '8px',
            overflow: 'hidden'
          }}>
            <thead>
              <tr style={{ background: '#8b4513', color: 'white' }}>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 'bold' }}>Donor Name</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 'bold' }}>Date</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 'bold' }}>Type</th>
                <th style={{ padding: '1rem', textAlign: 'right', fontWeight: 'bold' }}>Amount (₹)</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 'bold' }}>In Memory Of</th>
                {isAuthenticated && <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 'bold' }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredDonors.map((donor, idx) => (
                <tr key={donor.id || idx} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '1rem', color: '#333' }}><strong>{donor.donorName}</strong></td>
                  <td style={{ padding: '1rem', color: '#666' }}>
                    {new Date(donor.donationDate).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </td>
                  <td style={{ padding: '1rem', color: '#666' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '0.25rem 0.75rem',
                      background: '#f0f0f0',
                      borderRadius: '12px',
                      fontSize: '0.85rem'
                    }}>
                      {donor.donationType}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right', color: '#4caf50', fontWeight: 'bold' }}>
                    ₹{parseFloat(donor.amount).toFixed(2)}
                  </td>
                  <td style={{ padding: '1rem', color: '#999' }}>
                    {donor.inMemoryOf ? (
                      <span style={{ fontStyle: 'italic' }}>🕯️ {donor.inMemoryOf}</span>
                    ) : (
                      '-'
                    )}
                  </td>
                  {isAuthenticated && (
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <button 
                        onClick={() => handleDeleteDonation(donor.id)}
                        style={{
                          background: '#d32f2f',
                          color: 'white',
                          border: 'none',
                          padding: '0.5rem 1rem',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.85rem'
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredDonors.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#999' }}>
            No donations found with the selected filters.
          </div>
        )}
      </div>
    </div>
  );
}
