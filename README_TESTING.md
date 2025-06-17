# 🧪 Testing Your Scientific Blog Platform

## 🚀 Quick Start Testing

### 1. **Setup & Installation**
```bash
# Install dependencies
npm install

# Setup database and demo data
npm run setup

# Start development server
npm run dev
```

### 2. **Open Test Dashboard**
Visit: **http://localhost:3000/test**

This comprehensive testing dashboard will help you verify all features are working correctly.

## 🔐 Authentication Testing

### **Demo Users Available:**
| Role | Email | Password | Features |
|------|-------|----------|----------|
| **Admin** | `admin@example.com` | `password123` | Full access, user management |
| **Premium User** | `premium@example.com` | `password123` | Can comment, subscribe |
| **Regular User** | `user@example.com` | `password123` | Basic access |

### **Test Authentication Flow:**
1. **Sign Up**: Try creating a new account
2. **Sign In**: Use demo credentials
3. **Role Access**: Test admin vs user permissions
4. **Session Persistence**: Refresh page, check if logged in
5. **Sign Out**: Verify logout works

## 🔍 Search Functionality Testing

### **Test Search Features:**
1. **Real-time Search**: Type in navigation search bar
2. **Search Results Page**: Visit `/search?q=machine learning`
3. **Tag Filtering**: Click on tags in blog posts
4. **Empty Results**: Search for "nonexistent"
5. **Pagination**: Search with many results

### **Search Test Queries:**
- `machine learning` - Should find transformer post
- `python` - Should find Python guide
- `healthcare` - Should find ML healthcare post
- `xyz123` - Should show no results

## 💬 Comment System Testing

### **Comment Features to Test:**
1. **View Comments**: All users can see comments
2. **Post Comments**: Only premium/subscribed users
3. **Rich Text**: Use formatting toolbar
4. **Authentication Required**: Try commenting while logged out
5. **Subscription Required**: Try commenting as regular user

### **Rich Text Editor Features:**
- **Bold**, *Italic*, ~~Strikethrough~~
- Headers (H2, H3)
- Bullet and numbered lists
- Links and quotes
- Inline code

## 🔌 API Endpoints Testing

### **Test API Endpoints:**
```bash
# Search API
curl "http://localhost:3000/api/search?q=machine%20learning"

# Comments API (requires auth)
curl "http://localhost:3000/api/posts/understanding-transformers/comments"

# Subscribe API
curl -X POST "http://localhost:3000/api/subscribe" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com"}'

# Admin Users API (requires admin auth)
curl "http://localhost:3000/api/admin/users"
```

## 🎯 Feature Testing Checklist

### ✅ **Authentication System**
- [ ] Sign up new user
- [ ] Sign in with demo users
- [ ] Admin can access `/admin/dashboard`
- [ ] Regular users blocked from admin areas
- [ ] Session persists on page refresh
- [ ] Sign out clears session

### ✅ **Search & Navigation**
- [ ] Search bar shows dropdown results
- [ ] Search results page works
- [ ] Tag filtering functions
- [ ] Pagination works
- [ ] Mobile responsive

### ✅ **Content Management**
- [ ] Blog posts display correctly
- [ ] MDX content renders
- [ ] Code blocks have copy button
- [ ] Dark mode toggle works
- [ ] Responsive design

### ✅ **Comment System**
- [ ] Comments display for all users
- [ ] Rich text editor loads
- [ ] Formatting toolbar works
- [ ] Premium users can post
- [ ] Non-premium users see upgrade message

### ✅ **Performance**
- [ ] Pages load quickly
- [ ] Search is responsive
- [ ] Images load with placeholders
- [ ] No console errors

## 🐛 Common Issues & Solutions

### **"Module not found" errors:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### **Database errors:**
```bash
npm run db:generate
npm run db:push
npm run db:setup
```

### **Authentication not working:**
- Check `.env.local` has `NEXTAUTH_SECRET`
- Clear browser cookies/localStorage
- Restart development server

### **Search returns no results:**
- Verify blog posts exist in `app/content/blog/`
- Check API at `/api/search?q=test`
- Clear cache and restart server

## 📊 Performance Testing

### **Load Time Expectations:**
- **Home Page**: < 2 seconds
- **Blog Posts**: < 1 second (cached)
- **Search Results**: < 500ms
- **API Responses**: < 200ms

### **Test Performance:**
1. Open browser DevTools
2. Go to Network tab
3. Navigate through site
4. Check load times and file sizes

## 🔒 Security Testing

### **Test Security Features:**
1. **Rate Limiting**: Make rapid API requests
2. **Input Validation**: Try invalid form data
3. **Authentication**: Access protected routes
4. **XSS Prevention**: Try script injection in comments

### **Expected Security Behaviors:**
- Rate limits block excessive requests
- Invalid input returns 400 errors
- Protected routes require authentication
- User input is sanitized

## 🎉 Success Criteria

Your platform is working correctly when:

### ✅ **All Tests Pass**
- Authentication flows work smoothly
- Search returns relevant results
- Comments system functions properly
- Admin features work for admin users
- No console errors

### ✅ **Performance Metrics**
- Pages load under 2 seconds
- Search is responsive
- No memory leaks
- Smooth user interactions

### ✅ **User Experience**
- Intuitive navigation
- Clear error messages
- Responsive design
- Accessible features

## 🚀 Next Steps After Testing

1. **Content Creation**: Add your own blog posts
2. **Customization**: Update branding and styling
3. **Production Setup**: Configure production database
4. **Deployment**: Deploy to Vercel/Netlify
5. **Monitoring**: Set up analytics and error tracking

## 📞 Getting Help

If tests fail or you encounter issues:

1. **Check the test dashboard**: http://localhost:3000/test
2. **Review setup guide**: `SETUP_GUIDE.md`
3. **Check console logs** for detailed error messages
4. **Verify environment variables** in `.env.local`
5. **Try the reset command**: `rm -f prisma/dev.db && npm run setup`

Happy testing! 🎯