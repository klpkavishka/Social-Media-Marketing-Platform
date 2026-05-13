'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Calendar,
  FileText,
  Home,
  Settings,
  Users,
  Workflow,
  Share2,
  MessageSquare,
  ChevronDown,
  Search,
  Heart,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Logo } from '@/components/brand/logo'

interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  category?: string
}

const navigationItems: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: Home, category: 'Core' },
  { name: 'Content', href: '/dashboard/content', icon: FileText, category: 'Content' },
  { name: 'Calendar', href: '/dashboard/content/calendar', icon: Calendar, category: 'Content' },
  { name: 'Campaigns', href: '/dashboard/campaigns', icon: MessageSquare, category: 'Content' },
  { name: 'Social Accounts', href: '/dashboard/social-accounts', icon: Share2, category: 'Connections' },
  { name: 'Workflows', href: '/dashboard/workflows', icon: Workflow, category: 'Automation' },
  { name: 'Team', href: '/dashboard/team', icon: Users, category: 'Organization' },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings, category: 'Organization' },
]

interface ImprovedSidebarProps {
  open: boolean
  onToggle?: (open: boolean) => void
}

export function ImprovedSidebar({ open }: ImprovedSidebarProps) {
  const pathname = usePathname()
  const [expandedSections, setExpandedSections] = useState<Set<string>>(() => {
    const sections = new Set<string>()
    // Expand sections containing current path
    navigationItems.forEach((item) => {
      if (item.category && pathname.includes(item.href)) {
        sections.add(item.category)
      }
    })
    // Default expand Core section
    if (sections.size === 0) {
      sections.add('Core')
    }
    return sections
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    // Default favorites
    return new Set(['/dashboard', '/dashboard/content'])
  })

  const toggleSection = (category: string) => {
    const newSections = new Set(expandedSections)
    if (newSections.has(category)) {
      newSections.delete(category)
    } else {
      newSections.add(category)
    }
    setExpandedSections(newSections)
  }

  const toggleFavorite = (href: string) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(href)) {
      newFavorites.delete(href)
    } else {
      newFavorites.add(href)
    }
    setFavorites(newFavorites)
  }

  // Group and filter navigation items
  const groupedItems = useMemo(() => {
    const grouped: Record<string, NavItem[]> = {}
    
    navigationItems
      .filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .forEach(item => {
        const category = item.category || 'Other'
        if (!grouped[category]) {
          grouped[category] = []
        }
        grouped[category].push(item)
      })
    
    return grouped
  }, [searchQuery])

  const favoriteItems = useMemo(() => {
    return navigationItems.filter(item => favorites.has(item.href))
  }, [favorites])

  const categories = Object.keys(groupedItems).sort()

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-white transition-transform dark:bg-gray-800',
        !open && '-translate-x-full'
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center gap-3 border-b px-6">
        <Logo width={32} height={32} showName={false} />
        <div className="flex-1">
          <div className="text-lg font-bold font-space-grotesk bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
            ArcFlow
          </div>
          <div className="text-xs text-muted-foreground">Social Hub</div>
        </div>
      </div>

      {/* Search */}
      <div className="border-b p-4">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-9"
          />
        </div>
      </div>

      {/* Sidebar Content */}
      <nav className="flex-1 space-y-2 overflow-y-auto p-4">
        {/* Favorites Section */}
        {favoriteItems.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <Heart className="h-3 w-3" />
              Favorites
            </div>
            <div className="space-y-1">
              {favoriteItems.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors relative group',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        toggleFavorite(item.href)
                      }}
                      className={cn(
                        'absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity',
                        favorites.has(item.href) && 'opacity-100'
                      )}
                    >
                      <Heart className="h-4 w-4 fill-current" />
                    </button>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* Grouped Navigation */}
        {categories.length > 0 ? (
          categories.map((category) => (
            <div key={category}>
              <button
                onClick={() => toggleSection(category)}
                className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
              >
                <span>{category}</span>
                <ChevronDown
                  className={cn(
                    'h-3 w-3 transition-transform',
                    expandedSections.has(category) && 'rotate-180'
                  )}
                />
              </button>
              
              {expandedSections.has(category) && (
                <div className="mb-4 space-y-1">
                  {groupedItems[category]?.map((item) => {
                    const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors relative group',
                          isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.name}
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            toggleFavorite(item.href)
                          }}
                          className={cn(
                            'absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity',
                            favorites.has(item.href) && 'opacity-100'
                          )}
                        >
                          <Heart
                            className={cn(
                              'h-4 w-4',
                              favorites.has(item.href) && 'fill-current'
                            )}
                          />
                        </button>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="px-3 py-8 text-center text-sm text-muted-foreground">
            No items found
          </div>
        )}
      </nav>
    </aside>
  )
}
