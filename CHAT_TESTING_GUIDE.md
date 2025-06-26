# Multi-User Chat Testing Guide

## 🧪 Testing Setup Complete!

Test users have been created successfully. You can now test the chat functionality with multiple accounts.

## 👥 Available Test Accounts

| Name | Email | Password | Role |
|------|-------|----------|------|
| Admin User | admin@example.com | admin123 | ADMIN |
| Alice Johnson | alice@example.com | alice123 | USER |
| Bob Smith | bob@example.com | bob123 | USER |
| Charlie Brown | charlie@example.com | charlie123 | USER |

## 🔧 Testing Methods

### Method 1: Multiple Browsers (Recommended)
1. **Browser 1** (e.g., Chrome): Sign in as `admin@example.com / admin123`
2. **Browser 2** (e.g., Firefox): Sign in as `alice@example.com / alice123`
3. Open chat in both browsers
4. Test real-time messaging between accounts

### Method 2: Incognito Windows
1. **Regular Window**: Sign in as `admin@example.com / admin123`
2. **Incognito Window**: Sign in as `alice@example.com / alice123`
3. Open chat in both windows
4. Test messaging and features

### Method 3: Same Browser, Different Sessions
1. Sign in as admin account
2. Open chat and note current messages
3. Sign out and sign in as Alice
4. Open chat and test messaging
5. Switch back to admin to see messages

## 🧪 Test Scenarios

### 1. Basic Messaging Test
- [ ] Admin sends message to general channel
- [ ] Alice receives message in real-time
- [ ] Alice replies to admin's message
- [ ] Both users see the conversation

### 2. Channel Switching Test
- [ ] Both users switch to "tech" channel
- [ ] Send messages in tech channel
- [ ] Switch back to "general" channel
- [ ] Verify channel-specific messages are displayed

### 3. Real-time Features Test
- [ ] **Typing Indicators**: Start typing in one browser, see typing indicator in other
- [ ] **Message Reactions**: Add emoji reactions and see them appear in real-time
- [ ] **File Sharing**: Upload a file in one browser, see it appear in other

### 4. User Identity Test
- [ ] Verify usernames appear correctly
- [ ] Check user avatars/initials are different
- [ ] Confirm message timestamps

### 5. Connection Status Test
- [ ] Close one browser window
- [ ] Send message from remaining browser
- [ ] Reopen closed browser and verify message appears

## 🎯 Testing Checklist

### Send Button Functionality
- [ ] Type message as Admin user
- [ ] Click send button
- [ ] Verify message appears in Alice's browser
- [ ] Check console logs for `📤` emoji

### Attachment Button Functionality
- [ ] Click attachment button as Alice
- [ ] Select and upload a file
- [ ] Verify file message appears in Admin's browser
- [ ] Check console logs for `📎` emoji

### Search Functionality
- [ ] Send several messages between users
- [ ] Use search to find specific messages
- [ ] Verify search results are accurate
- [ ] Check console logs for `🔍` emoji

### Channel Switching
- [ ] Switch channels as Admin
- [ ] Verify Alice sees the same channel content
- [ ] Check console logs for `🏠` emoji

## 🐛 Debugging Tips

### Console Logs to Monitor
Open Developer Tools (F12) in both browsers and look for:
- `✅ Connected to chat server` - Connection established
- `🏓 Pong received` - Connection health check
- `📤 Send button clicked` - Message sending
- `📎 Attach button clicked` - File upload
- `🔍 Search button clicked` - Search functionality
- `🏠 Switching to room` - Channel changes

### Network Tab Monitoring
- Check for Socket.IO connections (`polling` and `websocket`)
- Monitor API calls to `/api/chat/messages`
- Verify file uploads to `/api/upload`

### Common Issues and Solutions
- **Messages not syncing**: Refresh both browsers
- **Connection issues**: Check server is running on port 3000
- **File upload fails**: Check file size (10MB limit)
- **Search not working**: Try different search terms

## 🚀 Quick Start Commands

```bash
# Start the development server
npm run dev

# Run the chat functionality test
./test-chat-fixes.sh

# Create additional test users (if needed)
node scripts/create-chat-test-users.js
```

## 📱 Mobile Testing (Optional)
- Open the application on your phone's browser
- Sign in with one of the test accounts
- Test messaging between desktop and mobile

## 🎉 Success Criteria
Your chat system is working correctly if:
- ✅ Messages appear in real-time across different browsers
- ✅ File uploads work and are visible to all users
- ✅ Channel switching updates content properly
- ✅ Search functionality returns accurate results
- ✅ User identities are displayed correctly
- ✅ Console logs show successful operations

Happy testing! 🎊
