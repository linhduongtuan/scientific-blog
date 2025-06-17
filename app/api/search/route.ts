import { NextRequest, NextResponse } from "next/server"
import { searchSchema } from "@/app/lib/validation"
import { getAllBlogPosts } from "@/app/lib/mdx"
import { apiRateLimit } from "@/app/lib/rate-limit"

export async function GET(req: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = apiRateLimit(req)
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      )
    }

    const { searchParams } = new URL(req.url)
    
    // Parse and validate search parameters
    const searchData = {
      query: searchParams.get('q') || '',
      tags: searchParams.get('tags')?.split(',').filter(Boolean) || [],
      author: searchParams.get('author') || undefined,
      dateFrom: searchParams.get('dateFrom') || undefined,
      dateTo: searchParams.get('dateTo') || undefined,
      limit: parseInt(searchParams.get('limit') || '10'),
      offset: parseInt(searchParams.get('offset') || '0')
    }
    
    const validatedData = searchSchema.parse(searchData)
    
    // Get all blog posts
    const allPosts = await getAllBlogPosts()
    
    // Filter posts based on search criteria
    let filteredPosts = allPosts
    
    // Text search in title and excerpt
    if (validatedData.query) {
      const query = validatedData.query.toLowerCase()
      filteredPosts = filteredPosts.filter(post => 
        (post.title && post.title.toLowerCase().includes(query)) ||
        (post.excerpt && post.excerpt.toLowerCase().includes(query)) ||
        (post.tags && post.tags.some(tag => tag && tag.toLowerCase().includes(query)))
      )
    }
    
    // Filter by tags
    if (validatedData.tags && validatedData.tags.length > 0) {
      filteredPosts = filteredPosts.filter(post =>
        post.tags && validatedData.tags!.some(tag => 
          post.tags!.map(t => t.toLowerCase()).includes(tag.toLowerCase())
        )
      )
    }
    
    // Filter by author
    if (validatedData.author) {
      filteredPosts = filteredPosts.filter(post =>
        post.author && post.author.toLowerCase().includes(validatedData.author!.toLowerCase())
      )
    }
    
    // Filter by date range
    if (validatedData.dateFrom) {
      const fromDate = new Date(validatedData.dateFrom)
      filteredPosts = filteredPosts.filter(post =>
        post.date && new Date(post.date) >= fromDate
      )
    }
    
    if (validatedData.dateTo) {
      const toDate = new Date(validatedData.dateTo)
      filteredPosts = filteredPosts.filter(post =>
        post.date && new Date(post.date) <= toDate
      )
    }
    
    // Apply pagination
    const total = filteredPosts.length
    const paginatedPosts = filteredPosts.slice(
      validatedData.offset,
      validatedData.offset + validatedData.limit
    )
    
    // Get unique tags from all posts for suggestions
    const allTags = Array.from(new Set(
      allPosts.flatMap(post => post.tags || [])
    )).sort()
    
    return NextResponse.json({
      posts: paginatedPosts,
      pagination: {
        total,
        limit: validatedData.limit,
        offset: validatedData.offset,
        hasMore: validatedData.offset + validatedData.limit < total
      },
      suggestions: {
        tags: allTags
      }
    })
    
  } catch (error: any) {
    console.error('Search error:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: "Invalid search parameters", details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    )
  }
}