export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  // Basic security check
  const isProduction = process.env.NODE_ENV === 'production'
  
  if (isProduction) {
    return NextResponse.json(
      { error: 'Not available in production' },
      { status: 403 }
    )
  }

  // Check environment variables
  const envCheck = {
    database: {
      status: process.env.DATABASE_URL ? '✅ Configured' : '❌ Missing DATABASE_URL',
      value: process.env.DATABASE_URL ? 'Set' : 'Not set'
    },
    email: {
      adminEmail: process.env.ADMIN_EMAIL ? '✅ Set' : '❌ Missing ADMIN_EMAIL',
      fromEmail: process.env.FROM_EMAIL || process.env.EMAIL_FROM ? '✅ Set' : '⚠️ Recommended',
      provider: process.env.SENDGRID_API_KEY ? '✅ SendGrid' : 
                process.env.SMTP_HOST ? '✅ SMTP' : '❌ No email provider',
      smtp: {
        host: process.env.SMTP_HOST ? '✅ Set' : '❌ Missing',
        user: process.env.SMTP_USER ? '✅ Set' : '❌ Missing',
        pass: process.env.SMTP_PASS ? '✅ Set' : '❌ Missing'
      }
    },
    auth: {
      nextAuthUrl: process.env.NEXTAUTH_URL ? '✅ Set' : '⚠️ Recommended',
      nextAuthSecret: process.env.NEXTAUTH_SECRET ? '✅ Set' : '❌ Missing for production'
    },
    optional: {
      webhooks: process.env.CONTACT_WEBHOOK_URL ? '✅ Configured' : '⚠️ Optional',
      testSecret: process.env.EMAIL_TEST_SECRET ? '✅ Set' : '⚠️ Recommended'
    }
  }

  // Quick status
  const emailConfigured = (process.env.SENDGRID_API_KEY || 
    (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)) && 
    process.env.ADMIN_EMAIL

  const basicSetup = process.env.DATABASE_URL && process.env.ADMIN_EMAIL

  return NextResponse.json({
    overallStatus: basicSetup ? (emailConfigured ? '✅ Ready for production' : '⚠️ Email needs configuration') : '❌ Basic setup required',
    emailReady: emailConfigured,
    basicSetup: basicSetup,
    environment: process.env.NODE_ENV,
    checks: envCheck,
    nextSteps: !basicSetup ? [
      'Set ADMIN_EMAIL in .env.local',
      'Configure email provider (SendGrid or SMTP)',
      'Set DATABASE_URL if using external database'
    ] : !emailConfigured ? [
      'Configure email provider (SendGrid recommended)',
      'Test email functionality',
      'Optional: Set up webhook notifications'
    ] : [
      'Your backend is ready!',
      'Test functionality with contact form',
      'Deploy to production when ready'
    ]
  })
}
