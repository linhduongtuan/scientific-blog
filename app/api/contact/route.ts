export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from "next/server"
import { apiRateLimit } from "@/app/lib/rate-limit"
import { sendContactNotification, sendWebhookNotification } from "@/app/lib/notifications"

// Contact form submission endpoint
export async function POST(req: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = apiRateLimit(req)
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      )
    }

    const body = await req.json()
    
    // Validate required fields
    const { name, email, subject, message, organization, interests } = body
    
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      )
    }

    // In a real application, you would:
    // 1. Save to database
    // 2. Send email notification
    // 3. Send auto-reply to user
    
    // Save the contact information
    const contactData = {
      name,
      email,
      organization,
      subject,
      message,
      interests,
      timestamp: new Date().toISOString()
    }
    
    console.log('Contact form submission:', contactData)

    // Send email notification to admin
    const emailSent = await sendContactNotification({
      name,
      email,
      organization,
      subject,
      message,
      interests
    })

    // Send webhook notification (optional - for Slack, Discord, etc.)
    await sendWebhookNotification('contact', contactData)

    // TODO: Save to database
    // const contact = await prisma.contact.create({
    //   data: contactData
    // })

    // TODO: Send auto-reply to user
    // await sendAutoReply(email, name)

    return NextResponse.json({
      success: true,
      message: "Thank you for your message! I will get back to you within 24-48 hours.",
      notificationSent: emailSent
    })

  } catch (error: any) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 }
    )
  }
}
