export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { requireAdmin } from "@/app/lib/auth"
import { apiRateLimit } from "@/app/lib/rate-limit"

export async function GET(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = apiRateLimit(request)
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      )
    }

    // Require admin authentication
    await requireAdmin()

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const role = searchParams.get('role') || ''
    const subscribed = searchParams.get('subscribed')

    const offset = (page - 1) * limit

    // Build where clause
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (role) {
      where.role = role
    }
    
    if (subscribed !== null && subscribed !== '') {
      where.subscribed = subscribed === 'true'
    }

    // Get users with pagination
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
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
              Comment: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip: offset,
        take: limit
      }),
      prisma.user.count({ where })
    ])

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasMore: offset + limit < total
      }
    })
  } catch (error) {
    console.error("Error fetching users:", error)
    const err = error as Error
    if (err.message === "Authentication required") {
      return NextResponse.json(
        { error: "Please sign in" },
        { status: 401 }
      )
    }
    if (err.message === "Admin access required") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      )
    }
    
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    )
  }
}