const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const User = require('./models/User');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

// Mock environment variables
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
process.env.JWT_EXPIRES_IN = '1h';
process.env.JWT_REFRESH_EXPIRES_IN = '7d';

const testAuthFunctionality = async () => {
  try {
    console.log('🔐 Testing Authentication Routes...');
    
    // Test data
    const testUser = {
      username: 'testauthuser',
      email: 'auth-test@example.com',
      password: 'password123',
      firstName: 'Auth',
      lastName: 'Test',
      department: 'IT'
    };

    // Test registration
    console.log('Testing user registration...');
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    if (registerResponse.status === 201 && registerResponse.body.success) {
      console.log('✅ User registration successful');
      console.log('   User ID:', registerResponse.body.data.user.id);
      console.log('   Access token generated:', !!registerResponse.body.data.tokens.accessToken);
    } else {
      throw new Error(`Registration failed: ${registerResponse.body.message}`);
    }

    // Test login
    console.log('Testing user login...');
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        identifier: testUser.email,
        password: testUser.password
      });

    if (loginResponse.status === 200 && loginResponse.body.success) {
      console.log('✅ User login successful');
      console.log('   User authenticated:', loginResponse.body.data.user.username);
      const accessToken = loginResponse.body.data.tokens.accessToken;
      console.log('   Login token valid:', !!accessToken);
      
      // Test protected route with token
      console.log('Testing protected route...');
      const meResponse = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${accessToken}`);

      if (meResponse.status === 200 && meResponse.body.success) {
        console.log('✅ Protected route access successful');
        console.log('   User profile retrieved:', meResponse.body.data.user.username);
      } else {
        throw new Error(`Protected route failed: ${meResponse.body.message}`);
      }

    } else {
      throw new Error(`Login failed: ${loginResponse.body.message}`);
    }

    // Test token refresh
    console.log('Testing token refresh...');
    const refreshToken = loginResponse.body.data.tokens.refreshToken;
    const refreshResponse = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken });

    if (refreshResponse.status === 200 && refreshResponse.body.success) {
      console.log('✅ Token refresh successful');
      console.log('   New access token generated:', !!refreshResponse.body.data.accessToken);
    } else {
      throw new Error(`Token refresh failed: ${refreshResponse.body.message}`);
    }

    console.log('🎯 All authentication routes are fully operational!');
    
    // Cleanup test user
    await User.deleteOne({ email: testUser.email });
    console.log('🧹 Test user cleaned up');
    
  } catch (error) {
    console.error('❌ Authentication test failed:', error.message);
    process.exit(1);
  }
};

testAuthFunctionality();
