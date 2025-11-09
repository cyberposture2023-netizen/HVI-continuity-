import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('hvi_token');
        if (token) {
            config.headers.Authorization = \Bearer \\;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('hvi_token');
            localStorage.removeItem('hvi_user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// API endpoints
export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    logout: () => api.post('/auth/logout'),
    refresh: () => api.post('/auth/refresh'),
};

export const userAPI = {
    getAll: () => api.get('/users'),
    getById: (id) => api.get(\/users/\\),
    create: (userData) => api.post('/users', userData),
    update: (id, userData) => api.put(\/users/\\, userData),
    getHVIScores: (id) => api.get(\/users/\/hvi-scores\),
    getAssessments: (id) => api.get(\/users/\/assessments\),
};

export const assessmentAPI = {
    getAll: (params) => api.get('/assessments', { params }),
    getById: (id) => api.get(\/assessments/\\),
    create: (assessmentData) => api.post('/assessments', assessmentData),
    update: (id, assessmentData) => api.put(\/assessments/\\, assessmentData),
    submitSimulation: (data) => api.post('/assessments/simulation', data),
    generateReport: (id) => api.get(\/assessments/\/report\),
};

export const simulationAPI = {
    getScenarios: () => api.get('/simulation/scenarios'),
    startScenario: (scenarioId) => api.post(\/simulation/start/\\),
    submitResponse: (data) => api.post('/simulation/response', data),
    completeScenario: (data) => api.post('/simulation/complete', data),
};

// Health check
export const healthCheck = () => api.get('/health');

export default api;
