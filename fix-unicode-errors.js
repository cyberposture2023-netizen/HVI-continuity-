const fs = require('fs');
const path = require('path');

// Files with known errors
const problematicFiles = [
  'frontend/src/components/Dashboard.js',
  'frontend/src/services/assessmentService.js',
  'frontend/src/services/authService.js',
  'frontend/src/services/dashboardService.js',
  'frontend/src/services/userService.js'
];

function cleanUnicodeCharacters(content) {
  // Remove any problematic Unicode characters and fix common issues
  return content
    .replace(/[^\x00-\x7F]/g, '') // Remove non-ASCII characters
    .replace(/\\u[0-9A-Fa-f]{4}/g, '') // Remove Unicode escape sequences
    .replace(/\r\n/g, '\n') // Normalize line endings
    .replace(/\r/g, '\n'); // Convert remaining carriage returns
}

function fixFile(filePath) {
  try {
    const fullPath = path.resolve(filePath);
    if (!fs.existsSync(fullPath)) {
      console.log(`❌ File not found: ${filePath}`);
      return false;
    }

    console.log(`🔧 Fixing: ${filePath}`);
    const content = fs.readFileSync(fullPath, 'utf8');
    const cleanedContent = cleanUnicodeCharacters(content);
    
    // Write back the cleaned content
    fs.writeFileSync(fullPath, cleanedContent, 'utf8');
    console.log(`✅ Fixed: ${filePath}`);
    return true;
  } catch (error) {
    console.log(`❌ Error fixing ${filePath}:`, error.message);
    return false;
  }
}

// Fix all problematic files
console.log('🚀 Starting Unicode character cleanup...\n');
problematicFiles.forEach(fixFile);
console.log('\n✅ Cleanup complete!');