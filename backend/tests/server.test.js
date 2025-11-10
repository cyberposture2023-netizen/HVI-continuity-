const request = require('supertest');
const { app, startServer } = require('../server');
const mongoose = require('mongoose');

describe('Server Health Check', () => {
    let server;

    beforeAll(async () => {
        // Start server on a test port
        process.env.NODE_ENV = 'test';
        process.env.PORT = '5003';
        process.env.MONGODB_URI = 'mongodb://localhost:27017/hvi-continuity-test';
        
        server = await startServer();
    }, 15000);

    afterAll(async () => {
        // Close server and database connection
        if (server) {
            server.close();
        }
        await mongoose.connection.close();
    });

    test('Server should start without errors', () => {
        expect(server).toBeDefined();
        expect(server.listening).toBe(true);
    });

    test('Health endpoint should work', async () => {
        const response = await request(app)
            .get('/api/health')
            .expect(200);

        expect(response.body.status).toBe('healthy');
        expect(response.body.message).toContain('HVI Continuity Platform API is running');
    });

    test('Root endpoint should work', async () => {
        const response = await request(app)
            .get('/')
            .expect(200);

        expect(response.body.message).toContain('HVI Continuity Platform');
    });
});
