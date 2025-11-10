console.log('🧪 ABSOLUTE MINIMAL SERVER TEST');
console.log('Testing basic Node.js and Express...');

try {
    const express = require('express');
    console.log('✅ Express loaded successfully');
    
    const app = express();
    console.log('✅ Express app created');
    
    app.get('/test', (req, res) => {
        res.json({ success: true, message: 'Minimal server working!' });
    });
    
    app.listen(5001, () => {
        console.log('✅ Minimal server running on port 5001');
        console.log('🔗 Test: http://localhost:5001/test');
        console.log('💡 This proves Express works - main server issue is elsewhere');
    });
    
} catch (error) {
    console.log('❌ Error in minimal server:');
    console.log(error.message);
    console.log(error.stack);
}
