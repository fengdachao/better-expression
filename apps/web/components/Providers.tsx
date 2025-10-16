'use client'

import { ReactNode, useMemo } from 'react'
import { AppProvider } from '@better-sentence/ui'
import { LocalStorageAdapter } from '../lib/storage-adapter'

export function Providers({ children }: { children: ReactNode }) {
  const storage = useMemo(() => new LocalStorageAdapter(), [])

  return <AppProvider storage={storage}>{children}</AppProvider>
}
