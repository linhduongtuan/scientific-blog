export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { subscriptionSchema } from "@/app/lib/validation"
import { getCurrentUser } from "@/app/lib/auth"
import { apiRateLimit } from "@/app/lib/rate-limit"
import { sendSubscriptionConfirmationEmail } from "@/app/lib/email-enhanced"

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
    const validatedData = subscriptionSchema.parse(body)
    
    // Check if user is authenticated
    const currentUser = await getCurrentUser()
    
    if (currentUser) {
      // Update existing user's subscription
      const updatedUser = await prisma.user.update({
        where: { id: (currentUser as any)?.id || '1' },
        data: { 
          subscribed: true,
          // Update research interests if provided
          ...(validatedData.researchInterests && {
            // You might want to add a researchInterests field to your User model
          })
        },
        select: {
          id: true,
          name: true,
          email: true,
          subscribed: true
        }
      })
      
      // Send confirmation email
      try {
        await sendSubscriptionConfirmationEmail(updatedUser.email, updatedUser.name || 'User')
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError)
      }
      
      return NextResponse.json({
        message: "Subscription activated successfully!",
        user: updatedUser
      })
    } else {
      // Create new subscriber (guest subscription)
      // Check if email already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: validatedData.email }
      })
      
      if (existingUser) {
        if ((existingUser as any)?.subscribed) {
          return NextResponse.json(
            { error: "This email is already subscribed" },
            { status: 409 }
          )
        } else {
          // Update existing user to subscribed
          const updatedUser = await prisma.user.update({
            where: { email: validatedData.email },
            data: { subscribed: true },
            select: {
              id: true,
              name: true,
              email: true,
              subscribed: true
            }
          })
          
          try {
            await sendSubscriptionConfirmationEmail(updatedUser.email, updatedUser.name || 'User')
          } catch (emailError) {
            console.error('Failed to send confirmation email:', emailError)
          }
          
          return NextResponse.json({
            message: "Subscription activated successfully!",
            user: updatedUser
          })
        }
      } else {
        // Create new user with subscription
        const newUser = await prisma.user.create({
          data: {
            name: validatedData.name,
            email: validatedData.email,
            subscribed: true,
            role: "USER"
          },
          select: {
            id: true,
            name: true,
            email: true,
            subscribed: true
          }
        })
        
        try {
          await sendSubscriptionConfirmationEmail(newUser.email, newUser.name || 'User')
        } catch (emailError) {
          console.error('Failed to send confirmation email:', emailError)
        }
        
        return NextResponse.json({
          message: "Subscription created successfully! Please check your email for confirmation.",
          user: newUser
        }, { status: 201 })
      }
    }
    
  } catch (error: any) {
    console.error('Subscription error:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: "Invalid subscription data", details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: "Subscription failed" },
      { status: 500 }
    )
  }
}