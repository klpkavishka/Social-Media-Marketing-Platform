import type { Metadata } from 'next'
import { Inter, Space_Grotesk, Sora } from 'next/font/google'
import '@/styles/globals.css'
import { Providers } from './providers'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk', weight: ['600', '700'] })
const sora = Sora({ subsets: ['latin'], variable: '--font-sora' })

export const metadata: Metadata = {
  title: 'ArcFlow Social Hub - AI-Powered Social Media Management',
  description: 'Comprehensive AI-powered social media management platform for agencies, businesses, and teams. Create, schedule, and analyze content across all major social media platforms.',
  keywords: ['social media management', 'content creation', 'scheduling', 'analytics', 'agencies', 'businesses', 'marketing', 'AI', 'automation', 'multi-platform'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${sora.variable} font-inter`}>
        <Providers>
          {children}
          <Toaster position="top-right" richColors />
        </Providers>
      </body>
    </html>
  )
}
