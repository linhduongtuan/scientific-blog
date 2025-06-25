// Component type definitions
export interface CodeBlockProps {
  inline?: boolean
  className?: string
  children: React.ReactNode
  node?: any
}

export interface BlogContentProps {
  content: string
}

export interface SearchResult {
  id: string
  title: string
  content: string
  slug: string
  category: string
  tags: string[]
  publishedAt: string
}

export interface UserProfile {
  id: string
  name: string
  email: string
  role: 'USER' | 'ADMIN'
  subscribed: boolean
  bio?: string
  website?: string
  twitter?: string
  linkedin?: string
  github?: string
  avatar?: string
}

export interface NotificationData {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  duration?: number
}

export interface FormData {
  name: string
  email: string
  organization?: string
  subject: string
  message: string
  interests: string[]
}

export interface APIResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
