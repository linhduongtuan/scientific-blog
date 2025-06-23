"use client"

import { Suspense } from 'react'
import SearchResults from './SearchResults'

function SearchResultsFallback() {
  return (
    <div className="space-y-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        </div>
      ))}
    </div>
  )
}

export default function SearchResultsWrapper() {
  return (
    <Suspense fallback={<SearchResultsFallback />}>
      <SearchResults />
    </Suspense>
  )
}
