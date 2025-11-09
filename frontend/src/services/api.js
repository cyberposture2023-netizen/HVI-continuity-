import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Request interceptor to add auth token (when implemented)
api.interceptors.request.use(
  (config) => {
    // Add auth token here when authentication is implemented
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
    console.error('API Error:', error.response?.data || error.message);
    
    // Handle authentication errors
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      // Don't redirect for now to avoid breaking the demo
      // window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Comprehensive API service for all application needs
const apiService = {
  // ===== HEALTH CHECK =====
  health: () => api.get('/health'),

  // ===== AUTHENTICATION ENDPOINTS =====
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  verify: () => api.get('/auth/verify'),

  // ===== ASSESSMENT ENDPOINTS =====
  startAssessment: () => api.post('/assessments/start'),
  getCurrentAssessment: () => api.get('/assessments/current'),
  getAssessmentHistory: () => api.get('/assessments/history'),
  getAssessmentResults: (assessmentId) => api.get(`/assessments/${assessmentId}/results`),
  submitDimensionAnswers: (assessmentId, dimension, answers) => 
    api.post(`/assessments/${assessmentId}/dimension/${dimension}`, { answers }),
  getDepartmentScores: () => api.get('/assessments/department-scores'),
  getOrganizationOverview: () => api.get('/assessments/organization-overview'),

  // ===== QUESTIONS ENDPOINTS =====
  getQuestionsByDimension: (dimension) => api.get(`/questions/dimension/${dimension}`),
  getAllQuestions: () => api.get('/questions'),

  // ===== DASHBOARD ENDPOINTS =====
  getUserScores: () => api.get('/dashboard/scores'),
  getScoreTrend: () => api.get('/dashboard/score-trend'),

  // ===== USER PROFILE ENDPOINTS =====
  getUserProfile: () => api.get('/users/profile'),
  updateUserProfile: (userData) => api.put('/users/profile', userData),
};

// Legacy export for backward compatibility
export default apiService;

// Named exports for specific service groups
export const authAPI = {
  login: apiService.login,
  register: apiService.register,
  logout: apiService.logout,
  verify: apiService.verify,
};

export const assessmentAPI = {
  start: apiService.startAssessment,
  getCurrent: apiService.getCurrentAssessment,
  getHistory: apiService.getAssessmentHistory,
  getResults: apiService.getAssessmentResults,
  submitDimension: apiService.submitDimensionAnswers,
  getDepartmentScores: apiService.getDepartmentScores,
  getOrganizationOverview: apiService.getOrganizationOverview,
};

export const questionsAPI = {
  getByDimension: apiService.getQuestionsByDimension,
  getAll: apiService.getAllQuestions,
};

export const dashboardAPI = {
  getUserScores: apiService.getUserScores,
  getScoreTrend: apiService.getScoreTrend,
};

export const usersAPI = {
  getProfile: apiService.getUserProfile,
  updateProfile: apiService.updateUserProfile,
};
