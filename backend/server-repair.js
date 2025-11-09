const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🛠️ BACKEND SERVER REPAIR TOOL');
console.log('='.repeat(50));

class ServerRepair {
    constructor() {
        this.repairsApplied = [];
    }

    // Repair 1: Kill all processes on target ports
    async killPortProcesses() {
        console.log('1. 🔪 Killing processes on ports 5000 and 3000...');
        try {
            execSync('node kill-ports.js', { stdio: 'inherit' });
            this.repairsApplied.push('Killed existing processes');
            return true;
        } catch (error) {
            console.log('   ❌ Failed to kill processes:', error.message);
            return false;
        }
    }

    // Repair 2: Install missing dependencies
    async installDependencies() {
        console.log('2. 📦 Checking and installing dependencies...');
        try {
            // Check if node_modules exists
            if (!fs.existsSync('node_modules')) {
                console.log('   Installing all dependencies...');
                execSync('npm install', { stdio: 'inherit' });
                this.repairsApplied.push('Installed dependencies');
            } else {
                console.log('   node_modules exists, checking for updates...');
                execSync('npm update', { stdio: 'inherit' });
                this.repairsApplied.push('Updated dependencies');
            }
            return true;
        } catch (error) {
            console.log('   ❌ Dependency installation failed:', error.message);
            return false;
        }
    }

    // Repair 3: Check and fix server.js structure
    async fixServerStructure() {
        console.log('3. 🔧 Checking server.js structure...');
        try {
            let serverCode = fs.readFileSync('server.js', 'utf8');
            let fixesMade = false;

            // Ensure express is imported and used
            if (!serverCode.includes('const app = express()') && serverCode.includes('require(''express'')')) {
                // Add app initialization after express import
                const expressPos = serverCode.indexOf('require(''express'')');
                const nextLine = serverCode.indexOf('\n', expressPos) + 1;
                serverCode = serverCode.slice(0, nextLine) + 'const app = express();\n' + serverCode.slice(nextLine);
                fixesMade = true;
                this.repairsApplied.push('Added app initialization');
            }

            // Ensure CORS is configured
            if (!serverCode.includes('app.use(cors())') && serverCode.includes('require(''cors'')')) {
                // Find a good place to add CORS (after app creation)
                const appPos = serverCode.indexOf('const app = express()');
                if (appPos !== -1) {
                    const insertPos = serverCode.indexOf('\n', appPos) + 1;
                    serverCode = serverCode.slice(0, insertPos) + 'app.use(cors());\n' + serverCode.slice(insertPos);
                    fixesMade = true;
                    this.repairsApplied.push('Added CORS middleware');
                }
            }

            // Ensure body parser is configured
            if (!serverCode.includes('app.use(express.json())') && !serverCode.includes('app.use(bodyParser.json())')) {
                // Find a good place to add body parser (after CORS)
                const corsPos = serverCode.indexOf('app.use(cors())');
                const insertPos = corsPos !== -1 ? serverCode.indexOf('\n', corsPos) + 1 : serverCode.indexOf('const app = express()') + 1;
                if (insertPos !== -1) {
                    serverCode = serverCode.slice(0, insertPos) + 'app.use(express.json());\n' + serverCode.slice(insertPos);
                    fixesMade = true;
                    this.repairsApplied.push('Added JSON body parser');
                }
            }

            // Ensure server is listening
            if (!serverCode.includes('app.listen(') && !serverCode.includes('.listen(')) {
                // Add listen call at the end
                const lastBracket = serverCode.lastIndexOf('}');
                const listenCode = '\n\nconst PORT = process.env.PORT || 5000;\napp.listen(PORT, () => {\n    console.log(`Server running on port ${PORT}`);\n});\n';
                serverCode = serverCode.slice(0, lastBracket) + listenCode + serverCode.slice(lastBracket);
                fixesMade = true;
                this.repairsApplied.push('Added server listen call');
            }

            if (fixesMade) {
                fs.writeFileSync('server.js', serverCode);
                console.log('   ✅ Applied structural fixes to server.js');
            } else {
                console.log('   ✅ server.js structure is good');
            }

            return true;
        } catch (error) {
            console.log('   ❌ Failed to fix server structure:', error.message);
            return false;
        }
    }

    // Repair 4: Create minimal working server if needed
    async createMinimalServer() {
        console.log('4. 🆕 Creating minimal server backup...');
        try {
            const minimalServer = `
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic health endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

// Enhanced health endpoint
app.get('/api/health-enhanced', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        port: process.env.PORT || 5000,
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        endpoints: {
            assessments: '/api/assessments',
            dashboard: '/api/dashboard',
            users: '/api/users',
            questions: '/api/questions'
        },
        memory: process.memoryUsage(),
        uptime: process.uptime()
    });
});

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/hvi-continuity', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.log('MongoDB connection error:', err));

// Basic error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(\`✅ Server running on port \${PORT}\`);
    console.log(\`📊 Health check: http://localhost:\${PORT}/api/health\`);
});
`;

            fs.writeFileSync('server-minimal.js', minimalServer);
            this.repairsApplied.push('Created minimal server backup');
            console.log('   ✅ Created server-minimal.js as backup');
            return true;
        } catch (error) {
            console.log('   ❌ Failed to create minimal server:', error.message);
            return false;
        }
    }

    // Repair 5: Start the server
    async startServer() {
        console.log('5. 🚀 Starting server...');
        return new Promise((resolve) => {
            // Try the main server first
            const serverProcess = spawn('node', ['server.js'], {
                stdio: 'pipe',
                cwd: __dirname
            });

            let output = '';
            let started = false;

            serverProcess.stdout.on('data', (data) => {
                const text = data.toString();
                output += text;
                console.log('   [SERVER]', text.trim());
                
                if (text.includes('Server running') || text.includes('listening')) {
                    started = true;
                    this.repairsApplied.push('Server started successfully');
                    resolve(true);
                }
            });

            serverProcess.stderr.on('data', (data) => {
                console.log('   [ERROR]', data.toString().trim());
            });

            // If main server fails, try minimal server
            setTimeout(() => {
                if (!started) {
                    console.log('   ⚠️ Main server failed, trying minimal server...');
                    serverProcess.kill();
                    
                    const minimalProcess = spawn('node', ['server-minimal.js'], {
                        stdio: 'pipe',
                        cwd: __dirname
                    });

                    minimalProcess.stdout.on('data', (data) => {
                        console.log('   [MINIMAL SERVER]', data.toString().trim());
                    });

                    setTimeout(() => {
                        if (!started) {
                            console.log('   ❌ Both servers failed to start properly');
                            resolve(false);
                        }
                    }, 8000);
                }
            }, 10000);

            serverProcess.on('error', (error) => {
                console.log('   ❌ Server process error:', error.message);
                resolve(false);
            });
        });
    }

    async runAllRepairs() {
        console.log('Starting comprehensive server repair...\n');
        
        const steps = [
            () => this.killPortProcesses(),
            () => this.installDependencies(),
            () => this.fixServerStructure(),
            () => this.createMinimalServer(),
            () => this.startServer()
        ];

        for (let i = 0; i < steps.length; i++) {
            const success = await steps[i]();
            if (!success && i < steps.length - 1) {
                console.log('   ⚠️ Continuing with next repair step...');
            }
            console.log('');
        }

        // Summary
        console.log(''.padEnd(50, '='));
        console.log('📋 REPAIR SUMMARY:');
        if (this.repairsApplied.length > 0) {
            console.log('✅ Repairs applied:');
            this.repairsApplied.forEach(repair => console.log('   - ' + repair));
        } else {
            console.log('ℹ️ No repairs were needed');
        }
        
        console.log('\n🎯 NEXT: Test server with: node test-connection.js');
    }
}

// Run repairs
const repair = new ServerRepair();
repair.runAllRepairs();
