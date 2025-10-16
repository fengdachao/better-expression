import type { StorageAdapter } from '@better-sentence/core'

/**
 * LocalStorage适配器实现
 * 用于Web端的配置和数据存储
 */
export class LocalStorageAdapter implements StorageAdapter {
  async get<T>(key: string): Promise<T | null> {
    try {
      if (typeof window === 'undefined') {
        return null
      }
      
      const value = localStorage.getItem(key)
      return value ? JSON.parse(value) : null
    } catch (error) {
      console.error(`Error getting item from localStorage (${key}):`, error)
      return null
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    try {
      if (typeof window === 'undefined') {
        return
      }
      
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`Error setting item in localStorage (${key}):`, error)
      throw error
    }
  }

  async remove(key: string): Promise<void> {
    try {
      if (typeof window === 'undefined') {
        return
      }
      
      localStorage.removeItem(key)
    } catch (error) {
      console.error(`Error removing item from localStorage (${key}):`, error)
      throw error
    }
  }

  async clear(): Promise<void> {
    try {
      if (typeof window === 'undefined') {
        return
      }
      
      // Only clear our app's keys to avoid affecting other apps
      const keysToRemove: string[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith('better-sentence-')) {
          keysToRemove.push(key)
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key))
    } catch (error) {
      console.error('Error clearing localStorage:', error)
      throw error
    }
  }
}
