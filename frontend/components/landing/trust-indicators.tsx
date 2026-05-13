'use client'

import React from 'react'
import { TrendingUp, Users, Target } from 'lucide-react'

export function TrustIndicators() {
  const metrics = [
    {
      icon: Users,
      value: '50K+',
      label: 'Active Users',
      description: 'Trusted by marketers worldwide',
    },
    {
      icon: Target,
      value: '100K+',
      label: 'Posts Scheduled',
      description: 'Monthly content managed',
    },
    {
      icon: TrendingUp,
      value: '95%',
      label: 'Satisfaction Rate',
      description: 'Customer satisfaction score',
    },
  ]

  return (
    <section className="py-16 bg-gradient-to-b from-transparent via-violet-500/5 to-transparent">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {metrics.map((metric, index) => {
            const Icon = metric.icon
            return (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-gradient-to-br from-violet-500/20 to-blue-500/20">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gradient-primary mb-1">{metric.value}</h3>
                <p className="font-semibold text-foreground mb-2">{metric.label}</p>
                <p className="text-sm text-muted-foreground">{metric.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function CompaniesUsing() {
  const companies = ['Acme Corp', 'TechFlow', 'Digital Co', 'Marketing Pro', 'Social Sphere', 'Brand Hub']

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <p className="text-center text-sm text-muted-foreground font-semibold uppercase tracking-widest mb-8">
          Trusted by leading companies
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 items-center">
          {companies.map((company, index) => (
            <div
              key={index}
              className="flex items-center justify-center p-4 rounded-lg border border-border/30 bg-background/50 hover:border-primary/30 transition-colors"
            >
              <span className="text-sm font-medium text-muted-foreground">{company}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
