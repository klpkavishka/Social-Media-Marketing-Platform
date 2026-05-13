'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { TeamMemberCard } from '@/components/common/team-member-card'
import { InviteMemberDialog } from '@/components/common/invite-member-dialog'
import { TeamBulkActions } from '@/components/team/team-bulk-actions'
import { TeamActivityLog, type TeamActivity } from '@/components/team/team-activity-log'
import { SocialAccount, AccountMetrics, SocialPlatform } from '@/lib/types/social'
import { TeamMember, InviteTeamMemberData, DEFAULT_PERMISSIONS } from '@/lib/types/team'
import { useAuth } from '@/lib/hooks/use-auth'
import {
  UserPlus,
  Search,
  Filter,
  Users,
  Crown,
  FileText,
  BarChart,
  CheckCircle,
  Clock,
  UserX,
  Download,
} from 'lucide-react'
import { EmptyState } from '@/components/empty-state'
import { Tooltip } from '@/components/tooltip'

// Mock data for demonstration
const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    email: 'sarah.johnson@company.com',
    firstName: 'Sarah',
    lastName: 'Johnson',
    role: 'admin',
    status: 'active',
    organizationId: 'org-1',
    department: 'Marketing',
    lastActive: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
    joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString(),
    permissions: DEFAULT_PERMISSIONS.admin,
    avatarUrl: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=random',
  },
  {
    id: '2',
    email: 'michael.chen@company.com',
    firstName: 'Michael',
    lastName: 'Chen',
    role: 'manager',
    status: 'active',
    organizationId: 'org-1',
    department: 'Communications',
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
    permissions: DEFAULT_PERMISSIONS.manager,
    avatarUrl: 'https://ui-avatars.com/api/?name=Michael+Chen&background=random',
  },
  {
    id: '3',
    email: 'emily.rodriguez@company.com',
    firstName: 'Emily',
    lastName: 'Rodriguez',
    role: 'creator',
    status: 'active',
    organizationId: 'org-1',
    department: 'Social Media',
    lastActive: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
    joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString(),
    permissions: DEFAULT_PERMISSIONS.creator,
    avatarUrl: 'https://ui-avatars.com/api/?name=Emily+Rodriguez&background=random',
  },
  {
    id: '4',
    email: 'david.kim@company.com',
    firstName: 'David',
    lastName: 'Kim',
    role: 'analyst',
    status: 'active',
    organizationId: 'org-1',
    department: 'Analytics',
    lastActive: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    permissions: DEFAULT_PERMISSIONS.analyst,
    avatarUrl: 'https://ui-avatars.com/api/?name=David+Kim&background=random',
  },
  {
    id: '5',
    email: 'jessica.brown@company.com',
    firstName: 'Jessica',
    lastName: 'Brown',
    role: 'creator',
    status: 'invited',
    organizationId: 'org-1',
    department: 'Content',
    invitedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    invitedBy: '1',
    permissions: DEFAULT_PERMISSIONS.creator,
  },
  {
    id: '6',
    email: 'alex.turner@company.com',
    firstName: 'Alex',
    lastName: 'Turner',
    role: 'manager',
    status: 'active',
    organizationId: 'org-1',
    department: 'Marketing',
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 120).toISOString(),
    permissions: DEFAULT_PERMISSIONS.manager,
    avatarUrl: 'https://ui-avatars.com/api/?name=Alex+Turner&background=random',
  },
]

// Mock activity data
const mockActivities: TeamActivity[] = [
  {
    id: '1',
    memberId: '1',
    memberName: 'Sarah Johnson',
    memberEmail: 'sarah.johnson@company.com',
    memberAvatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=random',
    type: 'login',
    description: 'Logged in from Chrome on MacOS',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
  },
  {
    id: '2',
    memberId: '2',
    memberName: 'Michael Chen',
    memberEmail: 'michael.chen@company.com',
    memberAvatar: 'https://ui-avatars.com/api/?name=Michael+Chen&background=random',
    type: 'role_changed',
    description: 'Role changed from creator to manager',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
  {
    id: '3',
    memberId: '3',
    memberName: 'Emily Rodriguez',
    memberEmail: 'emily.rodriguez@company.com',
    memberAvatar: 'https://ui-avatars.com/api/?name=Emily+Rodriguez&background=random',
    type: 'edit',
    description: 'Updated profile information',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
  },
  {
    id: '4',
    memberId: '5',
    memberName: 'Jessica Brown',
    memberEmail: 'jessica.brown@company.com',
    type: 'invited',
    description: 'Invited to organization as Creator',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
  },
  {
    id: '5',
    memberId: '6',
    memberName: 'Alex Turner',
    memberEmail: 'alex.turner@company.com',
    memberAvatar: 'https://ui-avatars.com/api/?name=Alex+Turner&background=random',
    type: 'permission_updated',
    description: 'Permissions updated: canManageSettings enabled',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
  },
]

export default function TeamPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilters, setRoleFilters] = useState<string[]>([])
  const [statusFilters, setStatusFilters] = useState<string[]>([])
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(mockTeamMembers)
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set())

  // Filter and search team members
  const filteredMembers = useMemo(() => {
    return teamMembers.filter((member) => {
      // Search filter
      const searchLower = searchQuery.toLowerCase()
      const matchesSearch =
        searchQuery === '' ||
        member.firstName.toLowerCase().includes(searchLower) ||
        member.lastName.toLowerCase().includes(searchLower) ||
        member.email.toLowerCase().includes(searchLower) ||
        member.department?.toLowerCase().includes(searchLower)

      // Role filter
      const matchesRole = roleFilters.length === 0 || roleFilters.includes(member.role)

      // Status filter
      const matchesStatus = statusFilters.length === 0 || statusFilters.includes(member.status)

      return matchesSearch && matchesRole && matchesStatus
    })
  }, [teamMembers, searchQuery, roleFilters, statusFilters])

  // Calculate stats
  const stats = useMemo(() => {
    const activeMembers = teamMembers.filter((m) => m.status === 'active').length
    const pendingInvites = teamMembers.filter((m) => m.status === 'invited').length
    const byRole = {
      admin: teamMembers.filter((m) => m.role === 'admin').length,
      manager: teamMembers.filter((m) => m.role === 'manager').length,
      creator: teamMembers.filter((m) => m.role === 'creator').length,
      analyst: teamMembers.filter((m) => m.role === 'analyst').length,
    }

    return {
      totalMembers: teamMembers.length,
      activeMembers,
      pendingInvites,
      byRole,
    }
  }, [teamMembers])

  const handleInvite = async (data: InviteTeamMemberData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newMember: TeamMember = {
      id: `temp-${Date.now()}`,
      ...data,
      status: 'invited',
      organizationId: 'org-1',
      invitedAt: new Date().toISOString(),
      invitedBy: user?.id || '1',
      permissions: data.permissions ? { ...DEFAULT_PERMISSIONS[data.role], ...data.permissions } : DEFAULT_PERMISSIONS[data.role],
    }

    setTeamMembers([...teamMembers, newMember])
  }

  const handleEdit = (member: TeamMember) => {
    // TODO: Implement edit functionality
    console.log('Edit member:', member)
  }

  const handleRemove = (member: TeamMember) => {
    if (confirm(`Are you sure you want to remove ${member.firstName} ${member.lastName}?`)) {
      setTeamMembers(teamMembers.filter((m) => m.id !== member.id))
    }
  }

  const handleResendInvite = async (member: TeamMember) => {
    // TODO: Implement resend invite functionality
    console.log('Resend invite to:', member)
    alert(`Invitation resent to ${member.email}`)
  }

  const handleChangeRole = (member: TeamMember) => {
    // TODO: Implement role change functionality
    console.log('Change role for:', member)
  }

  const handleRoleFilterChange = (role: string) => {
    setRoleFilters((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    )
  }

  const handleStatusFilterChange = (status: string) => {
    setStatusFilters((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    )
  }

  const handleMemberSelection = (memberId: string, selected: boolean) => {
    const newSelected = new Set(selectedMembers)
    if (selected) {
      newSelected.add(memberId)
    } else {
      newSelected.delete(memberId)
    }
    setSelectedMembers(newSelected)
  }

  const handleBulkDelete = () => {
    setTeamMembers(teamMembers.filter((m) => !selectedMembers.has(m.id)))
    setSelectedMembers(new Set())
  }

  const handleBulkChangeRole = () => {
    console.log('Change role for members:', Array.from(selectedMembers))
    // TODO: Implement bulk role change
  }

  const handleBulkExport = () => {
    const selectedMembersList = teamMembers.filter((m) => selectedMembers.has(m.id))
    const csv = [
      ['Name', 'Email', 'Role', 'Status', 'Department'],
      ...selectedMembersList.map((m) => [
        `${m.firstName} ${m.lastName}`,
        m.email,
        m.role,
        m.status,
        m.department || '',
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `team-members-${Date.now()}.csv`
    a.click()
  }

  const exportTeamList = () => {
    // TODO: Implement export functionality
    console.log('Export team list')
    alert('Export feature coming soon!')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Team</h1>
          <p className="text-muted-foreground">
            Manage your team members and their permissions
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportTeamList} className="gap-2">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button onClick={() => setInviteDialogOpen(true)} className="gap-2">
            <UserPlus className="h-4 w-4" />
            Invite Member
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Tooltip content="Total number of team members in your workspace" side="top">
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Users className="h-4 w-4" />
              <p className="text-sm">Total Members</p>
            </div>
            <p className="text-2xl font-bold">{stats.totalMembers}</p>
          </div>
        </Tooltip>
        <Tooltip content="Team members who have accepted their invitation" side="top">
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <CheckCircle className="h-4 w-4" />
              <p className="text-sm">Active Members</p>
            </div>
            <p className="text-2xl font-bold text-green-600">{stats.activeMembers}</p>
          </div>
        </Tooltip>
        <Tooltip content="Invitations sent but not yet accepted" side="top">
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Clock className="h-4 w-4" />
              <p className="text-sm">Pending Invites</p>
            </div>
            <p className="text-2xl font-bold text-yellow-600">{stats.pendingInvites}</p>
          </div>
        </Tooltip>
        <Tooltip content="Distribution of team members across roles" side="top">
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground mb-1">By Role</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-1">
                <Crown className="h-3 w-3 text-purple-600" />
                <span className="text-muted-foreground">{stats.byRole.admin}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3 text-blue-600" />
                <span className="text-muted-foreground">{stats.byRole.manager}</span>
              </div>
              <div className="flex items-center gap-1">
                <FileText className="h-3 w-3 text-green-600" />
                <span className="text-muted-foreground">{stats.byRole.creator}</span>
              </div>
              <div className="flex items-center gap-1">
                <BarChart className="h-3 w-3 text-orange-600" />
                <span className="text-muted-foreground">{stats.byRole.analyst}</span>
              </div>
            </div>
          </div>
        </Tooltip>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {/* Role Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Role
                {roleFilters.length > 0 && (
                  <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                    {roleFilters.length}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Filter by role</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={roleFilters.includes('admin')}
                onCheckedChange={() => handleRoleFilterChange('admin')}
              >
                <Crown className="mr-2 h-4 w-4 text-purple-600" />
                Admin
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={roleFilters.includes('manager')}
                onCheckedChange={() => handleRoleFilterChange('manager')}
              >
                <Users className="mr-2 h-4 w-4 text-blue-600" />
                Manager
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={roleFilters.includes('creator')}
                onCheckedChange={() => handleRoleFilterChange('creator')}
              >
                <FileText className="mr-2 h-4 w-4 text-green-600" />
                Creator
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={roleFilters.includes('analyst')}
                onCheckedChange={() => handleRoleFilterChange('analyst')}
              >
                <BarChart className="mr-2 h-4 w-4 text-orange-600" />
                Analyst
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Status Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Status
                {statusFilters.length > 0 && (
                  <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                    {statusFilters.length}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={statusFilters.includes('active')}
                onCheckedChange={() => handleStatusFilterChange('active')}
              >
                <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                Active
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilters.includes('invited')}
                onCheckedChange={() => handleStatusFilterChange('invited')}
              >
                <Clock className="mr-2 h-4 w-4 text-yellow-600" />
                Invited
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilters.includes('inactive')}
                onCheckedChange={() => handleStatusFilterChange('inactive')}
              >
                <UserX className="mr-2 h-4 w-4 text-gray-600" />
                Inactive
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Team Members Grid */}
      {filteredMembers.length === 0 ? (
        <EmptyState
          title="No team members found"
          description={
            searchQuery || roleFilters.length > 0 || statusFilters.length > 0
              ? 'Try adjusting your filters or search query to find team members'
              : 'Get started by inviting your first team member to collaborate'
          }
          action={
            !searchQuery && roleFilters.length === 0 && statusFilters.length === 0
              ? {
                  label: 'Invite Member',
                  onClick: () => setInviteDialogOpen(true),
                  icon: <UserPlus className="h-4 w-4" />,
                }
              : undefined
          }
          icon={<Users className="h-16 w-16" />}
        />
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredMembers.map((member) => (
              <TeamMemberCard
                key={member.id}
                member={member}
                currentUserId={user?.id}
                isSelected={selectedMembers.has(member.id)}
                onSelectionChange={handleMemberSelection}
                onEdit={handleEdit}
                onRemove={handleRemove}
                onResendInvite={handleResendInvite}
                onChangeRole={handleChangeRole}
              />
            ))}
          </div>

          <div className="text-center text-sm text-muted-foreground">
            Showing {filteredMembers.length} of {stats.totalMembers} team members
          </div>
        </>
      )}

      {/* Bulk Actions Bar */}
      {selectedMembers.size > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40">
          <div className="mx-4 mb-4">
            <TeamBulkActions
              selectedCount={selectedMembers.size}
              onDelete={handleBulkDelete}
              onChangeRole={handleBulkChangeRole}
              onExport={handleBulkExport}
            />
          </div>
        </div>
      )}

      {/* Activity Log */}
      <TeamActivityLog activities={mockActivities} limit={5} />

      {/* Invite Member Dialog */}
      <InviteMemberDialog
        open={inviteDialogOpen}
        onOpenChange={setInviteDialogOpen}
        onInvite={handleInvite}
      />
    </div>
  )
}
