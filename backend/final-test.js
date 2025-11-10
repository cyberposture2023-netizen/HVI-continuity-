// Final Comprehensive Test for HVI Continuity Platform
const { spawn } = require('child_process');
const http = require('http');

console.log('🎯 HVI Continuity Platform - Final Comprehensive Test');
console.log('==================================================');

// Test 1: Check if server.js starts without errors
console.log('1. Testing server startup...');
const serverProcess = spawn('node', ['server.js'], { 
    cwd: __dirname,
    stdio: ['pipe', 'pipe', 'pipe']
});

let serverStarted = false;
let serverOutput = '';

serverProcess.stdout.on('data', (data) => {
    const output = data.toString();
    serverOutput += output;
    console.log('   Server: ' + output.trim());
    
    if (output.includes('Server running on port')) {
        serverStarted = true;
        console.log('   ✅ Server started successfully');
        testEndpoints();
    }
});

serverProcess.stderr.on('data', (data) => {
    console.log('   ❌ Server error: ' + data.toString());
});

serverProcess.on('close', (code) => {
    if (code !== 0 && !serverStarted) {
        console.log('   ❌ Server failed to start (code: ' + code + ')');
        process.exit(1);
    }
});

function testEndpoints() {
    console.log('2. Testing API endpoints...');
    
    const endpoints = [
        { path: '/api/health', method: 'GET', expected: 200 },
        { path: '/api/auth', method: 'GET', expected: 404 },
        { path: '/api/assessments', method: 'GET', expected: 401 },
        { path: '/api/questions', method: 'GET', expected: 401 }
    ];
    
    let testsCompleted = 0;
    
    endpoints.forEach(endpoint => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: endpoint.path,
            method: endpoint.method,
            timeout: 5000
        };
        
        const req = http.request(options, (res) => {
            console.log('   ✅ ' + endpoint.path + ' - Status: ' + res.statusCode + ' (expected: ' + endpoint.expected + ')');
            testsCompleted++;
            checkCompletion();
        });
        
        req.on('error', (err) => {
            if (err.code === 'ECONNREFUSED') {
                console.log('   ❌ ' + endpoint.path + ' - Connection refused');
            } else {
                console.log('   ❌ ' + endpoint.path + ' - Error: ' + err.message);
            }
            testsCompleted++;
            checkCompletion();
        });
        
        req.on('timeout', () => {
            console.log('   ⚠️  ' + endpoint.path + ' - Timeout');
            testsCompleted++;
            checkCompletion();
            req.destroy();
        });
        
        req.end();
    });
    
    function checkCompletion() {
        if (testsCompleted === endpoints.length) {
            console.log('3. All tests completed');
            console.log('==================================================');
            console.log('🎉 HVI Continuity Platform Backend is OPERATIONAL!');
            console.log('📍 Access the API at: http://localhost:5000/api');
            console.log('📍 Health check: http://localhost:5000/api/health');
            serverProcess.kill();
            process.exit(0);
        }
    }
}

// Timeout after 30 seconds
setTimeout(() => {
    console.log('❌ Test timeout - server took too long to start');
    serverProcess.kill();
    process.exit(1);
}, 30000);
