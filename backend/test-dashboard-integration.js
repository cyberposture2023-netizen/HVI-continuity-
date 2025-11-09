// Test script for dashboard integration
const mongoose = require('mongoose');
const User = require('./models/User');
const Assessment = require('./models/Assessment');
require('dotenv').config();

async function testDashboardIntegration() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hvi-continuity', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Find or create a test user
    let testUser = await User.findOne({ email: 'test@hvi.com' });
    
    if (!testUser) {
      testUser = new User({
        username: 'testuser',
        email: 'test@hvi.com',
        password: 'hashedpassword', // In real scenario, this would be properly hashed
        department: 'IT'
      });
      await testUser.save();
      console.log('Test user created');
    }

    // Create a test completed assessment
    const testAssessment = new Assessment({
      user: testUser._id,
      status: 'completed',
      dimensions: {
        D1: { 
          completed: true, 
          score: 75, 
          answers: [
            { questionId: 'D1_Q1', answer: 'rarely' },
            { questionId: 'D1_Q2', answer: 'mostly' },
            { questionId: 'D1_Q3', answer: 'likely' }
          ],
          completedAt: new Date()
        },
        D2: { 
          completed: true, 
          score: 82, 
          answers: [
            { questionId: 'D2_Q1', answer: 'always' },
            { questionId: 'D2_Q2', answer: 'comfortable' }
          ],
          completedAt: new Date()
        },
        D3: { 
          completed: true, 
          score: 65, 
          answers: [
            { questionId: 'D3_Q1', answer: 'quarterly' }
          ],
          completedAt: new Date()
        },
        D4: { 
          completed: true, 
          score: 58, 
          answers: [
            { questionId: 'D4_Q1', answer: 'moderate' }
          ],
          completedAt: new Date()
        }
      },
      overallScore: 72,
      completedAt: new Date()
    });

    await testAssessment.save();

    // Update user scores
    testUser.overallHVI = 72;
    testUser.d1Score = 75;
    testUser.d2Score = 82;
    testUser.d3Score = 65;
    testUser.d4Score = 58;
    testUser.lastAssessmentDate = new Date();
    testUser.assessmentCount = 1;

    await testUser.save();

    console.log('Test assessment created and user scores updated');
    console.log('User scores:', {
      overallHVI: testUser.overallHVI,
      D1: testUser.d1Score,
      D2: testUser.d2Score,
      D3: testUser.d3Score,
      D4: testUser.d4Score
    });

    // Verify the data can be retrieved
    const userScores = await User.findById(testUser._id);
    const userAssessments = await Assessment.find({ user: testUser._id });

    console.log('\nVerification:');
    console.log('User found:', !!userScores);
    console.log('Assessments found:', userAssessments.length);
    console.log('Latest assessment score:', userAssessments[0].overallScore);

    console.log('\n✅ Dashboard integration test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the test
testDashboardIntegration();
