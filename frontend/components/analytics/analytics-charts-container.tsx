'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts'

interface AnalyticsChartsContainerProps {
  trendData?: Array<{ date: string; engagement: number; reach: number; followers: number }>
  platformData?: Array<{ name: string; value: number }>
  comparisonData?: Array<{ name: string; current: number; previous: number }>
}

const defaultTrendData = [
  { date: 'May 1', engagement: 2400, reach: 9200, followers: 2210 },
  { date: 'May 3', engagement: 1398, reach: 2210, followers: 9290 },
  { date: 'May 5', engagement: 9800, reach: 9290, followers: 7490 },
  { date: 'May 7', engagement: 3908, reach: 7490, followers: 7000 },
  { date: 'May 9', engagement: 4800, reach: 7000, followers: 8490 },
  { date: 'May 11', engagement: 3490, reach: 8490, followers: 9110 },
]

const defaultPlatformData = [
  { name: 'Instagram', value: 35 },
  { name: 'Facebook', value: 28 },
  { name: 'Twitter', value: 22 },
  { name: 'LinkedIn', value: 15 },
]

const defaultComparisonData = [
  { name: 'Posts', current: 145, previous: 128 },
  { name: 'Engagement', current: 8432, previous: 6821 },
  { name: 'Reach', current: 125400, previous: 112300 },
  { name: 'Followers', current: 45200, previous: 43055 },
]

const platformColors = ['#a855f7', '#3b82f6', '#06b6d4', '#8b5cf6']

export function AnalyticsChartsContainer({
  trendData = defaultTrendData,
  platformData = defaultPlatformData,
  comparisonData = defaultComparisonData
}: AnalyticsChartsContainerProps) {
  return (
    <div className="space-y-6">
      {/* Trend Line Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Trends</CardTitle>
          <CardDescription>Engagement, reach, and follower growth over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="date" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-background)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="engagement"
                stroke="#a855f7"
                strokeWidth={2}
                dot={{ fill: '#a855f7' }}
                name="Engagement"
              />
              <Line
                type="monotone"
                dataKey="reach"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6' }}
                name="Reach"
              />
              <Line
                type="monotone"
                dataKey="followers"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: '#10b981' }}
                name="Followers"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Platform Breakdown & Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Platform Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Breakdown</CardTitle>
            <CardDescription>Distribution of engagement across platforms</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={platformData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {platformData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={platformColors[index % platformColors.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-background)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Comparison Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Period Comparison</CardTitle>
            <CardDescription>Current vs. previous period metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="name" stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-background)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar dataKey="current" fill="#a855f7" name="Current Period" />
                <Bar dataKey="previous" fill="#cbd5e1" name="Previous Period" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
