# 🔔 Email Notifications Test

To test your notification system immediately, follow these steps:

## 1. Quick Test (No Email Setup Required)

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Test Contact Form:**
   - Go to http://localhost:3000/contact
   - Fill out the form and submit
   - Check your terminal/console for notification logs
   - You'll see formatted notification output like:
   ```
   📧 EMAIL NOTIFICATION (No email service configured):
   To: lduong@kth.se
   Subject: 🔔 New Contact Form Submission: [Subject]
   Content: [Beautiful formatted notification]
   ```

3. **Test Subscription:**
   - Go to http://localhost:3000/subscribe
   - Submit subscription form
   - Check terminal for subscription notification logs

## 2. Enable Real Email Notifications

### Option A: SendGrid (Recommended - Free 100 emails/day)

1. **Create free SendGrid account:** https://sendgrid.com/
2. **Get API key:** Settings > API Keys > Create API Key
3. **Create `.env.local` file:**
   ```env
   ADMIN_EMAIL=lduong@kth.se
   FROM_EMAIL=noreply@yourdomain.com
   SENDGRID_API_KEY=your_sendgrid_api_key_here
   ```
4. **Verify sender email** in SendGrid dashboard

### Option B: Gmail SMTP (Quick Setup)

1. **Enable 2-factor authentication** in Gmail
2. **Generate app password:** Google Account > Security > App passwords
3. **Create `.env.local` file:**
   ```env
   ADMIN_EMAIL=lduong@kth.se
   FROM_EMAIL=your-gmail@gmail.com
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-gmail@gmail.com
   SMTP_PASS=your-app-password
   ```

## 3. Test Real Email Delivery

1. Restart your server after creating `.env.local`
2. Submit contact form or subscription
3. Check your email inbox for notifications
4. Console will show: ✅ Email sent successfully

## 4. Optional: Webhook Notifications

For instant Slack/Discord notifications:

1. **Create Slack webhook:** https://api.slack.com/messaging/webhooks
2. **Add to `.env.local`:**
   ```env
   CONTACT_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK
   SUBSCRIPTION_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK
   ```

## 5. What You'll Receive

### Contact Notifications:
- 📧 **Beautiful HTML email** with contact details
- 🔄 **Reply-To set** to visitor's email
- 📱 **Mobile-friendly** formatting
- ⏰ **Timestamp** and organization info

### Subscription Notifications:
- 🎉 **Subscription confirmation** with user details
- 📊 **Research interests** and subscription type
- 💎 **Premium/Free** subscription indicators
- 📈 **Growth tracking** suggestions

## 6. Production Deployment

When deploying to Vercel/Netlify:

1. **Add environment variables** in your hosting platform
2. **Use verified domain** for FROM_EMAIL
3. **Monitor email quotas** and delivery rates
4. **Set up database** for storing contacts/subscribers

## 7. Troubleshooting

- **No emails?** Check spam folder and verify ADMIN_EMAIL
- **SendGrid errors?** Verify API key and sender verification
- **Gmail issues?** Ensure app password (not regular password)
- **Console logs?** All notifications appear in terminal for debugging

Your notification system is now ready! 🚀
