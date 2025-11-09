const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const connectDB = require('./config/database');

// Route imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

// Initialize Express app
const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint (works even without database)
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'HVI-Continuity Platform API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        database: 'Checking...'
    });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Basic API info endpoint
app.get('/api', (req, res) => {
    res.json({
        name: 'HVI-Continuity Platform API',
        version: '1.0.0',
        description: '4D Human Risk Assessment System',
        endpoints: {
            health: '/api/health',
            auth: '/api/auth',
            users: '/api/users',
            assessments: '/api/assessments'
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({
        status: 'error',
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Route not found'
    });
});

// Start server with better error handling
const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start server
async function startServer() {
    try {
        console.log('Attempting to connect to MongoDB...');
        await connectDB();
        console.log('MongoDB connected successfully!');
        
        app.listen(PORT, () => {
            console.log('HVI-Continuity Platform API running on port ' + PORT);
            console.log('Environment: ' + process.env.NODE_ENV);
            console.log('Frontend URL: ' + (process.env.FRONTEND_URL || 'http://localhost:3000'));
            console.log('Database: ' + process.env.MONGODB_URI);
            console.log('Started at: ' + new Date().toISOString());
            console.log('Health check: http://localhost:' + PORT + '/api/health');
        });
    } catch (error) {
        console.error('Failed to start server:', error.message);
        console.log('Starting server without database connection...');
        
        // Update health endpoint to show database status
        app.get('/api/health', (req, res) => {
            res.status(200).json({
                status: 'success',
                message: 'HVI-Continuity Platform API is running (database connection failed)',
                timestamp: new Date().toISOString(),
                environment: process.env.NODE_ENV,
                database: 'Disconnected - ' + error.message
            });
        });
        
        app.listen(PORT, () => {
            console.log('HVI-Continuity Platform API running on port ' + PORT + ' (without database)');
            console.log('Note: MongoDB connection failed. Some features will not work.');
            console.log('Health check: http://localhost:' + PORT + '/api/health');
        });
    }
}

startServer();

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    process.exit(0);
});
