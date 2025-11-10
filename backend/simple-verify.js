// Simple Backend Verification Test
const express = require('express');
const mongoose = require('mongoose');

async function simpleVerification() {
    console.log('Simple Backend Verification');
    console.log('===========================');
    
    // Test 1: Basic Node.js functionality
    console.log('1. Node.js environment: OK');
    
    // Test 2: Express.js
    try {
        const app = express();
        console.log('2. Express.js: OK');
    } catch (e) {
        console.log('2. Express.js: FAILED - ' + e.message);
    }
    
    // Test 3: MongoDB connection
    console.log('3. Testing MongoDB connection...');
    try {
        await mongoose.connect('mongodb://localhost:27017/hvi-continuity-test', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('   MongoDB: CONNECTED');
        await mongoose.connection.close();
    } catch (e) {
        console.log('   MongoDB: FAILED - ' + e.message);
    }
    
    // Test 4: Route files existence and basic structure
    const fs = require('fs');
    const routeFiles = ['auth', 'assessments', 'questions', 'dashboard', 'users'];
    console.log('4. Route files check:');
    
    for (const route of routeFiles) {
        const filePath = ./routes/ + route + '.js';
        if (fs.existsSync(filePath)) {
            console.log('   ✅ ' + route + '.js');
        } else {
            console.log('   ❌ ' + route + '.js - MISSING');
        }
    }
    
    console.log('===========================');
    console.log('Verification complete!');
    console.log('Start the server with: node server.js');
}

simpleVerification().catch(console.error);
