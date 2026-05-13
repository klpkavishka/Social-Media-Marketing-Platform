'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus, Calendar, Zap } from 'lucide-react'

interface QuickAction {
  label: string
  description: string
  href: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  variant?: 'default' | 'secondary' | 'outline'
}

export function QuickActions() {
  const actions: QuickAction[] = [
    {
      label: 'Create Post',
      description: 'Write and publish new content',
      href: '/dashboard/content/new',
      icon: Plus,
      variant: 'default',
    },
    {
      label: 'Schedule Content',
      description: 'Plan posts for later',
      href: '/dashboard/content/calendar',
      icon: Calendar,
      variant: 'secondary',
    },
    {
      label: 'Run Campaign',
      description: 'Launch marketing campaign',
      href: '/dashboard/campaigns/new',
      icon: Zap,
      variant: 'outline',
    },
  ]

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {actions.map((action, idx) => (
          <Link key={idx} href={action.href}>
            <Button
              variant={action.variant}
              className="w-full h-auto flex-col items-start p-4 justify-start hover:scale-105 transition-transform"
            >
              <div className="flex items-center gap-2 w-full mb-2">
                <action.icon className="h-5 w-5" />
                <span className="font-medium text-sm">{action.label}</span>
              </div>
              <span className="text-xs text-muted-foreground text-left">
                {action.description}
              </span>
            </Button>
          </Link>
        ))}
      </div>
    </div>
  )
}
