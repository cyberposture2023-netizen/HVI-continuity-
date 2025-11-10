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

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🔄 API Call: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error('❌ API Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Success: ${response.status} ${response.config.url}`)
    return response
  },
  (error) => {
    console.error('❌ API Response Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message
    })
    
    if (error.code === 'ECONNREFUSED') {
      error.message = 'Cannot connect to backend server. Please ensure the backend is running on port 5000.'
    } else if (error.response?.status === 404) {
      error.message = 'API endpoint not found. Please check the backend routes.'
    } else if (error.response?.status >= 500) {
      error.message = 'Backend server error. Please check the backend logs.'
    }
    
    return Promise.reject(error)
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
