'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow, format } from 'date-fns'
import {
  LogIn,
  LogOut,
  Edit,
  UserCheck,
  UserX,
  Settings,
  Lock,
  Activity,
} from 'lucide-react'

export type ActivityType = 'login' | 'logout' | 'edit' | 'invited' | 'removed' | 'role_changed' | 'permission_updated'

export interface TeamActivity {
  id: string
  memberId: string
  memberName: string
  memberEmail: string
  memberAvatar?: string
  type: ActivityType
  description: string
  timestamp: string
  metadata?: Record<string, unknown>
}

interface TeamActivityLogProps {
  activities: TeamActivity[]
  compact?: boolean
  limit?: number
}

const activityConfig = {
  login: {
    icon: LogIn,
    color: 'text-green-600',
    bg: 'bg-green-50',
    label: 'Logged in',
  },
  logout: {
    icon: LogOut,
    color: 'text-gray-600',
    bg: 'bg-gray-50',
    label: 'Logged out',
  },
  edit: {
    icon: Edit,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    label: 'Profile edited',
  },
  invited: {
    icon: UserCheck,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    label: 'Member invited',
  },
  removed: {
    icon: UserX,
    color: 'text-red-600',
    bg: 'bg-red-50',
    label: 'Member removed',
  },
  role_changed: {
    icon: Settings,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    label: 'Role changed',
  },
  permission_updated: {
    icon: Lock,
    color: 'text-pink-600',
    bg: 'bg-pink-50',
    label: 'Permissions updated',
  },
}

export function TeamActivityLog({
  activities,
  compact = false,
  limit = 10,
}: TeamActivityLogProps) {
  const displayActivities = activities.slice(0, limit)

  if (activities.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-lg font-semibold">No activity yet</p>
            <p className="text-sm text-muted-foreground">Team member activities will appear here</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (compact) {
    return (
      <div className="space-y-3">
        {displayActivities.map((activity) => {
          const config = activityConfig[activity.type]
          const Icon = config.icon
          return (
            <div key={activity.id} className="flex items-start gap-3 pb-3 border-b last:border-0">
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage src={activity.memberAvatar} alt={activity.memberName} />
                <AvatarFallback>
                  {activity.memberName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Icon className={`h-3.5 w-3.5 ${config.color} flex-shrink-0`} />
                  <p className="text-sm font-medium truncate">{activity.memberName}</p>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{activity.description}</p>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Log</CardTitle>
        <CardDescription>
          {displayActivities.length} of {activities.length} recent activities
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {displayActivities.map((activity) => {
          const config = activityConfig[activity.type]
          const Icon = config.icon
          return (
            <div key={activity.id} className={`flex items-start gap-4 p-4 rounded-lg ${config.bg}`}>
              {/* Avatar */}
              <Avatar className="h-10 w-10 flex-shrink-0">
                <AvatarImage src={activity.memberAvatar} alt={activity.memberName} />
                <AvatarFallback>
                  {activity.memberName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Icon className={`h-4 w-4 ${config.color} flex-shrink-0`} />
                  <h4 className="font-semibold text-sm">{activity.memberName}</h4>
                  <Badge variant="outline" className="text-xs">
                    {config.label}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{format(new Date(activity.timestamp), 'MMM d, yyyy')}</span>
                  <span>•</span>
                  <span>{format(new Date(activity.timestamp), 'h:mm a')}</span>
                  <span>•</span>
                  <span>{formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}</span>
                </div>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
