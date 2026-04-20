'use client'

import { redirect } from 'next/navigation'
import { useEffect } from 'react'

export default function AnalyticsPage() {
  useEffect(() => {
    // Redirect to dashboard view by default
    redirect('/dashboard/analytics/dashboard')
  }, [])

  return null
}
