/**
 * 文本格式化工具
 */

/**
 * 格式化改写结果用于显示
 */
export function formatImproveResult(original: string, improved: string, explanation: string): string {
  return `Original: ${original}\n\nImproved: ${improved}\n\nExplanation: ${explanation}`
}

/**
 * 格式化时间戳
 */
export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMinutes < 1) {
    return 'Just now'
  } else if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  } else {
    return date.toLocaleDateString()
  }
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * 格式化token数量
 */
export function formatTokenCount(tokens: number): string {
  if (tokens < 1000) {
    return `${tokens} tokens`
  } else if (tokens < 1000000) {
    return `${(tokens / 1000).toFixed(1)}K tokens`
  } else {
    return `${(tokens / 1000000).toFixed(1)}M tokens`
  }
}

/**
 * 截断长文本
 */
export function truncateText(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) {
    return text
  }
  
  return text.substring(0, maxLength - 3) + '...'
}

/**
 * 首字母大写
 */
export function capitalize(text: string): string {
  if (!text) return text
  return text.charAt(0).toUpperCase() + text.slice(1)
}

/**
 * 驼峰命名转换为标题格式
 */
export function camelToTitle(camelCase: string): string {
  return camelCase
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim()
}

/**
 * 格式化百分比
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${(value * 100).toFixed(decimals)}%`
}

/**
 * 格式化API错误消息
 */
export function formatApiError(error: any): string {
  if (typeof error === 'string') {
    return error
  }
  
  if (error?.message) {
    return error.message
  }
  
  if (error?.error?.message) {
    return error.error.message
  }
  
  return 'An unexpected error occurred'
}

/**
 * 格式化风格选项显示名称
 */
export function formatStyleName(style: string): string {
  const styleNames: Record<string, string> = {
    casual: 'Casual',
    formal: 'Formal',
    academic: 'Academic',
    business: 'Business'
  }
  
  return styleNames[style] || capitalize(style)
}

/**
 * 生成唯一ID
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

/**
 * 清理HTML标签
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '')
}

/**
 * 转义HTML特殊字符
 */
export function escapeHtml(text: string): string {
  // 使用字符串替换而不是DOM操作，避免在Node.js环境中使用document
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/**
 * 格式化配置对象用于显示
 */
export function formatConfig(config: any): string {
  const safeConfig = { ...config }
  
  // 隐藏敏感信息
  if (safeConfig.apiKey) {
    safeConfig.apiKey = `${safeConfig.apiKey.substring(0, 8)}...`
  }
  
  return JSON.stringify(safeConfig, null, 2)
}
