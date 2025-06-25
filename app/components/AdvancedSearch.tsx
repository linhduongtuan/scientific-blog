"use client"

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

interface AdvancedSearchProps {
  onSearchAction: (query: string, filters: SearchFilters) => void
  placeholder?: string
}

interface SearchFilters {
  tags: string[]
  dateRange: { start: string; end: string }
  contentType: string[]
  difficulty: string[]
  readingTime: { min: number; max: number }
  author: string[]
}

export default function AdvancedSearch({ onSearchAction, placeholder = "Search articles, research, and topics..." }: AdvancedSearchProps) {
  const [query, setQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({
    tags: [],
    dateRange: { start: '', end: '' },
    contentType: [],
    difficulty: [],
    readingTime: { min: 0, max: 60 },
    author: []
  })
  const [savedSearches, setSavedSearches] = useState<string[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const filtersRef = useRef<HTMLDivElement>(null)

  const availableTags = [
    'AI', 'Machine Learning', 'Deep Learning', 'Python', 'Research',
    'Data Science', 'Computer Vision', 'NLP', 'Statistics', 'Biology',
    'Medical Imaging', 'TensorFlow', 'PyTorch', 'Scientific Computing'
  ]

  const availableAuthors = [
    'Linh Duong Tuan', 'Guest Authors', 'Collaborators'
  ]

  const contentTypes = [
    'Research Paper', 'Tutorial', 'Review', 'Case Study', 'Technical Guide'
  ]

  const difficultyLevels = [
    'Beginner', 'Intermediate', 'Advanced', 'Expert'
  ]

  useEffect(() => {
    // Load saved searches from localStorage
    const saved = localStorage.getItem('savedSearches')
    if (saved) setSavedSearches(JSON.parse(saved))

    const recent = localStorage.getItem('recentSearches')
    if (recent) setRecentSearches(JSON.parse(recent))
  }, [])

  const handleSearch = () => {
    if (query.trim()) {
      // Add to recent searches
      const updatedRecent = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5)
      setRecentSearches(updatedRecent)
      localStorage.setItem('recentSearches', JSON.stringify(updatedRecent))

      onSearchAction(query, filters)
    }
  }

  const saveSearch = () => {
    const searchString = `${query} | ${Object.entries(filters)
      .filter(([key, value]) => {
        if (Array.isArray(value)) return value.length > 0
        if (typeof value === 'object') return Object.values(value).some(v => v)
        return value
      })
      .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(',') : JSON.stringify(value)}`)
      .join(' | ')}`
    
    const updatedSaved = [...savedSearches, searchString].slice(0, 10)
    setSavedSearches(updatedSaved)
    localStorage.setItem('savedSearches', JSON.stringify(updatedSaved))
  }

  const handleTagToggle = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }))
  }

  const handleFilterChange = (filterType: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
  }

  const clearFilters = () => {
    setFilters({
      tags: [],
      dateRange: { start: '', end: '' },
      contentType: [],
      difficulty: [],
      readingTime: { min: 0, max: 60 },
      author: []
    })
  }

  const isFiltered = Object.values(filters).some(value => {
    if (Array.isArray(value)) return value.length > 0
    if (typeof value === 'object') return Object.values(value).some(v => v)
    return false
  })

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Main Search Bar */}
      <div className="relative">
        <div className="flex items-center bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm">
          <div className="flex-1 flex items-center">
            <svg className="w-5 h-5 text-gray-400 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder={placeholder}
              className="w-full px-3 py-3 bg-transparent border-none focus:outline-none dark:text-white"
            />
          </div>
          
          <div className="flex items-center space-x-2 pr-3">
            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-md transition-colors ${
                isFiltered 
                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
              title="Advanced Filters"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
            </button>

            {/* Save Search */}
            <button
              onClick={saveSearch}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-md transition-colors"
              title="Save Search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div 
          ref={filtersRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-6 z-50"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium dark:text-white">Advanced Filters</h3>
            <div className="flex space-x-2">
              <button
                onClick={clearFilters}
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                Clear All
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {availableTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                      filters.tags.includes(tag)
                        ? 'bg-blue-100 border-blue-300 text-blue-700 dark:bg-blue-900/30 dark:border-blue-600 dark:text-blue-400'
                        : 'bg-gray-100 border-gray-300 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Content Type
              </label>
              <div className="space-y-2">
                {contentTypes.map(type => (
                  <label key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.contentType.includes(type)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleFilterChange('contentType', [...filters.contentType, type])
                        } else {
                          handleFilterChange('contentType', filters.contentType.filter(t => t !== type))
                        }
                      }}
                      className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Difficulty Level
              </label>
              <div className="space-y-2">
                {difficultyLevels.map(level => (
                  <label key={level} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.difficulty.includes(level)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleFilterChange('difficulty', [...filters.difficulty, level])
                        } else {
                          handleFilterChange('difficulty', filters.difficulty.filter(d => d !== level))
                        }
                      }}
                      className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{level}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date Range
              </label>
              <div className="space-y-2">
                <input
                  type="date"
                  value={filters.dateRange.start}
                  onChange={(e) => handleFilterChange('dateRange', { ...filters.dateRange, start: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 dark:text-white"
                  placeholder="Start date"
                />
                <input
                  type="date"
                  value={filters.dateRange.end}
                  onChange={(e) => handleFilterChange('dateRange', { ...filters.dateRange, end: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 dark:text-white"
                  placeholder="End date"
                />
              </div>
            </div>

            {/* Reading Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Reading Time (minutes)
              </label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="60"
                  value={filters.readingTime.max}
                  onChange={(e) => handleFilterChange('readingTime', { ...filters.readingTime, max: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>0 min</span>
                  <span>{filters.readingTime.max} min</span>
                  <span>60+ min</span>
                </div>
              </div>
            </div>

            {/* Author */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Author
              </label>
              <select
                value={filters.author[0] || ''}
                onChange={(e) => handleFilterChange('author', e.target.value ? [e.target.value] : [])}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Authors</option>
                {availableAuthors.map(author => (
                  <option key={author} value={author}>{author}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Applied Filters Summary */}
          {isFiltered && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap gap-2">
                {filters.tags.map(tag => (
                  <span key={tag} className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
                    {tag}
                    <button
                      onClick={() => handleTagToggle(tag)}
                      className="ml-1 text-blue-500 hover:text-blue-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {filters.contentType.map(type => (
                  <span key={type} className="inline-flex items-center px-2 py-1 text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full">
                    {type}
                    <button
                      onClick={() => handleFilterChange('contentType', filters.contentType.filter(t => t !== type))}
                      className="ml-1 text-green-500 hover:text-green-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Recent and Saved Searches */}
      {(recentSearches.length > 0 || savedSearches.length > 0) && !showFilters && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          {recentSearches.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Recent Searches</h4>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => setQuery(search)}
                    className="px-3 py-1 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}

          {savedSearches.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Saved Searches</h4>
              <div className="space-y-1">
                {savedSearches.slice(0, 3).map((search, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      const [queryPart] = search.split(' | ')
                      setQuery(queryPart)
                    }}
                    className="block w-full text-left px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 truncate"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
