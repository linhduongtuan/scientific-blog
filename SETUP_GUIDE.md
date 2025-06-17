# 🚀 Scientific Blog Platform - Complete Setup Guide

## 📋 Prerequisites

- Node.js 18.x or later
- npm or yarn
- Git

## 🔧 Quick Setup (5 minutes)

### 1. **Install Dependencies**
```bash
npm install
```

### 2. **Environment Setup**
```bash
# Copy environment template
cp .env.example .env.local

# The default .env.local uses SQLite for easy development
# No additional database setup required!
```

### 3. **Database Setup**
```bash
# Generate Prisma client, create database, and seed with demo data
npm run setup
```

### 4. **Start Development Server**
```bash
npm run dev
```

### 5. **Test the System**
Visit: http://localhost:3000/test

## 🧪 Testing Authentication

### Demo Users Available:
- **Admin**: `admin@example.com` / `password123`
- **User**: `user@example.com` / `password123`  
- **Premium**: `premium@example.com` / `password123`

### Test Features:
1. **Authentication**: Sign in/out, user roles
2. **Search**: Real-time search with filtering
3. **Comments**: Rich text commenting (premium users only)
4. **Admin Panel**: User management (admin only)

## 🔍 Feature Testing Checklist

### ✅ Authentication System
- [ ] Sign up new user
- [ ] Sign in with demo users
- [ ] Role-based access (admin vs user)
- [ ] Session persistence
- [ ] Sign out functionality

### ✅ Search Functionality  
- [ ] Real-time search dropdown
- [ ] Search results page
- [ ] Tag filtering
- [ ] Pagination
- [ ] No results handling

### ✅ Comment System
- [ ] View comments (all users)
- [ ] Post comments (premium users only)
- [ ] Rich text formatting
- [ ] Authentication required message

### ✅ API Endpoints
- [ ] `/api/search` - Search functionality
- [ ] `/api/posts/[postid]/comments` - Comments CRUD
- [ ] `/api/subscribe` - Subscription handling
- [ ] `/api/admin/users` - User management (admin)

## 🎯 Advanced Setup (Optional)

### Social Authentication Setup

1. **Google OAuth**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add to `.env.local`:
   ```env
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```

2. **GitHub OAuth**:
   - Go to GitHub Settings > Developer settings > OAuth Apps
   - Create new OAuth App
   - Set Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
   - Add to `.env.local`:
   ```env
   GITHUB_ID="your-github-client-id"
   GITHUB_SECRET="your-github-client-secret"
   ```

### Production Database Setup

1. **PostgreSQL** (Recommended for production):
   ```bash
   # Update .env.local
   DATABASE_URL="postgresql://username:password@localhost:5432/scientific_blog"
   
   # Update prisma/schema.prisma
   provider = "postgresql"
   
   # Run migrations
   npm run db:push
   npm run db:setup
   ```

2. **Email Configuration**:
   ```env
   EMAIL_SERVER_HOST="smtp.gmail.com"
   EMAIL_SERVER_PORT=587
   EMAIL_SERVER_USER="your-email@gmail.com"
   EMAIL_SERVER_PASSWORD="your-app-password"
   EMAIL_FROM="noreply@yourdomain.com"
   ```

## 📊 Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server

# Database
npm run db:generate     # Generate Prisma client
npm run db:push         # Push schema to database
npm run db:studio       # Open Prisma Studio
npm run db:setup        # Seed database with demo data
npm run setup           # Complete database setup

# Testing
npm run test:auth       # Instructions for testing auth
```

## 🔧 Troubleshooting

### Common Issues:

1. **"Module not found" errors**:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Database connection errors**:
   ```bash
   npm run db:generate
   npm run db:push
   ```

3. **Authentication not working**:
   - Check `NEXTAUTH_SECRET` is set
   - Verify `NEXTAUTH_URL` matches your domain
   - Clear browser cookies and localStorage

4. **Search not working**:
   - Ensure blog posts exist in `app/content/blog/`
   - Check API endpoint at `/api/search?q=test`

### Reset Everything:
```bash
# Delete database and start fresh
rm -f prisma/dev.db
npm run setup
```

## 🚀 Production Deployment

### Environment Variables for Production:
```env
DATABASE_URL="your-production-database-url"
NEXTAUTH_SECRET="your-super-secure-secret"
NEXTAUTH_URL="https://yourdomain.com"
EMAIL_SERVER_HOST="your-smtp-host"
EMAIL_SERVER_USER="your-email"
EMAIL_SERVER_PASSWORD="your-password"
```

### Deployment Checklist:
- [ ] Set strong `NEXTAUTH_SECRET`
- [ ] Configure production database
- [ ] Set up email service
- [ ] Configure social auth (optional)
- [ ] Test all functionality
- [ ] Set up monitoring/logging

## 📚 Next Steps

1. **Content Creation**: Add your blog posts in `app/content/blog/`
2. **Customization**: Update branding, colors, and content
3. **Analytics**: Add Google Analytics or similar
4. **SEO**: Optimize metadata and add sitemap
5. **Performance**: Set up CDN and caching
6. **Monitoring**: Add error tracking and uptime monitoring

## 🆘 Need Help?

- Check the test page: http://localhost:3000/test
- Review the implementation summary: `IMPLEMENTATION_SUMMARY.md`
- Check console logs for detailed error messages
- Verify all environment variables are set correctly

## 🎉 Success Indicators

Your setup is successful when:
- ✅ Test page shows all green checkmarks
- ✅ You can sign in with demo users
- ✅ Search returns results
- ✅ Comments work for premium users
- ✅ Admin can manage users

Happy coding! 🚀