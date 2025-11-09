const http = require('http');

class HealthDashboard {
    constructor() {
        this.baseUrl = 'http://localhost:5000';
        this.endpoints = {
            health: '/api/health-enhanced',
            assessments: '/api/assessments',
            dashboard: '/api/dashboard/scores',
            users: '/api/users/profile',
            questions: '/api/questions'
        };
    }

    async checkEndpoint(endpoint) {
        return new Promise((resolve) => {
            const startTime = Date.now();
            
            const req = http.request({
                hostname: 'localhost',
                port: 5000,
                path: endpoint,
                method: 'GET',
                timeout: 10000
            }, (res) => {
                const responseTime = Date.now() - startTime;
                let data = '';
                res.on('data', (chunk) => data += chunk);
                res.on('end', () => {
                    resolve({
                        endpoint: endpoint,
                        status: res.statusCode,
                        responseTime: responseTime,
                        healthy: res.statusCode >= 200 && res.statusCode < 300,
                        data: data
                    });
                });
            });

            req.on('error', (error) => {
                resolve({
                    endpoint: endpoint,
                    status: 0,
                    responseTime: Date.now() - startTime,
                    healthy: false,
                    error: error.message
                });
            });

            req.on('timeout', () => {
                resolve({
                    endpoint: endpoint,
                    status: 0,
                    responseTime: Date.now() - startTime,
                    healthy: false,
                    error: 'Timeout'
                });
                req.destroy();
            });

            req.end();
        });
    }

    async runComprehensiveCheck() {
        console.log('🩺 HVI-Continuity Platform - Comprehensive Health Check');
        console.log('=' .repeat(60));
        
        const results = [];
        
        for (const [name, endpoint] of Object.entries(this.endpoints)) {
            process.stdout.write(`Checking ${name}... `);
            const result = await this.checkEndpoint(endpoint);
            results.push(result);
            
            if (result.healthy) {
                console.log(`✅ Healthy (${result.responseTime}ms)`);
            } else {
                console.log(`❌ Unhealthy - ${result.error || 'Status: ' + result.status}`);
            }
        }
        
        this.displaySummary(results);
    }

    displaySummary(results) {
        console.log('\n' + '=' .repeat(60));
        console.log('📊 HEALTH CHECK SUMMARY');
        console.log('=' .repeat(60));
        
        const healthyCount = results.filter(r => r.healthy).length;
        const totalCount = results.length;
        const healthPercentage = Math.round((healthyCount / totalCount) * 100);
        
        console.log(`Overall Health: ${healthPercentage}% (${healthyCount}/${totalCount} endpoints)`);
        console.log('');
        
        results.forEach(result => {
            const statusIcon = result.healthy ? '✅' : '❌';
            console.log(`${statusIcon} ${result.endpoint.padEnd(25)} ${result.responseTime}ms ${result.healthy ? '' : '- ' + (result.error || 'Status: ' + result.status)}`);
        });
        
        console.log('');
        
        if (healthPercentage === 100) {
            console.log('🎉 EXCELLENT! All systems are operational and healthy.');
            console.log('🚀 Platform is ready for authentication system development.');
        } else if (healthPercentage >= 70) {
            console.log('⚠️ ACCEPTABLE: Core systems are operational.');
            console.log('🔧 Some endpoints may need attention but development can proceed.');
        } else {
            console.log('💥 CRITICAL: Multiple systems are down.');
            console.log('🛑 Please fix backend issues before proceeding.');
        }
    }
}

// Run the health dashboard
const dashboard = new HealthDashboard();
dashboard.runComprehensiveCheck();
