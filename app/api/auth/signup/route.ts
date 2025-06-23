export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from "next/server"
import { signUpSchema } from "@/app/lib/validation"
import { createUser } from "@/app/lib/auth"
import { authRateLimit } from "@/app/lib/rate-limit"
import { sendVerificationEmail } from "@/app/lib/email"

export async function POST(req: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = authRateLimit(req)
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { 
          error: "Too many signup attempts. Please try again later.",
          resetTime: rateLimitResult.resetTime 
        },
        { status: 429 }
      )
    }

    const body = await req.json()
    
    // Validate input
    const validatedData = signUpSchema.parse(body)
    
    // Create user
    const user = await createUser(validatedData)
    
    // Send verification email (in production)
    if (process.env.NODE_ENV === 'production') {
      try {
        await sendVerificationEmail(user.email, user.id)
      } catch (emailError) {
        console.error('Failed to send verification email:', emailError)
        // Don't fail the signup if email fails
      }
    }
    
    return NextResponse.json(
      { 
        message: "User created successfully. Please check your email for verification.",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: (user as any).role || 'user'
        }
      },
      { status: 201 }
    )
    
  } catch (error: any) {
    console.error('Signup error:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: "Invalid input data", details: error.errors },
        { status: 400 }
      )
    }
    
    if (error.message === "User with this email already exists") {
      return NextResponse.json(
        { error: error.message },
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}