import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
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

// Auth
export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (userData) => api.post('/auth/register', userData);

// Species
export const getSpecies = () => api.get('/species');
export const createSpecies = (data) => api.post('/species', data);
export const updateSpecies = (id, data) => api.put(`/species/${id}`, data);
export const deleteSpecies = (id) => api.delete(`/species/${id}`);

// Sightings
export const getSightings = () => api.get('/sightings');
export const createSighting = (data) => api.post('/sightings', data);
export const updateSighting = (id, data) => api.put(`/sightings/${id}`, data);
export const deleteSighting = (id) => api.delete(`/sightings/${id}`);

// Incidents
export const getIncidents = () => api.get('/incidents');
export const createIncident = (data) => api.post('/incidents', data);
export const updateIncident = (id, data) => api.put(`/incidents/${id}`, data);
export const deleteIncident = (id) => api.delete(`/incidents/${id}`);

// Reports
export const getBiodiversityReport = () => api.get('/reports/biodiversity');
export const getSightingsOverTime = () => api.get('/reports/sightings-over-time');
export const getIncidentsSummary = () => api.get('/reports/incidents-summary');

// IoT
export const getLatestIoTData = (limit = 50) => api.get(`/iot/latest?limit=${limit}`);

export default api;