export type SocialPlatform = 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'youtube' | 'tiktok'

export type AccountStatus = 'active' | 'warning' | 'error' | 'disconnected'

export interface SocialAccount {
  id: string
  platform: SocialPlatform
  username: string
  displayName: string
  profileUrl?: string
  avatarUrl?: string
  connected: boolean
  status: AccountStatus
  followers: number
  following?: number
  posts: number
  lastSync?: string
  connectedAt: string
  accessToken?: string
  refreshToken?: string
  expiresAt?: string
  universityId: string
}

export interface AccountMetrics {
  accountId: string
  platform: SocialPlatform
  likes: number
  comments: number
  shares: number
  impressions: number
  engagement: number
  engagementRate: number
  reach: number
  profileViews: number
  period: '7d' | '30d' | '90d' | 'all'
}

export interface SocialPost {
  id: string
  accountId: string
  platform: SocialPlatform
  content: string
  mediaUrls?: string[]
  status: 'draft' | 'scheduled' | 'published' | 'failed'
  publishedAt?: string
  scheduledFor?: string
  likes: number
  comments: number
  shares: number
  engagement: number
  postUrl?: string
}

export interface PlatformConfig {
  name: string
  value: SocialPlatform
  color: string
  bgColor: string
  textColor: string
  icon: string
  authUrl?: string
  scopes?: string[]
  enabled: boolean
}
