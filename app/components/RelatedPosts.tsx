"use client"

import Link from 'next/link'
import { useState, useEffect } from 'react'

interface BlogPost {
  slug: string
  title: string
  excerpt: string
  author: string
  date: string
  tags: string[]
  readingTime: string
}

interface RelatedPostsProps {
  currentSlug: string
  currentTags: string[]
  allPosts: BlogPost[]
}

export default function RelatedPosts({ currentSlug, currentTags, allPosts }: RelatedPostsProps) {
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([])

  useEffect(() => {
    // Calculate similarity scores for each post
    const postsWithScores = allPosts
      .filter(post => post.slug !== currentSlug)
      .map(post => {
        let score = 0
        
        // Tag similarity (highest weight)
        const commonTags = post.tags.filter(tag => currentTags.includes(tag))
        score += commonTags.length * 3
        
        // Author similarity (medium weight)
        // This could be expanded to check if same author
        
        // Date proximity (lower weight)
        const currentDate = new Date()
        const postDate = new Date(post.date)
        const daysDiff = Math.abs((currentDate.getTime() - postDate.getTime()) / (1000 * 3600 * 24))
        if (daysDiff < 30) score += 1
        if (daysDiff < 7) score += 1
        
        return { ...post, score }
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3) // Get top 3 related posts

    setRelatedPosts(postsWithScores)
  }, [currentSlug, currentTags, allPosts])

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString('en-US', options)
  }

  if (relatedPosts.length === 0) {
    return (
      <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-6 dark:text-white">Related Articles</h2>
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-600 dark:text-gray-400">No related articles found.</p>
          <Link 
            href="/blog" 
            className="inline-block mt-4 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
          >
            Browse all articles →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold dark:text-white">Related Articles</h2>
        <Link 
          href="/blog" 
          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
        >
          View all →
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedPosts.map((post) => (
          <article 
            key={post.slug} 
            className="group border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <div className="p-6">
              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-3">
                {post.tags.slice(0, 2).map((tag) => (
                  <span 
                    key={tag}
                    className={`px-2 py-1 text-xs rounded-full ${
                      currentTags.includes(tag)
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors dark:text-white line-clamp-2">
                <Link href={`/blog/${post.slug}`}>
                  {post.title}
                </Link>
              </h3>

              {/* Excerpt */}
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                {post.excerpt}
              </p>

              {/* Meta info */}
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
                <div className="flex items-center space-x-2">
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                  <span>•</span>
                  <span>{post.readingTime}</span>
                </div>
                <span className="text-blue-600 dark:text-blue-400 group-hover:text-blue-800 dark:group-hover:text-blue-300 font-medium">
                  Read →
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Show more button if there are more posts */}
      {allPosts.length > 4 && (
        <div className="text-center mt-8">
          <Link 
            href="/blog"
            className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Explore more articles
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      )}
    </div>
  )
}