# Analytics UI Components

This folder contains the UI components for the analytics dashboard. All components are built to work with mock data initially and can be easily integrated with API calls later.

## Components

### MetricsOverview
Displays key performance metrics in a grid layout.

**Props:**
- `metrics`: Array of metric objects with title, value, change, trend, icon
- `className`: Optional CSS class

**Usage:**
```tsx
import { MetricsOverview } from '@/components/analytics'

<MetricsOverview metrics={metricsData} />
```

### EngagementChart
Line chart visualization for engagement trends over time.

**Props:**
- `data`: Array of MetricData objects with date and value
- `title`: Chart title
- `description`: Chart description
- `showTabs`: Boolean to show/hide time period tabs
- `className`: Optional CSS class

**Usage:**
```tsx
import { EngagementChart } from '@/components/analytics'

<EngagementChart 
  data={timeSeriesData}
  title="Engagement Trends"
  description="Daily engagement over time"
/>
```

### PlatformBreakdown
Shows performance metrics broken down by social media platform.

**Props:**
- `platforms`: Array of PlatformStats objects
- `className`: Optional CSS class

**Usage:**
```tsx
import { PlatformBreakdown } from '@/components/analytics'

<PlatformBreakdown platforms={platformStats} />
```

### TopPerformingPosts
Displays a ranked list of best-performing content.

**Props:**
- `posts`: Array of post objects with engagement metrics
- `limit`: Number of posts to display (default: 5)
- `className`: Optional CSS class

**Usage:**
```tsx
import { TopPerformingPosts } from '@/components/analytics'

<TopPerformingPosts posts={topPosts} limit={5} />
```

### EngagementBreakdown
Shows distribution of different types of engagement (likes, comments, shares, clicks).

**Props:**
- `data`: Array of engagement type objects with label, value, and percentage
- `className`: Optional CSS class

**Usage:**
```tsx
import { EngagementBreakdown } from '@/components/analytics'

<EngagementBreakdown data={engagementByType} />
```

### AudienceDemographics
Multi-tab component showing audience insights including age, gender, location, and activity patterns.

**Props:**
- `ageGroups`: Array of age group data
- `gender`: Array of gender distribution data
- `topLocations`: Array of location data
- `activeHours`: Array of peak activity hours
- `className`: Optional CSS class

**Usage:**
```tsx
import { AudienceDemographics } from '@/components/analytics'

<AudienceDemographics 
  ageGroups={audienceData.ageGroups}
  gender={audienceData.gender}
  topLocations={audienceData.locations}
  activeHours={audienceData.activeHours}
/>
```

## Mock Data

Mock data is available in `@/lib/mock/analytics-data.ts`. This includes:
- `mockMetricsData`: Key metrics with trend data
- `mockPlatformStats`: Platform-specific statistics
- `mockEngagementByType`: Engagement breakdown by type
- `mockTopPosts`: Sample top-performing posts
- `mockAudienceData`: Demographic and activity data
- `mockTimeSeriesData`: Time-series data for charts

## API Integration Guide

When ready to integrate with real APIs, follow these steps:

### 1. Create API Service Functions

Create a new file `frontend/lib/api/analytics.ts`:

```typescript
import { apiClient } from './client'
import { MetricData, PlatformStats } from '../types/analytics'

export async function getMetricsOverview(dateRange: string) {
  const response = await apiClient.get(`/analytics/metrics?range=${dateRange}`)
  return response.data
}

export async function getEngagementData(dateRange: string) {
  const response = await apiClient.get<MetricData[]>(`/analytics/engagement?range=${dateRange}`)
  return response.data
}

export async function getPlatformStats(dateRange: string) {
  const response = await apiClient.get<PlatformStats[]>(`/analytics/platforms?range=${dateRange}`)
  return response.data
}

export async function getTopPosts(limit: number = 5) {
  const response = await apiClient.get(`/analytics/top-posts?limit=${limit}`)
  return response.data
}

export async function getAudienceDemographics() {
  const response = await apiClient.get('/analytics/audience')
  return response.data
}
```

### 2. Use React Query (or similar) for Data Fetching

Update the analytics dashboard page to use data fetching:

```typescript
'use client'

import { useQuery } from '@tanstack/react-query'
import { getMetricsOverview, getEngagementData, getPlatformStats } from '@/lib/api/analytics'

export default function AnalyticsDashboardPage() {
  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['metrics', '30d'],
    queryFn: () => getMetricsOverview('30d'),
  })

  const { data: engagementData } = useQuery({
    queryKey: ['engagement', '30d'],
    queryFn: () => getEngagementData('30d'),
  })

  const { data: platformStats } = useQuery({
    queryKey: ['platforms', '30d'],
    queryFn: () => getPlatformStats('30d'),
  })

  if (metricsLoading) {
    return <LoadingSpinner />
  }

  return (
    <div>
      <MetricsOverview metrics={metrics} />
      <EngagementChart data={engagementData} />
      <PlatformBreakdown platforms={platformStats} />
    </div>
  )
}
```

### 3. Add Loading and Error States

Enhance components with loading skeletons and error handling:

```typescript
{metricsLoading ? (
  <MetricsOverviewSkeleton />
) : metricsError ? (
  <ErrorMessage error={metricsError} />
) : (
  <MetricsOverview metrics={metrics} />
)}
```

### 4. Replace Mock Data Imports

Remove mock data imports and replace with API calls:

```diff
- import { mockMetricsData } from '@/lib/mock/analytics-data'
+ import { getMetricsOverview } from '@/lib/api/analytics'
```

## Type Definitions

All TypeScript types are defined in `@/lib/types/analytics.ts`:
- `AnalyticsEvent`
- `MetricData`
- `PlatformStats`

Add additional types as needed when integrating with the backend API.

## Testing

Components accept data as props, making them easy to test:

```typescript
import { render, screen } from '@testing-library/react'
import { MetricsOverview } from './MetricsOverview'

test('renders metrics correctly', () => {
  const metrics = [
    { title: 'Engagement', value: '1000', change: 10, trend: 'up', icon: Heart }
  ]
  render(<MetricsOverview metrics={metrics} />)
  expect(screen.getByText('1000')).toBeInTheDocument()
})
```

## Future Enhancements

1. **Add Date Range Picker**: Allow users to select custom date ranges
2. **Export Functionality**: Add CSV/PDF export capabilities
3. **Real-time Updates**: Implement WebSocket for live data updates
4. **Interactive Charts**: Consider using a charting library like Recharts or Chart.js for more advanced visualizations
5. **Filtering**: Add filters for specific platforms, campaigns, or content types
6. **Comparison Mode**: Compare metrics across different time periods
7. **Custom Metrics**: Allow users to create custom metric dashboards
