const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Simple logging
const log = (message) => {
    console.log(`${new Date().toISOString()} - ${message}`);
};

// Request logging
app.use((req, res, next) => {
    log(`${req.method} ${req.url}`);
    next();
});

// Connect to MongoDB
const connectDB = async () => {
    try {
        log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hvi-continuity');
        log('✅ MongoDB connected successfully');
    } catch (error) {
        log(`❌ MongoDB connection error: ${error.message}`);
        if (process.env.NODE_ENV !== 'test') {
            process.exit(1);
        }
    }
};

// Import and mount routes
const mountRoutes = () => {
    try {
        app.use('/api/auth', require('./routes/auth'));
        app.use('/api/assessments', require('./routes/assessments'));
        app.use('/api/questions', require('./routes/questions'));
        app.use('/api/dashboard', require('./routes/dashboard'));
        app.use('/api/users', require('./routes/users'));
        log('✅ All routes mounted successfully');
    } catch (error) {
        log(`❌ Route mounting error: ${error.message}`);
        throw error;
    }
};

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        message: 'HVI Continuity Platform API is running',
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({ 
        message: 'Welcome to HVI Continuity Platform API',
        version: '1.0.0'
    });
});

// Test endpoints for verification
app.get('/api/auth/test/health', (req, res) => {
    res.json({ message: 'Auth route working' });
});

app.get('/api/assessments/test/health', (req, res) => {
    res.json({ message: 'Assessments route working' });
});

app.get('/api/questions/test/health', (req, res) => {
    res.json({ message: 'Questions route working' });
});

app.get('/api/dashboard/test/health', (req, res) => {
    res.json({ message: 'Dashboard route working' });
});

app.get('/api/users/test/health', (req, res) => {
    res.json({ message: 'Users route working' });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/build')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
    });
}

// Start server function
const startServer = async () => {
    await connectDB();
    mountRoutes();

    const PORT = parseInt(process.env.PORT) || 5000;
    
    return new Promise((resolve, reject) => {
        const server = app.listen(PORT, 'localhost', () => {
            log(`🚀 Server running on http://localhost:${PORT}`);
            log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
            resolve(server);
        });
        
        server.on('error', (err) => {
            log(`❌ Server error: ${err.message}`);
            reject(err);
        });
    });
};

// Graceful shutdown
process.on('SIGINT', async () => {
    log('🛑 Shutting down server...');
    await mongoose.connection.close();
    process.exit(0);
});

// Export for testing
module.exports = { app, startServer };

// Start server if not in test environment
if (process.env.NODE_ENV !== 'test') {
    startServer().catch(err => {
        console.error('Failed to start server:', err);
        process.exit(1);
    });
}
