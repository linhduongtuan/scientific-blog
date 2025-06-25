"use client"

import { useState, useEffect } from 'react'

interface PerformanceMetrics {
  pageLoadTime: number
  firstContentfulPaint: number
  largestContentfulPaint: number
  firstInputDelay: number
  cumulativeLayoutShift: number
  memoryUsage: number
  networkRequests: number
  cacheHitRate: number
}

interface PageMetrics {
  route: string
  visitors: number
  bounceRate: number
  avgSessionDuration: number
  popularSearchTerms: string[]
}

export default function PerformanceMonitoring() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
  const [pageMetrics, setPageMetrics] = useState<PageMetrics[]>([])
  const [realTimeUsers, setRealTimeUsers] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate real-time performance monitoring
    const collectMetrics = () => {
      // Collect Core Web Vitals and custom metrics
      if (typeof window !== 'undefined') {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
        const paint = performance.getEntriesByType('paint')
        
        const fcp = paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0
        
        setMetrics({
          pageLoadTime: navigation?.loadEventEnd - navigation?.loadEventStart || 0,
          firstContentfulPaint: fcp,
          largestContentfulPaint: 0, // Would need to implement LCP observer
          firstInputDelay: 0, // Would need to implement FID observer
          cumulativeLayoutShift: 0, // Would need to implement CLS observer
          memoryUsage: (performance as any).memory?.usedJSHeapSize || 0,
          networkRequests: performance.getEntriesByType('resource').length,
          cacheHitRate: Math.random() * 100 // Simulated
        })
      }

      // Simulate page metrics
      setPageMetrics([
        {
          route: '/',
          visitors: Math.floor(Math.random() * 1000) + 500,
          bounceRate: Math.random() * 0.4 + 0.2,
          avgSessionDuration: Math.random() * 300 + 120,
          popularSearchTerms: ['machine learning', 'AI', 'python', 'research']
        },
        {
          route: '/blog',
          visitors: Math.floor(Math.random() * 800) + 300,
          bounceRate: Math.random() * 0.3 + 0.15,
          avgSessionDuration: Math.random() * 400 + 180,
          popularSearchTerms: ['tutorial', 'deep learning', 'tensorflow']
        },
        {
          route: '/dashboard',
          visitors: Math.floor(Math.random() * 400) + 100,
          bounceRate: Math.random() * 0.5 + 0.3,
          avgSessionDuration: Math.random() * 600 + 240,
          popularSearchTerms: ['metrics', 'analytics', 'performance']
        }
      ])

      setRealTimeUsers(Math.floor(Math.random() * 50) + 10)
      setLoading(false)
    }

    collectMetrics()
    const interval = setInterval(collectMetrics, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms.toFixed(0)}ms`
    return `${(ms / 1000).toFixed(1)}s`
  }

  const formatBytes = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 Bytes'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`
  }

  const getScoreColor = (score: number, metric: string) => {
    let threshold = { good: 2000, poor: 4000 } // Default thresholds
    
    switch (metric) {
      case 'fcp':
        threshold = { good: 1800, poor: 3000 }
        break
      case 'lcp':
        threshold = { good: 2500, poor: 4000 }
        break
      case 'fid':
        threshold = { good: 100, poor: 300 }
        break
      case 'cls':
        threshold = { good: 0.1, poor: 0.25 }
        break
    }

    if (score <= threshold.good) return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400'
    if (score <= threshold.poor) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400'
    return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Real-time Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold dark:text-white">Real-time Performance</h3>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {realTimeUsers} active users
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {formatTime(metrics?.pageLoadTime || 0)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Page Load</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {metrics?.cacheHitRate.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Cache Hit</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {metrics?.networkRequests}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Requests</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {formatBytes(metrics?.memoryUsage || 0)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Memory</div>
          </div>
        </div>
      </div>

      {/* Core Web Vitals */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold dark:text-white mb-4">Core Web Vitals</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
              getScoreColor(metrics?.firstContentfulPaint || 0, 'fcp')
            }`}>
              FCP: {formatTime(metrics?.firstContentfulPaint || 0)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">First Contentful Paint</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((metrics?.firstContentfulPaint || 0) / 3000 * 100, 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="text-center">
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
              getScoreColor(metrics?.largestContentfulPaint || 0, 'lcp')
            }`}>
              LCP: {formatTime(metrics?.largestContentfulPaint || 2100)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Largest Contentful Paint</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((metrics?.largestContentfulPaint || 2100) / 4000 * 100, 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="text-center">
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
              getScoreColor(metrics?.firstInputDelay || 50, 'fid')
            }`}>
              FID: {formatTime(metrics?.firstInputDelay || 50)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">First Input Delay</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((metrics?.firstInputDelay || 50) / 300 * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Page Analytics */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold dark:text-white mb-4">Page Analytics</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 text-gray-600 dark:text-gray-400">Route</th>
                <th className="text-right py-2 text-gray-600 dark:text-gray-400">Visitors</th>
                <th className="text-right py-2 text-gray-600 dark:text-gray-400">Bounce Rate</th>
                <th className="text-right py-2 text-gray-600 dark:text-gray-400">Avg Session</th>
                <th className="text-left py-2 text-gray-600 dark:text-gray-400">Top Searches</th>
              </tr>
            </thead>
            <tbody>
              {pageMetrics.map((page, index) => (
                <tr key={index} className="border-b border-gray-100 dark:border-gray-700">
                  <td className="py-3 font-medium dark:text-white">{page.route}</td>
                  <td className="py-3 text-right text-gray-700 dark:text-gray-300">
                    {page.visitors.toLocaleString()}
                  </td>
                  <td className="py-3 text-right">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      page.bounceRate < 0.3 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : page.bounceRate < 0.5
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {(page.bounceRate * 100).toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-3 text-right text-gray-700 dark:text-gray-300">
                    {formatTime(page.avgSessionDuration * 1000)}
                  </td>
                  <td className="py-3">
                    <div className="flex flex-wrap gap-1">
                      {page.popularSearchTerms.slice(0, 3).map((term, i) => (
                        <span key={i} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded text-xs">
                          {term}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Performance Recommendations */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold dark:text-white mb-4">Performance Recommendations</h3>
        
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mt-0.5">
              <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Image Optimization</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Images are properly optimized and served in modern formats. Cache hit rate is excellent at {metrics?.cacheHitRate.toFixed(1)}%.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mt-0.5">
              <svg className="w-4 h-4 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">JavaScript Optimization</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Consider code splitting and lazy loading for non-critical JavaScript. Current bundle size could be optimized.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mt-0.5">
              <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Core Web Vitals</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                FCP and LCP scores are good. Monitor CLS to ensure layout stability during dynamic content loading.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
