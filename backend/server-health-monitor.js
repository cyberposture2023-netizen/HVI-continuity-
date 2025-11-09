const express = require('express');
const mongoose = require('mongoose');
const http = require('http');

class ServerHealthMonitor {
    constructor(port = 5000) {
        this.port = port;
        this.app = express();
        this.server = null;
        this.maxRetries = 3;
        this.retryCount = 0;
    }

    async checkPortAvailability(port) {
        return new Promise((resolve) => {
            const tester = http.createServer()
                .once('error', () => resolve(false))
                .once('listening', () => {
                    tester.close(() => resolve(true));
                })
                .listen(port);
        });
    }

    async findAvailablePort(startPort = 5000) {
        let port = startPort;
        while (port < startPort + 10) {
            const isAvailable = await this.checkPortAvailability(port);
            if (isAvailable) {
                console.log(\Port \ is available\);
                return port;
            }
            console.log(\Port \ is busy, trying \\);
            port++;
        }
        throw new Error('No available ports found');
    }

    async startServer() {
        try {
            // Find available port
            this.port = await this.findAvailablePort(this.port);
            
            // Import and configure the main server
            const app = require('./server');
            
            // Start server
            this.server = app.listen(this.port, () => {
                console.log(\✅ Backend server successfully started on port \\);
                console.log(\📊 Health check available at: http://localhost:\/api/health\);
                console.log(\🔗 API endpoints available at: http://localhost:\/api\);
                this.retryCount = 0; // Reset retry count on success
            });

            this.server.on('error', (error) => {
                console.error('❌ Server error:', error);
                this.handleServerError();
            });

            // Enhanced health check endpoint
            app.get('/api/health-enhanced', (req, res) => {
                const healthStatus = {
                    status: 'healthy',
                    timestamp: new Date().toISOString(),
                    port: this.port,
                    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
                    endpoints: {
                        assessments: '/api/assessments',
                        dashboard: '/api/dashboard',
                        users: '/api/users',
                        auth: '/api/auth'
                    }
                };
                res.json(healthStatus);
            });

            return true;

        } catch (error) {
            console.error('❌ Failed to start server:', error);
            return this.handleServerError();
        }
    }

    handleServerError() {
        this.retryCount++;
        if (this.retryCount <= this.maxRetries) {
            console.log(\🔄 Retrying server startup... Attempt \ of \\);
            setTimeout(() => this.startServer(), 2000);
            return false;
        } else {
            console.error('💥 Maximum retry attempts reached. Server failed to start.');
            process.exit(1);
        }
    }

    stopServer() {
        if (this.server) {
            this.server.close(() => {
                console.log('Server stopped gracefully');
            });
        }
    }
}

// Export for use in other files
module.exports = ServerHealthMonitor;

// If run directly, start the monitor
if (require.main === module) {
    const monitor = new ServerHealthMonitor();
    monitor.startServer();
}
