'use client'

import React, { useState, useEffect } from 'react'
import { Mail, CheckCircle2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EmailVerificationFlowProps {
  email: string
  onVerified?: () => void
  onSkip?: () => void
}

export function EmailVerificationFlow({ email, onVerified, onSkip }: EmailVerificationFlowProps) {
  const [step, setStep] = useState<'sending' | 'waiting' | 'verified' | 'resend'>('sending')
  const [resendCount, setResendCount] = useState(0)
  const [timer, setTimer] = useState(0)

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((t) => t - 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [timer])

  const handleResendEmail = () => {
    setResendCount((c) => c + 1)
    setTimer(60)
    setStep('sending')
    // Simulate sending
    setTimeout(() => setStep('waiting'), 2000)
  }

  const handleVerified = () => {
    setStep('verified')
    setTimeout(() => {
      if (onVerified) onVerified()
    }, 2000)
  }

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Verification graphic */}
      <div className="flex justify-center">
        <div className="relative h-20 w-20">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Mail className="h-10 w-10 text-primary" />
          </div>
        </div>
      </div>

      {/* Content */}
      {step === 'sending' && (
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Sending verification email...</h2>
          <p className="text-muted-foreground">We&apos;re sending a verification link to<br /><span className="font-semibold text-foreground">{email}</span></p>
          <div className="flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        </div>
      )}

      {step === 'waiting' && (
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Check your email</h2>
          <p className="text-muted-foreground">We&apos;ve sent a verification link to<br /><span className="font-semibold text-foreground">{email}</span></p>
          <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Check your spam folder if you don&apos;t see the email in a few minutes.
              </p>
            </div>
          </div>

          <div className="space-y-2 pt-4">
            <Button
              onClick={handleVerified}
              className="w-full"
            >
              I&apos;ve verified my email <CheckCircle2 className="h-4 w-4 ml-2" />
            </Button>

            {onSkip && (
              <Button
                onClick={onSkip}
                variant="outline"
                className="w-full"
              >
                Skip for now
              </Button>
            )}
          </div>

          {resendCount < 3 && (
            <div className="pt-2">
              <button
                onClick={handleResendEmail}
                disabled={timer > 0}
                className="text-sm text-primary hover:underline disabled:text-muted-foreground disabled:no-underline transition-colors"
              >
                {timer > 0 ? `Resend email in ${timer}s` : 'Didn&apos;t get the email? Resend'}
              </button>
            </div>
          )}
        </div>
      )}

      {step === 'verified' && (
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <CheckCircle2 className="h-12 w-12 text-green-500 animate-bounce" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Email verified!</h2>
          <p className="text-muted-foreground">Your email has been verified successfully.</p>
          <div className="flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-500 border-t-transparent" />
          </div>
          <p className="text-xs text-muted-foreground">Redirecting to dashboard...</p>
        </div>
      )}
    </div>
  )
}
