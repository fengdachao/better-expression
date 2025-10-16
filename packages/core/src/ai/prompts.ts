import type { ImprovementStyle } from '../config/types'

/**
 * 风格指南映射
 */
const STYLE_GUIDES: Record<ImprovementStyle, string> = {
  casual: 'Use relaxed, friendly language suitable for informal conversations. Keep it natural and conversational.',
  formal: 'Use formal, professional language suitable for business or official contexts. Maintain a respectful and polished tone.',
  academic: 'Use scholarly language with precise terminology suitable for academic writing. Be clear, objective, and well-structured.',
  business: 'Use professional business language suitable for corporate communication. Be concise, clear, and action-oriented.'
}

/**
 * 生成系统Prompt
 */
export function getSystemPrompt(style: ImprovementStyle): string {
  const styleGuide = STYLE_GUIDES[style]
  
  return `You are an expert English language coach specializing in American English. Your task is to improve the user's sentence to make it more natural, idiomatic, and fluent.

Style Guide: ${styleGuide}

Requirements:
1. Maintain the original meaning precisely - never change the core message
2. Make the sentence sound native and natural to American English speakers
3. Apply the specified style (${style}) consistently throughout
4. Fix any grammar, vocabulary, or structure issues
5. Provide a brief, helpful explanation of the key improvements made
6. Focus on making it sound more idiomatic and fluent

Output format (JSON only):
{
  "improved": "the improved sentence with better flow and natural phrasing",
  "explanation": "brief explanation of the key improvements made (2-3 sentences max)"
}

Important: 
- Return ONLY valid JSON, no additional text or formatting
- Keep explanations concise and educational
- If the original text is already excellent, make minimal changes and explain why it's good
- Focus on natural American English expressions and idioms`
}

/**
 * 生成用户Prompt
 */
export function getUserPrompt(text: string, style: ImprovementStyle): string {
  return `Please improve this sentence in ${style} style: "${text}"`
}

/**
 * 验证AI响应格式
 */
export function validateAIResponse(response: string): { improved: string; explanation: string } {
  try {
    const parsed = JSON.parse(response)
    
    if (!parsed.improved || !parsed.explanation) {
      throw new Error('Missing required fields')
    }
    
    if (typeof parsed.improved !== 'string' || typeof parsed.explanation !== 'string') {
      throw new Error('Invalid field types')
    }
    
    return {
      improved: parsed.improved.trim(),
      explanation: parsed.explanation.trim()
    }
  } catch (error) {
    throw new Error(`Invalid AI response format: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Prompt模板常量
 */
export const PROMPT_TEMPLATES = {
  SYSTEM_BASE: getSystemPrompt,
  USER_BASE: getUserPrompt,
  
  // 特殊场景的Prompt（未来扩展）
  BATCH_PROCESSING: (texts: string[], style: ImprovementStyle) => 
    `Improve these sentences in ${style} style: ${texts.map((t, i) => `${i + 1}. "${t}"`).join('\n')}`,
    
  TRANSLATION_IMPROVEMENT: (text: string, style: ImprovementStyle) =>
    `This text was translated from another language. Please improve it to sound more natural in ${style} American English: "${text}"`
}
