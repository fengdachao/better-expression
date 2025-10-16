'use client'

import React from 'react'
import { Card, CardContent } from './ui/card'
import { Loader2, Wand2, Sparkles } from 'lucide-react'
import { cn } from '../lib/utils'

export interface LoadingStateProps {
  message?: string
  submessage?: string
  className?: string
}

export function LoadingState({
  message = "Improving your text...",
  submessage = "This may take a few seconds",
  className
}: LoadingStateProps) {
  return (
    <Card className={cn("w-full", className)}>
      <CardContent className="p-8">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          {/* Animated Icon */}
          <div className="relative">
            <div className="absolute inset-0 animate-ping">
              <Sparkles className="h-8 w-8 text-primary/20" />
            </div>
            <div className="relative">
              <Wand2 className="h-8 w-8 text-primary animate-pulse" />
            </div>
          </div>

          {/* Loading Spinner */}
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />

          {/* Messages */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">{message}</h3>
            {submessage && (
              <p className="text-sm text-muted-foreground">{submessage}</p>
            )}
          </div>

          {/* Progress Dots */}
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={cn(
                  "h-2 w-2 rounded-full bg-primary/30 animate-pulse",
                  `animation-delay-${i * 200}`
                )}
                style={{
                  animationDelay: `${i * 0.2}s`
                }}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export interface ErrorStateProps {
  title?: string
  message: string
  onRetry?: () => void
  className?: string
}

export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
  className
}: ErrorStateProps) {
  return (
    <Card className={cn("w-full border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20", className)}>
      <CardContent className="p-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
            <svg
              className="h-6 w-6 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium text-red-900 dark:text-red-100">
              {title}
            </h3>
            <p className="text-sm text-red-700 dark:text-red-300 max-w-md">
              {message}
            </p>
          </div>

          {onRetry && (
            <button
              onClick={onRetry}
              className="px-4 py-2 text-sm font-medium text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/40 rounded-md transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
