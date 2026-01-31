import axios from 'axios';
import config from '../config/environment';

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: config.backendUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Set to true if backend uses session cookies
});

// Add request interceptor to include JWT token and handle CORS
apiClient.interceptors.request.use(
  (request) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      request.headers.Authorization = `Bearer ${token}`;
    }
    // Add CORS headers hint
    request.headers['Access-Control-Allow-Credentials'] = 'true';
    console.log(`[API] ${request.method?.toUpperCase()} ${request.url}`, request.data);
    return request;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.status}`, response.data);
    return response;
  },
  (error) => {
    console.error(`[API Error] ${error.message}`, error.response?.status, error.response?.data);
    if (error.response?.status === 401) {
      // Handle unauthorized - clear token and redirect to login
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    if (error.response?.status === 403) {
      // Handle forbidden - might need authentication
      console.error('Access Forbidden (403) - Backend may require authentication');
    }
    return Promise.reject(error);
  }
);

// Temple Timings API
export const templeTimingsAPI = {
  getAll: () => apiClient.get('/api/timings'),
  getById: (id) => apiClient.get(`/api/timings/${id}`),
  getByDay: (day) => apiClient.get(`/api/timings/day/${day}`),
  create: (data) => apiClient.post('/api/timings', data),
  update: (id, data) => apiClient.put(`/api/timings/${id}`, data),
  delete: (id) => apiClient.delete(`/api/timings/${id}`),
};

// Events API
export const eventsAPI = {
  getAll: () => apiClient.get('/api/events'),
  getById: (id) => apiClient.get(`/api/events/${id}`),
  getUpcoming: () => apiClient.get('/api/events'),
  create: (data) => apiClient.post('/api/events', data),
  delete: (id) => apiClient.delete(`/api/events/${id}`),
};

// Service Items API
export const servicesAPI = {
  getAll: () => apiClient.get('/api/services'),
  getById: (id) => apiClient.get(`/api/services/${id}`),
  create: (data) => apiClient.post('/api/services', data),
  update: (id, data) => apiClient.put(`/api/services/${id}`, data),
  delete: (id) => apiClient.delete(`/api/services/${id}`),
};

// Priests API
export const priestsAPI = {
  getAll: () => apiClient.get('/api/priests'),
  getById: (id) => apiClient.get(`/api/priests/${id}`),
  create: (data) => apiClient.post('/api/priests', data),
  update: (id, data) => apiClient.put(`/api/priests/${id}`, data),
  delete: (id) => apiClient.delete(`/api/priests/${id}`),
};
export const contactAPI = {
  submit: (data) => apiClient.post('/api/contact', data),
};

// Donors API
export const donorsAPI = {
  getAll: () => apiClient.get('/api/donors'),
  getById: (id) => apiClient.get(`/api/donors/${id}`),
  create: (data) => apiClient.post('/api/donors', data),
  update: (id, data) => apiClient.put(`/api/donors/${id}`, data),
  delete: (id) => apiClient.delete(`/api/donors/${id}`),
};

// Authentication API
export const authAPI = {
  login: (credentials) => apiClient.post('/api/auth/login', credentials),
  logout: () => {
    localStorage.removeItem('authToken');
  },
};

// Sponsorship API
export const sponsorshipAPI = {
  getAll: () => apiClient.get('/api/sponsorships'),
  getById: (id) => apiClient.get(`/api/sponsorships/${id}`),
  create: (data) => apiClient.post('/api/sponsorships', data),
  update: (id, data) => apiClient.put(`/api/sponsorships/${id}`, data),
  delete: (id) => apiClient.delete(`/api/sponsorships/${id}`),
};

// Bhojanashala (Community Kitchen) API
export const bhojanaShalaAPI = {
  getAll: () => apiClient.get('/api/bhojanashala'),
  getById: (id) => apiClient.get(`/api/bhojanashala/${id}`),
  create: (data) => apiClient.post('/api/bhojanashala', data),
  update: (id, data) => apiClient.put(`/api/bhojanashala/${id}`, data),
  delete: (id) => apiClient.delete(`/api/bhojanashala/${id}`),
};

// Goshala (Cow Sanctuary) API
export const goshakaAPI = {
  getAll: () => apiClient.get('/api/goshala'),
  getById: (id) => apiClient.get(`/api/goshala/${id}`),
  create: (data) => apiClient.post('/api/goshala', data),
  update: (id, data) => apiClient.put(`/api/goshala/${id}`, data),
  delete: (id) => apiClient.delete(`/api/goshala/${id}`),
};

// Vidyalaya (Temple School) API
export const vidyalayaAPI = {
  getAll: () => apiClient.get('/api/vidyalaya'),
  getById: (id) => apiClient.get(`/api/vidyalaya/${id}`),
  create: (data) => apiClient.post('/api/vidyalaya', data),
  update: (id, data) => apiClient.put(`/api/vidyalaya/${id}`, data),
  delete: (id) => apiClient.delete(`/api/vidyalaya/${id}`),
};

export default apiClient;
