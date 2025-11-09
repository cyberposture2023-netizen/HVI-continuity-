const http = require('http');

function quickStatus() {
    console.log('🔍 Quick Backend Status Check');
    console.log('='.repeat(40));
    
    const startTime = Date.now();
    const req = http.request({
        hostname: 'localhost',
        port: 5000,
        path: '/api/health',
        method: 'GET',
        timeout: 5000
    }, (res) => {
        const responseTime = Date.now() - startTime;
        console.log(`✅ BACKEND STATUS: RUNNING`);
        console.log(`   Response Time: ${responseTime}ms`);
        console.log(`   Status Code: ${res.statusCode}`);
        console.log(`   Port: 5000`);
        console.log(`   URL: http://localhost:5000`);
        
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            try {
                const health = JSON.parse(data);
                console.log(`   Database: ${health.database || 'Unknown'}`);
                console.log(`   Uptime: ${health.uptime ? Math.round(health.uptime) + 's' : 'Unknown'}`);
            } catch (e) {
                console.log(`   Response: ${data.substring(0, 100)}...`);
            }
            console.log('🎉 Backend is ready for development!');
        });
    });

    req.on('error', (error) => {
        console.log('❌ BACKEND STATUS: NOT RUNNING');
        console.log(`   Error: ${error.message}`);
        console.log('');
        console.log('🚀 To start the backend:');
        console.log('   npm run server:ensure');
        console.log('   OR');
        console.log('   npm run dev:workflow');
    });

    req.on('timeout', () => {
        console.log('❌ BACKEND STATUS: TIMEOUT');
        console.log('   Server may be starting or unresponsive');
        req.destroy();
    });

    req.end();
}

quickStatus();
