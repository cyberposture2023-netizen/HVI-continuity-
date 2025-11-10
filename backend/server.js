const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());

// Demo data
const demoData = {
    users: [
        { id: 1, name: 'John Doe', email: 'john@hvi.demo', role: 'admin', status: 'active' },
        { id: 2, name: 'Jane Smith', email: 'jane@hvi.demo', role: 'user', status: 'active' },
        { id: 3, name: 'Mike Johnson', email: 'mike@hvi.demo', role: 'assessor', status: 'active' }
    ],
    assessments: [
        { id: 1, title: 'Security Baseline Assessment', status: 'completed', score: 85, date: '2024-01-15' },
        { id: 2, title: 'Compliance Audit Q1', status: 'in-progress', score: null, date: '2024-01-20' },
        { id: 3, title: 'Risk Evaluation Framework', status: 'pending', score: null, date: '2024-01-25' }
    ],
    questions: [
        { id: 1, category: 'Security', text: 'Is multi-factor authentication enabled for all admin accounts?', type: 'boolean' },
        { id: 2, category: 'Compliance', text: 'Are regular security awareness trainings conducted?', type: 'boolean' },
        { id: 3, category: 'Operations', text: 'Describe your incident response procedure:', type: 'text' },
        { id: 4, category: 'Infrastructure', text: 'How often are system backups performed?', type: 'multiple-choice', options: ['Daily', 'Weekly', 'Monthly', 'Never'] }
    ],
    dashboard: {
        totalAssessments: 12,
        completedAssessments: 8,
        averageScore: 78,
        activeUsers: 45,
        highRiskItems: 3,
        upcomingDeadlines: 2
    }
};

// 1. Health Check Endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'operational',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: '1.0.0',
        endpoints: [
            'GET /api/health',
            'POST /api/auth/login',
            'GET /api/assessments',
            'GET /api/questions',
            'GET /api/dashboard',
            'GET /api/users'
        ],
        environment: process.env.NODE_ENV || 'development'
    });
});

// 2. Authentication Demo Endpoint
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: 'Username and password are required'
        });
    }

    // Demo authentication logic
    if (username === 'demo' && password === 'demo') {
        res.json({
            success: true,
            message: 'Authentication successful',
            user: {
                id: 1,
                username: 'demo-user',
                name: 'Demo User',
                role: 'admin',
                token: 'demo-jwt-token-' + Date.now()
            }
        });
    } else {
        res.status(401).json({
            success: false,
            message: 'Invalid credentials'
        });
    }
});

// 3. Assessments Management Endpoint
app.get('/api/assessments', (req, res) => {
    res.json({
        success: true,
        data: demoData.assessments,
        pagination: {
            total: demoData.assessments.length,
            page: 1,
            limit: 10
        }
    });
});

// 4. Questions Bank Endpoint
app.get('/api/questions', (req, res) => {
    const { category } = req.query;
    
    let questions = demoData.questions;
    if (category) {
        questions = questions.filter(q => q.category.toLowerCase() === category.toLowerCase());
    }

    res.json({
        success: true,
        data: questions,
        categories: ['Security', 'Compliance', 'Operations', 'Infrastructure']
    });
});

// 5. Dashboard Analytics Endpoint
app.get('/api/dashboard', (req, res) => {
    res.json({
        success: true,
        data: demoData.dashboard,
        lastUpdated: new Date().toISOString(),
        trends: {
            scoreImprovement: 5,
            assessmentCompletion: 12,
            userGrowth: 8
        }
    });
});

// 6. User Management Endpoint
app.get('/api/users', (req, res) => {
    res.json({
        success: true,
        data: demoData.users,
        total: demoData.users.length,
        roles: ['admin', 'user', 'assessor']
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found',
        availableEndpoints: [
            '/api/health',
            '/api/auth/login',
            '/api/assessments',
            '/api/questions',
            '/api/dashboard',
            '/api/users'
        ]
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 HVI Continuity Platform Backend running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🔗 Available endpoints:`);
    console.log(`   GET  /api/health`);
    console.log(`   POST /api/auth/login`);
    console.log(`   GET  /api/assessments`);
    console.log(`   GET  /api/questions`);
    console.log(`   GET  /api/dashboard`);
    console.log(`   GET  /api/users`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
