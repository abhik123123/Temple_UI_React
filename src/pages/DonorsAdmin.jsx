import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { donorsAPI } from '../services/postgresAPI';

export default function DonorsAdmin() {
  const { language } = useLanguage();
  const { user, isAuthenticated } = useAuth();

  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    donorName: '',
    inMemoryOf: '',
    donationType: 'money',
    amount: '',
    items: '',
    itemDescription: '',
    itemValue: '',
    date: new Date().toISOString().split('T')[0],
    phone: '',
    email: '',
    address: ''
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      fetchDonors();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user?.role]);

  const fetchDonors = async () => {
    try {
      setLoading(true);
      const data = await donorsAPI.getAll();
      const donorsArray = Array.isArray(data) ? data : data?.data || [];
      setDonors(donorsArray);
      setError(null);
    } catch (err) {
      console.error('Error loading donors:', err);
      setError('Failed to load donors: ' + err.message);
      setDonors([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        donorName: formData.donorName,
        inMemoryOf: formData.inMemoryOf,
        donationType: formData.donationType,
        amount: formData.donationType === 'money' ? parseFloat(formData.amount) : (formData.itemValue ? parseFloat(formData.itemValue) : 0),
        items: formData.donationType === 'item' ? formData.items : null,
        itemDescription: formData.donationType === 'item' ? formData.itemDescription : null,
        itemValue: formData.donationType === 'item' && formData.itemValue ? parseFloat(formData.itemValue) : null,
        date: formData.date || new Date().toISOString().split('T')[0],
        donationDate: formData.date || new Date().toISOString().split('T')[0],
        phone: formData.phone,
        email: formData.email,
        address: formData.address
      };

      if (editingId) {
        await donorsAPI.update(editingId, submitData);
      } else {
        await donorsAPI.create(submitData);
      }
      fetchDonors();
      resetForm();
    } catch (err) {
      console.error('Submit error:', err);
      alert(err.response?.data?.message || err.message || 'Error saving donor');
    }
  };

  const handleEdit = (donor) => {
    setFormData({
      donorName: donor.donorName || '',
      inMemoryOf: donor.inMemoryOf || '',
      donationType: donor.donationType || (donor.items ? 'item' : 'money'),
      amount: donor.amount || '',
      items: donor.items || '',
      itemDescription: donor.itemDescription || '',
      itemValue: donor.itemValue || '',
      date: donor.date || donor.donationDate || new Date().toISOString().split('T')[0],
      phone: donor.phone || '',
      email: donor.email || '',
      address: donor.address || ''
    });
    setEditingId(donor.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await donorsAPI.delete(id);
      fetchDonors();
      setShowDeleteConfirm(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting donor');
    }
  };

  const resetForm = () => {
    setFormData({
      donorName: '',
      inMemoryOf: '',
      donationType: 'money',
      amount: '',
      items: '',
      itemDescription: '',
      itemValue: '',
      date: new Date().toISOString().split('T')[0],
      phone: '',
      email: '',
      address: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center', minHeight: '60vh' }}>
        <p>Loading...</p>
      </div>
    );
  }

  // Check admin access
  if (isAuthenticated && user?.role !== 'admin') {
    return (
      <div style={{
        padding: '40px 20px',
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#d32f2f', marginBottom: '20px' }}>Access Denied</h2>
        <p style={{ color: '#666', marginBottom: '30px' }}>Only admins can access this page</p>
        <a href="/donors" style={{
          display: 'inline-block',
          padding: '10px 20px',
          backgroundColor: '#8b4513',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '4px',
          fontWeight: '500'
        }}>
          Back to Donors
        </a>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 20px', minHeight: '70vh', backgroundColor: '#f9f9f9' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px'
        }}>
          <h1 style={{ fontSize: '2rem', color: '#8b4513', margin: 0 }}>
            💝 Donors Management
          </h1>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            style={{
              padding: '12px 24px',
              backgroundColor: '#8b4513',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.3s ease'
            }}
          >
            + Add Donor
          </button>
        </div>

        {error && (
          <div style={{
            padding: '15px',
            backgroundColor: '#ffebee',
            color: '#c62828',
            borderRadius: '4px',
            marginBottom: '20px'
          }}>
            {error}
          </div>
        )}

        {/* Form Modal */}
        {showForm && (
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '8px',
            marginBottom: '30px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ color: '#8b4513', marginBottom: '20px', marginTop: 0 }}>
              {editingId ? 'Edit Donor' : 'Add Donor'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '15px',
                marginBottom: '15px'
              }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                    Donor Name *
                  </label>
                  <input
                    type="text"
                    name="donorName"
                    value={formData.donorName}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                    S/O, D/O, W/O or H/O
                  </label>
                  <input
                    type="text"
                    name="inMemoryOf"
                    value={formData.inMemoryOf}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '15px',
                marginBottom: '15px'
              }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                    Donation Type *
                  </label>
                  <select
                    name="donationType"
                    value={formData.donationType}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="money">💰 Money</option>
                    <option value="item">📦 Items</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                    Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* Conditional fields based on donation type */}
              {formData.donationType === 'money' ? (
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                    Amount (₹) *
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    required={formData.donationType === 'money'}
                    min="0"
                    step="0.01"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              ) : (
                <>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                      Items Donated *
                    </label>
                    <input
                      type="text"
                      name="items"
                      value={formData.items}
                      onChange={handleInputChange}
                      required={formData.donationType === 'item'}
                      placeholder="e.g., Rice, Oil, Clothes"
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                      Item Value (₹) *
                    </label>
                    <input
                      type="number"
                      name="itemValue"
                      value={formData.itemValue}
                      onChange={handleInputChange}
                      required={formData.donationType === 'item'}
                      min="0"
                      step="0.01"
                      placeholder="Estimated value of items"
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                      Item Description
                    </label>
                    <textarea
                      name="itemDescription"
                      value={formData.itemDescription}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="Details about the donated items"
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>
                </>
              )}

              {/* Contact Information */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '15px',
                marginBottom: '15px'
              }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="2"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="submit"
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#8b4513',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: '500',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#f5f5f5',
                    color: '#333',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: '500',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Donors Table */}
        {donors.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            backgroundColor: 'white',
            borderRadius: '8px'
          }}>
            <p style={{ fontSize: '16px', color: '#999' }}>No donors found</p>
          </div>
        ) : (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse'
              }}>
                <thead>
                  <tr style={{ backgroundColor: '#8b4513', color: 'white' }}>
                    <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold' }}>Date</th>
                    <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold' }}>Donor Name</th>
                    <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold' }}>S/O, D/O, W/O or H/O</th>
                    <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold' }}>Type</th>
                    <th style={{ padding: '15px', textAlign: 'right', fontWeight: 'bold' }}>Amount/Items</th>
                    <th style={{ padding: '15px', textAlign: 'center', fontWeight: 'bold' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {donors.map((donor, idx) => (
                    <tr key={donor.id || idx} style={{ 
                      borderBottom: '1px solid #eee',
                      transition: 'background 0.2s'
                    }}>
                      <td style={{ padding: '15px', color: '#666', fontSize: '14px' }}>
                        {new Date(donor.date || donor.createdAt || donor.donationDate).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '15px', color: '#333', fontWeight: '500' }}>
                        {donor.donorName}
                      </td>
                      <td style={{ padding: '15px', color: '#666' }}>
                        {donor.inMemoryOf || '-'}
                      </td>
                      <td style={{ padding: '15px' }}>
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
                        padding: '15px', 
                        textAlign: 'right', 
                        fontWeight: 'bold'
                      }}>
                        {donor.donationType === 'item' || donor.items ? (
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ color: '#1976d2', marginBottom: '4px' }}>
                              {donor.items || donor.itemDescription || 'Items donated'}
                            </div>
                            <div style={{ color: '#4caf50', fontSize: '0.95rem' }}>
                              ₹{parseFloat(donor.itemValue || donor.amount || 0).toFixed(2)}
                            </div>
                          </div>
                        ) : (
                          <span style={{ color: '#4caf50' }}>
                            ₹{parseFloat(donor.amount || 0).toFixed(2)}
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '15px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <button
                            onClick={() => handleEdit(donor)}
                            style={{
                              padding: '6px 12px',
                              backgroundColor: '#2196f3',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              fontWeight: '500'
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(donor.id)}
                            style={{
                              padding: '6px 12px',
                              backgroundColor: '#f44336',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              fontWeight: '500'
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '30px',
              maxWidth: '400px',
              width: '90%',
              textAlign: 'center'
            }}>
              <h3 style={{ color: '#8b4513', marginBottom: '15px', marginTop: 0 }}>
                Delete Donor
              </h3>
              <p style={{ color: '#666', marginBottom: '25px' }}>
                Are you sure you want to delete this donor record?
              </p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button
                  onClick={() => handleDelete(showDeleteConfirm)}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  Delete
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#f5f5f5',
                    color: '#333',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
