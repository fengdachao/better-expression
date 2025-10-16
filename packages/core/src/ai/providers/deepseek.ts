import type { AIProvider } from './base'
import type { ImproveOptions, ImproveResult, ProviderConfig } from '../../config/types'
import { APIError, ValidationError } from '../../config/types'
import { getSystemPrompt, getUserPrompt, validateAIResponse } from '../prompts'
import { DEEPSEEK_CONFIG } from '../../config/defaults'

/**
 * DeepSeek API响应类型
 */
interface DeepSeekResponse {
  choices: Array<{
    message: {
      content: string
      role: string
    }
    finish_reason: string
  }>
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

/**
 * DeepSeek Provider实现
 */
export class DeepSeekProvider implements AIProvider {
  private config: ProviderConfig
  private baseUrl: string

  constructor(config: ProviderConfig) {
    this.config = config
    this.baseUrl = config.baseUrl || DEEPSEEK_CONFIG.baseUrl
    
    if (!this.validateConfig(config)) {
      throw new ValidationError('Invalid DeepSeek configuration')
    }
  }

  async improve(text: string, options: ImproveOptions): Promise<ImproveResult> {
    if (!text.trim()) {
      throw new ValidationError('Text cannot be empty')
    }

    if (text.length > 2000) {
      throw new ValidationError('Text is too long (max 2000 characters)')
    }

    try {
      const systemPrompt = getSystemPrompt(options.style)
      const userPrompt = getUserPrompt(text, options.style)

      const response = await this.callAPI({
        model: DEEPSEEK_CONFIG.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: options.temperature,
        max_tokens: DEEPSEEK_CONFIG.maxTokens,
        response_format: { type: 'json_object' }
      })

      const content = response.choices[0]?.message?.content
      if (!content) {
        throw new APIError('Empty response from DeepSeek API')
      }

      const result = validateAIResponse(content)
      
      return {
        improved: result.improved,
        explanation: result.explanation,
        // TODO: 实现变更检测算法
        changes: []
      }
    } catch (error) {
      if (error instanceof ValidationError || error instanceof APIError) {
        throw error
      }
      
      throw new APIError(
        `DeepSeek API error: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  validateConfig(config: ProviderConfig): boolean {
    return !!(
      config.apiKey &&
      config.apiKey.startsWith('sk-') &&
      config.apiKey.length > 10
    )
  }

  estimateTokens(text: string): number {
    // 粗略估算：1 token ≈ 4 字符（英文）
    return Math.ceil(text.length / 4)
  }

  async checkConnection(): Promise<boolean> {
    try {
      const response = await this.callAPI({
        model: DEEPSEEK_CONFIG.model,
        messages: [{ role: 'user', content: 'Hello' }],
        max_tokens: 10
      })
      
      return response.choices && response.choices.length > 0
    } catch {
      return false
    }
  }

  /**
   * 调用DeepSeek API
   */
  private async callAPI(payload: any): Promise<DeepSeekResponse> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), DEEPSEEK_CONFIG.timeout)

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorText = await response.text()
        let errorMessage = `HTTP ${response.status}`
        
        try {
          const errorData = JSON.parse(errorText)
          errorMessage = errorData.error?.message || errorMessage
        } catch {
          // 忽略JSON解析错误，使用默认错误消息
        }

        // 处理常见错误
        if (response.status === 401) {
          throw new APIError('Invalid API key. Please check your DeepSeek API key.', 'INVALID_API_KEY', 401)
        } else if (response.status === 429) {
          throw new APIError('Rate limit exceeded. Please try again later.', 'RATE_LIMIT', 429)
        } else if (response.status === 402) {
          throw new APIError('Insufficient credits. Please add credits to your DeepSeek account.', 'INSUFFICIENT_CREDITS', 402)
        }

        throw new APIError(errorMessage, 'API_ERROR', response.status)
      }

      const data = await response.json()
      return data as DeepSeekResponse
    } catch (error) {
      clearTimeout(timeoutId)
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new APIError('Request timeout. Please try again.', 'TIMEOUT')
      }
      
      throw error
    }
  }
}

/**
 * 创建DeepSeek Provider实例
 */
export function createDeepSeekProvider(config: ProviderConfig): DeepSeekProvider {
  return new DeepSeekProvider(config)
}
