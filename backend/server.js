const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Import routes
const assessmentRoutes = require('./routes/assessments');
const questionRoutes = require('./routes/questions'); 
const dashboardRoutes = require('./routes/dashboard');
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/assessments', assessmentRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

// Basic health endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

// Enhanced health endpoint
app.get('/api/health-enhanced', (req, res) => {
    const healthStatus = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        port: process.env.PORT || 5000,
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        endpoints: {
            assessments: '/api/assessments',
            dashboard: '/api/dashboard',
            users: '/api/users',
            questions: '/api/questions',
            auth: '/api/auth'
        },
        memory: process.memoryUsage(),
        uptime: process.uptime()
    };
    res.json(healthStatus);
});

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hvi-continuity';

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('MongoDB connected successfully');
})
.catch((err) => {
    console.log('MongoDB connection error:', err);
    console.log('Continuing without database connection...');
});

// Basic error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err.stack);
    res.status(500).json({ 
        error: 'Something went wrong!',
        message: err.message 
    });
});

// 404 handler for undefined routes
app.use('*', (req, res) => {
    res.status(404).json({ 
        error: 'Endpoint not found',
        path: req.originalUrl 
    });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log('Server running on port ' + PORT);
    console.log('Health check available at: http://localhost:' + PORT + '/api/health');
    console.log('Enhanced health at: http://localhost:' + PORT + '/api/health-enhanced');
});

module.exports = app;
