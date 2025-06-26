// Error handling utilities
import React from 'react'
import ErrorBoundary from '@/app/components/ErrorBoundary'

export class AppError extends Error {
  public readonly statusCode: number
  public readonly isOperational: boolean

  constructor(message: string, statusCode: number = 500, isOperational = true) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational
    
    Error.captureStackTrace(this, this.constructor)
  }
}

export const handleAsyncError = <T extends unknown[], R>(
  fn: (...args: T) => Promise<R>
) => {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args)
    } catch (error) {
      console.error('Async operation failed:', error)
      throw error instanceof AppError ? error : new AppError('Internal server error')
    }
  }
}

export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>
) => {
  return function WithErrorBoundaryWrapper(props: P) {
    return React.createElement(
      ErrorBoundary,
      {
        fallback: fallback ? React.createElement(fallback, { error: new Error(), resetError: () => {} }) : undefined,
        children: React.createElement(Component, props)
      }
    )
  }
}
