"use client"

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

interface SearchResult {
  slug: string
  title: string
  excerpt: string
  author: string
  date: string
  tags: string[]
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

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [availableTags, setAvailableTags] = useState<string[]>([])
  
  const searchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  // Initialize from URL params
  useEffect(() => {
    const q = searchParams.get('q') || ''
    const tags = searchParams.get('tags')?.split(',').filter(Boolean) || []
    setQuery(q)
    setSelectedTags(tags)
    
    if (q || tags.length > 0) {
      performSearch(q, tags)
    }
  }, [searchParams])

  // Close results when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const performSearch = async (searchQuery: string, tags: string[] = selectedTags) => {
    if (!searchQuery.trim() && tags.length === 0) {
      setResults([])
      setShowResults(false)
      return
    }

    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchQuery.trim()) params.set('q', searchQuery.trim())
      if (tags.length > 0) params.set('tags', tags.join(','))
      params.set('limit', '5') // Limit for dropdown results

      const response = await fetch(`/api/search?${params}`)
      if (response.ok) {
        const data: SearchResponse = await response.json()
        setResults(data.posts)
        setAvailableTags(data.suggestions.tags)
        setShowResults(true)
      }
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim() || selectedTags.length > 0) {
      // Navigate to search results page
      const params = new URLSearchParams()
      if (query.trim()) params.set('q', query.trim())
      if (selectedTags.length > 0) params.set('tags', selectedTags.join(','))
      
      router.push(`/search?${params}`)
      setShowResults(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    
    // Debounced search
    const timeoutId = setTimeout(() => {
      performSearch(value)
    }, 300)

    return () => clearTimeout(timeoutId)
  }

  const toggleTag = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag]
    
    setSelectedTags(newTags)
    performSearch(query, newTags)
  }

  const removeTag = (tag: string) => {
    const newTags = selectedTags.filter(t => t !== tag)
    setSelectedTags(newTags)
    performSearch(query, newTags)
  }

  return (
    <div ref={searchRef} className="relative w-full max-w-lg">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Search articles..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          {isLoading && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>

        {/* Selected Tags */}
        {selectedTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedTags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </form>

      {/* Search Results Dropdown */}
      {showResults && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {results.length > 0 ? (
            <>
              <div className="p-2">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Articles</h3>
                {results.map(result => (
                  <Link
                    key={result.slug}
                    href={`/blog/${result.slug}`}
                    className="block p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded"
                    onClick={() => setShowResults(false)}
                  >
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">{result.title}</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{result.excerpt}</p>
                    <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                      <span>{result.author}</span>
                      <span className="mx-1">•</span>
                      <span>{new Date(result.date).toLocaleDateString()}</span>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Tag Suggestions */}
              {availableTags.length > 0 && (
                <div className="border-t border-gray-200 dark:border-gray-700 p-2">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-1">
                    {availableTags.slice(0, 8).map(tag => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                          selectedTags.includes(tag)
                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t border-gray-200 dark:border-gray-700 p-2">
                <button
                  onClick={handleSearch}
                  className="w-full text-left text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                >
                  View all results →
                </button>
              </div>
            </>
          ) : query.trim() || selectedTags.length > 0 ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              No results found
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}