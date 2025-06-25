# Email Notifications Setup Guide

This guide will help you set up real email notifications for when visitors contact you or subscribe to your blog.

## Quick Setup (Recommended: SendGrid)

### Step 1: Create SendGrid Account
1. Go to [SendGrid](https://sendgrid.com/) and create a free account
2. Free tier includes 100 emails/day which is perfect for contact notifications

### Step 2: Get API Key
1. Log into SendGrid dashboard
2. Go to Settings > API Keys
3. Click "Create API Key"
4. Choose "Restricted Access" and give permissions for "Mail Send"
5. Copy the API key

### Step 3: Configure Environment
1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add:
   ```env
   ADMIN_EMAIL=your-email@domain.com
   FROM_EMAIL=noreply@yourdomain.com  # or use SendGrid verified sender
   SENDGRID_API_KEY=your_sendgrid_api_key_here
   ```

### Step 4: Verify Sender
1. In SendGrid dashboard, go to Settings > Sender Authentication
2. Add your email address and verify it
3. Use this verified email as your `FROM_EMAIL`

## Alternative: SMTP Setup

If you prefer using your existing email provider:

### Gmail Setup
```env
ADMIN_EMAIL=your-email@gmail.com
FROM_EMAIL=your-email@gmail.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password  # Generate this in Gmail settings
```

**Important for Gmail**: You need to generate an "App Password":
1. Enable 2-factor authentication
2. Go to Google Account settings
3. Security > App passwords
4. Generate password for "Mail"

### Outlook Setup
```env
ADMIN_EMAIL=your-email@outlook.com
FROM_EMAIL=your-email@outlook.com
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

## Optional: Webhook Notifications

For instant notifications in Slack, Discord, or other platforms:

### Slack Setup
1. Create a Slack app and incoming webhook
2. Add to your `.env.local`:
   ```env
   CONTACT_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK
   SUBSCRIPTION_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK
   ```

## Testing Your Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Test contact form:
   - Go to `/contact`
   - Fill out and submit the form
   - Check your email and console logs

3. Test subscription:
   - Go to `/subscribe`
   - Submit subscription form
   - Check your email and console logs

## What You'll Receive

### Contact Form Notifications
- **Subject**: 🔔 New Contact Form Submission: [Subject]
- **Content**: Beautifully formatted email with all contact details
- **Reply-To**: Set to the visitor's email for easy replies

### Subscription Notifications
- **Subject**: 🎉 New Subscription: [Name/Email]
- **Content**: Subscriber details and research interests
- **Statistics**: Basic subscription info

## Features Included

✅ **Email Notifications**: Instant notifications to your email  
✅ **Beautiful HTML Formatting**: Professional-looking emails  
✅ **Fallback Options**: Multiple email service support  
✅ **Webhook Support**: Optional Slack/Discord notifications  
✅ **Reply-To Setup**: Easy to respond to contacts  
✅ **Error Handling**: Graceful failures with console logging  
✅ **Rate Limiting**: Protection against spam  

## Production Considerations

### For Production Deployment:
1. Use a custom domain for `FROM_EMAIL`
2. Set up SPF/DKIM records for better deliverability
3. Consider upgrading SendGrid plan for higher limits
4. Set up database storage for contacts/subscribers
5. Add auto-reply functionality

### Security Notes:
- Never commit `.env.local` to version control
- Use environment variables in production (Vercel, Netlify, etc.)
- Regularly rotate API keys
- Monitor email sending quotas

## Troubleshooting

### No emails received:
1. Check spam folder
2. Verify `ADMIN_EMAIL` is correct
3. Check console logs for errors
4. Verify SendGrid API key permissions

### SendGrid errors:
1. Ensure sender email is verified
2. Check API key permissions
3. Verify account is not suspended

### SMTP errors:
1. Check credentials
2. Verify app passwords for Gmail
3. Check firewall/network restrictions

## Advanced Features (Coming Soon)

- Database storage for contacts and subscribers
- Admin dashboard to manage notifications
- Auto-reply functionality
- Email templates customization
- Analytics and reporting
- Integration with CRM systems
