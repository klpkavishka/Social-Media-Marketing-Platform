'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface PerformanceData {
  month: string
  posts: number
  engagement: number
  followers: number
}

export function PerformanceChart() {
  const data: PerformanceData[] = [
    { month: 'Jan', posts: 8, engagement: 4.5, followers: 8.2 },
    { month: 'Feb', posts: 12, engagement: 5.2, followers: 9.1 },
    { month: 'Mar', posts: 15, engagement: 6.1, followers: 10.5 },
    { month: 'Apr', posts: 18, engagement: 7.3, followers: 11.8 },
    { month: 'May', posts: 24, engagement: 8.5, followers: 12.5 },
  ]

  return (
    <div className="rounded-lg border bg-card p-6">
      <h3 className="text-lg font-semibold mb-6">Performance Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
          <YAxis stroke="hsl(var(--muted-foreground))" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
            }}
          />
          <Legend />
          <Bar dataKey="posts" stackId="a" fill="hsl(270, 100%, 55%)" name="Posts" radius={[4, 4, 0, 0]} />
          <Bar dataKey="engagement" stackId="a" fill="hsl(200, 100%, 50%)" name="Engagement %" radius={[4, 4, 0, 0]} />
          <Bar dataKey="followers" stackId="a" fill="hsl(180, 100%, 50%)" name="Followers (K)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
