// Analytics Service - Tracks real page views and visitor data
const ANALYTICS_KEY = 'temple_analytics';
const VISITORS_KEY = 'temple_visitors';

// Initialize analytics data structure
const initAnalytics = () => {
  const stored = localStorage.getItem(ANALYTICS_KEY);
  if (!stored) {
    const initialData = {
      pageViews: {},
      dailyViews: {},
      totalViews: 0,
      startDate: new Date().toISOString()
    };
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(initialData));
    return initialData;
  }
  return JSON.parse(stored);
};

// Get location from browser (simplified - using timezone as proxy)
const getLocation = () => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const locationMap = {
    'Asia/Kolkata': 'India',
    'Asia/Calcutta': 'India',
    'America/New_York': 'New York, USA',
    'America/Los_Angeles': 'Los Angeles, USA',
    'America/Chicago': 'Chicago, USA',
    'Europe/London': 'London, UK',
    'Asia/Dubai': 'Dubai, UAE',
    'Asia/Singapore': 'Singapore',
    'Australia/Sydney': 'Sydney, Australia'
  };
  return locationMap[timezone] || 'Unknown Location';
};

// Track a page view
export const trackPageView = (pageName) => {
  try {
    const analytics = initAnalytics();
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const timestamp = new Date().toISOString();

    // Update total views
    analytics.totalViews += 1;

    // Update page-specific views
    if (!analytics.pageViews[pageName]) {
      analytics.pageViews[pageName] = 0;
    }
    analytics.pageViews[pageName] += 1;

    // Update daily views
    if (!analytics.dailyViews[today]) {
      analytics.dailyViews[today] = 0;
    }
    analytics.dailyViews[today] += 1;

    // Save analytics
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(analytics));

    // Track visitor
    trackVisitor(pageName, timestamp);

    return analytics;
  } catch (error) {
    console.error('Error tracking page view:', error);
  }
};

// Track visitor information
const trackVisitor = (pageName, timestamp) => {
  try {
    const visitors = JSON.parse(localStorage.getItem(VISITORS_KEY) || '[]');
    
    const visitor = {
      page: pageName,
      timestamp: timestamp,
      location: getLocation(),
      userAgent: navigator.userAgent.substring(0, 50)
    };

    // Keep only last 100 visitors
    visitors.unshift(visitor);
    if (visitors.length > 100) {
      visitors.pop();
    }

    localStorage.setItem(VISITORS_KEY, JSON.stringify(visitors));
  } catch (error) {
    console.error('Error tracking visitor:', error);
  }
};

// Get analytics data for display
export const getAnalyticsData = (dateRange = 'week') => {
  try {
    const analytics = initAnalytics();
    const visitors = JSON.parse(localStorage.getItem(VISITORS_KEY) || '[]');
    const now = new Date();
    
    // Calculate date ranges
    const today = new Date().toISOString().split('T')[0];
    const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const monthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Get today's views
    const todayViews = analytics.dailyViews[today] || 0;

    // Calculate week views
    let weekViews = 0;
    let monthViews = 0;
    Object.keys(analytics.dailyViews).forEach(date => {
      if (date >= weekAgo) weekViews += analytics.dailyViews[date];
      if (date >= monthAgo) monthViews += analytics.dailyViews[date];
    });

    // Get last 7 days of data for chart
    const pageViews = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      pageViews.push({
        date: dateStr,
        views: analytics.dailyViews[dateStr] || 0
      });
    }

    // Sort pages by views
    const topPages = Object.entries(analytics.pageViews)
      .map(([page, views]) => ({
        page,
        views,
        percentage: Math.round((views / analytics.totalViews) * 100)
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    // Format recent visitors
    const recentVisitors = visitors.slice(0, 20).map(v => {
      const timestamp = new Date(v.timestamp);
      const minutesAgo = Math.floor((now - timestamp) / 60000);
      
      let timeAgo;
      if (minutesAgo < 1) timeAgo = 'Just now';
      else if (minutesAgo < 60) timeAgo = `${minutesAgo} min${minutesAgo > 1 ? 's' : ''} ago`;
      else {
        const hoursAgo = Math.floor(minutesAgo / 60);
        if (hoursAgo < 24) timeAgo = `${hoursAgo} hour${hoursAgo > 1 ? 's' : ''} ago`;
        else timeAgo = `${Math.floor(hoursAgo / 24)} day${Math.floor(hoursAgo / 24) > 1 ? 's' : ''} ago`;
      }

      return {
        time: timeAgo,
        page: v.page,
        location: v.location
      };
    });

    return {
      totalViews: analytics.totalViews,
      todayViews,
      weekViews,
      monthViews,
      pageViews,
      topPages,
      recentVisitors
    };
  } catch (error) {
    console.error('Error getting analytics data:', error);
    return {
      totalViews: 0,
      todayViews: 0,
      weekViews: 0,
      monthViews: 0,
      pageViews: [],
      topPages: [],
      recentVisitors: []
    };
  }
};

// Clear analytics data (admin function)
export const clearAnalyticsData = () => {
  localStorage.removeItem(ANALYTICS_KEY);
  localStorage.removeItem(VISITORS_KEY);
  initAnalytics();
};

// Export analytics data (for backup/download)
export const exportAnalyticsData = () => {
  const analytics = localStorage.getItem(ANALYTICS_KEY);
  const visitors = localStorage.getItem(VISITORS_KEY);
  return {
    analytics: JSON.parse(analytics || '{}'),
    visitors: JSON.parse(visitors || '[]'),
    exportDate: new Date().toISOString()
  };
};
