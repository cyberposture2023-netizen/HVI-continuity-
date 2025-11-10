const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());

// Simple health check - no dependencies
app.get('/api/health', (req, res) => {
    console.log('Health check called');
    res.json({ 
        status: 'ok', 
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// Test route without auth
app.get('/api/test', (req, res) => {
    console.log('Test route called');
    res.json({ message: 'Test route working' });
});

// Error handling for uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('UNHANDLED REJECTION at:', promise, 'reason:', reason);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, 'localhost', () => {
    console.log(`Debug server running on http://localhost:${PORT}`);
    console.log('Available endpoints:');
    console.log('  GET /api/health');
    console.log('  GET /api/test');
}).on('error', (err) => {
    console.error('Server startup error:', err);
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Please kill the process using this port.`);
    }
});
