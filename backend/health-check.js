const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config();

const API_URL = 'http://localhost:5000/api';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hvi-continuity';

async function healthCheck() {
  console.log('🚀 Starting HVI Continuity Platform Health Check...\n');
  
  let mongoConnected = false;
  let backendRunning = false;
  let testDataExists = false;

  // Check MongoDB connection
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    mongoConnected = true;
    console.log('✅ MongoDB: Connected successfully');
    
    // Check if test data exists
    const User = require('./models/User');
    const testUser = await User.findOne({ email: 'test@hvi.com' });
    testDataExists = !!testUser;
    
    if (testDataExists) {
      console.log('✅ Test Data: Found test user with scores');
      console.log(`   - Overall HVI: ${testUser.overallHVI}`);
      console.log(`   - D1 Score: ${testUser.d1Score}`);
      console.log(`   - D2 Score: ${testUser.d2Score}`);
      console.log(`   - D3 Score: ${testUser.d3Score}`);
      console.log(`   - D4 Score: ${testUser.d4Score}`);
    } else {
      console.log('❌ Test Data: No test user found');
    }
    
    await mongoose.connection.close();
  } catch (error) {
    console.log('❌ MongoDB: Connection failed -', error.message);
  }

  // Check Backend API
  try {
    const response = await axios.get(`${API_URL}/health`, { timeout: 5000 });
    backendRunning = true;
    console.log('✅ Backend API: Running on port 5000');
    
    // Test assessment endpoints
    try {
      const assessmentResponse = await axios.get(`${API_URL}/questions/dimension/D1`);
      console.log('✅ Questions API: Endpoint responding');
    } catch (error) {
      console.log('❌ Questions API: Endpoint not responding');
    }
    
  } catch (error) {
    console.log('❌ Backend API: Not running -', error.message);
  }

  // Summary
  console.log('\n📊 HEALTH CHECK SUMMARY:');
  console.log('=======================');
  console.log(`MongoDB Connection: ${mongoConnected ? '✅ OK' : '❌ FAILED'}`);
  console.log(`Backend API: ${backendRunning ? '✅ OK' : '❌ FAILED'}`);
  console.log(`Test Data: ${testDataExists ? '✅ EXISTS' : '❌ MISSING'}`);
  
  if (mongoConnected && backendRunning && testDataExists) {
    console.log('\n🎉 ALL SYSTEMS GO! Dashboard integration is working correctly.');
    console.log('\nNext steps:');
    console.log('1. Start frontend: cd frontend && npm start');
    console.log('2. Open http://localhost:3000/dashboard');
    console.log('3. You should see real assessment data on the dashboard');
  } else {
    console.log('\n⚠️  Some components need attention. Please check the errors above.');
  }
}

// Run health check
healthCheck().catch(console.error);
