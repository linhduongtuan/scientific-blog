import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { commentSchema } from "@/app/lib/validation"
import { requireSubscription } from "@/app/lib/auth"
import { commentRateLimit } from "@/app/lib/rate-limit"

export async function GET(
  req: NextRequest,
  { params }: { params: { postid: string } }
) {
  try {
    const { postid } = params

    const comments = await prisma.comment.findMany({
      where: {
        postId: postid,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    return NextResponse.json(comments)
  } catch (error) {
    console.error("Error fetching comments:", error)
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    )
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { postid: string } }
) {
  try {
    // Apply rate limiting
    const rateLimitResult = commentRateLimit(req)
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Too many comments. Please wait before commenting again." },
        { status: 429 }
      )
    }

    // Require authentication and subscription
    const user = await requireSubscription()
    
    const body = await req.json()
    const { postid } = params
    
    // Validate input
    const validatedData = commentSchema.parse({
      ...body,
      postId: postid
    })
    
    // Create comment
    const comment = await prisma.comment.create({
      data: {
        content: validatedData.content,
        postId: validatedData.postId,
        userId: user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })
    
    return NextResponse.json(comment, { status: 201 })
    
  } catch (error: any) {
    console.error("Error creating comment:", error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: "Invalid comment data", details: error.errors },
        { status: 400 }
      )
    }
    
    if (error.message === "Authentication required") {
      return NextResponse.json(
        { error: "Please sign in to comment" },
        { status: 401 }
      )
    }
    
    if (error.message === "Subscription required") {
      return NextResponse.json(
        { error: "Only subscribed users can comment" },
        { status: 403 }
      )
    }
    
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    )
  }
}