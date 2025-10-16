import { ValidationError } from '../config/types'

/**
 * 验证文本输入
 */
export function validateTextInput(text: string): void {
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

  // 检查是否包含过多特殊字符
  const specialCharRatio = (trimmed.match(/[^a-zA-Z0-9\s.,!?;:()\-'"]/g) || []).length / trimmed.length
  if (specialCharRatio > 0.3) {
    throw new ValidationError('Text contains too many special characters')
  }
}

/**
 * 验证API Key格式
 */
export function validateApiKey(apiKey: string): void {
  if (!apiKey || typeof apiKey !== 'string') {
    throw new ValidationError('API key is required')
  }

  const trimmed = apiKey.trim()
  
  if (!trimmed.startsWith('sk-')) {
    throw new ValidationError('API key must start with "sk-"')
  }

  if (trimmed.length < 20) {
    throw new ValidationError('API key is too short')
  }

  if (trimmed.length > 200) {
    throw new ValidationError('API key is too long')
  }

  // 检查是否只包含有效字符
  const validChars = /^[a-zA-Z0-9\-_]+$/.test(trimmed.slice(3))
  if (!validChars) {
    throw new ValidationError('API key contains invalid characters')
  }
}

/**
 * 验证温度参数
 */
export function validateTemperature(temperature: number): void {
  if (typeof temperature !== 'number' || isNaN(temperature)) {
    throw new ValidationError('Temperature must be a number')
  }

  if (temperature < 0 || temperature > 2) {
    throw new ValidationError('Temperature must be between 0 and 2')
  }
}

/**
 * 验证URL格式
 */
export function validateUrl(url: string): void {
  if (!url || typeof url !== 'string') {
    throw new ValidationError('URL is required')
  }

  try {
    new URL(url)
  } catch {
    throw new ValidationError('Invalid URL format')
  }
}

/**
 * 清理和规范化文本
 */
export function sanitizeText(text: string): string {
  if (!text || typeof text !== 'string') {
    return ''
  }

  return text
    .trim()
    // 移除多余的空白字符
    .replace(/\s+/g, ' ')
    // 移除控制字符
    .replace(/[\x00-\x1F\x7F]/g, '')
    // 规范化引号
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'")
}

/**
 * 检查文本是否可能是非英文
 */
export function isLikelyNonEnglish(text: string): boolean {
  const trimmed = text.trim()
  
  // 检查中文字符
  const chineseChars = (trimmed.match(/[\u4e00-\u9fff]/g) || []).length
  if (chineseChars > trimmed.length * 0.1) {
    return true
  }

  // 检查其他非拉丁字符
  const nonLatinChars = (trimmed.match(/[^\u0000-\u007F\u0080-\u00FF]/g) || []).length
  if (nonLatinChars > trimmed.length * 0.2) {
    return true
  }

  return false
}

/**
 * 估算文本复杂度（1-10分）
 */
export function estimateTextComplexity(text: string): number {
  const trimmed = text.trim()
  let complexity = 1

  // 基于长度
  if (trimmed.length > 100) complexity += 1
  if (trimmed.length > 300) complexity += 1
  if (trimmed.length > 500) complexity += 1

  // 基于句子数量
  const sentences = trimmed.split(/[.!?]+/).filter(s => s.trim().length > 0)
  if (sentences.length > 2) complexity += 1
  if (sentences.length > 5) complexity += 1

  // 基于词汇复杂度
  const words = trimmed.split(/\s+/)
  const longWords = words.filter(w => w.length > 7).length
  if (longWords > words.length * 0.2) complexity += 1

  // 基于标点符号
  const punctuation = (trimmed.match(/[,;:()[\]{}]/g) || []).length
  if (punctuation > words.length * 0.1) complexity += 1

  return Math.min(complexity, 10)
}
