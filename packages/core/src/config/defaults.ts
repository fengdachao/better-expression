import type { Config, ImprovementStyle } from './types'

/**
 * 默认配置值
 */
export const DEFAULT_CONFIG: Partial<Config> = {
  model: 'deepseek',
  defaultStyle: 'casual',
  temperature: 0.3,
  variant: 'american'
}

/**
 * 风格选项配置
 */
export const STYLE_OPTIONS: Array<{
  value: ImprovementStyle
  label: string
  description: string
}> = [
  {
    value: 'casual',
    label: 'Casual',
    description: 'Relaxed, friendly language for everyday conversations'
  },
  {
    value: 'formal',
    label: 'Formal',
    description: 'Professional language suitable for business contexts'
  },
  {
    value: 'academic',
    label: 'Academic',
    description: 'Scholarly language with precise terminology'
  },
  {
    value: 'business',
    label: 'Business',
    description: 'Professional business language for corporate communication'
  }
]

/**
 * DeepSeek API配置
 */
export const DEEPSEEK_CONFIG = {
  baseUrl: 'https://api.deepseek.com/v1',
  model: 'deepseek-chat',
  maxTokens: 1000,
  timeout: 30000 // 30秒超时
}

/**
 * API Key获取指南
 */
export const API_KEY_GUIDE = {
  title: 'How to get DeepSeek API Key',
  steps: [
    'Visit https://platform.deepseek.com/',
    'Sign up or log in to your account',
    'Go to API Keys page',
    'Click "Create API Key"',
    'Copy the generated API key (starts with sk-)',
    'Paste it in the settings below'
  ],
  notes: [
    'DeepSeek offers free credits for testing',
    'Very affordable pricing: ~$1 per million tokens',
    'Keep your API key secure and never share it'
  ]
}
