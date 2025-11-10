const http = require('http');

console.log('Checking minimal server on port 5001...');

const req = http.request({
    hostname: 'localhost',
    port: 5001,
    path: '/test',
    method: 'GET',
    timeout: 5000
}, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        console.log('✅ Minimal server response:');
        console.log('   Status:', res.statusCode);
        console.log('   Data:', data);
    });
});

req.on('error', (error) => {
    console.log('❌ Minimal server not responding:', error.message);
});

req.on('timeout', () => {
    console.log('⏰ Minimal server timeout');
    req.destroy();
});

req.end();
