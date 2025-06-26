import { NextRequest } from "next/server"

interface RateLimitConfig {
  windowMs: number
  maxRequests: number
}

// Simple in-memory rate limiter (for production, use Redis)
const requestCounts = new Map<string, { count: number; resetTime: number }>()

export function rateLimit(config: RateLimitConfig) {
  return (req: NextRequest) => {
    const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown'
    const now = Date.now()
    // const windowStart = now - config.windowMs // Unused variable removed

    // Clean up old entries
    Array.from(requestCounts.entries()).forEach(([key, value]) => {
      if (value.resetTime < now) {
        requestCounts.delete(key)
      }
    })

    const current = requestCounts.get(ip)
    
    if (!current || current.resetTime < now) {
      requestCounts.set(ip, {
        count: 1,
        resetTime: now + config.windowMs
      })
      return { success: true, remaining: config.maxRequests - 1 }
    }

    if (current.count >= config.maxRequests) {
      return { 
        success: false, 
        remaining: 0,
        resetTime: current.resetTime
      }
    }

    current.count++
    return { 
      success: true, 
      remaining: config.maxRequests - current.count 
    }
  }
}

// Pre-configured rate limiters
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5 // 5 attempts per 15 minutes
})

export const apiRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 60 // 60 requests per minute
})

export const commentRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 5 // 5 comments per minute
})