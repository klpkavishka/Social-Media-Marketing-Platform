'use client'

import { TeamMember } from '@/lib/types/team'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Card, CardContent } from '@/components/ui/card'
import {
  MoreVertical,
  Mail,
  Shield,
  UserX,
  Edit,
  RefreshCw,
  Crown,
  Users,
  FileText,
  BarChart,
  Clock,
  AlertCircle,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface TeamMemberCardProps {
  member: TeamMember
  currentUserId?: string
  isSelected?: boolean
  onSelectionChange?: (memberId: string, selected: boolean) => void
  onEdit?: (member: TeamMember) => void
  onRemove?: (member: TeamMember) => void
  onResendInvite?: (member: TeamMember) => void
  onChangeRole?: (member: TeamMember) => void
}

const roleIcons = {
  admin: Crown,
  manager: Users,
  creator: FileText,
  analyst: BarChart,
}

const roleColors = {
  admin: 'text-purple-600 bg-purple-50 border-purple-200',
  manager: 'text-blue-600 bg-blue-50 border-blue-200',
  creator: 'text-green-600 bg-green-50 border-green-200',
  analyst: 'text-orange-600 bg-orange-50 border-orange-200',
}

const statusColors = {
  active: 'bg-green-500',
  invited: 'bg-yellow-500',
  inactive: 'bg-gray-400',
}

export function TeamMemberCard({
  member,
  currentUserId,
  isSelected = false,
  onSelectionChange,
  onEdit,
  onRemove,
  onResendInvite,
  onChangeRole,
}: TeamMemberCardProps) {
  const isCurrentUser = currentUserId === member.id
  const RoleIcon = roleIcons[member.role]

  const getInitials = () => {
    return `${member.firstName[0]}${member.lastName[0]}`.toUpperCase()
  }

  const getStatusText = () => {
    switch (member.status) {
      case 'active':
        return member.lastActive
          ? `Active ${formatDistanceToNow(new Date(member.lastActive), { addSuffix: true })}`
          : 'Active'
      case 'invited':
        return member.invitedAt
          ? `Invited ${formatDistanceToNow(new Date(member.invitedAt), { addSuffix: true })}`
          : 'Invited'
      case 'inactive':
        return 'Inactive'
      default:
        return ''
    }
  }

  const handleCheckboxChange = (checked: boolean) => {
    onSelectionChange?.(member.id, checked)
  }

  return (
    <Card className={`hover:shadow-md transition-all ${isSelected ? 'border-primary bg-primary/5' : ''}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          {/* Checkbox */}
          {onSelectionChange && (
            <div className="flex-shrink-0 pt-0.5">
              <Checkbox
                checked={isSelected}
                onCheckedChange={handleCheckboxChange}
                disabled={isCurrentUser}
                aria-label={`Select ${member.firstName} ${member.lastName}`}
              />
            </div>
          )}

          {/* Member Info */}
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <div className="relative flex-shrink-0">
              <Avatar className="h-12 w-12">
                <AvatarImage src={member.avatarUrl} alt={`${member.firstName} ${member.lastName}`} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <span
                className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full border-2 border-white ${
                  statusColors[member.status]
                }`}
                title={member.status}
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-lg truncate">
                  {member.firstName} {member.lastName}
                </h3>
                {isCurrentUser && (
                  <Badge variant="outline" className="text-xs flex-shrink-0">
                    You
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Mail className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{member.email}</span>
              </div>

              {member.department && (
                <p className="text-sm text-muted-foreground mb-2">{member.department}</p>
              )}

              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                <Clock className="h-3 w-3 flex-shrink-0" />
                <span>{getStatusText()}</span>
              </div>

              {/* Status Alert for Invited Members */}
              {member.status === 'invited' && (
                <div className="flex items-center gap-2 text-xs text-yellow-700 bg-yellow-50 p-2 rounded">
                  <AlertCircle className="h-3 w-3 flex-shrink-0" />
                  <span>Invitation pending - no access yet</span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          {!isCurrentUser && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(member)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Member
                  </DropdownMenuItem>
                )}
                {onChangeRole && (
                  <DropdownMenuItem onClick={() => onChangeRole(member)}>
                    <Shield className="mr-2 h-4 w-4" />
                    Change Role
                  </DropdownMenuItem>
                )}
                {member.status === 'invited' && onResendInvite && (
                  <DropdownMenuItem onClick={() => onResendInvite(member)}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Resend Invitation
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                {onRemove && (
                  <DropdownMenuItem
                    onClick={() => onRemove(member)}
                    className="text-destructive focus:text-destructive"
                  >
                    <UserX className="mr-2 h-4 w-4" />
                    Remove Member
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Role Badge and Permissions */}
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${roleColors[member.role]}`}>
              <RoleIcon className="h-4 w-4" />
              <span className="text-sm font-medium capitalize">{member.role}</span>
            </div>

            {/* Permissions Summary */}
            {member.permissions && (
              <div className="flex gap-1">
                {member.permissions.canCreateContent && (
                  <div className="text-xs text-muted-foreground" title="Can create content">
                    <FileText className="h-3.5 w-3.5" />
                  </div>
                )}
                {member.permissions.canManageCampaigns && (
                  <div className="text-xs text-muted-foreground" title="Can manage campaigns">
                    <Users className="h-3.5 w-3.5" />
                  </div>
                )}
                {member.permissions.canViewAnalytics && (
                  <div className="text-xs text-muted-foreground" title="Can view analytics">
                    <BarChart className="h-3.5 w-3.5" />
                  </div>
                )}
                {member.permissions.canManageSettings && (
                  <div className="text-xs text-muted-foreground" title="Can manage settings">
                    <Shield className="h-3.5 w-3.5" />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
