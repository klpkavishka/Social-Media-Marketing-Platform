'use client'

import React from 'react'
import { Chrome, Github, Apple } from 'lucide-react'

interface SocialLoginButtonsProps {
  isLoading?: boolean
  onSocialLogin?: (provider: 'google' | 'github' | 'microsoft') => void
}

export function SocialLoginButtons({ isLoading = false, onSocialLogin }: SocialLoginButtonsProps) {
  const providers = [
    {
      id: 'google',
      name: 'Google',
      icon: Chrome,
      color: 'hover:bg-red-50 dark:hover:bg-red-950/30',
      textColor: 'text-red-600 dark:text-red-400',
      borderColor: 'border-red-200 dark:border-red-900/30',
    },
    {
      id: 'github',
      name: 'GitHub',
      icon: Github,
      color: 'hover:bg-gray-100 dark:hover:bg-gray-900/30',
      textColor: 'text-gray-700 dark:text-gray-300',
      borderColor: 'border-gray-200 dark:border-gray-700',
    },
    {
      id: 'microsoft',
      name: 'Microsoft',
      icon: Apple,
      color: 'hover:bg-blue-50 dark:hover:bg-blue-950/30',
      textColor: 'text-blue-600 dark:text-blue-400',
      borderColor: 'border-blue-200 dark:border-blue-900/30',
    },
  ]

  const handleSocialLogin = (provider: string) => {
    if (onSocialLogin) {
      onSocialLogin(provider as 'google' | 'github' | 'microsoft')
    } else {
      // Default Auth0 social login redirect
      window.location.href = `/auth/login?connection=${provider}`
    }
  }

  return (
    <div className="space-y-3">
      <p className="text-center text-sm text-muted-foreground mb-4">Or continue with</p>
      <div className="grid grid-cols-3 gap-3">
        {providers.map((provider) => {
          const Icon = provider.icon
          return (
            <button
              key={provider.id}
              onClick={() => handleSocialLogin(provider.id)}
              disabled={isLoading}
              className={`flex items-center justify-center gap-2 rounded-lg border ${provider.borderColor} ${provider.color} px-4 py-2.5 text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
              title={`Sign in with ${provider.name}`}
            >
              <Icon className={`h-5 w-5 ${provider.textColor}`} />
              <span className="hidden sm:inline text-xs">{provider.name}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
