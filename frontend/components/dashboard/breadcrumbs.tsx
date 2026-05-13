'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbSegment {
  name: string
  href?: string
}

const pathSegmentMap: Record<string, string> = {
  dashboard: 'Dashboard',
  content: 'Content',
  calendar: 'Calendar',
  campaigns: 'Campaigns',
  analytics: 'Analytics',
  'social-accounts': 'Social Accounts',
  workflows: 'Workflows',
  team: 'Team',
  settings: 'Settings',
  'new': 'New',
  'edit': 'Edit',
  'profile': 'Profile',
  'integrations': 'Integrations',
}

export function Breadcrumbs() {
  const pathname = usePathname()

  // Skip breadcrumbs for certain pages
  if (pathname === '/dashboard') {
    return null
  }

  const segments: BreadcrumbSegment[] = [
    { name: 'Dashboard', href: '/dashboard' },
  ]

  const pathParts = pathname
    .split('/')
    .filter(Boolean)
    .slice(1) // Skip 'dashboard'

  let currentPath = '/dashboard'
  
  pathParts.forEach((part, index) => {
    currentPath += `/${part}`
    const isLast = index === pathParts.length - 1
    
    const displayName = pathSegmentMap[part] || capitalizeWords(decodeURIComponent(part))
    
    segments.push({
      name: displayName,
      href: isLast ? undefined : currentPath,
    })
  })

  return (
    <nav className="flex items-center gap-2 px-6 py-3 text-sm text-muted-foreground bg-accent/30 rounded-lg">
      <Link
        href="/dashboard"
        className="flex items-center gap-1 hover:text-foreground transition-colors"
      >
        <Home className="h-4 w-4" />
      </Link>

      {segments.slice(1).map((segment, index) => (
        <div key={index} className="flex items-center gap-2">
          <ChevronRight className="h-4 w-4" />
          {segment.href ? (
            <Link
              href={segment.href}
              className="hover:text-foreground transition-colors max-w-[200px] truncate"
            >
              {segment.name}
            </Link>
          ) : (
            <span className="text-foreground font-medium max-w-[200px] truncate">
              {segment.name}
            </span>
          )}
        </div>
      ))}
    </nav>
  )
}

function capitalizeWords(str: string): string {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
