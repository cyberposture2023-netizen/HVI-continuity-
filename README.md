# HVI-Continuity Platform

A 4D Human Risk Assessment system with behavioral simulations, advanced HVI scoring, and professional reporting.

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local instance)
- Git

### Development Setup

1. **Start Backend Server:**
   \\\ash
   cd backend
   npm run dev
   \\\
   OR use the script: \scripts\start-backend.bat\

2. **Start Frontend Server:**
   \\\ash
   cd frontend
   npm start
   \\\
   OR use the script: \scripts\start-frontend.bat\

3. **Start Both Servers:**
   Use the combined script: \scripts\start-development.bat\

### API Endpoints
- Health Check: \GET http://localhost:5000/api/health\
- API Info: \GET http://localhost:5000/api\
- Authentication: \POST http://localhost:5000/api/auth/login\

### Default URLs
- Backend API: http://localhost:5000
- Frontend App: http://localhost:3000

## Project Structure
\\\
hvi-continuity-platform/
├── backend/          # Node.js/Express API
├── frontend/         # React application
├── docs/            # Documentation
└── scripts/         # Development scripts
\\\

## Next Steps
1. Ensure MongoDB is running on localhost:27017
2. Start the backend server first
3. Then start the frontend server
4. Access the application at http://localhost:3000
