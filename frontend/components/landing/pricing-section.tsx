'use client'

import React from 'react'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function PricingSection() {
  const plans = [
    {
      name: 'Starter',
      price: '$29',
      period: 'per month',
      description: 'Perfect for individuals and small teams',
      features: [
        'Up to 3 social accounts',
        '30 scheduled posts per month',
        'Basic analytics',
        'Community support',
        'Monthly reports',
      ],
      highlighted: false,
    },
    {
      name: 'Professional',
      price: '$99',
      period: 'per month',
      description: 'Ideal for growing agencies and brands',
      features: [
        'Unlimited social accounts',
        'Unlimited scheduled posts',
        'Advanced analytics & insights',
        'Priority email support',
        'Custom reports',
        'Team collaboration (up to 5)',
        'Content calendar',
        'Bulk scheduling',
      ],
      highlighted: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'contact us',
      description: 'For large organizations with advanced needs',
      features: [
        'Everything in Professional',
        'Unlimited team members',
        'Dedicated account manager',
        'API access',
        'Custom integrations',
        '24/7 phone support',
        'Advanced security',
        'Custom training',
      ],
      highlighted: false,
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-space-grotesk mb-6">
            Simple, Transparent <span className="text-gradient-secondary">Pricing</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-sora">
            Choose the perfect plan for your needs. Always flexible to scale as you grow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`rounded-lg border transition-all duration-300 p-8 flex flex-col ${
                plan.highlighted
                  ? 'border-primary/50 bg-gradient-to-b from-primary/5 to-transparent shadow-lg scale-105'
                  : 'border-border/30 bg-background hover:border-border/50'
              }`}
            >
              {plan.highlighted && (
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 text-white text-xs font-semibold">
                    MOST POPULAR
                  </span>
                </div>
              )}

              <h3 className="text-2xl font-bold font-space-grotesk mb-2">{plan.name}</h3>
              <p className="text-muted-foreground text-sm mb-6">{plan.description}</p>

              <div className="mb-6">
                <div className="text-4xl font-bold">{plan.price}</div>
                <div className="text-sm text-muted-foreground">{plan.period}</div>
              </div>

              <Button
                className={`w-full mb-8 font-semibold ${
                  plan.highlighted
                    ? 'bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700'
                    : ''
                }`}
                variant={plan.highlighted ? 'default' : 'outline'}
              >
                Get started
              </Button>

              <div className="space-y-4 flex-1">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-foreground/80">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">All plans include a 14-day free trial. No credit card required.</p>
          <Button variant="outline">View detailed comparison</Button>
        </div>
      </div>
    </section>
  )
}
