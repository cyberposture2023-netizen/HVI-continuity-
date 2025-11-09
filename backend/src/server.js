const express = require('express');

// Initialize Express first
const app = express();

// Basic middleware - no dependencies that could fail
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health endpoint - always works
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'HVI-Continuity Platform API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// API info
app.get('/api', (req, res) => {
    res.json({
        name: 'HVI-Continuity Platform API',
        version: '1.0.0',
        description: '4D Human Risk Assessment System',
        status: 'Running (Basic Mode)'
    });
});

// Start server immediately on available port
function startServer(port = 5000) {
    const server = app.listen(port, 'localhost', () => {
        console.log('🚀 HVI-Continuity Platform API started successfully!');
        console.log('📍 Port: ' + port);
        console.log('🌐 URL: http://localhost:' + port);
        console.log('❤️  Health: http://localhost:' + port + '/api/health');
        console.log('⏰ Started: ' + new Date().toISOString());
    });

    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log('Port ' + port + ' is busy, trying port ' + (port + 1));
            startServer(port + 1);
        } else {
            console.error('Server error:', err);
        }
    });

    return server;
}

// Now try to load optional dependencies
try {
    require('dotenv').config();
    console.log('Environment variables loaded');
} catch (err) {
    console.log('dotenv not available, using defaults');
}

// Try to connect to MongoDB (non-blocking)
setTimeout(() => {
    try {
        const connectDB = require('./config/database');
        connectDB().then(connected => {
            if (connected) {
                console.log('✅ Database features enabled');
                // Load database-dependent routes
                try {
                    const authRoutes = require('./routes/authRoutes');
                    const userRoutes = require('./routes/userRoutes');
                    app.use('/api/auth', authRoutes);
                    app.use('/api/users', userRoutes);
                    console.log('✅ Authentication routes loaded');
                } catch (routeErr) {
                    console.log('⚠️ Some routes not available:', routeErr.message);
                }
            }
        });
    } catch (dbErr) {
        console.log('⚠️ Database connection skipped:', dbErr.message);
    }
}, 100);

// Start the server
const PORT = process.env.PORT || 5000;
startServer(PORT);

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('Shutting down gracefully...');
    process.exit(0);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
