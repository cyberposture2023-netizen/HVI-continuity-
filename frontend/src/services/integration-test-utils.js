const API_BASE_URL = 'http://localhost:5000/api';

export class IntegrationTestHelper {
    static async registerTestUser(username, email, password) {
        const response = await fetch(\\/auth/register\, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: username,
                email: email,
                password: password,
                department: 'Testing'
            }),
        });

        if (!response.ok) {
            throw new Error(\Registration failed: \\);
        }

        return await response.json();
    }

    static async loginTestUser(email, password) {
        const response = await fetch(\\/auth/login\, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password
            }),
        });

        if (!response.ok) {
            throw new Error(\Login failed: \\);
        }

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

        if (!response.ok) {
            throw new Error(\Assessment creation failed: \\);
        }

        return await response.json();
    }

    static async cleanupTestUser(token) {
        // Cleanup any test data
        try {
            await fetch(\\\/users/test-cleanup\, {
                method: 'DELETE',
                headers: {
                    'Authorization': \Bearer \\
                },
            });
        } catch (error) {
            console.log('Cleanup completed (endpoint may not exist)');
        }
    }
}

export default IntegrationTestHelper;
