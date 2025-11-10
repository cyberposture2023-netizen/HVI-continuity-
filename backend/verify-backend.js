// Final Verification Script for HVI Continuity Platform
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

async function verifyBackendSetup() {
    console.log('🔍 HVI Continuity Platform - Backend Verification');
    console.log('===============================================\n');
    
    // Check if all required files exist
    const requiredFiles = [
        'server.js',
        'models/User.js',
        'models/Assessment.js', 
        'models/Question.js',
        'routes/auth.js',
        'routes/assessments.js',
        'routes/questions.js',
        'routes/dashboard.js',
        'routes/users.js',
        'middleware/auth.js',
        'utils/jwt-utils.js'
    ];
    
    console.log('📁 File Structure Verification:');
    let allFilesExist = true;
    for (const file of requiredFiles) {
        const filePath = path.join(__dirname, file);
        if (fs.existsSync(filePath)) {
            console.log('  ✅ ' + file);
        } else {
            console.log('  ❌ ' + file + ' - MISSING');
            allFilesExist = false;
        }
    }
    
    console.log('\n🔧 Syntax Verification:');
    try {
        require('./server.js');
        console.log('  ✅ server.js - Syntax valid');
    } catch (e) {
        console.log('  ❌ server.js - Syntax error: ' + e.message);
        allFilesExist = false;
    }
    
    console.log('\n🗄️  Database Connection Test:');
    try {
        await mongoose.connect('mongodb://localhost:27017/hvi-continuity', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('  ✅ MongoDB connection successful');
        await mongoose.connection.close();
    } catch (e) {
        console.log('  ❌ MongoDB connection failed: ' + e.message);
        allFilesExist = false;
    }
    
    console.log('\n📊 Verification Summary:');
    if (allFilesExist) {
        console.log('🎉 BACKEND SETUP COMPLETE AND VALIDATED!');
        console.log('🚀 Ready for frontend integration and production use.');
    } else {
        console.log('⚠️  Some issues detected. Please check the missing files.');
    }
    
    console.log('\n📍 Next Steps:');
    console.log('1. Start backend: node server.js');
    console.log('2. Start frontend: cd ../frontend && npm start');
    console.log('3. Access platform: http://localhost:3000');
    console.log('4. API available: http://localhost:5000/api');
}

verifyBackendSetup().catch(console.error);
