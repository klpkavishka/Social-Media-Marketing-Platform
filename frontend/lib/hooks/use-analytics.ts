import { useQuery } from '@tanstack/react-query'
import { analyticsApi } from '@/lib/api/analytics'

export function useAnalyticsOverview(params?: { startDate?: string; endDate?: string }) {
  return useQuery({
    queryKey: ['analytics', 'overview', params],
    queryFn: () => analyticsApi.getOverview(params),
  })
}

export function usePlatformMetrics(params?: { startDate?: string; endDate?: string }) {
  return useQuery({
    queryKey: ['analytics', 'platform-metrics', params],
    queryFn: () => analyticsApi.getPlatformMetrics(params),
  })
}

export function useEngagementTrends(params?: {
  startDate?: string
  endDate?: string
  platform?: string
}) {
  return useQuery({
    queryKey: ['analytics', 'engagement-trends', params],
    queryFn: () => analyticsApi.getEngagementTrends(params),
  })
}
