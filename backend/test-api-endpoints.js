const http = require('http');

const endpoints = [
    '/api/assessments',
    '/api/dashboard/scores',
    '/api/users/profile',
    '/api/questions'
];

let testsPassed = 0;
let testsFailed = 0;

function testEndpoint(endpoint, index) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`Testing ${endpoint}...`);
            
            const req = http.request({
                hostname: 'localhost',
                port: 5000,
                path: endpoint,
                method: 'GET',
                timeout: 5000
            }, (res) => {
                console.log(`   ✅ ${endpoint} - Status: ${res.statusCode}`);
                testsPassed++;
                resolve();
            });

            req.on('error', (error) => {
                console.log(`   ❌ ${endpoint} - Error: ${error.message}`);
                testsFailed++;
                resolve();
            });

            req.on('timeout', () => {
                console.log(`   ⏰ ${endpoint} - Timeout`);
                testsFailed++;
                req.destroy();
                resolve();
            });

            req.end();
        }, index * 1000); // Stagger requests
    });
}

async function runTests() {
    console.log('Testing critical API endpoints...');
    
    for (let i = 0; i < endpoints.length; i++) {
        await testEndpoint(endpoints[i], i);
    }
    
    console.log('\n📋 Test Summary:');
    console.log(`   ✅ Passed: ${testsPassed}`);
    console.log(`   ❌ Failed: ${testsFailed}`);
    console.log(`   📊 Success Rate: ${Math.round((testsPassed / endpoints.length) * 100)}%`);
    
    if (testsPassed === endpoints.length) {
        console.log('🎉 All API endpoints are working correctly!');
    } else if (testsPassed >= endpoints.length / 2) {
        console.log('⚠️ Some endpoints may need attention, but core functionality is working.');
    } else {
        console.log('💥 Critical issues detected with API endpoints.');
    }
}

runTests();
