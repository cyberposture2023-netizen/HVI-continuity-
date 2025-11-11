const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hvi-continuity';
console.log('Connecting to MongoDB...', MONGODB_URI);

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).catch(error => {
  console.error('MongoDB connection error:', error);
});

const db = mongoose.connection;
db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});
db.once('open', () => {
  console.log('✅ Connected to MongoDB');
});

// Routes
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/assessments', require('./routes/assessments'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'HVI Continuity Platform API',
    version: '1.0.0',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Test endpoint with sample data
app.get('/api/test', async (req, res) => {
  try {
    const Organization = require('./models/Organization');
    const Assessment = require('./models/Assessment');
    
    // Create test organization
    let org = await Organization.findOne({ name: 'Test Organization' });
    if (!org) {
      org = new Organization({
        name: 'Test Organization',
        industry: 'Technology',
        size: 'medium',
        country: 'US'
      });
      await org.save();
    }
    
    res.json({
      message: 'Test endpoint working',
      organizationId: org._id,
      endpoints: [
        '/api/health',
        '/api/dashboard/score-trend?organizationId=' + org._id,
        '/api/dashboard/scores?organizationId=' + org._id,
        '/api/assessments/current?organizationId=' + org._id
      ]
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'HVI Continuity Platform API',
    version: '1.0.0',
    endpoints: [
      '/api/health',
      '/api/dashboard/score-trend',
      '/api/dashboard/scores',
      '/api/assessments/current',
      '/api/test'
    ]
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('🚀 Server is running on port ' + PORT);
  console.log('📊 Endpoints available:');
  console.log('   • GET /api/health');
  console.log('   • GET /api/dashboard/score-trend');
  console.log('   • GET /api/dashboard/scores');
  console.log('   • GET /api/assessments/current');
  console.log('   • GET /api/test');
});

module.exports = app;
