// Quick import test for frontend services
console.log('Testing frontend imports...');

try {
  const apiService = require('./services/api').default;
  const useAssessment = require('./hooks/useAssessment').default;
  
  console.log('✅ All imports successful!');
  console.log('✅ API Service methods:', Object.keys(apiService).join(', '));
  console.log('✅ useAssessment hook is available');
  
  // Test the API service structure
  if (apiService.assessments && apiService.auth) {
    console.log('✅ API service structure is correct');
  } else {
    console.log('❌ API service structure incomplete');
  }
  
} catch (error) {
  console.log('❌ Import error:', error.message);
}
