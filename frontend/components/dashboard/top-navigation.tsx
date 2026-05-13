'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Bell,
  Search,
  HelpCircle,
  Settings,
  LogOut,
  Menu,
  User,
} from 'lucide-react'
import { useAuth } from '@/lib/hooks/use-auth'
import { ThemeSwitcher } from '@/components/theme-switcher'

interface TopNavigationProps {
  onMenuClick: () => void

}

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  timestamp: Date
  read: boolean
}

interface HelpItem {
  title: string
  description: string
  href: string
}

export function TopNavigation({ onMenuClick }: TopNavigationProps) {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [unreadCount, setUnreadCount] = useState(3)
  
  // Mock notifications
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Content Published',
      message: 'Your post on Instagram was published successfully',
      type: 'success',
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 min ago
      read: false,
    },
    {
      id: '2',
      title: 'New Engagement',
      message: 'You have 24 new comments on your latest post',
      type: 'info',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
      read: false,
    },
    {
      id: '3',
      title: 'Campaign Milestone',
      message: 'Your summer campaign reached 10,000 impressions',
      type: 'success',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      read: false,
    },
  ])

  const helpItems: HelpItem[] = [
    {
      title: 'Getting Started',
      description: 'Learn the basics of ArcFlow',
      href: '#',
    },
    {
      title: 'Knowledge Base',
      description: 'Browse articles and guides',
      href: '#',
    },
    {
      title: 'Contact Support',
      description: 'Reach out to our support team',
      href: '#',
    },
  ]

  const handleSearch = (query: string) => {
    if (query.trim()) {
      // Global search functionality - can be expanded
      console.log('Search:', query)
    }
  }

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    )
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })))
    setUnreadCount(0)
  }

  const userInitials = `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`.toUpperCase() || 'U'



  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6 dark:bg-gray-800">
      <div className="flex items-center gap-4 flex-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Global Search */}
        <div className="hidden md:flex flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search posts, campaigns, team members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch(searchQuery)
              }
            }}
            className="pl-10 bg-accent/50"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        {/* <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-red-500 rounded-full animate-pulse" />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-96 p-0" align="end">
            <div className="border-b p-4 flex items-center justify-between">
              <h3 className="font-semibold">Notifications</h3>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs"
                >
                  Mark all as read
                </Button>
              )}
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map(notif => (
                  <div
                    key={notif.id}
                    className={cn(
                      'border-b px-4 py-3 hover:bg-accent/50 transition-colors cursor-pointer',
                      !notif.read && 'bg-accent/20'
                    )}
                    onClick={() => markNotificationAsRead(notif.id)}
                  >
                    <div className="flex gap-3">
                      <div className={cn(
                        'h-2 w-2 mt-2 rounded-full flex-shrink-0',
                        notif.type === 'success' && 'bg-green-500',
                        notif.type === 'error' && 'bg-red-500',
                        notif.type === 'warning' && 'bg-yellow-500',
                        notif.type === 'info' && 'bg-blue-500',
                      )} />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{notif.title}</p>
                        <p className="text-sm text-muted-foreground">{notif.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatTime(notif.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  No notifications
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover> */}

        {/* Help & Support */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <HelpCircle className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>Help & Support</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {helpItems.map((item, idx) => (
              <DropdownMenuItem key={idx} asChild>
                <Link href={item.href}>
                  <div>
                    <p className="font-medium text-sm">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme Switcher */}
        <ThemeSwitcher />

        {/* Quick Settings */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push('/dashboard/settings')}
          title="Quick settings"
        >
          <Settings className="h-5 w-5" />
        </Button>

        {/* User Profile Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar>
                <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>{user?.firstName} {user?.lastName}</span>
                <span className="text-xs font-normal text-muted-foreground">{user?.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                View Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Account Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-600 flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

function formatTime(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  
  return date.toLocaleDateString()
}
