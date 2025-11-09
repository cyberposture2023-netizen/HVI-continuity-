const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 BACKEND SERVER DIAGNOSTIC TOOL');
console.log('='.repeat(50));

// Check if server.js exists and is valid
try {
    const serverCode = fs.readFileSync('server.js', 'utf8');
    console.log('✅ server.js exists and is readable');
    
    // Check for common issues in server code
    const issues = [];
    
    if (!serverCode.includes('require(''express'')') && !serverCode.includes('require("express")')) {
        issues.push('Missing Express import');
    }
    
    if (!serverCode.includes('app.listen') && !serverCode.includes('.listen(')) {
        issues.push('Missing server listen call');
    }
    
    if (!serverCode.includes('mongoose') && !serverCode.includes('mongodb')) {
        issues.push('Missing MongoDB configuration');
    }
    
    if (!serverCode.includes('cors')) {
        issues.push('Missing CORS configuration');
    }
    
    if (issues.length > 0) {
        console.log('❌ Potential issues found in server.js:');
        issues.forEach(issue => console.log('   - ' + issue));
    } else {
        console.log('✅ server.js structure looks good');
    }
    
} catch (error) {
    console.log('❌ Cannot read server.js:', error.message);
    process.exit(1);
}

// Try to start the server and capture all output
console.log('\n🚀 Attempting to start server with full output...');
console.log(''.padEnd(50, '-'));

const serverProcess = spawn('node', ['server.js'], {
    stdio: 'pipe',
    cwd: __dirname
});

let output = '';
let errorOutput = '';

serverProcess.stdout.on('data', (data) => {
    const text = data.toString();
    output += text;
    console.log('   [SERVER]', text.trim());
});

serverProcess.stderr.on('data', (data) => {
    const text = data.toString();
    errorOutput += text;
    console.log('   [ERROR]', text.trim());
});

serverProcess.on('error', (error) => {
    console.log('❌ Failed to start process:', error.message);
});

// Set a timeout to kill the process and analyze results
setTimeout(() => {
    console.log('\n' + ''.padEnd(50, '-'));
    console.log('📋 DIAGNOSTIC RESULTS:');
    
    if (errorOutput) {
        console.log('❌ Server encountered errors:');
        console.log(errorOutput);
        
        // Analyze common errors
        if (errorOutput.includes('EADDRINUSE')) {
            console.log('\n💡 SOLUTION: Port 5000 is already in use.');
            console.log('   Run: npm run server:kill');
        } else if (errorOutput.includes('Module not found')) {
            console.log('\n💡 SOLUTION: Missing dependencies.');
            console.log('   Run: npm install');
        } else if (errorOutput.includes('Mongo')) {
            console.log('\n💡 SOLUTION: MongoDB connection issue.');
            console.log('   Make sure MongoDB is running locally');
        }
    } else if (output.includes('Server running') || output.includes('listening')) {
        console.log('✅ Server started successfully!');
        console.log('   The server is running in the background.');
    } else {
        console.log('⚠️ Server started but no success message detected.');
        console.log('   Output captured:', output.substring(0, 200) + '...');
    }
    
    // Kill the process after diagnosis
    serverProcess.kill();
    
}, 10000); // 10 second timeout
