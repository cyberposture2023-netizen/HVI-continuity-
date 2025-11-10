const mongoose = require('mongoose');
const User = require('./models/User');
const Assessment = require('./models/Assessment');
const Question = require('./models/Question');
const bcrypt = require('bcrypt');

async function testUserAssessmentIntegration() {
    try {
        console.log('🧪 Testing User-Assessment Integration...');
        
        // Connect to database
        await mongoose.connect('mongodb://localhost:27017/hvi-continuity', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        console.log('✅ Connected to database');
        
        // Check if test user exists
        let testUser = await User.findOne({ email: 'test@hvi-continuity.com' });
        
        if (!testUser) {
            // Create test user
            const hashedPassword = await bcrypt.hash('password123', 12);
            testUser = new User({
                username: 'testuser',
                email: 'test@hvi-continuity.com',
                password: hashedPassword,
                firstName: 'Test',
                lastName: 'User',
                department: 'IT',
                role: 'user'
            });
            await testUser.save();
            console.log('✅ Created test user');
        } else {
            console.log('✅ Test user already exists');
        }
        
        // Check if test assessment exists for this user
        let testAssessment = await Assessment.findOne({ 
            user: testUser._id, 
            title: 'Initial HVI Assessment' 
        });
        
        if (!testAssessment) {
            // Create test assessment
            testAssessment = new Assessment({
                user: testUser._id,
                title: 'Initial HVI Assessment',
                description: 'Comprehensive HVI assessment covering all 4 dimensions',
                category: 'comprehensive',
                status: 'completed',
                questions: [
                    {
                        text: 'How often do you update your passwords?',
                        dimension: 'D1',
                        category: 'Security Awareness',
                        userAnswer: 'Every 90 days',
                        userScore: 75
                    },
                    {
                        text: 'Do you recognize phishing attempts?',
                        dimension: 'D1',
                        category: 'Security Awareness', 
                        userAnswer: 'Yes, most of the time',
                        userScore: 85
                    },
                    {
                        text: 'How do you handle sensitive data?',
                        dimension: 'D2',
                        category: 'Data Protection',
                        userAnswer: 'Follow company protocols',
                        userScore: 90
                    }
                ]
            });
            
            // Calculate scores
            testAssessment.calculateScores();
            await testAssessment.save();
            
            // Add assessment to user's assessments array
            await User.findByIdAndUpdate(testUser._id, {
                $push: { assessments: testAssessment._id }
            });
            
            console.log('✅ Created test assessment with scores:', testAssessment.scores);
        } else {
            console.log('✅ Test assessment already exists');
        }
        
        // Test query: Get user with their assessments
        const userWithAssessments = await User.findById(testUser._id)
            .populate('assessments')
            .select('-password');
            
        console.log('✅ User with assessments:', {
            username: userWithAssessments.username,
            assessmentCount: userWithAssessments.assessments.length,
            assessments: userWithAssessments.assessments.map(a => ({
                title: a.title,
                status: a.status,
                scores: a.scores
            }))
        });
        
        // Test query: Get assessments for user
        const userAssessments = await Assessment.find({ user: testUser._id })
            .sort({ createdAt: -1 });
            
        console.log('✅ User assessments query successful. Count:', userAssessments.length);
        
        // Test dashboard data aggregation
        const completedAssessments = await Assessment.countDocuments({ 
            user: testUser._id, 
            status: 'completed' 
        });
        
        const totalAssessments = await Assessment.countDocuments({ user: testUser._id });
        
        console.log('✅ Dashboard statistics:', {
            totalAssessments,
            completedAssessments,
            completionRate: Math.round((completedAssessments / totalAssessments) * 100) + '%'
        });
        
        console.log('🎉 All integration tests passed!');
        console.log('📊 Test Assessment Scores:', testAssessment.scores);
        
    } catch (error) {
        console.error('❌ Integration test failed:', error);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Database connection closed');
    }
}

// Run the test if this script is executed directly
if (require.main === module) {
    testUserAssessmentIntegration();
}

module.exports = testUserAssessmentIntegration;
