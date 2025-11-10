const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/assessments', require('./routes/assessments'));
app.use('/api/questions', require('./routes/questions'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/users', require('./routes/users'));

// Health check route
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'HVI Continuity Platform API is running',
        timestamp: new Date().toISOString()
    });
});

// Serve static files from React build in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/build')));
    
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
    });
}

// Database connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hvi-continuity';
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected successfully to: ' + MONGODB_URI))
.catch(err => {
    console.error('❌ MongoDB connection error:', err);
    console.log('💡 Make sure MongoDB is running on localhost:27017');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log('\n🚀 HVI Continuity Platform Server Started');
    console.log('=========================================');
    console.log('✅ Server is running on port: ' + PORT);
    console.log('✅ Environment: ' + (process.env.NODE_ENV || 'development'));
    console.log('✅ API Base URL: http://localhost:' + PORT + '/api');
    console.log('✅ Health Check: http://localhost:' + PORT + '/api/health');
    console.log('\n📊 Available API Endpoints:');
    console.log('   • POST   /api/auth/register     - User registration');
    console.log('   • POST   /api/auth/login        - User login');
    console.log('   • POST   /api/auth/refresh      - Refresh token');
    console.log('   • GET    /api/auth/profile      - Get user profile');
    console.log('   • PUT    /api/auth/profile      - Update profile');
    console.log('   • GET    /api/assessments       - Get user assessments');
    console.log('   • POST   /api/assessments       - Create assessment');
    console.log('   • GET    /api/assessments/:id   - Get assessment by ID');
    console.log('   • PUT    /api/assessments/:id   - Update assessment');
    console.log('   • DELETE /api/assessments/:id   - Delete assessment');
    console.log('   • GET    /api/questions         - Get questions');
    console.log('   • POST   /api/questions/:id/answer - Submit answer');
    console.log('   • GET    /api/dashboard         - User dashboard');
    console.log('   • GET    /api/dashboard/admin   - Admin dashboard');
    console.log('   • GET    /api/users/profile     - User profile');
    console.log('   • PUT    /api/users/profile     - Update profile');
    console.log('   • GET    /api/users/assessments - User assessments');
    console.log('=========================================\n');
});
