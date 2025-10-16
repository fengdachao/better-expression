'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Config, StorageAdapter } from '@better-sentence/core'
import { DEFAULT_CONFIG, ConfigSchema } from '@better-sentence/core'

export interface UseConfigOptions {
  storage: StorageAdapter
  onConfigChange?: (config: Config) => void
}

export interface UseConfigReturn {
  config: Partial<Config>
  loading: boolean
  error: string | null
  updateConfig: (updates: Partial<Config>) => Promise<void>
  resetConfig: () => Promise<void>
  testConnection: () => Promise<boolean>
}

const STORAGE_KEY = 'better-sentence-config'

export function useConfig({
  storage,
  onConfigChange
}: UseConfigOptions): UseConfigReturn {
  const [config, setConfig] = useState<Partial<Config>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load config from storage on mount
  useEffect(() => {
    loadConfig()
  }, [])

  const loadConfig = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const storedConfig = await storage.get<Config>(STORAGE_KEY)
      
      // Check for environment variable API key (only in browser)
      let envApiKey: string | undefined
      if (typeof window !== 'undefined' && typeof process !== 'undefined' && process.env) {
        // In Next.js client components, only NEXT_PUBLIC_ prefixed env vars are available
        envApiKey = process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY
        console.log('Environment API key found:', envApiKey ? 'Yes' : 'No')
        console.log('Full process.env:', process.env)
        console.log('NEXT_PUBLIC_DEEPSEEK_API_KEY:', process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY)
      }
      
      // Merge config with priority: stored config > env variable > defaults
      const mergedConfig = { 
        ...DEFAULT_CONFIG, 
        ...(envApiKey ? { apiKey: envApiKey } : {}),
        ...storedConfig 
      }
      
      setConfig(mergedConfig)
    } catch (err) {
      setError('Failed to load configuration')
      console.error('Error loading config:', err)
    } finally {
      setLoading(false)
    }
  }, [storage])

  const updateConfig = useCallback(async (updates: Partial<Config>) => {
    try {
      setError(null)
      
      const newConfig = { ...config, ...updates }
      
      // Validate the config if it has required fields
      if (newConfig.apiKey) {
        try {
          ConfigSchema.parse(newConfig)
        } catch (validationError) {
          throw new Error('Invalid configuration')
        }
      }
      
      // Save to storage
      await storage.set(STORAGE_KEY, newConfig)
      
      // Update local state
      setConfig(newConfig)
      
      // Notify listeners
      if (newConfig.apiKey) {
        onConfigChange?.(newConfig as Config)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save configuration'
      setError(errorMessage)
      throw err
    }
  }, [config, storage, onConfigChange])

  const resetConfig = useCallback(async () => {
    try {
      setError(null)
      
      await storage.remove(STORAGE_KEY)
      setConfig(DEFAULT_CONFIG)
    } catch (err) {
      setError('Failed to reset configuration')
      throw err
    }
  }, [storage])

  const testConnection = useCallback(async (): Promise<boolean> => {
    try {
      if (!config.apiKey) {
        throw new Error('API key is required')
      }

      // Import the provider dynamically to avoid circular dependencies
      const { createDeepSeekProvider } = await import('@better-sentence/core')
      
      const provider = createDeepSeekProvider({
        apiKey: config.apiKey,
        model: config.model || 'deepseek'
      })

      return await provider.checkConnection()
    } catch (err) {
      console.error('Connection test failed:', err)
      return false
    }
  }, [config])

  return {
    config,
    loading,
    error,
    updateConfig,
    resetConfig,
    testConnection
  }
}
