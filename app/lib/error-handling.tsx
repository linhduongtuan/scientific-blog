'use client'

import React from 'react'
import ErrorBoundary from '@/app/components/ErrorBoundary'

// Custom error class with better type safety and logging
export class AppError extends Error {
  public readonly statusCode: number
  public readonly isOperational: boolean
  public readonly timestamp: Date
  public readonly context?: Record<string, unknown>

  constructor(
    message: string, 
    statusCode: number = 500, 
    isOperational = true,
    context?: Record<string, unknown>
  ) {
    super(message)
    this.name = 'AppError'
    this.statusCode = statusCode
    this.isOperational = isOperational
    this.timestamp = new Date()
    this.context = context
    
    // Maintain proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }

  // Helper method to convert to JSON for logging/API responses
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      isOperational: this.isOperational,
      timestamp: this.timestamp.toISOString(),
      context: this.context,
      ...(typeof window !== 'undefined' && process.env.NODE_ENV === 'development' && { stack: this.stack })
    }
  }
}

// Predefined common errors
export class ValidationError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 400, true, context)
    this.name = 'ValidationError'
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404, true)
    this.name = 'NotFoundError'
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 401, true)
    this.name = 'UnauthorizedError'
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Access forbidden') {
    super(message, 403, true)
    this.name = 'ForbiddenError'
  }
}

// Enhanced async error handler with better error context
export function handleAsyncError<T extends readonly unknown[], R>(
  fn: (...args: T) => Promise<R>,
  context?: string
) {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args)
    } catch (error) {
      const errorContext = {
        functionName: fn.name || 'anonymous',
        context,
        args: typeof window !== 'undefined' && process.env.NODE_ENV === 'development' ? args : undefined
      }
      
      console.error('Async operation failed:', {
        error: error instanceof Error ? error.message : String(error),
        ...errorContext,
        stack: error instanceof Error ? error.stack : undefined
      })
      
      // Re-throw AppError instances as-is, wrap others
      if (error instanceof AppError) {
        throw error
      }
      
      throw new AppError(
        'Internal server error',
        500,
        false,
        errorContext
      )
    }
  }
}

// Synchronous error handler
export function handleSyncError<T extends readonly unknown[], R>(
  fn: (...args: T) => R,
  context?: string
) {
  return (...args: T): R => {
    try {
      return fn(...args)
    } catch (error) {
      const errorContext = {
        functionName: fn.name || 'anonymous',
        context,
        args: typeof window !== 'undefined' && process.env.NODE_ENV === 'development' ? args : undefined
      }
      
      console.error('Sync operation failed:', {
        error: error instanceof Error ? error.message : String(error),
        ...errorContext
      })
      
      if (error instanceof AppError) {
        throw error
      }
      
      throw new AppError(
        'Internal operation error',
        500,
        false,
        errorContext
      )
    }
  }
}

// Props for error boundary fallback components
export interface ErrorFallbackProps {
  error: Error
  resetErrorAction: () => void
  retry?: () => void
}

// Default error fallback component
export const DefaultErrorFallback: React.FC<ErrorFallbackProps> = ({ 
  error, 
  resetErrorAction 
}) => {
  const isDevelopment = typeof window !== 'undefined' && process.env.NODE_ENV === 'development'
  
  return (
    <div className="min-h-[200px] flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <h2 className="text-xl font-semibold text-red-600 mb-2">
          Something went wrong
        </h2>
        <p className="text-gray-600 mb-4">
          {error instanceof AppError 
            ? error.message 
            : 'An unexpected error occurred'
          }
        </p>
        <button
          onClick={resetErrorAction}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Try again
        </button>
        {isDevelopment && (
          <details className="mt-4 text-left">
            <summary className="cursor-pointer text-sm text-gray-500">
              Error details (dev only)
            </summary>
            <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  )
}

// Enhanced HOC with better prop handling and flexibility
export function withErrorBoundary<P extends Record<string, any>>(
  Component: React.ComponentType<P>,
  options?: {
    fallback?: React.ComponentType<ErrorFallbackProps>
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void
    isolate?: boolean
  }
) {
  const WrappedComponent = React.forwardRef<any, P>((props, ref) => {
    return React.createElement(
      ErrorBoundary,
      {
        fallback: options?.fallback ? React.createElement(options.fallback) : <DefaultErrorFallback error={new AppError('Unknown error')} resetErrorAction={() => {}} />,
        children: React.createElement(Component, { ...(props as P), ...(ref ? { ref } : {}) })
      }
    )
  })

  // Preserve component name for debugging
  WrappedComponent.displayName = `withErrorBoundary(${
    Component.displayName || Component.name || 'Component'
  })`

  return WrappedComponent
}

// Hook for error handling in components
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null)

  const handleError = React.useCallback((error: unknown) => {
    const appError = error instanceof AppError 
      ? error 
      : new AppError(
          error instanceof Error ? error.message : 'Unknown error occurred'
        )
    
    console.error('Component error:', appError.toJSON())
    setError(appError)
  }, [])

  const clearError = React.useCallback(() => {
    setError(null)
  }, [])

  const resetError = React.useCallback(() => {
    setError(null)
  }, [])

  // Throw error to be caught by error boundary if needed
  React.useEffect(() => {
    if (error) {
      throw error
    }
  }, [error])

  return {
    error,
    handleError,
    clearError,
    resetError,
    hasError: error !== null
  }
}

// Utility to check if an error is operational (safe to show to users)
export function isOperationalError(error: unknown): boolean {
  return error instanceof AppError && error.isOperational
}

// Error logging utility
export function logError(error: unknown, context?: Record<string, unknown>) {
  const errorData = {
    timestamp: new Date().toISOString(),
    error: error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack
    } : { message: String(error) },
    context,
    ...(error instanceof AppError && { appError: error.toJSON() })
  }

  console.error('Application Error:', errorData)
  
  // In production, you might want to send this to an error tracking service
  // if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  //   // Send to error tracking service (Sentry, LogRocket, etc.)
  // }
}