"use client"

import React, { useState, useEffect } from 'react'

// Simplified component for testing
export default function SimpleLabNotebook() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        📝 Digital Lab Notebook (Simplified)
      </h2>
      <div className="p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center">
        <p className="text-gray-600 dark:text-gray-400">
          Digital Lab Notebook component loaded successfully!
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
          This is a simplified version to test module loading.
        </p>
      </div>
    </div>
  )
}
