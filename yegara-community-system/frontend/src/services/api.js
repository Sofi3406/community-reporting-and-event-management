import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

const isFormData = (data) =>
  typeof FormData !== 'undefined' && data instanceof FormData;

const withFormData = (data) =>
  isFormData(data)
    ? { headers: { 'Content-Type': 'multipart/form-data' } }
    : undefined;

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Reports API
export const reportsAPI = {
  getAll: (params) => api.get('/reports', { params }),
  getOne: (id) => api.get(`/reports/${id}`),
  create: (data) => api.post('/reports', data, withFormData(data)),
  update: (id, data) => api.put(`/reports/${id}`, data, withFormData(data)),
  delete: (id) => api.delete(`/reports/${id}`),
  getMyReports: () => api.get('/reports/my-reports'),
  getByDepartment: (department) => api.get(`/reports/department/${department}`),
  postUpdate: (id, data) => api.post(`/reports/${id}/updates`, data)
};

// Users API
export const usersAPI = {
  getAll: (params) => api.get('/users', { params }),
  getOne: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  getByWoreda: (woreda) => api.get(`/users/woreda/${woreda}`),
  getByRole: (role) => api.get(`/users/role/${role}`)
};

// Analytics API
export const analyticsAPI = {
  getDashboard: (params) => api.get('/analytics', { params }),
  getRealtime: () => api.get('/analytics/realtime'),
  exportData: (params) => api.get('/analytics/export', { params })
};

// Events API
export const eventsAPI = {
  getAll: (params) => api.get('/events', { params }),
  getOne: (id) => api.get(`/events/${id}`),
  create: (data) => api.post('/events', data, withFormData(data)),
  update: (id, data) => api.put(`/events/${id}`, data, withFormData(data)),
  delete: (id) => api.delete(`/events/${id}`),
  getByWoreda: (woreda) => api.get(`/events/woreda/${woreda}`),
  register: (id) => api.post(`/events/${id}/register`)
};

// Resources API
export const resourcesAPI = {
  getAll: (params) => api.get('/resources', { params }),
  getOne: (id) => api.get(`/resources/${id}`),
  create: (data) => api.post('/resources', data, withFormData(data)),
  update: (id, data) => api.put(`/resources/${id}`, data, withFormData(data)),
  delete: (id) => api.delete(`/resources/${id}`),
  download: (id) => api.get(`/resources/${id}/download`, { responseType: 'blob' })
};

// Meetings API
export const meetingsAPI = {
  getAll: (params) => api.get('/meetings', { params }),
  create: (data) => api.post('/meetings', data),
  update: (id, data) => api.put(`/meetings/${id}`, data),
  delete: (id) => api.delete(`/meetings/${id}`)
};

// Announcements API
export const announcementsAPI = {
  getAll: () => api.get('/announcements'),
  create: (data) => api.post('/announcements', data),
  delete: (id) => api.delete(`/announcements/${id}`)
};

export default api;