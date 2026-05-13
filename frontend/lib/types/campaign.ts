export interface Campaign {
  id: string
  name: string
  description: string
  status: 'active' | 'paused' | 'completed'
  startDate: string
  endDate: string
  budget?: number
  platforms: string[]
  organizationId: string
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface CampaignMetrics {
  campaignId: string
  totalPosts: number
  totalEngagement: number
  totalReach: number
  totalSpent: number
  roi: number
}
