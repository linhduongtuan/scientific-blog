# Scientific Blog Function Setup Guide

This guide will help you activate and set up all the key functions of your scientific blog: authentication (Sign In/Sign Up), subscription, contact messaging, and related features.

## Current Status

Your blog already has the foundation built for:
- ✅ Authentication system (Sign In/Sign Up) with demo users
- ✅ Subscription functionality 
- ✅ Contact form
- ✅ Database schema with Prisma
- ✅ Email configuration (needs environment setup)
- ✅ Rate limiting and validation

## 1. Quick Start (Demo Mode)

Your blog is already functional in demo mode! You can immediately test:

### Sign In with Demo Accounts:
- **Admin**: `admin@example.com` / `password123`
- **Premium User**: `premium@example.com` / `password123` 
- **Regular User**: `user@example.com` / `password123`

### Features Available Now:
1. **Sign In**: Visit `/auth/signin` 
2. **Sign Up**: Visit `/auth/signup` (creates demo account)
3. **Subscribe**: Visit `/subscribe` 
4. **Contact**: Visit `/contact` (logs to console)

## 2. Database Setup

### Initialize the Database:
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database  
npm run db:push

# Set up initial data
npm run db:setup

# Or run all setup commands
npm run setup
```

### Verify Database:
```bash
# Open Prisma Studio to view data
npm run db:studio
```

## 3. Environment Variables Setup

Create a `.env.local` file in your project root:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-make-it-long-and-random"

# Email Configuration (for production)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your-email@gmail.com" 
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="your-email@gmail.com"

# Optional: External auth providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

## 4. Enable Full Authentication (Production Mode)

### Step 1: Activate NextAuth
Currently NextAuth is disabled. To enable it:

1. **Update auth configuration** in `/app/api/auth/[...nextauth]/route.ts`:
```typescript
import NextAuth from "next-auth"
import { authOptions } from "./authOptions"

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
```

2. **Create authOptions.ts** with your authentication providers
3. **Update AuthContext** to use NextAuth instead of demo mode

### Step 2: Connect Real Email Service

For Gmail (recommended for testing):
1. Enable 2-factor authentication on your Google account
2. Generate an "App Password" 
3. Use the app password in `EMAIL_SERVER_PASSWORD`

For other providers (SendGrid, Mailgun, etc.):
- Update the transporter configuration in `/app/lib/email.ts`

## 5. Activate Contact Form Backend

### Option A: Simple Email Handler
Create `/app/api/contact/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { sendContactEmail } from '@/app/lib/email'

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message, organization, interests } = await req.json()
    
    // Send email to yourself
    await sendContactEmail({
      from: email,
      name,
      subject,
      message,
      organization,
      interests
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
```

### Option B: Save to Database
Add a Contact model to your Prisma schema and save messages to the database.

## 6. Subscription Features

### Current Functionality:
- ✅ Email collection and validation
- ✅ User subscription status tracking  
- ✅ Integration with user accounts

### To Activate:
1. Set up email service (see step 4)
2. Test subscription flow:
   - Visit `/subscribe`
   - Enter email address
   - Check that confirmation email is sent

## 7. Testing Your Setup

### Development Server:
```bash
npm run dev
```

### Test Authentication:
1. Go to `http://localhost:3000/auth/signin`
2. Use demo credentials or create new account
3. Verify user appears in Prisma Studio

### Test Subscription:
1. Go to `http://localhost:3000/subscribe`  
2. Enter email address
3. Check email delivery (if configured)

### Test Contact Form:
1. Go to `http://localhost:3000/contact`
2. Fill out form
3. Check console logs or email delivery

## 8. Deployment Checklist

### Before Production:
- [ ] Set strong `NEXTAUTH_SECRET`
- [ ] Configure production database (PostgreSQL recommended)
- [ ] Set up email service (SendGrid, Mailgun, etc.)
- [ ] Enable SSL/HTTPS
- [ ] Set proper CORS policies
- [ ] Configure rate limiting
- [ ] Set up monitoring and logging

### Environment Variables for Production:
```env
NODE_ENV="production"
DATABASE_URL="your-production-database-url"
NEXTAUTH_URL="https://yourdomain.com"
# ... other production configs
```

## 9. Customization Options

### Authentication:
- Add social login (Google, GitHub, etc.)
- Customize email templates
- Add password reset functionality
- Implement role-based access

### Subscription:
- Add newsletter functionality
- Integrate with email marketing service (Mailchimp, ConvertKit)
- Add subscription plans/tiers
- Payment integration

### Contact Form:
- Add file attachments
- Integrate with CRM
- Add auto-responses
- Create admin dashboard for messages

## 10. Troubleshooting

### Common Issues:

**Database Connection:**
```bash
# Reset database if needed
rm prisma/dev.db
npm run db:push
npm run db:setup
```

**Email Not Working:**
- Check environment variables
- Verify SMTP settings
- Check spam folder
- Test with a simple email service first

**Authentication Issues:**
- Clear browser localStorage
- Check browser console for errors
- Verify environment variables
- Test with demo accounts first

### Get Help:
- Check browser console for errors
- Review server logs (`npm run dev`)
- Use Prisma Studio to inspect database
- Test individual API endpoints

## Quick Commands Reference

```bash
# Start development
npm run dev

# Database operations
npm run db:generate  # Generate Prisma client
npm run db:push      # Apply schema changes
npm run db:studio    # Open database browser
npm run setup        # Full database setup

# Build and deploy
npm run build
npm run start
```

Your scientific blog is now ready to use! Start with the demo mode to test everything, then gradually move to production setup as needed.
