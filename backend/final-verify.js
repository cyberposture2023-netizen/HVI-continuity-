const http = require('http');

console.log('🎯 FINAL BACKEND VERIFICATION');
console.log('='.repeat(40));

const criticalEndpoints = [
    '/api/health',
    '/api/assessments', 
    '/api/questions',
    '/api/dashboard/scores'
];

let operational = true;

criticalEndpoints.forEach(endpoint => {
    const req = http.request({
        hostname: 'localhost',
        port: 5000,
        path: endpoint,
        method: 'GET',
        timeout: 5000
    }, (res) => {
        if (res.statusCode === 200) {
            console.log(\`✅ \${endpoint} - OPERATIONAL\`);
        } else {
            console.log(\`❌ \${endpoint} - FAILED (Status: \${res.statusCode})\`);
            operational = false;
        }
    });

    req.on('error', () => {
        console.log(\`❌ \${endpoint} - UNREACHABLE\`);
        operational = false;
    });

    req.on('timeout', () => {
        console.log(\`⏰ \${endpoint} - TIMEOUT\`);
        operational = false;
        req.destroy();
    });

    req.end();
});

setTimeout(() => {
    console.log('\n' + '='.repeat(40));
    if (operational) {
        console.log('🎉 BACKEND VERIFICATION: SUCCESS');
        console.log('🚀 All critical endpoints are operational');
        console.log('💡 Ready for authentication system development');
    } else {
        console.log('💥 BACKEND VERIFICATION: FAILED');
        console.log('🛑 Some critical endpoints are not working');
    }
}, 3000);
