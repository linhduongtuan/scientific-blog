import { useState, useEffect, useCallback } from 'react'

export interface UseApiOptions {
  immediate?: boolean
  onError?: (error: Error) => void
  onSuccess?: (data: any) => void
}

export interface UseApiReturn<T> {
  data: T | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  reset: () => void
}

export function useApi<T = any>(
  url: string | null,
  options: UseApiOptions = {}
): UseApiReturn<T> {
  const { immediate = true, onError, onSuccess } = options
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    if (!url) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      setData(result)
      onSuccess?.(result)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      onError?.(err instanceof Error ? err : new Error(errorMessage))
    } finally {
      setLoading(false)
    }
  }, [url, onError, onSuccess])

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setLoading(false)
  }, [])

  useEffect(() => {
    if (immediate && url) {
      fetchData()
    }
  }, [fetchData, immediate, url])

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    reset,
  }
}
