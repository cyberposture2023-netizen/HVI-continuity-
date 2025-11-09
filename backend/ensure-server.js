const ServerManager = require('./server-manager');
const http = require('http');

async function ensureServerRunning() {
    const manager = new ServerManager();
    
    console.log('🔍 Checking if server is already running...');
    
    // First check if server is already healthy
    const isHealthy = await manager.isServerHealthy();
    if (isHealthy) {
        console.log('✅ Server is already running and healthy!');
        return true;
    }
    
    console.log('🔄 Server not running or unhealthy, starting fresh...');
    
    // Kill any existing processes
    await manager.killPortProcesses();
    
    // Start the server
    try {
        await manager.startServer();
        console.log('✅ Server started successfully!');
        
        // Wait a moment for server to fully initialize
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Verify health
        const healthCheck = await manager.checkServerHealth();
        if (healthCheck) {
            console.log('🎉 Server is fully operational!');
            return true;
        } else {
            console.log('❌ Server started but health check failed');
            return false;
        }
    } catch (error) {
        console.error('💥 Failed to start server:', error.message);
        return false;
    }
}

// Run the ensure function
ensureServerRunning().then(success => {
    if (success) {
        console.log('\n📋 SERVER STATUS: OPERATIONAL');
        console.log('📍 Endpoint: http://localhost:5000');
        console.log('🔧 Health Check: http://localhost:5000/api/health');
        console.log('\n🚀 Ready for development!');
        process.exit(0);
    } else {
        console.log('\n💥 SERVER STATUS: FAILED');
        console.log('🛑 Please check the server logs and fix any issues');
        process.exit(1);
    }
});
