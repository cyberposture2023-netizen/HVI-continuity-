const request = require('supertest');
const { app } = require('../server');

describe('Basic API Health Checks', () => {
    test('Health endpoint should return 200', async () => {
        const response = await request(app)
            .get('/api/health')
            .expect(200);

        expect(response.body.status).toBe('healthy');
    });

    test('Root endpoint should return welcome message', async () => {
        const response = await request(app)
            .get('/')
            .expect(200);

        expect(response.body.message).toContain('HVI Continuity Platform');
    });

    test('Auth health endpoint should work', async () => {
        const response = await request(app)
            .get('/api/auth/test/health')
            .expect(200);

        expect(response.body.message).toContain('Auth route working');
    });

    test('Assessments health endpoint should work', async () => {
        const response = await request(app)
            .get('/api/assessments/test/health')
            .expect(200);

        expect(response.body.message).toContain('Assessments route working');
    });
});
