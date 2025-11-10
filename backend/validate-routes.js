const fs = require('fs');
const path = require('path');

console.log('🔧 ROUTE VALIDATION CHECK');
console.log('='.repeat(40));

const routeFiles = [
    'routes/assessments.js',
    'routes/questions.js', 
    'routes/dashboard.js',
    'routes/users.js',
    'routes/auth.js'
];

routeFiles.forEach(routeFile => {
    try {
        if (fs.existsSync(routeFile)) {
            // Try to require the route to check for syntax errors
            delete require.cache[require.resolve('./' + routeFile)];
            require('./' + routeFile);
            console.log('✅ ' + routeFile + ' - Syntax OK');
        } else {
            console.log('❌ ' + routeFile + ' - Missing');
        }
    } catch (error) {
        console.log('❌ ' + routeFile + ' - Error: ' + error.message);
    }
});

console.log('\n🎯 Route validation completed');
