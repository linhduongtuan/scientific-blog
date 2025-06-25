export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { testEmailConfiguration } from '@/app/lib/email-enhanced'

export async function GET(req: NextRequest) {
  // Basic security - only allow in development or with secret key
  const isProduction = process.env.NODE_ENV === 'production'
  const hasValidKey = req.nextUrl.searchParams.get('secret') === process.env.EMAIL_TEST_SECRET
  
  if (isProduction && !hasValidKey) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const result = await testEmailConfiguration()
    
    return NextResponse.json({
      success: true,
      message: 'Email test sent successfully! Check your admin email.',
      config: {
        adminEmail: process.env.ADMIN_EMAIL,
        fromEmail: process.env.FROM_EMAIL || process.env.EMAIL_FROM,
        provider: process.env.SENDGRID_API_KEY ? 'SendGrid' : 'SMTP',
        smtpHost: process.env.SMTP_HOST || process.env.EMAIL_SERVER_HOST
      }
    })
  } catch (error: any) {
    console.error('Email test failed:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message,
        troubleshooting: {
          checkEnvironmentVars: [
            'ADMIN_EMAIL (required)',
            'SENDGRID_API_KEY or SMTP_* variables',
            'FROM_EMAIL (recommended)'
          ],
          commonIssues: [
            'Invalid SMTP credentials',
            'Gmail requires app password (not regular password)',
            'SendGrid API key permissions',
            'Firewall blocking SMTP ports'
          ]
        }
      },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  // Allow manual email test with custom data
  const isProduction = process.env.NODE_ENV === 'production'
  const hasValidKey = req.nextUrl.searchParams.get('secret') === process.env.EMAIL_TEST_SECRET
  
  if (isProduction && !hasValidKey) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const { testType = 'config' } = await req.json()
    
    if (testType === 'contact') {
      const { sendContactNotification } = await import('@/app/lib/email-enhanced')
      
      await sendContactNotification({
        name: 'Test Contact',
        email: 'test@example.com',
        subject: 'Email Configuration Test',
        message: 'This is a test message to verify your contact form email functionality.',
        organization: 'Test Organization',
        interests: ['testing', 'email']
      })
      
      return NextResponse.json({
        success: true,
        message: 'Contact notification test sent successfully!'
      })
    }
    
    if (testType === 'subscription') {
      const { sendSubscriptionConfirmationEmail } = await import('@/app/lib/email-enhanced')
      
      await sendSubscriptionConfirmationEmail(
        process.env.ADMIN_EMAIL || 'test@example.com',
        'Test Subscriber'
      )
      
      return NextResponse.json({
        success: true,
        message: 'Subscription confirmation test sent successfully!'
      })
    }
    
    // Default to config test
    const result = await testEmailConfiguration()
    return NextResponse.json(result)
    
  } catch (error: any) {
    console.error('Email test failed:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
