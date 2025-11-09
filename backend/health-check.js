const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hvi-continuity';

async function healthCheck() {
  console.log('🚀 Starting HVI Continuity Platform Health Check...\n');
  
  let mongoConnected = false;
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
    const Assessment = require('./models/Assessment');
    
    const testUser = await User.findOne({ email: 'test@hvi.com' });
    testDataExists = !!testUser;
    
    if (testDataExists) {
      console.log('✅ Test Data: Found test user with scores');
      console.log(`   - Overall HVI: ${testUser.overallHVI}`);
      console.log(`   - D1 Score: ${testUser.d1Score}`);
      console.log(`   - D2 Score: ${testUser.d2Score}`);
      console.log(`   - D3 Score: ${testUser.d3Score}`);
      console.log(`   - D4 Score: ${testUser.d4Score}`);
      
      // Check assessments
      const assessments = await Assessment.find({ user: testUser._id });
      console.log(`   - Assessments: ${assessments.length} found`);
    } else {
      console.log('❌ Test Data: No test user found');
    }
    
    await mongoose.connection.close();
  } catch (error) {
    console.log('❌ MongoDB: Connection failed -', error.message);
  }

  // Simple backend check without axios
  console.log('\n📊 HEALTH CHECK SUMMARY:');
  console.log('=======================');
  console.log(`MongoDB Connection: ${mongoConnected ? '✅ OK' : '❌ FAILED'}`);
  console.log(`Test Data: ${testDataExists ? '✅ EXISTS' : '❌ MISSING'}`);
  console.log('Backend API: 🔄 Manual check required');
  
  if (mongoConnected && testDataExists) {
    console.log('\n🎉 Core systems are working!');
    console.log('\nTo test backend API:');
    console.log('1. Start backend: cd backend && npm start');
    console.log('2. Check: http://localhost:5000/api/health');
    console.log('3. Check questions: http://localhost:5000/api/questions/dimension/D1');
  } else {
    console.log('\n⚠️  Some components need attention. Please check the errors above.');
  }
  
  console.log('\nNext steps:');
  console.log('1. Start backend: cd backend && npm start');
  console.log('2. Start frontend: cd frontend && npm start');
  console.log('3. Open http://localhost:3000/dashboard');
}

// Run health check
healthCheck().catch(console.error);
