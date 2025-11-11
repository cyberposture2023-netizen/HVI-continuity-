const mongoose = require('mongoose');
require('dotenv').config();

async function testEndpoints() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hvi-continuity', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Testing new endpoints...');

    // Test data setup
    const Organization = require('./models/Organization');
    const Assessment = require('./models/Assessment');

    // Create test organization if it doesn't exist
    let testOrg = await Organization.findOne({ name: 'Test Organization' });
    if (!testOrg) {
      testOrg = new Organization({
        name: 'Test Organization',
        industry: 'Technology',
        size: 'medium',
        country: 'US'
      });
      await testOrg.save();
      console.log('Created test organization:', testOrg._id);
    }

    // Create test assessment if it doesn't exist
    let testAssessment = await Assessment.findOne({ organizationId: testOrg._id });
    if (!testAssessment) {
      testAssessment = new Assessment({
        organizationId: testOrg._id,
        organizationName: testOrg.name,
        status: 'completed',
        responses: [
          { questionId: 'Q1', domain: 'D1', answer: 4 },
          { questionId: 'Q2', domain: 'D1', answer: 3 },
          { questionId: 'Q3', domain: 'D2', answer: 5 },
          { questionId: 'Q4', domain: 'D2', answer: 2 },
          { questionId: 'Q5', domain: 'D3', answer: 4 },
          { questionId: 'Q6', domain: 'D3', answer: 3 },
          { questionId: 'Q7', domain: 'D4', answer: 5 },
          { questionId: 'Q8', domain: 'D4', answer: 4 }
        ],
        scores: {
          overall: 75,
          dimensions: { d1: 70, d2: 65, d3: 80, d4: 85 },
          domains: {
            governance: 70,
            infrastructure: 65,
            operations: 80,
            culture: 85
          }
        },
        completedAt: new Date()
      });
      await testAssessment.save();
      console.log('Created test assessment');
    }

    console.log('\n=== Test Data Ready ===');
    console.log('Organization ID:', testOrg._id);
    console.log('Assessment ID:', testAssessment._id);
    console.log('========================\n');

    console.log('You can now test the endpoints with:');
    console.log(\1. GET http://localhost:5000/api/dashboard/score-trend?organizationId=\\);
    console.log(\2. GET http://localhost:5000/api/dashboard/scores?organizationId=\\);
    console.log(\3. GET http://localhost:5000/api/assessments/current?organizationId=\\);

  } catch (error) {
    console.error('Test setup failed:', error);
  } finally {
    await mongoose.connection.close();
  }
}

testEndpoints();
