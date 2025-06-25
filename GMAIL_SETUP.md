# Gmail App Password Setup Guide

## Current Status
✅ Backend is working perfectly!  
✅ Contact form submissions are being received  
❌ Email delivery failing: Need valid Gmail App Password

## Quick Fix (5 minutes)

### Step 1: Generate Gmail App Password
1. Go to: https://myaccount.google.com/security
2. Under "How you sign in to Google" → Click "2-Step Verification"
3. Scroll down → Click "App passwords"
4. Select:
   - App: "Mail"
   - Device: "Other" → Type "Scientific Blog"
5. Click "Generate"
6. **Copy the 16-character password** (e.g., `abcd efgh ijkl mnop`)

### Step 2: Update .env.local
Replace this line in your `.env.local`:
```bash
SMTP_PASS=your_actual_app_password_here
```

With:
```bash
SMTP_PASS=your_16_char_password_here
```
(Remove spaces from the password)

### Step 3: Test
```bash
npm run test:email
```

## Alternative: Use SendGrid (Production Ready)
If Gmail doesn't work, switch to SendGrid:

1. Get free SendGrid account: https://sendgrid.com/
2. Generate API key
3. Update .env.local:
```bash
# Comment out SMTP_* variables
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_SECURE=false
# SMTP_USER=linhduongtuan@gmail.com
# SMTP_PASS=your_app_password

# Uncomment SendGrid
SENDGRID_API_KEY=SG.your_actual_api_key_here
FROM_EMAIL=linhduongtuan@gmail.com
```

## Current Email Configuration
- **FROM**: linhduongtuan@gmail.com  
- **TO**: lduong@kth.se  
- **SMTP**: Gmail (smtp.gmail.com:587)

## What's Working
✅ Contact form receives data  
✅ Subscription form works  
✅ Backend APIs respond correctly  
✅ Email system is configured  

## Only Missing
❌ Valid Gmail app password OR SendGrid API key

Once you add the password, ALL notifications will work immediately!
