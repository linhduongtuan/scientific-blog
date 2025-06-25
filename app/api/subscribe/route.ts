export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from "next/server"
import { apiRateLimit } from "@/app/lib/rate-limit"

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
    
    // Validate input
    const { email, name, researchInterests, subscriptionType } = body
    
    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
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

    // Simulate database operations
    console.log('Subscription request:', {
      email,
      name: name || 'Anonymous',
      researchInterests: researchInterests || [],
      subscriptionType: subscriptionType || 'free',
      timestamp: new Date().toISOString()
    })

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    // TODO: In a real implementation:
    // 1. Save subscriber to database
    // 2. Send welcome email
    // 3. Add to mailing list (e.g., Mailchimp, ConvertKit)
    // 4. Set up subscription billing if premium

    /*
    // Example with Prisma:
    const subscriber = await prisma.subscriber.create({
      data: {
        email,
        name: name || 'Anonymous',
        researchInterests,
        subscriptionType: subscriptionType || 'free',
        subscribedAt: new Date()
      }
    })

    // Example with email service:
    await sendWelcomeEmail(email, name || 'Subscriber')
    */

    return NextResponse.json({
      success: true,
      message: subscriptionType === 'premium' 
        ? "Premium subscription activated! Welcome to the community."
        : "Successfully subscribed! Check your email for confirmation.",
      subscriber: {
        email,
        name: name || 'Anonymous',
        subscriptionType: subscriptionType || 'free'
      }
    })

  } catch (error: any) {
    console.error('Subscription error:', error)
    return NextResponse.json(
      { error: "Failed to process subscription. Please try again later." },
      { status: 500 }
    )
  }
}