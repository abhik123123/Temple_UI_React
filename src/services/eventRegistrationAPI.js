/**
 * eventRegistrationAPI.js - API service for event registration
 * Handles registration requests to the backend
 */

import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * ============ EVENT REGISTRATION API ============
 */
export const eventRegistrationAPI = {
  // Register for an event (Public - no auth required)
  register: (registrationData) => {
    console.log('Sending registration request:', registrationData);
    return api.post('/events/register', registrationData);
  },

  // Get all registrations for an event (Admin only)
  getRegistrations: (eventId) => 
    api.get(`/events/${eventId}/registrations`),

  // Get registration statistics (Admin only)
  getStatistics: (eventId) => 
    api.get(`/events/${eventId}/registration-stats`),

  // Cancel a registration (Admin only)
  cancelRegistration: (registrationId) => 
    api.delete(`/events/registrations/${registrationId}`)
};

export default api;
