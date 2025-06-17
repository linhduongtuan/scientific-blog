import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { requireAdmin } from "@/app/lib/auth"
import { updateUserSchema } from "@/app/lib/validation"
import { apiRateLimit } from "@/app/lib/rate-limit"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const rateLimitResult = apiRateLimit(request)
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      )
    }

    await requireAdmin()

    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        role: true,
        subscribed: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            comments: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(user)
  } catch (error: any) {
    console.error("Error fetching user:", error)
    
    if (error.message === "Authentication required") {
      return NextResponse.json({ error: "Please sign in" }, { status: 401 })
    }
    
    if (error.message === "Admin access required") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }
    
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const rateLimitResult = apiRateLimit(request)
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      )
    }

    await requireAdmin()

    const body = await request.json()
    const validatedData = updateUserSchema.parse(body)

    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: validatedData,
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        role: true,
        subscribed: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return NextResponse.json(updatedUser)
  } catch (error: any) {
    console.error("Error updating user:", error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: "Invalid user data", details: error.errors },
        { status: 400 }
      )
    }
    
    if (error.message === "Authentication required") {
      return NextResponse.json({ error: "Please sign in" }, { status: 401 })
    }
    
    if (error.message === "Admin access required") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }
    
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 })
    }
    
    if (error.code === 'P2025') {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
    
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const rateLimitResult = apiRateLimit(request)
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      )
    }

    await requireAdmin()

    await prisma.user.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: "User deleted successfully" })
  } catch (error: any) {
    console.error("Error deleting user:", error)
    
    if (error.message === "Authentication required") {
      return NextResponse.json({ error: "Please sign in" }, { status: 401 })
    }
    
    if (error.message === "Admin access required") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }
    
    if (error.code === 'P2025') {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
    
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
  }
}