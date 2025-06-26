"use client"

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

interface SearchResult {
  slug: string
  title: string
  excerpt: string
  author: string
  date: string
  tags: string[]
  readingTime?: string
}

interface SearchResponse {
  posts: SearchResult[]
  pagination: {
    total: number
    limit: number
    offset: number
    hasMore: boolean
  }
  suggestions: {
    tags: string[]
  }
}

export default function SearchResults() {
  const [results, setResults] = useState<SearchResult[]>([])
  const [pagination, setPagination] = useState<SearchResponse['pagination'] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const tags = searchParams.get('tags')?.split(',').filter(Boolean) || []
  const page = parseInt(searchParams.get('page') || '1')

  useEffect(() => {
    performSearch()
  }, [searchParams])

  const performSearch = async () => {
    setIsLoading(true)
    setError('')
    
    try {
      const params = new URLSearchParams()
      if (query) params.set('q', query)
      if (tags.length > 0) params.set('tags', tags.join(','))
      params.set('limit', '10')
      params.set('offset', ((page - 1) * 10).toString())

      const response = await fetch(`/api/search?${params}`)
      if (response.ok) {
        const data: SearchResponse = await response.json()
        setResults(data.posts)
        setPagination(data.pagination)
      } else {
        setError('Search failed. Please try again.')
      }
    } catch {
      setError('Search failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (isLoading) {
    return <div className="text-center py-8">Searching...</div>
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <button 
          onClick={performSearch}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (!query && tags.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        Enter a search term or select tags to find articles.
      </div>
    )
  }

  return (
    <div>
      {/* Search Summary */}
      <div className="mb-6">
        <p className="text-gray-600 dark:text-gray-400">
          {pagination?.total || 0} result{(pagination?.total || 0) !== 1 ? 's' : ''} found
          {query && (
            <span> for "<span className="font-medium">{query}</span>"</span>
          )}
          {tags.length > 0 && (
            <span> in tags: {tags.map(tag => (
              <span key={tag} className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-sm ml-1">
                {tag}
              </span>
            ))}</span>
          )}
        </p>
      </div>

      {/* Results */}
      {results.length > 0 ? (
        <div className="space-y-6">
          {results.map((result) => (
            <article key={result.slug} className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                <time dateTime={result.date}>{formatDate(result.date)}</time>
                <span className="mx-2">•</span>
                <span>{result.author}</span>
                {result.readingTime && (
                  <>
                    <span className="mx-2">•</span>
                    <span>{result.readingTime}</span>
                  </>
                )}
              </div>
              
              <h2 className="text-xl font-bold mb-3 dark:text-white">
                <Link 
                  href={`/blog/${result.slug}`}
                  className="text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {result.title}
                </Link>
              </h2>
              
              <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                {result.excerpt.replace(/"/g, '&quot;')}
              </p>
              
              {result.tags && result.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {result.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/search?tags=${encodeURIComponent(tag)}`}
                      className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              )}
              
              <Link 
                href={`/blog/${result.slug}`}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
              >
                Read More →
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
            No articles found matching your search.
          </p>
          <p className="text-gray-500 dark:text-gray-500">
            Try different keywords or browse our <Link href="/blog" className="text-blue-600 dark:text-blue-400 hover:underline">latest articles</Link>.
          </p>
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.total > pagination.limit && (
        <div className="flex justify-center items-center space-x-4 mt-8">
          {page > 1 && (
            <Link
              href={`/search?${new URLSearchParams({ 
                ...(query && { q: query }), 
                ...(tags.length > 0 && { tags: tags.join(',') }), 
                page: (page - 1).toString() 
              })}`}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              Previous
            </Link>
          )}
          
          <span className="text-gray-600 dark:text-gray-400">
            Page {page} of {Math.ceil(pagination.total / pagination.limit)}
          </span>
          
          {pagination.hasMore && (
            <Link
              href={`/search?${new URLSearchParams({ 
                ...(query && { q: query }), 
                ...(tags.length > 0 && { tags: tags.join(',') }), 
                page: (page + 1).toString() 
              })}`}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              Next
            </Link>
          )}
        </div>
      )}
    </div>
  )
}