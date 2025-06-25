export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { apiRateLimit } from '@/app/lib/rate-limit'
import { sendContactNotification, sendWebhookNotification } from '@/app/lib/email-enhanced'

export async function POST(req: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = apiRateLimit(req)
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const { name, email, subject, message, organization, interests } = await req.json()
    
    // Basic validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Please fill in all required fields.' },
        { status: 400 }
      )
    }

    // Log the contact form submission
    console.log('📧 Contact Form Submission:', {
      timestamp: new Date().toISOString(),
      name,
      email,
      organization,
      subject,
      interests,
      message: message.substring(0, 100) + (message.length > 100 ? '...' : '')
    })

    // Send email notification to admin
    try {
      await sendContactNotification({
        name,
        email,
        subject,
        message,
        organization,
        interests
      })
    } catch (emailError) {
      console.error('Email notification failed:', emailError)
      // Continue processing even if email fails
    }

    // Send webhook notification if configured
    if (process.env.CONTACT_WEBHOOK_URL) {
      try {
        await sendWebhookNotification(process.env.CONTACT_WEBHOOK_URL, {
          text: `📧 New Contact Form Submission`,
          blocks: [
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: `*New Contact Form Submission*\n*From:* ${name} (${email})\n*Subject:* ${subject}\n*Organization:* ${organization || 'Not specified'}\n*Message:* ${message.substring(0, 200)}${message.length > 200 ? '...' : ''}`
              }
            }
          ]
        })
      } catch (webhookError) {
        console.error('Webhook notification failed:', webhookError)
        // Continue processing even if webhook fails
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Thank you for your message! I will get back to you soon.'
    })

  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'An error occurred while sending your message. Please try again.' },
      { status: 500 }
    )
  }
}
