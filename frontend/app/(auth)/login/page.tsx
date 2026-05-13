'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { LogIn, Shield, Sparkles, ArrowRight, AlertCircle } from 'lucide-react'
import { useUser } from '@auth0/nextjs-auth0/client'
import { SocialLoginButtons } from '@/components/auth/social-login'

export default function LoginPage() {
  const router = useRouter()
  const { user, isLoading } = useUser()
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [rememberMe, setRememberMe] = useState(false)
  const searchParams = useSearchParams()
  const returnTo = searchParams.get('returnTo') || '/dashboard'

  // Check for Auth0 errors in URL
  useEffect(() => {
    const errorParam = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')

    if (errorParam) {
      let errorMessage = 'An error occurred during the authorization flow.'

      if (errorDescription) {
        errorMessage = decodeURIComponent(errorDescription)
      } else {
        // Map common Auth0 error codes to user-friendly messages
        switch (errorParam) {
          case 'access_denied':
            errorMessage = 'Access denied. Please check your Auth0 configuration.'
            break
          case 'unauthorized':
            errorMessage = 'Unauthorized. Please verify your credentials.'
            break
          case 'invalid_client':
            errorMessage = 'Invalid client configuration. Please contact support.'
            break
          case 'login_required':
            errorMessage = 'Login is required to access this application.'
            break
          default:
            errorMessage = `Authentication error: ${errorParam}`
        }
      }

      setError(errorMessage)
      console.error('Auth0 Error:', { error: errorParam, description: errorDescription })
    }
  }, [searchParams])

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!isLoading && user) {
      router.push('/dashboard')
    }
  }, [user, isLoading, router])

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-blue-200/70">Loading...</p>
        </div>
      </div>
    )
  }

  // Redirect in progress
  if (user) {
    return null
  }

  const handleLogin = () => {
    setIsRedirecting(true)
    // Using standard Next.js path for Auth0 handler
    window.location.href = `/auth/login?returnTo=${encodeURIComponent(returnTo)}`
  }

  return (
    <div className="w-full max-w-md">
      {/* Logo */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25">
          <Shield className="h-7 w-7 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
        <p className="mt-2 text-blue-200/70">Sign in to your account</p>
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 flex items-start gap-4 rounded-lg border border-red-500/30 bg-red-500/10 p-4 backdrop-blur-sm">
            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-400" />
            <div className="flex-1">
              <h3 className="mb-1 font-semibold text-red-200">Authentication Error</h3>
              <p className="text-sm text-red-200/70">{error}</p>
              <button
                onClick={() => setError(null)}
                className="mt-3 text-xs text-red-300 transition-colors hover:text-red-200"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        <div className="mb-8 space-y-3">
          {[
            { icon: Sparkles, text: 'AI-powered content generation' },
            { icon: LogIn, text: 'Secure authentication via Auth0' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 text-sm text-blue-100/60">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
                <item.icon className="h-4 w-4 text-blue-400" />
              </div>
              <span>{item.text}</span>
            </div>
          ))}
        </div>

        {/* Social Login */}
        <div className="mb-6">
          <SocialLoginButtons isLoading={isRedirecting} />
        </div>

        <button
          onClick={handleLogin}
          disabled={isRedirecting}
          className="group relative flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:from-blue-600 hover:to-indigo-700 hover:shadow-xl hover:shadow-blue-500/30 disabled:opacity-70"
        >
          {isRedirecting ? (
            <>
              <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Redirecting to Auth0...
            </>
          ) : (
            <>
              <LogIn className="h-5 w-5" />
              Sign In
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </>
          )}
        </button>

        {/* Remember Me Checkbox */}
        <label className="flex items-center gap-2 mt-4">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded border-white/20 cursor-pointer"
          />
          <span className="text-sm text-blue-200/70">Remember me for 30 days</span>
        </label>

        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs text-blue-200/40">New here?</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <Link
          href="/register"
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-medium text-blue-100 transition-all duration-300 hover:border-white/20 hover:bg-white/10"
        >
          Create an account
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <p className="mt-6 text-center text-xs text-blue-200/30">
        By signing in, you agree to our Terms of Service and Privacy Policy
      </p>
    </div>
  )
}
