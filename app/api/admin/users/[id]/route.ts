export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { requireAdmin } from "@/app/lib/auth"
import { updateUserSchema } from "@/app/lib/validation"
import { apiRateLimit } from "@/app/lib/rate-limit"
import { ZodError } from "zod"

// Common user select fields
const USER_SELECT_FIELDS = {
  id: true,
  name: true,
  email: true,
  emailVerified: true,
  role: true,
  subscribed: true,
  createdAt: true,
  updatedAt: true,
} as const

// Helper function to handle common errors
function handleError(error: unknown, operation: string) {
  console.error(`Error ${operation}:`, error)
  
  if (error instanceof Error) {
    if (error.message === "Authentication required") {
      return NextResponse.json({ error: "Please sign in" }, { status: 401 })
    }
    
    if (error.message === "Admin access required") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }
  }
  
  if (error instanceof ZodError) {
    return NextResponse.json(
      { error: "Invalid user data", details: error.errors },
      { status: 400 }
    )
  }
  
  // Handle Prisma errors
  if (error && typeof error === 'object' && 'code' in error) {
    const prismaError = error as { code: string }
    
    switch (prismaError.code) {
      case 'P2002':
        return NextResponse.json({ error: "Email already exists" }, { status: 409 })
      case 'P2025':
        return NextResponse.json({ error: "User not found" }, { status: 404 })
      default:
        break
    }
  }
  
  return NextResponse.json(
    { error: `Failed to ${operation.replace('ing', '').toLowerCase()} user` }, 
    { status: 500 }
  )
}

// Helper function to check rate limit and admin access
async function checkPermissions(request: NextRequest) {
  const rateLimitResult = apiRateLimit(request)
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    )
  }

  await requireAdmin()
  return null
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check permissions
    const permissionError = await checkPermissions(request)
    if (permissionError) return permissionError

    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        ...USER_SELECT_FIELDS,
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
  } catch (error: unknown) {
    return handleError(error, "fetching")
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check permissions
    const permissionError = await checkPermissions(request)
    if (permissionError) return permissionError

    const body = await request.json()
    const validatedData = updateUserSchema.parse(body)

    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: validatedData,
      select: USER_SELECT_FIELDS
    })

    return NextResponse.json(updatedUser)
  } catch (error: unknown) {
    return handleError(error, "updating")
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check permissions
    const permissionError = await checkPermissions(request)
    if (permissionError) return permissionError

    await prisma.user.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: "User deleted successfully" })
  } catch (error: unknown) {
    return handleError(error, "deleting")
  }
}