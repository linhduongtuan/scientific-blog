"use client"

import { Suspense } from 'react'
import SearchBar from './SearchBar'

function SearchBarFallback() {
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    </div>
  )
}

export default function SearchBarWrapper() {
  return (
    <Suspense fallback={<SearchBarFallback />}>
      <SearchBar />
    </Suspense>
  )
}
