import { apiClient } from './client'

export type SocialPlatform = 'instagram' | 'facebook' | 'tiktok' | 'linkedin' | 'youtube' | 'twitter'

export interface TargetAudience {
  ageRange?: { min: number; max: number }
  gender?: string[]
  locations?: string[]
  interests?: string[]
  languages?: string[]
}

export interface Campaign {
  id: string
  name: string
  description?: string
  goals?: string[]
  status: 'draft' | 'active' | 'paused' | 'completed'
  startDate?: string
  endDate?: string
  budget: number
  spend: number
  platforms?: SocialPlatform[]
  targetAudience?: TargetAudience
  targeting?: Record<string, unknown>
  impressions: number
  clicks: number
  engagements: number
  conversions: number
  reach: number
  contents?: Content[]
  userId?: string
  createdAt: string
  updatedAt: string
}

export interface Content {
  id: string
  title: string
  body: string
  type: string
  status: string
  media?: Record<string, unknown>
  platforms?: string[]
  scheduledDate?: string
  publishedDate?: string
  createdAt: string
  updatedAt: string
}

export interface CreateCampaignDto {
  name: string
  description?: string
  goals?: string[]
  status?: 'draft' | 'active' | 'paused' | 'completed'
  startDate?: string
  endDate?: string
  budget?: number
  spend?: number
  platforms?: SocialPlatform[]
  targetAudience?: TargetAudience
  targeting?: Record<string, unknown>
  contentIds?: string[]
  impressions?: number
  clicks?: number
  engagements?: number
  conversions?: number
  reach?: number
}

export interface CampaignAnalytics {
  campaignId: string
  campaignName: string
  status: string
  period: {
    startDate?: Date
    endDate?: Date
    daysTotal: number
    daysElapsed: number
    daysRemaining: number
  }
  budget: {
    allocated: number
    spent: number
    remaining: number
    utilizationPercentage: number
  }
  performance: {
    impressions: number
    reach: number
    clicks: number
    engagements: number
    conversions: number
  }
  metrics: {
    roi: number
    cpe: number
    cpc: number
    ctr: number
    engagementRate: number
  }
  content: {
    totalPieces: number
    byStatus: Record<string, number>
  }
  platforms: SocialPlatform[]
  goals: string[]
}

export const campaignsApi = {
  getAll: (params?: { status?: string; page?: number; limit?: number }) =>
    apiClient.get<{ data: Campaign[]; meta: { total: number; page: number; limit: number; totalPages: number } }>('/campaigns', params),

  getById: (id: string) => apiClient.get<Campaign>(`/campaigns/${id}`),

  create: (data: CreateCampaignDto) => apiClient.post<Campaign>('/campaigns', data),

  update: (id: string, data: Partial<CreateCampaignDto>) =>
    apiClient.patch<Campaign>(`/campaigns/${id}`, data),

  delete: (id: string) => apiClient.delete(`/campaigns/${id}`),

  getAnalytics: (id: string) => apiClient.get<CampaignAnalytics>(`/campaigns/${id}/analytics`),

  getContents: (id: string) => apiClient.get<Content[]>(`/campaigns/${id}/contents`),

  addContent: (id: string, contentId: string) =>
    apiClient.post<Campaign>(`/campaigns/${id}/contents/${contentId}`),

  removeContent: (id: string, contentId: string) =>
    apiClient.delete(`/campaigns/${id}/contents/${contentId}`),
}
