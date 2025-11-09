require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./config/database');

// Route imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const hviRoutes = require('./routes/hviRoutes');
const simulationRoutes = require('./routes/simulationRoutes');\nconst advancedHviRoutes = require('./routes/advancedHviRoutes');\nconst assessmentRoutes = require('./routes/assessmentRoutes'); // Add HVI routes

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/hvi', hviRoutes);
app.use('/api/simulations', simulationRoutes);\napp.use('/api/advanced-hvi', advancedHviRoutes);\napp.use('/api/assessments', assessmentRoutes);\napp.use('/api/simulations', simulationRoutes);\napp.use('/api/advanced-hvi', advancedHviRoutes);\napp.use('/api/assessments', assessmentRoutes); // Add HVI routes

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'HVI Continuity Platform API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Default route
app.get('/', (req, res) => {
  res.json({ 
    message: 'HVI Continuity Platform API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      hvi: '/api/hvi',
      health: '/api/health'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'Endpoint not found',
    availableEndpoints: ['/api/auth', '/api/users', '/api/hvi', '/api/advanced-hvi', '/api/assessments', '/api/simulations', '/api/health']
  });
});

const PORT = process.env.PORT || 5000;

// Find available port if default is in use
const findAvailablePort = (port) => {
  return new Promise((resolve, reject) => {
    const server = app.listen(port)
      .once('listening', () => {
        server.close();
        resolve(port);
      })
      .once('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          resolve(findAvailablePort(port + 1));
        } else {
          reject(err);
        }
      });
  });
};

const startServer = async () => {
  try {
    const availablePort = await findAvailablePort(PORT);
    app.listen(availablePort, () => {
      console.log(\🚀 HVI Continuity Platform Server running on port \\);
      console.log(\📍 Health check: http://localhost:\/api/health\);
      console.log(\🌐 Environment: \\);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();




