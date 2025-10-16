'use client'

import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Settings, Key, Info, ExternalLink, AlertCircle, CheckCircle } from 'lucide-react'
import { cn } from '../lib/utils'
import type { Config, ImprovementStyle } from '@better-sentence/core'

export interface SettingsDialogProps {
  config: Partial<Config>
  onSave: (config: Partial<Config>) => void
  onTest?: () => Promise<boolean>
  children?: React.ReactNode
  className?: string
}

const API_KEY_GUIDE_STEPS = [
  'Visit https://platform.deepseek.com/',
  'Sign up or log in to your account',
  'Go to API Keys page',
  'Click "Create API Key"',
  'Copy the generated API key (starts with sk-)',
  'Paste it in the field below'
]

const API_KEY_NOTES = [
  'DeepSeek offers free credits for testing',
  'Very affordable pricing: ~$1 per million tokens',
  'Keep your API key secure and never share it'
]

export function SettingsDialog({
  config,
  onSave,
  onTest,
  children,
  className
}: SettingsDialogProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<Partial<Config>>(config)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    setFormData(config)
  }, [config])

  const handleInputChange = (field: keyof Config, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.apiKey?.trim()) {
      newErrors.apiKey = 'API Key is required'
    } else if (!formData.apiKey.startsWith('sk-')) {
      newErrors.apiKey = 'API Key must start with "sk-"'
    } else if (formData.apiKey.length < 20) {
      newErrors.apiKey = 'API Key appears to be too short'
    }

    if (formData.temperature !== undefined) {
      if (formData.temperature < 0 || formData.temperature > 2) {
        newErrors.temperature = 'Temperature must be between 0 and 2'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleTest = async () => {
    if (!validateForm()) return

    setTesting(true)
    setTestResult(null)

    try {
      const success = await onTest?.()
      setTestResult(success ? 'success' : 'error')
    } catch (error) {
      setTestResult('error')
    } finally {
      setTesting(false)
    }
  }

  const handleSave = () => {
    if (!validateForm()) return

    onSave(formData)
    setOpen(false)
    setTestResult(null)
  }

  const maskApiKey = (key: string) => {
    if (!key) return ''
    if (key.length <= 8) return key
    return key.substring(0, 8) + '•'.repeat(Math.min(key.length - 8, 20))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm" className={className}>
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Settings
          </DialogTitle>
          <DialogDescription>
            Configure your AI settings and preferences
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="api" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="api">API Configuration</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="api" className="space-y-4">
            {/* API Key Section */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  DeepSeek API Key
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="apiKey">API Key</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxx"
                    value={formData.apiKey || ''}
                    onChange={(e) => handleInputChange('apiKey', e.target.value)}
                    className={cn(errors.apiKey && "border-red-500")}
                  />
                  {errors.apiKey && (
                    <p className="text-sm text-red-500">{errors.apiKey}</p>
                  )}
                  {formData.apiKey && !errors.apiKey && (
                    <p className="text-xs text-muted-foreground">
                      Current: {maskApiKey(formData.apiKey)}
                    </p>
                  )}
                </div>

                {/* Test Connection */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleTest}
                    disabled={testing || !formData.apiKey}
                  >
                    {testing ? 'Testing...' : 'Test Connection'}
                  </Button>
                  
                  {testResult === 'success' && (
                    <div className="flex items-center gap-1 text-sm text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      Connection successful
                    </div>
                  )}
                  
                  {testResult === 'error' && (
                    <div className="flex items-center gap-1 text-sm text-red-600">
                      <AlertCircle className="h-4 w-4" />
                      Connection failed
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* API Key Guide */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  How to get DeepSeek API Key
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ol className="text-sm space-y-1">
                  {API_KEY_GUIDE_STEPS.map((step, index) => (
                    <li key={index} className="flex gap-2">
                      <span className="text-muted-foreground">{index + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Important Notes:</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    {API_KEY_NOTES.map((note, index) => (
                      <li key={index} className="flex gap-2">
                        <span>•</span>
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button variant="outline" size="sm" asChild>
                  <a
                    href="https://platform.deepseek.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Open DeepSeek Platform
                  </a>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-4">
            {/* Default Style */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Default Writing Style</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {(['casual', 'formal', 'academic', 'business'] as ImprovementStyle[]).map((style) => (
                    <Button
                      key={style}
                      variant={formData.defaultStyle === style ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleInputChange('defaultStyle', style)}
                      className="justify-start"
                    >
                      {style.charAt(0).toUpperCase() + style.slice(1)}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Temperature */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Creativity Level</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="temperature">Temperature</Label>
                    <Badge variant="secondary">{formData.temperature || 0.3}</Badge>
                  </div>
                  <Input
                    id="temperature"
                    type="number"
                    min="0"
                    max="2"
                    step="0.1"
                    value={formData.temperature || 0.3}
                    onChange={(e) => handleInputChange('temperature', parseFloat(e.target.value))}
                    className={cn(errors.temperature && "border-red-500")}
                  />
                  {errors.temperature && (
                    <p className="text-sm text-red-500">{errors.temperature}</p>
                  )}
                  <div className="text-xs text-muted-foreground">
                    Lower values (0.1-0.5) for more consistent results, higher values (0.6-1.0) for more creative variations
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Model Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Model Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>AI Model:</span>
                  <Badge>DeepSeek Chat</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Language:</span>
                  <Badge variant="secondary">American English</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Max Length:</span>
                  <Badge variant="secondary">2000 characters</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={Object.keys(errors).length > 0}>
            Save Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
