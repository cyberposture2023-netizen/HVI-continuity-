try {
    const bcrypt = require('bcrypt');
    console.log('✅ bcrypt installed successfully');
    
    // Test basic functionality
    const testHash = await bcrypt.hash('test', 10);
    console.log('✅ bcrypt hashing works');
    
} catch (error) {
    console.log('❌ bcrypt error: ' + error.message);
}
