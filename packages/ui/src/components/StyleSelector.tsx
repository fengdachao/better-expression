'use client'

import React from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { BookOpen, Briefcase, Building2, MessageCircle } from 'lucide-react'
import { cn } from '../lib/utils'
import type { ImprovementStyle } from '@better-sentence/core'

export interface StyleSelectorProps {
  value: ImprovementStyle
  onChange: (style: ImprovementStyle) => void
  disabled?: boolean
  className?: string
}

const STYLE_OPTIONS = [
  {
    value: 'casual' as const,
    label: 'Casual',
    icon: MessageCircle,
    description: 'Relaxed, friendly language for everyday conversations',
    example: 'Hey, can you help me out with this?'
  },
  {
    value: 'formal' as const,
    label: 'Formal',
    icon: Building2,
    description: 'Professional language suitable for business contexts',
    example: 'I would appreciate your assistance with this matter.'
  },
  {
    value: 'academic' as const,
    label: 'Academic',
    icon: BookOpen,
    description: 'Scholarly language with precise terminology',
    example: 'This study examines the correlation between variables.'
  },
  {
    value: 'business' as const,
    label: 'Business',
    icon: Briefcase,
    description: 'Professional business language for corporate communication',
    example: 'We need to optimize our quarterly performance metrics.'
  }
]

export function StyleSelector({
  value,
  onChange,
  disabled = false,
  className
}: StyleSelectorProps) {
  return (
    <Card className={cn("w-full", className)}>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Writing Style</h3>
            <Badge variant="secondary" className="text-xs">
              American English
            </Badge>
          </div>

          <Tabs
            value={value}
            onValueChange={(newValue) => onChange(newValue as ImprovementStyle)}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4">
              {STYLE_OPTIONS.map((option) => {
                const Icon = option.icon
                return (
                  <TabsTrigger
                    key={option.value}
                    value={option.value}
                    disabled={disabled}
                    className="flex flex-col gap-1 h-auto py-2"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-xs">{option.label}</span>
                  </TabsTrigger>
                )
              })}
            </TabsList>

            {STYLE_OPTIONS.map((option) => (
              <TabsContent
                key={option.value}
                value={option.value}
                className="mt-4 space-y-3"
              >
                <div className="text-sm text-muted-foreground">
                  {option.description}
                </div>
                
                <div className="bg-muted/50 p-3 rounded-md">
                  <div className="text-xs text-muted-foreground mb-1">Example:</div>
                  <div className="text-sm italic">"{option.example}"</div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </CardContent>
    </Card>
  )
}
