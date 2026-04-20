'use client'

import { GeneratorPage } from '@/components/generator/generator-page'
import { useUser } from '@auth0/nextjs-auth0/client'

export default function DashboardPage() {
  const { user } = useUser()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Content Generator</h1>
        <p className="text-muted-foreground">
          Create engaging captions and hashtags powered by AI
        </p>
      </div>

      {/* Generator Component */}
      <GeneratorPage
        userName={user?.name}
        userHandle={`@${user?.email?.split('@')[0] || 'yourhandle'}`}
        userAvatar={user?.picture}
      />
    </div>
  )
}
