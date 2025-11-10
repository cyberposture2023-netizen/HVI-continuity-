// Test bcrypt installation
const bcrypt = require('bcrypt');

async function testBcrypt() {
    try {
        console.log('Testing bcrypt installation...');
        
        // Test basic functionality
        const testHash = await bcrypt.hash('test', 10);
        console.log('✅ bcrypt hashing works');
        console.log('✅ Test hash generated: ' + testHash.substring(0, 20) + '...');
        
        // Test verification
        const isValid = await bcrypt.compare('test', testHash);
        if (isValid) {
            console.log('✅ bcrypt verification works');
        } else {
            console.log('❌ bcrypt verification failed');
        }
        
    } catch (error) {
        console.log('❌ bcrypt error: ' + error.message);
    }
}

testBcrypt();
