import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../services/analyticsService';

// Custom hook to track page views automatically
export const usePageTracking = (pageName) => {
  const location = useLocation();

  useEffect(() => {
    // Track the page view when component mounts or page changes
    if (pageName) {
      trackPageView(pageName);
    }
  }, [pageName, location.pathname]);
};

export default usePageTracking;
