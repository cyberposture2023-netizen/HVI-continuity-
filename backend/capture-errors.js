const { spawn } = require('child_process');
const fs = require('fs');

console.log('🔍 CAPTURING SERVER STARTUP ERRORS');
console.log('='.repeat(50));

const serverProcess = spawn('node', ['server.js'], {
    stdio: 'pipe',
    cwd: __dirname
});

let stdout = '';
let stderr = '';

serverProcess.stdout.on('data', (data) => {
    const text = data.toString();
    stdout += text;
    console.log('STDOUT:', text.trim());
});

serverProcess.stderr.on('data', (data) => {
    const text = data.toString();
    stderr += text;
    console.log('STDERR:', text.trim());
});

serverProcess.on('close', (code) => {
    console.log('\n' + '='.repeat(50));
    console.log('SERVER EXITED WITH CODE:', code);
    
    if (stderr) {
        console.log('\n❌ ERRORS FOUND:');
        console.log(stderr);
        
        // Analyze common errors
        analyzeErrors(stderr);
    } else if (stdout) {
        console.log('\nℹ️ Server output (no stderr):');
        console.log(stdout);
    } else {
        console.log('\n⚠️ No output captured');
    }
    
    // Save logs for analysis
    fs.writeFileSync('server-stdout.log', stdout);
    fs.writeFileSync('server-stderr.log', stderr);
    
    console.log('\n📁 Logs saved to server-stdout.log and server-stderr.log');
});

function analyzeErrors(errorOutput) {
    console.log('\n🔧 ERROR ANALYSIS:');
    
    if (errorOutput.includes('Cannot find module')) {
        const match = errorOutput.match(/Cannot find module '([^']+)'/);
        if (match) {
            console.log('💡 MISSING DEPENDENCY: ' + match[1]);
            console.log('   Run: npm install ' + match[1]);
        }
    }
    
    if (errorOutput.includes('EADDRINUSE')) {
        console.log('💡 PORT ALREADY IN USE');
        console.log('   Run: npm run server:kill');
    }
    
    if (errorOutput.includes('Mongo')) {
        console.log('💡 MONGODB CONNECTION ISSUE');
        console.log('   Make sure MongoDB is running locally');
        console.log('   Or install MongoDB: https://www.mongodb.com/try/download/community');
    }
    
    if (errorOutput.includes('SyntaxError')) {
        console.log('💡 SYNTAX ERROR IN CODE');
        console.log('   Check the file mentioned in error for syntax issues');
    }
    
    if (errorOutput.includes('ReferenceError')) {
        console.log('💡 UNDEFINED VARIABLE OR FUNCTION');
        console.log('   Check for missing imports or typos');
    }
}

// Timeout after 15 seconds
setTimeout(() => {
    console.log('\n⏰ DIAGNOSTIC TIMEOUT - killing server process');
    serverProcess.kill();
}, 15000);
