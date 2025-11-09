const { spawn } = require('child_process');
const http = require('http');

console.log('🚀 Starting HVI-Continuity Platform Backend...');

// First, kill any existing processes
const killProcess = spawn('node', ['kill-ports.js'], { stdio: 'inherit' });

killProcess.on('close', () => {
    console.log('✅ Process cleanup done, starting server...');
    
    // Start the main server
    const serverProcess = spawn('node', ['server.js'], { stdio: 'inherit' });
    
    serverProcess.on('error', (error) => {
        console.error('❌ Failed to start server:', error);
    });
    
    // Check if server started successfully
    setTimeout(() => {
        checkServerHealth();
    }, 5000);
});

function checkServerHealth() {
    console.log('🔍 Checking server health...');
    
    const req = http.request({
        hostname: 'localhost',
        port: 5000,
        path: '/api/health-enhanced',
        method: 'GET',
        timeout: 10000
    }, (res) => {
        console.log(`✅ Server is running! Status: ${res.statusCode}`);
        console.log('📊 Backend API: http://localhost:5000');
        console.log('🔧 Health Check: http://localhost:5000/api/health-enhanced');
        console.log('🎉 Backend is ready for frontend connections!');
    });
    
    req.on('error', (error) => {
        console.log('❌ Server not responding:', error.message);
        console.log('💡 Try running: node server.js');
    });
    
    req.on('timeout', () => {
        console.log('⏰ Health check timeout - server may be starting slowly');
    });
    
    req.end();
}
