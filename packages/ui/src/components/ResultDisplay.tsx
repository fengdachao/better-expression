'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Copy, Check, ArrowRight, Lightbulb, RotateCcw } from 'lucide-react'
import { cn } from '../lib/utils'
import type { ImproveResult, ImprovementStyle } from '@better-sentence/core'

export interface ResultDisplayProps {
  result: ImproveResult
  originalText: string
  style: ImprovementStyle
  onCopy?: (text: string) => void
  onTryAgain?: () => void
  className?: string
}

export function ResultDisplay({
  result,
  originalText,
  style,
  onCopy,
  onTryAgain,
  className
}: ResultDisplayProps) {
  const [copiedText, setCopiedText] = useState<string | null>(null)

  const handleCopy = async (text: string, type: 'original' | 'improved') => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedText(type)
      onCopy?.(text)
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopiedText(null), 2000)
    } catch (error) {
      console.error('Failed to copy text:', error)
    }
  }

  const formatStyleName = (style: string) => {
    const names: Record<string, string> = {
      casual: 'Casual',
      formal: 'Formal',
      academic: 'Academic',
      business: 'Business'
    }
    return names[style] || style
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            Improved Text
          </CardTitle>
          <Badge variant="secondary">
            {formatStyleName(style)} Style
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Text Comparison */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Original Text */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-muted-foreground">Original</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopy(originalText, 'original')}
                className="h-8 px-2"
              >
                {copiedText === 'original' ? (
                  <Check className="h-3 w-3 text-green-500" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            </div>
            <div className="p-4 bg-muted/50 rounded-md text-sm leading-relaxed">
              {originalText}
            </div>
          </div>

          {/* Improved Text */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-green-700 dark:text-green-400">
                Improved
              </h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopy(result.improved, 'improved')}
                className="h-8 px-2"
              >
                {copiedText === 'improved' ? (
                  <Check className="h-3 w-3 text-green-500" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-md text-sm leading-relaxed">
              {result.improved}
            </div>
          </div>
        </div>

        {/* Explanation */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <ArrowRight className="h-4 w-4" />
            What was improved?
          </h4>
          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-md text-sm leading-relaxed">
            {result.explanation}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onTryAgain}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Try Again
          </Button>

          <Button
            onClick={() => handleCopy(result.improved, 'improved')}
            size="sm"
            className="flex items-center gap-2"
          >
            {copiedText === 'improved' ? (
              <>
                <Check className="h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy Improved Text
              </>
            )}
          </Button>
        </div>

        {/* Statistics */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t">
          <span>Original: {originalText.length} chars</span>
          <span>Improved: {result.improved.length} chars</span>
          <span>
            Change: {result.improved.length > originalText.length ? '+' : ''}
            {result.improved.length - originalText.length} chars
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
