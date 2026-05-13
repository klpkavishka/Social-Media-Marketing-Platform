'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export function CTASection() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 via-blue-600/10 to-cyan-600/10" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-space-grotesk mb-6">
            Ready to Transform Your <span className="text-gradient-primary">Social Media</span>?
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground font-sora mb-8 leading-relaxed">
            Join thousands of teams already using ArcFlow to save time, increase engagement, and grow their presence across all social platforms.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="gap-2 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 font-semibold">
                Start Free Trial <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="#faq">
              <Button size="lg" variant="outline" className="font-semibold">
                Learn More
              </Button>
            </Link>
          </div>

          <p className="text-sm text-muted-foreground mt-8">
            ✨ 14-day free trial • No credit card required • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  )
}
