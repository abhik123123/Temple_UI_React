import { useState, useEffect } from 'react';
import { templeTimingsAPI, eventsAPI } from '../services/api';
import config from '../config/environment';

// Helper function to get the backend base URL (not the API endpoint URL)
const BACKEND_URL = config.backendUrl || 'http://localhost:8080';

// Helper function to construct full image URL
const getImageUrl = (imageData) => {
  if (!imageData) {
    console.log('[useAPI] No image data provided');
    return null;
  }
  
  console.log('[useAPI] Processing image data:', imageData);
  
  // If it's already a data URL (base64)
  if (typeof imageData === 'string' && imageData.startsWith('data:')) {
    console.log('[useAPI] Image is base64 data URL');
    return imageData;
  }
  
  // If it's already a full URL (http:// or https://)
  if (typeof imageData === 'string' && (imageData.startsWith('http://') || imageData.startsWith('https://'))) {
    console.log('[useAPI] Image is already a full URL:', imageData);
    return imageData;
  }
  
  // If it's a relative path, construct full URL using BACKEND URL (not API URL)
  if (typeof imageData === 'string') {
    // Remove leading slash if present to avoid double slashes
    const cleanPath = imageData.startsWith('/') ? imageData.substring(1) : imageData;
    
    // If the path doesn't include 'uploads', add it
    const imagePath = cleanPath.includes('uploads/') ? cleanPath : `uploads/${cleanPath}`;
    
    const fullUrl = `${BACKEND_URL}/${imagePath}`;
    console.log('[useAPI] Constructed image URL from relative path:', imageData, '->', fullUrl);
    return fullUrl;
  }
  
  // If backend returns an object with photoUrl or similar
  if (typeof imageData === 'object' && imageData !== null) {
    if (imageData.photoUrl) return getImageUrl(imageData.photoUrl);
    if (imageData.imageUrl) return getImageUrl(imageData.imageUrl);
    if (imageData.url) return getImageUrl(imageData.url);
    if (imageData.fileName) return getImageUrl(imageData.fileName);
    if (imageData.path) return getImageUrl(imageData.path);
  }
  
  console.log('[useAPI] Could not process image data:', imageData);
  return null;
};

/**
 * Hook to fetch temple timings from backend
 * @returns {object} { timings, loading, error }
 */
export const useTempleTimings = () => {
  const [timings, setTimings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTimings = async () => {
      try {
        setLoading(true);
        const response = await templeTimingsAPI.getAll();
        console.log('Timings response:', response);
        setTimings(Array.isArray(response.data) ? response.data : response.data.timings || []);
        setError(null);
      } catch (err) {
        const errorMsg = err.response?.data?.message || 'Failed to fetch temple timings';
        setError(errorMsg);
        console.error('Error fetching temple timings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTimings();
  }, []);

  return { timings, loading, error };
};

/**
 * Hook to fetch upcoming events from backend
 * @returns {object} { events, loading, error, refetch }
 */
export const useUpcomingEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventsAPI.getUpcoming();
      console.log('Events response:', response);
      console.log('Events data:', response.data);
      
      // Process events to convert image URLs
      const eventsArray = Array.isArray(response.data) ? response.data : response.data.events || [];
      const processedEvents = eventsArray.map(event => ({
        ...event,
        // Process imageUrl - backend may return photoUrl, imageUrl, or image object
        imageUrl: getImageUrl(event.photoUrl || event.imageUrl || event.image)
      }));
      
      console.log('Processed events with image URLs:', processedEvents);
      setEvents(processedEvents);
      setError(null);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch events';
      setError(errorMsg);
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return { events, loading, error, refetch: fetchEvents };
};

/**
 * Hook to fetch all events from backend
 * @returns {object} { events, loading, error }
 */
export const useAllEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await eventsAPI.getAll();
        console.log('All Events response:', response);
        setEvents(Array.isArray(response.data) ? response.data : response.data.events || []);
        setError(null);
      } catch (err) {
        const errorMsg = err.response?.data?.message || 'Failed to fetch events';
        setError(errorMsg);
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return { events, loading, error };
};

/**
 * Hook to fetch Telugu calendar timings for today (PLACEHOLDER - Backend endpoint not yet available)
 * @returns {object} { calendarData, loading, error }
 */
export const useTeluguCalendarToday = () => {
  const calendarData = null;
  const loading = false;
  const error = 'Telugu Calendar API not yet available';

  // TODO: Implement when backend provides /api/telugu-calendar/today endpoint

  return { calendarData, loading, error };
};

/**
 * Hook for refetching data with manual trigger
 * Useful for refresh buttons
 */
export const useRefetch = (fetchFunction) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refetch = async () => {
    try {
      setLoading(true);
      const response = await fetchFunction();
      setData(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
};

/**
 * Generic hook for fetching data from any API endpoint
 * @param {function} apiFunction - API function to call (e.g., priestsAPI.getAll)
 * @returns {object} { data, loading, error }
 */
export const useAPI = (apiFunction) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await apiFunction();
        console.log('API response:', response);
        setData(Array.isArray(response.data) ? response.data : response.data || []);
        setError(null);
      } catch (err) {
        const errorMsg = err.response?.data?.message || 'Failed to fetch data';
        setError(errorMsg);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (apiFunction) {
      fetchData();
    }
  }, [apiFunction]);

  return { data, loading, error };
};

const useAPIExports = {
  useTempleTimings,
  useUpcomingEvents,
  useAllEvents,
  useTeluguCalendarToday,
  useRefetch,
  useAPI,
};

export default useAPIExports;
