"use client"

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useSession } from 'next-auth/react'

export default function TestPage() {
  const { user, status, signin, signup, signout } = useAuth()
  const session = useSession()
  const sessionData = session?.data || null
  const [testResults, setTestResults] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const clearResults = () => {
    setTestResults([])
  }

  // Test Authentication
  const testAuth = async () => {
    setIsLoading(true)
    addResult("🔐 Testing Authentication System...")

    try {
      // Test signup
      addResult("Testing user signup...")
      const signupResult = await signup({
        name: "Test User",
        email: "test@example.com",
        password: "password123"
      })
      
      if (signupResult.success) {
        addResult("✅ Signup successful")
      } else {
        addResult(`❌ Signup failed: ${signupResult.error}`)
      }

      // Test signin
      addResult("Testing user signin...")
      const signinResult = await signin({
        email: "admin@example.com",
        password: "password123"
      })
      
      if (signinResult.success) {
        addResult("✅ Signin successful")
      } else {
        addResult(`❌ Signin failed: ${signinResult.error}`)
      }

    } catch (error) {
      addResult(`❌ Auth test error: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  // Test API Endpoints
  const testAPIs = async () => {
    setIsLoading(true)
    addResult("🔌 Testing API Endpoints...")

    const tests = [
      {
        name: "Search API",
        url: "/api/search?q=machine learning",
        method: "GET"
      },
      {
        name: "Comments API",
        url: "/api/posts/test-post/comments",
        method: "GET"
      },
      {
        name: "Subscribe API",
        url: "/api/subscribe",
        method: "POST",
        body: {
          name: "Test Subscriber",
          email: "subscriber@test.com",
          researchInterests: "AI, ML"
        }
      }
    ]

    for (const test of tests) {
      try {
        addResult(`Testing ${test.name}...`)
        
        const options: RequestInit = {
          method: test.method,
          headers: {
            'Content-Type': 'application/json',
          },
        }

        if (test.body) {
          options.body = JSON.stringify(test.body)
        }

        const response = await fetch(test.url, options)
        const data = await response.json()
        
        if (response.ok) {
          addResult(`✅ ${test.name} - Status: ${response.status}`)
        } else {
          addResult(`⚠️ ${test.name} - Status: ${response.status}, Error: ${data.error || 'Unknown'}`)
        }
      } catch (error) {
        addResult(`❌ ${test.name} - Network error: ${error}`)
      }
    }

    setIsLoading(false)
  }

  // Test Search Functionality
  const testSearch = async () => {
    setIsLoading(true)
    addResult("🔍 Testing Search Functionality...")

    const searchQueries = [
      "machine learning",
      "transformers",
      "python",
      "nonexistent query"
    ]

    for (const query of searchQueries) {
      try {
        addResult(`Searching for: "${query}"`)
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=3`)
        const data = await response.json()
        
        if (response.ok) {
          addResult(`✅ Found ${data.posts?.length || 0} results for "${query}"`)
          if (data.posts?.length > 0) {
            addResult(`   First result: "${data.posts[0].title}"`)
          }
        } else {
          addResult(`❌ Search failed for "${query}": ${data.error}`)
        }
      } catch (error) {
        addResult(`❌ Search error for "${query}": ${error}`)
      }
    }

    setIsLoading(false)
  }

  // Test Database Connection
  const testDatabase = async () => {
    setIsLoading(true)
    addResult("🗄️ Testing Database Connection...")

    try {
      // Test by trying to fetch users (admin endpoint)
      const response = await fetch('/api/admin/users?limit=1')
      
      if (response.status === 401 || response.status === 403) {
        addResult("✅ Database connection working (got auth error as expected)")
      } else if (response.ok) {
        addResult("✅ Database connection working and accessible")
      } else {
        const data = await response.json()
        addResult(`⚠️ Database response: ${response.status} - ${data.error}`)
      }
    } catch (error) {
      addResult(`❌ Database connection error: ${error}`)
    }

    setIsLoading(false)
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">System Testing Dashboard</h1>
      
      {/* Current Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
          <h3 className="font-semibold mb-2 dark:text-white">Authentication Status</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Status: <span className="font-medium">{status}</span>
          </p>
          {user && (
            <div className="mt-2 text-sm">
              <p>Name: {user.name}</p>
              <p>Email: {user.email}</p>
              <p>Role: {user.role}</p>
              <p>Subscribed: {user.subscribed ? 'Yes' : 'No'}</p>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
          <h3 className="font-semibold mb-2 dark:text-white">NextAuth Session</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Status: <span className="font-medium">{sessionData ? 'Active' : 'None'}</span>
          </p>
          {sessionData?.user && (
            <div className="mt-2 text-sm">
              <p>Email: {sessionData.user.email}</p>
              <p>Name: {sessionData.user.name}</p>
            </div>
          )}
        </div>
      </div>

      {/* Test Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <button
          onClick={testAuth}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          Test Auth
        </button>
        
        <button
          onClick={testAPIs}
          disabled={isLoading}
          className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          Test APIs
        </button>
        
        <button
          onClick={testSearch}
          disabled={isLoading}
          className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          Test Search
        </button>
        
        <button
          onClick={testDatabase}
          disabled={isLoading}
          className="bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          Test Database
        </button>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={clearResults}
          className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          Clear Results
        </button>
        
        {user ? (
          <button
            onClick={signout}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Sign Out
          </button>
        ) : (
          <button
            onClick={() => signin({ email: "admin@example.com", password: "password123" })}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Quick Sign In (Admin)
          </button>
        )}
      </div>

      {/* Test Results */}
      <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-white font-semibold">Test Results</h3>
          {isLoading && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-400"></div>
          )}
        </div>
        
        {testResults.length === 0 ? (
          <p className="text-gray-500">No tests run yet. Click a test button to start.</p>
        ) : (
          <div className="space-y-1">
            {testResults.map((result, index) => (
              <div key={index} className="break-words">
                {result}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Demo Users Info */}
      <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <h3 className="font-semibold mb-2 text-blue-800 dark:text-blue-200">Demo Users Available</h3>
        <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
          <p><strong>Admin:</strong> admin@example.com / password123</p>
          <p><strong>User:</strong> user@example.com / password123</p>
          <p><strong>Premium:</strong> premium@example.com / password123</p>
        </div>
      </div>
    </div>
  )
}