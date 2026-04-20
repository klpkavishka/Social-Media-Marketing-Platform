'use client'

import { useUser } from '@auth0/nextjs-auth0/client'
import { useQueryClient } from '@tanstack/react-query'

export function useAuth() {
  const { user, error, isLoading } = useUser()
  const queryClient = useQueryClient()

  const login = (returnTo?: string) => {
    const url = returnTo
      ? `/auth/login?returnTo=${encodeURIComponent(returnTo)}`
      : '/auth/login'
    window.location.href = url
  }

  const signup = () => {
    window.location.href = '/auth/login?screen_hint=signup'
  }

  const logout = () => {
    queryClient.clear()
    window.location.href = '/auth/logout'
  }

  return {
    user: user
      ? {
          id: user.sub || '',
          email: user.email || '',
          firstName: (user.given_name as string || user.name?.split(' ')[0]) || '',
          lastName: (user.family_name as string || user.name?.split(' ').slice(1).join(' ')) || '',
          name: user.name || '',
          avatarUrl: user.picture || '',
          role: (user['https://unisocial.com/roles'] as string) || 'viewer',
          status: 'active',
        }
      : null,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    signup,
    logout,
  }
}
