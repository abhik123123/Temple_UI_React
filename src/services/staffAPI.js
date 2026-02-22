import axios from 'axios';
import config from '../config/environment';

// Create axios instance for staff API
const apiClient = axios.create({
  baseURL: config.backendUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include JWT token
apiClient.interceptors.request.use(
  (request) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      request.headers.Authorization = `Bearer ${token}`;
    }
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
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Staff API
export const staffAPI = {
  // Get all staff members
  getAll: () => apiClient.get('/api/staff'),
  
  // Get staff by department
  getByDepartment: (department) => apiClient.get(`/api/staff/department/${department}`),
  
  // Get single staff member
  getById: (id) => apiClient.get(`/api/staff/${id}`),
  
  // Create staff member (admin only)
  create: (data) => apiClient.post('/api/staff', data),
  
  // Update staff member (admin only)
  update: (id, data) => apiClient.put(`/api/staff/${id}`, data),
  
  // Delete staff member (admin only)
  delete: (id) => apiClient.delete(`/api/staff/${id}`),
};

export default apiClient;
