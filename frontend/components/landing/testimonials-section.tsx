'use client'

import React from 'react'
import { Star } from 'lucide-react'

export function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Marketing Director',
      company: 'TechFlow Agency',
      image: '👩‍💼',
      text: 'ArcFlow transformed how we manage client campaigns. Multi-client support and unified analytics saved us hours every week.',
      rating: 5,
      stat: '40% time savings',
    },
    {
      name: 'Marcus Chen',
      role: 'Social Media Manager',
      company: 'Brand Hub',
      image: '👨‍💼',
      text: 'The AI-powered content suggestions are incredible. Our engagement rates improved by 60% within the first month.',
      rating: 5,
      stat: '60% engagement increase',
    },
    {
      name: 'Emma Rodriguez',
      role: 'Content Lead',
      company: 'Digital Co',
      image: '👩‍🦱',
      text: 'Team collaboration features make it easy for our entire team to work together. The approval workflows are seamless.',
      rating: 5,
      stat: '15 team members',
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-space-grotesk mb-6">
            Loved by <span className="text-gradient-accent">Marketing Teams</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-sora">
            See how teams are using ArcFlow to amplify their social media strategy
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="rounded-lg border border-border/30 bg-background p-8 hover:border-primary/30 transition-all"
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-foreground mb-6 leading-relaxed italic">&quot;{testimonial.text}&quot;</p>

              {/* Author */}
              <div className="flex items-center gap-3 mb-4">
                <div className="text-3xl">{testimonial.image}</div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.company}</p>
                </div>
              </div>

              {/* Stat */}
              <div className="pt-4 border-t border-border">
                <p className="text-sm font-semibold text-primary">{testimonial.stat}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
