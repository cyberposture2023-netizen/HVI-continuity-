const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

class PlatformStartupManager {
    constructor() {
        this.backendProcess = null;
        this.frontendProcess = null;
        this.backendPort = 5000;
        this.frontendPort = 3000;
    }

    // Kill any existing processes on our ports
    async killExistingProcesses() {
        console.log('🔍 Checking for existing processes...');
        
        try {
            // Use tasklist to find node processes
            const { exec } = require('child_process');
            
            exec('netstat -ano | findstr :5000', (error, stdout) => {
                if (stdout) {
                    const lines = stdout.split('\n');
                    lines.forEach(line => {
                        const matches = line.match(/(\d+)\s*$/);
                        if (matches) {
                            const pid = matches[1];
                            console.log(\🛑 Killing process \40300 using port 5000\);
                            process.kill(parseInt(pid));
                        }
                    });
                }
            });

            exec('netstat -ano | findstr :3000', (error, stdout) => {
                if (stdout) {
                    const lines = stdout.split('\n');
                    lines.forEach(line => {
                        const matches = line.match(/(\d+)\s*$/);
                        if (matches) {
                            const pid = matches[1];
                            console.log(\🛑 Killing process \40300 using port 3000\);
                            process.kill(parseInt(pid));
                        }
                    });
                }
            });

            // Wait a bit for processes to be killed
            await new Promise(resolve => setTimeout(resolve, 2000));
            
        } catch (error) {
            console.log('No existing processes found or error killing processes:', error.message);
        }
    }

    async startBackend() {
        console.log('🚀 Starting backend server...');
        
        return new Promise((resolve, reject) => {
            this.backendProcess = spawn('node', ['server-health-monitor.js'], {
                stdio: 'inherit',
                cwd: __dirname
            });

            this.backendProcess.on('error', (error) => {
                console.error('❌ Backend process error:', error);
                reject(error);
            });

            // Wait for backend to be ready
            setTimeout(() => {
                console.log('✅ Backend startup initiated');
                resolve();
            }, 5000);
        });
    }

    async verifyBackendHealth() {
        console.log('🔍 Verifying backend health...');
        const http = require('http');

        return new Promise((resolve) => {
            const checkHealth = (retries = 10) => {
                const healthCheck = http.request({
                    hostname: 'localhost',
                    port: this.backendPort,
                    path: '/api/health-enhanced',
                    method: 'GET',
                    timeout: 5000
                }, (res) => {
                    let data = '';
                    res.on('data', chunk => data += chunk);
                    res.on('end', () => {
                        try {
                            const health = JSON.parse(data);
                            console.log('✅ Backend health status:', health.status);
                            console.log('📊 Backend port:', health.port);
                            console.log('🗄️ Database status:', health.database);
                            resolve(true);
                        } catch (e) {
                            console.log('❌ Health check response invalid');
                            if (retries > 0) {
                                setTimeout(() => checkHealth(retries - 1), 2000);
                            } else {
                                resolve(false);
                            }
                        }
                    });
                });

                healthCheck.on('error', (error) => {
                    console.log(\🔄 Backend not ready yet... (\ retries left)\);
                    if (retries > 0) {
                        setTimeout(() => checkHealth(retries - 1), 2000);
                    } else {
                        console.error('💥 Backend health verification failed');
                        resolve(false);
                    }
                });

                healthCheck.on('timeout', () => {
                    console.log('⏰ Health check timeout');
                    healthCheck.destroy();
                    if (retries > 0) {
                        setTimeout(() => checkHealth(retries - 1), 2000);
                    } else {
                        resolve(false);
                    }
                });

                healthCheck.end();
            };

            checkHealth();
        });
    }

    async startPlatform() {
        console.log('🎯 Starting HVI-Continuity Platform...');
        
        try {
            // Kill existing processes first
            await this.killExistingProcesses();
            
            // Start backend
            await this.startBackend();
            
            // Verify backend health
            const isHealthy = await this.verifyBackendHealth();
            
            if (isHealthy) {
                console.log('\\\\n🎉 HVI-CONTINUITY PLATFORM STARTUP COMPLETE!');
                console.log('📊 Backend API: http://localhost:' + this.backendPort);
                console.log('🔧 Health Check: http://localhost:' + this.backendPort + '/api/health-enhanced');
                console.log('\\\\n⚠️ Frontend can now safely connect to the backend!');
            } else {
                console.log('\\\\n💥 Platform startup failed. Backend is not healthy.');
                process.exit(1);
            }
            
        } catch (error) {
            console.error('💥 Platform startup error:', error);
            process.exit(1);
        }
    }
}

// Start the platform if run directly
if (require.main === module) {
    const startupManager = new PlatformStartupManager();
    startupManager.startPlatform();
}

module.exports = PlatformStartupManager;
