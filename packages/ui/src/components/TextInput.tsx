'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { Loader2, Wand2, Type } from 'lucide-react'
import { cn } from '../lib/utils'

export interface TextInputProps {
  value?: string
  onChange?: (value: string) => void
  onSubmit?: (text: string) => void
  loading?: boolean
  disabled?: boolean
  placeholder?: string
  maxLength?: number
  className?: string
}

export function TextInput({
  value = '',
  onChange,
  onSubmit,
  loading = false,
  disabled = false,
  placeholder = "Enter your English text here to improve it...",
  maxLength = 2000,
  className
}: TextInputProps) {
  const [text, setText] = useState(value)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setText(value)
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    if (newValue.length <= maxLength) {
      setText(newValue)
      onChange?.(newValue)
    }
  }

  const handleSubmit = () => {
    const trimmedText = text.trim()
    if (trimmedText && !loading && !disabled) {
      onSubmit?.(trimmedText)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const canSubmit = text.trim().length >= 3 && !loading && !disabled
  const charCount = text.length
  const isNearLimit = charCount > maxLength * 0.8

  return (
    <Card className={cn("w-full", className)}>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Type className="h-4 w-4" />
            <span>Enter your text to improve</span>
          </div>

          {/* Textarea */}
          <div className="relative">
            <Textarea
              ref={textareaRef}
              value={text}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled || loading}
              className={cn(
                "min-h-[120px] resize-none text-base leading-relaxed",
                "focus:ring-2 focus:ring-primary/20 focus:border-primary",
                disabled && "opacity-50"
              )}
              rows={5}
            />
            
            {/* Character count */}
            <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
              <span className={cn(
                isNearLimit && "text-orange-500",
                charCount >= maxLength && "text-red-500"
              )}>
                {charCount}/{maxLength}
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              Press <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded">Ctrl</kbd> + 
              <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded ml-1">Enter</kbd> to improve
            </div>
            
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit}
              size="sm"
              className="min-w-[100px]"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Improving...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 mr-2" />
                  Improve
                </>
              )}
            </Button>
          </div>

          {/* Validation messages */}
          {text.trim().length > 0 && text.trim().length < 3 && (
            <div className="text-xs text-orange-600 bg-orange-50 p-2 rounded">
              Text is too short (minimum 3 characters)
            </div>
          )}
          
          {charCount >= maxLength && (
            <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
              Text is too long (maximum {maxLength} characters)
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
