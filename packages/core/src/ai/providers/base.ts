import type { ImproveOptions, ImproveResult, ProviderConfig } from '../../config/types'

/**
 * AI Provider抽象接口
 * 所有AI模型都需要实现此接口
 */
export interface AIProvider {
  /**
   * 改写文本
   * @param text 原始文本
   * @param options 改写选项
   * @returns 改写结果
   */
  improve(text: string, options: ImproveOptions): Promise<ImproveResult>

  /**
   * 验证配置是否有效
   * @param config Provider配置
   * @returns 是否有效
   */
  validateConfig(config: ProviderConfig): boolean

  /**
   * 估算token使用量
   * @param text 文本
   * @returns 预估token数量
   */
  estimateTokens(text: string): number

  /**
   * 检查API连接状态
   * @returns 是否连接正常
   */
  checkConnection(): Promise<boolean>
}

/**
 * Provider工厂函数类型
 */
export type ProviderFactory = (config: ProviderConfig) => AIProvider

/**
 * Provider注册表
 */
export const PROVIDERS: Record<string, ProviderFactory> = {}

/**
 * 注册Provider
 */
export function registerProvider(name: string, factory: ProviderFactory): void {
  PROVIDERS[name] = factory
}

/**
 * 创建Provider实例
 */
export function createProvider(name: string, config: ProviderConfig): AIProvider {
  const factory = PROVIDERS[name]
  if (!factory) {
    throw new Error(`Unknown provider: ${name}`)
  }
  return factory(config)
}
