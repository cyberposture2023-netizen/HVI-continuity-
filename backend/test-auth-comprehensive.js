const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config();

const API_BASE_URL = 'http://localhost:5000/api';

// Test user data
const testUsers = {
  regular: {
    username: 'testuser_' + Date.now(),
    email: `test${Date.now()}@example.com`,
    password: 'password123',
    firstName: 'Test',
    lastName: 'User',
    department: 'IT'
  },
  admin: {
    username: 'adminuser_' + Date.now(),
    email: `admin${Date.now()}@example.com`,
    password: 'adminpass123',
    firstName: 'Admin',
    lastName: 'User',
    department: 'Executive',
    role: 'admin'
  }
};

let accessToken = '';
let refreshToken = '';

const testAuthenticationFlow = async () => {
  try {
    console.log('🔐 Starting Comprehensive Authentication Tests...');
    console.log('=================================================');

    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Database connected');

    // Test 1: User Registration
    console.log('\n📝 Test 1: User Registration');
    console.log('----------------------------');
    
    const registerResponse = await axios.post(`${API_BASE_URL}/auth/register`, testUsers.regular);
    
    if (registerResponse.data.success) {
      console.log('✅ Registration successful');
      console.log('   User:', registerResponse.data.data.user.username);
      console.log('   Tokens generated:', !!registerResponse.data.data.tokens.accessToken);
      
      accessToken = registerResponse.data.data.tokens.accessToken;
      refreshToken = registerResponse.data.data.tokens.refreshToken;
    } else {
      throw new Error(`Registration failed: ${registerResponse.data.message}`);
    }

    // Test 2: User Login
    console.log('\n🔑 Test 2: User Login');
    console.log('---------------------');
    
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      identifier: testUsers.regular.email,
      password: testUsers.regular.password
    });

    if (loginResponse.data.success) {
      console.log('✅ Login successful');
      console.log('   User authenticated:', loginResponse.data.data.user.username);
      console.log('   Last login updated:', !!loginResponse.data.data.user.lastLogin);
    } else {
      throw new Error(`Login failed: ${loginResponse.data.message}`);
    }

    // Test 3: Protected Route Access
    console.log('\n🛡️  Test 3: Protected Route Access');
    console.log('--------------------------------');
    
    const meResponse = await axios.get(`${API_BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (meResponse.data.success) {
      console.log('✅ Protected route access successful');
      console.log('   User profile retrieved:', meResponse.data.data.user.email);
    } else {
      throw new Error(`Protected route failed: ${meResponse.data.message}`);
    }

    // Test 4: Token Refresh
    console.log('\n🔄 Test 4: Token Refresh');
    console.log('------------------------');
    
    const refreshResponse = await axios.post(`${API_BASE_URL}/auth/refresh`, {
      refreshToken: refreshToken
    });

    if (refreshResponse.data.success) {
      console.log('✅ Token refresh successful');
      console.log('   New access token generated:', !!refreshResponse.data.data.accessToken);
      
      // Update token for next tests
      accessToken = refreshResponse.data.data.accessToken;
    } else {
      throw new Error(`Token refresh failed: ${refreshResponse.data.message}`);
    }

    // Test 5: Profile Update
    console.log('\n📋 Test 5: Profile Update');
    console.log('-------------------------');
    
    const updateResponse = await axios.put(`${API_BASE_URL}/auth/profile`, {
      firstName: 'Updated',
      lastName: 'Name',
      department: 'Finance'
    }, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (updateResponse.data.success) {
      console.log('✅ Profile update successful');
      console.log('   First name updated:', updateResponse.data.data.user.firstName);
      console.log('   Department updated:', updateResponse.data.data.user.department);
    } else {
      throw new Error(`Profile update failed: ${updateResponse.data.message}`);
    }

    // Test 6: Password Change
    console.log('\n🔒 Test 6: Password Change');
    console.log('--------------------------');
    
    const passwordResponse = await axios.post(`${API_BASE_URL}/auth/change-password`, {
      currentPassword: testUsers.regular.password,
      newPassword: 'newpassword123'
    }, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (passwordResponse.data.success) {
      console.log('✅ Password change successful');
      
      // Test login with new password
      const newLoginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
        identifier: testUsers.regular.email,
        password: 'newpassword123'
      });

      if (newLoginResponse.data.success) {
        console.log('✅ Login with new password successful');
      } else {
        throw new Error('Login with new password failed');
      }
    } else {
      throw new Error(`Password change failed: ${passwordResponse.data.message}`);
    }

    // Test 7: Logout
    console.log('\n🚪 Test 7: Logout');
    console.log('-----------------');
    
    const logoutResponse = await axios.post(`${API_BASE_URL}/auth/logout`, {}, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (logoutResponse.data.success) {
      console.log('✅ Logout successful');
    } else {
      throw new Error(`Logout failed: ${logoutResponse.data.message}`);
    }

    // Test 8: Error Handling - Invalid Login
    console.log('\n❌ Test 8: Error Handling');
    console.log('-------------------------');
    
    try {
      await axios.post(`${API_BASE_URL}/auth/login`, {
        identifier: 'nonexistent@example.com',
        password: 'wrongpassword'
      });
      throw new Error('Should have failed with invalid credentials');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Invalid login handled correctly');
      } else {
        throw new Error('Invalid login not handled properly');
      }
    }

    // Test 9: Error Handling - Invalid Token
    console.log('\n🚫 Test 9: Invalid Token Handling');
    console.log('---------------------------------');
    
    try {
      await axios.get(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: 'Bearer invalid-token' }
      });
      throw new Error('Should have failed with invalid token');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Invalid token handled correctly');
      } else {
        throw new Error('Invalid token not handled properly');
      }
    }

    console.log('\n🎉 ALL AUTHENTICATION TESTS PASSED!');
    console.log('===================================');
    console.log('✅ Registration and Login');
    console.log('✅ Token Management and Refresh');
    console.log('✅ Protected Route Access');
    console.log('✅ Profile Management');
    console.log('✅ Password Security');
    console.log('✅ Error Handling');
    console.log('✅ Logout Functionality');

    // Cleanup test users
    const User = require('./backend/models/User');
    await User.deleteOne({ email: testUsers.regular.email });
    console.log('\n🧹 Test user cleaned up');

    await mongoose.connection.close();
    process.exit(0);

  } catch (error) {
    console.error('\n❌ TEST FAILED:', error.message);
    if (error.response?.data) {
      console.error('   Response:', error.response.data);
    }
    process.exit(1);
  }
};

// Start the tests
testAuthenticationFlow();
