import React, { useState, useEffect } from 'react';
import { getAnalyticsData, clearAnalyticsData, exportAnalyticsData } from '../services/analyticsService';

export default function AnalyticsAdmin() {
  const [analyticsData, setAnalyticsData] = useState({
    totalViews: 0,
    todayViews: 0,
    weekViews: 0,
    monthViews: 0,
    pageViews: [],
    topPages: [],
    recentVisitors: []
  });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('week'); // week, month, year

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchAnalyticsData();
    
    // Refresh data every 30 seconds to show real-time updates
    const interval = setInterval(() => {
      fetchAnalyticsData();
    }, 30000);
    
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      // Get real analytics data from localStorage
      const data = getAnalyticsData(dateRange);
      setAnalyticsData(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all analytics data? This cannot be undone.')) {
      clearAnalyticsData();
      fetchAnalyticsData();
      alert('Analytics data cleared successfully!');
    }
  };

  const handleExportData = () => {
    const data = exportAnalyticsData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `temple-analytics-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const StatCard = ({ title, value, icon, color }) => (
    <div style={{
      background: 'white',
      borderRadius: '8px',
      padding: '1.5rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    }}>
      <div style={{
        width: '60px',
        height: '60px',
        borderRadius: '12px',
        background: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '2rem'
      }}>
        {icon}
      </div>
      <div>
        <p style={{ margin: 0, color: '#7f8c8d', fontSize: '0.9rem' }}>{title}</p>
        <h2 style={{ margin: '0.5rem 0 0 0', color: '#2c3e50', fontSize: '2rem' }}>{value.toLocaleString()}</h2>
      </div>
    </div>
  );

  return (
    <div className="page" style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ color: '#0B1C3F', margin: 0, fontSize: '2.5rem' }}>
            📊 Website Analytics (LIVE DATA)
          </h1>
          <p style={{ color: '#666', fontSize: '0.9rem', margin: '0.5rem 0 0 0' }}>
            Real-time tracking • Updates every 30 seconds
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {/* Date Range Selector */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            style={{
              padding: '0.75rem 1.5rem',
              border: '2px solid #E6B325',
              borderRadius: '4px',
              fontSize: '1rem',
              cursor: 'pointer',
              backgroundColor: 'white',
              fontWeight: 'bold'
            }}
          >
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="year">Last Year</option>
          </select>

          {/* Export Button */}
          <button
            onClick={handleExportData}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            📥 Export
          </button>

          {/* Clear Data Button */}
          <button
            onClick={handleClearData}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#e74c3c',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            🗑️ Clear
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#666' }}>
          <p>Loading analytics...</p>
        </div>
      ) : analyticsData.totalViews === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '4rem', 
          background: 'white', 
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: '#2c3e50' }}>📊 No Analytics Data Yet</h2>
          <p style={{ color: '#7f8c8d', fontSize: '1.1rem', margin: '1rem 0' }}>
            Start browsing pages to generate analytics data.
          </p>
          <p style={{ color: '#95a5a6', fontSize: '0.9rem' }}>
            Visit pages like Home, Events, Services, etc. to see real-time tracking.
          </p>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            <StatCard 
              title="Total Views" 
              value={analyticsData.totalViews} 
              icon="👁️" 
              color="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            />
            <StatCard 
              title="Today" 
              value={analyticsData.todayViews} 
              icon="📅" 
              color="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
            />
            <StatCard 
              title="This Week" 
              value={analyticsData.weekViews} 
              icon="📈" 
              color="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
            />
            <StatCard 
              title="This Month" 
              value={analyticsData.monthViews} 
              icon="📊" 
              color="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
            />
          </div>

          {/* Two Column Layout */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '2rem',
            marginBottom: '2rem'
          }}>
            {/* Page Views Chart */}
            <div style={{
              background: 'white',
              borderRadius: '8px',
              padding: '1.5rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ color: '#2c3e50', marginBottom: '1.5rem' }}>Daily Page Views</h3>
              <div style={{ position: 'relative', height: '250px' }}>
                {analyticsData.pageViews.length > 0 ? (
                  analyticsData.pageViews.map((item, index) => {
                    const maxViews = Math.max(...analyticsData.pageViews.map(v => v.views), 1);
                    const barHeight = (item.views / maxViews) * 200;
                    return (
                      <div key={index} style={{
                        display: 'inline-block',
                        width: `${100 / analyticsData.pageViews.length - 2}%`,
                        marginRight: '2%',
                        verticalAlign: 'bottom',
                        textAlign: 'center'
                      }}>
                        <div style={{
                          height: `${barHeight}px`,
                          background: 'linear-gradient(180deg, #E6B325 0%, #d4a820 100%)',
                          borderRadius: '4px 4px 0 0',
                          marginBottom: '0.5rem',
                          position: 'relative',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                        title={`${item.views} views`}>
                          <span style={{
                            position: 'absolute',
                            top: '-25px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            fontSize: '0.8rem',
                            fontWeight: 'bold',
                            color: '#2c3e50'
                          }}>
                            {item.views}
                          </span>
                        </div>
                        <small style={{ fontSize: '0.75rem', color: '#7f8c8d' }}>
                          {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </small>
                      </div>
                    );
                  })
                ) : (
                  <p style={{ textAlign: 'center', color: '#7f8c8d' }}>No data available</p>
                )}
              </div>
            </div>

            {/* Top Pages */}
            <div style={{
              background: 'white',
              borderRadius: '8px',
              padding: '1.5rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ color: '#2c3e50', marginBottom: '1.5rem' }}>Top Pages</h3>
              {analyticsData.topPages.length > 0 ? (
                analyticsData.topPages.map((page, index) => (
                  <div key={index} style={{ marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 'bold', color: '#2c3e50' }}>{page.page}</span>
                      <span style={{ color: '#7f8c8d' }}>{page.views.toLocaleString()} views</span>
                    </div>
                    <div style={{
                      height: '8px',
                      background: '#ecf0f1',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${page.percentage}%`,
                        background: 'linear-gradient(90deg, #E6B325 0%, #d4a820 100%)',
                        transition: 'width 0.5s ease'
                      }} />
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ textAlign: 'center', color: '#7f8c8d' }}>No page views yet</p>
              )}
            </div>
          </div>

          {/* Recent Visitors */}
          <div style={{
            background: 'white',
            borderRadius: '8px',
            padding: '1.5rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: '#2c3e50', marginBottom: '1.5rem' }}>Recent Visitors</h3>
            {analyticsData.recentVisitors.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #ecf0f1' }}>
                      <th style={{ padding: '1rem', textAlign: 'left', color: '#7f8c8d', fontWeight: '600' }}>Time</th>
                      <th style={{ padding: '1rem', textAlign: 'left', color: '#7f8c8d', fontWeight: '600' }}>Page Visited</th>
                      <th style={{ padding: '1rem', textAlign: 'left', color: '#7f8c8d', fontWeight: '600' }}>Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData.recentVisitors.map((visitor, index) => (
                      <tr key={index} style={{ borderBottom: '1px solid #ecf0f1' }}>
                        <td style={{ padding: '1rem', color: '#2c3e50' }}>{visitor.time}</td>
                        <td style={{ padding: '1rem', color: '#2c3e50', fontWeight: '500' }}>{visitor.page}</td>
                        <td style={{ padding: '1rem', color: '#7f8c8d' }}>📍 {visitor.location}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p style={{ textAlign: 'center', color: '#7f8c8d' }}>No visitors yet</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
