// Simple test script to check chat functionality
const { exec } = require('child_process');

console.log('🔍 Testing chat functionality...\n');

// Test 1: Check if the server starts without errors
console.log('1. Testing server startup...');
exec('cd /Users/linh/Downloads/scientific-blog && timeout 10s npm run dev', (error, stdout, stderr) => {
  if (error) {
    console.log('❌ Server startup test failed:', error.message);
  } else {
    console.log('✅ Server appears to be starting correctly');
  }
  
  console.log('\nServer output:');
  console.log(stdout);
  
  if (stderr) {
    console.log('\nErrors:');
    console.log(stderr);
  }
});

// Test 2: Check if socket.io endpoint is accessible
setTimeout(() => {
  console.log('\n2. Testing Socket.IO endpoint...');
  const http = require('http');
  
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/socket/io',
    method: 'GET'
  };
  
  const req = http.request(options, (res) => {
    console.log(`✅ Socket.IO endpoint accessible - Status: ${res.statusCode}`);
  });
  
  req.on('error', (e) => {
    console.log(`❌ Socket.IO endpoint error: ${e.message}`);
  });
  
  req.setTimeout(5000, () => {
    console.log('❌ Socket.IO endpoint timeout');
    req.destroy();
  });
  
  req.end();
}, 8000);

console.log('\n📝 Things to check manually:');
console.log('1. Open the application in your browser');
console.log('2. Open the chat component');
console.log('3. Check the browser console for connection logs');
console.log('4. Try typing a message and click send');
console.log('5. Try searching for messages');
console.log('6. Try uploading a file');
console.log('\n🔧 Debug tips:');
console.log('- Open Developer Tools (F12)');
console.log('- Look for console logs starting with emoji icons');
console.log('- Check Network tab for socket.io connections');
console.log('- Verify the chat component shows "Connected" status');
