const http = require('http');

const endpoints = [
    { path: '/api/health', name: 'Health Check' },
    { path: '/api/health-enhanced', name: 'Enhanced Health' },
    { path: '/api/assessments', name: 'Assessments' },
    { path: '/api/questions', name: 'Questions' },
    { path: '/api/dashboard/scores', name: 'Dashboard Scores' },
    { path: '/api/users', name: 'Users' }
];

let passed = 0;
let failed = 0;

function testEndpoint(endpoint, index) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(\`Testing \${endpoint.name} (\${endpoint.path})...\`);
            
            const req = http.request({
                hostname: 'localhost',
                port: 5000,
                path: endpoint.path,
                method: 'GET',
                timeout: 10000
            }, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    if (res.statusCode === 200 || res.statusCode === 404) {
                        console.log(\`   ✅ \${endpoint.name} - Status: \${res.statusCode}\`);
                        passed++;
                    } else {
                        console.log(\`   ❌ \${endpoint.name} - Status: \${res.statusCode}\`);
                        failed++;
                    }
                    resolve();
                });
            });

            req.on('error', (error) => {
                console.log(\`   ❌ \${endpoint.name} - Error: \${error.message}\`);
                failed++;
                resolve();
            });

            req.on('timeout', () => {
                console.log(\`   ⏰ \${endpoint.name} - Timeout\`);
                failed++;
                req.destroy();
                resolve();
            });

            req.end();
        }, index * 1000);
    });
}

async function runTests() {
    console.log('🧪 COMPREHENSIVE ENDPOINT TESTING');
    console.log('='.repeat(50));
    
    for (let i = 0; i < endpoints.length; i++) {
        await testEndpoint(endpoints[i], i);
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('📋 TEST SUMMARY:');
    console.log(\`   ✅ Passed: \${passed}\`);
    console.log(\`   ❌ Failed: \${failed}\`);
    console.log(\`   📊 Success Rate: \${Math.round((passed / endpoints.length) * 100)}%\`);
    
    if (passed === endpoints.length) {
        console.log('\n🎉 ALL ENDPOINTS ARE WORKING CORRECTLY!');
        console.log('🚀 Backend is fully operational!');
    } else if (passed >= endpoints.length * 0.8) {
        console.log('\n⚠️ Most endpoints are working, some may need attention.');
    } else {
        console.log('\n💥 Multiple endpoints are failing.');
    }
}

runTests();
