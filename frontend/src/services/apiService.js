import axios from 'axios'

const API_BASE_URL = '/api' // Using proxy in development

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error)
    throw error
  }
)

// API service functions
export const apiService = {
  // Health check
  async getHealth() {
    const response = await apiClient.get('/health')
    return response.data
  },

  // Authentication
  async login(credentials) {
    const response = await apiClient.post('/auth/login', credentials)
    return response.data
  },

  // Assessments
  async getAssessments() {
    const response = await apiClient.get('/assessments')
    return response.data
  },

  // Questions
  async getQuestions() {
    const response = await apiClient.get('/questions')
    return response.data
  },

  // Dashboard data
  async getDashboardData() {
    const response = await apiClient.get('/dashboard')
    return response.data
  },

  // Users
  async getUsers() {
    const response = await apiClient.get('/users')
    return response.data
  }
}

export default apiService
