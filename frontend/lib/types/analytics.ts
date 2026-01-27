export interface AnalyticsEvent {
  id: string
  eventType: 'post_published' | 'engagement' | 'reach' | 'click'
  platform: string
  contentId?: string
  value: number
  metadata: Record<string, any>
  timestamp: string
}

export interface MetricData {
  date: string
  value: number
  label?: string
}

export interface PlatformStats {
  platform: string
  posts: number
  engagement: number
  reach: number
  followers: number
  engagementRate: number
}
