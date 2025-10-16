'use client'

import { useState, useCallback } from 'react'
import type { 
  ImproveResult, 
  ImproveOptions, 
  Config, 
  StorageAdapter
} from '@better-sentence/core'
import { APIError, ValidationError } from '@better-sentence/core'
import { createTextImprover } from '@better-sentence/core'
import { useConfig } from './useConfig'

export interface UseImproverOptions {
  storage: StorageAdapter
  onSuccess?: (result: ImproveResult) => void
  onError?: (error: Error) => void
}

export interface UseImproverReturn {
  result: ImproveResult | null
  loading: boolean
  error: string | null
  improve: (text: string, options?: Partial<ImproveOptions>) => Promise<void>
  reset: () => void
}

export function useImprover({
  storage,
  onSuccess,
  onError
}: UseImproverOptions): UseImproverReturn {
  const [result, setResult] = useState<ImproveResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Use useConfig hook to get configuration (includes environment variables)
  const { config, loading: configLoading } = useConfig({ storage })

  const improve = useCallback(async (
    text: string, 
    options?: Partial<ImproveOptions>
  ) => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      // Wait for config to load
      if (configLoading) {
        throw new Error('Configuration is still loading. Please wait.')
      }
      
      if (!config) {
        throw new Error('Please configure your API key in settings first')
      }

      if (!config.apiKey) {
        throw new Error('API key is required. Please check your settings.')
      }

      // Ensure config has all required fields
      if (!config.model || !config.defaultStyle || config.temperature === undefined) {
        throw new Error('Configuration is incomplete. Please check your settings.')
      }

      // Create text improver instance
      const improver = createTextImprover(config as Config)

      // Prepare options with defaults from config
      const improveOptions: ImproveOptions = {
        style: options?.style || config.defaultStyle || 'casual',
        variant: 'american', // Fixed to American English
        temperature: options?.temperature || config.temperature || 0.3
      }

      // Perform improvement
      const improvementResult = await improver.improve(text, improveOptions)
      
      setResult(improvementResult)
      onSuccess?.(improvementResult)

    } catch (err) {
      let errorMessage = 'An unexpected error occurred'

      if (err instanceof ValidationError) {
        errorMessage = err.message
      } else if (err instanceof APIError) {
        switch (err.code) {
          case 'INVALID_API_KEY':
            errorMessage = 'Invalid API key. Please check your settings.'
            break
          case 'RATE_LIMIT':
            errorMessage = 'Rate limit exceeded. Please try again in a moment.'
            break
          case 'INSUFFICIENT_CREDITS':
            errorMessage = 'Insufficient credits. Please add credits to your DeepSeek account.'
            break
          case 'TIMEOUT':
            errorMessage = 'Request timed out. Please try again.'
            break
          default:
            errorMessage = err.message || 'API request failed'
        }
      } else if (err instanceof Error) {
        errorMessage = err.message
      }

      setError(errorMessage)
      onError?.(err instanceof Error ? err : new Error(errorMessage))
    } finally {
      setLoading(false)
    }
  }, [storage, onSuccess, onError])

  const reset = useCallback(() => {
    setResult(null)
    setError(null)
    setLoading(false)
  }, [])

  return {
    result,
    loading,
    error,
    improve,
    reset
  }
}
