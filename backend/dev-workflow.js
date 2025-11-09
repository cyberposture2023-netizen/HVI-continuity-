const { spawn } = require('child_process');
const readline = require('readline');

class DevelopmentWorkflow {
    constructor() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    async startBackend() {
        console.log('🚀 Starting Backend Server...');
        return new Promise((resolve) => {
            const backend = spawn('node', ['server-manager.js'], {
                stdio: 'inherit',
                cwd: __dirname
            });
            
            backend.on('error', (error) => {
                console.error('❌ Backend failed:', error);
                resolve(false);
            });
            
            // Give it a moment to start
            setTimeout(() => {
                resolve(true);
            }, 5000);
        });
    }

    async testBackend() {
        console.log('🧪 Testing Backend...');
        const testProcess = spawn('node', ['health-dashboard.js'], {
            stdio: 'inherit',
            cwd: __dirname
        });
        
        return new Promise((resolve) => {
            testProcess.on('close', (code) => {
                resolve(code === 0);
            });
        });
    }

    showMenu() {
        console.log('\n🎯 HVI-CONTINUITY DEVELOPMENT WORKFLOW');
        console.log('==========================================');
        console.log('1. Start Backend Server');
        console.log('2. Test Backend Health');
        console.log('3. Kill All Processes');
        console.log('4. Full Restart (Kill + Start + Test)');
        console.log('5. Exit');
        console.log('==========================================');
        
        this.rl.question('Select option (1-5): ', (answer) => {
            this.handleMenuChoice(answer);
        });
    }

    async handleMenuChoice(choice) {
        switch (choice) {
            case '1':
                await this.startBackend();
                break;
            case '2':
                await this.testBackend();
                break;
            case '3':
                spawn('node', ['kill-ports.js'], { stdio: 'inherit' });
                break;
            case '4':
                console.log('🔄 Full restart sequence...');
                spawn('node', ['kill-ports.js'], { stdio: 'inherit' });
                await new Promise(resolve => setTimeout(resolve, 2000));
                await this.startBackend();
                await new Promise(resolve => setTimeout(resolve, 3000));
                await this.testBackend();
                break;
            case '5':
                console.log('👋 Goodbye!');
                this.rl.close();
                return;
            default:
                console.log('❌ Invalid choice');
        }
        
        // Show menu again
        this.showMenu();
    }

    start() {
        console.log('🔧 Development Workflow Started');
        console.log('💡 Use this tool to manage backend processes');
        this.showMenu();
    }
}

// Start workflow if run directly
if (require.main === module) {
    const workflow = new DevelopmentWorkflow();
    workflow.start();
}

module.exports = DevelopmentWorkflow;
