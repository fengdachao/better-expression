import { z } from 'zod'

// 支持的AI模型
export type AIModel = 'deepseek'

// 优化风格选项
export type ImprovementStyle = 'formal' | 'academic' | 'business' | 'casual'

// 英语变体（固定为美式）
export type EnglishVariant = 'american'

// 改写选项
export const ImproveOptionsSchema = z.object({
  style: z.enum(['formal', 'academic', 'business', 'casual']).default('casual'),
  variant: z.enum(['american']).default('american'),
  temperature: z.number().min(0).max(2).default(0.3)
})

export type ImproveOptions = z.infer<typeof ImproveOptionsSchema>

// 改写结果
export const ImproveResultSchema = z.object({
  improved: z.string(),
  explanation: z.string(),
  changes: z.array(z.object({
    original: z.string(),
    improved: z.string(),
    reason: z.string()
  })).optional()
})

export type ImproveResult = z.infer<typeof ImproveResultSchema>

// AI Provider配置
export const ProviderConfigSchema = z.object({
  apiKey: z.string().min(1, 'API Key is required'),
  model: z.enum(['deepseek']).default('deepseek'),
  baseUrl: z.string().url().optional()
})

export type ProviderConfig = z.infer<typeof ProviderConfigSchema>

// 应用配置
export const ConfigSchema = z.object({
  apiKey: z.string().min(1, 'API Key is required'),
  model: z.enum(['deepseek']).default('deepseek'),
  defaultStyle: z.enum(['formal', 'academic', 'business', 'casual']).default('casual'),
  temperature: z.number().min(0).max(2).default(0.3),
  variant: z.enum(['american']).default('american')
})

export type Config = z.infer<typeof ConfigSchema>

// 默认配置在 defaults.ts 中定义

// 历史记录项
export const HistoryItemSchema = z.object({
  id: z.string(),
  originalText: z.string(),
  improvedText: z.string(),
  explanation: z.string(),
  style: z.enum(['formal', 'academic', 'business', 'casual']),
  timestamp: z.number()
})

export type HistoryItem = z.infer<typeof HistoryItemSchema>

// API错误类型
export class APIError extends Error {
  constructor(
    message: string,
    public code?: string,
    public status?: number
  ) {
    super(message)
    this.name = 'APIError'
  }
}

// 配置错误类型
export class ConfigError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ConfigError'
  }
}

// 验证错误类型
export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}
