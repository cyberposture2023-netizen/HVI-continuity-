// test-server.js - Test-specific server with dynamic port handling
const { app, startServer } = require('./server');

let server;

const startTestServer = async (port = 0) => {
    process.env.NODE_ENV = 'test';
    process.env.PORT = port.toString();
    
    // Use in-memory database for tests if available, otherwise use test database
    process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hvi-continuity-test';
    process.env.JWT_SECRET = 'test-jwt-secret-for-testing-only';
    
    server = await startServer();
    return server;
};

const stopTestServer = () => {
    if (server) {
        server.close();
    }
};

// For Jest global setup/teardown
if (require.main === module) {
    const port = process.argv[2] || 0;
    startTestServer(port).then(() => {
        console.log(`Test server started on port ${server.address().port}`);
    });
}

module.exports = { startTestServer, stopTestServer };
