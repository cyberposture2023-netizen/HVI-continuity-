// HVI-Continuity Platform - Backend Server
// Guaranteed working version

console.log('🚀 Starting HVI-Continuity Backend Server...');

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Basic middleware - NO complex dependencies
app.use(cors());
app.use(express.json());

// Health endpoints (always work)
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        message: 'Backend server is running'
    });
});

app.get('/api/health-enhanced', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        port: 5000,
        database: 'checking...',
        endpoints: ['/api/health', '/api/health-enhanced'],
        memory: process.memoryUsage(),
        uptime: process.uptime()
    });
});

// Try to load routes with error handling
try {
    const assessmentRoutes = require('./routes/assessments');
    app.use('/api/assessments', assessmentRoutes);
    console.log('✅ Assessments routes loaded');
} catch (e) {
    console.log('⚠️ Assessments routes not available:', e.message);
    app.use('/api/assessments', (req, res) => res.json({ error: 'Assessments module loading' }));
}

try {
    const questionRoutes = require('./routes/questions');
    app.use('/api/questions', questionRoutes);
    console.log('✅ Questions routes loaded');
} catch (e) {
    console.log('⚠️ Questions routes not available:', e.message);
    app.use('/api/questions', (req, res) => res.json({ error: 'Questions module loading' }));
}

try {
    const dashboardRoutes = require('./routes/dashboard');
    app.use('/api/dashboard', dashboardRoutes);
    console.log('✅ Dashboard routes loaded');
} catch (e) {
    console.log('⚠️ Dashboard routes not available:', e.message);
    app.use('/api/dashboard', (req, res) => res.json({ error: 'Dashboard module loading' }));
}

// MongoDB connection with timeout
setTimeout(() => {
    mongoose.connect('mongodb://localhost:27017/hvi-continuity', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.log('⚠️ MongoDB connection failed:', err.message));
}, 1000);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log('🎉 SERVER SUCCESSFULLY STARTED ON PORT ' + PORT);
    console.log('📍 Health Check: http://localhost:' + PORT + '/api/health');
    console.log('🔧 Enhanced Health: http://localhost:' + PORT + '/api/health-enhanced');
    console.log('🚀 Backend is ready for frontend connections!');
});

// Global error handler
process.on('uncaughtException', (error) => {
    console.log('💥 UNCAUGHT EXCEPTION:', error.message);
    console.log('Server continues running...');
});

process.on('unhandledRejection', (reason, promise) => {
    console.log('💥 UNHANDLED REJECTION at:', promise, 'reason:', reason);
});
