export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { apiRateLimit } from '@/app/lib/rate-limit'

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

    // Log the contact form submission (in production, you'd save to database or send email)
    console.log('📧 Contact Form Submission:', {
      timestamp: new Date().toISOString(),
      name,
      email,
      organization,
      subject,
      interests,
      message: message.substring(0, 100) + (message.length > 100 ? '...' : '')
    })

    // In production, you would:
    // 1. Save to database
    // 2. Send email notification
    // 3. Send auto-reply to user
    
    // For now, simulate successful submission
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
