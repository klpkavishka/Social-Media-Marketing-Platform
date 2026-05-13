'use client'

import React from 'react'
import { Users, Building2, Briefcase } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function IndustrySections() {
  const industries = [
    {
      icon: Briefcase,
      title: 'For Agencies',
      description: 'Manage multiple clients and campaigns from one unified dashboard. Perfect for agencies handling diverse social media strategies.',
      benefits: ['Multi-client management', 'Unified reporting', 'Team collaboration', 'White-label options'],
      gradient: 'from-violet-600 to-purple-600',
    },
    {
      icon: Building2,
      title: 'For Brands',
      description: 'Build and manage your brand presence across all platforms. Consistent messaging and professional analytics.',
      benefits: ['Brand consistency', 'Advanced analytics', 'Content calendar', 'Audience insights'],
      gradient: 'from-blue-600 to-cyan-600',
    },
    {
      icon: Users,
      title: 'For Teams',
      description: 'Collaborate seamlessly with your marketing team. Real-time workflows and approval processes.',
      benefits: ['Team workflows', 'Approval systems', 'Role-based access', 'Activity tracking'],
      gradient: 'from-cyan-600 to-teal-600',
    },
  ]

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-space-grotesk mb-6">
            Built for <span className="text-gradient-primary">Every Team</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-sora">
            Whether you&apos;re an agency managing multiple clients, a brand building presence, or a team collaborating on campaigns
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {industries.map((industry, index) => {
            const Icon = industry.icon
            return (
              <div
                key={index}
                className="relative group rounded-lg overflow-hidden border border-border/30 bg-background hover:border-primary/50 transition-all duration-300"
              >
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${industry.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                {/* Content */}
                <div className="relative p-8">
                  <div className="mb-4 p-3 w-fit rounded-lg bg-gradient-to-br from-violet-500/20 to-blue-500/20">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>

                  <h3 className="text-2xl font-bold font-space-grotesk mb-3">{industry.title}</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">{industry.description}</p>

                  <div className="space-y-2 mb-8">
                    {industry.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                        <span className="text-sm text-foreground/80">{benefit}</span>
                      </div>
                    ))}
                  </div>

                  <Button variant="outline" className="w-full group/btn">
                    Learn more
                    <span className="ml-2 group-hover/btn:translate-x-1 transition-transform">→</span>
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
