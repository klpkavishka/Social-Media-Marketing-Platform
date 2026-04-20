'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { UserPlus, Zap, BarChart3, Users, ArrowRight, CheckCircle2 } from 'lucide-react'
import { useUser } from '@auth0/nextjs-auth0/client'

export default function RegisterPage() {
  const router = useRouter()
  const { user, isLoading } = useUser()
  const [isRedirecting, setIsRedirecting] = useState(false)

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
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
          <p className="text-blue-200/70">Loading...</p>
        </div>
      </div>
    )
  }

  // Redirect in progress
  if (user) {
    return null
  }

  const handleSignup = () => {
    setIsRedirecting(true)
    // Point directly to Auth0 signup flow via the middleware-mounted route
    window.location.href = '/auth/login?screen_hint=signup'
  }

  return (
    <div className="w-full max-w-md">
      {/* Logo */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25">
          <UserPlus className="h-7 w-7 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white">Get Started</h1>
        <p className="mt-2 text-blue-200/70">Create your UniSocial account today</p>
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
        <div className="mb-8 space-y-3">
          {[
            { icon: Zap, text: 'AI-powered content creation', color: 'text-yellow-400' },
            { icon: BarChart3, text: 'Advanced analytics & insights', color: 'text-emerald-400' },
            { icon: Users, text: 'Team collaboration tools', color: 'text-blue-400' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 text-sm text-blue-100/70">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5">
                <item.icon className={`h-4 w-4 ${item.color}`} />
              </div>
              <span>{item.text}</span>
              <CheckCircle2 className="ml-auto h-4 w-4 text-emerald-400/50" />
            </div>
          ))}
        </div>

        <button
          onClick={handleSignup}
          disabled={isRedirecting}
          className="group relative flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:from-indigo-600 hover:to-purple-700 hover:shadow-xl hover:shadow-indigo-500/30 disabled:opacity-70"
        >
          {isRedirecting ? (
            <>
              <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Redirecting to Auth0...
            </>
          ) : (
            <>
              <UserPlus className="h-5 w-5" />
              Create Account
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </>
          )}
        </button>

        <div className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-emerald-500/10 px-4 py-2">
          <Zap className="h-4 w-4 text-emerald-400" />
          <span className="text-xs font-medium text-emerald-300">Start your free trial — no credit card required</span>
        </div>

        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs text-blue-200/40">Already have an account?</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <Link
          href="/login"
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-medium text-blue-100 transition-all duration-300 hover:border-white/20 hover:bg-white/10"
        >
          Sign in instead
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <p className="mt-6 text-center text-xs text-blue-200/30">
        By creating an account, you agree to our Terms of Service and Privacy Policy
      </p>
    </div>
  )
}
