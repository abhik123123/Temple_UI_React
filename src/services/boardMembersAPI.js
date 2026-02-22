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

// Transform PostgreSQL response to match frontend format
const transformMember = (member) => {
  if (!member) return null;
  
  return {
    id: member.id,
    fullName: member.full_name || member.fullName,
    position: member.position,
    department: member.department,
    email: member.email,
    phoneNumber: member.phone_number || member.phoneNumber,
    biography: member.biography,
    profileImageUrl: member.profile_image_url || member.profileImageUrl,
    createdAt: member.created_at || member.createdAt,
    updatedAt: member.updated_at || member.updatedAt
  };
};

// Add response interceptor to handle errors and transform data
apiClient.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.status}`, response.data);
    
    // Transform PostgreSQL snake_case to camelCase
    if (response.data) {
      if (Array.isArray(response.data)) {
        response.data = response.data.map(transformMember);
      } else if (response.data.id) {
        response.data = transformMember(response.data);
      }
    }
    
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
