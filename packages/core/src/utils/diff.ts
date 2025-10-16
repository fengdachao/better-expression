/**
 * 文本差异检测工具
 */

export interface TextChange {
  type: 'added' | 'removed' | 'unchanged'
  text: string
  index: number
}

export interface DiffResult {
  changes: TextChange[]
  hasChanges: boolean
}

/**
 * 简单的文本差异算法
 * 基于单词级别的比较
 */
export function diffTexts(original: string, improved: string): DiffResult {
  const originalWords = tokenizeText(original)
  const improvedWords = tokenizeText(improved)
  
  const changes: TextChange[] = []
  let hasChanges = false
  
  // 使用简单的LCS算法检测差异
  const lcs = longestCommonSubsequence(originalWords, improvedWords)
  
  let i = 0, j = 0, k = 0
  
  while (i < originalWords.length || j < improvedWords.length) {
    if (k < lcs.length && i < originalWords.length && originalWords[i] === lcs[k]) {
      // 相同的词
      changes.push({
        type: 'unchanged',
        text: originalWords[i],
        index: changes.length
      })
      i++
      j++
      k++
    } else if (i < originalWords.length && (k >= lcs.length || originalWords[i] !== lcs[k])) {
      // 删除的词
      changes.push({
        type: 'removed',
        text: originalWords[i],
        index: changes.length
      })
      i++
      hasChanges = true
    } else if (j < improvedWords.length) {
      // 添加的词
      changes.push({
        type: 'added',
        text: improvedWords[j],
        index: changes.length
      })
      j++
      hasChanges = true
    }
  }
  
  return { changes, hasChanges }
}

/**
 * 将文本分词
 */
function tokenizeText(text: string): string[] {
  return text
    .trim()
    .split(/(\s+|[.,!?;:()[\]{}'""])/g)
    .filter(token => token.length > 0)
}

/**
 * 最长公共子序列算法
 */
function longestCommonSubsequence(arr1: string[], arr2: string[]): string[] {
  const m = arr1.length
  const n = arr2.length
  const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0))
  
  // 构建DP表
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (arr1[i - 1] === arr2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
      }
    }
  }
  
  // 回溯构建LCS
  const lcs: string[] = []
  let i = m, j = n
  
  while (i > 0 && j > 0) {
    if (arr1[i - 1] === arr2[j - 1]) {
      lcs.unshift(arr1[i - 1])
      i--
      j--
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--
    } else {
      j--
    }
  }
  
  return lcs
}

/**
 * 计算文本相似度（0-1之间）
 */
export function calculateSimilarity(original: string, improved: string): number {
  const originalWords = tokenizeText(original)
  const improvedWords = tokenizeText(improved)
  
  if (originalWords.length === 0 && improvedWords.length === 0) {
    return 1
  }
  
  const lcs = longestCommonSubsequence(originalWords, improvedWords)
  const maxLength = Math.max(originalWords.length, improvedWords.length)
  
  return lcs.length / maxLength
}

/**
 * 高亮差异文本（用于UI显示）
 */
export function highlightDifferences(original: string, improved: string): {
  originalHighlighted: string
  improvedHighlighted: string
} {
  const diff = diffTexts(original, improved)
  
  let originalHighlighted = ''
  let improvedHighlighted = ''
  
  for (const change of diff.changes) {
    switch (change.type) {
      case 'unchanged':
        originalHighlighted += change.text
        improvedHighlighted += change.text
        break
      case 'removed':
        originalHighlighted += `<mark class="removed">${change.text}</mark>`
        break
      case 'added':
        improvedHighlighted += `<mark class="added">${change.text}</mark>`
        break
    }
  }
  
  return { originalHighlighted, improvedHighlighted }
}
