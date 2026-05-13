'use client'

import { TeamPermissions, ROLE_DESCRIPTIONS } from '@/lib/types/team'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  FileText,
  Send,
  Briefcase,
  BarChart,
  Users,
  Settings,
  Check,
  X,
} from 'lucide-react'

interface RoleAccessIndicatorProps {
  role: 'admin' | 'manager' | 'creator' | 'analyst'
  permissions: TeamPermissions
  compact?: boolean
}

const permissionDetails = {
  canCreateContent: {
    icon: FileText,
    label: 'Create Content',
    color: 'text-green-600',
  },
  canPublishContent: {
    icon: Send,
    label: 'Publish Content',
    color: 'text-blue-600',
  },
  canManageCampaigns: {
    icon: Briefcase,
    label: 'Manage Campaigns',
    color: 'text-purple-600',
  },
  canViewAnalytics: {
    icon: BarChart,
    label: 'View Analytics',
    color: 'text-orange-600',
  },
  canManageTeam: {
    icon: Users,
    label: 'Manage Team',
    color: 'text-pink-600',
  },
  canManageSettings: {
    icon: Settings,
    label: 'Manage Settings',
    color: 'text-red-600',
  },
}

export function RoleAccessIndicator({
  role,
  permissions,
  compact = false,
}: RoleAccessIndicatorProps) {
  const permissionEntries = Object.entries(permissions).filter(
    ([key]) => key !== 'default'
  ) as Array<[keyof TeamPermissions, boolean]>

  const grantedPermissions = permissionEntries.filter(([_, value]) => value)
  const deniedPermissions = permissionEntries.filter(([_, value]) => !value)

  if (compact) {
    return (
      <div className="flex flex-wrap gap-1">
        {grantedPermissions.map(([key]) => {
          const detail = permissionDetails[key as keyof typeof permissionDetails]
          const Icon = detail.icon
          return (
            <div
              key={key}
              className={`flex items-center gap-1 ${detail.color} cursor-help`}
              title={detail.label}
            >
              <Icon className="h-3.5 w-3.5" />
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Role Permissions</CardTitle>
        <CardDescription>
          {ROLE_DESCRIPTIONS[role as keyof typeof ROLE_DESCRIPTIONS]}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Granted Permissions */}
        {grantedPermissions.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Access Granted</h4>
            <div className="grid gap-2">
              {grantedPermissions.map(([key]) => {
                const detail = permissionDetails[key as keyof typeof permissionDetails]
                const Icon = detail.icon
                return (
                  <div key={key} className="flex items-center gap-3 p-2 rounded-lg bg-green-50">
                    <div className="flex-shrink-0">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{detail.label}</p>
                    </div>
                    <Icon className={`h-4 w-4 ${detail.color}`} />
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Denied Permissions */}
        {deniedPermissions.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Access Denied</h4>
            <div className="grid gap-2">
              {deniedPermissions.map(([key]) => {
                const detail = permissionDetails[key as keyof typeof permissionDetails]
                const Icon = detail.icon
                return (
                  <div key={key} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                    <div className="flex-shrink-0">
                      <X className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-muted-foreground">{detail.label}</p>
                    </div>
                    <Icon className={`h-4 w-4 text-gray-400`} />
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Summary Badge */}
        <div className="pt-2 border-t flex gap-2 flex-wrap">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            {grantedPermissions.length} permissions granted
          </Badge>
          {deniedPermissions.length > 0 && (
            <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
              {deniedPermissions.length} permissions denied
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
