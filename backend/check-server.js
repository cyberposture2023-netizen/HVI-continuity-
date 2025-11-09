const fs = require('fs');
try {
    const serverCode = fs.readFileSync('server.js', 'utf8');
    
    // Basic checks
    const checks = {
        'Express import': serverCode.includes('require(''express'')'),
        'MongoDB connection': serverCode.includes('mongoose.connect') || serverCode.includes('MongoDB'),
        'Port listening': serverCode.includes('app.listen') || serverCode.includes('.listen('),
        'CORS setup': serverCode.includes('cors') || serverCode.includes('CORS'),
        'Health endpoint': serverCode.includes('/api/health')
    };
    
    console.log('🔍 Server.js Basic Checks:');
    Object.entries(checks).forEach(([check, passed]) => {
        console.log(`   ${passed ? '✅' : '❌'} ${check}`);
    });
    
    const passedChecks = Object.values(checks).filter(Boolean).length;
    const totalChecks = Object.values(checks).length;
    
    console.log(`\n📊 Basic checks: ${passedChecks}/${totalChecks} passed`);
    
    if (passedChecks === totalChecks) {
        console.log('✅ Server.js structure looks good');
    } else {
        console.log('❌ Server.js may have missing components');
    }
    
} catch (error) {
    console.log('❌ Could not read server.js:', error.message);
}
