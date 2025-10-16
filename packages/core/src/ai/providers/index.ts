import { registerProvider } from './base'
import { createDeepSeekProvider } from './deepseek'

// 注册所有可用的Provider
registerProvider('deepseek', createDeepSeekProvider)

// 导出所有Provider相关内容
export * from './base'
export * from './deepseek'

// 导出可用的模型列表
export const AVAILABLE_MODELS = ['deepseek'] as const
