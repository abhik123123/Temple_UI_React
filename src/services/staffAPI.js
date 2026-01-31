import axios from 'axios';
import config from '../config/environment';

const staffClient = axios.create({
  baseURL: config.backendUrl,
  headers: {
    'Content-Type': 'application/json'
  }
});

staffClient.interceptors.request.use((request) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    request.headers.Authorization = `Bearer ${token}`;
  }
  return request;
});

export const staffAPI = {
  getAll: () => staffClient.get('/api/staff'),
  getByDepartment: (department) => staffClient.get(`/api/staff/department/${department}`),
  getById: (id) => staffClient.get(`/api/staff/${id}`),
  create: (data) => staffClient.post('/api/staff', data),
  update: (id, data) => staffClient.put(`/api/staff/${id}`, data),
  delete: (id) => staffClient.delete(`/api/staff/${id}`)
};
