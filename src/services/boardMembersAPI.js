import axios from 'axios';
import config from '../config/environment';

// Create axios instance for board members API
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

// Board Members API
export const boardMembersAPI = {
  // Get all board members
  getAll: () => apiClient.get('/api/board-members'),
  
  // Get members by department
  getByDepartment: (department) => apiClient.get(`/api/board-members/department/${department}`),
  
  // Get single member
  getById: (id) => apiClient.get(`/api/board-members/${id}`),
  
  // Create member (admin only)
  create: (data) => apiClient.post('/api/board-members', data),
  
  // Update member (admin only)
  update: (id, data) => apiClient.put(`/api/board-members/${id}`, data),
  
  // Delete member (admin only)
  delete: (id) => apiClient.delete(`/api/board-members/${id}`),
};

export default apiClient;
