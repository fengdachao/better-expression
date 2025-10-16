import type { AIProvider } from './providers/base'
import type { ImproveOptions, ImproveResult, Config } from '../config/types'
import { createProvider } from './providers/base'
import { ValidationError } from '../config/types'

/**
 * 文本改写引擎配置
 */
export interface ImproverConfig {
  provider: AIProvider
  defaultOptions: ImproveOptions
}

/**
 * 核心文本改写引擎
 * 平台无关的业务逻辑
 */
export class TextImprover {
  private provider: AIProvider
  private defaultOptions: ImproveOptions

  constructor(config: ImproverConfig) {
    this.provider = config.provider
    this.defaultOptions = config.defaultOptions
  }

  /**
   * 改写文本
   */
  async improve(
    text: string, 
    options?: Partial<ImproveOptions>
  ): Promise<ImproveResult> {
    // 验证输入
    this.validateInput(text)
    
    // 合并选项
    const finalOptions: ImproveOptions = {
      ...this.defaultOptions,
      ...options
    }

    // 调用AI Provider
    const result = await this.provider.improve(text, finalOptions)
    
    // 验证结果
    this.validateResult(result)
    
    return result
  }

  /**
   * 批量改写（未来功能）
   */
  async improveBatch(
    texts: string[], 
    options?: Partial<ImproveOptions>
  ): Promise<ImproveResult[]> {
    const results: ImproveResult[] = []
    
    for (const text of texts) {
      const result = await this.improve(text, options)
      results.push(result)
    }
    
    return results
  }

  /**
   * 估算token使用量
   */
  estimateTokens(text: string): number {
    return this.provider.estimateTokens(text)
  }

  /**
   * 检查Provider连接状态
   */
  async checkConnection(): Promise<boolean> {
    return this.provider.checkConnection()
  }

  /**
   * 验证输入文本
   */
  private validateInput(text: string): void {
    if (!text || typeof text !== 'string') {
      throw new ValidationError('Text must be a non-empty string')
    }

    const trimmed = text.trim()
    if (!trimmed) {
      throw new ValidationError('Text cannot be empty or whitespace only')
    }

    if (trimmed.length < 3) {
      throw new ValidationError('Text is too short (minimum 3 characters)')
    }

    if (trimmed.length > 2000) {
      throw new ValidationError('Text is too long (maximum 2000 characters)')
    }

    // 检查是否包含基本的英文字符
    const hasEnglish = /[a-zA-Z]/.test(trimmed)
    if (!hasEnglish) {
      throw new ValidationError('Text must contain English characters')
    }
  }

  /**
   * 验证改写结果
   */
  private validateResult(result: ImproveResult): void {
    if (!result.improved || !result.explanation) {
      throw new ValidationError('Invalid improvement result')
    }

    if (result.improved.trim().length === 0) {
      throw new ValidationError('Improved text cannot be empty')
    }

    if (result.explanation.trim().length === 0) {
      throw new ValidationError('Explanation cannot be empty')
    }
  }
}

/**
 * 创建TextImprover实例的工厂函数
 */
export function createTextImprover(config: Config): TextImprover {
  const provider = createProvider(config.model, {
    apiKey: config.apiKey,
    model: config.model
  })

  const defaultOptions: ImproveOptions = {
    style: config.defaultStyle,
    variant: config.variant,
    temperature: config.temperature
  }

  return new TextImprover({
    provider,
    defaultOptions
  })
}
