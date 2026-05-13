'use client'

import React, { useMemo } from 'react'
import { Check, X } from 'lucide-react'

interface PasswordStrengthIndicatorProps {
  password: string
  showCriteria?: boolean
}

export function PasswordStrengthIndicator({ password, showCriteria = true }: PasswordStrengthIndicatorProps) {
  const requirements = useMemo(() => [
    { label: 'At least 8 characters', met: password.length >= 8, regex: /.{8,}/ },
    { label: 'Contains uppercase letter', met: /[A-Z]/.test(password), regex: /[A-Z]/ },
    { label: 'Contains lowercase letter', met: /[a-z]/.test(password), regex: /[a-z]/ },
    { label: 'Contains a number', met: /\d/.test(password), regex: /\d/ },
    { label: 'Contains special character', met: /[!@#$%^&*()+=\-{}:;'"|,.<>/?]/.test(password), regex: /[!@#$%^&*()+=\-{}:;'"|,.<>/?]/ },
  ], [password])

  const strength = useMemo(() => {
    const metCount = requirements.filter((r) => r.met).length
    if (metCount === 0) return { level: 0, label: 'No password', color: 'bg-gray-300' }
    if (metCount <= 2) return { level: 1, label: 'Weak', color: 'bg-red-500' }
    if (metCount <= 3) return { level: 2, label: 'Fair', color: 'bg-yellow-500' }
    if (metCount <= 4) return { level: 3, label: 'Good', color: 'bg-blue-500' }
    return { level: 4, label: 'Strong', color: 'bg-green-500' }
  }, [requirements])

  if (!password) return null

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-muted-foreground">Password Strength</label>
        <span className={`text-xs font-semibold px-2 py-1 rounded ${strength.color.replace('bg-', 'text-')} bg-opacity-10`}>
          {strength.label}
        </span>
      </div>

      {/* Strength bar */}
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${strength.color} transition-all duration-300`}
          style={{ width: `${(strength.level + 1) * 20}%` }}
        />
      </div>

      {/* Criteria checklist */}
      {showCriteria && (
        <div className="space-y-1 pt-2">
          {requirements.map((req, index) => (
            <div key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
              {req.met ? (
                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
              ) : (
                <X className="h-4 w-4 text-gray-300 flex-shrink-0" />
              )}
              <span className={req.met ? 'text-green-600 dark:text-green-400' : ''}>{req.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
