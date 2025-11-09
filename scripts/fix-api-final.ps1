Write-Host "Completely fixing api.js syntax errors..." -ForegroundColor Yellow

$apiFilePath = "frontend/src/services/api.js"

# Create the correct api.js content with proper template literals
$correctContent = @'
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
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
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('hvi_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  verify: () => api.get('/auth/verify')
};

export const userAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  create: (userData) => api.post('/users', userData),
  update: (id, userData) => api.put(`/users/${id}`, userData),
  getHVIScores: (id) => api.get(`/users/${id}/hvi-scores`)
};

export const hviAPI = {
  calculate: (assessmentData) => api.post('/hvi/assessments/calculate', assessmentData),
  getUserReport: (userId) => api.get(`/hvi/reports/user/${userId}`),
  getComprehensive: (userId) => api.post(`/advanced-hvi/comprehensive/${userId}`),
  batchCalculate: (userIds) => api.post('/advanced-hvi/batch', { userIds })
};

export const simulationAPI = {
  getAll: () => api.get('/simulations'),
  getById: (id) => api.get(`/simulations/${id}`),
  create: (simulationData) => api.post('/simulations', simulationData),
  launch: (id) => api.post(`/simulations/${id}/launch`),
  recordAction: (id, userId, actionData) => api.post(`/simulations/${id}/participants/${userId}/actions`, actionData),
  complete: (id, userId) => api.post(`/simulations/${id}/participants/${userId}/complete`),
  getAnalytics: (id) => api.get(`/simulations/${id}/analytics`),
  getTemplates: () => api.get('/simulations/templates')
};

export const assessmentAPI = {
  getAll: () => api.get('/assessments'),
  getById: (id) => api.get(`/assessments/${id}`),
  create: (assessmentData) => api.post('/assessments', assessmentData),
  assign: (id, userIds) => api.post(`/assessments/${id}/assign`, { userIds }),
  start: (id) => api.post(`/assessments/${id}/start`),
  submit: (id, responses) => api.post(`/assessments/${id}/submit`, { responses }),
  getAnalytics: (id) => api.get(`/assessments/${id}/analytics`),
  getTemplates: () => api.get('/assessments/templates/all')
};

export const reportingAPI = {
  getUserReport: (userId) => api.get(`/reports/user/${userId}/comprehensive`),
  getDepartmentReport: (department) => api.get(`/reports/department/${department}`),
  getOrganizationReport: () => api.get('/reports/organization/overview')
};

export default api;
'@

# Write the correct content to the file
$correctContent | Out-File -FilePath $apiFilePath -Encoding UTF8

Write-Host "api.js has been completely fixed with proper JavaScript syntax" -ForegroundColor Green
Write-Host "Template literals and string syntax are now correct" -ForegroundColor Green

Write-Host "`nPlease restart the frontend server:" -ForegroundColor Cyan
Write-Host "1. Stop current server (Ctrl+C)" -ForegroundColor White
Write-Host "2. Run: cd frontend && npm start" -ForegroundColor White