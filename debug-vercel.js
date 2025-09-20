// Debug script để test Vercel function locally
const { spawn } = require('child_process');

console.log('🔍 Testing Vercel function locally...');

// Test build
console.log('📦 Building project...');
const build = spawn('npm', ['run', 'build'], { stdio: 'inherit' });

build.on('close', (code) => {
  if (code === 0) {
    console.log('✅ Build successful!');
    
    // Test function
    console.log('🚀 Testing function...');
    const testFunction = spawn('node', ['-e', `
      const handler = require('./dist/main.js').default;
      
      // Mock request and response
      const mockReq = {
        method: 'GET',
        url: '/',
        headers: {},
        body: {}
      };
      
      const mockRes = {
        status: (code) => ({
          json: (data) => {
            console.log('✅ Function response:', { status: code, data });
            process.exit(0);
          }
        })
      };
      
      // Test function
      handler(mockReq, mockRes).catch(err => {
        console.error('❌ Function error:', err);
        process.exit(1);
      });
    `], { stdio: 'inherit' });
    
    testFunction.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Function test successful!');
        console.log('🎉 Ready for Vercel deployment!');
      } else {
        console.log('❌ Function test failed!');
        process.exit(1);
      }
    });
    
  } else {
    console.log('❌ Build failed!');
    process.exit(1);
  }
});
