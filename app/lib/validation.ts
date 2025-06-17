import { z } from 'zod'

// User validation schemas
export const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(100, 'Password must be less than 100 characters')
})

export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
})

// Comment validation schemas
export const commentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty').max(1000, 'Comment must be less than 1000 characters'),
  postId: z.string().min(1, 'Post ID is required')
})

// Subscription validation schema
export const subscriptionSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
  email: z.string().email('Invalid email address'),
  researchInterests: z.string().max(500, 'Research interests must be less than 500 characters').optional()
})

// Search validation schema
export const searchSchema = z.object({
  query: z.string().min(1, 'Search query is required').max(100, 'Search query must be less than 100 characters'),
  tags: z.array(z.string()).optional(),
  author: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  limit: z.number().min(1).max(50).default(10),
  offset: z.number().min(0).default(0)
})

// Admin user management schema
export const updateUserSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  email: z.string().email().optional(),
  role: z.enum(['USER', 'ADMIN']).optional(),
  subscribed: z.boolean().optional()
})

export type SignUpInput = z.infer<typeof signUpSchema>
export type SignInInput = z.infer<typeof signInSchema>
export type CommentInput = z.infer<typeof commentSchema>
export type SubscriptionInput = z.infer<typeof subscriptionSchema>
export type SearchInput = z.infer<typeof searchSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>