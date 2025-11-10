// Frontend Integration Test Utilities
const API_BASE_URL = 'http://localhost:5000/api';

export class IntegrationTestHelper {
    static async registerTestUser(username, email, password) {
        const response = await fetch(\\/auth/register\, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
        });
        return await response.json();
    }

    static async loginTestUser(email, password) {
        const response = await fetch(\\/auth/login\, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        return await response.json();
    }

    static async createTestAssessment(token, assessmentData) {
        const response = await fetch(\\/assessments\, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': \Bearer \\
            },
            body: JSON.stringify(assessmentData),
        });
        return await response.json();
    }

    static async getUserAssessments(token, userId) {
        const response = await fetch(\\\/assessments/user/\\, {
            method: 'GET',
            headers: {
                'Authorization': \Bearer \\
            },
        });
        return await response.json();
    }

    static async cleanupTestUser(token, userId) {
        // This would typically call a cleanup endpoint
        console.log('Test cleanup completed for user:', userId);
    }
}

// Mock data for integration tests
export const testData = {
    user: {
        username: 'testuser_' + Date.now(),
        email: \	est\@hvi-continuity.com\,
        password: 'TestPass123!'
    },
    assessment: {
        title: 'Integration Test Assessment',
        description: 'Assessment created during integration testing',
        questions: [
            {
                questionText: 'How are you feeling today?',
                options: ['Excellent', 'Good', 'Fair', 'Poor'],
                correctAnswer: 1
            }
        ]
    }
};
