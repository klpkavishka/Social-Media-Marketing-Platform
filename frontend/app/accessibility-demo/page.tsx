'use client'

import { AccessibilityShowcase } from '@/components/accessibility-showcase'

/**
 * Accessibility & UX Demo Page
 * Showcases Phase 2.14 accessibility and UX improvements
 */
export default function AccessibilityPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <AccessibilityShowcase />
      </div>
    </div>
  )
}
