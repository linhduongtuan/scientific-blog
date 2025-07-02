// Simple script to test if we can fetch messages from the API
const fetch = require('node-fetch');

const roomId = 'general';

async function testChatApi() {
  try {
    console.log('Testing chat API for room:', roomId);
    const response = await fetch(`http://localhost:3000/api/chat/messages?limit=50&roomId=${roomId}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('API Response:', JSON.stringify(data, null, 2));
      console.log('Message count:', data.messages?.length || 0);
      
      if (data.messages && data.messages.length > 0) {
        console.log('First message:', JSON.stringify(data.messages[0], null, 2));
      }
    } else {
      console.error('API request failed:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Error testing chat API:', error);
  }
}

testChatApi();
