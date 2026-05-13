'use client'

import React, { useState } from 'react'
import { ArrowRight, CheckCircle2, Zap, Users, BarChart3, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface OnboardingStep {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  action: string
}

interface MultiStepOnboardingProps {
  onComplete?: () => void
  onSkip?: () => void
}

export function MultiStepOnboarding({ onComplete, onSkip }: MultiStepOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<string[]>([])

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to ArcFlow',
      description: 'Let&apos;s get you set up and ready to manage your social media like a pro.',
      icon: <Zap className="h-8 w-8 text-yellow-500" />,
      action: 'Get started',
    },
    {
      id: 'accounts',
      title: 'Connect Your Accounts',
      description: 'Link your social media accounts (Facebook, Instagram, Twitter, LinkedIn, TikTok, YouTube) to start publishing.',
      icon: <Users className="h-8 w-8 text-blue-500" />,
      action: 'Connect accounts',
    },
    {
      id: 'team',
      title: 'Invite Your Team',
      description: 'Add team members and set up roles for collaborative content management and approval workflows.',
      icon: <Users className="h-8 w-8 text-purple-500" />,
      action: 'Invite team',
    },
    {
      id: 'analytics',
      title: 'Enable Analytics',
      description: 'Start tracking your social media performance with real-time analytics and insights.',
      icon: <BarChart3 className="h-8 w-8 text-green-500" />,
      action: 'View analytics',
    },
    {
      id: 'settings',
      title: 'Customize Settings',
      description: 'Configure your preferences, notification settings, and integrations to suit your workflow.',
      icon: <Settings className="h-8 w-8 text-gray-500" />,
      action: 'Go to settings',
    },
  ]

  const step = steps[currentStep]
  const progress = ((currentStep + 1) / steps.length) * 100

  const handleStepComplete = () => {
    setCompletedSteps([...completedSteps, step.id])
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      if (onComplete) onComplete()
    }
  }

  const handleSkip = () => {
    if (onSkip) {
      onSkip()
    } else {
      if (onComplete) onComplete()
    }
  }

  return (
    <div className="w-full max-w-2xl">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">
            Step {currentStep + 1} of {steps.length}
          </span>
          <button
            onClick={handleSkip}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip onboarding
          </button>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-600 to-blue-600 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step indicator */}
      <div className="grid grid-cols-5 gap-2 mb-12">
        {steps.map((s, index) => (
          <div
            key={s.id}
            className={`relative flex items-center justify-center rounded-full h-10 font-medium text-xs transition-all ${
              index < currentStep
                ? 'bg-green-500 text-white'
                : index === currentStep
                  ? 'bg-gradient-to-r from-violet-600 to-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-muted-foreground'
            }`}
          >
            {index < currentStep ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <span>{index + 1}</span>
            )}
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="text-center space-y-6">
        <div>
          <div className="flex justify-center mb-4">
            {step.icon}
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-2">{step.title}</h2>
          <p className="text-muted-foreground text-lg">{step.description}</p>
        </div>

        {/* Step-specific content */}
        {step.id === 'welcome' && (
          <div className="rounded-lg bg-gradient-to-br from-violet-50 to-blue-50 dark:from-violet-950/30 dark:to-blue-950/30 p-6 space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-gradient-primary">50K+</p>
                <p className="text-xs text-muted-foreground">Active Users</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gradient-secondary">100K+</p>
                <p className="text-xs text-muted-foreground">Posts Scheduled</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-accent">95%</p>
                <p className="text-xs text-muted-foreground">Satisfaction</p>
              </div>
            </div>
          </div>
        )}

        {step.id === 'accounts' && (
          <div className="space-y-3">
            {['Facebook', 'Instagram', 'Twitter', 'LinkedIn', 'TikTok', 'YouTube'].map((platform) => (
              <div key={platform} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/30 transition-colors">
                <div className="w-2 h-2 rounded-full bg-gray-300" />
                <span className="text-sm">{platform}</span>
                <span className="ml-auto text-xs text-muted-foreground">Not connected</span>
              </div>
            ))}
          </div>
        )}

        {step.id === 'team' && (
          <div className="space-y-3">
            <div className="rounded-lg border border-dashed border-border p-4">
              <p className="text-sm text-muted-foreground mb-3">Add team members via email</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="colleague@company.com"
                  className="flex-1 px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <Button size="sm">Add</Button>
              </div>
            </div>
          </div>
        )}

        {step.id === 'analytics' && (
          <div className="rounded-lg bg-gray-50 dark:bg-gray-900/50 p-6">
            <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-3 opacity-50" />
            <p className="text-sm text-muted-foreground">Real-time analytics coming soon</p>
          </div>
        )}

        {step.id === 'settings' && (
          <div className="rounded-lg bg-gray-50 dark:bg-gray-900/50 p-6 space-y-3">
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <span className="text-sm">Email notifications</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <span className="text-sm">Daily digest</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span className="text-sm">Marketing emails</span>
            </label>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-6">
          {currentStep > 0 && (
            <Button
              onClick={() => setCurrentStep(currentStep - 1)}
              variant="outline"
              className="flex-1"
            >
              Back
            </Button>
          )}
          <Button
            onClick={handleStepComplete}
            className="flex-1"
          >
            {currentStep === steps.length - 1 ? 'Complete Setup' : step.action}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}
