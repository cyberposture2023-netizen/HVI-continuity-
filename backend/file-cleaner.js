const fs = require('fs');
const path = require('path');

console.log('🧹 FILE CONTENT CLEANER');
console.log('='.repeat(40));

const filesToClean = [
    'server.js',
    'routes/assessments.js',
    'routes/questions.js',
    'routes/dashboard.js',
    'routes/users.js',
    'routes/auth.js'
];

filesToClean.forEach(file => {
    if (fs.existsSync(file)) {
        try {
            let content = fs.readFileSync(file, 'utf8');
            let originalContent = content;
            
            // Remove any non-printable characters except newlines and tabs
            content = content.replace(/[^\x20-\x7E\n\t]/g, '');
            
            // Normalize line endings
            content = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
            
            // Remove extra blank lines (more than 2 consecutive)
            content = content.replace(/\n\n\n+/g, '\n\n');
            
            // Ensure proper semicolons (basic check)
            const lines = content.split('\n');
            let fixedLines = [];
            
            lines.forEach((line, index) => {
                let fixedLine = line;
                
                // Fix common missing semicolon patterns
                if (line.trim() && 
                    !line.trim().endsWith('{') &&
                    !line.trim().endsWith('}') &&
                    !line.trim().endsWith(',') &&
                    !line.includes('//') &&
                    !line.trim().endsWith(';') &&
                    !line.includes('router.') &&
                    !line.includes('app.') &&
                    index < lines.length - 1) {
                    
                    // Check if next line doesn't start with certain patterns
                    const nextLine = lines[index + 1] || '';
                    if (!nextLine.trim().startsWith('.')) {
                        fixedLine = line + ';';
                    }
                }
                
                fixedLines.push(fixedLine);
            });
            
            content = fixedLines.join('\n');
            
            if (content !== originalContent) {
                fs.writeFileSync(file, content);
                console.log('✅ Cleaned: ' + file);
            } else {
                console.log('✅ Already clean: ' + file);
            }
            
        } catch (error) {
            console.log('❌ Error cleaning ' + file + ': ' + error.message);
        }
    } else {
        console.log('⚠️ File not found: ' + file);
    }
});

console.log('\n🎉 File cleaning completed');
