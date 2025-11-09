const http = require('http');

function testBackendConnection() {
    console.log('🔍 Testing backend connection...');
    
    const options = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/health-enhanced',
        method: 'GET',
        timeout: 10000
    };

    const req = http.request(options, (res) => {
        console.log(\✅ Backend responded with status: \\);
        
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
            try {
                const health = JSON.parse(data);
                console.log('📊 Backend Health Report:');
                console.log(\   Status: \\);
                console.log(\   Port: \\);
                console.log(\   Database: \\);
                console.log(\   Uptime: \ seconds\);
                console.log('\\\\n🎉 Backend is fully operational!');
            } catch (e) {
                console.log('❌ Could not parse health response');
            }
        });
    });

    req.on('error', (error) => {
        console.log(\❌ Backend connection failed: \\);
        console.log('💡 Make sure the backend server is running on port 5000');
    });

    req.on('timeout', () => {
        console.log('⏰ Connection timeout - backend may not be running');
        req.destroy();
    });

    req.end();
}

// Run test
testBackendConnection();
