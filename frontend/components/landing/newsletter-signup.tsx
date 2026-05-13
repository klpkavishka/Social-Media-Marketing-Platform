'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Mail, CheckCircle } from 'lucide-react'

export function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real application, this would call an API endpoint
    if (email) {
      setSubmitted(true)
      setTimeout(() => {
        setEmail('')
        setSubmitted(false)
      }, 3000)
    }
  }

  return (
    <section className="py-16 bg-gradient-to-r from-violet-600/10 via-blue-600/10 to-cyan-600/10 border-y border-border/30">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold font-space-grotesk mb-4">
            Stay Ahead with <span className="text-gradient-primary">ArcFlow Updates</span>
          </h2>
          <p className="text-muted-foreground font-sora">
            Get tips, best practices, and new features delivered to your inbox monthly
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              required
            />
          </div>
          <Button
            type="submit"
            className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 font-semibold"
          >
            {submitted ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Subscribed
              </>
            ) : (
              'Subscribe'
            )}
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-4">
          We&apos;ll never share your email. Unsubscribe anytime.
        </p>
      </div>
    </section>
  )
}
