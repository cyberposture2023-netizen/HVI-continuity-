// Test setup file
const mongoose = require('mongoose');

// Global test timeout
jest.setTimeout(30000);

// Clean up database after tests
afterAll(async () => {
    await mongoose.connection.close();
});
