import { apiClient } from './client'

export interface AnalyticsOverview {
  totalPosts: number
  totalEngagement: number
  totalReach: number
  engagementRate: number
  periodStart: string
  periodEnd: string
}

export interface PlatformMetrics {
  platform: string
  posts: number
  engagement: number
  reach: number
  followers: number
}

export const analyticsApi = {
  getOverview: (params?: { startDate?: string; endDate?: string }) =>
    apiClient.get<AnalyticsOverview>('/analytics/overview', params),

  getPlatformMetrics: (params?: { startDate?: string; endDate?: string }) =>
    apiClient.get<PlatformMetrics[]>('/analytics/platform-metrics', params),

  getEngagementTrends: (params?: { startDate?: string; endDate?: string; platform?: string }) =>
    apiClient.get<any>('/analytics/engagement-trends', params),

  getSentimentAnalysis: (contentId: string) =>
    apiClient.get<any>(`/analytics/sentiment/${contentId}`),
}
