const http = require('http');

console.log('Testing enhanced health endpoint...');

const req = http.request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/health-enhanced',
    method: 'GET',
    timeout: 10000
}, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        try {
            const health = JSON.parse(data);
            console.log('✅ Enhanced Health Check:');
            console.log('   Status:', health.status);
            console.log('   Port:', health.port);
            console.log('   Database:', health.database);
            console.log('   Uptime:', Math.round(health.uptime) + ' seconds');
            console.log('   Memory Usage:', Math.round(health.memory.heapUsed / 1024 / 1024) + ' MB');
            console.log('   Available Endpoints:');
            Object.keys(health.endpoints).forEach(endpoint => {
                console.log('     -', health.endpoints[endpoint]);
            });
        } catch (e) {
            console.log('❌ Could not parse enhanced health response');
            console.log('Raw response:', data);
        }
    });
});

req.on('error', (error) => {
    console.log('❌ Enhanced health endpoint not available:', error.message);
});

req.on('timeout', () => {
    console.log('⏰ Enhanced health check timeout');
    req.destroy();
});

req.end();
