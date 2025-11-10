const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const Assessment = require('../models/Assessment');

describe('Frontend-Backend Integration Tests', () => {
    let authToken;
    let testUserId;

    beforeAll(async () => {
        // Connect to test database
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hvi-continuity-test');
    });

    afterAll(async () => {
        await User.deleteMany({});
        await Assessment.deleteMany({});
        await mongoose.connection.close();
    });

    describe('Authentication Flow', () => {
        test('User registration and login', async () => {
            // Test registration
            const registerResponse = await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'integrationtestuser',
                    email: 'integration@test.com',
                    password: 'TestPass123!'
                });
            
            expect(registerResponse.status).toBe(201);
            expect(registerResponse.body.userId).toBeDefined();

            // Test login
            const loginResponse = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'integration@test.com',
                    password: 'TestPass123!'
                });
            
            expect(loginResponse.status).toBe(200);
            expect(loginResponse.body.token).toBeDefined();
            authToken = loginResponse.body.token;
            testUserId = loginResponse.body.userId;
        });
    });

    describe('Assessment Flow', () => {
        test('Create assessment and retrieve user assessments', async () => {
            // Create a new assessment
            const assessmentResponse = await request(app)
                .post('/api/assessments')
                .set('Authorization', \Bearer \\)
                .send({
                    title: 'Integration Test Assessment',
                    description: 'Test assessment created during integration testing',
                    questions: [
                        {
                            questionText: 'Test question 1',
                            options: ['Option A', 'Option B', 'Option C'],
                            correctAnswer: 0
                        }
                    ]
                });
            
            expect(assessmentResponse.status).toBe(201);
            expect(assessmentResponse.body._id).toBeDefined();

            // Retrieve user assessments
            const userAssessmentsResponse = await request(app)
                .get(\/api/assessments/user/\\)
                .set('Authorization', \Bearer \\);
            
            expect(userAssessmentsResponse.status).toBe(200);
            expect(Array.isArray(userAssessmentsResponse.body)).toBe(true);
            expect(userAssessmentsResponse.body.length).toBeGreaterThan(0);
        });
    });

    describe('User Dashboard Integration', () => {
        test('Get dashboard data for authenticated user', async () => {
            const dashboardResponse = await request(app)
                .get('/api/dashboard')
                .set('Authorization', \Bearer \\);
            
            expect(dashboardResponse.status).toBe(200);
            expect(dashboardResponse.body.userId).toBe(testUserId);
            expect(dashboardResponse.body.assessments).toBeDefined();
        });
    });
});
