console.log('🧪 Testing Backend Connection...');

const http = require('http');

const testConnection = () => {
    const req = http.request({
        hostname: 'localhost',
        port: 5000,
        path: '/api/health',
        method: 'GET',
        timeout: 5000
    }, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
            console.log('✅ SUCCESS: Backend is responding!');
            console.log('Status Code:', res.statusCode);
            try {
                const health = JSON.parse(data);
                console.log('Health Status:', health);
            } catch (e) {
                console.log('Response:', data);
            }
        });
    });

    req.on('error', (error) => {
        console.log('❌ FAILED: Backend is not responding');
        console.log('Error:', error.message);
        console.log('');
        console.log('TROUBLESHOOTING:');
        console.log('1. Make sure MongoDB is running');
        console.log('2. Run: node server.js');
        console.log('3. Check if port 5000 is available');
    });

    req.on('timeout', () => {
        console.log('⏰ TIMEOUT: Backend did not respond in time');
        req.destroy();
    });

    req.end();
};

testConnection();
