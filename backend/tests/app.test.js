const request = require('supertest');
const app = require('../src/server');

describe('HVI-Continuity Platform API Health Check', () => {
    it('should return API health status', async () => {
        const res = await request(app)
            .get('/api/health')
            .expect(200);
            
        expect(res.body.status).toBe('success');
        expect(res.body.message).toContain('HVI-Continuity Platform API is running');
    });

    it('should return API information', async () => {
        const res = await request(app)
            .get('/api')
            .expect(200);
            
        expect(res.body.name).toBe('HVI-Continuity Platform API');
        expect(res.body.endpoints).toHaveProperty('health');
    });
});
