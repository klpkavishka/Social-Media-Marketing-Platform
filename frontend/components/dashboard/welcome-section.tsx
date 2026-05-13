'use client'

import { useAuth } from '@/lib/hooks/use-auth'

export function WelcomeSection() {
  const { user } = useAuth()

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="rounded-lg border bg-gradient-to-r from-violet-500/10 via-blue-500/10 to-cyan-500/10 p-8">
      <h1 className="text-3xl font-bold font-space-grotesk bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
        {getGreeting()}, {user?.firstName || 'Welcome'}! 👋
      </h1>
      <p className="mt-2 text-muted-foreground">
        You&apos;re managing content for <span className="font-semibold text-foreground">ArcFlow</span>
      </p>
      <p className="mt-4 text-sm text-muted-foreground">
        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
      </p>
    </div>
  )
}
