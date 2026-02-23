import { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAPI } from '../hooks/useAPI';
import { donorsAPI } from '../services/templeAPI';

export default function Donors() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('donate');
  const { data: backendDonors, loading, error } = useAPI(donorsAPI.getAll);
  
  // Filter states
  const [filterMonth, setFilterMonth] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterDate, setFilterDate] = useState('');

  const displayDonors = useMemo(() => {
    return backendDonors && backendDonors.length > 0 ? backendDonors : [];
  }, [backendDonors]);

  // Filter donors based on selected filters
  const filteredDonors = useMemo(() => {
    return displayDonors.filter(donor => {
      // Parse donation date (assuming donor has a date field or createdAt)
      const donorDate = new Date(donor.date || donor.createdAt || donor.donationDate);
      
      // Filter by specific date
      if (filterDate) {
        const selectedDate = new Date(filterDate);
        if (donorDate.toDateString() !== selectedDate.toDateString()) {
          return false;
        }
      }
      
      // Filter by month (if no specific date is selected)
      if (filterMonth && !filterDate) {
        if (donorDate.getMonth() + 1 !== parseInt(filterMonth)) {
          return false;
        }
      }
      
      // Filter by year
      if (filterYear) {
        if (donorDate.getFullYear() !== parseInt(filterYear)) {
          return false;
        }
      }
      
      return true;
    });
  }, [displayDonors, filterMonth, filterYear, filterDate]);

  // Get unique years from donors for dropdown
  const availableYears = useMemo(() => {
    const years = displayDonors.map(donor => {
      const date = new Date(donor.date || donor.createdAt || donor.donationDate);
      return date.getFullYear();
    });
    return [...new Set(years)].sort((a, b) => b - a);
  }, [displayDonors]);

  // Tab styles
  const tabStyle = (isActive) => ({
    padding: '1rem 2rem',
    background: isActive ? '#8b4513' : '#f0f0f0',
    color: isActive ? 'white' : '#666',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: isActive ? 'bold' : 'normal',
    borderRadius: '8px 8px 0 0',
    transition: 'all 0.3s ease'
  });

  const clearFilters = () => {
    setFilterMonth('');
    setFilterYear('');
    setFilterDate('');
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
        {/* Tabs Navigation */}
        <div style={{ 
          display: 'flex', 
          gap: '0.5rem', 
          marginBottom: '0',
          borderBottom: '2px solid #8b4513'
        }}>
          <button 
            style={tabStyle(activeTab === 'donate')}
            onClick={() => setActiveTab('donate')}
          >
            💳 Donate
          </button>
          <button 
            style={tabStyle(activeTab === 'list')}
            onClick={() => setActiveTab('list')}
          >
            📋 Donor List
          </button>
        </div>

        {/* Tab Content */}
        <div style={{
          background: '#fff',
          padding: '2rem',
          borderRadius: '0 8px 8px 8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          {activeTab === 'donate' && (
            <div>
              <h2 style={{ color: '#8b4513', marginBottom: '1.5rem', textAlign: 'center' }}>
                🙏 Make a Donation
              </h2>
              <p style={{ textAlign: 'center', color: '#666', marginBottom: '2rem' }}>
                Your generous contributions help us maintain the temple and serve the community
              </p>

              {/* Bank Details Section */}
              <div style={{
                background: '#f9f9f9',
                padding: '2rem',
                borderRadius: '8px',
                marginBottom: '2rem',
                border: '2px solid #8b4513'
              }}>
                <h3 style={{ color: '#8b4513', marginBottom: '1.5rem', textAlign: 'center' }}>
                  🏦 Bank Details
                </h3>
                <div style={{
                  display: 'grid',
                  gap: '1.5rem',
                  maxWidth: '600px',
                  margin: '0 auto'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    background: '#fff',
                    borderRadius: '6px',
                    border: '1px solid #ddd'
                  }}>
                    <strong style={{ color: '#555' }}>Bank Name:</strong>
                    <span style={{ color: '#333' }}>State Bank of India</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    background: '#fff',
                    borderRadius: '6px',
                    border: '1px solid #ddd'
                  }}>
                    <strong style={{ color: '#555' }}>Account Number:</strong>
                    <span style={{ color: '#333', fontFamily: 'monospace', fontSize: '1.1rem' }}>1234567890</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    background: '#fff',
                    borderRadius: '6px',
                    border: '1px solid #ddd'
                  }}>
                    <strong style={{ color: '#555' }}>IFSC Code:</strong>
                    <span style={{ color: '#333', fontFamily: 'monospace', fontSize: '1.1rem' }}>SBIN0001234</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    background: '#fff',
                    borderRadius: '6px',
                    border: '1px solid #ddd'
                  }}>
                    <strong style={{ color: '#555' }}>Branch:</strong>
                    <span style={{ color: '#333' }}>Main Branch, City Center</span>
                  </div>
                </div>
              </div>

              {/* UPI Section */}
              <div style={{
                background: '#e8f5e9',
                padding: '2rem',
                borderRadius: '8px',
                border: '2px solid #4caf50'
              }}>
                <h3 style={{ color: '#2e7d32', marginBottom: '1.5rem', textAlign: 'center' }}>
                  📱 UPI Payment
                </h3>
                <div style={{
                  maxWidth: '600px',
                  margin: '0 auto'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1.5rem',
                    background: '#fff',
                    borderRadius: '6px',
                    border: '1px solid #4caf50'
                  }}>
                    <strong style={{ color: '#555' }}>UPI ID:</strong>
                    <span style={{ 
                      color: '#2e7d32', 
                      fontFamily: 'monospace', 
                      fontSize: '1.2rem',
                      fontWeight: 'bold'
                    }}>
                      temple@upi
                    </span>
                  </div>
                  <p style={{ 
                    textAlign: 'center', 
                    color: '#666', 
                    marginTop: '1rem',
                    fontSize: '0.9rem'
                  }}>
                    Scan QR code or use the UPI ID above to make instant payments
                  </p>
                </div>
              </div>

              <div style={{
                marginTop: '2rem',
                padding: '1rem',
                background: '#fff3cd',
                borderRadius: '6px',
                border: '1px solid #ffc107',
                textAlign: 'center'
              }}>
                <p style={{ color: '#856404', margin: 0 }}>
                  ℹ️ Please contact the temple office after making a donation to receive your receipt
                </p>
              </div>
            </div>
          )}

          {activeTab === 'list' && (
            <div>
              <h2 style={{ color: '#8b4513', marginBottom: '1.5rem', textAlign: 'center' }}>
                🌟 Our Generous Donors
              </h2>

              {/* Filters Section */}
              <div style={{
                background: '#f9f9f9',
                padding: '1.5rem',
                borderRadius: '8px',
                marginBottom: '2rem',
                border: '1px solid #ddd'
              }}>
                <h3 style={{ color: '#8b4513', marginBottom: '1rem', fontSize: '1.1rem' }}>
                  🔍 Filter Donations
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1rem',
                  marginBottom: '1rem'
                }}>
                  {/* Date Filter */}
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555', fontSize: '0.9rem' }}>
                      📅 Specific Date
                    </label>
                    <input
                      type="date"
                      value={filterDate}
                      onChange={(e) => setFilterDate(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '0.9rem'
                      }}
                    />
                  </div>

                  {/* Month Filter */}
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555', fontSize: '0.9rem' }}>
                      📆 Month
                    </label>
                    <select
                      value={filterMonth}
                      onChange={(e) => setFilterMonth(e.target.value)}
                      disabled={!!filterDate}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '0.9rem',
                        opacity: filterDate ? 0.5 : 1
                      }}
                    >
                      <option value="">All Months</option>
                      <option value="1">January</option>
                      <option value="2">February</option>
                      <option value="3">March</option>
                      <option value="4">April</option>
                      <option value="5">May</option>
                      <option value="6">June</option>
                      <option value="7">July</option>
                      <option value="8">August</option>
                      <option value="9">September</option>
                      <option value="10">October</option>
                      <option value="11">November</option>
                      <option value="12">December</option>
                    </select>
                  </div>

                  {/* Year Filter */}
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555', fontSize: '0.9rem' }}>
                      📅 Year
                    </label>
                    <select
                      value={filterYear}
                      onChange={(e) => setFilterYear(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '0.9rem'
                      }}
                    >
                      <option value="">All Years</option>
                      {availableYears.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Clear Filters Button */}
                {(filterMonth || filterYear || filterDate) && (
                  <button
                    onClick={clearFilters}
                    style={{
                      padding: '0.5rem 1rem',
                      background: '#f44336',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}
                  >
                    ✖ Clear Filters
                  </button>
                )}

                {/* Results count */}
                <div style={{ marginTop: '1rem', color: '#666', fontSize: '0.9rem' }}>
                  Showing {filteredDonors.length} of {displayDonors.length} donations
                </div>
              </div>

              {loading && (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
                  Loading donor records...
                </div>
              )}

              {error && (
                <div style={{ 
                  background: '#ffe5e5', 
                  padding: '1rem', 
                  borderRadius: '4px', 
                  color: '#d32f2f', 
                  marginBottom: '2rem' 
                }}>
                  ⚠️ {error}
                </div>
              )}

              {!loading && !error && (
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
                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 'bold' }}>Date</th>
                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 'bold' }}>Donor Name</th>
                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 'bold' }}>S/O, D/O, W/O or H/O</th>
                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 'bold' }}>Type</th>
                        <th style={{ padding: '1rem', textAlign: 'right', fontWeight: 'bold' }}>Amount/Items</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDonors.map((donor, idx) => (
                        <tr key={donor.id || idx} style={{ 
                          borderBottom: '1px solid #eee',
                          transition: 'background 0.2s'
                        }}>
                          <td style={{ padding: '1rem', color: '#666', fontSize: '0.9rem' }}>
                            {new Date(donor.date || donor.createdAt || donor.donationDate).toLocaleDateString()}
                          </td>
                          <td style={{ padding: '1rem', color: '#333' }}>
                            <strong>{donor.donorName}</strong>
                          </td>
                          <td style={{ padding: '1rem', color: '#666' }}>
                            {donor.inMemoryOf || '-'}
                          </td>
                          <td style={{ padding: '1rem', color: '#666' }}>
                            {donor.donationType === 'item' || donor.items ? (
                              <span style={{ 
                                background: '#e3f2fd', 
                                color: '#1976d2', 
                                padding: '0.25rem 0.5rem', 
                                borderRadius: '4px',
                                fontSize: '0.85rem'
                              }}>
                                📦 Items
                              </span>
                            ) : (
                              <span style={{ 
                                background: '#e8f5e9', 
                                color: '#2e7d32', 
                                padding: '0.25rem 0.5rem', 
                                borderRadius: '4px',
                                fontSize: '0.85rem'
                              }}>
                                💰 Money
                              </span>
                            )}
                          </td>
                          <td style={{ 
                            padding: '1rem', 
                            textAlign: 'right', 
                            fontWeight: 'bold',
                            fontSize: '1rem'
                          }}>
                            {donor.donationType === 'item' || donor.items ? (
                              <div style={{ textAlign: 'right' }}>
                                <div style={{ color: '#1976d2', marginBottom: '4px' }}>
                                  {donor.items || donor.itemDescription || 'Items donated'}
                                </div>
                                <div style={{ color: '#4caf50', fontSize: '1rem' }}>
                                  ₹{parseFloat(donor.itemValue || donor.amount || 0).toFixed(2)}
                                </div>
                              </div>
                            ) : (
                              <span style={{ color: '#4caf50', fontSize: '1.1rem' }}>
                                ₹{parseFloat(donor.amount || 0).toFixed(2)}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {!loading && !error && filteredDonors.length === 0 && (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#999' }}>
                  {displayDonors.length === 0 
                    ? 'No donor records found.' 
                    : 'No donations match the selected filters.'}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
