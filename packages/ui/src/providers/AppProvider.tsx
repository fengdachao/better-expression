'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import type { StorageAdapter } from '@better-sentence/core'

export interface AppContextValue {
  storage: StorageAdapter
}

const AppContext = createContext<AppContextValue | null>(null)

export interface AppProviderProps {
  storage: StorageAdapter
  children: ReactNode
}

export function AppProvider({ storage, children }: AppProviderProps) {
  const value: AppContextValue = {
    storage
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext(): AppContextValue {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}

// Convenience hook to get storage
export function useStorage(): StorageAdapter {
  const { storage } = useAppContext()
  return storage
}
