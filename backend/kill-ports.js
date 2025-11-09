const { exec } = require('child_process');

console.log('🛑 Killing processes on ports 5000 and 3000...');

// Kill processes on port 5000
exec('netstat -ano | findstr :5000', (error, stdout) => {
    if (stdout) {
        const lines = stdout.split('\n');
        lines.forEach(line => {
            const matches = line.match(/(\d+)\s*$/);
            if (matches) {
                const pid = matches[1];
                console.log(`Killing process ${pid} on port 5000`);
                try {
                    process.kill(parseInt(pid));
                } catch (e) {
                    // Process might already be dead
                }
            }
        });
    }
});

// Kill processes on port 3000  
exec('netstat -ano | findstr :3000', (error, stdout) => {
    if (stdout) {
        const lines = stdout.split('\n');
        lines.forEach(line => {
            const matches = line.match(/(\d+)\s*$/);
            if (matches) {
                const pid = matches[1];
                console.log(`Killing process ${pid} on port 3000`);
                try {
                    process.kill(parseInt(pid));
                } catch (e) {
                    // Process might already be dead
                }
            }
        });
    }
});

setTimeout(() => {
    console.log('✅ Process cleanup completed');
    process.exit(0);
}, 2000);
