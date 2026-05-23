'use client'

import React, { useState } from 'react'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface SignupFormData {
  email: string
  industry: string
  teamSize: string
  acceptTerms: boolean
}

interface EnhancedSignupFormProps {
  onSubmit: (data: SignupFormData) => void
  isLoading?: boolean
  onSkip?: () => void
}

const industries = [
  'Agency',
  'Technology',
  'E-commerce',
  'Finance',
  'Healthcare',
  'Education',
  'Non-profit',
  'Real Estate',
  'Hospitality',
  'Other',
]

const teamSizes = [
  { value: '1', label: 'Just me' },
  { value: '2-5', label: '2-5 people' },
  { value: '6-20', label: '6-20 people' },
  { value: '21-50', label: '21-50 people' },
  { value: '50+', label: '50+ people' },
]

export function EnhancedSignupForm({ onSubmit, isLoading = false, onSkip }: EnhancedSignupFormProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<SignupFormData>({
    email: '',
    industry: '',
    teamSize: '',
    acceptTerms: false,
  })

  const handleEmailSubmit = () => {
    if (formData.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setStep(2)
    }
  }

  const handleDetailsSubmit = () => {
    if (formData.industry && formData.teamSize && formData.acceptTerms) {
      onSubmit(formData)
    }
  }

  const handleSkip = () => {
    if (onSkip) {
      onSkip()
    } else {
      // If skipping, just proceed with minimal data
      onSubmit({
        email: formData.email,
        industry: '',
        teamSize: '',
        acceptTerms: formData.acceptTerms,
      })
    }
  }

  return (
    <div className="w-full space-y-6">
      {/* Progress indicator */}
      <div className="flex gap-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i <= step ? 'bg-gradient-to-r from-violet-600 to-blue-600' : 'bg-gray-200 dark:bg-gray-700'
            }`}
          />
        ))}
      </div>

      {/* Step 1: Email */}
      {step === 1 && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Your Email</label>
            <input
              type="email"
              placeholder="you@company.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <p className="text-xs text-muted-foreground mt-2">We&apos;ll use this to create your account</p>
          </div>
          <Button
            onClick={handleEmailSubmit}
            disabled={!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)}
            className="w-full"
          >
            Continue <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}

      {/* Step 2: Industry & Team Size */}
      {step === 2 && (
        <div className="space-y-4">
          <div>
            <label htmlFor="industry" className="block text-sm font-semibold text-foreground mb-2">What industry are you in?</label>
            <select
              id="industry"
              title="Industry"
              aria-label="Industry"
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">Select an industry...</option>
              {industries.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">Team size</label>
            <div className="space-y-2">
              {teamSizes.map((size) => (
                <label key={size.value} className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                  <input
                    type="radio"
                    name="teamSize"
                    value={size.value}
                    checked={formData.teamSize === size.value}
                    onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium text-foreground">{size.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => setStep(1)}
              variant="outline"
              className="flex-1"
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
            <Button
              onClick={() => setStep(3)}
              disabled={!formData.industry || !formData.teamSize}
              className="flex-1"
            >
              Continue <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Terms & Confirmation */}
      {step === 3 && (
        <div className="space-y-4">
          <div className="rounded-lg bg-muted/30 p-4">
            <p className="text-sm font-medium text-foreground mb-2">Review your information:</p>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>Email: <span className="text-foreground font-medium">{formData.email}</span></p>
              <p>Industry: <span className="text-foreground font-medium">{formData.industry}</span></p>
              <p>Team size: <span className="text-foreground font-medium">{teamSizes.find((s) => s.value === formData.teamSize)?.label}</span></p>
            </div>
          </div>

          <label className="flex items-start gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
            <input
              type="checkbox"
              checked={formData.acceptTerms}
              onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
              className="w-4 h-4 mt-1"
            />
            <span className="text-xs text-muted-foreground">
              I agree to the{' '}
              <a href="/terms" className="text-primary hover:underline font-medium">
                Terms of Service
              </a>
              {' '}and{' '}
              <a href="/privacy" className="text-primary hover:underline font-medium">
                Privacy Policy
              </a>
            </span>
          </label>

          <div className="flex gap-3">
            <Button
              onClick={() => setStep(2)}
              variant="outline"
              className="flex-1"
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
            <Button
              onClick={handleDetailsSubmit}
              disabled={!formData.acceptTerms || isLoading}
              className="flex-1"
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          {onSkip && (
            <button
              onClick={handleSkip}
              className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Skip setup for now
            </button>
          )}
        </div>
      )}
    </div>
  )
}
