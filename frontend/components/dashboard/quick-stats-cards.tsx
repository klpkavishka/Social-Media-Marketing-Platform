'use client'

import { TrendingUp, MessageCircle, Users } from 'lucide-react'

interface StatCard {
  label: string
  value: string | number
  change: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  color: string
}

export function QuickStatsCards() {
  const stats: StatCard[] = [
    {
      label: 'Posts This Month',
      value: 24,
      change: '+12% from last month',
      icon: MessageCircle,
      color: 'text-blue-500 bg-blue-500/10',
    },
    {
      label: 'Engagement Rate',
      value: '8.5%',
      change: '+2.1% increase',
      icon: TrendingUp,
      color: 'text-green-500 bg-green-500/10',
    },
    {
      label: 'Total Followers',
      value: '12.5K',
      change: '+1.2K new followers',
      icon: Users,
      color: 'text-purple-500 bg-purple-500/10',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="rounded-lg border bg-card p-6 hover:border-primary/50 transition-colors"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <p className="mt-2 text-3xl font-bold">{stat.value}</p>
              <p className="mt-2 text-xs text-green-600 dark:text-green-400">
                ↑ {stat.change}
              </p>
            </div>
            <div className={`${stat.color} p-3 rounded-lg`}>
              <stat.icon className={`h-6 w-6 ${stat.color.split(' ')[0]}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
