const fs = require('fs');
const path = require('path');

console.log('📁 CHECKING REQUIRED ROUTE FILES');
console.log('='.repeat(40));

const requiredRoutes = [
    'routes/assessments.js',
    'routes/questions.js',
    'routes/dashboard.js',
    'routes/users.js',
    'routes/auth.js'
];

const missingRoutes = [];

requiredRoutes.forEach(route => {
    if (fs.existsSync(route)) {
        console.log('✅ ' + route);
    } else {
        console.log('❌ ' + route + ' - MISSING');
        missingRoutes.push(route);
    }
});

if (missingRoutes.length > 0) {
    console.log('\n💡 CREATING MISSING ROUTE FILES...');
    
    missingRoutes.forEach(route => {
        const routeContent = `
const express = require('express');
const router = express.Router();

// ${route} - Basic route structure
router.get('/', (req, res) => {
    res.json({ message: '${route} endpoint working', timestamp: new Date().toISOString() });
});

module.exports = router;
`;
        
        // Create directory if needed
        const dir = path.dirname(route);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        fs.writeFileSync(route, routeContent);
        console.log('✅ Created: ' + route);
    });
} else {
    console.log('\n🎉 All route files exist!');
}
