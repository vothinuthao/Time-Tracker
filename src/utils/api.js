import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor to add auth token
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

// Project API
export const projectApi = {
    getAll: () => api.get('/projects'),
    create: (data) => api.post('/projects', data),
    update: (id, data) => api.put(`/projects/${id}`, data),
    delete: (id) => api.delete(`/projects/${id}`)
};

// Time Entry API
export const timeEntryApi = {
    getAll: () => api.get('/time-entries'),
    create: (data) => api.post('/time-entries', data),
    update: (id, data) => api.put(`/time-entries/${id}`, data),
    delete: (id) => api.delete(`/time-entries/${id}`)
};

// Auth API
export const authApi = {
    register: (data) => api.post('/users', data),
    login: (data) => api.post('/users/login', data),
    getProfile: () => api.get('/users/profile')
};

export default api;