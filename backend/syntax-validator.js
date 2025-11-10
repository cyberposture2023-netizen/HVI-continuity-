const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

console.log('🔧 COMPREHENSIVE SYNTAX VALIDATION');
console.log('='.repeat(50));

const filesToCheck = [
    'server.js',
    'routes/assessments.js',
    'routes/questions.js',
    'routes/dashboard.js',
    'routes/users.js',
    'routes/auth.js',
    'models/User.js',
    'models/Assessment.js',
    'server-health-monitor.js',
    'startup-manager.js'
];

let totalErrors = 0;
let totalFiles = 0;

function validateFile(filePath) {
    if (!fs.existsSync(filePath)) {
        console.log('❌ ' + filePath + ' - FILE NOT FOUND');
        return false;
    }

    try {
        // Try to require the file to check syntax
        delete require.cache[require.resolve('./' + filePath)];
        require('./' + filePath);
        console.log('✅ ' + filePath + ' - Syntax OK');
        return true;
    } catch (error) {
        console.log('❌ ' + filePath + ' - Syntax Error:');
        console.log('   ' + error.message);
        
        // Show the problematic code if possible
        if (error.stack) {
            const stackLines = error.stack.split('\n');
            // Find the line with the file reference
            const fileLine = stackLines.find(line => line.includes(filePath));
            if (fileLine) {
                console.log('   Stack: ' + fileLine.trim());
            }
        }
        
        return false;
    }
}

function deepValidateFile(filePath) {
    if (!fs.existsSync(filePath)) {
        return { valid: false, error: 'File not found' };
    }

    try {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Check for common syntax issues
        const issues = [];
        
        // Check for template literal issues
        if (content.includes('`${`)) {
            issues.push('Nested template literals may cause issues');
        }
        
        // Check for unescaped quotes
        const singleQuotes = (content.match(/'/g) || []).length;
        const doubleQuotes = (content.match(/"/g) || []).length;
        if (singleQuotes > 0 && doubleQuotes > 0) {
            // Mixed quotes can be okay, but check for patterns
            if (content.includes("'\"") || content.includes("\"'")) {
                issues.push('Potential quote escaping issues');
            }
        }
        
        // Check for common problematic patterns
        if (content.includes('Route.') && content.includes('[object Object]')) {
            issues.push('Route method called with object instead of function');
        }
        
        // Check for unclosed brackets
        const openBrackets = (content.match(/{/g) || []).length;
        const closeBrackets = (content.match(/}/g) || []).length;
        if (openBrackets !== closeBrackets) {
            issues.push(`Unbalanced brackets: {${openBrackets} vs }${closeBrackets}`);
        }
        
        // Check for unclosed parentheses
        const openParens = (content.match(/\(/g) || []).length;
        const closeParens = (content.match(/\)/g) || []).length;
        if (openParens !== closeParens) {
            issues.push(`Unbalanced parentheses: (${openParens} vs )${closeParens}`);
        }
        
        // Try Node.js syntax check
        const result = spawnSync('node', ['-c', filePath], {
            encoding: 'utf8'
        });
        
        if (result.status !== 0) {
            issues.push('Node.js syntax check failed: ' + result.stderr);
        }
        
        if (issues.length > 0) {
            console.log('❌ ' + filePath + ' - Issues found:');
            issues.forEach(issue => console.log('   - ' + issue));
            return { valid: false, issues: issues, content: content };
        } else {
            console.log('✅ ' + filePath + ' - Deep validation passed');
            return { valid: true, content: content };
        }
        
    } catch (error) {
        return { valid: false, error: error.message };
    }
}

// Run validation on all files
console.log('\n📋 BASIC SYNTAX VALIDATION:');
filesToCheck.forEach(file => {
    totalFiles++;
    if (!validateFile(file)) {
        totalErrors++;
    }
});

console.log('\n🔍 DEEP VALIDATION (Checking for hidden issues):');
const deepResults = [];
filesToCheck.forEach(file => {
    if (fs.existsSync(file)) {
        const result = deepValidateFile(file);
        deepResults.push({ file, ...result });
        if (!result.valid) {
            totalErrors++;
        }
    }
});

// Fix common issues automatically
console.log('\n🔧 AUTO-FIXING COMMON ISSUES:');
deepResults.forEach(result => {
    if (!result.valid && result.content) {
        console.log('Checking ' + result.file + ' for auto-fixable issues...');
        
        let fixedContent = result.content;
        let fixesApplied = [];
        
        // Fix: Replace problematic template literals
        if (fixedContent.includes('`${`)) {
            fixedContent = fixedContent.replace(/`\${`/g, '`${');
            fixesApplied.push('Fixed nested template literals');
        }
        
        // Fix: Ensure proper route callbacks
        if (fixedContent.includes('router.') && fixedContent.includes('( {')) {
            fixedContent = fixedContent.replace(/router\.(\w+)\(\s*\{/g, 'router.$1(async (req, res) => {');
            fixesApplied.push('Fixed route callback syntax');
        }
        
        // Fix: Ensure proper function syntax
        if (fixedContent.includes('function (') && !fixedContent.includes('function(')) {
            fixedContent = fixedContent.replace(/function \(/g, 'function(');
            fixesApplied.push('Fixed function spacing');
        }
        
        // Fix: Remove any [object Object] strings
        if (fixedContent.includes('[object Object]')) {
            fixedContent = fixedContent.replace(/\[object Object\]/g, '');
            fixesApplied.push('Removed [object Object] strings');
        }
        
        if (fixesApplied.length > 0) {
            fs.writeFileSync(result.file, fixedContent);
            console.log('✅ ' + result.file + ' - Applied fixes: ' + fixesApplied.join(', '));
        }
    }
});

console.log('\n' + '='.repeat(50));
console.log('📊 VALIDATION SUMMARY:');
console.log('   Files checked: ' + totalFiles);
console.log('   Errors found: ' + totalErrors);
console.log('   Success rate: ' + Math.round(((totalFiles - totalErrors) / totalFiles) * 100) + '%');

if (totalErrors === 0) {
    console.log('\n🎉 ALL FILES HAVE VALID SYNTAX!');
    console.log('🚀 Ready for authentication system development');
} else {
    console.log('\n⚠️ Some files have syntax issues that need manual review');
    console.log('💡 Check the errors above and fix manually if needed');
}

// Create a quick syntax check for future use
const quickCheck = `
const fs = require('fs');
console.log('Quick syntax check...');
try {
    require('./server.js');
    console.log('✅ server.js syntax OK');
} catch(e) {
    console.log('❌ server.js syntax error:', e.message);
}
`;
fs.writeFileSync('quick-syntax-check.js', quickCheck);
