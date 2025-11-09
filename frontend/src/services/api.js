import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
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

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
};

// Assessment API calls
export const assessmentAPI = {
  // Start a new assessment
  startAssessment: (assessmentData) => api.post('/assessments/start', assessmentData),
  
  // Submit answers for a dimension
  submitDimensionAnswers: (assessmentId, dimension, answers) => 
    api.post(`/assessments/${assessmentId}/dimension/${dimension}`, { answers }),
  
  // Get current assessment
  getCurrentAssessment: () => api.get('/assessments/current'),
  
  // Get assessment by ID
  getAssessment: (assessmentId) => api.get(`/assessments/${assessmentId}`),
  
  // Get assessment history
  getAssessmentHistory: (params) => api.get('/assessments/history', { params }),
  
  // Complete assessment
  completeAssessment: (assessmentId) => api.post(`/assessments/${assessmentId}/complete`),
};

// Questions API calls
export const questionsAPI = {
  // Get questions for a specific dimension
  getDimensionQuestions: (dimension) => api.get(`/questions/dimension/${dimension}`),
  
  // Get all questions (admin only)
  getAllQuestions: () => api.get('/questions/all'),
};

// System API calls
export const systemAPI = {
  healthCheck: () => api.get('/health'),
  systemInfo: () => api.get('/system/info'),
};

// User scores API calls
export const scoresAPI = {
  getUserScores: () => api.get('/users/scores'),
  getDepartmentScores: () => api.get('/users/department-scores'),
  getTrendData: () => api.get('/users/score-trends'),
};

export default api;
