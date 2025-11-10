// Service Layer Tests
import { AuthService, AssessmentService, DashboardService, UserService } from './integration-test-utils';

describe('Service Layer Integration Tests', () => {
    let authToken;
    let testUserId;

    beforeAll(async () => {
        // Clean up any existing test data
        localStorage.clear();
    });

    test('AuthService registration and login', async () => {
        const testUser = {
            username: 'servicetest_' + Date.now(),
            email: \servicetest\@hvi-continuity.com\,
            password: 'TestPass123!'
        };

        // Test registration
        const registerResult = await AuthService.register(testUser);
        expect(registerResult.userId).toBeDefined();

        // Test login
        const loginResult = await AuthService.login({
            email: testUser.email,
            password: testUser.password
        });

        expect(loginResult.token).toBeDefined();
        expect(loginResult.userId).toBeDefined();
        
        authToken = loginResult.token;
        testUserId = loginResult.userId;
    });

    test('AssessmentService create and retrieve assessments', async () => {
        const assessmentData = {
            title: 'Service Test Assessment',
            description: 'Assessment created via service layer',
            questions: [
                {
                    questionText: 'Service layer test question?',
                    options: ['Yes', 'No', 'Maybe'],
                    correctAnswer: 0
                }
            ]
        };

        // Create assessment
        const createResult = await AssessmentService.createAssessment(assessmentData);
        expect(createResult._id).toBeDefined();

        // Retrieve user assessments
        const userAssessments = await AssessmentService.getUserAssessments(testUserId);
        expect(Array.isArray(userAssessments)).toBe(true);
        expect(userAssessments.length).toBeGreaterThan(0);
    });

    test('DashboardService get dashboard data', async () => {
        const dashboardData = await DashboardService.getDashboardData();
        expect(dashboardData.userId).toBe(testUserId);
        expect(dashboardData.assessments).toBeDefined();
    });

    afterAll(async () => {
        // Cleanup
        localStorage.clear();
    });
});
