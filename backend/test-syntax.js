try {
    // Try to require the server to check syntax
    require('./server.js');
    console.log('✅ server.js syntax is valid');
} catch (error) {
    console.log('❌ server.js has syntax errors:');
    console.log('   ' + error.message);
    
    // Show the problematic line if possible
    if (error.stack) {
        const lines = error.stack.split('\n');
        console.log('   Stack trace:');
        lines.slice(0, 3).forEach(line => console.log('   ' + line));
    }
}
