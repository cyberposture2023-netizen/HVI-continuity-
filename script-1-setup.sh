echo '#!/bin/bash

# Script 1: HVI Continuity Platform - Project Analysis and Foundation Setup
echo "=== HVI Continuity Platform Restoration - Script 1/7 ==="

# Check current project state
echo "1. Analyzing current project state..."
if [ ! -d "hvi-continuity-platform" ]; then
    echo "   Project directory not found. Creating structure..."
    mkdir -p hvi-continuity-platform
    cd hvi-continuity-platform
else
    cd hvi-continuity-platform
    echo "   Existing project found. Analyzing structure..."
fi

# Create project structure
echo "2. Creating project structure..."
mkdir -p backend/{models,routes,controllers,config,middleware}
mkdir -p frontend/{src/components,src/pages,src/services,src/utils,public}
mkdir -p scripts

# Check for existing package.json files
if [ ! -f "backend/package.json" ]; then
    echo "3. Creating backend package.json..."
    cat > backend/package.json << '"'"'EOF'"'"'
{
  "name": "hvi-continuity-backend",
  "version": "1.0.0",
  "description": "HVI Continuity Platform Backend with D1-D4 Scoring",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.5.0",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "axios": "^1.5.0",
    "helmet": "^7.0.0",
    "express-rate-limit": "^6.10.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.1",
    "jest": "^29.6.2"
  },
  "keywords": ["hvi", "continuity", "scoring", "assessment"],
  "author": "HVI Team",
  "license": "MIT"
}
EOF
else
    echo "3. Backend package.json already exists"
fi

if [ ! -f "frontend/package.json" ]; then
    echo "4. Creating frontend package.json..."
    cat > frontend/package.json << '"'"'EOF'"'"'
{
  "name": "hvi-continuity-frontend",
  "version": "1.0.0",
  "description": "HVI Continuity Platform Frontend",
  "main": "index.js",
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "axios": "^1.5.0",
    "react-router-dom": "^6.15.0",
    "chart.js": "^4.4.0",
    "react-chartjs-2": "^5.2.0",
    "date-fns": "^2.30.0"
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
EOF
else
    echo "4. Frontend package.json already exists"
fi

# Create environment configuration
echo "5. Setting up environment configuration..."
cat > backend/.env << '"'"'EOF'"'"'
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hvi-continuity
JWT_SECRET=hvi_continuity_secret_2023
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
EOF

cat > frontend/.env << '"'"'EOF'"'"'
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_VERSION=1.0.0
GENERATE_SOURCEMAP=false
EOF

# Create basic server structure
echo "6. Creating basic server structure..."
cat > backend/server.js << '"'"'EOF'"'"'
const express = require("'"'"'express'"'"'");
const mongoose = require("'"'"'mongoose'"'"'");
const cors = require("'"'"'cors'"'"'");
const helmet = require("'"'"'helmet'"'"'");
const rateLimit = require("'"'"'express-rate-limit'"'"'");
require("'"'"'dotenv'"'"'").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "'"'"'http://localhost:3000'"'"'",
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: "'"'"'10mb'"'"' }));
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || "'"'"'mongodb://localhost:27017/hvi-continuity'"'"'", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("'"'"'MongoDB connected successfully'"'"'"))
.catch(err => console.error("'"'"'MongoDB connection error:'"'"'', err));

// Basic health check endpoint
app.get("'"'"'/api/health'"'"'", (req, res) => {
  res.json({ 
    status: "'"'"'OK'"'"'", 
    timestamp: new Date().toISOString(),
    service: "'"'"'HVI Continuity Platform Backend'"'"'"
  });
});

// Import routes
const assessmentRoutes = require("'"'"'./routes/assessments'"'"'");
const dashboardRoutes = require("'"'"'./routes/dashboard'"'"'");
const authRoutes = require("'"'"'./routes/auth'"'"'");

// Use routes
app.use("'"'"'/api/assessments'"'"'", assessmentRoutes);
app.use("'"'"'/api/dashboard'"'"'", dashboardRoutes);
app.use("'"'"'/api/auth'"'"'", authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: "'"'"'Something went wrong!'"'"'",
    message: process.env.NODE_ENV === "'"'"'development'"'"'" ? err.message : "'"'"'Internal server error'"'"'"
  });
});

// 404 handler
app.use("'"'"'*'"'"'", (req, res) => {
  res.status(404).json({ error: "'"'"'Endpoint not found'"'"'" });
});

app.listen(PORT, () => {
  console.log(`HVI Continuity Platform Backend running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});

module.exports = app;
EOF

# Create initial route structure
echo "7. Creating initial route structure..."
cat > backend/routes/assessments.js << '"'"'EOF'"'"'
const express = require("'"'"'express'"'"'");
const router = express.Router();

// Placeholder for assessment routes
router.get("'"'"'/'"'"'", (req, res) => {
  res.json({ message: "'"'"'Assessment endpoint - to be implemented'"'"'" });
});

router.get("'"'"'/current'"'"'", (req, res) => {
  res.json({ message: "'"'"'Current assessment endpoint - to be implemented'"'"'" });
});

module.exports = router;
EOF

cat > backend/routes/dashboard.js << '"'"'EOF'"'"'
const express = require("'"'"'express'"'"'");
const router = express.Router();

// Placeholder for dashboard routes
router.get("'"'"'/'"'"'", (req, res) => {
  res.json({ message: "'"'"'Dashboard endpoint - to be implemented'"'"'" });
});

router.get("'"'"'/scores'"'"'", (req, res) => {
  res.json({ message: "'"'"'Dashboard scores endpoint - to be implemented'"'"'" });
});

router.get("'"'"'/score-trend'"'"'", (req, res) => {
  res.json({ message: "'"'"'Score trend endpoint - to be implemented'"'"'" });
});

module.exports = router;
EOF

cat > backend/routes/auth.js << '"'"'EOF'"'"'
const express = require("'"'"'express'"'"'");
const router = express.Router();

// Placeholder for auth routes
router.post("'"'"'/login'"'"'", (req, res) => {
  res.json({ message: "'"'"'Login endpoint - to be implemented'"'"'" });
});

module.exports = router;
EOF

# Create basic frontend structure
echo "8. Creating basic frontend structure..."
cat > frontend/public/index.html << '"'"'EOF'"'"'
<!DOCTYPE html>
<html lang="'"'"'en'"'"'">
  <head>
    <meta charset="'"'"'utf-8'"'"'" />
    <link rel="'"'"'icon'"'"'" href="'"'"'%PUBLIC_URL%/favicon.ico'"'"'" />
    <meta name="'"'"'viewport'"'"'" content="'"'"'width=device-width, initial-scale=1'"'"'" />
    <meta name="'"'"'theme-color'"'"'" content="'"'"'#000000'"'"'" />
    <meta name="'"'"'description'"'"'" content="'"'"'HVI Continuity Platform'"'"'" />
    <title>HVI Continuity Platform</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="'"'"'root'"'"'"></div>
  </body>
</html>
EOF

cat > frontend/src/App.js << '"'"'EOF'"'"'
import React from "'"'"'react'"'"'";
import { BrowserRouter as Router, Routes, Route } from "'"'"'react-router-dom'"'"'";
import Dashboard from "'"'"'./pages/Dashboard'"'"'";
import Assessment from "'"'"'./pages/Assessment'"'"'";
import Login from "'"'"'./pages/Login'"'"'";
import "'"'"'./App.css'"'"'";

function App() {
  return (
    <Router>
      <div className="'"'"'App'"'"'">
        <Routes>
          <Route path="'"'"'/"'"'"' element={<Dashboard />} />
          <Route path="'"'"'/dashboard'"'"'" element={<Dashboard />} />
          <Route path="'"'"'/assessment'"'"'" element={<Assessment />} />
          <Route path="'"'"'/login'"'"'" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
EOF

# Create placeholder components
echo "9. Creating placeholder components..."
cat > frontend/src/pages/Dashboard.js << '"'"'EOF'"'"'
import React from "'"'"'react'"'"'";

const Dashboard = () => {
  return (
    <div>
      <h1>HVI Continuity Dashboard</h1>
      <p>Dashboard page - to be implemented with D1-D4 scoring</p>
    </div>
  );
};

export default Dashboard;
EOF

cat > frontend/src/pages/Assessment.js << '"'"'EOF'"'"'
import React from "'"'"'react'"'"'";

const Assessment = () => {
  return (
    <div>
      <h1>HVI Assessment</h1>
      <p>Assessment workflow - to be implemented</p>
    </div>
  );
};

export default Assessment;
EOF

cat > frontend/src/pages/Login.js << '"'"'EOF'"'"'
import React from "'"'"'react'"'"'";

const Login = () => {
  return (
    <div>
      <h1>HVI Login</h1>
      <p>Login page - to be implemented</p>
    </div>
  );
};

export default Login;
EOF

cat > frontend/src/App.css << '"'"'EOF'"'"'
.App {
  text-align: center;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "'"'"'Segoe UI'"'"'", "'"'"'Roboto'"'"'", "'"'"'Oxygen'"'"'",
    "'"'"'Ubuntu'"'"'", "'"'"'Cantarell'"'"'", "'"'"'Fira Sans'"'"'", "'"'"'Droid Sans'"'"'", "'"'"'Helvetica Neue'"'"'",
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, "'"'"'Courier New'"'"'",
    monospace;
}
EOF

cat > frontend/src/index.js << '"'"'EOF'"'"'
import React from "'"'"'react'"'"'";
import ReactDOM from "'"'"'react-dom/client'"'"'";
import "'"'"'./App.css'"'"'";
import App from "'"'"'./App'"'"'";

const root = ReactDOM.createRoot(document.getElementById("'"'"'root'"'"'"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
EOF

# Create project documentation
echo "10. Creating project documentation..."
cat > README.md << '"'"'EOF'"'"'
# HVI Continuity Platform

## Overview
Healthcare Vulnerability Index (HVI) Continuity Platform with D1-D4 scoring system.

## Architecture
- Backend: Node.js/Express on port 5000
- Frontend: React on port 3000  
- Database: MongoDB
- Scoring: D1-D4 maturity model

## D1-D4 Scoring System
- D1: Foundational capabilities
- D2: Developing capabilities  
- D3: Advanced capabilities
- D4: Optimized capabilities

## Current Status
- Basic project structure created
- Backend and frontend foundations in place
- Missing endpoints to be implemented:
  - /api/dashboard/score-trend
  - /api/dashboard/scores  
  - /api/assessments/current
- Dashboard trends and assessment workflow need implementation
- Login screen needs completion

## Next Steps
1. Implement data models for assessments and scores
2. Build D1-D4 scoring algorithms
3. Create dashboard trend visualizations
4. Complete assessment workflow
5. Fix login authentication
EOF

echo "=== Script 1 Complete ==="
echo "Project foundation created. Next: Implement data models and D1-D4 scoring system."' > script-1-setup.sh