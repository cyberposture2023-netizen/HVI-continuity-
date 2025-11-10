console.log('🔧 Validating Server Syntax...');
console.log('=============================');

try {
  // Check main server file
  require('./server.js');
  console.log('✅ server.js - Syntax OK');
  
  // Check route files
  const routes = ['assessments', 'questions', 'dashboard', 'users', 'auth'];
  
  routes.forEach(route => {
    try {
      require(`./routes/${route}.js`);
      console.log(`✅ routes/${route}.js - Syntax OK`);
    } catch (error) {
      console.log(`❌ routes/${route}.js - Syntax error: ${error.message}`);
    }
  });
  
  // Check utility files
  try {
    require('./utils/jwt-utils.js');
    console.log('✅ utils/jwt-utils.js - Syntax OK');
  } catch (error) {
    console.log(`❌ utils/jwt-utils.js - Syntax error: ${error.message}`);
  }
  
  // Check middleware
  try {
    require('./middleware/auth.js');
    console.log('✅ middleware/auth.js - Syntax OK');
  } catch (error) {
    console.log(`❌ middleware/auth.js - Syntax error: ${error.message}`);
  }
  
  console.log('\n🎉 Server syntax validation completed!');
  
} catch (error) {
  console.log('❌ Server validation failed:', error.message);
  process.exit(1);
}
