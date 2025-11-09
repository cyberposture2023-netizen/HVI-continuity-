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
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
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
    return Promise.reject(error);
  }
);

// Enhanced API service for dashboard and assessment data
const apiService = {
  // Assessment data endpoints
  getCurrentAssessment: () => api.get('/assessments/current'),
  getAssessmentHistory: () => api.get('/assessments/history'),
  getAssessmentResults: (assessmentId) => api.get(`/assessments/${assessmentId}/results`),
  
  // User score data
  getUserScores: () => api.get('/dashboard/scores'),
  getScoreTrend: () => api.get('/dashboard/score-trend'),
  
  // Department and organizational data
  getDepartmentScores: () => api.get('/assessments/department-scores'),
  getOrganizationOverview: () => api.get('/assessments/organization-overview'),

  // Assessment actions
  startAssessment: () => api.post('/assessments/start'),
  submitDimensionAnswers: (assessmentId, dimension, answers) => 
    api.post(`/assessments/${assessmentId}/dimension/${dimension}`, { answers }),

  // Questions
  getQuestionsByDimension: (dimension) => api.get(`/questions/dimension/${dimension}`),
};

export default apiService;
