'use client'

import React from 'react'
import { Wand2, Github, Settings } from 'lucide-react'
import { Button, SettingsDialog } from '@better-sentence/ui'
import { ThemeToggle } from './ThemeToggle'
import { useStorage, useConfig } from '@better-sentence/ui'
import type { Config } from '@better-sentence/core'

export function Header() {
  const storage = useStorage()
  const { config, updateConfig, testConnection } = useConfig({ storage })

  const handleConfigSave = async (newConfig: Partial<Config>) => {
    await updateConfig(newConfig)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
            <Wand2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold leading-none">Better Sentence</h1>
            <p className="text-xs text-muted-foreground">AI-powered English improvement</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* GitHub Link */}
          <Button variant="ghost" size="sm" asChild>
            <a
              href="https://github.com/your-username/better-sentence"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Github className="h-4 w-4" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </Button>

          {/* Settings */}
          <SettingsDialog
            config={config}
            onSave={handleConfigSave}
            onTest={testConnection}
          >
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Settings</span>
            </Button>
          </SettingsDialog>

          {/* Theme Toggle */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
