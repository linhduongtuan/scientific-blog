# Backend Setup Summary

## 🚀 Quick Start

Your scientific blog backend is ready! Here's how to get it running:

### 1. Basic Setup
```bash
# Run the automated setup
./setup-backend.sh

# Or manually:
npm install
npm run setup
```

### 2. Configure Email (Required)

Edit `.env.local` and add your email configuration:

**Option A: Gmail SMTP** (Easy for testing)
```bash
ADMIN_EMAIL="lduong@kth.se"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-16-char-app-password"  # Generate this in Google Account
FROM_EMAIL="your-email@gmail.com"
```

**Option B: SendGrid** (Recommended for production)
```bash
ADMIN_EMAIL="lduong@kth.se"
SENDGRID_API_KEY="SG.your_sendgrid_api_key_here"
FROM_EMAIL="noreply@yourdomain.com"
```

### 3. Test Your Setup
```bash
npm run dev                    # Start server
npm run test:backend          # Check configuration
npm run test:email            # Test email functionality
```

## 📧 Email Configuration Help

### Gmail Setup (Development)
1. Enable 2-factor authentication on your Google account
2. Go to Google Account > Security > App passwords
3. Generate a 16-character app password
4. Use this password in `SMTP_PASS` (not your regular password)

### SendGrid Setup (Production)
1. Create account at [SendGrid](https://sendgrid.com)
2. Verify your sender email
3. Create API key with "Mail Send" permissions
4. Add API key to `SENDGRID_API_KEY`

## 🧪 Testing

### Test Endpoints
- `GET /api/backend-status` - Check configuration
- `GET /api/test-email` - Test email system
- `POST /api/contact` - Contact form
- `POST /api/subscribe` - Newsletter subscription

### Manual Testing
```bash
# Test contact form
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com", 
    "subject": "Test Message",
    "message": "Testing the contact form"
  }'

# Test subscription
curl -X POST http://localhost:3000/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

## 🗄️ Database

Your blog uses SQLite for development (file-based, no setup needed) and can use PostgreSQL for production.

### Commands
```bash
npm run db:studio             # View/edit database
npm run db:reset              # Reset database
npm run db:generate           # Generate Prisma client
```

### Default Users (for testing)
- **Admin**: `admin@example.com` / `password123`
- **User**: `user@example.com` / `password123`  
- **Premium**: `premium@example.com` / `password123`

## 🚀 Production Deployment

### Environment Variables for Production
```bash
NODE_ENV=production
DATABASE_URL="postgresql://user:pass@host:port/db"
NEXTAUTH_URL="https://yourdomain.com"
SENDGRID_API_KEY="your_production_api_key"
ADMIN_EMAIL="your_admin_email"
```

### Recommended Platforms
- **Vercel** (Easy, built for Next.js)
- **Railway** (Full-stack with database)
- **Heroku** (Traditional hosting)

## 🛠️ Features Ready

✅ **Contact Form** - Sends emails to your admin email  
✅ **Newsletter Subscription** - Email confirmation system  
✅ **User Authentication** - Sign up/sign in with demo accounts  
✅ **Database** - SQLite (dev) / PostgreSQL (prod)  
✅ **Rate Limiting** - Prevents spam and abuse  
✅ **Validation** - Input sanitization and validation  
✅ **Error Handling** - Graceful error management  

## 🆘 Troubleshooting

### Email Not Working?
1. Check environment variables: `npm run test:backend`
2. Verify credentials are correct
3. For Gmail: Use app password, not regular password
4. Check spam folder for test emails
5. View server logs: `npm run dev` and check console

### Database Issues?
1. Reset database: `npm run db:reset`
2. Check permissions: `ls -la prisma/`
3. Regenerate client: `npm run db:generate`

### Authentication Issues?
1. Clear browser localStorage
2. Check `NEXTAUTH_SECRET` is set
3. Verify user exists: `npm run db:studio`

## 📚 Documentation

- **Full Backend Guide**: `BACKEND_IMPLEMENTATION_GUIDE.md`
- **Function Setup**: `FUNCTION_SETUP_GUIDE.md`  
- **API Documentation**: Check individual route files in `app/api/`

## 🎯 Next Steps

1. **Configure email** (required for contact form)
2. **Test all functionality** with real email addresses
3. **Customize email templates** in `app/lib/email-enhanced.ts`
4. **Set up monitoring** (Sentry, analytics)
5. **Deploy to production** when ready

Your backend is production-ready! 🚀
