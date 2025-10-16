'use client'

import React, { useState } from 'react'
import { 
  TextInput, 
  StyleSelector, 
  ResultDisplay, 
  LoadingState, 
  ErrorState,
  useImprover,
  useStorage,
  useToast
} from '@better-sentence/ui'
import type { ImprovementStyle } from '@better-sentence/core'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'

export default function HomePage() {
  const [text, setText] = useState('')
  const [style, setStyle] = useState<ImprovementStyle>('casual')
  
  const storage = useStorage()
  const { toast } = useToast()
  
  const { result, loading, error, improve, reset } = useImprover({
    storage,
    onSuccess: (result) => {
      toast({
        title: 'Success!',
        description: 'Your text has been improved.',
        variant: 'default'
      })
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      })
    }
  })

  const handleSubmit = async (inputText: string) => {
    setText(inputText)
    await improve(inputText, { style })
  }

  const handleTryAgain = () => {
    if (text) {
      improve(text, { style })
    }
  }

  const handleCopy = (copiedText: string) => {
    toast({
      title: 'Copied!',
      description: 'Text copied to clipboard.',
      duration: 2000
    })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 md:py-20 bg-gradient-to-b from-background to-muted/20">
          <div className="container max-w-4xl">
            <div className="text-center space-y-4 mb-12">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                Better <span className="text-primary">Sentence</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Transform your English writing with AI. Make your sentences more natural, 
                clear, and professional in seconds.
              </p>
            </div>

            {/* Main Interface */}
            <div className="space-y-6">
              {/* Input Section */}
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <TextInput
                    value={text}
                    onChange={setText}
                    onSubmit={handleSubmit}
                    loading={loading}
                    placeholder="Enter your English text here to improve it..."
                  />
                </div>
                <div>
                  <StyleSelector
                    value={style}
                    onChange={setStyle}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Results Section */}
              <div className="min-h-[200px]">
                {loading && (
                  <LoadingState 
                    message="Improving your text..."
                    submessage="This may take a few seconds"
                  />
                )}

                {error && !loading && (
                  <ErrorState
                    title="Improvement Failed"
                    message={error}
                    onRetry={handleTryAgain}
                  />
                )}

                {result && !loading && !error && (
                  <ResultDisplay
                    result={result}
                    originalText={text}
                    style={style}
                    onCopy={handleCopy}
                    onTryAgain={handleTryAgain}
                  />
                )}

                {!result && !loading && !error && (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>Enter some text above to get started!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-muted/30">
          <div className="container max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Choose Better Sentence?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Powered by advanced AI technology to help you write better English
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  title: 'Multiple Styles',
                  description: 'Choose from casual, formal, academic, or business writing styles',
                  icon: '🎯'
                },
                {
                  title: 'Instant Results',
                  description: 'Get improved text in seconds with detailed explanations',
                  icon: '⚡'
                },
                {
                  title: 'Privacy First',
                  description: 'Your API key stays in your browser. We never store your text',
                  icon: '🔒'
                },
                {
                  title: 'Cost Effective',
                  description: 'Use your own DeepSeek API key for affordable improvements',
                  icon: '💰'
                }
              ].map((feature, index) => (
                <div key={index} className="text-center space-y-3">
                  <div className="text-4xl mb-3">{feature.icon}</div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Getting Started Section */}
        <section className="py-16">
          <div className="container max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Get Started in 3 Steps</h2>
              <p className="text-muted-foreground">
                Start improving your English writing in minutes
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  step: '1',
                  title: 'Get API Key',
                  description: 'Sign up at DeepSeek and get your free API key',
                  action: 'Visit DeepSeek'
                },
                {
                  step: '2',
                  title: 'Configure Settings',
                  description: 'Add your API key in the settings dialog',
                  action: 'Open Settings'
                },
                {
                  step: '3',
                  title: 'Start Improving',
                  description: 'Type your text and watch it transform!',
                  action: 'Try Now'
                }
              ].map((step, index) => (
                <div key={index} className="text-center space-y-4">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto">
                    {step.step}
                  </div>
                  <h3 className="text-lg font-semibold">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
