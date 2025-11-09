const http = require('http');
const { spawn } = require('child_process');

async function verifyStartup() {
    console.log('🔍 VERIFYING BACKEND STARTUP');
    console.log('='.repeat(40));
    
    // First check if server is already running
    const isRunning = await checkServer();
    if (isRunning) {
        console.log('✅ Server is already running');
        return true;
    }
    
    console.log('🔄 Server not running, starting...');
    
    // Start the server
    const serverProcess = spawn('node', ['server.js'], {
        detached: true,
        stdio: 'ignore'
    });
    
    serverProcess.unref();
    
    console.log('⏳ Waiting for server to start...');
    
    // Wait and check repeatedly
    for (let i = 0; i < 10; i++) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        const running = await checkServer();
        
        if (running) {
            console.log('✅ Server started successfully!');
            console.log('📊 Running on: http://localhost:5000');
            return true;
        }
        
        console.log('   Still waiting... (' + ((i + 1) * 2) + ' seconds)');
    }
    
    console.log('❌ Server failed to start within timeout');
    return false;
}

function checkServer() {
    return new Promise((resolve) => {
        const req = http.request({
            hostname: 'localhost',
            port: 5000,
            path: '/api/health',
            method: 'GET',
            timeout: 5000
        }, (res) => {
            resolve(res.statusCode === 200);
        });
        
        req.on('error', () => resolve(false));
        req.on('timeout', () => {
            req.destroy();
            resolve(false);
        });
        
        req.end();
    });
}

// Run verification
verifyStartup().then(success => {
    if (success) {
        console.log('\n🎉 BACKEND VERIFICATION: SUCCESS');
        process.exit(0);
    } else {
        console.log('\n💥 BACKEND VERIFICATION: FAILED');
        process.exit(1);
    }
});
