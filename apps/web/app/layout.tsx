import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '../components/ThemeProvider'
import { Providers } from '../components/Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Better Sentence - AI-Powered English Improvement',
  description: 'Improve your English writing with AI. Make your sentences more natural, clear, and professional.',
  keywords: ['English', 'writing', 'AI', 'grammar', 'improvement', 'DeepSeek'],
  authors: [{ name: 'Better Sentence Team' }],
  creator: 'Better Sentence',
  publisher: 'Better Sentence',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://better-sentence.vercel.app'),
  openGraph: {
    title: 'Better Sentence - AI-Powered English Improvement',
    description: 'Improve your English writing with AI. Make your sentences more natural, clear, and professional.',
    url: 'https://better-sentence.vercel.app',
    siteName: 'Better Sentence',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Better Sentence - AI-Powered English Improvement',
    description: 'Improve your English writing with AI. Make your sentences more natural, clear, and professional.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            {children}
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
