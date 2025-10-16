'use client'

import React from 'react'
import { Heart, ExternalLink } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* About */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">About Better Sentence</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              AI-powered tool to improve your English writing. 
              Make your sentences more natural, clear, and professional.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Features</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Multiple writing styles</li>
              <li>• Real-time improvements</li>
              <li>• Detailed explanations</li>
              <li>• Privacy-focused</li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Resources</h3>
            <div className="flex flex-col gap-2 text-sm">
              <a
                href="https://platform.deepseek.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                Get DeepSeek API Key
                <ExternalLink className="h-3 w-3" />
              </a>
              <a
                href="https://github.com/your-username/better-sentence"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                Source Code
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500" />
            <span>using DeepSeek AI</span>
          </div>
          
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>© 2024 Better Sentence</span>
            <span>•</span>
            <span>Open Source</span>
            <span>•</span>
            <span>Privacy First</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
