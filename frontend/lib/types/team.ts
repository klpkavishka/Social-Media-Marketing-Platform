export interface TeamMember {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'admin' | 'manager' | 'creator' | 'analyst'
  status: 'active' | 'invited' | 'inactive'
  avatarUrl?: string
  universityId: string
  department?: string
  lastActive?: string
  invitedAt?: string
  joinedAt?: string
  invitedBy?: string
  permissions?: TeamPermissions
}

export interface TeamPermissions {
  canCreateContent: boolean
  canPublishContent: boolean
  canManageCampaigns: boolean
  canViewAnalytics: boolean
  canManageTeam: boolean
  canManageSettings: boolean
}

export interface InviteTeamMemberData {
  email: string
  firstName: string
  lastName: string
  role: 'admin' | 'manager' | 'creator' | 'analyst'
  department?: string
  permissions?: Partial<TeamPermissions>
}

export interface TeamStats {
  totalMembers: number
  activeMembers: number
  pendingInvites: number
  byRole: {
    admin: number
    manager: number
    creator: number
    analyst: number
  }
}

export const ROLE_DESCRIPTIONS = {
  admin: 'Full access to all features and settings',
  manager: 'Can manage campaigns, content, and team members',
  creator: 'Can create and edit content',
  analyst: 'Can view analytics and reports',
} as const

export const DEFAULT_PERMISSIONS: Record<string, TeamPermissions> = {
  admin: {
    canCreateContent: true,
    canPublishContent: true,
    canManageCampaigns: true,
    canViewAnalytics: true,
    canManageTeam: true,
    canManageSettings: true,
  },
  manager: {
    canCreateContent: true,
    canPublishContent: true,
    canManageCampaigns: true,
    canViewAnalytics: true,
    canManageTeam: true,
    canManageSettings: false,
  },
  creator: {
    canCreateContent: true,
    canPublishContent: false,
    canManageCampaigns: false,
    canViewAnalytics: false,
    canManageTeam: false,
    canManageSettings: false,
  },
  analyst: {
    canCreateContent: false,
    canPublishContent: false,
    canManageCampaigns: false,
    canViewAnalytics: true,
    canManageTeam: false,
    canManageSettings: false,
  },
}
