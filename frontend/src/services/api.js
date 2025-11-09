import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Enhanced API service for dashboard and assessment data
const apiService = {
  // Assessment data endpoints
  getCurrentAssessment: () => axios.get(${API_URL}/assessments/current),
  getAssessmentHistory: () => axios.get(${API_URL}/assessments/history),
  getAssessmentResults: (assessmentId) => axios.get(${API_URL}/assessments//results),
  
  // User score data
  getUserScores: () => axios.get(${API_URL}/users/scores),
  getScoreTrend: () => axios.get(${API_URL}/users/score-trend),
  
  // Department and organizational data
  getDepartmentScores: () => axios.get(${API_URL}/assessments/department-scores),
  getOrganizationOverview: () => axios.get(${API_URL}/assessments/organization-overview),
};

export default apiService;
