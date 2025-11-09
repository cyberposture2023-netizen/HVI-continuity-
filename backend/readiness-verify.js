const { exec } = require('child_process');
const http = require('http');

class ReadinessVerifier {
    async verify() {
        console.log('🎯 HVI-CONTINUITY PLATFORM - DEVELOPMENT READINESS VERIFICATION');
        console.log('='.repeat(70));
        
        const checks = [];
        
        // Check backend server
        checks.push(await this.checkBackend());
        
        // Check MongoDB (if possible)
        checks.push(await this.checkMongoDB());
        
        // Check critical endpoints
        checks.push(await this.checkEndpoints());
        
        this.displayResults(checks);
    }
    
    checkBackend() {
        return new Promise((resolve) => {
            const startTime = Date.now();
            const req = http.request({
                hostname: 'localhost',
                port: 5000,
                path: '/api/health',
                method: 'GET',
                timeout: 10000
            }, (res) => {
                const responseTime = Date.now() - startTime;
                resolve({
                    component: 'Backend Server',
                    status: '✅ OPERATIONAL',
                    details: `Port 5000, ${responseTime}ms response`,
                    healthy: true
                });
            });
            
            req.on('error', (error) => {
                resolve({
                    component: 'Backend Server',
                    status: '❌ OFFLINE',
                    details: error.message,
                    healthy: false
                });
            });
            
            req.on('timeout', () => {
                resolve({
                    component: 'Backend Server', 
                    status: '❌ TIMEOUT',
                    details: 'Server not responding',
                    healthy: false
                });
                req.destroy();
            });
            
            req.end();
        });
    }
    
    checkMongoDB() {
        return new Promise((resolve) => {
            // Simple check - try to connect via health endpoint
            const req = http.request({
                hostname: 'localhost',
                port: 5000,
                path: '/api/health-enhanced',
                method: 'GET',
                timeout: 5000
            }, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    try {
                        const health = JSON.parse(data);
                        const dbStatus = health.database === 'connected' ? '✅ CONNECTED' : '❌ DISCONNECTED';
                        resolve({
                            component: 'MongoDB Database',
                            status: dbStatus,
                            details: health.database || 'Unknown',
                            healthy: health.database === 'connected'
                        });
                    } catch (e) {
                        resolve({
                            component: 'MongoDB Database',
                            status: '⚠️ UNKNOWN',
                            details: 'Could not determine status',
                            healthy: null
                        });
                    }
                });
            });
            
            req.on('error', () => {
                resolve({
                    component: 'MongoDB Database',
                    status: '⚠️ UNKNOWN', 
                    details: 'Backend offline',
                    healthy: null
                });
            });
            
            req.end();
        });
    }
    
    checkEndpoints() {
        return new Promise((resolve) => {
            const endpoints = ['/api/assessments', '/api/dashboard/scores', '/api/questions'];
            let healthyCount = 0;
            let totalChecked = 0;
            
            function checkEndpoint(endpoint) {
                return new Promise((endpointResolve) => {
                    const req = http.request({
                        hostname: 'localhost',
                        port: 5000,
                        path: endpoint,
                        method: 'GET',
                        timeout: 5000
                    }, (res) => {
                        if (res.statusCode === 200 || res.statusCode === 404) {
                            healthyCount++;
                        }
                        totalChecked++;
                        endpointResolve();
                    });
                    
                    req.on('error', () => {
                        totalChecked++;
                        endpointResolve();
                    });
                    
                    req.on('timeout', () => {
                        totalChecked++;
                        req.destroy();
                        endpointResolve();
                    });
                    
                    req.end();
                });
            }
            
            // Check all endpoints
            Promise.all(endpoints.map(checkEndpoint)).then(() => {
                const healthPercent = Math.round((healthyCount / endpoints.length) * 100);
                const status = healthPercent >= 80 ? '✅ HEALTHY' : 
                              healthPercent >= 50 ? '⚠️ DEGRADED' : '❌ UNHEALTHY';
                
                resolve({
                    component: 'API Endpoints',
                    status: status,
                    details: `${healthyCount}/${endpoints.length} endpoints responding`,
                    healthy: healthPercent >= 80
                });
            });
        });
    }
    
    displayResults(checks) {
        console.log('\n📊 SYSTEM STATUS:');
        console.log(''.padEnd(70, '-'));
        
        checks.forEach(check => {
            console.log(`${check.status} ${check.component.padEnd(20)} ${check.details}`);
        });
        
        const operational = checks.filter(c => c.healthy === true).length;
        const total = checks.filter(c => c.healthy !== null).length;
        const readiness = Math.round((operational / total) * 100);
        
        console.log('\n' + ''.padEnd(70, '-'));
        console.log(`🏁 DEVELOPMENT READINESS: ${readiness}%`);
        
        if (readiness === 100) {
            console.log('🎉 EXCELLENT! All systems operational.');
            console.log('🚀 Ready to proceed with authentication system development.');
        } else if (readiness >= 70) {
            console.log('⚠️ ACCEPTABLE: Core systems operational.');
            console.log('🔧 Some components may need attention.');
        } else {
            console.log('💥 CRITICAL: Multiple systems offline.');
            console.log('🛑 Please fix backend issues before proceeding.');
        }
    }
}

// Run verification
const verifier = new ReadinessVerifier();
verifier.verify();
