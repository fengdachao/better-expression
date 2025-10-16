/**
 * 存储抽象接口
 * 不同平台需要实现此接口：
 * - Web: LocalStorageAdapter
 * - Extension: ChromeStorageAdapter  
 * - Desktop: ElectronStoreAdapter
 */
export interface StorageAdapter {
  get<T>(key: string): Promise<T | null>
  set<T>(key: string, value: T): Promise<void>
  remove(key: string): Promise<void>
  clear(): Promise<void>
}

/**
 * 存储键名常量
 */
export const STORAGE_KEYS = {
  CONFIG: 'better-sentence-config',
  HISTORY: 'better-sentence-history',
  SETTINGS: 'better-sentence-settings'
} as const

/**
 * 内存存储适配器（用于测试）
 */
export class MemoryStorageAdapter implements StorageAdapter {
  private storage = new Map<string, any>()

  async get<T>(key: string): Promise<T | null> {
    return this.storage.get(key) || null
  }

  async set<T>(key: string, value: T): Promise<void> {
    this.storage.set(key, value)
  }

  async remove(key: string): Promise<void> {
    this.storage.delete(key)
  }

  async clear(): Promise<void> {
    this.storage.clear()
  }
}
