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

// Mock data for demonstration
const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    email: 'sarah.johnson@university.edu',
    firstName: 'Sarah',
    lastName: 'Johnson',
    role: 'admin',
    status: 'active',
    universityId: 'univ-1',
    department: 'Marketing',
    lastActive: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
    joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString(),
    permissions: DEFAULT_PERMISSIONS.admin,
    avatarUrl: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=random',
  },
  {
    id: '2',
    email: 'michael.chen@university.edu',
    firstName: 'Michael',
    lastName: 'Chen',
    role: 'manager',
    status: 'active',
    universityId: 'univ-1',
    department: 'Communications',
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
    permissions: DEFAULT_PERMISSIONS.manager,
    avatarUrl: 'https://ui-avatars.com/api/?name=Michael+Chen&background=random',
  },
  {
    id: '3',
    email: 'emily.rodriguez@university.edu',
    firstName: 'Emily',
    lastName: 'Rodriguez',
    role: 'creator',
    status: 'active',
    universityId: 'univ-1',
    department: 'Social Media',
    lastActive: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
    joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString(),
    permissions: DEFAULT_PERMISSIONS.creator,
    avatarUrl: 'https://ui-avatars.com/api/?name=Emily+Rodriguez&background=random',
  },
  {
    id: '4',
    email: 'david.kim@university.edu',
    firstName: 'David',
    lastName: 'Kim',
    role: 'analyst',
    status: 'active',
    universityId: 'univ-1',
    department: 'Analytics',
    lastActive: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    permissions: DEFAULT_PERMISSIONS.analyst,
    avatarUrl: 'https://ui-avatars.com/api/?name=David+Kim&background=random',
  },
  {
    id: '5',
    email: 'jessica.brown@university.edu',
    firstName: 'Jessica',
    lastName: 'Brown',
    role: 'creator',
    status: 'invited',
    universityId: 'univ-1',
    department: 'Content',
    invitedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    invitedBy: '1',
    permissions: DEFAULT_PERMISSIONS.creator,
  },
  {
    id: '6',
    email: 'alex.turner@university.edu',
    firstName: 'Alex',
    lastName: 'Turner',
    role: 'manager',
    status: 'active',
    universityId: 'univ-1',
    department: 'Marketing',
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 120).toISOString(),
    permissions: DEFAULT_PERMISSIONS.manager,
    avatarUrl: 'https://ui-avatars.com/api/?name=Alex+Turner&background=random',
  },
]

export default function TeamPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilters, setRoleFilters] = useState<string[]>([])
  const [statusFilters, setStatusFilters] = useState<string[]>([])
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(mockTeamMembers)

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
      universityId: 'univ-1',
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
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Users className="h-4 w-4" />
            <p className="text-sm">Total Members</p>
          </div>
          <p className="text-2xl font-bold">{stats.totalMembers}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <CheckCircle className="h-4 w-4" />
            <p className="text-sm">Active Members</p>
          </div>
          <p className="text-2xl font-bold text-green-600">{stats.activeMembers}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Clock className="h-4 w-4" />
            <p className="text-sm">Pending Invites</p>
          </div>
          <p className="text-2xl font-bold text-yellow-600">{stats.pendingInvites}</p>
        </div>
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
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No team members found</h3>
          <p className="text-muted-foreground">
            {searchQuery || roleFilters.length > 0 || statusFilters.length > 0
              ? 'Try adjusting your filters or search query'
              : 'Get started by inviting your first team member'}
          </p>
          {!searchQuery && roleFilters.length === 0 && statusFilters.length === 0 && (
            <Button onClick={() => setInviteDialogOpen(true)} className="mt-4 gap-2">
              <UserPlus className="h-4 w-4" />
              Invite Member
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredMembers.map((member) => (
              <TeamMemberCard
                key={member.id}
                member={member}
                currentUserId={user?.id}
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

      {/* Invite Member Dialog */}
      <InviteMemberDialog
        open={inviteDialogOpen}
        onOpenChange={setInviteDialogOpen}
        onInvite={handleInvite}
      />
    </div>
  )
}
