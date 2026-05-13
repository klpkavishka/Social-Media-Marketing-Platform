'use client'

import { useEffect } from 'react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/lib/hooks/use-auth'
import { ImprovedSidebar } from '@/components/dashboard/improved-sidebar'
import { TopNavigation } from '@/components/dashboard/top-navigation'
import { Breadcrumbs } from '@/components/dashboard/breadcrumbs'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()

  // Handle redirects when authentication state changes
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  // Show loading state while Auth0 checks authentication
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // If not authenticated, show nothing (will redirect)
  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Improved Sidebar */}
      <ImprovedSidebar open={sidebarOpen} onToggle={setSidebarOpen} />

      {/* Main Content */}
      <div className={cn('flex flex-1 flex-col transition-all', sidebarOpen && 'ml-64')}>
        {/* Top Navigation */}
        <TopNavigation
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Main Content Area with Better Spacing */}
        <main className="flex-1 overflow-auto">
          <div className="space-y-6 p-6">
            {/* Breadcrumbs */}
            <Breadcrumbs />

            {/* Page Content */}
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
