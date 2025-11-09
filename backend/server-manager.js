const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');

class ServerManager {
    constructor() {
        this.serverProcess = null;
        this.port = 5000;
        this.maxStartupAttempts = 3;
        this.startupAttempts = 0;
    }

    // Kill any processes using our ports
    killPortProcesses() {
        return new Promise((resolve) => {
            console.log('🔪 Killing processes on ports 5000 and 3000...');
            
            exec('netstat -ano | findstr :5000', (error, stdout) => {
                if (stdout) {
                    const lines = stdout.split('\n');
                    lines.forEach(line => {
                        const matches = line.match(/(\d+)\s*$/);
                        if (matches) {
                            const pid = matches[1];
                            console.log(`   Killing PID ${pid} on port 5000`);
                            try {
                                process.kill(parseInt(pid), 'SIGKILL');
                            } catch (e) {
                                // Process might already be dead
                            }
                        }
                    });
                }
                
                // Also kill port 3000
                exec('netstat -ano | findstr :3000', (error, stdout) => {
                    if (stdout) {
                        const lines = stdout.split('\n');
                        lines.forEach(line => {
                            const matches = line.match(/(\d+)\s*$/);
                            if (matches) {
                                const pid = matches[1];
                                console.log(`   Killing PID ${pid} on port 3000`);
                                try {
                                    process.kill(parseInt(pid), 'SIGKILL');
                                } catch (e) {
                                    // Process might already be dead
                                }
                            }
                        });
                    }
                    setTimeout(resolve, 2000);
                });
            });
        });
    }

    // Start the backend server
    startServer() {
        return new Promise((resolve, reject) => {
            console.log('🚀 Starting backend server...');
            
            this.serverProcess = spawn('node', ['server.js'], {
                stdio: 'pipe',
                cwd: __dirname
            });

            let serverOutput = '';
            
            this.serverProcess.stdout.on('data', (data) => {
                const output = data.toString();
                serverOutput += output;
                console.log('   [SERVER]', output.trim());
                
                // Check for successful startup messages
                if (output.includes('MongoDB connected') || output.includes('Server running on port')) {
                    console.log('✅ Server started successfully!');
                    resolve(true);
                }
            });

            this.serverProcess.stderr.on('data', (data) => {
                const error = data.toString();
                console.log('   [SERVER ERROR]', error.trim());
            });

            this.serverProcess.on('error', (error) => {
                console.error('❌ Failed to start server:', error);
                reject(error);
            });

            this.serverProcess.on('close', (code) => {
                if (code !== 0) {
                    console.log(`❌ Server process exited with code ${code}`);
                    if (this.startupAttempts < this.maxStartupAttempts) {
                        this.startupAttempts++;
                        console.log(`🔄 Retry attempt ${this.startupAttempts} of ${this.maxStartupAttempts}`);
                        setTimeout(() => this.retryStartup(resolve, reject), 2000);
                    } else {
                        reject(new Error(`Server failed to start after ${this.maxStartupAttempts} attempts`));
                    }
                }
            });

            // Timeout for startup
            setTimeout(() => {
                if (!this.isServerHealthy()) {
                    console.log('⏰ Server startup timeout - checking health...');
                    this.checkServerHealth().then(resolve).catch(reject);
                }
            }, 10000);
        });
    }

    retryStartup(resolve, reject) {
        this.killPortProcesses().then(() => {
            this.startServer().then(resolve).catch(reject);
        });
    }

    // Check if server is healthy
    isServerHealthy() {
        return new Promise((resolve) => {
            const http = require('http');
            const req = http.request({
                hostname: 'localhost',
                port: this.port,
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

    checkServerHealth() {
        return new Promise((resolve, reject) => {
            const http = require('http');
            const req = http.request({
                hostname: 'localhost',
                port: this.port,
                path: '/api/health',
                method: 'GET',
                timeout: 10000
            }, (res) => {
                if (res.statusCode === 200) {
                    resolve(true);
                } else {
                    reject(new Error(`Health check failed with status: ${res.statusCode}`));
                }
            });

            req.on('error', (error) => reject(error));
            req.on('timeout', () => {
                req.destroy();
                reject(new Error('Health check timeout'));
            });
            req.end();
        });
    }

    // Stop the server
    stopServer() {
        if (this.serverProcess) {
            console.log('🛑 Stopping server...');
            this.serverProcess.kill('SIGTERM');
            this.serverProcess = null;
        }
    }

    // Restart the server
    async restartServer() {
        this.stopServer();
        await this.killPortProcesses();
        await this.startServer();
    }
}

// Export for use in other files
module.exports = ServerManager;

// If run directly, start the server with management
if (require.main === module) {
    const manager = new ServerManager();
    
    // Handle process termination
    process.on('SIGINT', () => {
        console.log('\n🛑 Received SIGINT - shutting down...');
        manager.stopServer();
        process.exit(0);
    });

    process.on('SIGTERM', () => {
        console.log('\n🛑 Received SIGTERM - shutting down...');
        manager.stopServer();
        process.exit(0);
    });

    // Start the server
    manager.killPortProcesses().then(() => {
        return manager.startServer();
    }).then(() => {
        console.log('\n🎉 Server management started successfully!');
        console.log('📊 Backend API: http://localhost:5000');
        console.log('🔧 Use Ctrl+C to stop the server');
    }).catch((error) => {
        console.error('💥 Failed to start server:', error);
        process.exit(1);
    });
}
