# HVI Continuity Platform - Export Error Fix Script
# This script fixes the service export errors

Write-Host "🔧 Fixing Service Export Errors" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green

# Fix the services/index.js file
$servicesIndexPath = "frontend/src/services/index.js"

Write-Host "`n📄 Fixing: $servicesIndexPath" -ForegroundColor White

if (Test-Path $servicesIndexPath) {
    # Create backup
    Copy-Item $servicesIndexPath "$servicesIndexPath.backup" -Force
    Write-Host "   📦 Backup created" -ForegroundColor Yellow
    
    # Create correct export file
    $correctContent = @"
import api from './api';
import authService from './authService';
import assessmentService from './assessmentService';
import dashboardService from './dashboardService';
import userService from './userService';

export {
  authService,
  assessmentService, 
  dashboardService,
  userService,
  api
};

export default api;
"@

    $correctContent | Out-File -FilePath $servicesIndexPath -Encoding UTF8
    Write-Host "   ✅ Fixed exports in index.js" -ForegroundColor Green
} else {
    Write-Host "   ❌ File not found" -ForegroundColor Red
}

# Also check if we need to create the api.js file
$apiFilePath = "frontend/src/services/api.js"
if (-not (Test-Path $apiFilePath)) {
    Write-Host "`n📄 Creating missing: $apiFilePath" -ForegroundColor White
    
    $apiContent = @"
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = \`Bearer \${token}\`;
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
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
"@

    $apiContent | Out-File -FilePath $apiFilePath -Encoding UTF8
    Write-Host "   ✅ Created api.js" -ForegroundColor Green
}

Write-Host "`n🎉 Export errors fixed!" -ForegroundColor Green
Write-Host "Try building again: cd frontend && npm run build" -ForegroundColor Cyan