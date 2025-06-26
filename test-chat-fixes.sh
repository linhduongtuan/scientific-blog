#!/bin/bash

echo "🔧 Testing Chat Functionality Fixes"
echo "=================================="

# Test 1: Check if server is running
echo "1. Checking if server is running on port 3000..."
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Server is running"
else
    echo "❌ Server is not running. Please start with 'npm run dev'"
    exit 1
fi

# Test 2: Check Socket.IO endpoint
echo "2. Testing Socket.IO endpoint..."
if curl -s http://localhost:3000/api/socket/io > /dev/null; then
    echo "✅ Socket.IO endpoint is accessible"
else
    echo "❌ Socket.IO endpoint is not accessible"
fi

# Test 3: Check chat messages API
echo "3. Testing chat messages API..."
if curl -s "http://localhost:3000/api/chat/messages?roomId=general" > /dev/null; then
    echo "✅ Chat messages API is working"
else
    echo "❌ Chat messages API is not working"
fi

# Test 4: Check chat rooms API
echo "4. Testing chat rooms API..."
if curl -s "http://localhost:3000/api/chat/rooms" > /dev/null; then
    echo "✅ Chat rooms API is working"
else
    echo "❌ Chat rooms API is not working"
fi

# Test 5: Check upload API
echo "5. Testing upload API..."
if curl -s -X POST http://localhost:3000/api/upload > /dev/null; then
    echo "✅ Upload API is accessible"
else
    echo "❌ Upload API is not accessible"
fi

echo ""
echo "🎯 Manual Testing Instructions:"
echo "1. Open http://localhost:3000 in your browser"
echo "2. Open the chat component"
echo "3. Check Developer Tools Console (F12) for connection logs"
echo "4. Test the following:"
echo "   - Type a message and click Send (should see 📤 logs)"
echo "   - Click the attachment button (should see 📎 logs)"
echo "   - Search for messages (should see 🔍 logs)"
echo "   - Switch between chat channels (should see 🏠 logs)"
echo ""
echo "🐛 If issues persist, check browser console for detailed error messages"
